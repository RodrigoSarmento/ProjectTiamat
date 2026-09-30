import type { ICombatDie } from '@helper/combatDice';

export type CombatDiePoint = {
  x: number;
  y: number;
};

export interface ICombatDieView {
  die: ICombatDie;
  size: number;
  shownFace?: number;
  isRolling?: boolean;
  rollIndex?: number;
  rollGeneration?: number;
  resultValue?: number;
  isGhost?: boolean;
  disabled?: boolean;
  showFaces?: boolean;
  onDragMove?: (x: number, y: number) => void;
  onDragStart?: (point: CombatDiePoint) => void;
  onDragUpdate?: (point: CombatDiePoint) => void;
  onDragEnd?: (point: CombatDiePoint) => void;
  onRollSettled?: () => void;
  testID?: string;
}
