import { StyleSheet } from 'react-native';

import { Colors } from '@styles';
import { semiBold } from '@styles/Font';

import { TAB_HEIGHT } from './OptionsTabBar.constants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    paddingTop: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.blackAbsolute,
    borderTopWidth: 1,
    borderTopColor: 'rgba(60, 246, 255, 0.3)',
  },
  tab: {
    flex: 1,
    height: TAB_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabPressed: {
    opacity: 0.7,
  },
  label: {
    ...semiBold,
    fontSize: 18,
    letterSpacing: 0.5,
    color: Colors.neonMagenta,
  },
  labelActive: {
    color: Colors.neonCyan,
  },
});
