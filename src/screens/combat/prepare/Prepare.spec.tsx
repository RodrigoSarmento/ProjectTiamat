import { createRef } from 'react';

import { type CombatDieId, getDice } from '@data/combat';
import { EnemiesId, getEnemy } from '@data/story';
import { toCards } from '@helper/combatDice';
import { createTestStore, renderWithProviders } from '@test';
import { fireEvent, screen, within } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { ICombatRef } from '../Combat.types';

import Prepare from './Prepare';
import { TRAY_HEIGHT } from './Prepare.constants';

const handIds: CombatDieId[] = [
  'attack-d4-level1-a',
  'attack-d4-level1-c',
  'defense-d4-level1-a',
  'counter-d4-level1-c',
];

type RenderOptions = {
  hand?: CombatDieId[];
  deckCount?: number;
  discardCount?: number;
  numOfDices?: number;
};

const renderPrepare = ({
  hand = handIds,
  deckCount = 4,
  discardCount = 0,
  numOfDices = 3,
}: RenderOptions = {}) => {
  const { saves } = createTestStore().getState();

  return renderWithProviders(
    <GestureHandlerRootView>
      <Prepare
        combatRef={createRef<ICombatRef>()}
        enemy={getEnemy(EnemiesId.enemy1)}
        enemyHealth={3}
        hand={toCards(getDice(hand))}
        deckCount={deckCount}
        discardCount={discardCount}
      />
    </GestureHandlerRootView>,
    { preloadedState: { saves: { ...saves, numOfDices } } },
  );
};

describe('Prepare', () => {
  it('shows the enemy, every card in hand and one slot per numOfDices', async () => {
    await renderPrepare({ numOfDices: 3 });

    expect(screen.getByTestId('CombatPrepare')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatantCard-enemy')).toBeOnTheScreen();
    expect(screen.getByText('3/5')).toBeOnTheScreen();
    toCards(getDice(handIds)).forEach(({ id }) => {
      expect(screen.getByTestId(`CombatDie-${id}`)).toBeOnTheScreen();
    });
    expect(screen.getByTestId('CombatPrepare-slot-0')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatPrepare-slot-1')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatPrepare-slot-2')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slot-3')).toBeNull();
    expect(screen.getByTestId('CombatPrepare-ready')).toBeDisabled();
  });

  it('caps the slots at five even when the save asks for more', async () => {
    await renderPrepare({
      numOfDices: 9,
      hand: [
        'attack-d4-level1-a',
        'attack-d4-level1-b',
        'attack-d4-level1-c',
        'defense-d4-level1-a',
        'defense-d6-level1-b',
        'counter-d4-level1-c',
      ],
    });

    expect(screen.getByTestId('CombatPrepare-slot-4')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slot-5')).toBeNull();
    expect(
      within(screen.getByTestId('CombatPrepare-slotRow-0')).getByTestId(
        'CombatPrepare-slot-2',
      ),
    ).toBeOnTheScreen();
    expect(
      within(screen.getByTestId('CombatPrepare-slotRow-1')).getByTestId(
        'CombatPrepare-slot-3',
      ),
    ).toBeOnTheScreen();
    expect(
      within(screen.getByTestId('CombatPrepare-slotRow-1')).queryByTestId(
        'CombatPrepare-slot-2',
      ),
    ).toBeNull();
  });

  it('lays four slots out as two rows of two', async () => {
    await renderPrepare({
      numOfDices: 4,
      hand: [
        'attack-d4-level1-a',
        'attack-d4-level1-b',
        'attack-d4-level1-c',
        'defense-d4-level1-a',
      ],
    });

    expect(
      within(screen.getByTestId('CombatPrepare-slotRow-0')).getByTestId(
        'CombatPrepare-slot-1',
      ),
    ).toBeOnTheScreen();
    expect(
      within(screen.getByTestId('CombatPrepare-slotRow-1')).getByTestId(
        'CombatPrepare-slot-2',
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slotRow-2')).toBeNull();
  });

  it('caps the slots at the hand size when the hand is smaller than numOfDices', async () => {
    await renderPrepare({ numOfDices: 3, hand: ['attack-d4-level1-a'] });

    expect(screen.getByTestId('CombatPrepare-slot-0')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slot-1')).toBeNull();
  });

  it('keeps the hand in two rows of four at a fixed height', async () => {
    await renderPrepare({
      hand: [
        'attack-d4-level1-a',
        'attack-d4-level1-b',
        'attack-d4-level1-c',
        'attack-d6-level1-b',
        'attack-d8-level1-b',
        'attack-d8-level1-c',
        'defense-d4-level1-a',
        'counter-d4-level1-c',
      ],
    });

    expect(screen.getByTestId('CombatPrepare-tray')).toHaveStyle({
      height: TRAY_HEIGHT,
    });
    expect(screen.getByTestId('CombatPrepare-trayRow-0')).toHaveStyle({
      justifyContent: 'space-between',
    });
    expect(
      within(screen.getByTestId('CombatPrepare-trayRow-0')).getAllByTestId(
        /CombatDie-/,
      ),
    ).toHaveLength(4);
    expect(
      within(screen.getByTestId('CombatPrepare-trayRow-1')).getAllByTestId(
        /CombatDie-/,
      ),
    ).toHaveLength(4);
    expect(screen.queryByTestId('CombatPrepare-trayRow-2')).toBeNull();
  });

  it('hides the scroll arrow while the hand fits in the tray', async () => {
    await renderPrepare();

    expect(screen.queryByTestId('CombatPrepare-scrollHint')).toBeNull();
  });

  it('shows the scroll arrow when the dice run past the tray', async () => {
    await renderPrepare();
    fireEvent.scroll(screen.getByTestId('CombatPrepare-tray'), {
      nativeEvent: {
        contentOffset: { x: 0, y: 0 },
        layoutMeasurement: { width: 300, height: 200 },
        contentSize: { width: 500, height: 200 },
      },
    });

    expect(screen.getByTestId('CombatPrepare-scrollHint')).toHaveTextContent(
      '▶',
    );
  });

  it('hides the scroll arrow once the tray is scrolled to the end', async () => {
    await renderPrepare();
    const scrollTo = (x: number) =>
      fireEvent.scroll(screen.getByTestId('CombatPrepare-tray'), {
        nativeEvent: {
          contentOffset: { x, y: 0 },
          layoutMeasurement: { width: 300, height: 200 },
          contentSize: { width: 500, height: 200 },
        },
      });

    await scrollTo(400);
    expect(screen.queryByTestId('CombatPrepare-scrollHint')).toBeNull();

    await scrollTo(0);
    expect(screen.getByTestId('CombatPrepare-scrollHint')).toBeOnTheScreen();
  });

  it('shows how many cards are left in the deck and in morto', async () => {
    await renderPrepare({ deckCount: 2, discardCount: 3 });

    expect(screen.getByTestId('CombatPrepare-deck')).toHaveTextContent(
      'Deck: 2',
    );
    expect(screen.getByTestId('CombatPrepare-discard')).toHaveTextContent(
      'Morto: 3',
    );
  });
});
