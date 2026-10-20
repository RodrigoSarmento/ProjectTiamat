import type { ICombatDie, ICombatDieDefinition } from '@helper/combatDice';

export const COMBAT_DICE = {
  'attack-d4-level1-a': { sides: 4, kind: 'attack', faces: [1, 1, 1, 1] },
  'attack-d4-level1-b': { sides: 4, kind: 'attack', faces: [0, 1, 1, 2] },
  'attack-d4-level1-c': { sides: 4, kind: 'attack', faces: [0, 0, 0, 4] },
  'attack-d6-level1-b': { sides: 6, kind: 'attack', faces: [0, 0, 1, 1, 1, 3] },
  'attack-d8-level1-b': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 1, 1, 1, 1, 4],
  },
  'attack-d8-level1-c': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 0, 0, 0, 3, 5],
  },
  'attack-d4-level2-a': { sides: 4, kind: 'attack', faces: [1, 1, 2, 2] },
  'attack-d4-level2-b': { sides: 4, kind: 'attack', faces: [0, 1, 1, 4] },
  'attack-d4-level2-c': { sides: 4, kind: 'attack', faces: [0, 0, 0, 6] },
  'attack-d6-level2-b': { sides: 6, kind: 'attack', faces: [0, 0, 1, 2, 2, 4] },
  'attack-d8-level2-c': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 0, 0, 0, 5, 7],
  },
  'attack-d4-level3-a': { sides: 4, kind: 'attack', faces: [2, 2, 2, 2] },
  'attack-d4-level3-c': { sides: 4, kind: 'attack', faces: [0, 0, 0, 8] },
  'attack-d6-level3-b': { sides: 6, kind: 'attack', faces: [0, 1, 2, 3, 3, 3] },
  'attack-d8-level3-b': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 1, 2, 3, 3, 3, 4],
  },

  'defense-d4-level1-a': { sides: 4, kind: 'defense', faces: [1, 1, 1, 1] },
  'defense-d6-level1-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 1, 1, 1, 1, 3],
  },
  'defense-d4-level2-a': { sides: 4, kind: 'defense', faces: [1, 1, 2, 2] },
  'defense-d6-level2-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 1, 2, 2, 2, 3],
  },
  'defense-d4-level3-a': { sides: 4, kind: 'defense', faces: [2, 2, 2, 2] },
  'defense-d6-level3-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 3, 3, 3, 3, 3],
  },

  'counter-d4-level1-c': { sides: 4, kind: 'counter', faces: [0, 0, 0, 3] },
  'counter-d8-level1-c': {
    sides: 8,
    kind: 'counter',
    faces: [0, 0, 0, 0, 0, 0, 2, 4],
  },
  'counter-d4-level2-c': { sides: 4, kind: 'counter', faces: [0, 0, 0, 5] },
  'counter-d8-level2-c': {
    sides: 8,
    kind: 'counter',
    faces: [0, 0, 0, 0, 0, 0, 4, 6],
  },
  'counter-d4-level3-c': { sides: 4, kind: 'counter', faces: [0, 0, 0, 7] },
  'counter-d8-level3-c': {
    sides: 8,
    kind: 'counter',
    faces: [0, 0, 0, 0, 0, 0, 6, 8],
  },

  'enemy-attack-d4-level1-a': { sides: 4, kind: 'attack', faces: [0, 1, 1, 1] },
  'enemy-attack-d4-level1-b': { sides: 4, kind: 'attack', faces: [0, 0, 1, 2] },
  'enemy-attack-d4-level1-c': { sides: 4, kind: 'attack', faces: [0, 0, 0, 3] },
  'enemy-attack-d6-level1-b': {
    sides: 6,
    kind: 'attack',
    faces: [0, 0, 1, 1, 1, 2],
  },
  'enemy-attack-d8-level1-b': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 1, 1, 1, 1, 3],
  },
  'enemy-attack-d8-level1-c': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 0, 0, 0, 3, 4],
  },
  'enemy-attack-d4-level2-a': { sides: 4, kind: 'attack', faces: [1, 1, 1, 2] },
  'enemy-attack-d4-level2-b': { sides: 4, kind: 'attack', faces: [0, 1, 1, 3] },
  'enemy-attack-d4-level2-c': { sides: 4, kind: 'attack', faces: [0, 0, 0, 5] },
  'enemy-attack-d6-level2-b': {
    sides: 6,
    kind: 'attack',
    faces: [0, 0, 1, 2, 2, 3],
  },
  'enemy-attack-d8-level2-c': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 0, 0, 0, 5, 6],
  },
  'enemy-attack-d4-level3-a': { sides: 4, kind: 'attack', faces: [1, 2, 2, 2] },
  'enemy-attack-d4-level3-c': { sides: 4, kind: 'attack', faces: [0, 0, 0, 7] },
  'enemy-attack-d6-level3-b': {
    sides: 6,
    kind: 'attack',
    faces: [0, 1, 2, 2, 3, 3],
  },
  'enemy-attack-d8-level3-b': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 1, 2, 3, 3, 3, 3],
  },

  'enemy-defense-d4-level1-a': {
    sides: 4,
    kind: 'defense',
    faces: [0, 1, 1, 1],
  },
  'enemy-defense-d6-level1-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 1, 1, 1, 1, 2],
  },
  'enemy-defense-d4-level2-a': {
    sides: 4,
    kind: 'defense',
    faces: [1, 1, 1, 2],
  },
  'enemy-defense-d6-level2-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 1, 2, 2, 2, 2],
  },
  'enemy-defense-d4-level3-a': {
    sides: 4,
    kind: 'defense',
    faces: [1, 2, 2, 2],
  },
  'enemy-defense-d6-level3-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 2, 3, 3, 3, 3],
  },

  'enemy-counter-d4-level1-c': {
    sides: 4,
    kind: 'counter',
    faces: [0, 0, 0, 2],
  },
  'enemy-counter-d8-level1-c': {
    sides: 8,
    kind: 'counter',
    faces: [0, 0, 0, 0, 0, 0, 2, 3],
  },
  'enemy-counter-d4-level2-c': {
    sides: 4,
    kind: 'counter',
    faces: [0, 0, 0, 4],
  },
  'enemy-counter-d8-level2-c': {
    sides: 8,
    kind: 'counter',
    faces: [0, 0, 0, 0, 0, 0, 4, 5],
  },
  'enemy-counter-d4-level3-c': {
    sides: 4,
    kind: 'counter',
    faces: [0, 0, 0, 6],
  },
  'enemy-counter-d8-level3-c': {
    sides: 8,
    kind: 'counter',
    faces: [0, 0, 0, 0, 0, 0, 6, 7],
  },
} satisfies Record<string, ICombatDieDefinition>;

export type CombatDieId = keyof typeof COMBAT_DICE;

export const getDie = (id: CombatDieId): ICombatDie => ({
  id,
  ...COMBAT_DICE[id],
});

export const getDice = (ids: CombatDieId[]): ICombatDie[] => ids.map(getDie);
