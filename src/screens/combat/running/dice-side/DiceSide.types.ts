import type { ICombatDie } from '@helper/combatDice';

export interface IDiceSide {
  label: string;
  color: string;
  dice: ICombatDie[];
  rolls: Record<string, number>;
  isRolling: boolean;
  total?: string;
  onRollSettled: () => void;
  testID: string;
}
