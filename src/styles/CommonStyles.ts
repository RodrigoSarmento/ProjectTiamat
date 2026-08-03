import { StyleSheet } from 'react-native';

import * as Colors from './Colors';

export const CommonStyles = StyleSheet.create({
  flex1: { flex: 1 },
  safeAreaContainer: {
    flex: 1,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowCenterGap16: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  rowCenterGap8: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rowCenterGap4: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  columnSpaceBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columnCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    gap: 24,
  },
  bottomContainerForBottomTab: {
    position: 'absolute',
    bottom: 48,
    left: 24,
    right: 24,
    gap: 24,
  },
  paddingBottomForScrollView: { paddingBottom: 80 },
  marginHorizontal24: { marginHorizontal: 24 },
  marginTop24: { marginTop: 24 },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.borderColor,
  },
});
