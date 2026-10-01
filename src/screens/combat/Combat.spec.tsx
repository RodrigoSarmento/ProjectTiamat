import { getDice } from '@data/combat';
import { EnemiesId, getEnemy } from '@data/story';
import { renderWithProviders } from '@test';
import { fireEvent, screen } from '@testing-library/react-native';

import Combat from './Combat';
import { PLAYER_MAX_HEALTH } from './Combat.constants';
import type { IPrepare } from './prepare/Prepare.types';
import type { IRunning } from './running/Running.types';

const mockChosenDice = getDice(['attack-d4-a', 'defense-d6-a']);
const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
  useRoute: () => ({
    params: {
      enemyId: jest.requireActual('@data/story').EnemiesId.enemy1,
      victoryText: ['victory narrative', 'victory epilogue'],
      defeatText: ['defeat narrative', 'defeat epilogue'],
    },
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
    Running: ({ combatRef, dice, enemy, health }: IRunning) => (
      <>
        <Pressable
          testID="CombatRunning"
          onPress={() => combatRef.current?.next()}
        >
          <Text>{dice.map((die) => die.id).join(',')}</Text>
          <Text>{`enemy-${enemy.id}`}</Text>
          <Text>{`playerHp-${health.player}`}</Text>
        </Pressable>
        <Pressable
          testID="CombatRunning-hit"
          onPress={() => {
            combatRef.current?.applyDamage('enemy', 1);
            combatRef.current?.goTo('prepare');
          }}
        />
        <Pressable
          testID="CombatRunning-lose"
          onPress={() => {
            combatRef.current?.applyDamage('player', 99);
            combatRef.current?.goTo('finalResult');
          }}
        />
        <Pressable
          testID="CombatRunning-overkill"
          onPress={() => {
            combatRef.current?.applyDamage('enemy', 99);
            combatRef.current?.goTo('prepare');
          }}
        />
        <Pressable
          testID="CombatRunning-win"
          onPress={() => {
            combatRef.current?.applyDamage('enemy', 99);
            combatRef.current?.goTo('finalResult');
          }}
        />
      </>
    ),
  };
});

describe('Combat', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
  });

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
  });

  it('shows defeat with the defeat narrative and restarts the fight on retry', async () => {
    const enemyMaxHealth = getEnemy(EnemiesId.enemy1).health;
    await renderWithProviders(<Combat />);

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    await fireEvent.press(screen.getByTestId('CombatRunning-hit'));
    expect(screen.getByText(`enemyHp-${enemyMaxHealth - 1}`)).toBeOnTheScreen();
    expect(screen.getByText(`dead-${mockChosenDice.length}`)).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    await fireEvent.press(screen.getByTestId('CombatRunning-lose'));

    expect(screen.getByText('Derrota')).toBeOnTheScreen();
    expect(screen.getByText('defeat narrative')).toBeOnTheScreen();
    expect(screen.getByText('defeat epilogue')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatFinalResult-continue')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatFinalResult-retry'));

    expect(screen.getByText(`enemyHp-${enemyMaxHealth}`)).toBeOnTheScreen();
    expect(screen.getByText('dead-0')).toBeOnTheScreen();
    expect(mockGoBack).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    expect(
      screen.getByText(`playerHp-${PLAYER_MAX_HEALTH}`),
    ).toBeOnTheScreen();
  });

  it('shows victory with the victory narrative and leaves combat on continue', async () => {
    await renderWithProviders(<Combat />);

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    await fireEvent.press(screen.getByTestId('CombatRunning-win'));

    expect(screen.getByText('Vitória')).toBeOnTheScreen();
    expect(screen.getByText('victory narrative')).toBeOnTheScreen();
    expect(screen.getByText('victory epilogue')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatFinalResult-enemy')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatFinalResult-retry')).toBeNull();

    await fireEvent.press(screen.getByTestId('CombatFinalResult-continue'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
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
