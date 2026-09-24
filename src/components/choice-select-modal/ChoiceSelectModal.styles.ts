import { StyleSheet } from 'react-native';

import { Common } from '@styles';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    width: '100%',
    backgroundColor: 'rgba(10, 10, 16, 0.96)',
    borderTopLeftRadius: Common.radiusLarge,
    borderTopRightRadius: Common.radiusLarge,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
});
