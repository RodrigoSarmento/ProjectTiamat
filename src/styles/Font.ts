import { StyleSheet } from 'react-native';

import * as Colors from './Colors';

// We still don't have a font family, fallback to default TODO:
export const bold = {
  fontFamily: 'OpenSans-Bold',
  includeFontPadding: false,
};
export const light = {
  fontFamily: 'OpenSans-Light',
  includeFontPadding: false,
};
export const medium = {
  fontFamily: 'OpenSans-Medium',
  includeFontPadding: false,
};
export const regular = {
  fontFamily: 'OpenSans-Regular',
  includeFontPadding: false,
};

export const Fonts = StyleSheet.create({
  //Used for the header screen title, should be only once per screen
  headerTitle: {
    ...medium,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
    color: Colors.blackAbsolute,
  },
  //Used for the main screen title, should be only once per screen
  titleScreen: {
    ...bold,
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: -0.75,
    color: Colors.blackPrimary,
  },
  // Handy for dividing your screen into sections
  titleSection: {
    ...bold,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.39,
    color: Colors.blackPrimary,
  },
  // modal
  titleModal: {
    ...bold,
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.39,
    color: Colors.blackPrimary,
  },
  // Designer for sections within sections
  titleSubSection: {
    ...bold,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.33,
    color: Colors.blackPrimary,
  },
  // For large amount of content. Pairs with large body and default body
  titleBody: {
    ...bold,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.18,
    color: Colors.blackPrimary,
  },
  titleBodyRegular: {
    ...regular,
    fontSize: 18,
    fontWeight: '400',
    letterSpacing: -0.18,
    color: Colors.blackPrimary,
  },

  // Used to group actions or infos
  titleGroup: {
    ...medium,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.21,
    color: Colors.blackPrimary,
  },
  // Used for paragraphs. Pairs with screen title and section title
  contentBase: {
    ...regular,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.08,
    color: Colors.blackPrimary,
  },
  // Highlights important words or small titles
  contentBaseBold: {
    ...bold,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.16,
    color: Colors.blackPrimary,
  },
  // When you need something a little smaller then base
  contentSmall: {
    ...regular,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.blackPrimary,
  },
  // Same as content small but bold
  contentSmallBold: {
    ...bold,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.175,
    color: Colors.blackPrimary,
  },
  caption: {
    ...regular,
    fontSize: 12,
    fontWeight: '400',
    color: Colors.blackPrimary,
  },
  captionBold: {
    ...bold,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.12,
    color: Colors.blackPrimary,
  },
  extraSmall: {
    ...regular,
    fontSize: 10,
    fontWeight: '400',
    color: Colors.blackPrimary,
    letterSpacing: 0.1,
  },
  extraSmallBold: {
    ...bold,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.1,
    color: Colors.blackPrimary,
  },
  numberDisplay: {
    ...bold,
    fontSize: 32,
    fontWeight: '600',
    letterSpacing: -1.28,
    color: Colors.blackPrimary,
  },
  numberShowcase: {
    ...bold,
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -1.04,
    color: Colors.blackPrimary,
  },
});
