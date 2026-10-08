import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';
import { newRocker } from '@styles/Font';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.blackAbsolute,
  },
  title: {
    ...Fonts.headerTitle,
    textAlign: 'center',
    marginVertical: 16,
    color: Colors.white,
  },
  page: {
    width: Common.screenWidth,
  },
  image: {
    width: Common.screenWidth,
    height: Common.screenWidth * 0.5,
  },
  name: {
    ...newRocker,
    fontSize: 28,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    color: Colors.white,
  },
  descriptionContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  description: {
    ...Fonts.contentBase,
    lineHeight: 24,
    color: Colors.white,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.grayBase,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.neonCyan,
  },
  chooseButton: {
    alignSelf: 'center',
    width: Common.screenWidth * 0.7,
    height: 100,
    resizeMode: 'stretch',
  },
  chooseText: {
    ...newRocker,
    fontSize: 26,
    letterSpacing: 3,
    color: Colors.white,
  },
});
