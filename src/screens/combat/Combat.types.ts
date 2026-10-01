import type { RefObject } from 'react';

import type { CombatantSide, ICombatantHit } from '@components/combatant-card';
import type { ICombatDie } from '@helper/combatDice';

export type CombatStep = 'prepare' | 'running' | 'finalResult';

export type CombatHealth = Record<CombatantSide, number>;
export type CombatHits = Partial<Record<CombatantSide, ICombatantHit>>;

export interface ICombatRef {
  next: () => void;
  goTo: (step: CombatStep) => void;
  selectDice: (dice: ICombatDie[]) => void;
  applyDamage: (target: CombatantSide, amount: number) => void;
}

export interface ICombatStep {
  combatRef: RefObject<ICombatRef | null>;
}
