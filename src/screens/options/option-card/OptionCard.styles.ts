import { StyleSheet } from 'react-native';

import { Colors } from '@styles';
import { regular } from '@styles/Font';

export const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  pressed: {
    opacity: 0.7,
  },
  marker: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 7,
    height: 7,
    backgroundColor: Colors.neonCyan,
  },
  label: {
    ...regular,
    fontSize: 20,
    letterSpacing: 0.5,
    color: Colors.white,
  },
  labelDanger: {
    color: Colors.warningRed,
  },
});
