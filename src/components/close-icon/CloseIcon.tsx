import React from 'react';

import { useNavigation } from '@react-navigation/native';

import { ImageButton } from '@components/image-button';

import { styles } from './CloseIcon.styles';
import type { ICloseIcon } from './CloseIcon.types';

const closeIcon = require('@assets/icons/icon_close.png');

const CloseIcon: React.FC<ICloseIcon> = ({ onPress, testID = 'CloseIcon' }) => {
  const navigation = useNavigation();

  return (
    <ImageButton
      testID={testID}
      source={closeIcon}
      onPress={onPress ?? (() => navigation.goBack())}
      style={styles.icon}
      containerStyle={styles.button}
    />
  );
};

export default CloseIcon;
