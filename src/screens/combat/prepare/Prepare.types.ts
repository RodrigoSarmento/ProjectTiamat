import type { IStoryEnemy } from '@data/story';
import type { ICombatDie } from '@helper/combatDice';

import type { ICombatStep } from '../Combat.types';

export interface IPrepare extends ICombatStep {
  enemy: IStoryEnemy;
  enemyHealth: number;
  hand: ICombatDie[];
  deckCount: number;
}
