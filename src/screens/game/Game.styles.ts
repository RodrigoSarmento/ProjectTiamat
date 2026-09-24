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
});
