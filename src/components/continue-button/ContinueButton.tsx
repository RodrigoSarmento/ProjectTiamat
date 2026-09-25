import React from 'react';

import { Pressable, Text } from 'react-native';

import { CONTINUE_LABEL } from './ContinueButton.constants';
import { styles } from './ContinueButton.styles';
import type { IContinueButton } from './ContinueButton.types';

const ContinueButton: React.FC<IContinueButton> = ({
  onPress,
  testID = 'ContinueButton',
}) => {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel="Continue"
      hitSlop={12}
      onPress={onPress}
      style={styles.button}
    >
      <Text style={styles.label}>{CONTINUE_LABEL}</Text>
    </Pressable>
  );
};

export default ContinueButton;
