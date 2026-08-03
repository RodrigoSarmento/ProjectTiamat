export interface IStatBar {
  label: string;
  shortLabel: string;
  description: string;
  value: number;
  canIncrease: boolean;
  canDecrease: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}
