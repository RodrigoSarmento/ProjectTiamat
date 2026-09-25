import type { IPresentedStoryChoice } from '@helper/storyPlayback';

export interface IStoryChoices {
  choices: IPresentedStoryChoice[];
  onSelect: (choice: IPresentedStoryChoice) => void;
  selectedId?: string;
  testID?: string;
}
