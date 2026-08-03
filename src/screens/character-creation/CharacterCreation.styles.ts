import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';
import { newRocker } from '@styles/Font';

export const styles = StyleSheet.create({
  scrollContent: {
    marginLeft: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
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
    color: Colors.primaryColor,
  },
  saveButtonText: {
    ...newRocker,
    fontSize: 16,
    color: Colors.noInternet,
  },
});
