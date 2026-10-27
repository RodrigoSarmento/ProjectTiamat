import { FIELD_DIE_SIZE, TRAY_DIE_SIZE } from '@components/combat-die';
import type { CombatDieKind } from '@helper/combatDice';
import { Common } from '@styles';

export const TRAY_KIND_ORDER: Record<CombatDieKind, number> = {
  attack: 0,
  defense: 1,
  counter: 2,
};

export const FIELD_SLOT_GAP = 8;
const FIELD_SLOT_VERTICAL_PADDING = 20;
const FIELD_HORIZONTAL_PADDING = 32;
const FIELD_SLOT_MAX_WIDTH = 124;

const widestRow = (count: number) => {
  if (count === 4) {
    return 2;
  }
  if (count >= 5) {
    return 3;
  }
  return Math.max(count, 1);
};

export const fieldSlotRows = (count: number) => {
  const indexes = Array.from({ length: count }, (_, index) => index);
  if (count === 4) {
    return [indexes.slice(0, 2), indexes.slice(2)];
  }
  if (count === 5) {
    return [indexes.slice(0, 3), indexes.slice(3)];
  }
  return [indexes];
};

export const fieldSlotWidth = (count: number) => {
  const perRow = widestRow(count);
  const available =
    Common.screenWidth -
    FIELD_HORIZONTAL_PADDING -
    FIELD_SLOT_GAP * (perRow - 1);

  return Math.min(
    FIELD_SLOT_MAX_WIDTH,
    Math.max(1, Math.floor(available / perRow)),
  );
};

export const fieldDieSize = (count: number) =>
  Math.min(FIELD_DIE_SIZE, Math.max(1, fieldSlotWidth(count) - 16));

export const fieldSlotMinHeight = (count: number) =>
  fieldDieSize(count) + FIELD_SLOT_VERTICAL_PADDING;

export const TRAY_COLUMNS = 4;
export const TRAY_ROW_GAP = 16;
export const TRAY_HORIZONTAL_PADDING = 14;
const TRAY_STRIP_HEIGHT = 22;
export const TRAY_ROW_HEIGHT = TRAY_DIE_SIZE + TRAY_STRIP_HEIGHT;
export const TRAY_HEIGHT = TRAY_ROW_HEIGHT * 2 + TRAY_ROW_GAP;

export const trayRows = <T>(dice: T[]) => {
  const rows = [
    dice.slice(0, TRAY_COLUMNS),
    dice.slice(TRAY_COLUMNS, TRAY_COLUMNS * 2),
  ];

  return rows.filter((row) => row.length > 0);
};

export const TRAY_END_TOLERANCE = 8;
export const TRAY_SCROLL_THROTTLE_MS = 32;
