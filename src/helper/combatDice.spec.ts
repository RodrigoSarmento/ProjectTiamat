import { POC_COMBAT_DICE } from '@data/combat';

import {
  containsPoint,
  emptyCombatSlots,
  formatFace,
  hitSlotIndex,
  placeDieOnSlot,
  removeDieFromSlots,
  restFace,
  rollDie,
  selectedDice,
  summarizeCombatRoll,
} from './combatDice';

describe('combatDice', () => {
  it('builds a poc deck of 2d4, 4d6, 2d8 split into 4 attack and 4 defense', () => {
    const sides = POC_COMBAT_DICE.map((die) => die.sides);
    const kinds = POC_COMBAT_DICE.map((die) => die.kind);

    expect(POC_COMBAT_DICE).toHaveLength(8);
    expect(sides.filter((value) => value === 4)).toHaveLength(2);
    expect(sides.filter((value) => value === 6)).toHaveLength(4);
    expect(sides.filter((value) => value === 8)).toHaveLength(2);
    expect(kinds.filter((value) => value === 'attack')).toHaveLength(4);
    expect(kinds.filter((value) => value === 'defense')).toHaveLength(4);
    expect(
      POC_COMBAT_DICE.every((die) => die.faces.length === die.sides),
    ).toBe(true);
    expect(POC_COMBAT_DICE.some((die) => die.faces.includes(0))).toBe(true);
    expect(POC_COMBAT_DICE.some((die) => die.faces.some((face) => face > 0))).toBe(
      true,
    );
  });

  it('hides a miss and prefixes hits', () => {
    expect(formatFace(0)).toBe('');
    expect(formatFace(3)).toBe('+3');
    expect(restFace({ id: 'x', sides: 4, kind: 'attack', faces: [0, 1, 1, 2] })).toBe(
      1,
    );
  });

  it('rolls a deterministic face from the supplied random', () => {
    const die = POC_COMBAT_DICE[0];

    expect(rollDie(die, () => 0)).toEqual({
      faceIndex: 0,
      value: die.faces[0],
    });
    expect(rollDie(die, () => 0.99)).toEqual({
      faceIndex: die.faces.length - 1,
      value: die.faces[die.faces.length - 1],
    });
  });

  it('places, swaps, and returns dice on the three slots', () => {
    let slots = emptyCombatSlots();
    slots = placeDieOnSlot(slots, 'attack-d4', 0);
    slots = placeDieOnSlot(slots, 'defense-d8', 2);

    expect(slots).toEqual(['attack-d4', null, 'defense-d8']);

    slots = placeDieOnSlot(slots, 'attack-d4', 2);
    expect(slots).toEqual(['defense-d8', null, 'attack-d4']);

    slots = placeDieOnSlot(slots, 'attack-d6-a', 1);
    expect(slots).toEqual(['defense-d8', 'attack-d6-a', 'attack-d4']);

    slots = placeDieOnSlot(slots, 'defense-d4', 1);
    expect(slots).toEqual(['defense-d8', 'defense-d4', 'attack-d4']);

    expect(removeDieFromSlots(slots, 'defense-d4')).toEqual([
      'defense-d8',
      null,
      'attack-d4',
    ]);
  });

  it('summarizes attack, defense, hits and misses', () => {
    const dice = selectedDice(POC_COMBAT_DICE, [
      'attack-d4',
      'attack-d8',
      'defense-d4',
    ]);

    expect(summarizeCombatRoll(dice, {
      'attack-d4': 2,
      'attack-d8': 0,
      'defense-d4': 1,
    })).toEqual({
      values: [2, 0, 1],
      attack: 2,
      defense: 1,
      total: 3,
      hits: 2,
      misses: 1,
    });
  });

  it('hits a window rect and finds the slot under a point', () => {
    const tray = { x: 0, y: 0, width: 100, height: 40 };
    const slots = [
      { x: 10, y: 80, width: 40, height: 40 },
      { x: 60, y: 80, width: 40, height: 40 },
      null,
    ];

    expect(containsPoint(tray, 20, 10)).toBe(true);
    expect(containsPoint(tray, 200, 10)).toBe(false);
    expect(hitSlotIndex(slots, 70, 90)).toBe(1);
    expect(hitSlotIndex(slots, 12, 12)).toBe(-1);
  });
});
