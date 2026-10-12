import type { StyleProp, ViewStyle } from 'react-native';

export interface INeonFrame {
  isHighlighted?: boolean;
}

export interface INeonFrameCorner {
  fill: string;
  strokeWidth: number;
  style: StyleProp<ViewStyle>;
}
