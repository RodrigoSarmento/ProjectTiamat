import React from 'react';

import { Image, ImageBackground, Pressable, Text, View } from 'react-native';

import { NineSliceImage } from '@components/nine-slice-image';

import {
  CONTINUE_LABEL,
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
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={name ? `${name}: ${text}` : text}
      accessibilityHint="Continue"
      onPress={onPress}
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
        <Text numberOfLines={4} style={styles.text}>
          {text}
        </Text>
        <Text style={styles.continue}>{CONTINUE_LABEL}</Text>
      </View>
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
    </Pressable>
  );
};

export default Dialogue;
