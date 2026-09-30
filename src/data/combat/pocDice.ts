import type { ICombatDie } from '@helper/combatDice';

export const POC_COMBAT_DICE: ICombatDie[] = [
  {
    id: 'attack-d4-a',
    sides: 4,
    kind: 'attack',
    faces: [1, 1, 1, 1],
  },

  {
    id: 'attack-d6-a',
    sides: 6,
    kind: 'attack',
    faces: [0, 0, 1, 1, 2, 2],
  },
  {
    id: 'attack-d6-b',
    sides: 6,
    kind: 'attack',
    faces: [0, 1, 1, 2, 2, 3],
  },
  {
    id: 'defense-d8-b',
    sides: 8,
    kind: 'defense',
    faces: [0, 1, 1, 1, 2, 2, 2, 3],
  },
  {
    id: 'attack-d8-a',
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 1, 1, 2, 2, 3, 4],
  },
  {
    id: 'attack-d8-b',
    sides: 8,
    kind: 'attack',
    faces: [0, 0, 0, 1, 2, 3, 4, 5],
  },
  {
    id: 'defense-d4-a',
    sides: 4,
    kind: 'defense',
    faces: [1, 1, 1, 1],
  },
  {
    id: 'defense-d4-b',
    sides: 4,
    kind: 'defense',
    faces: [1, 1, 1, 2],
  },
  {
    id: 'defense-d6-a',
    sides: 6,
    kind: 'defense',
    faces: [0, 0, 1, 1, 1, 2],
  },
  {
    id: 'defense-d6-b',
    sides: 6,
    kind: 'defense',
    faces: [0, 0, 1, 1, 1, 2],
  },
  {
    id: 'defense-d8-a',
    sides: 8,
    kind: 'defense',
    faces: [0, 0, 1, 2, 2, 2, 3, 4],
  },

  {
    id: 'attack-d4-b',
    sides: 4,
    kind: 'attack',
    faces: [0, 1, 1, 2],
  },
];
