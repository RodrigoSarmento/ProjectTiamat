import { useEffect } from 'react';

import {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { BLINK_MIN_OPACITY, BLINK_MS } from './useBlink.constants';

export const useBlink = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(BLINK_MIN_OPACITY, { duration: BLINK_MS }),
      -1,
      true,
    );
  }, [opacity]);

  return useAnimatedStyle(() => ({ opacity: opacity.value }));
};
