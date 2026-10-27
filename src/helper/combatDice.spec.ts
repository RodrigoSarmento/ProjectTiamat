import { COMBAT_DICE, type CombatDieId, getDice, getDie } from '@data/combat';

import {
  type ICombatDie,
  containsPoint,
  dealHand,
  defendingDice,
  diceOfKind,
  drawDice,
  emptyCombatSlots,
  formatFace,
  handSize,
  hitSlotIndex,
  placeDieOnSlot,
  playCards,
  removeDieFromSlots,
  resolveExchange,
  restFace,
  rollDice,
  rollDie,
  rollInitiative,
  selectedDice,
  shuffle,
  toCards,
} from './combatDice';

const deckIds: CombatDieId[] = [
  'attack-d4-level1-b',
  'attack-d8-level1-b',
  'defense-d6-level1-b',
  'counter-d4-level1-c',
];

const keepOrder = () => 0.99;
const idsOf = (dice: ICombatDie[]) => dice.map((die) => die.id);

describe('combatDice', () => {
  it('gives every catalog die one face per side', () => {
    Object.values(COMBAT_DICE).forEach((die) => {
      expect(die.faces).toHaveLength(die.sides);
    });
  });

  it('resolves a deck of ids into catalog dice', () => {
    const deck = getDice(deckIds);

    expect(deck.map((die) => die.id)).toEqual(deckIds);
    expect(getDie('attack-d4-level1-a')).toEqual({
      id: 'attack-d4-level1-a',
      ...COMBAT_DICE['attack-d4-level1-a'],
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
    const die = getDie('attack-d6-level1-b');

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

    slots = placeDieOnSlot(slots, 'attack-d6-level1-b', 1);
    expect(slots).toEqual(['defense-d8', 'attack-d6-level1-b', 'attack-d4']);

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
      'attack-d4-level1-b',
      'attack-d8-level1-b',
      'defense-d6-level1-b',
    ]);
    const attackDice = diceOfKind(dice, 'attack');
    const defenseDice = diceOfKind(dice, 'defense');

    expect(
      resolveExchange(attackDice, defenseDice, {
        'attack-d4-level1-b': 2,
        'attack-d8-level1-b': 3,
        'defense-d6-level1-b': 1,
      }),
    ).toEqual({ attack: 5, defense: 1, damage: 4, counter: 0 });
    expect(
      resolveExchange(attackDice, defenseDice, {
        'attack-d4-level1-b': 0,
        'attack-d8-level1-b': 0,
        'defense-d6-level1-b': 2,
      }),
    ).toEqual({ attack: 0, defense: 2, damage: 0, counter: 0 });
    expect(resolveExchange([], [], {})).toEqual({
      attack: 0,
      defense: 0,
      damage: 0,
      counter: 0,
    });
  });

  it('counters with the blocked surplus, capped by the counter roll', () => {
    const dice = getDice(deckIds);
    const attackDice = diceOfKind(dice, 'attack');
    const defenseDice = defendingDice(dice);
    const rolls = (attack: number, defense: number, counter: number) => ({
      'attack-d4-level1-b': attack,
      'attack-d8-level1-b': 0,
      'defense-d6-level1-b': defense,
      'counter-d4-level1-c': counter,
    });

    expect(resolveExchange(attackDice, defenseDice, rolls(1, 3, 3))).toEqual({
      attack: 1,
      defense: 6,
      damage: 0,
      counter: 3,
    });
    expect(resolveExchange(attackDice, defenseDice, rolls(2, 3, 0))).toEqual({
      attack: 2,
      defense: 3,
      damage: 0,
      counter: 0,
    });
    expect(resolveExchange(attackDice, defenseDice, rolls(2, 0, 3))).toEqual({
      attack: 2,
      defense: 3,
      damage: 0,
      counter: 1,
    });
    expect(resolveExchange(attackDice, defenseDice, rolls(2, 0, 0))).toEqual({
      attack: 2,
      defense: 0,
      damage: 2,
      counter: 0,
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
    const deck = getDice([
      'attack-d4-level1-b',
      'attack-d4-level1-b',
      'defense-d4-level1-a',
    ]);
    const drawn = drawDice(deck, 2, () => 0);

    expect(drawn.map((die) => die.id)).toEqual([
      'attack-d4-level1-b#0',
      'attack-d4-level1-b#1',
    ]);
    expect(drawDice(deck, 5, () => 0)).toHaveLength(3);
    expect(rollDice(drawn, () => 0)).toEqual({
      'attack-d4-level1-b#0': 0,
      'attack-d4-level1-b#1': 0,
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

  it('caps the slots at the cards in hand and at the player maximum', () => {
    expect(handSize(8, 3)).toBe(3);
    expect(handSize(8, 9)).toBe(5);
    expect(handSize(1, 3)).toBe(1);
    expect(handSize(0, 3)).toBe(0);
  });

  describe('hand and deck', () => {
    const cards = toCards(
      getDice([...deckIds, 'attack-d6-level1-b', 'defense-d4-level1-a']),
    );

    it('gives every deck entry its own card id, even repeated dice', () => {
      expect(
        idsOf(toCards(getDice(['attack-d4-level1-b', 'attack-d4-level1-b']))),
      ).toEqual(['attack-d4-level1-b#0', 'attack-d4-level1-b#1']);
    });

    it('shuffles without losing, duplicating or mutating cards', () => {
      const items = [1, 2, 3, 4];

      expect(shuffle(items, keepOrder)).toEqual(items);
      expect(shuffle(items, () => 0)).toEqual([2, 3, 4, 1]);
      expect(items).toEqual([1, 2, 3, 4]);
    });

    it('deals the hand from the shuffled deck and keeps the rest as the deck', () => {
      const piles = dealHand(cards, 4, keepOrder);

      expect(idsOf(piles.hand)).toEqual(idsOf(cards.slice(0, 4)));
      expect(idsOf(piles.drawPile)).toEqual(idsOf(cards.slice(4)));
      expect(piles.discard).toEqual([]);
      expect(dealHand(cards.slice(0, 2), 4, keepOrder).hand).toHaveLength(2);
    });

    it('sends played cards to morto and refills the hand from the deck', () => {
      const dealt = dealHand(cards, 4, keepOrder);
      const played = playCards(dealt, [cards[0].id, cards[2].id], 4, keepOrder);

      expect(idsOf(played.hand)).toEqual(
        idsOf([cards[1], cards[3], cards[4], cards[5]]),
      );
      expect(played.drawPile).toEqual([]);
      expect(idsOf(played.discard)).toEqual(idsOf([cards[0], cards[2]]));
    });

    it('buys only what the deck has and leaves the rest of the hand short', () => {
      const nine = toCards(
        getDice([
          ...deckIds,
          'attack-d6-level1-b',
          'defense-d4-level1-a',
          'attack-d4-level1-a',
          'attack-d4-level1-c',
          'defense-d6-level1-b',
        ]),
      );
      const dealt = dealHand(nine, 8, keepOrder);
      const played = playCards(dealt, idsOf(nine.slice(0, 3)), 8, keepOrder);

      expect(dealt.hand).toHaveLength(8);
      expect(dealt.drawPile).toHaveLength(1);
      expect(played.hand).toHaveLength(6);
      expect(played.drawPile).toEqual([]);
      expect(idsOf(played.discard)).toEqual(idsOf(nine.slice(0, 3)));
    });

    it('shuffles morto and deals a new hand only after the hand is empty', () => {
      const nine = toCards(
        getDice([
          ...deckIds,
          'attack-d6-level1-b',
          'defense-d4-level1-a',
          'attack-d4-level1-a',
          'attack-d4-level1-c',
          'defense-d6-level1-b',
        ]),
      );
      const dealt = dealHand(nine, 8, keepOrder);
      const first = playCards(dealt, idsOf(nine.slice(0, 3)), 8, keepOrder);
      const second = playCards(
        first,
        idsOf(first.hand.slice(0, 3)),
        8,
        keepOrder,
      );
      const third = playCards(
        second,
        idsOf(second.hand.slice(0, 3)),
        8,
        keepOrder,
      );

      expect(second.hand).toHaveLength(3);
      expect(second.drawPile).toEqual([]);
      expect(second.discard).toHaveLength(6);
      expect(third.hand).toHaveLength(8);
      expect(third.drawPile).toHaveLength(1);
      expect(third.discard).toEqual([]);
    });

    it('shuffles morto when the hand cannot fill the slots', () => {
      const nine = toCards(
        getDice([
          ...deckIds,
          'attack-d6-level1-b',
          'defense-d4-level1-a',
          'attack-d4-level1-a',
          'attack-d4-level1-c',
          'defense-d6-level1-b',
        ]),
      );
      const dealt = dealHand(nine, 8, keepOrder);
      const short = playCards(dealt, idsOf(nine.slice(0, 3)), 8, keepOrder, 3);
      const kept = short.hand[short.hand.length - 1];
      const refilled = playCards(
        short,
        idsOf(short.hand.slice(0, short.hand.length - 1)),
        8,
        keepOrder,
        3,
      );

      expect(short.hand).toHaveLength(6);
      expect(refilled.hand).toHaveLength(8);
      expect(refilled.drawPile).toHaveLength(1);
      expect(refilled.discard).toEqual([]);
      expect(idsOf(refilled.hand)).toContain(kept.id);
    });
  });
});
