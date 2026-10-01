import type { ImageSourcePropType } from 'react-native';

export type CombatantSide = 'enemy' | 'player';

export interface ICombatantHit {
  amount: number;
  key: number;
}

export interface ICombatantCard {
  name: string;
  portrait?: ImageSourcePropType;
  health: number;
  maxHealth: number;
  diceCount: number;
  side: CombatantSide;
  hit?: ICombatantHit;
  testID?: string;
}

export interface ICombatantSilhouette {
  size: number;
  color: string;
}
