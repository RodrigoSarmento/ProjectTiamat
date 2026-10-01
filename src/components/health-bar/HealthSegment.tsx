import React, { useEffect, useRef } from 'react';

import { View } from 'react-native';

import { Colors } from '@styles';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { DRAIN_MS } from './HealthBar.constants';
import { styles } from './HealthBar.styles';
import type { IHealthSegment } from './HealthBar.types';

const HealthSegment: React.FC<IHealthSegment> = ({
  isFilled,
  color,
  drainDelay,
}) => {
  const drain = useSharedValue(1);
  const wasFilled = useRef(isFilled);

  useEffect(() => {
    if (wasFilled.current && !isFilled) {
      drain.value = 0;
      drain.value = withDelay(
        drainDelay,
        withTiming(1, { duration: DRAIN_MS }),
      );
    }
    wasFilled.current = isFilled;
  }, [drain, drainDelay, isFilled]);

  const drainStyle = useAnimatedStyle(() => ({
    opacity: interpolate(drain.value, [0, 0.35, 1], [1, 1, 0]),
    backgroundColor: interpolateColor(
      drain.value,
      [0, 0.35, 1],
      [color, Colors.white, Colors.white],
    ),
  }));

  return (
    <View
      style={[
        styles.segment,
        { borderColor: color },
        isFilled && { backgroundColor: color },
      ]}
    >
      <Animated.View pointerEvents="none" style={[styles.drain, drainStyle]} />
    </View>
  );
};

export default HealthSegment;
