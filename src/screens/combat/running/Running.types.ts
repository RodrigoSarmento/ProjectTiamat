import type { IStoryEnemy } from '@data/story';
import type { ICombatDie } from '@helper/combatDice';

import type { CombatHealth, CombatHits, ICombatStep } from '../Combat.types';

export type RunningPhase = 'initiative' | 'rolling' | 'result';

export interface IRunning extends ICombatStep {
  dice: ICombatDie[];
  enemy: IStoryEnemy;
  health: CombatHealth;
  hits: CombatHits;
}
