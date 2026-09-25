export { prologueChapter } from './chapters/prologue';

export { CHARACTERS, CharacterId, getCharacter } from './characters';
export type { IStoryCharacter } from './characters';
export { StoryFlag } from './flags';
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
  PortraitPosition,
  StoryNodeId,
} from './Story.types';
