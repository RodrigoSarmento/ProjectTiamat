export type StoryNodeId = string;

export interface IStoryLine {
  text: string;
  characterId?: string;
}

export type IStoryTemporaryStatusDelta = {
  [K in AttributeId]: Pick<IStatus, K> & Partial<IStatus>;
}[AttributeId];

export type IStoryFlagConsequence = {
  type: 'flag';
  value: string;
};

export type IStoryTemporaryStatusConsequence = {
  type: 'temporaryStatus';
  value: IStoryTemporaryStatusDelta;
};

export type IStoryConsequence =
  | IStoryFlagConsequence
  | IStoryTemporaryStatusConsequence;

export interface IStoryChoice {
  id: string;
  label: string;
  next?: StoryNodeId;
  requires?: string[];
  consequences?: IStoryConsequence[];
  once?: boolean;
}

export interface IStoryBackground {
  backgroundColor?: string;
  backgroundImage?: string;
}

export interface IStoryPassageNode {
  type: 'passage';
  title?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  text?: string;
  characterId?: string;
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
