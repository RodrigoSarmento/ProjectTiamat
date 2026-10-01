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

  faceD4: {
    marginTop: 10,
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
