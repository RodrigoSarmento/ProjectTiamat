import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 12,
  },
  tapArea: {
    flex: 1,
  },
  tapHint: {
    ...Fonts.caption,
    color: Colors.grayLightText,
    letterSpacing: 1.2,
    textAlign: 'center',
    textTransform: 'uppercase',
    minHeight: 20,
    marginBottom: 8,
  },
  pillRow: {
    alignItems: 'center',
    minHeight: 34,
    paddingTop: 8,
  },
  pill: {
    ...Fonts.captionBold,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 4,
  },
  pillAttack: {
    color: Colors.neonMagenta,
    borderColor: Colors.neonMagenta,
  },
  pillDefend: {
    color: Colors.neonCyan,
    borderColor: Colors.neonCyan,
  },
  stage: {
    flex: 1,
    justifyContent: 'center',
  },
  exchange: {
    gap: 14,
  },
  notice: {
    ...Fonts.contentSmall,
    color: Colors.white,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 46, 196, 0.45)',
  },
  dividerLabel: {
    ...Fonts.captionBold,
    color: Colors.neonMagenta,
    letterSpacing: 2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.neonMagenta,
  },
  damageRow: {
    alignItems: 'center',
    minHeight: 36,
  },
  damage: {
    ...Fonts.contentSmallBold,
    color: Colors.neonCyan,
    letterSpacing: 1,
    textTransform: 'uppercase',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'rgba(60, 246, 255, 0.5)',
  },
  damageTaken: {
    color: Colors.redSalmon,
    borderColor: 'rgba(233, 56, 56, 0.5)',
  },
});
