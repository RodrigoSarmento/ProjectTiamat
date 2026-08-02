import { useState } from 'react';

import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import DiceRollD20 from '@components/DiceRollD20';
import Modal from '@components/Modal';
import { CommonStyles } from '@styles/CommonStyles';
import { Fonts } from '@styles/Font';
import { SafeAreaView } from 'react-native-safe-area-context';

const CharacterCreation = () => {
  const [totalPoints, setTotalPoints] = useState(10);
  const [strength, setStrength] = useState(0);
  const [dexterity, setDexterity] = useState(0);
  const [constitution, setConstitution] = useState(0);
  const [intelligence, setIntelligence] = useState(0);
  const [wisdom, setWisdom] = useState(0);
  const [charisma, setCharisma] = useState(0);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const renderStat = (
    statName: string,
    stat: number,
    onPressDown: () => void,
    onPressUp: () => void,
  ) => {
    return (
      <View>
        <Text style={Fonts.titleBodyRegular}>{statName}</Text>
        <View style={styles.statContainer}>
          <Text style={Fonts.titleBodyRegular}>{stat}</Text>
          <Pressable
            onPress={() => {
              onPressDown();
              setTotalPoints(totalPoints + 1);
            }}
            style={styles.button}
            disabled={totalPoints === 0 || stat === 0}
          >
            <Text style={Fonts.captionBold}>-</Text>
          </Pressable>
          <View style={styles.bars}>
            {Array.from({ length: 6 }, (_, index) => (
              <Image
                key={index}
                style={styles.bar}
                source={
                  index < stat
                    ? require('@assets/icons/bar_filled.png')
                    : require('@assets/icons/bar_unfilled.png')
                }
              />
            ))}
          </View>

          <Pressable
            onPress={() => {
              onPressUp();
              setTotalPoints(totalPoints - 1);
            }}
            style={styles.button}
            disabled={totalPoints === 0 || stat === 6}
          >
            <Text style={Fonts.captionBold}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setIsModalVisible(false)}
      >
        <DiceRollD20 size={700} color="#C24122" onComplete={setLastRoll} />
        {lastRoll != null && (
          <Text style={Fonts.contentBase}>Last roll: {lastRoll}</Text>
        )}
      </Modal>
    );
  };

  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <View style={CommonStyles.screenContainer}>
        <View>
          <Text style={Fonts.titleScreen}>Character Creation</Text>
          <Text style={Fonts.contentBase}>Total Points: {totalPoints}</Text>
        </View>

        {renderStat(
          'Strength',
          strength,
          () => setStrength(strength - 1),
          () => setStrength(strength + 1),
        )}
        {renderStat(
          'Dexterity',
          dexterity,
          () => setDexterity(dexterity - 1),
          () => setDexterity(dexterity + 1),
        )}
        {renderStat(
          'Constitution',
          constitution,
          () => setConstitution(constitution - 1),
          () => setConstitution(constitution + 1),
        )}
        {renderStat(
          'Intelligence',
          intelligence,
          () => setIntelligence(intelligence - 1),
          () => setIntelligence(intelligence + 1),
        )}
        {renderStat(
          'Wisdom',
          wisdom,
          () => setWisdom(wisdom - 1),
          () => setWisdom(wisdom + 1),
        )}
        {renderStat(
          'Charisma',
          charisma,
          () => setCharisma(charisma - 1),
          () => setCharisma(charisma + 1),
        )}

        <Pressable onPress={() => setIsModalVisible(true)}>
          <Text style={Fonts.captionBold}>Roll a d20</Text>
        </Pressable>
        {renderModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'brown',
    padding: 10,
    borderRadius: 5,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bars: {
    flexDirection: 'row',
  },
  bar: {
    width: 36,
    height: 36,
  },
  rollSection: {
    marginTop: 16,
    alignItems: 'center',
    gap: 8,
  },
});

export default CharacterCreation;
