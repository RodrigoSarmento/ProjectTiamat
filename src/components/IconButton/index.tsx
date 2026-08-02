import React, { useMemo } from 'react';

import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { CommonStyles, Fonts } from '@styles';

export interface IIconButton {
  testID?: string;
  imageTestID?: string;
  isActive?: boolean;
  customStyle?: ViewStyle;
  source: ImageSourcePropType;
  customIconStyle?: ImageStyle;
  variant?: 'large' | 'base' | 'small' | 'no_background';
  backgroundColor?: string;
  tintColor?: string;
  textBelow?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

const IconButton: React.FC<IIconButton> = ({
  onPress,
  onLongPress,
  testID,
  imageTestID,
  isActive = true,
  customStyle,
  source,
  customIconStyle,
  variant = 'no_background',
  backgroundColor,
  tintColor,
  textBelow,
}) => {
  const containerStyle = useMemo(() => {
    const { baseContainerStyle } = styles;

    switch (variant) {
      case 'base': {
        return {
          ...baseContainerStyle,
          width: 40,
          height: 40,
          backgroundColor,
          ...customStyle,
        };
      }
      case 'large': {
        return {
          ...baseContainerStyle,
          width: 48,
          height: 48,
          backgroundColor,
          ...customStyle,
        };
      }
      case 'small': {
        return {
          ...baseContainerStyle,
          width: 32,
          height: 32,
          backgroundColor,
          ...customStyle,
        };
      }
      case 'no_background': {
        return { ...baseContainerStyle, ...customStyle };
      }
    }
  }, [backgroundColor, customStyle, variant]);
  const iconStyle = useMemo(() => {
    const { baseIconStyle } = styles;

    switch (variant) {
      case 'base': {
        return {
          ...baseIconStyle,
          tintColor: tintColor,
          ...customIconStyle,
        };
      }
      case 'large': {
        return {
          ...baseIconStyle,
          width: 30,
          height: 30,
          tintColor: tintColor,
          ...customIconStyle,
        };
      }
      case 'small': {
        return {
          ...baseIconStyle,
          width: 20,
          height: 20,
          tintColor: tintColor,
          ...customIconStyle,
        };
      }
      case 'no_background': {
        return { ...baseIconStyle, ...customIconStyle };
      }
    }
  }, [customIconStyle, tintColor, variant]);

  const { textBelowStyle } = styles;

  return (
    <View style={CommonStyles.columnCenter}>
      <TouchableOpacity
        testID={testID}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={!isActive}
        style={containerStyle}
      >
        <Image
          testID={imageTestID}
          style={iconStyle}
          source={source}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
      {textBelow && <Text style={textBelowStyle}>{textBelow}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainerStyle: {
    height: 24,
    width: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseIconStyle: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textBelowStyle: {
    ...Fonts.contentSmall,
    textAlign: 'center',
  },
});

export default IconButton;
