import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';

export const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    minWidth: Common.screenWidth * 0.2,
  },
  hit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    opacity: 0.2,
  },
  face: {
    ...Fonts.numberShowcase,
    color: Colors.white,
    textAlign: 'center',
  },
  missFace: {
    opacity: 0.35,
  },
  faceD4: {
    marginTop: 10,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  badgeLabel: {
    ...Fonts.extraSmallBold,
    color: Colors.white,
  },
  kind: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: 'center',
    ...Fonts.extraSmallBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  kindLarge: {
    bottom: 16,
    ...Fonts.contentSmallBold,
  },
  strip: {
    ...Fonts.extraSmall,
    color: Colors.white,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
});
