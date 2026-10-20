import type { StyleProp, ViewStyle } from 'react-native';

export interface ITagButton {
  label: string;
  onPress: () => void;
  accent?: string;
  fill?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
