import type { StoryBackgroundImageId } from '@data/story';

import type { CombatStep } from './Combat.types';

export const COMBAT_STEPS: CombatStep[] = ['prepare', 'running', 'finalResult'];

export const PLAYER_MAX_HEALTH = 8;

export const DEFAULT_RESULT_BACKGROUND: StoryBackgroundImageId =
  'gameplay_page';
