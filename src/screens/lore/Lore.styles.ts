import { StyleSheet } from 'react-native';

import { Common } from '@styles';

export const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Common.contentPaddingHorizontal,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
  },
  list: {
    gap: 14,
    paddingBottom: 16,
  },
});
