import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';

import {
  FIELD_SLOT_GAP,
  TRAY_HEIGHT,
  TRAY_HORIZONTAL_PADDING,
  TRAY_ROW_GAP,
} from './Prepare.constants';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#07070C',
  },
  title: {
    ...Fonts.titleBody,
    color: Colors.white,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  root: {
    flex: 1,
  },
  hint: {
    ...Fonts.caption,
    color: Colors.grayLightText,
  },
  field: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 18,
  },
  slots: {
    alignItems: 'center',
    gap: FIELD_SLOT_GAP,
  },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: FIELD_SLOT_GAP,
  },
  slot: {
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
  trayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 6,
  },
  pileCounts: {
    flexDirection: 'row',
    gap: 12,
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
  trayScroll: {
    height: TRAY_HEIGHT,
  },
  trayContent: {
    flexDirection: 'column',
    height: TRAY_HEIGHT,
    paddingHorizontal: TRAY_HORIZONTAL_PADDING,
    gap: TRAY_ROW_GAP,
  },
  trayRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    minWidth: Common.screenWidth - TRAY_HORIZONTAL_PADDING * 2,
  },
  actions: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
  },
  ready: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.neonMagenta,
    borderRadius: 3,
    backgroundColor: 'rgba(6, 6, 10, 0.92)',
  },
  readyDisabled: {
    opacity: 0.35,
  },
  readyLabel: {
    ...Fonts.titleBody,
    color: Colors.neonMagenta,
    letterSpacing: 3,
    textTransform: 'uppercase',
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
  indicator: {
    position: 'absolute',
    top: 0,
    right: 4,
    bottom: 0,
    justifyContent: 'center',
  },
  indicatorLabel: {
    ...Fonts.caption,
    color: Colors.grayLightText,
  },
});
