import { Easing } from 'react-native';

import type { StackNavigationOptions } from '@react-navigation/stack';

const BOOK_PAGE_MS = 400;
// const BOOK_PAGE_PERSPECTIVE = 1600;
// const BOOK_PAGE_SHADE = '#1a1208';
// const BOOK_PAGE_MAX_SHADE = 0.6;

const slowBookPageSpec = {
  animation: 'timing' as const,
  config: {
    duration: BOOK_PAGE_MS,
    easing: Easing.inOut(Easing.cubic),
  },
};

// One sheet: the leaving screen is the front (first half of the turn) and the
// arriving screen is the back (second half). Keep the same style keys in both
// branches so Animated never sets props to null.
/*
const forBookPage = ({ current, next }: StackCardInterpolationProps) => {
  if (next) {
    return {
      cardStyle: {
        opacity: next.progress.interpolate({
          inputRange: [0, 0.5, 0.501, 1],
          outputRange: [1, 1, 0, 0],
        }),
        transform: [
          { perspective: BOOK_PAGE_PERSPECTIVE },
          {
            rotateY: next.progress.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: ['0deg', '-90deg', '-90deg'],
            }),
          },
        ],
      },
      overlayStyle: {
        backgroundColor: BOOK_PAGE_SHADE,
        opacity: 0,
      },
    };
  }

  return {
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 0.499, 0.5, 1],
        outputRange: [0, 0, 1, 1],
      }),
      transform: [
        { perspective: BOOK_PAGE_PERSPECTIVE },
        {
          rotateY: current.progress.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['90deg', '90deg', '0deg'],
          }),
        },
      ],
    },
    overlayStyle: {
      backgroundColor: BOOK_PAGE_SHADE,
      opacity: current.progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, BOOK_PAGE_MAX_SHADE, 0],
      }),
    },
  };
}; */

export const bookPageTransition: StackNavigationOptions = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  presentation: 'card',
  transitionSpec: {
    open: slowBookPageSpec,
    close: slowBookPageSpec,
  },
  // cardStyleInterpolator: forBookPage,
  cardOverlayEnabled: true,
  cardStyle: {
    backgroundColor: '#000',
  },
};
