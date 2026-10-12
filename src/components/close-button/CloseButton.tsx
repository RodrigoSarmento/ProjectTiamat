import React, { useState } from 'react';

import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { translate } from '@helper/translate';
import { Colors } from '@styles';
import Svg, { Polygon } from 'react-native-svg';

import {
  CLOSE_BUTTON_FILL,
  CLOSE_BUTTON_HEIGHT,
  CLOSE_BUTTON_SLANT_WIDTH,
  CLOSE_BUTTON_STROKE_WIDTH,
} from './CloseButton.constants';
import { styles } from './CloseButton.styles';
import type { ICloseButton } from './CloseButton.types';

const tagPoints = (width: number) => {
  const inset = CLOSE_BUTTON_STROKE_WIDTH / 2;
  const bottom = CLOSE_BUTTON_HEIGHT - inset;

  return [
    `${inset},${inset}`,
    `${width - CLOSE_BUTTON_SLANT_WIDTH},${inset}`,
    `${width - inset},${bottom}`,
    `${inset},${bottom}`,
  ].join(' ');
};

const CloseButton: React.FC<ICloseButton> = ({
  onPress,
  label = translate('words.close'),
  style,
  testID = 'CloseButton',
}) => {
  const navigation = useNavigation();
  const [width, setWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      onPress={onPress ?? (() => navigation.goBack())}
      onLayout={handleLayout}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {width > 0 ? (
        <Svg
          style={StyleSheet.absoluteFill}
          width={width}
          height={CLOSE_BUTTON_HEIGHT}
        >
          <Polygon
            points={tagPoints(width)}
            fill={CLOSE_BUTTON_FILL}
            stroke={Colors.neonMagenta}
            strokeWidth={CLOSE_BUTTON_STROKE_WIDTH}
          />
        </Svg>
      ) : null}
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CloseButton;
