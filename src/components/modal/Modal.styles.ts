import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';

export const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentRegular: {
    backgroundColor: Colors.white,
    borderRadius: Common.radiusLarge,
    padding: 24,
    marginHorizontal: 24,
    maxHeight: Common.screenHeight * 0.85,
  },
  modalLayer: {
    zIndex: 2,
    elevation: 2,
  },
  modalContentTop: {
    backgroundColor: Colors.white,
    borderRadius: Common.radiusLarge,
    padding: 24,
    left: 24,
    right: 24,
    position: 'absolute',
    top: 50,
  },
  modalContentBottom: {
    backgroundColor: Colors.white,
    width: '100%',
    borderTopLeftRadius: Common.radiusLarge,
    borderTopRightRadius: Common.radiusLarge,
    padding: 24,
    position: 'absolute',
    bottom: 0,
  },
  titleText: {
    ...Fonts.titleSection,
    color: Colors.blackAbsolute,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    ...Fonts.contentBase,
    color: Colors.grayBase,
    textAlign: 'center',
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 120,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    ...Fonts.contentSmall,
    color: Colors.grayBase,
    textAlign: 'center',
    marginTop: 12,
  },
});
