import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { styles } from './StoryChoices.styles';
import type { IStoryChoices } from './StoryChoices.types';

const StoryChoices: React.FC<IStoryChoices> = ({
  choices,
  onSelect,
  testID = 'StoryChoices',
}) => {
  const markContinue =
    choices.length > 1 &&
    choices.some((choice) => choice.once) &&
    choices.some((choice) => !choice.once);

  return (
    <View testID={testID} style={styles.container}>
      {choices.map((choice) => {
        const continues = markContinue && !choice.once;

        return (
          <Pressable
            key={choice.id}
            testID={`${testID}-${choice.id}`}
            accessibilityRole="button"
            accessibilityLabel={
              continues ? `${choice.label}, continues the dialogue` : choice.label
            }
            accessibilityState={{ disabled: choice.disabled }}
            disabled={choice.disabled}
            onPress={() => onSelect(choice)}
            style={[styles.choice, choice.disabled && styles.used]}
          >
            {continues ? (
              <View
                testID={`${testID}-${choice.id}-continue`}
                style={styles.continueDot}
              />
            ) : null}
            <Text style={styles.label}>{choice.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default StoryChoices;
