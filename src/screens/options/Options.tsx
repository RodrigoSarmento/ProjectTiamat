import { useState } from 'react';

import { ImageBackground, Pressable, Text, View } from 'react-native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { CloseButton } from '@components/close-button';
import { Modal } from '@components/modal';
import { NeonToggle } from '@components/neon-toggle';
import { translate } from '@helper/translate';
import { DEFAULT_THEME, type SoundType, useSound } from '@hooks/use-sound';
import { eraseSave } from '@redux/slices/SavesSlice';
import { setSoundEnabled } from '@redux/slices/SettingsSlice';
import type { RootState } from '@redux/store';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { SOUND_OPTIONS } from './Options.constants';
import { styles } from './Options.styles';
import { OptionCard } from './option-card';

const Options = () => {
  const navigation =
    useNavigation<
      BottomTabNavigationProp<OptionsBottomTabNavigatorParamsList>
    >();
  const dispatch = useDispatch();
  const soundEnabled = useSelector(
    (state: RootState) => state.settings.soundEnabled,
  );
  const backgroundSound = useSelector(
    (state: RootState) => state.saves.save.backgroundSound,
  );
  const { playSound, stopSound } = useSound();
  const [isEraseModalVisible, setIsEraseModalVisible] = useState(false);

  const handleToggleSound = (soundType: SoundType, isEnabled: boolean) => {
    dispatch(setSoundEnabled({ soundType, isEnabled }));
  };

  const closeEraseModal = () => setIsEraseModalVisible(false);

  const handleEraseSave = () => {
    closeEraseModal();
    dispatch(eraseSave());
    if (backgroundSound) {
      stopSound(backgroundSound.soundFile);
    }
    playSound(DEFAULT_THEME);
    navigation
      .getParent<StackNavigationProp<GameStackParamsList>>()
      ?.reset({ index: 0, routes: [{ name: 'Start' }] });
  };

  return (
    <ImageBackground
      style={CommonStyles.flex1}
      source={require('@assets/backgrounds/home_cyberpunk.png')}
    >
      <SafeAreaView style={CommonStyles.flex1} edges={['top', 'left', 'right']}>
        <View style={styles.content}>
          <Text style={CommonStyles.settingsTitle}>
            {translate('words.options')}
          </Text>
          <CloseButton />
          <View style={CommonStyles.settingsDivider} />
          <View style={styles.list}>
            {SOUND_OPTIONS.map(({ soundType, label }) => (
              <OptionCard
                key={soundType}
                testID={`Options-${soundType}`}
                label={translate(label)}
                onPress={() =>
                  handleToggleSound(soundType, !soundEnabled[soundType])
                }
              >
                <NeonToggle
                  testID={`Options-${soundType}-toggle`}
                  accessibilityLabel={translate(label)}
                  value={soundEnabled[soundType]}
                  onValueChange={(isEnabled) =>
                    handleToggleSound(soundType, isEnabled)
                  }
                />
              </OptionCard>
            ))}
            <OptionCard
              testID="Options-eraseSave"
              label={translate('options.eraseSave')}
              isDanger
              onPress={() => setIsEraseModalVisible(true)}
            />
          </View>
        </View>
      </SafeAreaView>
      <Modal
        testID="EraseSaveModal"
        isVisible={isEraseModalVisible}
        customStyle={styles.modal}
        onBackdropPress={closeEraseModal}
      >
        <Text style={styles.modalTitle}>
          {translate('options.eraseSaveTitle')}
        </Text>
        <Text style={styles.modalMessage}>
          {translate('options.eraseSaveMessage')}
        </Text>
        <View style={styles.modalActions}>
          <Pressable
            testID="EraseSaveModal-cancel"
            accessibilityRole="button"
            onPress={closeEraseModal}
            style={({ pressed }) => [
              styles.modalButton,
              pressed && styles.modalButtonPressed,
            ]}
          >
            <Text style={styles.modalButtonLabel}>
              {translate('words.cancel')}
            </Text>
          </Pressable>
          <Pressable
            testID="EraseSaveModal-confirm"
            accessibilityRole="button"
            onPress={handleEraseSave}
            style={({ pressed }) => [
              styles.modalButton,
              styles.modalButtonDanger,
              pressed && styles.modalButtonPressed,
            ]}
          >
            <Text
              style={[styles.modalButtonLabel, styles.modalButtonLabelDanger]}
            >
              {translate('options.eraseSaveConfirm')}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default Options;
