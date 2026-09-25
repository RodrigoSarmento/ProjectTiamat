import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

import {
  NARRATOR_FONT_SIZE,
  NARRATOR_LINE_HEIGHT,
} from './NarratorText.constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...Fonts.titleGroup,
    color: Colors.grayLightText,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  text: {
    ...Fonts.contentBase,
    color: Colors.white,
    fontSize: NARRATOR_FONT_SIZE,
    lineHeight: NARRATOR_LINE_HEIGHT,
  },
});
