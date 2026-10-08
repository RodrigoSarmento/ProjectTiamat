import { useEffect, useMemo, useState } from 'react';

import {
  type IStoryBackground,
  type IStoryChapter,
  type IStoryNode,
  type StoryFlag,
  type StoryNodeId,
} from '@data/story';
import {
  type IStoryLogEntry,
  appendStoryLog,
  toStoryLogEntry,
} from '@helper/storyLog';
import {
  type IPresentedStoryChoice,
  type IStoryPage,
  applyBackground,
  getPassagePages,
  nodeBackground,
  passageOpensWithChoices,
  resolveStoryDiceRoll,
  shouldSkipPassageText,
  splitConsequences,
  visibleChoices,
  withFlagConsequences,
} from '@helper/storyPlayback';
import { useSound } from '@hooks/use-sound';
import {
  type IStoryProgress,
  applyTemporaryStatus,
  saveProgress,
  setCurrentBackground,
} from '@redux/slices/SavesSlice';
import type { RootState } from '@redux/store';
import { useDispatch, useSelector, useStore } from 'react-redux';

import {
  DIALOGUE_CHARS_PER_LINE,
  DIALOGUE_MAX_LINES,
  NARRATOR_CHARS_PER_LINE,
  NARRATOR_MAX_LINES,
} from './Game.constants';

const getNodePages = (node: IStoryNode | undefined) =>
  node?.type === 'passage'
    ? getPassagePages(
        node,
        NARRATOR_MAX_LINES,
        NARRATOR_CHARS_PER_LINE,
        DIALOGUE_MAX_LINES,
        DIALOGUE_CHARS_PER_LINE,
      )
    : [];

const initialStoryLog = (
  chapter: IStoryChapter,
  nodeId: StoryNodeId,
): IStoryLogEntry[] => {
  const firstPage = getNodePages(chapter.nodes[nodeId])[0];
  return firstPage ? [toStoryLogEntry(firstPage, nodeId, 0)] : [];
};

const logBefore = (
  chapter: IStoryChapter,
  log: IStoryLogEntry[],
  nodeId: StoryNodeId,
) => {
  let end = log.length;
  while (
    end > 0 &&
    (log[end - 1].nodeId === nodeId || !chapter.nodes[log[end - 1].nodeId])
  ) {
    end -= 1;
  }
  return log.slice(0, end);
};

const resumeProgress = (
  chapter: IStoryChapter,
  saved: IStoryProgress | undefined,
): IStoryProgress => {
  const savedLog = saved?.storyLog ?? [];
  const nodeId =
    saved && chapter.nodes[saved.nodeId]
      ? saved.nodeId
      : [...savedLog].reverse().find((entry) => chapter.nodes[entry.nodeId])
          ?.nodeId;

  if (!saved || !nodeId) {
    return {
      nodeId: chapter.entry,
      flags: [],
      usedChoiceIds: [],
      storyLog: initialStoryLog(chapter, chapter.entry),
    };
  }

  const history = logBefore(chapter, savedLog, nodeId);
  const [firstPage] = initialStoryLog(chapter, nodeId);
  return {
    ...saved,
    nodeId,
    storyLog: firstPage ? appendStoryLog(history, firstPage) : history,
  };
};

export const useStoryGame = (chapter: IStoryChapter) => {
  const dispatch = useDispatch();
  const savedBackground = useSelector(
    (state: RootState) => state.saves.save.currentBackground,
  );
  const status = useSelector((state: RootState) => state.saves.save.status);
  const temporaryStatus = useSelector(
    (state: RootState) => state.saves.save.temporaryStatus,
  );
  const hasCreatedCharacter = useSelector(
    (state: RootState) => state.saves.hasCreatedCharacter,
  );
  const store = useStore<RootState>();
  const [start] = useState(() =>
    resumeProgress(chapter, store.getState().saves.save.progress),
  );
  const [nodeId, setNodeId] = useState(start.nodeId);
  const [pageIndex, setPageIndex] = useState(0);
  const [isChoicesOpen, setIsChoicesOpen] = useState(() =>
    passageOpensWithChoices(chapter.nodes[start.nodeId]),
  );
  const [flags, setFlags] = useState<StoryFlag[]>(start.flags);
  const [usedChoiceIds, setUsedChoiceIds] = useState<string[]>(
    start.usedChoiceIds,
  );
  const [pendingDiceChoice, setPendingDiceChoice] = useState<
    IPresentedStoryChoice | undefined
  >(undefined);
  const [storyLog, setStoryLog] = useState<IStoryLogEntry[]>(start.storyLog);
  const [currentBackground, setBackground] = useState<IStoryBackground>(() =>
    applyBackground(
      savedBackground ?? {},
      nodeBackground(chapter.nodes[start.nodeId]),
    ),
  );

  useEffect(() => {
    dispatch(setCurrentBackground(currentBackground));
  }, [currentBackground, dispatch]);

  useEffect(() => {
    const saved = store.getState().saves.save.progress;
    if (
      saved?.nodeId === nodeId &&
      saved.flags === flags &&
      saved.usedChoiceIds === usedChoiceIds &&
      saved.storyLog === storyLog
    ) {
      return;
    }
    dispatch(saveProgress({ nodeId, flags, usedChoiceIds, storyLog }));
  }, [nodeId, flags, usedChoiceIds, storyLog, dispatch, store]);

  const node = chapter.nodes[nodeId];
  const passage = node?.type === 'passage' ? node : undefined;
  const { playSound } = useSound();
  const passageSoundFile = passage?.soundFile;
  const pages = useMemo(() => getNodePages(node), [node]);
  const page = pages[pageIndex];
  const pageSoundFile = page?.soundFile;

  useEffect(() => {
    if (passageSoundFile) {
      playSound(passageSoundFile);
    }
  }, [nodeId, passageSoundFile, playSound]);

  useEffect(() => {
    if (pageSoundFile) {
      playSound(pageSoundFile);
    }
  }, [nodeId, pageIndex, pageSoundFile, playSound]);

  const availableChoices = useMemo(
    () => visibleChoices(passage?.choices, flags, usedChoiceIds),
    [passage, flags, usedChoiceIds],
  );

  const recordPage = (
    nextPage: IStoryPage | undefined,
    nextNodeId: StoryNodeId,
    nextPageIndex: number,
  ) => {
    if (!nextPage) {
      return;
    }
    setStoryLog((current) =>
      appendStoryLog(
        current,
        toStoryLogEntry(nextPage, nextNodeId, nextPageIndex),
      ),
    );
  };

  const goToNode = (nextId: StoryNodeId, skipText = false) => {
    const nextNode = chapter.nodes[nextId];
    const nextPages = getNodePages(nextNode);
    const skipToChoices = shouldSkipPassageText(nextNode, skipText);

    setPendingDiceChoice(undefined);
    setNodeId(nextId);
    setBackground((current) =>
      applyBackground(current, nodeBackground(nextNode)),
    );

    if (skipToChoices) {
      setPageIndex(Math.max(0, nextPages.length - 1));
      setIsChoicesOpen(true);
      return;
    }

    setPageIndex(0);
    setIsChoicesOpen(passageOpensWithChoices(nextNode));
    recordPage(nextPages[0], nextId, 0);
  };

  const applyOutcome = (
    choiceId: string,
    consequences: IPresentedStoryChoice['consequences'],
    next: StoryNodeId | undefined,
    consume: boolean,
  ) => {
    const { flags: extraFlags, temporaryStatus } =
      splitConsequences(consequences);
    setFlags((current) => withFlagConsequences(current, extraFlags));
    if (consume) {
      setUsedChoiceIds((current) =>
        current.includes(choiceId) ? current : [...current, choiceId],
      );
    }
    if (Object.keys(temporaryStatus).length > 0) {
      dispatch(applyTemporaryStatus(temporaryStatus));
    }
    if (next) {
      goToNode(next);
    }
  };

  const advance = () => {
    if (isChoicesOpen || pendingDiceChoice) {
      return false;
    }
    if (pageIndex < pages.length - 1) {
      const nextIndex = pageIndex + 1;
      setPageIndex(nextIndex);
      recordPage(pages[nextIndex], nodeId, nextIndex);
      return false;
    }
    if (availableChoices.length > 0) {
      setIsChoicesOpen(true);
      return false;
    }
    if (passage?.startCharCreation && !hasCreatedCharacter) {
      return true;
    }
    if (passage?.next) {
      goToNode(passage.next, Boolean(passage.skipNextText));
    }
    return false;
  };

  const selectChoice = (choice: IPresentedStoryChoice) => {
    if (choice.disabled) {
      return;
    }
    if (choice.soundFile) {
      playSound(choice.soundFile);
    }
    if (choice.rollDice) {
      setPendingDiceChoice(choice);
      setIsChoicesOpen(false);
      return;
    }
    applyOutcome(
      choice.id,
      choice.consequences,
      choice.next,
      Boolean(choice.once || choice.optional || !choice.next),
    );
  };

  const isDiceSuccess = (face: number) => {
    if (!pendingDiceChoice?.rollDice) {
      return false;
    }
    return resolveStoryDiceRoll(
      pendingDiceChoice.rollDice,
      face,
      status,
      temporaryStatus,
    ).passed;
  };

  const completeDiceRoll = (face: number, forcedPassed?: boolean) => {
    if (!pendingDiceChoice?.rollDice) {
      return;
    }
    const resolved = resolveStoryDiceRoll(
      pendingDiceChoice.rollDice,
      face,
      status,
      temporaryStatus,
    );
    const passed = forcedPassed ?? resolved.passed;
    const outcome = passed
      ? pendingDiceChoice.rollDice.success
      : pendingDiceChoice.rollDice.failure;
    const choiceId = pendingDiceChoice.id;
    setPendingDiceChoice(undefined);
    applyOutcome(choiceId, outcome.consequences, outcome.next, true);
  };

  return {
    page,
    storyLog,
    choices: availableChoices,
    isChoicesOpen,
    pendingDiceChoice,
    currentBackground,
    nodeIds: Object.keys(chapter.nodes),
    currentNodeId: nodeId,
    advance,
    selectChoice,
    completeDiceRoll,
    isDiceSuccess,
    goToNode,
  };
};
