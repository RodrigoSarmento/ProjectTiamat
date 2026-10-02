import { Colors } from '@styles';

import type { CombatOutcome } from '../Combat.types';

export const OUTCOME_COLOR: Record<CombatOutcome, string> = {
  victory: Colors.neonCyan,
  defeat: Colors.warningRed,
};

export const OUTCOME_TINT: Record<CombatOutcome, string> = {
  victory: 'rgba(4, 28, 34, 0.72)',
  defeat: 'rgba(40, 4, 10, 0.72)',
};

export const BACKGROUND_BLUR = 8;
export const ENEMY_PORTRAIT_SIZE = 96;
export const PANEL_DELAY_MS = 250;
export const ACTIONS_DELAY_MS = 600;
