import React from 'react';

import { Image, ImageBackground, Text, View } from 'react-native';

import { ContinueButton } from '@components/continue-button';
import { NineSliceImage } from '@components/nine-slice-image';

import {
  DIALOGUE_MAX_LINES,
  PANEL_CAP_INSETS,
  PANEL_SOURCE_SIZE,
} from './Dialogue.constants';
import { styles } from './Dialogue.styles';
import type { IDialogue } from './Dialogue.types';

const Dialogue: React.FC<IDialogue> = ({
  name,
  text,
  portrait,
  portraitPosition = 'right',
  onPress,
  testID = 'Dialogue',
}) => {
  const isLeft = portraitPosition === 'left';

  return (
    <View testID={testID} style={styles.container}>
      <View style={styles.panel}>
        <NineSliceImage
          source={require('@assets/ui/dialogue_panel.png')}
          capInsets={PANEL_CAP_INSETS}
          sourceSize={PANEL_SOURCE_SIZE}
          style={styles.panelImage}
        />
        {name ? (
          <View style={[styles.namePlate, isLeft && styles.namePlateLeft]}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.6}
              style={styles.name}
            >
              {name}
            </Text>
          </View>
        ) : null}
        <Text numberOfLines={DIALOGUE_MAX_LINES} style={styles.text}>
          {text}
        </Text>
        <ContinueButton onPress={onPress} testID={`${testID}-continue`} />
      </View>
      {portrait ? (
        <ImageBackground
          testID={`${testID}-portrait-wrap`}
          source={require('@assets/ui/dialogue_portrait_frame.png')}
          style={[
            styles.portraitWrap,
            isLeft ? styles.portraitLeft : styles.portraitRight,
          ]}
        >
          <Image
            testID={`${testID}-portrait`}
            source={portrait}
            style={styles.portraitImage}
            resizeMode="cover"
          />
        </ImageBackground>
      ) : null}
    </View>
  );
};

export default Dialogue;
