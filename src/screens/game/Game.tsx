import { ImageBackground, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ChoiceSelectModal } from '@components/choice-select-modal';
import { Dialogue } from '@components/dialogue';
import { DiceRollD20 } from '@components/dice-roll-d20';
import { ImageButton } from '@components/image-button';
import { NarratorText } from '@components/narrator-text';
import { StoryLog } from '@components/story-log';
import {
  EnemiesId,
  getCharacter,
  getStoryBackgroundImage,
  prologueChapter,
} from '@data/story';
import { translate } from '@helper/translate';
import { Common, CommonStyles } from '@styles';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import GameDebugJump, { GameDebugDice } from './Game.debug';
import { useStoryGame } from './Game.hooks';
import { styles } from './Game.styles';

const Game = () => {
  const {
    page,
    storyLog,
    choices,
    isChoicesOpen,
    pendingDiceChoice,
    currentBackground,
    nodeIds,
    currentNodeId,
    shouldCreateCharacter,
    selectChoice,
    completeDiceRoll,
    isDiceSuccess,
    goToNode,
  } = useStoryGame(prologueChapter);
  const backgroundImage = getStoryBackgroundImage(
    currentBackground.backgroundImage,
  );
  const navigation = useNavigation<StackNavigationProp<GameStackParamsList>>();
  const insets = useSafeAreaInsets();

  const speaker =
    page?.kind === 'dialogue' ? getCharacter(page.characterId) : undefined;

  const handleAdvance = () => {
    if (shouldCreateCharacter()) {
      navigation.navigate('CharacterCreation');
    }
  };

  const pageContent =
    page?.kind === 'dialogue' ? (
      <View style={styles.dialogueContainer}>
        <Dialogue
          name={speaker ? translate(speaker.name) : undefined}
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
      <View
        style={[styles.rightContainer, { top: Common.iconTop(insets.top) }]}
      >
        <ImageButton
          testID="Game-settings"
          source={require('@assets/icons/icon_settings.png')}
          style={styles.settingsIcon}
          onPress={() => navigation.navigate('OptionsBottomTabNavigator')}
        />
        {__DEV__ ? (
          <GameDebugJump
            nodeIds={nodeIds}
            currentNodeId={currentNodeId}
            onJump={goToNode}
            onOpenCombat={() =>
              navigation.navigate('Combat', { enemyId: EnemiesId.enemy1 })
            }
          />
        ) : null}
      </View>

      <StoryLog entries={storyLog} />
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
