import { useMemo, useState } from 'react';

import {
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { ImageButton } from '@components/image-button';
import { Modal } from '@components/modal';
import { MAX_STAT, StatBar } from '@components/stat-bar';
import { translate } from '@helper/translate';
import { saveCharName, saveStatus } from '@redux/slices/SavesSlice';
import { Colors, CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import {
  ATTRIBUTE_META,
  CHAR_NAME_MAX_LENGTH,
  INITIAL_ATTRIBUTES,
  TOTAL_POINTS,
} from './CharacterCreation.constants';
import { styles } from './CharacterCreation.styles';

const CharacterCreation = () => {
  const [attributes, setAttributes] = useState<IStatus>(INITIAL_ATTRIBUTES);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [charName, setCharName] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<GameStackParamsList>>();

  const spentPoints = useMemo(
    () => Object.values(attributes).reduce((sum, value) => sum + value, 0),
    [attributes],
  );
  const remainingPoints = TOTAL_POINTS - spentPoints;
  const canConfirm = remainingPoints === 0;
  const trimmedName = charName.trim();

  const increase = (id: AttributeId) => {
    setAttributes((current) => {
      const spent = Object.values(current).reduce(
        (sum, value) => sum + value,
        0,
      );
      if (TOTAL_POINTS - spent <= 0 || current[id] >= MAX_STAT) {
        return current;
      }
      return { ...current, [id]: current[id] + 1 };
    });
  };

  const decrease = (id: AttributeId) => {
    setAttributes((current) => {
      if (current[id] <= 0) {
        return current;
      }
      return { ...current, [id]: current[id] - 1 };
    });
  };

  const handleInitialize = () => {
    dispatch(saveStatus(attributes));
    setIsNameModalOpen(true);
  };

  const handleSaveName = () => {
    if (!trimmedName) {
      return;
    }
    dispatch(saveCharName(trimmedName));
    setIsNameModalOpen(false);
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require('@assets/backgrounds/character_creation.png')}
      style={CommonStyles.flex1}
      resizeMode="cover"
    >
      <SafeAreaView style={CommonStyles.flex1}>
        <View style={CommonStyles.flex1}>
          <ScrollView
            style={CommonStyles.flex1}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.pointsBlock}>
              <Text style={styles.pointsValue}>
                {translate('characterCreation.pointsRemaining', {
                  remaining: remainingPoints,
                })}
              </Text>
            </View>

            <View>
              {ATTRIBUTE_META.map((attribute) => (
                <StatBar
                  key={attribute.id}
                  label={translate(attribute.label)}
                  shortLabel={attribute.shortLabel}
                  description={translate(attribute.description)}
                  value={attributes[attribute.id]}
                  canIncrease={
                    remainingPoints > 0 && attributes[attribute.id] < MAX_STAT
                  }
                  canDecrease={attributes[attribute.id] > 0}
                  onIncrease={() => increase(attribute.id)}
                  onDecrease={() => decrease(attribute.id)}
                />
              ))}
            </View>
            <ImageButton
              disabled={!canConfirm}
              source={require('@assets/buttons/button_confirm.png')}
              style={styles.button}
              text={translate('characterCreation.initialize')}
              onPress={handleInitialize}
              textStyle={styles.saveButtonText}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
      <Modal
        testID="CharacterCreation-nameModal"
        isVisible={isNameModalOpen}
        title={translate('characterCreation.charName')}
      >
        <TextInput
          testID="CharacterCreation-nameInput"
          value={charName}
          onChangeText={setCharName}
          maxLength={CHAR_NAME_MAX_LENGTH}
          autoCapitalize="words"
          autoCorrect={false}
          placeholderTextColor={Colors.placeholderTextColor}
          style={styles.nameInput}
        />
        <ImageButton
          testID="CharacterCreation-saveName"
          disabled={!trimmedName}
          source={require('@assets/buttons/button_confirm.png')}
          style={styles.nameSaveButton}
          text={translate('characterCreation.save')}
          onPress={handleSaveName}
          textStyle={styles.saveButtonText}
        />
      </Modal>
    </ImageBackground>
  );
};

export default CharacterCreation;
