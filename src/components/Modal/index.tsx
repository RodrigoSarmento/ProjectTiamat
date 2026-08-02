import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  ImageStyle,
  Modal as RNModal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import Button from '@components/Button';
import IconButton from '@components/IconButton';
import { Colors, Common, Fonts } from '@styles';

export interface IModal {
  title?: string;
  imageSource?: ImageSourcePropType;
  imageStyle?: ImageStyle;
  message?: string;
  footerText?: string;
  isVisible?: boolean;
  buttonOneText?: string;
  buttonTwoText?: string;
  children?: React.ReactNode;
  animationTiming?: number;
  shouldRenderCloseButton?: boolean;
  testID?: string;
  customStyle?: ViewStyle;
  variant?: 'regular' | 'bottom' | 'top';
  transparent?: boolean;
  onButtonOnePress?: () => void;
  onButtonTwoPress?: () => void;
  onBackdropPress?: () => void;
}

const Modal: React.FC<IModal> = ({
  title,
  imageSource,
  imageStyle,
  message,
  footerText,
  isVisible = false,
  buttonOneText,
  buttonTwoText,
  children,
  animationTiming = 300,
  shouldRenderCloseButton = false,
  testID,
  variant = 'regular',
  customStyle,
  transparent = false,
  onButtonOnePress = () => {},
  onButtonTwoPress = () => {},
  onBackdropPress = () => {},
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(
    new Animated.Value(variant === 'top' ? -300 : 300),
  ).current;

  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setVisible(true);
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: variant === 'top' ? -300 : 300,
          duration: animationTiming,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setVisible(false);
      });
    }
  }, [isVisible, scaleAnim, slideAnim, animationTiming, variant]);

  const renderButtons = useCallback(() => {
    const { buttonsContainer } = styles;

    return (
      <View style={buttonsContainer}>
        {buttonOneText && (
          <Button
            title={buttonOneText}
            variant="primary"
            onPress={onButtonOnePress}
          />
        )}
        {buttonTwoText && (
          <Button
            title={buttonTwoText}
            variant="minimal"
            onPress={onButtonTwoPress}
          />
        )}
      </View>
    );
  }, [buttonOneText, buttonTwoText, onButtonOnePress, onButtonTwoPress]);

  const containerStyle = useMemo(() => {
    const { modalContentBottom, modalContentRegular, modalContentTop } = styles;

    switch (variant) {
      case 'regular':
        return {
          ...modalContentRegular,
          ...customStyle,
          backgroundColor: transparent ? 'transparent' : Colors.white,
        };
      case 'bottom':
        return {
          ...modalContentBottom,
          ...customStyle,
          backgroundColor: transparent ? 'transparent' : Colors.white,
        };
      case 'top':
        return {
          ...modalContentTop,
          ...customStyle,
          backgroundColor: transparent ? 'transparent' : Colors.white,
        };
    }
  }, [customStyle, transparent, variant]);

  const transform = useMemo(() => {
    return variant === 'regular'
      ? [{ scale: scaleAnim }]
      : [{ translateY: slideAnim }];
  }, [scaleAnim, slideAnim, variant]);

  const { backdrop, titleText, messageText, image, imageContainer } = styles;

  return (
    <RNModal
      testID={testID}
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onBackdropPress}
    >
      <View style={styles.outerContainer}>
        <TouchableWithoutFeedback
          testID="modalBackDrop"
          onPress={onBackdropPress}
        >
          <View style={backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View style={[containerStyle, { transform }]}>
          {imageSource && (
            <View style={imageContainer}>
              <Image style={[image, imageStyle]} source={imageSource} />
            </View>
          )}
          {title && <Text style={titleText}>{title}</Text>}
          {message && <Text style={messageText}>{message}</Text>}
          {children && <View>{children}</View>}
          {renderButtons()}
          {footerText && <Text style={styles.footerText}>{footerText}</Text>}
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentRegular: {
    backgroundColor: Colors.white,
    borderRadius: Common.radiusLarge,
    padding: 24,
    marginHorizontal: 24,
    maxHeight: Common.screenHeight * 0.85,
  },
  modalContentTop: {
    backgroundColor: Colors.white,
    borderRadius: Common.radiusLarge,
    padding: 24,
    left: 24,
    right: 24,
    position: 'absolute',
    top: 50,
  },
  modalContentBottom: {
    backgroundColor: Colors.white,
    width: '100%',
    borderTopLeftRadius: Common.radiusLarge,
    borderTopRightRadius: Common.radiusLarge,
    padding: 24,
    position: 'absolute',
    bottom: 0,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  titleText: {
    ...Fonts.titleSection,
    color: Colors.blackAbsolute,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageText: {
    ...Fonts.contentBase,
    color: Colors.grayBase,
    textAlign: 'center',
    marginBottom: 12,
  },
  buttonsContainer: {
    marginTop: 12,
  },
  iconStyle: {
    width: 12,
    height: 12,
    tintColor: Colors.primaryDarkColor,
  },
  image: {
    width: 120,
    height: 120,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerText: {
    ...Fonts.contentSmall,
    color: Colors.grayBase,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default Modal;
