import { createStackNavigator } from '@react-navigation/stack';

import { CharacterCreation } from '@screens/character-creation';
import { Game } from '@screens/game';
import { Menu } from '@screens/menu';
import { Start } from '@screens/start';

import { bookPageTransition } from './bookPageTransition';

const Stack = createStackNavigator<GameStackParamsList>();

const GameStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Start" // TODO: If user already started the game, go to main screen
      screenOptions={bookPageTransition}
    >
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="CharacterCreation" component={CharacterCreation} />
      <Stack.Screen name="Game" component={Game} />
      <Stack.Screen name="Menu" component={Menu} />
    </Stack.Navigator>
  );
};

export default GameStackNavigator;
