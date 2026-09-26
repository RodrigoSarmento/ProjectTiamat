import { StyleSheet } from 'react-native';

import { Colors } from '@styles';

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  diceFrame: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  hitArea: {
    ...StyleSheet.absoluteFill,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  outcomeSlot: {
    minHeight: 44,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outcome: {
    includeFontPadding: false,
    fontFamily: 'Oxanium-ExtraBold',
    fontSize: 28,
    letterSpacing: 2,
  },
  outcomeSuccess: {
    color: Colors.feedbackSuccess,
  },
  outcomeFailure: {
    color: Colors.warningRed,
  },
});
