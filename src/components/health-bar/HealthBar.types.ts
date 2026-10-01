export interface IHealthBar {
  current: number;
  max: number;
  color?: string;
  size?: 'compact' | 'large';
  testID?: string;
}

export interface IHealthSegment {
  isFilled: boolean;
  color: string;
  drainDelay: number;
}
