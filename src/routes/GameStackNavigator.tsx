import { createStackNavigator } from '@react-navigation/stack';

import { CharacterCreation } from '@screens/character-creation';
import { Game } from '@screens/game';
import { Start } from '@screens/start';
import type { RootState } from '@redux/store';
import { useSelector } from 'react-redux';

import { bookPageTransition } from './bookPageTransition';

const Stack = createStackNavigator<GameStackParamsList>();

const GameStackNavigator = () => {
  const hasStarted = useSelector((state: RootState) => state.saves.hasStarted);

  return (
    <Stack.Navigator
      initialRouteName={hasStarted ? 'Game' : 'Start'}
      screenOptions={bookPageTransition}
    >
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen
        name="Game"
        component={Game}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="CharacterCreation" component={CharacterCreation} />
    </Stack.Navigator>
  );
};

export default GameStackNavigator;
