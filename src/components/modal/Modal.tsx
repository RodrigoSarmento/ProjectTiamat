import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Animated,
  Easing,
  Image,
  Modal as RNModal,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Colors } from '@styles';

import { styles } from './Modal.styles';
import type { IModal } from './Modal.types';

const Modal: React.FC<IModal> = ({
  title,
  imageSource,
  imageStyle,
  message,
  footerText,
  isVisible = false,
  children,
  animationTiming = 300,
  testID,
  variant = 'regular',
  customStyle,
  transparent = false,
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

  if (!visible) {
    return null;
  }

  return (
    <RNModal
      testID={testID}
      visible
      animationType="fade"
      transparent
      onRequestClose={onBackdropPress}
    >
      <View style={styles.outerContainer} pointerEvents="box-none">
        <TouchableWithoutFeedback
          testID="modalBackDrop"
          onPress={onBackdropPress}
        >
          <View style={backdrop} />
        </TouchableWithoutFeedback>

        <Animated.View
          pointerEvents="box-none"
          style={[containerStyle, styles.modalLayer, { transform }]}
        >
          {imageSource && (
            <View style={imageContainer}>
              <Image style={[image, imageStyle]} source={imageSource} />
            </View>
          )}
          {title && <Text style={titleText}>{title}</Text>}
          {message && <Text style={messageText}>{message}</Text>}
          {children}
          {footerText && <Text style={styles.footerText}>{footerText}</Text>}
        </Animated.View>
      </View>
    </RNModal>
  );
};

export default Modal;
