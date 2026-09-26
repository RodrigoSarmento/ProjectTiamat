import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';
import { newRocker } from '@styles/Font';

export const styles = StyleSheet.create({
  scrollContent: {
    marginLeft: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 12,
  },
  title: {
    ...Fonts.titleScreen,
    color: Colors.white,
  },
  button: {
    alignSelf: 'center',
    width: 200,
    height: 200,
  },
  pointsBlock: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsValue: {
    ...Fonts.numberDisplay,
    color: Colors.neonMagenta,
  },
  saveButtonText: {
    ...newRocker,
    fontSize: 16,
    letterSpacing: 1,
    color: Colors.white,
  },
  nameInput: {
    ...Fonts.contentBase,
    borderWidth: 1,
    borderColor: Colors.grayLightText,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 16,
    color: Colors.blackPrimary,
  },
  nameSaveButton: {
    alignSelf: 'center',
    width: 180,
    height: 72,
  },
});
