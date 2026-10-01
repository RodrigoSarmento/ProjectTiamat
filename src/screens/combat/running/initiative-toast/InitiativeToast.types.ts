import type { ICombatInitiative } from '@helper/combatDice';

export interface IInitiativeToast {
  initiative: ICombatInitiative;
  enemyName: string;
}

export interface ID20Roll {
  label: string;
  value: number;
  color: string;
}
