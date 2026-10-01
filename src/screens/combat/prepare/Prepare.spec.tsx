import { createRef } from 'react';

import type { CombatDieId } from '@data/combat';
import { EnemiesId, getEnemy } from '@data/story';
import { createTestStore, renderWithProviders } from '@test';
import { screen } from '@testing-library/react-native';

import type { ICombatRef } from '../Combat.types';

import Prepare from './Prepare';

type RenderOptions = {
  deadIds?: string[];
  numOfDices?: number;
  dices?: CombatDieId[];
};

const renderPrepare = ({
  deadIds = [],
  numOfDices = 3,
  dices,
}: RenderOptions = {}) => {
  const { saves } = createTestStore().getState();

  return renderWithProviders(
    <Prepare
      combatRef={createRef<ICombatRef>()}
      enemy={getEnemy(EnemiesId.enemy1)}
      enemyHealth={3}
      deadIds={deadIds}
    />,
    {
      preloadedState: {
        saves: { ...saves, numOfDices, dices: dices ?? saves.dices },
      },
    },
  );
};

describe('Prepare', () => {
  it('shows the enemy, the saved dice and one slot per numOfDices', async () => {
    const { saves } = createTestStore().getState();
    await renderPrepare({ numOfDices: 3 });

    expect(screen.getByTestId('CombatPrepare')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatantCard-enemy')).toBeOnTheScreen();
    expect(screen.getByText('3/5')).toBeOnTheScreen();
    saves.dices.forEach((id) => {
      expect(screen.getByTestId(`CombatDie-${id}`)).toBeOnTheScreen();
    });
    expect(screen.getByTestId('CombatPrepare-slot-0')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatPrepare-slot-1')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatPrepare-slot-2')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slot-3')).toBeNull();
    expect(screen.getByTestId('CombatPrepare-ready')).toBeDisabled();
  });

  it('caps the slots at the deck size when the deck is smaller than numOfDices', async () => {
    await renderPrepare({ numOfDices: 3, dices: ['attack-d4-a'] });

    expect(screen.getByTestId('CombatPrepare-slot-0')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatPrepare-slot-1')).toBeNull();
  });

  it('hides dice that are in morto and shows the morto count', async () => {
    await renderPrepare({ deadIds: ['attack-d4-a', 'defense-d8-a'] });

    expect(screen.queryByTestId('CombatDie-attack-d4-a')).toBeNull();
    expect(screen.queryByTestId('CombatDie-defense-d8-a')).toBeNull();
    expect(screen.getByTestId('CombatDie-attack-d6-a')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatPrepare-dead')).toHaveTextContent(
      'Morto: 2',
    );
  });
});
