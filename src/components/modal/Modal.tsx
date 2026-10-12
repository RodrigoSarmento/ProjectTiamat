import React, { useEffect, useMemo, useState } from 'react';

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
  const [scaleAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(
    () => new Animated.Value(variant === 'top' ? -300 : 300),
  );

  const [visible, setVisible] = useState(isVisible);

  if (isVisible && !visible) {
    setVisible(true);
  }

  useEffect(() => {
    if (isVisible) {
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
      ]).start(({ finished }) => {
        if (finished) {
          setVisible(false);
        }
      });
    }
  }, [isVisible, scaleAnim, slideAnim, animationTiming, variant]);

  const containerStyle = useMemo(() => {
    const { modalContentBottom, modalContentRegular, modalContentTop } = styles;

    const backgroundColor = transparent ? 'transparent' : Colors.white;

    switch (variant) {
      case 'regular':
        return { ...modalContentRegular, backgroundColor, ...customStyle };
      case 'bottom':
        return { ...modalContentBottom, backgroundColor, ...customStyle };
      case 'top':
        return { ...modalContentTop, backgroundColor, ...customStyle };
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
