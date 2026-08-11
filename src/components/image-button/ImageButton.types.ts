import type { ImageProps, StyleProp, TextStyle, ViewStyle } from 'react-native';

export type ImageButtonProps = ImageProps & {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onPress?: () => void;
  text?: string;
  textStyle?: TextStyle;
};
