import React from 'react';

import { Pressable, Text, View } from 'react-native';

import { NeonFrame } from '@components/neon-frame';

import { styles } from './OptionCard.styles';
import type { IOptionCard } from './OptionCard.types';

const OptionCard: React.FC<IOptionCard> = ({
  label,
  onPress,
  isDanger = false,
  children,
  testID,
}) => (
  <Pressable
    testID={testID}
    onPress={onPress}
    style={({ pressed }) => [styles.card, pressed && styles.pressed]}
  >
    <NeonFrame />
    <View style={styles.marker} />
    <Text style={[styles.label, isDanger && styles.labelDanger]}>{label}</Text>
    {children}
  </Pressable>
);

export default OptionCard;
