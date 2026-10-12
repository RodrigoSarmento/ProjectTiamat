import { StyleSheet } from 'react-native';

import { Colors } from '@styles';

import {
  KNOB_WIDTH,
  TOGGLE_BORDER_WIDTH,
  TOGGLE_HEIGHT,
  TOGGLE_PADDING,
  TOGGLE_WIDTH,
} from './NeonToggle.constants';

export const styles = StyleSheet.create({
  track: {
    width: TOGGLE_WIDTH,
    height: TOGGLE_HEIGHT,
    padding: TOGGLE_PADDING,
    borderRadius: 3,
    borderWidth: TOGGLE_BORDER_WIDTH,
    borderColor: 'rgba(255, 46, 196, 0.5)',
    backgroundColor: 'rgba(10, 10, 16, 0.85)',
  },
  trackOn: {
    borderColor: Colors.neonCyan,
    backgroundColor: 'rgba(0, 140, 200, 0.55)',
    boxShadow: '0 0 12px rgba(60, 246, 255, 0.6)',
  },
  knob: {
    flex: 1,
    width: KNOB_WIDTH,
    borderRadius: 2,
    backgroundColor: Colors.gray800,
  },
  knobOn: {
    backgroundColor: Colors.neonCyan,
  },
});
