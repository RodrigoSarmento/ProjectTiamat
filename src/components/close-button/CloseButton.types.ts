import type { StyleProp, ViewStyle } from 'react-native';

export interface ICloseButton {
  onPress?: () => void;
  label?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
