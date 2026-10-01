import { COMBAT_DICE, type CombatDieId, getDice, getDie } from '@data/combat';

import {
  containsPoint,
  diceOfKind,
  discardUsedDice,
  drawDice,
  emptyCombatSlots,
  formatFace,
  handSize,
  hitSlotIndex,
  placeDieOnSlot,
  removeDieFromSlots,
  resolveExchange,
  restFace,
  rollDice,
  rollDie,
  rollInitiative,
  selectedDice,
} from './combatDice';

const deckIds: CombatDieId[] = [
  'attack-d4-b',
  'attack-d8-a',
  'defense-d4-b',
  'defense-d6-a',
];

describe('combatDice', () => {
  it('gives every catalog die one face per side', () => {
    Object.values(COMBAT_DICE).forEach((die) => {
      expect(die.faces).toHaveLength(die.sides);
    });
  });

  it('resolves a deck of ids into catalog dice', () => {
    const deck = getDice(deckIds);

    expect(deck.map((die) => die.id)).toEqual(deckIds);
    expect(getDie('attack-d4-a')).toEqual({
      id: 'attack-d4-a',
      ...COMBAT_DICE['attack-d4-a'],
    });
  });

  it('shows a miss as 0 and prefixes hits', () => {
    expect(formatFace(0)).toBe('0');
    expect(formatFace(3)).toBe('+3');
    expect(
      restFace({ id: 'x', sides: 4, kind: 'attack', faces: [0, 1, 1, 2] }),
    ).toBe(1);
  });

  it('rolls a deterministic face from the supplied random', () => {
    const die = getDie('attack-d6-b');

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
    expect(emptyCombatSlots(2)).toEqual([null, null]);
    expect(placeDieOnSlot(emptyCombatSlots(2), 'attack-d4', 2)).toEqual([
      null,
      null,
    ]);

    let slots = emptyCombatSlots(3);
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

  it('resolves an exchange as attack minus defense, never below zero', () => {
    const dice = selectedDice(getDice(deckIds), [
      'attack-d4-b',
      'attack-d8-a',
      'defense-d4-b',
    ]);
    const attackDice = diceOfKind(dice, 'attack');
    const defenseDice = diceOfKind(dice, 'defense');

    expect(
      resolveExchange(attackDice, defenseDice, {
        'attack-d4-b': 2,
        'attack-d8-a': 3,
        'defense-d4-b': 1,
      }),
    ).toEqual({ attack: 5, defense: 1, damage: 4 });
    expect(
      resolveExchange(attackDice, defenseDice, {
        'attack-d4-b': 0,
        'attack-d8-a': 0,
        'defense-d4-b': 2,
      }),
    ).toEqual({ attack: 0, defense: 2, damage: 0 });
    expect(resolveExchange([], [], {})).toEqual({
      attack: 0,
      defense: 0,
      damage: 0,
    });
  });

  it('rolls initiative with a d20 each and rerolls ties', () => {
    const values = [0.5, 0.5, 0.9, 0.1];
    const random = () => values.shift() ?? 0;

    expect(rollInitiative(random)).toEqual({
      player: 19,
      enemy: 3,
      playerFirst: true,
    });
  });

  it('draws distinct dice from a deck with unique ids even for repeated entries', () => {
    const deck = getDice(['attack-d4-b', 'attack-d4-b', 'defense-d4-a']);
    const drawn = drawDice(deck, 2, () => 0);

    expect(drawn.map((die) => die.id)).toEqual([
      'attack-d4-b#0',
      'attack-d4-b#1',
    ]);
    expect(drawDice(deck, 5, () => 0)).toHaveLength(3);
    expect(rollDice(drawn, () => 0)).toEqual({
      'attack-d4-b#0': 0,
      'attack-d4-b#1': 0,
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

  it('caps the hand at the deck size', () => {
    expect(handSize(8, 2)).toBe(2);
    expect(handSize(1, 2)).toBe(1);
    expect(handSize(0, 2)).toBe(0);
  });

  it('sends used dice to morto and recovers them once the hand cannot be filled', () => {
    const afterFirst = discardUsedDice(
      deckIds,
      [],
      ['attack-d4-b', 'defense-d6-a'],
      2,
    );
    expect(afterFirst).toEqual(['attack-d4-b', 'defense-d6-a']);

    expect(
      discardUsedDice(deckIds, afterFirst, ['attack-d8-a', 'defense-d4-b'], 2),
    ).toEqual([]);

    expect(
      discardUsedDice(deckIds, [], ['attack-d4-b', 'attack-d8-a'], 3),
    ).toEqual([]);
  });
});
