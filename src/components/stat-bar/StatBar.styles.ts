import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  stepButtonImage: {
    width: 40,
    height: 40,
  },
  container: {
    paddingVertical: 12,
  },
  shortLabel: {
    ...Fonts.titleSubSection,
    color: Colors.neonCyan,
  },
  label: {
    ...Fonts.contentBaseBold,
    color: Colors.white,
  },
  description: {
    ...Fonts.contentBase,
    color: Colors.grayLightText,
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
  segmentFilled: {
    flex: 1,
    height: 24,
    tintColor: Colors.neonCyan,
  },
  segmentEmpty: {
    flex: 1,
    height: 24,
    tintColor: Colors.gray,
  },
});
