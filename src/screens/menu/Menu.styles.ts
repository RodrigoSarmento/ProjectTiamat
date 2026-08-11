import { StyleSheet } from 'react-native';

import { Colors, Common, Fonts } from '@styles';

const styles = StyleSheet.create({
  // Screen
  container: {
    flex: 1,
    marginLeft: Common.screenWidth * 0.14,
  },

  // Top tabs
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 24,
    paddingVertical: 12,
    gap: 8,
  },
  tabButtonContainer: {
    flex: 1,
    aspectRatio: 1,
  },
  tabButton: {
    width: '100%',
    height: '100%',
  },

  // Lore layout
  loreContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  loreSidebar: {
    width: 100,
  },
  loreContentSeparator: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.blackAbsolute,
    opacity: 0.2,
  },
  loreContent: {
    flex: 1,
    maxWidth: Common.screenWidth * 0.5,
    gap: 2,
  },

  // Lore sidebar
  leftTopDivisorIcon: {
    width: '100%',
    height: 38,
    resizeMode: 'cover',
  },
  loreContentList: {
    gap: 16,
  },
  loreContentButton: {
    height: 40,
    justifyContent: 'center',
  },
  loreContentButtonActive: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 248, 230, 0.45)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.blackAbsolute,
  },
  loreContentTitle: {
    ...Fonts.titleGroup,
  },
  activeMarker: {
    width: 14,
    height: 14,
  },

  // Lore entries
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  topicIcon: {
    width: 14,
    height: 14,
    marginTop: 5,
  },
  loreTitle: {
    ...Fonts.titleBody,
  },
  loreDescription: {
    ...Fonts.contentBase,
  },
  divider: {
    width: '100%',
    height: 38,
    resizeMode: 'cover',
  },
});

export default styles;
