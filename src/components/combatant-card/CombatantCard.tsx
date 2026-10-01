import React, { useEffect, useRef } from 'react';

import { Image, Text, View } from 'react-native';

import { HealthBar } from '@components/health-bar';
import { translate } from '@helper/translate';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  DAMAGE_FLOAT_MS,
  PORTRAIT_SIZE,
  SIDE_PALETTE,
} from './CombatantCard.constants';
import { styles } from './CombatantCard.styles';
import type { ICombatantCard } from './CombatantCard.types';
import CombatantSilhouette from './CombatantSilhouette';

const CombatantCard: React.FC<ICombatantCard> = ({
  name,
  portrait,
  health,
  maxHealth,
  diceCount,
  side,
  hit,
  testID = `CombatantCard-${side}`,
}) => {
  const palette = SIDE_PALETTE[side];
  const flash = useSharedValue(0);
  const shake = useSharedValue(0);
  const float = useSharedValue(1);
  const hitKey = hit?.key;
  const lastHitKey = useRef(hitKey);

  useEffect(() => {
    if (hitKey == null || hitKey === lastHitKey.current) {
      return;
    }
    lastHitKey.current = hitKey;
    flash.value = withSequence(
      withTiming(1, { duration: 90 }),
      withTiming(0, { duration: 700 }),
    );
    shake.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(4, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
    float.value = 0;
    float.value = withTiming(1, { duration: DAMAGE_FLOAT_MS });
  }, [flash, float, hitKey, shake]);

  const cardStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      flash.value,
      [0, 1],
      [palette.border, SIDE_PALETTE.enemy.accent],
    ),
  }));

  const portraitStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const damageStyle = useAnimatedStyle(() => ({
    opacity: interpolate(float.value, [0, 0.12, 0.75, 1], [0, 1, 1, 0]),
    transform: [{ translateY: interpolate(float.value, [0, 1], [8, -18]) }],
  }));

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.card,
        side === 'player' && styles.cardPlayer,
        { backgroundColor: palette.fill },
        cardStyle,
      ]}
    >
      <Animated.View
        style={[
          styles.portrait,
          { borderColor: palette.accent },
          portraitStyle,
        ]}
      >
        {portrait ? (
          <Image source={portrait} style={styles.portraitImage} />
        ) : (
          <CombatantSilhouette
            size={PORTRAIT_SIZE * 0.8}
            color={palette.accent}
          />
        )}
      </Animated.View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <HealthBar current={health} max={maxHealth} color={palette.accent} />
        <Text style={styles.caption}>
          {translate('combat.rollsDice', { count: diceCount })}
        </Text>
      </View>
      {hit ? (
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.damage,
            side === 'enemy' ? styles.damageEnemy : styles.damagePlayer,
            damageStyle,
          ]}
        >
          -{hit.amount}
        </Animated.Text>
      ) : null}
    </Animated.View>
  );
};

export default CombatantCard;
