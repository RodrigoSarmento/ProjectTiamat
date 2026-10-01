import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { CombatantSide } from '@components/combatant-card';
import { getDice } from '@data/combat';
import {
  diceOfKind,
  drawDice,
  resolveExchange,
  rollDice,
  rollInitiative,
} from '@helper/combatDice';

import { EMPTY_EXCHANGE_MS } from './Running.constants';
import type { IRunning, RunningPhase } from './Running.types';

export const useRunning = ({ combatRef, dice, enemy, health }: IRunning) => {
  const [initiative] = useState(() => rollInitiative());
  const [enemyDice] = useState(() =>
    drawDice(getDice(enemy.diceDeck), enemy.numOfDices),
  );
  const order = useMemo<CombatantSide[]>(
    () => (initiative.playerFirst ? ['player', 'enemy'] : ['enemy', 'player']),
    [initiative.playerFirst],
  );

  const [phase, setPhase] = useState<RunningPhase>('initiative');
  const [exchange, setExchange] = useState(0);
  const [rolls, setRolls] = useState<Record<string, number>>({});
  const settledRef = useRef(0);
  const isOverRef = useRef(false);

  const sidesFor = useCallback(
    (attacker: CombatantSide) => {
      const playerAttacks = attacker === 'player';
      return {
        playerDice: diceOfKind(dice, playerAttacks ? 'attack' : 'defense'),
        enemySideDice: diceOfKind(
          enemyDice,
          playerAttacks ? 'defense' : 'attack',
        ),
      };
    },
    [dice, enemyDice],
  );

  const attacker = order[exchange];
  const defender: CombatantSide = attacker === 'player' ? 'enemy' : 'player';
  const playerAttacks = attacker === 'player';
  const { playerDice, enemySideDice } = sidesFor(attacker);
  const attackDice = playerAttacks ? playerDice : enemySideDice;
  const defenseDice = playerAttacks ? enemySideDice : playerDice;
  const rollingCount = playerDice.length + enemySideDice.length;
  const result = resolveExchange(attackDice, defenseDice, rolls);

  const beginExchange = useCallback(
    (index: number) => {
      const sides = sidesFor(order[index]);
      settledRef.current = 0;
      setExchange(index);
      setRolls(rollDice([...sides.playerDice, ...sides.enemySideDice]));
      setPhase('rolling');
    },
    [order, sidesFor],
  );

  const finishExchange = () => {
    isOverRef.current = health[defender] - result.damage <= 0;
    if (result.damage > 0) {
      combatRef.current?.applyDamage(defender, result.damage);
    }
    setPhase('result');
  };

  const markSettled = () => {
    settledRef.current += 1;
    if (settledRef.current === rollingCount) {
      finishExchange();
    }
  };

  const advance = () => {
    if (phase === 'initiative') {
      beginExchange(0);
    } else if (phase === 'result') {
      if (isOverRef.current) {
        combatRef.current?.goTo('finalResult');
      } else if (exchange < order.length - 1) {
        beginExchange(exchange + 1);
      } else {
        combatRef.current?.goTo('prepare');
      }
    }
  };

  const finishRef = useRef(finishExchange);
  useEffect(() => {
    finishRef.current = finishExchange;
  });

  useEffect(() => {
    if (phase !== 'rolling' || rollingCount > 0) {
      return;
    }
    const timer = setTimeout(() => finishRef.current(), EMPTY_EXCHANGE_MS);
    return () => clearTimeout(timer);
  }, [phase, rollingCount]);

  return {
    initiative,
    phase,
    exchange,
    rolls,
    playerAttacks,
    playerDice,
    enemySideDice,
    result,
    markSettled,
    advance,
  };
};
