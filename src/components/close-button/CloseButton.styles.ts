import { StyleSheet } from 'react-native';

import { Colors } from '@styles';
import { semiBold } from '@styles/Font';

import {
  CLOSE_BUTTON_HEIGHT,
  CLOSE_BUTTON_SLANT_WIDTH,
} from './CloseButton.constants';

export const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    height: CLOSE_BUTTON_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16 + CLOSE_BUTTON_SLANT_WIDTH,
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    ...semiBold,
    fontSize: 18,
    letterSpacing: 0.5,
    color: Colors.neonMagenta,
  },
});
