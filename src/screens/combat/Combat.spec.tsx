import { getDice } from '@data/combat';
import { EnemiesId } from '@data/story';
import { renderWithProviders } from '@test';
import { fireEvent, screen } from '@testing-library/react-native';

import Combat from './Combat';
import type { IPrepare } from './prepare/Prepare.types';
import type { IRunning } from './running/Running.types';

const mockChosenDice = getDice(['attack-d4-a', 'defense-d6-a']);

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { enemyId: jest.requireActual('@data/story').EnemiesId.enemy1 },
  }),
}));

jest.mock('./prepare', () => {
  const { Pressable, Text } = jest.requireActual('react-native');

  return {
    Prepare: ({ combatRef, deadIds, enemyHealth }: IPrepare) => (
      <Pressable
        testID="CombatPrepare"
        onPress={() => {
          combatRef.current?.selectDice(mockChosenDice);
          combatRef.current?.next();
        }}
      >
        <Text>{`dead-${deadIds.length}`}</Text>
        <Text>{`enemyHp-${enemyHealth}`}</Text>
      </Pressable>
    ),
  };
});

jest.mock('./running', () => {
  const { Pressable, Text } = jest.requireActual('react-native');

  return {
    Running: ({ combatRef, dice, enemy }: IRunning) => (
      <>
        <Pressable
          testID="CombatRunning"
          onPress={() => combatRef.current?.next()}
        >
          <Text>{dice.map((die) => die.id).join(',')}</Text>
          <Text>{`enemy-${enemy.id}`}</Text>
        </Pressable>
        <Pressable
          testID="CombatRunning-overkill"
          onPress={() => {
            combatRef.current?.applyDamage('enemy', 99);
            combatRef.current?.goTo('prepare');
          }}
        />
      </>
    ),
  };
});

describe('Combat', () => {
  it('passes the selected dice and route enemy to running and advances via the ref', async () => {
    await renderWithProviders(<Combat />);

    expect(screen.getByTestId('CombatPrepare')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    expect(screen.getByTestId('CombatRunning')).toBeOnTheScreen();
    expect(
      screen.getByText(mockChosenDice.map((die) => die.id).join(',')),
    ).toBeOnTheScreen();
    expect(screen.getByText(`enemy-${EnemiesId.enemy1}`)).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare')).toBeNull();

    await fireEvent.press(screen.getByTestId('CombatRunning'));
    expect(screen.getByTestId('CombatFinalResult')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatFinalResult'));
    expect(screen.getByTestId('CombatPrepare')).toBeOnTheScreen();
  });

  it('sends the used dice to morto and clamps damage at 0 for the next prepare', async () => {
    await renderWithProviders(<Combat />);

    expect(screen.getByText('dead-0')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    await fireEvent.press(screen.getByTestId('CombatRunning-overkill'));

    expect(screen.getByText(`dead-${mockChosenDice.length}`)).toBeOnTheScreen();
    expect(screen.getByText('enemyHp-0')).toBeOnTheScreen();
  });
});
