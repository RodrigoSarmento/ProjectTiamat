import { Common } from '@styles';

export const SIDE_DIE_SIZE = 88;
export const SIDE_DIE_GAP = 8;
const SIDE_HORIZONTAL_PADDING = 32;

export const sideDieSize = (count: number) => {
  const dice = Math.max(count, 1);
  const available =
    Common.screenWidth - SIDE_HORIZONTAL_PADDING - SIDE_DIE_GAP * (dice - 1);

  return Math.min(SIDE_DIE_SIZE, Math.max(1, Math.floor(available / dice)));
};
