export type DiceRollD20Ref = {
  roll: () => void;
};

export type DiceRollD20Props = {
  size?: number;
  color?: string;
  onComplete?: (value: number) => void;
};
