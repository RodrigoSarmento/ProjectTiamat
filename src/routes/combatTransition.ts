import { Easing } from 'react-native';

import type {
  StackCardInterpolationProps,
  StackNavigationOptions,
} from '@react-navigation/stack';

const COMBAT_OPEN_MS = 900;
const COMBAT_CLOSE_MS = 600;
const COMBAT_BACKDROP_OPACITY = 0.6;

const combatOpenSpec = {
  animation: 'timing' as const,
  config: {
    duration: COMBAT_OPEN_MS,
    easing: Easing.out(Easing.cubic),
  },
};

const combatCloseSpec = {
  animation: 'timing' as const,
  config: {
    duration: COMBAT_CLOSE_MS,
    easing: Easing.in(Easing.cubic),
  },
};

const forSlideFromBottom = ({
  current,
  next,
  layouts,
}: StackCardInterpolationProps) => {
  // Keep the screen underneath still while combat slides over it.
  // Always return the same style keys so Animated never sets props to null.
  if (next) {
    return {
      cardStyle: {
        transform: [{ translateY: 0 }],
      },
      overlayStyle: {
        backgroundColor: '#000',
        opacity: 0,
      },
    };
  }

  return {
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.height, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      backgroundColor: '#000',
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, COMBAT_BACKDROP_OPACITY],
      }),
    },
  };
};

export const combatTransition: StackNavigationOptions = {
  gestureDirection: 'vertical',
  transitionSpec: {
    open: combatOpenSpec,
    close: combatCloseSpec,
  },
  cardStyleInterpolator: forSlideFromBottom,
};
