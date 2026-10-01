import type { ICombatDie, ICombatDieDefinition } from '@helper/combatDice';

export const COMBAT_DICE = {
  'attack-d4-a': { sides: 4, kind: 'attack', faces: [1, 1, 1, 1] },
  'attack-d4-b': { sides: 4, kind: 'attack', faces: [0, 1, 1, 2] },
  'attack-d6-a': { sides: 6, kind: 'attack', faces: [0, 0, 1, 1, 2, 2] },
  'attack-d6-b': { sides: 6, kind: 'attack', faces: [0, 1, 1, 2, 2, 3] },
  'attack-d8-a': { sides: 8, kind: 'attack', faces: [0, 0, 1, 1, 2, 2, 3, 4] },
  'attack-d8-b': { sides: 8, kind: 'attack', faces: [0, 0, 0, 1, 2, 3, 4, 5] },
  'defense-d4-a': { sides: 4, kind: 'defense', faces: [1, 1, 1, 1] },
  'defense-d4-b': { sides: 4, kind: 'defense', faces: [1, 1, 1, 2] },
  'defense-d6-a': { sides: 6, kind: 'defense', faces: [0, 0, 1, 1, 1, 2] },
  'defense-d6-b': { sides: 6, kind: 'defense', faces: [0, 0, 1, 1, 1, 2] },
  'defense-d8-a': {
    sides: 8,
    kind: 'defense',
    faces: [0, 0, 1, 2, 2, 2, 3, 4],
  },
  'defense-d8-b': {
    sides: 8,
    kind: 'defense',
    faces: [0, 1, 1, 1, 2, 2, 2, 3],
  },
  'enemy-attack-d4-a': { sides: 4, kind: 'attack', faces: [0, 0, 1, 1] },
  'enemy-attack-d4-b': { sides: 4, kind: 'attack', faces: [0, 0, 0, 2] },
  'enemy-attack-d6-a': { sides: 6, kind: 'attack', faces: [0, 0, 1, 1, 2, 2] },
  'enemy-attack-d6-b': { sides: 6, kind: 'attack', faces: [0, 0, 0, 1, 2, 3] },
  'enemy-attack-d8-a': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 1, 1, 2, 2, 3],
  },
  'enemy-attack-d8-b': {
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 0, 1, 2, 3, 4],
  },
  'enemy-defense-d4-a': { sides: 4, kind: 'defense', faces: [0, 0, 1, 1] },
  'enemy-defense-d4-b': { sides: 4, kind: 'defense', faces: [0, 0, 0, 2] },
  'enemy-defense-d6-a': {
    sides: 6,
    kind: 'defense',
    faces: [0, 0, 1, 1, 1, 2],
  },
  'enemy-defense-d6-b': {
    sides: 6,
    kind: 'defense',
    faces: [0, 0, 0, 1, 1, 2],
  },
  'enemy-defense-d8-a': {
    sides: 8,
    kind: 'defense',
    faces: [0, 0, 0, 1, 1, 1, 2, 2],
  },
  'enemy-defense-d8-b': {
    sides: 8,
    kind: 'defense',
    faces: [0, 0, 0, 0, 1, 1, 2, 2],
  },
} satisfies Record<string, ICombatDieDefinition>;

export type CombatDieId = keyof typeof COMBAT_DICE;

export const getDie = (id: CombatDieId): ICombatDie => ({
  id,
  ...COMBAT_DICE[id],
});

export const getDice = (ids: CombatDieId[]): ICombatDie[] => ids.map(getDie);
