import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

import { PORTRAIT_SIZE } from './CombatantCard.constants';

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 16,
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  cardPlayer: {
    flexDirection: 'row-reverse',
  },
  portrait: {
    width: PORTRAIT_SIZE,
    height: PORTRAIT_SIZE,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  portraitImage: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  name: {
    ...Fonts.titleBody,
    color: Colors.white,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  caption: {
    ...Fonts.caption,
    color: Colors.grayLightText,
  },
  damage: {
    ...Fonts.titleSubSection,
    color: Colors.warningRed,
    position: 'absolute',
    top: 6,
  },
  damageEnemy: {
    right: 16,
  },
  damagePlayer: {
    left: 16,
  },
});
