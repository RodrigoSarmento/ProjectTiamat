import type { RefObject } from 'react';
import { createRef } from 'react';

import { COMBAT_DICE, type CombatDieId, getDice } from '@data/combat';
import { EnemiesId, type IStoryEnemy, getEnemy } from '@data/story';
import { renderWithProviders } from '@test';
import { act, fireEvent, screen } from '@testing-library/react-native';

import { PLAYER_MAX_HEALTH } from '../Combat.constants';
import type { CombatHealth, ICombatRef } from '../Combat.types';

import Running from './Running';

const SETTLE_MS = 5000;

const highestFace = (id: CombatDieId) => Math.max(...COMBAT_DICE[id].faces);

const testEnemy: IStoryEnemy = {
  ...getEnemy(EnemiesId.enemy1),
  diceDeck: ['attack-d4-b', 'defense-d4-a'],
  numOfDices: 2,
};

const createCombatRef = () =>
  ({
    current: {
      next: jest.fn(),
      goTo: jest.fn(),
      selectDice: jest.fn(),
      applyDamage: jest.fn(),
    },
  }) as RefObject<ICombatRef> & { current: jest.Mocked<ICombatRef> };

const renderRunning = ({
  combatRef = createRef<ICombatRef>(),
  playerDice = ['attack-d4-a', 'defense-d6-a'],
  enemy = getEnemy(EnemiesId.enemy1),
  health,
}: {
  combatRef?: RefObject<ICombatRef | null>;
  playerDice?: CombatDieId[];
  enemy?: IStoryEnemy;
  health?: CombatHealth;
} = {}) =>
  renderWithProviders(
    <Running
      combatRef={combatRef}
      dice={getDice(playerDice)}
      enemy={enemy}
      health={health ?? { player: PLAYER_MAX_HEALTH, enemy: enemy.health }}
      hits={{}}
    />,
  );

const tap = () => fireEvent.press(screen.getByTestId('CombatRunning-tap'));

const settleRolls = () =>
  act(() => {
    jest.advanceTimersByTime(SETTLE_MS);
  });

describe('Running', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('shows both cards and the initiative toast before any dice', async () => {
    await renderRunning();

    expect(screen.getByTestId('CombatantCard-enemy')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatantCard-player')).toBeOnTheScreen();
    expect(screen.getByTestId('InitiativeToast')).toBeOnTheScreen();
    expect(screen.queryByTestId('CombatRunning-playerDice')).toBeNull();
  });

  it('waits on initiative until the screen is tapped', async () => {
    await renderRunning();

    await settleRolls();
    expect(screen.getByTestId('InitiativeToast')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatRunning-tapHint')).toHaveTextContent(
      'Toque para rolar',
    );
  });

  it('dismisses initiative on tap and shows the turn and both dice sides', async () => {
    await renderRunning();

    await tap();

    expect(screen.queryByTestId('InitiativeToast')).toBeNull();
    expect(screen.getByTestId('CombatRunning-turn')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatRunning-enemyDice')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatRunning-playerDice')).toBeOnTheScreen();
  });

  describe('with every die landing on its highest face', () => {
    const playerAttack = highestFace('attack-d8-b');
    const enemyDefense = highestFace('defense-d4-a');
    const enemyAttack = highestFace('attack-d4-b');
    const playerDamage = Math.max(0, playerAttack - enemyDefense);

    beforeEach(() => {
      jest.spyOn(Math, 'random').mockReturnValue(0.99);
    });

    it('trades both exchanges and returns to prepare when both survive', async () => {
      const combatRef = createCombatRef();
      await renderRunning({
        combatRef,
        playerDice: ['attack-d8-b'],
        enemy: testEnemy,
        health: { player: PLAYER_MAX_HEALTH, enemy: playerDamage + 1 },
      });

      await tap();
      await settleRolls();
      expect(combatRef.current.applyDamage).toHaveBeenCalledWith(
        'enemy',
        playerDamage,
      );
      expect(screen.getByTestId('CombatRunning-tapHint')).toHaveTextContent(
        'Toque para continuar',
      );

      await tap();
      await settleRolls();
      expect(combatRef.current.applyDamage).toHaveBeenCalledWith(
        'player',
        enemyAttack,
      );

      await tap();
      expect(combatRef.current.goTo).toHaveBeenCalledWith('prepare');
      expect(combatRef.current.goTo).not.toHaveBeenCalledWith('finalResult');
    });

    it('goes to the final result once the defender reaches 0', async () => {
      const combatRef = createCombatRef();
      await renderRunning({
        combatRef,
        playerDice: ['attack-d8-b'],
        enemy: testEnemy,
        health: { player: PLAYER_MAX_HEALTH, enemy: playerDamage },
      });

      await tap();
      await settleRolls();
      await tap();

      expect(combatRef.current.applyDamage).toHaveBeenCalledWith(
        'enemy',
        playerDamage,
      );
      expect(combatRef.current.goTo).toHaveBeenCalledWith('finalResult');
      expect(combatRef.current.applyDamage).toHaveBeenCalledTimes(1);
    });
  });
});
