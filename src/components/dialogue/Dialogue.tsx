import React from 'react';

import { Image, ImageBackground, Pressable, Text, View } from 'react-native';

import { NineSliceImage } from '@components/nine-slice-image';

import {
  CONTINUE_LABEL,
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
  onPress,
  testID = 'Dialogue',
}) => {
  return (
    <View
      testID={testID}
      accessibilityLabel={name ? `${name}: ${text}` : text}
      style={styles.container}
    >
      <View style={styles.panel}>
        <NineSliceImage
          source={require('@assets/ui/dialogue_panel.png')}
          capInsets={PANEL_CAP_INSETS}
          sourceSize={PANEL_SOURCE_SIZE}
          style={styles.panelImage}
        />
        {name ? (
          <View style={styles.namePlate}>
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
        <Pressable
          testID={`${testID}-continue`}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          hitSlop={12}
          onPress={onPress}
          style={styles.continueButton}
        >
          <Text style={styles.continue}>{CONTINUE_LABEL}</Text>
        </Pressable>
      </View>
      {portrait ? (
        <ImageBackground
          source={require('@assets/ui/dialogue_portrait_frame.png')}
          style={styles.portraitWrap}
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
