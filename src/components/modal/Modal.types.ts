import type { ImageSourcePropType, ImageStyle, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface IModal {
  title?: string;
  imageSource?: ImageSourcePropType;
  imageStyle?: ImageStyle;
  message?: string;
  footerText?: string;
  isVisible?: boolean;
  children?: ReactNode;
  animationTiming?: number;
  testID?: string;
  customStyle?: ViewStyle;
  variant?: 'regular' | 'bottom' | 'top';
  transparent?: boolean;
  onBackdropPress?: () => void;
}
