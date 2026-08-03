import { StyleSheet, TextStyle } from 'react-native';

import * as Colors from './Colors';

const base: TextStyle = {
  includeFontPadding: false,
};

/** Cinzel — display / titles */
export const cinzelRegular: TextStyle = {
  ...base,
  fontFamily: 'Cinzel-Regular',
};
export const cinzelMedium: TextStyle = {
  ...base,
  fontFamily: 'Cinzel-Medium',
};
export const cinzelSemiBold: TextStyle = {
  ...base,
  fontFamily: 'Cinzel-SemiBold',
};
export const cinzelBold: TextStyle = {
  ...base,
  fontFamily: 'Cinzel-Bold',
};
export const cinzelExtraBold: TextStyle = {
  ...base,
  fontFamily: 'Cinzel-ExtraBold',
};
export const cinzelBlack: TextStyle = {
  ...base,
  fontFamily: 'Cinzel-Black',
};

/** Crimson Text — body / UI copy */
export const crimsonRegular: TextStyle = {
  ...base,
  fontFamily: 'CrimsonText-Regular',
};
export const crimsonSemiBold: TextStyle = {
  ...base,
  fontFamily: 'CrimsonText-SemiBold',
};
export const crimsonBold: TextStyle = {
  ...base,
  fontFamily: 'CrimsonText-Bold',
};
export const crimsonItalic: TextStyle = {
  ...base,
  fontFamily: 'CrimsonText-Italic',
};
export const crimsonBoldItalic: TextStyle = {
  ...base,
  fontFamily: 'CrimsonText-BoldItalic',
};
export const crimsonSemiBoldItalic: TextStyle = {
  ...base,
  fontFamily: 'CrimsonText-SemiBoldItalic',
};

export const newRocker: TextStyle = {
  ...base,
  fontFamily: 'NewRocker-Regular',
};

export const Fonts = StyleSheet.create({
  // Screen header title — once per screen
  headerTitle: {
    ...cinzelSemiBold,
    fontSize: 24,
    letterSpacing: 0.5,
    color: Colors.blackAbsolute,
  },
  // Main screen title — once per screen
  titleScreen: {
    ...cinzelBold,
    fontSize: 30,
    letterSpacing: 0.4,
    color: Colors.blackPrimary,
  },
  // Section headings
  titleSection: {
    ...cinzelBold,
    fontSize: 26,
    letterSpacing: 0.3,
    color: Colors.blackPrimary,
  },
  // Modal title
  titleModal: {
    ...cinzelBold,
    fontSize: 20,
    letterSpacing: 0.3,
    color: Colors.blackPrimary,
  },
  // Nested section headings
  titleSubSection: {
    ...cinzelSemiBold,
    fontSize: 22,
    letterSpacing: 0.25,
    color: Colors.blackPrimary,
  },
  // Large content title
  titleBody: {
    ...cinzelSemiBold,
    fontSize: 18,
    letterSpacing: 0.2,
    color: Colors.blackPrimary,
  },
  titleBodyRegular: {
    ...cinzelRegular,
    fontSize: 18,
    letterSpacing: 0.2,
    color: Colors.blackPrimary,
  },
  // Group labels
  titleGroup: {
    ...cinzelMedium,
    fontSize: 14,
    letterSpacing: 0.4,
    color: Colors.blackPrimary,
  },

  // Body copy
  contentBase: {
    ...crimsonRegular,
    fontSize: 16,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  contentBaseBold: {
    ...crimsonBold,
    fontSize: 16,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  contentSmall: {
    ...crimsonRegular,
    fontSize: 14,
    color: Colors.blackPrimary,
  },
  contentSmallBold: {
    ...crimsonSemiBold,
    fontSize: 14,
    letterSpacing: 0.15,
    color: Colors.blackPrimary,
  },
  caption: {
    ...crimsonRegular,
    fontSize: 12,
    color: Colors.blackPrimary,
  },
  captionBold: {
    ...crimsonBold,
    fontSize: 12,
    letterSpacing: 0.12,
    color: Colors.blackPrimary,
  },
  extraSmall: {
    ...crimsonRegular,
    fontSize: 10,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  extraSmallBold: {
    ...crimsonBold,
    fontSize: 10,
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  numberDisplay: {
    ...cinzelMedium,
    fontSize: 18,
    letterSpacing: -0.5,
    color: Colors.blackPrimary,
  },
  numberShowcase: {
    ...crimsonBold,
    fontSize: 26,
    letterSpacing: -0.4,
    color: Colors.blackPrimary,
  },
});
