export interface IOptionsTab {
  label: string;
  isFocused: boolean;
  onPress: () => void;
  testID?: string;
}
