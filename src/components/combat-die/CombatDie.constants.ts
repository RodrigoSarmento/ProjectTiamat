import type { CombatDieSides } from '@helper/combatDice';

export const TRAY_DIE_SIZE = 70;
export const FIELD_DIE_SIZE = 112;
export const FLOAT_DIE_SIZE = 96;
export const LONG_PRESS_MS = 100;
export const FACE_STRIP_MAX_WIDTH = 84;
export const FLICKER_MS: Record<CombatDieSides, number> = {
  4: 46,
  6: 56,
  8: 64,
};
