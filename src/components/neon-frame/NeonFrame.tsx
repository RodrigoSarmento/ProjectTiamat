import React from 'react';

import { StyleSheet, View } from 'react-native';

import { Colors } from '@styles';
import Svg, { Line, Polygon } from 'react-native-svg';

import {
  FRAME_CORNER_CUT,
  FRAME_FILL,
  FRAME_STROKE_WIDTH,
} from './NeonFrame.constants';
import { styles } from './NeonFrame.styles';
import type { INeonFrame, INeonFrameCorner } from './NeonFrame.types';

const CORNER_STYLES = [
  styles.cornerTopLeft,
  styles.cornerTopRight,
  styles.cornerBottomRight,
  styles.cornerBottomLeft,
];

const NeonFrameCorner: React.FC<INeonFrameCorner> = ({
  fill,
  strokeWidth,
  style,
}) => {
  const inset = strokeWidth / 2;

  return (
    <View style={[styles.corner, style]}>
      <Svg width={FRAME_CORNER_CUT} height={FRAME_CORNER_CUT}>
        <Polygon
          points={`${FRAME_CORNER_CUT},${inset} ${FRAME_CORNER_CUT},${FRAME_CORNER_CUT} ${inset},${FRAME_CORNER_CUT}`}
          fill={fill}
        />
        <Line
          x1={inset}
          y1={FRAME_CORNER_CUT}
          x2={FRAME_CORNER_CUT}
          y2={inset}
          stroke={Colors.neonMagenta}
          strokeWidth={strokeWidth}
          strokeLinecap="square"
        />
      </Svg>
    </View>
  );
};

const NeonFrame: React.FC<INeonFrame> = ({ isHighlighted = false }) => {
  const variant = isHighlighted ? 'highlighted' : 'regular';
  const strokeWidth = FRAME_STROKE_WIDTH[variant];
  const fill = { backgroundColor: FRAME_FILL[variant] };
  const horizontalEdge = { height: strokeWidth };
  const verticalEdge = { width: strokeWidth };

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, isHighlighted && styles.highlighted]}
    >
      <View style={[styles.fillCenter, fill]} />
      <View style={[styles.fillLeft, fill]} />
      <View style={[styles.fillRight, fill]} />
      <View style={[styles.edgeTop, horizontalEdge]} />
      <View style={[styles.edgeBottom, horizontalEdge]} />
      <View style={[styles.edgeLeft, verticalEdge]} />
      <View style={[styles.edgeRight, verticalEdge]} />
      {CORNER_STYLES.map((cornerStyle, index) => (
        <NeonFrameCorner
          key={index}
          fill={FRAME_FILL[variant]}
          strokeWidth={strokeWidth}
          style={cornerStyle}
        />
      ))}
    </View>
  );
};

export default NeonFrame;
