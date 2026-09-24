import type { ImageSourcePropType } from 'react-native';

export interface IDialogue {
  name?: string;
  text: string;
  portrait?: ImageSourcePropType;
  onPress: () => void;
  testID?: string;
}
