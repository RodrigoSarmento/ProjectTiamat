import { useState } from 'react';

import { Image, ImageBackground, Pressable, Text, View } from 'react-native';

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { CloseIcon } from '@components/close-icon';
import { Modal } from '@components/modal';
import { NeonToggle } from '@components/neon-toggle';
import { type Language, applyLanguage } from '@helper/language';
import { translate } from '@helper/translate';
import { DEFAULT_THEME, type SoundType, useSound } from '@hooks/use-sound';
import { eraseSave } from '@redux/slices/SavesSlice';
import { setLanguage, setSoundEnabled } from '@redux/slices/SettingsSlice';
import type { RootState } from '@redux/store';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { LANGUAGES, SOUND_OPTIONS } from './Options.constants';
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
  const language = useSelector((state: RootState) => state.settings.language);
  applyLanguage(language);
  const backgroundSound = useSelector(
    (state: RootState) => state.saves.save.backgroundSound,
  );
  const { playSound, stopSound } = useSound();
  const [isEraseModalVisible, setIsEraseModalVisible] = useState(false);
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const selectedLanguage =
    LANGUAGES.find((item) => item.id === language) ?? LANGUAGES[0];

  const handleToggleSound = (soundType: SoundType, isEnabled: boolean) => {
    dispatch(setSoundEnabled({ soundType, isEnabled }));
  };

  const closeEraseModal = () => setIsEraseModalVisible(false);

  const handleSelectLanguage = (next: Language) => {
    dispatch(setLanguage(next));
    setIsLanguageModalVisible(false);
  };

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
          <View style={CommonStyles.settingsHeader}>
            <Text style={CommonStyles.settingsTitle}>
              {translate('words.options')}
            </Text>
            <CloseIcon />
          </View>
          <View style={CommonStyles.settingsDivider} />
          <View style={styles.list}>
            <OptionCard
              testID="Options-language"
              label={translate('words.language')}
              onPress={() => setIsLanguageModalVisible(true)}
            >
              <View style={styles.languageValue}>
                <Image source={selectedLanguage.flag} style={styles.flag} />
                <Text style={styles.languageValueLabel}>
                  {translate(selectedLanguage.label)}
                </Text>
              </View>
            </OptionCard>
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
        testID="LanguageModal"
        isVisible={isLanguageModalVisible}
        customStyle={styles.modal}
        onBackdropPress={() => setIsLanguageModalVisible(false)}
      >
        <Text style={[styles.modalTitle, styles.languageModalTitle]}>
          {translate('words.language')}
        </Text>
        {LANGUAGES.map((item) => {
          const isSelected = item.id === language;
          return (
            <Pressable
              key={item.id}
              testID={`LanguageModal-${item.id}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => handleSelectLanguage(item.id)}
              style={({ pressed }) => [
                styles.languageOption,
                isSelected && styles.languageOptionSelected,
                pressed && styles.modalButtonPressed,
              ]}
            >
              <Image source={item.flag} style={styles.flag} />
              <Text style={styles.languageOptionLabel}>
                {translate(item.label)}
              </Text>
            </Pressable>
          );
        })}
      </Modal>
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
