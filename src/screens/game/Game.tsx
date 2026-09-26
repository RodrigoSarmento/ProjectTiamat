import { ImageBackground, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ChoiceSelectModal } from '@components/choice-select-modal';
import { Dialogue } from '@components/dialogue';
import { DiceRollD20 } from '@components/dice-roll-d20';
import { NarratorText } from '@components/narrator-text';
import {
  getCharacter,
  getStoryBackgroundImage,
  prologueChapter,
} from '@data/story';
import { storyText } from '@helper/storyText';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import GameDebugJump, { GameDebugDice } from './Game.debug';
import { useStoryGame } from './Game.hooks';
import { styles } from './Game.styles';

const Game = () => {
  const {
    page,
    choices,
    isChoicesOpen,
    pendingDiceChoice,
    currentBackground,
    nodeIds,
    advance,
    closeChoices,
    selectChoice,
    completeDiceRoll,
    isDiceSuccess,
    goToNode,
  } = useStoryGame(prologueChapter);
  const backgroundImage = getStoryBackgroundImage(
    currentBackground.backgroundImage,
  );
  const navigation = useNavigation<StackNavigationProp<GameStackParamsList>>();

  const handleAdvance = () => {
    if (advance()) {
      navigation.navigate('CharacterCreation');
    }
  };

  const speaker =
    page?.kind === 'dialogue' ? getCharacter(page.characterId) : undefined;
  const pageContent =
    page?.kind === 'dialogue' ? (
      <View style={styles.dialogueContainer}>
        <Dialogue
          name={speaker ? storyText(speaker.name) : undefined}
          text={page.text}
          portrait={speaker?.portrait}
          portraitPosition={page.portraitPosition}
          onPress={handleAdvance}
        />
      </View>
    ) : page?.kind === 'narrator' ? (
      <NarratorText
        title={page.title}
        text={page.text}
        onPress={handleAdvance}
      />
    ) : null;

  const content = (
    <SafeAreaView style={CommonStyles.flex1}>
      <View style={[CommonStyles.flex1, isChoicesOpen && styles.dimmed]}>
        {pageContent}
      </View>
      <ChoiceSelectModal
        isVisible={isChoicesOpen}
        choices={choices}
        onSelect={selectChoice}
        onClose={closeChoices}
      />
      {pendingDiceChoice ? (
        <View style={styles.diceOverlay}>
          <DiceRollD20
            key={pendingDiceChoice.id}
            isSuccess={isDiceSuccess}
            onComplete={completeDiceRoll}
          />
          {__DEV__ ? (
            <GameDebugDice
              onForceSuccess={() => completeDiceRoll(20, true)}
              onForceFailure={() => completeDiceRoll(1, false)}
            />
          ) : null}
        </View>
      ) : null}
      {__DEV__ ? <GameDebugJump nodeIds={nodeIds} onJump={goToNode} /> : null}
    </SafeAreaView>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        style={[CommonStyles.flex1, styles.imageScreen]}
        imageStyle={styles.fadedBackground}
        resizeMode="cover"
      >
        {content}
      </ImageBackground>
    );
  }

  if (currentBackground.backgroundColor) {
    return (
      <View
        style={[
          CommonStyles.flex1,
          { backgroundColor: currentBackground.backgroundColor },
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('@assets/backgrounds/gameplay_page.png')}
      style={[CommonStyles.flex1, styles.imageScreen]}
      imageStyle={styles.fadedBackground}
      resizeMode="cover"
    >
      {content}
    </ImageBackground>
  );
};

export default Game;
