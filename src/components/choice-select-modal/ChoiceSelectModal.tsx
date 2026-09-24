import React, { useEffect, useState } from 'react';

import {
  Animated,
  Easing,
  Pressable,
  Modal as RNModal,
  View,
} from 'react-native';

import { StoryChoices } from '@components/story-choices';

import { ANIMATION_MS, SLIDE_DISTANCE } from './ChoiceSelectModal.constants';
import { styles } from './ChoiceSelectModal.styles';
import type { IChoiceSelectModal } from './ChoiceSelectModal.types';

const ChoiceSelectModal: React.FC<IChoiceSelectModal> = ({
  isVisible,
  choices,
  onSelect,
  onClose,
  testID = 'ChoiceSelectModal',
}) => {
  const [slideAnim] = useState(() => new Animated.Value(SLIDE_DISTANCE));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : SLIDE_DISTANCE,
      duration: ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  return (
    <RNModal
      testID={testID}
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          testID={`${testID}-backdrop`}
          accessibilityRole="button"
          accessibilityLabel="Close choices"
          onPress={onClose}
          style={styles.backdrop}
        />
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <StoryChoices choices={choices} onSelect={onSelect} />
        </Animated.View>
      </View>
    </RNModal>
  );
};

export default ChoiceSelectModal;
