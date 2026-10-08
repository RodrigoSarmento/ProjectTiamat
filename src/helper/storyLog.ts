import { getCharacter } from '@data/story';

import type { IStoryPage } from './storyPlayback';
import { translate } from './translate';

export const STORY_LOG_LIMIT = 20;

export type IStoryLogEntry = {
  key: string;
  nodeId: string;
  speaker?: string;
  title?: string;
  text: string;
};

export const toStoryLogEntry = (
  page: IStoryPage,
  nodeId: string,
  pageIndex: number,
): IStoryLogEntry => ({
  key: `${nodeId}:${pageIndex}`,
  nodeId,
  speaker:
    page.kind === 'dialogue'
      ? translate(getCharacter(page.characterId).name)
      : undefined,
  title: page.kind === 'narrator' ? page.title : undefined,
  text: page.text,
});

export const appendStoryLog = (
  log: IStoryLogEntry[],
  entry: IStoryLogEntry,
  limit = STORY_LOG_LIMIT,
): IStoryLogEntry[] => {
  if (log[log.length - 1]?.key === entry.key) {
    return log;
  }
  return [...log, entry].slice(-limit);
};
