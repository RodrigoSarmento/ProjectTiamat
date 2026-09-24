import { createStackNavigator } from '@react-navigation/stack';

import { Game } from '@screens/game';
import { Start } from '@screens/start';

import { bookPageTransition } from './bookPageTransition';

const Stack = createStackNavigator<GameStackParamsList>();

const GameStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Start" screenOptions={bookPageTransition}>
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen
        name="Game"
        component={Game}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};

export default GameStackNavigator;
