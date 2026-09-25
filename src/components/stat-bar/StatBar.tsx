import React from 'react';

import { Image, Text, View } from 'react-native';

import { ImageButton } from '@components/image-button';

import { MAX_STAT } from './StatBar.constants';
import { styles } from './StatBar.styles';
import type { IStatBar } from './StatBar.types';

const StatBar: React.FC<IStatBar> = ({
  label,
  shortLabel,
  description,
  value,
  canIncrease,
  canDecrease,
  onIncrease,
  onDecrease,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.shortLabel}>{label}</Text>
      <Text style={styles.description}>{description}</Text>

      <View style={styles.controls}>
        <ImageButton
          testID={`StatBar-${shortLabel}-decrease`}
          source={require('@assets/buttons/button_minus.png')}
          style={styles.stepButtonImage}
          onPress={onDecrease}
          disabled={!canDecrease}
        />

        <View style={styles.bars}>
          {Array.from({ length: MAX_STAT }, (_, index) => (
            <Image
              key={index}
              source={
                index < value
                  ? require('@assets/icons/square_filled.png')
                  : require('@assets/icons/square_empty.png')
              }
              style={index < value ? styles.segmentFilled : styles.segmentEmpty}
              resizeMode="contain"
            />
          ))}
        </View>

        <ImageButton
          testID={`StatBar-${shortLabel}-increase`}
          source={require('@assets/buttons/button_plus.png')}
          style={styles.stepButtonImage}
          onPress={onIncrease}
          disabled={!canIncrease}
        />
      </View>
    </View>
  );
};

export default StatBar;
