import { StyleSheet } from 'react-native';

import { Colors } from '@styles';
import { semiBold } from '@styles/Font';

import {
  TAG_BUTTON_HEIGHT,
  TAG_BUTTON_SLANT_WIDTH,
} from './TagButton.constants';

export const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    height: TAG_BUTTON_HEIGHT,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16 + TAG_BUTTON_SLANT_WIDTH,
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
