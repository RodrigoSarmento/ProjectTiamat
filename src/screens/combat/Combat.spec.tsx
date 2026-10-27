import {
  COMBAT_DICE,
  type CombatDieId,
  HAND_SIZE,
  getDice,
} from '@data/combat';
import { EnemiesId, getEnemy } from '@data/story';
import { dealHand, playCards, toCards } from '@helper/combatDice';
import savesReducer, {
  STARTER_DICES,
  STARTER_NUM_OF_DICES,
} from '@redux/slices/SavesSlice';
import { renderWithProviders } from '@test';
import { fireEvent, screen } from '@testing-library/react-native';

import Combat from './Combat';
import { PLAYER_MAX_HEALTH } from './Combat.constants';
import type { IPrepare } from './prepare/Prepare.types';
import type { IRunning } from './running/Running.types';

const mockGoBack = jest.fn();
const LONG_DECK = (Object.keys(COMBAT_DICE) as CombatDieId[])
  .filter((id) => !id.startsWith('enemy-'))
  .slice(0, HAND_SIZE + STARTER_NUM_OF_DICES + 1);
const LONG_HAND = Math.min(HAND_SIZE, LONG_DECK.length);
const LONG_DECK_LEFT = LONG_DECK.length - LONG_HAND;
const AFTER_ROUND_DECK = LONG_DECK_LEFT - STARTER_NUM_OF_DICES;

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
    Prepare: ({
      combatRef,
      hand,
      deckCount,
      discardCount,
      enemyHealth,
    }: IPrepare) => (
      <Pressable
        testID="CombatPrepare"
        onPress={() => {
          combatRef.current?.selectDice(hand.slice(0, played));
          combatRef.current?.next();
        }}
      >
        <Text>{`hand-${hand.length}`}</Text>
        <Text>{`deck-${deckCount}`}</Text>
        <Text>{`discard-${discardCount}`}</Text>
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

const renderLongCombat = () => {
  const saves = savesReducer(undefined, { type: '@@INIT' });

  return renderWithProviders(<Combat />, {
    preloadedState: { saves: { ...saves, dices: LONG_DECK } },
  });
};

const playedCardIds = () =>
  LONG_DECK.slice(0, STARTER_NUM_OF_DICES)
    .map((id, index) => `${id}#${index}`)
    .join(',');

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
    await renderLongCombat();

    await playRound('hit');
    expect(screen.getByText(`enemyHp-${enemyMaxHealth - 1}`)).toBeOnTheScreen();
    expect(screen.getByText(`deck-${AFTER_ROUND_DECK}`)).toBeOnTheScreen();

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
    expect(screen.getByText(`hand-${LONG_HAND}`)).toBeOnTheScreen();
    expect(screen.getByText(`deck-${LONG_DECK_LEFT}`)).toBeOnTheScreen();
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

  it('buys from the deck until the hand is empty, then deals again from morto', async () => {
    const keepOrder = () => 0.99;
    let piles = dealHand(toCards(getDice(STARTER_DICES)), HAND_SIZE, keepOrder);
    const play = () => {
      piles = playCards(
        piles,
        piles.hand.slice(0, STARTER_NUM_OF_DICES).map((die) => die.id),
        HAND_SIZE,
        keepOrder,
      );
    };
    const expectPiles = () => {
      expect(screen.getByText(`hand-${piles.hand.length}`)).toBeOnTheScreen();
      expect(
        screen.getByText(`deck-${piles.drawPile.length}`),
      ).toBeOnTheScreen();
      expect(
        screen.getByText(`discard-${piles.discard.length}`),
      ).toBeOnTheScreen();
    };

    await renderWithProviders(<Combat />);

    expect(piles.hand).toHaveLength(HAND_SIZE);
    expect(piles.drawPile).toHaveLength(STARTER_DICES.length - HAND_SIZE);
    expectPiles();

    await playRound('hit');
    play();
    expect(piles.hand).toHaveLength(6);
    expect(piles.drawPile).toHaveLength(0);
    expect(piles.discard).toHaveLength(STARTER_NUM_OF_DICES);
    expectPiles();

    await playRound('hit');
    play();
    expect(piles.hand).toHaveLength(3);
    expect(piles.discard).toHaveLength(STARTER_NUM_OF_DICES * 2);
    expectPiles();

    await playRound('hit');
    play();
    expect(piles.hand).toHaveLength(HAND_SIZE);
    expect(piles.drawPile).toHaveLength(STARTER_DICES.length - HAND_SIZE);
    expect(piles.discard).toEqual([]);
    expectPiles();
  });

  it('deals a full hand, redraws the cards that were played, and clamps damage at 0', async () => {
    await renderLongCombat();

    expect(screen.getByText(`hand-${LONG_HAND}`)).toBeOnTheScreen();
    expect(screen.getByText(`deck-${LONG_DECK_LEFT}`)).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('CombatPrepare'));
    expect(screen.getByText(playedCardIds())).toBeOnTheScreen();
    await fireEvent.press(screen.getByTestId('CombatRunning-overkill'));

    expect(screen.getByText(`hand-${LONG_HAND}`)).toBeOnTheScreen();
    expect(screen.getByText(`deck-${AFTER_ROUND_DECK}`)).toBeOnTheScreen();
    expect(screen.getByText('enemyHp-0')).toBeOnTheScreen();
  });
});
