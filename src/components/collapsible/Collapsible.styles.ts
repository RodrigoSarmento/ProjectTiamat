import { StyleSheet } from 'react-native';

import { Colors } from '@styles';
import { bold, regular } from '@styles/Font';

import { TITLE_FONT_SIZE } from './Collapsible.constants';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    ...regular,
    flex: 1,
    fontSize: TITLE_FONT_SIZE,
    letterSpacing: 0.3,
    color: Colors.white,
    transformOrigin: 'left center',
  },
  titleOpen: {
    ...bold,
  },
  body: {
    overflow: 'hidden',
  },
  bodyContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  underline: {
    flexDirection: 'row',
    height: 1,
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: 'rgba(60, 246, 255, 0.2)',
  },
  underlineAccent: {
    width: '25%',
    backgroundColor: Colors.neonCyan,
  },
  description: {
    ...regular,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.white,
  },
});
