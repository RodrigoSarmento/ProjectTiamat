import type { StoryBackgroundImageId } from './backgrounds';
import type { CharacterId } from './characters';
import type { StoryFlag } from './flags';

export type StoryNodeId = string;

export type PortraitPosition = 'left' | 'right';

export interface IStoryLine {
  text: string;
  characterId?: CharacterId;
  portraitPosition?: PortraitPosition;
}

export type IStoryTemporaryStatusDelta = {
  [K in AttributeId]: Pick<IStatus, K> & Partial<IStatus>;
}[AttributeId];

export type IStoryFlagConsequence = {
  type: 'flag';
  value: StoryFlag;
};

export type IStoryTemporaryStatusConsequence = {
  type: 'temporaryStatus';
  value: IStoryTemporaryStatusDelta;
};

export type IStoryConsequence =
  IStoryFlagConsequence | IStoryTemporaryStatusConsequence;

export interface IStoryDiceOutcome {
  next?: StoryNodeId;
  consequences?: IStoryConsequence[];
}

export interface IStoryDiceRoll {
  attribute: AttributeId;
  minToPass: number;
  success: IStoryDiceOutcome;
  failure: IStoryDiceOutcome;
}

export interface IStoryChoice {
  id: string;
  label: string;
  next?: StoryNodeId;
  requires?: StoryFlag[];
  consequences?: IStoryConsequence[];
  once?: boolean;
  isQuickChoice?: boolean;
  rollDice?: IStoryDiceRoll;
}

export interface IStoryBackground {
  backgroundColor?: string;
  backgroundImage?: StoryBackgroundImageId;
}

export interface IStoryPassageNode {
  type: 'passage';
  title?: string;
  backgroundColor?: string;
  backgroundImage?: StoryBackgroundImageId;
  text?: string;
  characterId?: CharacterId;
  startCharCreation?: boolean;
  portraitPosition?: PortraitPosition;
  lines?: IStoryLine[];
  next?: StoryNodeId;
  choices?: IStoryChoice[];
}

export interface IStoryEndTrechoNode {
  type: 'endTrecho';
  nextChapter: string;
}

export type IStoryNode = IStoryPassageNode | IStoryEndTrechoNode;

export interface IStoryChapter {
  id: string;
  entry: StoryNodeId;
  title?: string;
  nodes: Record<StoryNodeId, IStoryNode>;
}

export interface IStoryChapterRef {
  id: string;
  file: string;
  entry: StoryNodeId;
}

export interface IStoryIndex {
  chapters: IStoryChapterRef[];
}
