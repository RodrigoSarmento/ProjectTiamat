import { useEffect, useMemo, useState } from 'react';

import type {
  IStoryBackground,
  IStoryChapter,
  StoryFlag,
  StoryNodeId,
} from '@data/story';
import {
  type IPresentedStoryChoice,
  applyBackground,
  getPassagePages,
  nodeBackground,
  passageOpensWithChoices,
  resolveStoryDiceRoll,
  splitConsequences,
  visibleChoices,
  withFlagConsequences,
} from '@helper/storyPlayback';
import {
  applyTemporaryStatus,
  setCurrentBackground,
} from '@redux/slices/SavesSlice';
import type { RootState } from '@redux/store';
import { useDispatch, useSelector } from 'react-redux';

import {
  DIALOGUE_CHARS_PER_LINE,
  DIALOGUE_MAX_LINES,
  NARRATOR_CHARS_PER_LINE,
  NARRATOR_MAX_LINES,
} from './Game.constants';

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
  const [nodeId, setNodeId] = useState(chapter.entry);
  const [pageIndex, setPageIndex] = useState(0);
  const [isChoicesOpen, setIsChoicesOpen] = useState(() =>
    passageOpensWithChoices(chapter.nodes[chapter.entry]),
  );
  const [flags, setFlags] = useState<StoryFlag[]>([]);
  const [usedChoiceIds, setUsedChoiceIds] = useState<string[]>([]);
  const [pendingDiceChoice, setPendingDiceChoice] = useState<
    IPresentedStoryChoice | undefined
  >(undefined);
  const [currentBackground, setBackground] = useState<IStoryBackground>(() =>
    applyBackground(
      savedBackground ?? {},
      nodeBackground(chapter.nodes[chapter.entry]),
    ),
  );

  useEffect(() => {
    dispatch(setCurrentBackground(currentBackground));
  }, [currentBackground, dispatch]);

  const node = chapter.nodes[nodeId];
  const passage = node?.type === 'passage' ? node : undefined;

  const pages = useMemo(
    () =>
      passage
        ? getPassagePages(
            passage,
            NARRATOR_MAX_LINES,
            NARRATOR_CHARS_PER_LINE,
            DIALOGUE_MAX_LINES,
            DIALOGUE_CHARS_PER_LINE,
          )
        : [],
    [passage],
  );

  const availableChoices = useMemo(
    () => visibleChoices(passage?.choices, flags, usedChoiceIds),
    [passage, flags, usedChoiceIds],
  );

  const goToNode = (nextId: StoryNodeId) => {
    const nextNode = chapter.nodes[nextId];
    setPendingDiceChoice(undefined);
    setNodeId(nextId);
    setPageIndex(0);
    setIsChoicesOpen(passageOpensWithChoices(nextNode));
    setBackground((current) =>
      applyBackground(current, nodeBackground(nextNode)),
    );
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
      setPageIndex((current) => current + 1);
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
      goToNode(passage.next);
    }
    return false;
  };

  const closeChoices = () => {
    setIsChoicesOpen(false);
  };

  const selectChoice = (choice: IPresentedStoryChoice) => {
    if (choice.disabled) {
      return;
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
      Boolean(choice.once || !choice.next),
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
    page: pages[pageIndex],
    choices: availableChoices,
    isChoicesOpen,
    pendingDiceChoice,
    currentBackground,
    nodeIds: Object.keys(chapter.nodes),
    advance,
    closeChoices,
    selectChoice,
    completeDiceRoll,
    isDiceSuccess,
    goToNode,
  };
};
