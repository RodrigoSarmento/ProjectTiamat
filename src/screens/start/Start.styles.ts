import { StyleSheet } from 'react-native';

import { Colors, Common } from '@styles';
import { newRocker } from '@styles/Font';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: '10%',
  },
  startButton: {
    alignSelf: 'center',
    width: Common.screenWidth * 0.8,
    height: 100,
  },
  startButtonText: {
    ...newRocker,
    fontSize: 32,
    letterSpacing: 4,
    color: Colors.white,
  },
});
