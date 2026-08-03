import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  pressable: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  textOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width: '70%',
    maxHeight: '70%',
    textAlign: 'center',
  },
});
