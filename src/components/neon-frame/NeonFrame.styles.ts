import { Platform, StyleSheet } from 'react-native';

import { Colors } from '@styles';

import { FRAME_CORNER_CUT } from './NeonFrame.constants';

export const styles = StyleSheet.create({
  highlighted: Platform.select({
    ios: {
      shadowColor: Colors.neonMagenta,
      shadowOpacity: 0.8,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 0 },
    },
    default: {
      boxShadow: '0 0 16px rgba(255, 46, 196, 0.8)',
    },
  }),
  fillCenter: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: FRAME_CORNER_CUT,
    right: FRAME_CORNER_CUT,
  },
  fillLeft: {
    position: 'absolute',
    top: FRAME_CORNER_CUT,
    bottom: FRAME_CORNER_CUT,
    left: 0,
    width: FRAME_CORNER_CUT,
  },
  fillRight: {
    position: 'absolute',
    top: FRAME_CORNER_CUT,
    bottom: FRAME_CORNER_CUT,
    right: 0,
    width: FRAME_CORNER_CUT,
  },
  edgeTop: {
    position: 'absolute',
    top: 0,
    left: FRAME_CORNER_CUT,
    right: FRAME_CORNER_CUT,
    backgroundColor: Colors.neonMagenta,
  },
  edgeBottom: {
    position: 'absolute',
    bottom: 0,
    left: FRAME_CORNER_CUT,
    right: FRAME_CORNER_CUT,
    backgroundColor: Colors.neonMagenta,
  },
  edgeLeft: {
    position: 'absolute',
    left: 0,
    top: FRAME_CORNER_CUT,
    bottom: FRAME_CORNER_CUT,
    backgroundColor: Colors.neonMagenta,
  },
  edgeRight: {
    position: 'absolute',
    right: 0,
    top: FRAME_CORNER_CUT,
    bottom: FRAME_CORNER_CUT,
    backgroundColor: Colors.neonMagenta,
  },
  corner: {
    position: 'absolute',
    width: FRAME_CORNER_CUT,
    height: FRAME_CORNER_CUT,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    transform: [{ rotate: '90deg' }],
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    transform: [{ rotate: '180deg' }],
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    transform: [{ rotate: '270deg' }],
  },
});
