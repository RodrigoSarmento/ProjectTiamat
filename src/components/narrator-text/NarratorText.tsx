import React from 'react';

import { Text, View } from 'react-native';

import { ContinueButton } from '@components/continue-button';

import { styles } from './NarratorText.styles';
import type { INarratorText } from './NarratorText.types';

const NarratorText: React.FC<INarratorText> = ({
  title,
  text,
  onPress,
  testID = 'NarratorText',
}) => {
  return (
    <View testID={testID} style={styles.container}>
      <View style={styles.body}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <Text style={styles.text}>{text}</Text>
      </View>
      <ContinueButton onPress={onPress} testID={`${testID}-continue`} />
    </View>
  );
};

export default NarratorText;
