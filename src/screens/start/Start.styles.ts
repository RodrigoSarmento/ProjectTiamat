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
    width: Common.screenWidth,
    height: 100,
    resizeMode: 'cover',
  },
  startButtonText: {
    ...newRocker,
    fontSize: 32,
    color: Colors.blackPrimary,
  },
});
