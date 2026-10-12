import {
  type BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { OptionsTabBar } from '@components/options-tab-bar';
import { translate } from '@helper/translate';
import { Deck } from '@screens/deck';
import { Lore } from '@screens/lore';
import { Options } from '@screens/options';

const Tab = createBottomTabNavigator<OptionsBottomTabNavigatorParamsList>();

const renderTabBar = (props: BottomTabBarProps) => <OptionsTabBar {...props} />;

const OptionsBottomTabNavigator = () => (
  <Tab.Navigator tabBar={renderTabBar} backBehavior="none">
    <Tab.Screen
      name="Deck"
      component={Deck}
      options={{ headerShown: false, title: translate('words.deck') }}
    />
    <Tab.Screen
      name="Lore"
      component={Lore}
      options={{ headerShown: false, title: translate('words.lore') }}
    />
    <Tab.Screen
      name="Options"
      component={Options}
      options={{ headerShown: false, title: translate('words.options') }}
    />
  </Tab.Navigator>
);

export default OptionsBottomTabNavigator;
