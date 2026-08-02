import React, { useMemo } from 'react';

import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { Colors, Common, Fonts } from '@styles';

export interface IButton {
  testID?: string;
  loading?: boolean;
  size?: 'small' | 'base';
  title: string;
  subtitle?: string;
  isActive?: boolean;
  variant?:
    'primary' | 'secondary' | 'minimal' | 'negative' | 'danger' | 'icon';
  icon?: ImageSourcePropType;
  customStyle?: ViewStyle;
  customTextStyle?: TextStyle;
  onPress: () => void;
  onLongPress?: () => void;
  activeOpacity?: number;
}

const Button: React.FC<IButton> = ({
  onPress,
  onLongPress,
  testID,
  loading = false,
  size = 'base',
  title,
  subtitle,
  isActive = true,
  variant = 'primary',
  customStyle,
  customTextStyle,
  activeOpacity = 0.7,
  icon,
}) => {
  const buttonStyle = useMemo(() => {
    const { baseStyle } = styles;

    let style: ViewStyle = { ...baseStyle };

    if (variant === 'primary') {
      style = {
        ...style,
        backgroundColor: Colors.primaryColor,
      };
    }

    if (size === 'small') {
      style = {
        ...style,
        height: 32,
        borderRadius: Common.radiusBase,
      };
    }

    if (variant === 'secondary') {
      style = {
        ...style,
        backgroundColor: Colors.lightNeutral,
      };
    }

    if (variant === 'negative') {
      style = {
        ...style,
        backgroundColor: Colors.negativeNumber,
      };
    }

    if (variant === 'danger') {
      style = {
        ...style,
        backgroundColor: Colors.feedbackCritical,
      };
    }

    if (variant === 'minimal') {
      style = {
        ...style,
        paddingHorizontal: 0,
      };
    }

    if (variant === 'icon') {
      style = {
        ...style,
        gap: 8,
        backgroundColor: Colors.primaryColor,
      };
    }

    style.opacity = isActive ? 1 : 0.5;

    style = { ...style, ...customStyle };

    return style;
  }, [variant, isActive, customStyle, size]);

  const textStyle = useMemo(() => {
    const { baseTextStyle: newTextButtonStyle } = styles;

    let style: TextStyle = newTextButtonStyle;

    if (variant === 'secondary' || variant === 'icon') {
      style = { ...style, color: Colors.blackPrimary };
    }

    if (variant === 'negative' || variant === 'danger' || variant === 'icon') {
      style = {
        ...style,
        color: Colors.white,
      };
    }

    if (variant === 'minimal') {
      style = {
        ...style,
        color: Colors.blackPrimary,
        textDecorationLine: 'underline',
        textDecorationColor: Colors.primaryDarkColor,
      };
    }

    style = { ...style, ...customTextStyle };

    return style;
  }, [variant, customTextStyle]);

  const iconStyle = useMemo(() => {
    return { ...styles.iconStyleBase, tintColor: textStyle.color };
  }, [textStyle.color]);

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={buttonStyle}
      disabled={!isActive}
      activeOpacity={activeOpacity}
    >
      {loading && (
        <ActivityIndicator
          testID="LoadingIndicator"
          style={styles.loadingContainer}
          color={Colors.blackPrimary}
        />
      )}
      {variant === 'icon' && icon && <Image style={iconStyle} source={icon} />}
      {title && subtitle ? (
        <View style={styles.titleSubtitleContainerStyle}>
          <Text style={textStyle}>{title}</Text>
          <Text style={textStyle}>{subtitle}</Text>
        </View>
      ) : (
        <Text style={textStyle}>{title || subtitle}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseStyle: {
    height: 55,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Common.radiusSmall,
    paddingHorizontal: 16,
    borderColor: Colors.primaryColor,
  },
  iconStyleBase: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  titleSubtitleContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  baseTextStyle: {
    textAlign: 'center',
    ...Fonts.contentBaseBold,
    color: Colors.white,
  },
  loadingContainer: { paddingRight: 16 },
});

export default Button;
