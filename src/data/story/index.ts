import type { IStoryChapter } from './Story.types';
import prologueJson from './chapters/prologue.json';

export const prologueChapter = prologueJson as IStoryChapter;

export { CHARACTERS, getCharacter } from './characters';
export type { IStoryCharacter } from './characters';
export {
  STORY_BACKGROUND_IMAGES,
  getStoryBackgroundImage,
} from './backgrounds';
export type { StoryBackgroundImageId } from './backgrounds';
export type {
  IStoryBackground,
  IStoryChapter,
  IStoryChapterRef,
  IStoryChoice,
  IStoryConsequence,
  IStoryEndTrechoNode,
  IStoryFlagConsequence,
  IStoryIndex,
  IStoryLine,
  IStoryNode,
  IStoryPassageNode,
  IStoryTemporaryStatusConsequence,
  IStoryTemporaryStatusDelta,
  StoryNodeId,
} from './Story.types';
