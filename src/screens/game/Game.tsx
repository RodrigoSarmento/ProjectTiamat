import { useState } from 'react';

import { ImageBackground, View } from 'react-native';

import { Dialogue } from '@components/dialogue';
import { CommonStyles } from '@styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SAMPLE_DIALOGUE } from './Game.constants';
import { styles } from './Game.styles';

const Game = () => {
  const [lineIndex, setLineIndex] = useState(0);
  const line = SAMPLE_DIALOGUE[lineIndex];

  return (
    <ImageBackground
      source={require('@assets/backgrounds/gameplay_page.png')}
      style={CommonStyles.flex1}
      resizeMode="cover"
    >
      <SafeAreaView style={CommonStyles.flex1}>
        <View style={styles.dialogueContainer}>
          <Dialogue
            name={line.name}
            text={line.text}
            portrait={line.portrait}
            onPress={() =>
              setLineIndex((current) =>
                Math.min(current + 1, SAMPLE_DIALOGUE.length - 1),
              )
            }
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Game;
