import { StyleSheet } from 'react-native';

import { Colors, Fonts } from '@styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Fonts.titleBody,
    color: Colors.white,
  },
});
