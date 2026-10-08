import { createStackNavigator } from '@react-navigation/stack';

import type { RootState } from '@redux/store';
import { BackgroundSelect } from '@screens/background-select';
import { CharacterCreation } from '@screens/character-creation';
import { Combat } from '@screens/combat';
import { Game } from '@screens/game';
import { Start } from '@screens/start';
import { useSelector } from 'react-redux';

import { bookPageTransition } from './bookPageTransition';
import { combatTransition } from './combatTransition';

const Stack = createStackNavigator<GameStackParamsList>();

const GameStackNavigator = () => {
  const hasStarted = useSelector((state: RootState) => state.saves.hasStarted);

  return (
    <Stack.Navigator
      initialRouteName={hasStarted ? 'Game' : 'Start'}
      screenOptions={bookPageTransition}
    >
      <Stack.Screen name="Start" component={Start} />
      <Stack.Screen name="BackgroundSelect" component={BackgroundSelect} />
      <Stack.Screen name="Game" component={Game} />
      <Stack.Screen name="CharacterCreation" component={CharacterCreation} />
      <Stack.Screen
        name="Combat"
        component={Combat}
        options={combatTransition}
      />
    </Stack.Navigator>
  );
};

export default GameStackNavigator;
