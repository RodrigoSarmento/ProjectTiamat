import { useCallback, useMemo, useRef, useState } from 'react';

import { POC_COMBAT_DICE } from '@data/combat';
import {
  type CombatSlots,
  emptyCombatSlots,
  placeDieOnSlot,
  removeDieFromSlots,
  rollDie,
  selectedDice,
  summarizeCombatRoll,
} from '@helper/combatDice';

import type { CombatPhase } from './Combat.types';

export const useCombatPoc = () => {
  const dice = POC_COMBAT_DICE;
  const diceById = useMemo(
    () => Object.fromEntries(dice.map((die) => [die.id, die])),
    [dice],
  );
  const settledRef = useRef(0);

  const [slots, setSlots] = useState<CombatSlots>(emptyCombatSlots);
  const [phase, setPhase] = useState<CombatPhase>('pick');
  const [rolls, setRolls] = useState<Record<string, number>>({});
  const [rollGeneration, setRollGeneration] = useState(0);

  const trayDice = dice.filter((die) => !slots.includes(die.id));
  const trayRows = [
    trayDice
      .filter((die) => die.kind === 'attack')
      .sort((a, b) => b.sides - a.sides),
    trayDice
      .filter((die) => die.kind === 'defense')
      .sort((a, b) => b.sides - a.sides),
  ];
  const fieldDice = slots.map((id) => (id ? diceById[id] : undefined));
  const canDrag = phase === 'pick';
  const canRun = slots.every(Boolean) && phase === 'pick';
  const chosenDice = selectedDice(dice, slots);
  const summary = summarizeCombatRoll(chosenDice, rolls);

  const placeDie = (dieId: string, slotIndex: number) => {
    if (!canDrag) {
      return;
    }
    setSlots((current) => placeDieOnSlot(current, dieId, slotIndex));
  };

  const returnDie = (dieId: string) => {
    if (!canDrag) {
      return;
    }
    setSlots((current) => removeDieFromSlots(current, dieId));
  };

  const runAction = () => {
    if (!canRun) {
      return;
    }
    const nextRolls: Record<string, number> = {};
    chosenDice.forEach((die) => {
      nextRolls[die.id] = rollDie(die).value;
    });
    settledRef.current = 0;
    setRolls(nextRolls);
    setRollGeneration((value) => value + 1);
    setPhase('rolling');
  };

  const markSettled = useCallback(() => {
    settledRef.current += 1;
    if (settledRef.current >= 3) {
      setPhase('result');
    }
  }, []);

  const resetRound = () => {
    settledRef.current = 0;
    setSlots(emptyCombatSlots());
    setRolls({});
    setPhase('pick');
  };

  return {
    trayRows,
    fieldDice,
    phase,
    rolls,
    rollGeneration,
    canDrag,
    canRun,
    summary,
    placeDie,
    returnDie,
    runAction,
    markSettled,
    resetRound,
  };
};
