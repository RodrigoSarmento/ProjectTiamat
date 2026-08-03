import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  stepButtonImage: {
    width: 24,
    height: 24,
  },
  container: {
    paddingVertical: 12,
  },
  shortLabel: {
    ...Fonts.titleSubSection,
    color: Colors.primaryColor,
  },
  label: {
    ...Fonts.contentBaseBold,
    color: Colors.blackPrimary,
  },
  description: {
    ...Fonts.contentBase,
    color: Colors.grayText,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 24,
    tintColor: 'black',
  },
});
