import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';

export const styles = StyleSheet.create({
  iconButton: {
    zIndex: 20,
    position: 'absolute',
    left: Common.contentPaddingHorizontal,
  },
  icon: {
    width: Common.iconSize,
    height: Common.iconSize,
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(6, 6, 10, 0.96)',
  },
  modalSafe: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 108,
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 20,
  },
  entry: {
    gap: 8,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(60, 246, 255, 0.24)',
  },
  speaker: {
    ...Fonts.titleGroup,
    color: Colors.neonCyan,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    ...Fonts.titleGroup,
    color: Colors.grayLightText,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  text: {
    ...Fonts.contentBase,
    color: Colors.white,
    fontSize: 16,
    lineHeight: 22,
  },
});
