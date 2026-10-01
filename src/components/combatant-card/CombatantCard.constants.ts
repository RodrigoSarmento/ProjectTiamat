import { Colors } from '@styles';

import type { CombatantSide } from './CombatantCard.types';

export const PORTRAIT_SIZE = 72;
export const DAMAGE_FLOAT_MS = 1100;

export const SIDE_PALETTE: Record<
  CombatantSide,
  { accent: string; border: string; fill: string }
> = {
  enemy: {
    accent: Colors.warningRed,
    border: 'rgba(233, 56, 56, 0.4)',
    fill: 'rgba(58, 16, 24, 0.35)',
  },
  player: {
    accent: Colors.neonCyan,
    border: 'rgba(60, 246, 255, 0.4)',
    fill: 'rgba(8, 32, 40, 0.45)',
  },
};
