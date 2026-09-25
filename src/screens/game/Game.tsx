import { ImageBackground, View } from 'react-native';

import { ChoiceSelectModal } from '@components/choice-select-modal';
import { Dialogue } from '@components/dialogue';
import { NarratorText } from '@components/narrator-text';
import {
  getCharacter,
  getStoryBackgroundImage,
  prologueChapter,
} from '@data/story';
import { storyText } from '@helper/storyText';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import GameDebugJump from './Game.debug';
import { useStoryGame } from './Game.hooks';
import { styles } from './Game.styles';

const Game = () => {
  const {
    page,
    choices,
    isChoicesOpen,
    currentBackground,
    nodeIds,
    advance,
    closeChoices,
    selectChoice,
    goToNode,
  } = useStoryGame(prologueChapter);
  const backgroundImage = getStoryBackgroundImage(
    currentBackground.backgroundImage,
  );

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
          onPress={advance}
        />
      </View>
    ) : page?.kind === 'narrator' ? (
      <NarratorText title={page.title} text={page.text} onPress={advance} />
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
