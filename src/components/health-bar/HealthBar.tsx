import React, { useEffect } from 'react';

import { Text, View } from 'react-native';

import { translate } from '@helper/translate';
import { Colors } from '@styles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  DRAIN_MS,
  DRAIN_STAGGER_MS,
  MAX_SEGMENTS,
} from './HealthBar.constants';
import { styles } from './HealthBar.styles';
import type { IHealthBar } from './HealthBar.types';
import HealthSegment from './HealthSegment';

const HealthBar: React.FC<IHealthBar> = ({
  current,
  max,
  color = Colors.warningRed,
  size = 'compact',
  testID = 'HealthBar',
}) => {
  const value = Math.max(0, Math.min(current, max));
  const isLarge = size === 'large';
  const ratio = useSharedValue(max > 0 ? value / max : 0);

  useEffect(() => {
    ratio.value = withTiming(max > 0 ? value / max : 0, {
      duration: DRAIN_MS * 2,
    });
  }, [max, ratio, value]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${ratio.value * 100}%`,
  }));

  return (
    <View testID={testID} style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{translate('combat.hp')}</Text>
        <Text style={isLarge ? styles.valueLarge : styles.value}>
          {value}/{max}
        </Text>
      </View>
      <View style={[styles.track, isLarge && styles.trackLarge]}>
        {max <= MAX_SEGMENTS ? (
          Array.from({ length: max }, (_, index) => (
            <HealthSegment
              key={`hp-${index}`}
              isFilled={index < value}
              color={color}
              drainDelay={(max - 1 - index) * DRAIN_STAGGER_MS}
            />
          ))
        ) : (
          <View style={[styles.continuous, { borderColor: color }]}>
            <Animated.View
              style={[styles.fill, { backgroundColor: color }, fillStyle]}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default HealthBar;
