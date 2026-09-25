import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

import {
  DIALOGUE_FONT_SIZE,
  DIALOGUE_LINE_HEIGHT,
  NEON_MAGENTA,
  PORTRAIT_INSET,
  PORTRAIT_SIZE,
} from './Dialogue.constants';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  panel: {
    width: '100%',
    minHeight: 120,
    paddingTop: 16,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 18,
  },
  panelImage: {
    ...StyleSheet.absoluteFill,
  },
  namePlate: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '70%',
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: NEON_MAGENTA,
    backgroundColor: 'rgba(6, 6, 10, 0.92)',
  },
  name: {
    ...Fonts.titleGroup,
    color: Colors.white,
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  text: {
    ...Fonts.contentBase,
    color: Colors.white,
    fontSize: DIALOGUE_FONT_SIZE,
    lineHeight: DIALOGUE_LINE_HEIGHT,
  },
  portraitWrap: {
    position: 'absolute',
    top: -PORTRAIT_SIZE / 1.5,
    width: PORTRAIT_SIZE,
    height: PORTRAIT_SIZE,
  },
  portraitRight: {
    right: 8,
  },
  portraitLeft: {
    left: 8,
  },
  namePlateLeft: {
    alignSelf: 'flex-end',
  },
  portraitImage: {
    position: 'absolute',
    top: PORTRAIT_INSET,
    left: PORTRAIT_INSET,
    right: PORTRAIT_INSET,
    bottom: PORTRAIT_INSET,
    width: PORTRAIT_SIZE - 30,
    height: PORTRAIT_SIZE - 30,
  },
});
