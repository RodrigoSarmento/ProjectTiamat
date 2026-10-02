import { HAND_SIZE } from '@data/combat';
import { EnemiesId, getEnemy } from '@data/story';
import { STARTER_DICES, STARTER_NUM_OF_DICES } from '@redux/slices/SavesSlice';
import { renderWithProviders } from '@test';
import { fireEvent, screen } from '@testing-library/react-native';

import Combat from './Combat';
import { PLAYER_MAX_HEALTH } from './Combat.constants';
import type { IPrepare } from './prepare/Prepare.types';
import type { IRunning } from './running/Running.types';

const mockGoBack = jest.fn();
const STARTING_DECK = STARTER_DICES.length - HAND_SIZE;

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
  const { STARTER_NUM_OF_DICES: played } = jest.requireActual(
    '@redux/slices/SavesSlice',
  );

  return {
    Prepare: ({ combatRef, hand, deckCount, enemyHealth }: IPrepare) => (
      <Pressable
        testID="CombatPrepare"
        onPress={() => {
          combatRef.current?.selectDice(hand.slice(0, played));
          combatRef.current?.next();
        }}
      >
        <Text>{`hand-${hand.length}`}</Text>
        <Text>{`deck-${deckCount}`}</Text>
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

const playRound = async (outcome: 'hit' | 'lose' | 'overkill') => {
  await fireEvent.press(screen.getByTestId('CombatPrepare'));
  await fireEvent.press(screen.getByTestId(`CombatRunning-${outcome}`));
};

describe('Combat', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    jest.spyOn(Math, 'random').mockReturnValue(0.99);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('passes the cards played from the hand and the route enemy to running', async () => {
    await renderWithProviders(<Combat />);

    expect(screen.getByTestId('CombatPrepare')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    expect(screen.getByTestId('CombatRunning')).toBeOnTheScreen();
    expect(
      screen.getByText(
        STARTER_DICES.slice(0, STARTER_NUM_OF_DICES)
          .map((id, index) => `${id}#${index}`)
          .join(','),
      ),
    ).toBeOnTheScreen();
    expect(screen.getByText(`enemy-${EnemiesId.enemy1}`)).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare')).toBeNull();

    await fireEvent.press(screen.getByTestId('CombatRunning'));
    expect(screen.getByTestId('CombatFinalResult')).toBeOnTheScreen();
  });

  it('shows defeat with the defeat narrative and restarts the fight on retry', async () => {
    const enemyMaxHealth = getEnemy(EnemiesId.enemy1).health;
    await renderWithProviders(<Combat />);

    await playRound('hit');
    expect(screen.getByText(`enemyHp-${enemyMaxHealth - 1}`)).toBeOnTheScreen();
    expect(
      screen.getByText(`deck-${STARTING_DECK - STARTER_NUM_OF_DICES}`),
    ).toBeOnTheScreen();

    await playRound('lose');

    expect(screen.getByText('Derrota')).toBeOnTheScreen();
    expect(screen.getByText('defeat narrative')).toBeOnTheScreen();
    expect(screen.queryByText('defeat epilogue')).toBeNull();
    expect(screen.getByTestId('CombatFinalResult-next')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatFinalResult-narrative'));

    expect(screen.getByText('defeat epilogue')).toBeOnTheScreen();
    expect(screen.queryByText('defeat narrative')).toBeNull();
    expect(screen.queryByTestId('CombatFinalResult-next')).toBeNull();
    expect(screen.getByTestId('CombatFinalResult-continue')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatFinalResult-retry'));

    expect(screen.getByText(`enemyHp-${enemyMaxHealth}`)).toBeOnTheScreen();
    expect(screen.getByText(`hand-${HAND_SIZE}`)).toBeOnTheScreen();
    expect(screen.getByText(`deck-${STARTING_DECK}`)).toBeOnTheScreen();
    expect(mockGoBack).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    expect(screen.getByText(`playerHp-${PLAYER_MAX_HEALTH}`)).toBeOnTheScreen();
  });

  it('shows victory with the victory narrative and leaves combat on continue', async () => {
    await renderWithProviders(<Combat />);

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    await fireEvent.press(screen.getByTestId('CombatRunning-win'));

    expect(screen.getByText('Vitória')).toBeOnTheScreen();
    expect(screen.getByText('victory narrative')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatFinalResult-narrative'));

    expect(screen.getByText('victory epilogue')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatFinalResult-enemy')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatFinalResult-retry')).toBeNull();

    await fireEvent.press(screen.getByTestId('CombatFinalResult-continue'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('deals a full hand, refills it from the deck after a round, and clamps damage at 0', async () => {
    await renderWithProviders(<Combat />);

    expect(screen.getByText(`hand-${HAND_SIZE}`)).toBeOnTheScreen();
    expect(screen.getByText(`deck-${STARTING_DECK}`)).toBeOnTheScreen();

    await playRound('overkill');

    expect(screen.getByText(`hand-${HAND_SIZE}`)).toBeOnTheScreen();
    expect(
      screen.getByText(`deck-${STARTING_DECK - STARTER_NUM_OF_DICES}`),
    ).toBeOnTheScreen();
    expect(screen.getByText('enemyHp-0')).toBeOnTheScreen();
  });
});
