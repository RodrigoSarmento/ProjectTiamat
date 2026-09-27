import type { IPresentedStoryChoice } from '@helper/storyPlayback';

export interface IChoiceSelectModal {
  isVisible: boolean;
  choices: IPresentedStoryChoice[];
  onSelect: (choice: IPresentedStoryChoice) => void;
  testID?: string;
}
