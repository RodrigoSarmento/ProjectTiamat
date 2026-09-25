import type { ImageSourcePropType } from 'react-native';

import type { PortraitPosition } from '@data/story';

export interface IDialogue {
  name?: string;
  text: string;
  portrait?: ImageSourcePropType;
  portraitPosition?: PortraitPosition;
  onPress: () => void;
  testID?: string;
}
