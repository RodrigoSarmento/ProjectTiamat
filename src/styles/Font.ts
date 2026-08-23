import { StyleSheet, TextStyle } from 'react-native';

import * as Colors from './Colors';

const base: TextStyle = {
  includeFontPadding: false,
};

/** Cinzel — display / titles */
export const regular: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-Regular',
};
export const medium: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-Medium',
};
export const semiBold: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-SemiBold',
};
export const bold: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-Bold',
};
export const extraBold: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-ExtraBold',
};
export const oxaniumLight: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-Light',
};
export const oxaniumExtraLight: TextStyle = {
  ...base,
  fontFamily: 'Oxanium-ExtraLight',
};

export const Fonts = StyleSheet.create({
  // Screen header title — once per screen
  headerTitle: {
    ...semiBold,
    fontSize: 24,
    letterSpacing: 0.5,
    color: Colors.blackAbsolute,
  },
  // Main screen title — once per screen
  titleScreen: {
    ...bold,
    fontSize: 30,
    letterSpacing: 0.4,
    color: Colors.blackPrimary,
  },
  // Section headings
  titleSection: {
    ...bold,
    fontSize: 26,
    letterSpacing: 0.3,
    color: Colors.blackPrimary,
  },
  // Modal title
  titleModal: {
    ...bold,
    fontSize: 20,
    letterSpacing: 0.3,
    color: Colors.blackPrimary,
  },
  // Nested section headings
  titleSubSection: {
    ...semiBold,
    fontSize: 22,
    letterSpacing: 0.25,
    color: Colors.blackPrimary,
  },
  // Large content title
  titleBody: {
    ...semiBold,
    fontSize: 18,
    letterSpacing: 0.2,
    color: Colors.blackPrimary,
  },
  titleBodyRegular: {
    ...regular,
    fontSize: 18,
    letterSpacing: 0.2,
    color: Colors.blackPrimary,
  },
  // Group labels
  titleGroup: {
    ...medium,
    fontSize: 14,
    letterSpacing: 0.4,
    color: Colors.blackPrimary,
  },

  // Body copy
  contentBase: {
    ...regular,
    fontSize: 16,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  contentBaseBold: {
    ...bold,
    fontSize: 16,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  contentSmall: {
    ...regular,
    fontSize: 14,
    color: Colors.blackPrimary,
  },
  contentSmallBold: {
    ...semiBold,
    fontSize: 14,
    letterSpacing: 0.15,
    color: Colors.blackPrimary,
  },
  caption: {
    ...regular,
    fontSize: 12,
    color: Colors.blackPrimary,
  },
  captionBold: {
    ...bold,
    fontSize: 12,
    letterSpacing: 0.12,
    color: Colors.blackPrimary,
  },
  extraSmall: {
    ...regular,
    fontSize: 10,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  extraSmallBold: {
    ...bold,
    fontSize: 10,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  numberDisplay: {
    ...medium,
    fontSize: 18,
    letterSpacing: -0.5,
    color: Colors.blackPrimary,
  },
  numberShowcase: {
    ...bold,
    fontSize: 26,
    letterSpacing: -0.4,
    color: Colors.blackPrimary,
  },
});
