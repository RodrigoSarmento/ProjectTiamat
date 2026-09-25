import type {
  IStoryBackground,
  IStoryChoice,
  IStoryConsequence,
  IStoryLine,
  IStoryNode,
  IStoryPassageNode,
  CharacterId,
  PortraitPosition,
  StoryFlag,
} from '@data/story';

import { paginateText } from './paginateText';

export type IStoryNarratorPage = {
  kind: 'narrator';
  text: string;
  title?: string;
};

export type IStoryDialoguePage = {
  kind: 'dialogue';
  characterId: CharacterId;
  text: string;
  portraitPosition: PortraitPosition;
};

export type IStoryPage = IStoryNarratorPage | IStoryDialoguePage;

export const getPassagePages = (
  node: IStoryPassageNode,
  narratorMaxLines: number,
  narratorCharsPerLine: number,
  dialogueMaxLines: number,
  dialogueCharsPerLine: number,
): IStoryPage[] => {
  const beats = getPassageBeats(node);

  return beats.flatMap((beat) => {
    const isDialogue = Boolean(beat.characterId);
    const pages = paginateText(
      beat.text,
      isDialogue ? dialogueMaxLines : narratorMaxLines,
      isDialogue ? dialogueCharsPerLine : narratorCharsPerLine,
    );

    return pages.map((text) =>
      beat.characterId
        ? {
            kind: 'dialogue' as const,
            characterId: beat.characterId,
            text,
            portraitPosition:
              beat.portraitPosition ?? node.portraitPosition ?? 'right',
          }
        : {
            kind: 'narrator' as const,
            text,
            title: node.title,
          },
    );
  });
};

export const getPassageBeats = (node: IStoryPassageNode): IStoryLine[] => {
  if (node.lines?.length) {
    return node.lines;
  }
  if (node.text) {
    return [
      {
        text: node.text,
        characterId: node.characterId,
        portraitPosition: node.portraitPosition,
      },
    ];
  }
  return [];
};

export const nodeBackground = (
  node?: IStoryNode,
): IStoryBackground | undefined => {
  if (node?.type !== 'passage') {
    return undefined;
  }
  const { backgroundColor, backgroundImage } = node;
  if (backgroundColor == null && backgroundImage == null) {
    return undefined;
  }
  return { backgroundColor, backgroundImage };
};

export const applyBackground = (
  current: IStoryBackground,
  update?: IStoryBackground,
): IStoryBackground => {
  if (
    !update ||
    (update.backgroundColor == null && update.backgroundImage == null)
  ) {
    return current;
  }

  return {
    ...(update.backgroundColor != null && {
      backgroundColor: update.backgroundColor,
    }),
    ...(update.backgroundImage != null && {
      backgroundImage: update.backgroundImage,
    }),
  };
};

export const passageOpensWithChoices = (node: IStoryNode | undefined) =>
  Boolean(
    node?.type === 'passage' &&
    getPassageBeats(node).length === 0 &&
    (node.choices?.length ?? 0) > 0,
  );

export const isChoiceAvailable = (choice: IStoryChoice, flags: StoryFlag[]) =>
  (choice.requires ?? []).every((flag) => flags.includes(flag));

export type IPresentedStoryChoice = IStoryChoice & { disabled: boolean };

export const isQuickChoicePrompt = (choices: IPresentedStoryChoice[]) =>
  choices.length > 0 && choices.every((choice) => choice.isQuickChoice);

export const visibleChoices = (
  choices: IStoryChoice[] | undefined,
  flags: StoryFlag[],
  usedChoiceIds: string[],
): IPresentedStoryChoice[] =>
  (choices ?? []).flatMap((choice) => {
    if (!isChoiceAvailable(choice, flags)) {
      return [];
    }
    const used = usedChoiceIds.includes(choice.id);
    if (used && !choice.once) {
      return [];
    }
    return [{ ...choice, disabled: used && Boolean(choice.once) }];
  });

const addTemporaryStatusDelta = (
  current: Partial<IStatus>,
  delta: Partial<IStatus>,
): Partial<IStatus> => {
  const next = { ...current };
  (Object.keys(delta) as AttributeId[]).forEach((attribute) => {
    const amount = delta[attribute];
    if (amount == null) {
      return;
    }
    next[attribute] = (next[attribute] ?? 0) + amount;
  });
  return next;
};

export const splitConsequences = (consequences?: IStoryConsequence[]) => {
  const flags: StoryFlag[] = [];
  let temporaryStatus: Partial<IStatus> = {};

  for (const consequence of consequences ?? []) {
    switch (consequence.type) {
      case 'flag':
        flags.push(consequence.value);
        break;
      case 'temporaryStatus':
        temporaryStatus = addTemporaryStatusDelta(
          temporaryStatus,
          consequence.value,
        );
        break;
      default: {
        const _exhaustive: never = consequence;
        return _exhaustive;
      }
    }
  }

  return { flags, temporaryStatus };
};

export const withFlagConsequences = (
  flags: StoryFlag[],
  extraFlags: StoryFlag[],
): StoryFlag[] => {
  if (!extraFlags.length) {
    return flags;
  }
  return [...new Set([...flags, ...extraFlags])];
};
