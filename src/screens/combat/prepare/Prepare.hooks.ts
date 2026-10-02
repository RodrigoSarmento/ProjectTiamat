import { useMemo, useRef, useState } from 'react';

import type {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import {
  type CombatSlots,
  type ICombatDie,
  emptyCombatSlots,
  handSize,
  placeDieOnSlot,
  removeDieFromSlots,
  selectedDice,
} from '@helper/combatDice';
import type { RootState } from '@redux/store';
import { useSelector } from 'react-redux';

import { TRAY_END_TOLERANCE, TRAY_VISIBLE_DICE } from './Prepare.constants';

export const usePrepare = (dice: ICombatDie[]) => {
  const savedNumOfDices = useSelector(
    (state: RootState) => state.saves.numOfDices,
  );
  const numOfDices = handSize(dice.length, savedNumOfDices);

  const diceById = useMemo(
    () => Object.fromEntries(dice.map((die) => [die.id, die])),
    [dice],
  );

  const [slots, setSlots] = useState<CombatSlots>(() =>
    emptyCombatSlots(numOfDices),
  );
  const [isTrayAtEnd, setIsTrayAtEnd] = useState(false);
  const trayScroll = useRef({ offset: 0, visible: 0, content: 0 });

  const updateTrayEnd = (next: Partial<typeof trayScroll.current>) => {
    trayScroll.current = { ...trayScroll.current, ...next };
    const { offset, visible, content } = trayScroll.current;
    setIsTrayAtEnd(
      visible > 0 && offset + visible >= content - TRAY_END_TOLERANCE,
    );
  };

  const onTrayScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    updateTrayEnd({
      offset: nativeEvent.contentOffset.x,
      visible: nativeEvent.layoutMeasurement.width,
      content: nativeEvent.contentSize.width,
    });
  };

  const onTrayLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    updateTrayEnd({ visible: nativeEvent.layout.width });
  };

  const onTrayContentSizeChange = (width: number) => {
    updateTrayEnd({ content: width });
  };

  const trayDice = dice.filter((die) => !slots.includes(die.id));
  const trayRows = [
    trayDice
      .filter((die) => die.kind === 'attack')
      .sort((a, b) => b.sides - a.sides),
    trayDice
      .filter((die) => die.kind === 'defense')
      .sort((a, b) => b.sides - a.sides),
  ];
  const canScrollTray =
    !isTrayAtEnd && trayRows.some((row) => row.length > TRAY_VISIBLE_DICE);
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
    canScrollTray,
    onTrayScroll,
    onTrayLayout,
    onTrayContentSizeChange,
    fieldDice,
    chosenDice,
    numOfDices,
    isReady,
    placeDie,
    returnDie,
  };
};
