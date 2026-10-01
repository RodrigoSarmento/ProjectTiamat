import type { ImageSourcePropType } from 'react-native';

import type { IStoryEnemy } from '@data/story';

import type { CombatHealth, CombatOutcome, ICombatStep } from '../Combat.types';

export interface IFinalResult extends ICombatStep {
  outcome: CombatOutcome;
  enemy: IStoryEnemy;
  health: CombatHealth;
  narrative: string[];
  background: ImageSourcePropType;
}
