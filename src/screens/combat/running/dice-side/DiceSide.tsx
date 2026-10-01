import React from 'react';

import { Text, View } from 'react-native';

import { CombatDie } from '@components/combat-die';
import { translate } from '@helper/translate';

import { SIDE_DIE_SIZE } from './DiceSide.constants';
import { styles } from './DiceSide.styles';
import type { IDiceSide } from './DiceSide.types';

const DiceSide: React.FC<IDiceSide> = ({
  label,
  color,
  dice,
  rolls,
  isRolling,
  tossDirection,
  total,
  onRollSettled,
  testID,
}) => (
  <View testID={testID} style={styles.side}>
    <Text style={[styles.label, { color }]}>{label}</Text>
    <View style={styles.dice}>
      {dice.length > 0 ? (
        dice.map((die, index) => (
          <CombatDie
            key={die.id}
            die={die}
            size={SIDE_DIE_SIZE}
            shownFace={rolls[die.id]}
            isRolling={isRolling}
            tossDirection={tossDirection}
            rollIndex={index}
            resultValue={rolls[die.id]}
            disabled
            showFaces={false}
            onRollSettled={onRollSettled}
          />
        ))
      ) : (
        <Text style={styles.empty}>{translate('combat.noDice')}</Text>
      )}
    </View>
    <Text style={[styles.total, { color }]}>{total ?? ' '}</Text>
  </View>
);

export default DiceSide;
