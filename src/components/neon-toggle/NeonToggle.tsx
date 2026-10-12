import React, { useEffect, useState } from 'react';

import { Animated, Easing, Pressable } from 'react-native';

import { KNOB_TRAVEL, TOGGLE_ANIMATION_MS } from './NeonToggle.constants';
import { styles } from './NeonToggle.styles';
import type { INeonToggle } from './NeonToggle.types';

const NeonToggle: React.FC<INeonToggle> = ({
  value,
  onValueChange,
  accessibilityLabel,
  testID,
}) => {
  const [position] = useState(() => new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(position, {
      toValue: value ? 1 : 0,
      duration: TOGGLE_ANIMATION_MS,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [position, value]);

  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, KNOB_TRAVEL],
  });

  return (
    <Pressable
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={8}
      onPress={() => onValueChange(!value)}
      style={[styles.track, value && styles.trackOn]}
    >
      <Animated.View
        style={[
          styles.knob,
          value && styles.knobOn,
          { transform: [{ translateX }] },
        ]}
      />
    </Pressable>
  );
};

export default NeonToggle;
