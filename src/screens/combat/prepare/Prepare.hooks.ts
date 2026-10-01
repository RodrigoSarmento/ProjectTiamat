import { useMemo, useState } from 'react';

import { getDice } from '@data/combat';
import {
  type CombatSlots,
  emptyCombatSlots,
  handSize,
  placeDieOnSlot,
  removeDieFromSlots,
  selectedDice,
} from '@helper/combatDice';
import type { RootState } from '@redux/store';
import { useSelector } from 'react-redux';

export const usePrepare = (deadIds: string[]) => {
  const deckIds = useSelector((state: RootState) => state.saves.dices);
  const savedNumOfDices = useSelector(
    (state: RootState) => state.saves.numOfDices,
  );
  const numOfDices = handSize(deckIds.length, savedNumOfDices);

  const dice = useMemo(
    () => getDice(deckIds.filter((id) => !deadIds.includes(id))),
    [deckIds, deadIds],
  );
  const diceById = useMemo(
    () => Object.fromEntries(dice.map((die) => [die.id, die])),
    [dice],
  );

  const [slots, setSlots] = useState<CombatSlots>(() =>
    emptyCombatSlots(numOfDices),
  );

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
  const isReady = slots.length > 0 && slots.every(Boolean);
  const chosenDice = selectedDice(dice, slots);

  const placeDie = (dieId: string, slotIndex: number) => {
    setSlots((current) => placeDieOnSlot(current, dieId, slotIndex));
  };

  const returnDie = (dieId: string) => {
    setSlots((current) => removeDieFromSlots(current, dieId));
  };

  return {
    trayRows,
    fieldDice,
    chosenDice,
    numOfDices,
    isReady,
    placeDie,
    returnDie,
  };
};
