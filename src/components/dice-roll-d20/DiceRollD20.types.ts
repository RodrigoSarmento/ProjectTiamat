export type DiceRollD20Ref = {
  roll: () => void;
};

export type DiceRollD20Props = {
  size?: number;
  color?: string;
  isSuccess?: (face: number) => boolean;
  onComplete?: (value: number) => void;
};
