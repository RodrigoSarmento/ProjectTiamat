import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-end',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  label: {
    ...Fonts.titleSubSection,
    color: Colors.neonMagenta,
    letterSpacing: 3,
  },
});
