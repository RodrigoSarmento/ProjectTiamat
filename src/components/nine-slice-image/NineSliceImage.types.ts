import type { ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

export type CapInsets = {
  top: number;
  left: number;
  bottom: number;
  right: number;
};

export interface INineSliceImage {
  source: ImageSourcePropType;
  capInsets: CapInsets;
  sourceSize: {
    width: number;
    height: number;
  };
  style?: StyleProp<ImageStyle>;
  testID?: string;
}
