import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    width: '100%',
    backgroundColor: 'rgba(10, 10, 16, 0.96)',
    borderTopLeftRadius: Common.radiusLarge,
    borderTopRightRadius: Common.radiusLarge,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 16,
  },
  timer: {
    gap: 8,
  },
  timerLabel: {
    ...Fonts.captionBold,
    color: Colors.neonCyan,
    textAlign: 'center',
  },
  timerTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  timerFill: {
    height: '100%',
    backgroundColor: Colors.neonCyan,
  },
  confirm: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.neonCyan,
    backgroundColor: 'rgba(60, 246, 255, 0.16)',
    alignItems: 'center',
  },
  confirmLabel: {
    ...Fonts.contentBaseBold,
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
});
