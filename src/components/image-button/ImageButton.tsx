import React from 'react';

import { Image, Pressable, Text, View } from 'react-native';

import { styles } from './ImageButton.styles';
import type { ImageButtonProps } from './ImageButton.types';

const ImageButton: React.FC<ImageButtonProps> = ({
  disabled = false,
  onPress,
  style,
  text,
  textStyle,
  ...imageProps
}) => {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.pressable, disabled && styles.disabled]}
    >
      <Image {...imageProps} style={style} />
      {text ? (
        <View pointerEvents="none" style={styles.textOverlay}>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            style={[styles.text, textStyle]}
          >
            {text}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
};

export default ImageButton;
