import type { ImageSourcePropType } from 'react-native';

export interface ICollapsible {
  title: string;
  description: string;
  portrait?: ImageSourcePropType;
  isNew?: boolean;
  isOpen?: boolean;
  onPress?: () => void;
  testID?: string;
}
