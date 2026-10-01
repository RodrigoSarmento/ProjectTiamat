import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  wrap: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    ...Fonts.extraSmallBold,
    color: Colors.grayLightText,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  value: {
    ...Fonts.captionBold,
    color: Colors.white,
  },
  valueLarge: {
    ...Fonts.titleBody,
    color: Colors.white,
  },
  track: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
  },
  trackLarge: {
    height: 12,
    gap: 4,
  },
  segment: {
    flex: 1,
    borderRadius: 1,
    borderWidth: 1,
    overflow: 'hidden',
  },
  drain: {
    ...StyleSheet.absoluteFill,
  },
  continuous: {
    flex: 1,
    borderRadius: 2,
    borderWidth: 1,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
