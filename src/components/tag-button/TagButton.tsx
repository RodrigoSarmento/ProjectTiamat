import React, { useState } from 'react';

import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { Colors } from '@styles';
import Svg, { Polygon } from 'react-native-svg';

import {
  TAG_BUTTON_FILL,
  TAG_BUTTON_HEIGHT,
  TAG_BUTTON_SLANT_WIDTH,
  TAG_BUTTON_STROKE_WIDTH,
} from './TagButton.constants';
import { styles } from './TagButton.styles';
import type { ITagButton } from './TagButton.types';

const tagPoints = (width: number) => {
  const inset = TAG_BUTTON_STROKE_WIDTH / 2;
  const bottom = TAG_BUTTON_HEIGHT - inset;

  return [
    `${inset},${inset}`,
    `${width - TAG_BUTTON_SLANT_WIDTH},${inset}`,
    `${width - inset},${bottom}`,
    `${inset},${bottom}`,
  ].join(' ');
};

const TagButton: React.FC<ITagButton> = ({
  onPress,
  label,
  accent = Colors.neonMagenta,
  fill = TAG_BUTTON_FILL,
  style,
  testID = 'TagButton',
}) => {
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      onLayout={handleLayout}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {width > 0 ? (
        <Svg
          style={StyleSheet.absoluteFill}
          width={width}
          height={TAG_BUTTON_HEIGHT}
        >
          <Polygon
            testID={`${testID}-plate`}
            points={tagPoints(width)}
            fill={fill}
            stroke={accent}
            strokeWidth={TAG_BUTTON_STROKE_WIDTH}
          />
        </Svg>
      ) : null}
      <Text style={[styles.label, { color: accent }]}>{label}</Text>
    </Pressable>
  );
};

export default TagButton;
