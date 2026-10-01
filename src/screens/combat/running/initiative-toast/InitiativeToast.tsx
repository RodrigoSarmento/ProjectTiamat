import React from 'react';

import { Text, View } from 'react-native';

import { translate } from '@helper/translate';
import { Colors } from '@styles';
import Animated, { FadeOut, ZoomIn } from 'react-native-reanimated';
import Svg, { Polygon } from 'react-native-svg';

import { D20_SIZE } from './InitiativeToast.constants';
import { styles } from './InitiativeToast.styles';
import type { ID20Roll, IInitiativeToast } from './InitiativeToast.types';

const D20Roll = ({ label, value, color }: ID20Roll) => (
  <View style={styles.roll}>
    <View style={styles.d20}>
      <Svg width={D20_SIZE} height={D20_SIZE} viewBox="0 0 64 64">
        <Polygon
          points="32,3 58,18 58,46 32,61 6,46 6,18"
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
        <Polygon
          points="32,14 49,42 15,42"
          fill="none"
          stroke={color}
          strokeWidth={1.5}
        />
      </Svg>
    </View>
    <Text style={[styles.rollLabel, { color }]}>{label}</Text>
    <Text style={[styles.rollValue, { color }]}>{value}</Text>
  </View>
);

const InitiativeToast: React.FC<IInitiativeToast> = ({
  initiative,
  enemyName,
}) => {
  return (
    <Animated.View
      testID="InitiativeToast"
      entering={ZoomIn.duration(220)}
      exiting={FadeOut.duration(200)}
      style={styles.toast}
    >
      <Text style={styles.title}>{translate('combat.initiative')}</Text>
      <View style={styles.rolls}>
        <D20Roll
          label={translate('characters.you')}
          value={initiative.player}
          color={Colors.neonCyan}
        />
        <D20Roll
          label={enemyName}
          value={initiative.enemy}
          color={Colors.warningRed}
        />
      </View>
      <Text style={styles.verdict}>
        {initiative.playerFirst
          ? translate('combat.youFirst')
          : translate('combat.enemyFirst', { name: enemyName })}
      </Text>
    </Animated.View>
  );
};

export default InitiativeToast;
