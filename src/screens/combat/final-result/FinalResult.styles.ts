import { StyleSheet } from 'react-native';

import {
  NARRATOR_FONT_SIZE,
  NARRATOR_LINE_HEIGHT,
} from '@components/narrator-text';
import { Colors, Fonts } from '@styles';

import { ENEMY_PORTRAIT_SIZE } from './FinalResult.constants';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  tint: {
    ...StyleSheet.absoluteFill,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  portrait: {
    alignSelf: 'center',
    width: ENEMY_PORTRAIT_SIZE,
    height: ENEMY_PORTRAIT_SIZE,
    marginBottom: 14,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  badge: {
    ...Fonts.captionBold,
    letterSpacing: 2,
    textTransform: 'uppercase',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: 'rgba(6, 6, 10, 0.7)',
  },
  health: {
    ...Fonts.captionBold,
    color: Colors.grayLightText,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  panel: {
    minHeight: 240,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 36,
    gap: 12,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neonMagenta,
    backgroundColor: 'rgba(8, 6, 12, 0.88)',
  },
  narrative: {
    ...Fonts.contentBase,
    color: Colors.white,
    fontSize: NARRATOR_FONT_SIZE,
    lineHeight: NARRATOR_LINE_HEIGHT,
  },
  indicator: {
    position: 'absolute',
    right: 16,
    bottom: 12,
  },
  indicatorLabel: {
    ...Fonts.caption,
    color: Colors.grayLightText,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  action: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderRadius: 6,
  },
  retry: {
    borderColor: Colors.gray,
    backgroundColor: 'rgba(6, 6, 10, 0.85)',
  },
  retryLabel: {
    ...Fonts.titleBody,
    color: Colors.grayLightText,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  continue: {
    borderColor: Colors.neonMagenta,
    backgroundColor: Colors.neonMagenta,
  },
  continueLabel: {
    ...Fonts.titleBody,
    color: Colors.white,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
