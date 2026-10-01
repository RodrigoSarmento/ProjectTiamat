import type { IStoryEnemy } from '@data/story';

import type { ICombatStep } from '../Combat.types';

export interface IPrepare extends ICombatStep {
  enemy: IStoryEnemy;
  enemyHealth: number;
  deadIds: string[];
}
