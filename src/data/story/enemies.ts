import type { ImageSourcePropType } from 'react-native';

import type { CombatDieId } from '@data/combat';

export enum EnemiesId {
  enemy1 = 1,
}

export interface IStoryEnemy {
  id: EnemiesId;
  name: string;
  portrait: ImageSourcePropType;
  diceDeck: CombatDieId[];
  health: number;
  numOfDices: number;
}

export const ENEMIES: Record<EnemiesId, IStoryEnemy> = {
  [EnemiesId.enemy1]: {
    id: EnemiesId.enemy1,
    name: 'enemies.enemy1',
    portrait: require('@assets/characters/character_security_guard_square.png'),
    diceDeck: [
      'enemy-attack-d4-level1-a',
      'enemy-attack-d4-level1-b',
      'enemy-defense-d4-level1-a',
      'enemy-attack-d6-level1-b',
    ],
    health: 5,
    numOfDices: 2,
  },
};

export const getEnemy = (enemyId: EnemiesId) => ENEMIES[enemyId];
