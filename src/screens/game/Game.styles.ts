import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bookmarkMenuContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bookmarkMenuButton: {
    width: 100,
    height: 200,
    resizeMode: 'contain',
  },
  mapButton: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  mapButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 54,
  },
});
