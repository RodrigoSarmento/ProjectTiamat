import { useMemo, useState } from 'react';

import { ImageBackground, ScrollView, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { ImageButton } from '@components/image-button';
import { MAX_STAT, StatBar } from '@components/stat-bar';
import { saveStatus } from '@redux/slices/SavesSlice';
import { CommonStyles, Fonts } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import {
  ATTRIBUTE_META,
  INITIAL_ATTRIBUTES,
  TOTAL_POINTS,
} from './CharacterCreation.constants';
import { styles } from './CharacterCreation.styles';

const CharacterCreation = () => {
  const [attributes, setAttributes] = useState<IStatus>(INITIAL_ATTRIBUTES);
  const dispatch = useDispatch();
  const navigation =
    useNavigation<
      StackNavigationProp<GameStackParamsList, 'CharacterCreation'>
    >();

  const spentPoints = useMemo(
    () => Object.values(attributes).reduce((sum, value) => sum + value, 0),
    [attributes],
  );
  const remainingPoints = TOTAL_POINTS - spentPoints;
  const canConfirm = remainingPoints === 0;

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

  return (
    <ImageBackground
      source={require('@assets/backgrounds/journal_page.png')}
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
            <Text style={Fonts.titleScreen}>Paladin</Text>
            <View style={styles.pointsBlock}>
              <Text style={styles.pointsValue}>
                Points remaining:{'   '}
                {remainingPoints}
              </Text>
            </View>

            <View>
              {ATTRIBUTE_META.map((attribute) => (
                <StatBar
                  key={attribute.id}
                  label={attribute.label}
                  shortLabel={attribute.shortLabel}
                  description={attribute.description}
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
              source={require('@assets/buttons/button_wax_seal.png')}
              style={styles.button}
              text="Begin the journey"
              onPress={() => {
                dispatch(saveStatus(attributes));
                navigation.navigate('Game');
              }}
              textStyle={styles.saveButtonText}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default CharacterCreation;
