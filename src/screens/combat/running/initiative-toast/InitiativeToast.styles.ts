import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  toast: {
    alignSelf: 'center',
    minWidth: 220,
    alignItems: 'center',
    gap: 10,
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.neonCyan,
    backgroundColor: 'rgba(8, 12, 18, 0.96)',
  },
  title: {
    ...Fonts.titleBody,
    color: Colors.neonCyan,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
  },
  rolls: {
    flexDirection: 'row',
    gap: 36,
  },
  roll: {
    alignItems: 'center',
    gap: 2,
  },
  d20: {
    marginBottom: 4,
  },
  rollLabel: {
    ...Fonts.caption,
  },
  rollValue: {
    ...Fonts.titleSubSection,
  },
  verdict: {
    ...Fonts.contentSmall,
    color: Colors.white,
  },
});
