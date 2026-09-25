import React, { useEffect, useRef, useState } from 'react';

import {
  Animated,
  Easing,
  Pressable,
  Modal as RNModal,
  Text,
  View,
} from 'react-native';

import { StoryChoices } from '@components/story-choices';
import {
  isQuickChoicePrompt,
  type IPresentedStoryChoice,
} from '@helper/storyPlayback';

import {
  ANIMATION_MS,
  QUICK_CHOICE_MS_PER_OPTION,
  SLIDE_DISTANCE,
} from './ChoiceSelectModal.constants';
import { styles } from './ChoiceSelectModal.styles';
import type { IChoiceSelectModal } from './ChoiceSelectModal.types';

const firstEnabledChoice = (choices: IPresentedStoryChoice[]) =>
  choices.find((choice) => !choice.disabled);

const ChoiceSelectModal: React.FC<IChoiceSelectModal> = ({
  isVisible,
  choices,
  onSelect,
  onClose,
  testID = 'ChoiceSelectModal',
}) => {
  const [slideAnim] = useState(() => new Animated.Value(SLIDE_DISTANCE));
  const [timerProgress] = useState(() => new Animated.Value(1));
  const selectedChoiceRef = useRef<IPresentedStoryChoice | undefined>(undefined);
  const hasCommittedRef = useRef(false);
  const onSelectRef = useRef(onSelect);
  const isQuick = isQuickChoicePrompt(choices);
  const firstId = firstEnabledChoice(choices)?.id;
  const durationSeconds = isQuick
    ? Math.ceil((choices.length * QUICK_CHOICE_MS_PER_OPTION) / 1000)
    : 0;
  const promptEpoch = !isVisible
    ? 'closed'
    : isQuick
      ? `quick:${choices.map((choice) => choice.id).join(',')}`
      : 'normal';

  const [epoch, setEpoch] = useState(promptEpoch);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    promptEpoch.startsWith('quick') ? firstId : undefined,
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    promptEpoch.startsWith('quick') ? durationSeconds : 0,
  );

  if (epoch !== promptEpoch) {
    setEpoch(promptEpoch);
    setSelectedId(promptEpoch.startsWith('quick') ? firstId : undefined);
    setRemainingSeconds(promptEpoch.startsWith('quick') ? durationSeconds : 0);
  }

  const selectedChoice =
    choices.find((choice) => choice.id === selectedId && !choice.disabled) ??
    firstEnabledChoice(choices);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    selectedChoiceRef.current = isQuick ? selectedChoice : undefined;
  }, [isQuick, selectedChoice]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isVisible ? 0 : SLIDE_DISTANCE,
      duration: ANIMATION_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [isVisible, slideAnim]);

  useEffect(() => {
    if (!isVisible || !isQuick) {
      timerProgress.setValue(1);
      return;
    }

    hasCommittedRef.current = false;
    const durationMs = choices.length * QUICK_CHOICE_MS_PER_OPTION;
    timerProgress.setValue(1);

    const animation = Animated.timing(timerProgress, {
      toValue: 0,
      duration: durationMs,
      easing: Easing.linear,
      useNativeDriver: false,
    });
    animation.start();

    const tick = setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    const timeout = setTimeout(() => {
      const choice = selectedChoiceRef.current;
      if (!hasCommittedRef.current && choice && !choice.disabled) {
        hasCommittedRef.current = true;
        onSelectRef.current(choice);
      }
    }, durationMs);

    return () => {
      animation.stop();
      clearInterval(tick);
      clearTimeout(timeout);
    };
  }, [isVisible, isQuick, choices.length, timerProgress]);

  const commit = (choice?: IPresentedStoryChoice) => {
    if (!choice || choice.disabled || hasCommittedRef.current) {
      return;
    }
    hasCommittedRef.current = true;
    onSelect(choice);
  };

  const handleChoicePress = (choice: IPresentedStoryChoice) => {
    if (isQuick) {
      if (!choice.disabled) {
        setSelectedId(choice.id);
      }
      return;
    }
    commit(choice);
  };

  return (
    <RNModal
      testID={testID}
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!isQuick) {
          onClose();
        }
      }}
    >
      <View style={styles.root} pointerEvents="box-none">
        {isQuick ? (
          <View style={styles.backdrop} />
        ) : (
          <Pressable
            testID={`${testID}-backdrop`}
            accessibilityRole="button"
            accessibilityLabel="Close choices"
            onPress={onClose}
            style={styles.backdrop}
          />
        )}
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {isQuick ? (
            <View testID={`${testID}-timer`} style={styles.timer}>
              <Text style={styles.timerLabel}>{remainingSeconds}s</Text>
              <View style={styles.timerTrack}>
                <Animated.View
                  style={[
                    styles.timerFill,
                    {
                      width: timerProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          ) : null}
          <StoryChoices
            choices={choices}
            onSelect={handleChoicePress}
            selectedId={isQuick ? selectedChoice?.id : undefined}
          />
          {isQuick ? (
            <Pressable
              testID={`${testID}-confirm`}
              accessibilityRole="button"
              accessibilityLabel="Confirmar"
              onPress={() => commit(selectedChoice)}
              style={styles.confirm}
            >
              <Text style={styles.confirmLabel}>Confirmar</Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </View>
    </RNModal>
  );
};

export default ChoiceSelectModal;
