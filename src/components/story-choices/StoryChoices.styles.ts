import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  choice: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.neonMagenta,
    backgroundColor: 'rgba(6, 6, 10, 0.92)',
  },
  continueDot: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neonCyan,
  },
  used: {
    opacity: 0.5,
  },
  selected: {
    borderColor: Colors.neonCyan,
    backgroundColor: 'rgba(60, 246, 255, 0.12)',
  },
  label: {
    ...Fonts.contentBase,
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
});
