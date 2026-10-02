import { createRef } from 'react';

import { type CombatDieId, getDice } from '@data/combat';
import { EnemiesId, getEnemy } from '@data/story';
import { toCards } from '@helper/combatDice';
import { createTestStore, renderWithProviders } from '@test';
import { fireEvent, screen } from '@testing-library/react-native';

import type { ICombatRef } from '../Combat.types';

import Prepare from './Prepare';

const handIds: CombatDieId[] = [
  'attack-d4-a',
  'attack-d6-a',
  'defense-d4-a',
  'defense-d4-a',
];

type RenderOptions = {
  hand?: CombatDieId[];
  deckCount?: number;
  numOfDices?: number;
};

const renderPrepare = ({
  hand = handIds,
  deckCount = 4,
  numOfDices = 3,
}: RenderOptions = {}) => {
  const { saves } = createTestStore().getState();

  return renderWithProviders(
    <Prepare
      combatRef={createRef<ICombatRef>()}
      enemy={getEnemy(EnemiesId.enemy1)}
      enemyHealth={3}
      hand={toCards(getDice(hand))}
      deckCount={deckCount}
    />,
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

  it('caps the slots at the hand size when the hand is smaller than numOfDices', async () => {
    await renderPrepare({ numOfDices: 3, hand: ['attack-d4-a'] });

    expect(screen.getByTestId('CombatPrepare-slot-0')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slot-1')).toBeNull();
  });

  it('hides the scroll arrow while every row fits on screen', async () => {
    await renderPrepare();

    expect(screen.queryByTestId('CombatPrepare-scrollHint')).toBeNull();
  });

  it('shows the scroll arrow once a row has more dice than fit on screen', async () => {
    await renderPrepare({
      hand: [
        'attack-d4-a',
        'attack-d4-b',
        'attack-d6-a',
        'attack-d6-b',
        'attack-d8-a',
        'defense-d4-a',
      ],
    });

    expect(screen.getByTestId('CombatPrepare-scrollHint')).toBeOnTheScreen();
  });

  it('hides the scroll arrow once the tray is scrolled all the way right', async () => {
    await renderPrepare({
      hand: [
        'attack-d4-a',
        'attack-d4-b',
        'attack-d6-a',
        'attack-d6-b',
        'attack-d8-a',
      ],
    });
    const scrollTo = (x: number) =>
      fireEvent.scroll(screen.getByTestId('CombatPrepare-tray'), {
        nativeEvent: {
          contentOffset: { x, y: 0 },
          layoutMeasurement: { width: 300, height: 100 },
          contentSize: { width: 500, height: 100 },
        },
      });

    await scrollTo(200);
    expect(screen.queryByTestId('CombatPrepare-scrollHint')).toBeNull();

    await scrollTo(0);
    expect(screen.getByTestId('CombatPrepare-scrollHint')).toBeOnTheScreen();
  });

  it('shows how many cards are left in the deck', async () => {
    await renderPrepare({ deckCount: 2 });

    expect(screen.getByTestId('CombatPrepare-deck')).toHaveTextContent(
      'Deck: 2',
    );
  });
});
