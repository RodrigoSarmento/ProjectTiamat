import type { ReactNode } from 'react';

export interface IOptionCard {
  label: string;
  onPress: () => void;
  isDanger?: boolean;
  children?: ReactNode;
  testID?: string;
}
