import { Easing } from 'react-native';

import type {
  StackCardInterpolationProps,
  StackNavigationOptions,
} from '@react-navigation/stack';

// TODO: shorten for production — slowed down for testing the page-turn
const slowBookPageSpec = {
  animation: 'timing' as const,
  config: {
    duration: 600,
    easing: Easing.inOut(Easing.cubic),
  },
};

const forBookPage = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) => {
  const width = layouts.screen.width;

  // Keep the screen underneath still so it doesn't leave a gap.
  // Always return the same style keys so Animated never sets props to null.
  if (next) {
    return {
      cardStyle: {
        transform: [{ perspective: 1600 }, { rotateY: '0deg' }],
      },
      overlayStyle: {
        backgroundColor: '#1a1208',
        opacity: 0,
      },
    };
  }

  const rotateY = current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  return {
    cardStyle: {
      transform: [
        { perspective: 1600 },
        { translateX: -width / 2 },
        { rotateY },
        { translateX: width / 2 },
      ],
    },
    overlayStyle: {
      backgroundColor: '#1a1208',
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.25, 0],
      }),
    },
  };
};

export const bookPageTransition: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  presentation: 'card',
  transitionSpec: {
    open: slowBookPageSpec,
    close: slowBookPageSpec,
  },
  cardStyleInterpolator: forBookPage,
  cardOverlayEnabled: true,
  cardStyle: {
    backgroundColor: 'transparent',
  },
};
