import React, { useState } from 'react';

import { type LayoutChangeEvent, Pressable, Text, View } from 'react-native';

import { NeonFrame } from '@components/neon-frame';
import { Colors } from '@styles';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Polyline } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import {
  CHEVRON_HEIGHT,
  CHEVRON_POINTS,
  CHEVRON_ROTATION_DEG,
  CHEVRON_STROKE_WIDTH,
  CHEVRON_WIDTH,
  COLLAPSIBLE_ANIMATION_DURATION_MS,
  PADDING_VERTICAL,
  PROGRESS_RANGE,
  TITLE_SCALE,
} from './Collapsible.constants';
import { styles } from './Collapsible.styles';
import type { ICollapsible } from './Collapsible.types';

const Collapsible: React.FC<ICollapsible> = ({
  title,
  description,
  isOpen = false,
  testID = 'Collapsible',
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const [isBodyMounted, setIsBodyMounted] = useState(isOpen);
  const progress = useSharedValue(isOpen ? 1 : 0);
  const bodyHeight = useSharedValue(0);

  const contentStyle = useAnimatedStyle(() => ({
    paddingVertical: interpolate(
      progress.get(),
      PROGRESS_RANGE,
      PADDING_VERTICAL,
    ),
  }));
  const titleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(progress.get(), PROGRESS_RANGE, TITLE_SCALE) },
    ],
  }));
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.get(), PROGRESS_RANGE, CHEVRON_ROTATION_DEG)}deg`,
      },
    ],
  }));
  const bodyStyle = useAnimatedStyle(() => ({
    height: progress.get() * bodyHeight.get(),
    opacity: progress.get(),
  }));

  const handlePress = () => {
    const willExpand = !isExpanded;

    setIsExpanded(willExpand);
    if (willExpand) setIsBodyMounted(true);

    progress.set(
      withTiming(
        willExpand ? 1 : 0,
        {
          duration: COLLAPSIBLE_ANIMATION_DURATION_MS,
          easing: Easing.inOut(Easing.cubic),
        },
        (finished) => {
          if (finished && !willExpand) scheduleOnRN(setIsBodyMounted, false);
        },
      ),
    );
  };

  const handleBodyLayout = (event: LayoutChangeEvent) => {
    bodyHeight.set(event.nativeEvent.layout.height);
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <NeonFrame isHighlighted={isExpanded} />
      <Animated.View style={contentStyle}>
        <View style={styles.header}>
          <Animated.Text
            style={[styles.title, isExpanded && styles.titleOpen, titleStyle]}
          >
            {title}
          </Animated.Text>
          <Animated.View style={chevronStyle}>
            <Svg width={CHEVRON_WIDTH} height={CHEVRON_HEIGHT}>
              <Polyline
                points={CHEVRON_POINTS}
                fill="none"
                stroke={Colors.neonCyan}
                strokeWidth={CHEVRON_STROKE_WIDTH}
              />
            </Svg>
          </Animated.View>
        </View>
        {isBodyMounted ? (
          <Animated.View style={[styles.body, bodyStyle]}>
            <View style={styles.bodyContent} onLayout={handleBodyLayout}>
              <View style={styles.underline}>
                <View style={styles.underlineAccent} />
              </View>
              <Text testID={`${testID}-description`} style={styles.description}>
                {description}
              </Text>
            </View>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
};

export default Collapsible;
