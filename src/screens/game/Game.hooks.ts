import { useEffect, useMemo, useState } from 'react';

import type { IStoryBackground, IStoryChapter, StoryNodeId } from '@data/story';
import {
  applyBackground,
  getPassagePages,
  nodeBackground,
  passageOpensWithChoices,
  splitConsequences,
  visibleChoices,
  withFlagConsequences,
  type IPresentedStoryChoice,
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
    (state: RootState) => state.saves.save?.currentBackground,
  );
  const [nodeId, setNodeId] = useState(chapter.entry);
  const [pageIndex, setPageIndex] = useState(0);
  const [isChoicesOpen, setIsChoicesOpen] = useState(() =>
    passageOpensWithChoices(chapter.nodes[chapter.entry]),
  );
  const [flags, setFlags] = useState<string[]>([]);
  const [usedChoiceIds, setUsedChoiceIds] = useState<string[]>([]);
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
    setNodeId(nextId);
    setPageIndex(0);
    setIsChoicesOpen(passageOpensWithChoices(nextNode));
    setBackground((current) => applyBackground(current, nodeBackground(nextNode)));
  };

  const advance = () => {
    if (isChoicesOpen) {
      return;
    }
    if (pageIndex < pages.length - 1) {
      setPageIndex((current) => current + 1);
      return;
    }
    if (availableChoices.length > 0) {
      setIsChoicesOpen(true);
      return;
    }
    if (passage?.next) {
      goToNode(passage.next);
    }
  };

  const closeChoices = () => {
    setIsChoicesOpen(false);
  };

  const selectChoice = (choice: IPresentedStoryChoice) => {
    if (choice.disabled) {
      return;
    }
    const { flags: extraFlags, temporaryStatus } = splitConsequences(
      choice.consequences,
    );
    setFlags((current) => withFlagConsequences(current, extraFlags));
    if (choice.once || !choice.next) {
      setUsedChoiceIds((current) => [...current, choice.id]);
    }
    if (Object.keys(temporaryStatus).length > 0) {
      dispatch(applyTemporaryStatus(temporaryStatus));
    }
    if (choice.next) {
      goToNode(choice.next);
    }
  };

  return {
    page: pages[pageIndex],
    choices: availableChoices,
    isChoicesOpen,
    currentBackground,
    advance,
    closeChoices,
    selectChoice,
  };
};
