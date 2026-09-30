import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07070C',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  backLabel: {
    ...Fonts.contentSmallBold,
    color: Colors.neonMagenta,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    ...Fonts.titleBody,
    color: Colors.white,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  hint: {
    ...Fonts.caption,
    color: Colors.grayLightText,
  },
  tray: {
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(60, 246, 255, 0.18)',
    backgroundColor: 'rgba(8, 10, 16, 0.92)',
  },
  trayHot: {
    borderColor: Colors.neonCyan,
    backgroundColor: 'rgba(60, 246, 255, 0.08)',
  },
  trayContent: {
    flexDirection: 'column',
    paddingHorizontal: 14,
    gap: 10,
  },
  trayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
    minHeight: 96,
  },
  field: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 22,
  },
  slots: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 14,
  },
  slot: {
    width: 124,
    minHeight: 148,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    paddingVertical: 10,
  },
  slotHot: {
    borderStyle: 'solid',
    borderColor: Colors.neonCyan,
    backgroundColor: 'rgba(60, 246, 255, 0.08)',
  },
  slotFilled: {
    borderStyle: 'solid',
    borderColor: 'rgba(255, 46, 196, 0.45)',
  },
  slotIndex: {
    ...Fonts.extraSmallBold,
    color: Colors.white,
    position: 'absolute',
    top: 6,
    left: 8,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 14,
  },
  run: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.neonMagenta,
    borderRadius: 3,
    backgroundColor: 'rgba(6, 6, 10, 0.92)',
  },
  runDisabled: {
    opacity: 0.35,
  },
  runLabel: {
    ...Fonts.titleBody,
    color: Colors.neonMagenta,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  result: {
    minHeight: 72,
    gap: 6,
    alignItems: 'center',
  },
  resultFaces: {
    flexDirection: 'row',
    gap: 18,
  },
  resultFace: {
    ...Fonts.numberShowcase,
    color: Colors.white,
  },
  resultMiss: {
    color: Colors.gray,
    opacity: 0.7,
  },
  resultLine: {
    ...Fonts.contentSmall,
    color: Colors.whiteVariant,
    letterSpacing: 0.6,
  },
  resultAccent: {
    color: Colors.neonCyan,
  },
  floatingLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
  },
  floatingDie: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
});
