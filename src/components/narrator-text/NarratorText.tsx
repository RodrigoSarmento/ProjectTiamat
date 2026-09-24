import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { CONTINUE_LABEL } from './NarratorText.constants';
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
      <Pressable
        testID={`${testID}-continue`}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        hitSlop={12}
        onPress={onPress}
        style={styles.continueButton}
      >
        <Text style={styles.continue}>{CONTINUE_LABEL}</Text>
      </Pressable>
    </View>
  );
};

export default NarratorText;
