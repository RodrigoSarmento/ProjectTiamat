import { StyleSheet } from 'react-native';

import { Colors } from '@styles';

export const styles = StyleSheet.create({
  dimmed: {
    opacity: 0.35,
  },
  imageScreen: {
    backgroundColor: Colors.blackAbsolute,
  },
  fadedBackground: {
    opacity: 0.4,
  },
  dialogueContainer: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 16,
    zIndex: 1,
  },
  debugButton: {
    position: 'absolute',
    top: 48,
    right: 8,
    zIndex: 20,
    backgroundColor: Colors.neonMagenta,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  debugButtonLabel: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  debugModal: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 48,
  },
  debugBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  debugList: {
    maxHeight: '80%',
    backgroundColor: 'rgba(10, 10, 16, 0.96)',
    borderRadius: 12,
    zIndex: 1,
  },
  debugRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray800,
  },
  debugRowLabel: {
    color: Colors.white,
    fontSize: 14,
  },
});
