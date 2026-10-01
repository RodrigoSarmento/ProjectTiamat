import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

import { SIDE_DIE_SIZE } from './DiceSide.constants';

export const styles = StyleSheet.create({
  side: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...Fonts.captionBold,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  dice: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    minHeight: SIDE_DIE_SIZE,
  },
  empty: {
    ...Fonts.caption,
    color: Colors.grayLightText,
  },
  total: {
    ...Fonts.titleBody,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
