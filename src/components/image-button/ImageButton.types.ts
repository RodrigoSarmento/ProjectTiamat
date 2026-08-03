import type { ImageProps, TextStyle } from 'react-native';

export type ImageButtonProps = ImageProps & {
  disabled?: boolean;
  onPress?: () => void;
  text?: string;
  textStyle?: TextStyle;
};
