import React, { useEffect, useRef, useState } from 'react';

import { Text, View } from 'react-native';

import {
  formatFace,
  formatFaceMark,
  restFace,
  rollDelayMs,
  rollDurationMs,
  rollTurnCount,
} from '@helper/combatDice';
import { storyText } from '@helper/storyText';
import { Colors } from '@styles';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { FACE_STRIP_MAX_WIDTH, LONG_PRESS_MS } from './CombatDie.constants';
import { styles } from './CombatDie.styles';
import type { ICombatDieView } from './CombatDie.types';
import CombatDieShape from './CombatDieShape';

const PALETTE = {
  attack: {
    fill: '#3A1018',
    stroke: Colors.warningRed,
    face: '#FFC4C4',
    label: Colors.redSalmon,
  },
  defense: {
    fill: '#082028',
    stroke: Colors.neonCyan,
    face: '#C9FBFF',
    label: Colors.neonCyan,
  },
};

const CombatDie: React.FC<ICombatDieView> = ({
  die,
  size,
  shownFace,
  isRolling = false,
  rollIndex = 0,
  rollGeneration = 0,
  resultValue,
  isGhost = false,
  disabled = false,
  showFaces = true,
  onDragMove,
  onDragStart,
  onDragUpdate,
  onDragEnd,
  onRollSettled,
  testID = `CombatDie-${die.id}`,
}) => {
  const palette = PALETTE[die.kind];
  const [rollingFace, setRollingFace] = useState(restFace(die));
  const spin = useSharedValue(0);
  const hop = useSharedValue(0);
  const scale = useSharedValue(1);
  const lift = useSharedValue(1);
  const didDrag = useSharedValue(false);
  const settledRef = useRef(onRollSettled);

  useEffect(() => {
    settledRef.current = onRollSettled;
  }, [onRollSettled]);

  useEffect(() => {
    if (!isRolling || resultValue == null) {
      spin.value = 0;
      hop.value = 0;
      scale.value = 1;
      return;
    }

    const duration = rollDurationMs(die);
    const delay = rollDelayMs(rollIndex);
    const turns = rollTurnCount(die);
    const direction = die.kind === 'attack' ? 1 : -1;

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(0.82, { duration: 90 }),
        withTiming(1.12, {
          duration: duration * 0.28,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }),
      ),
    );

    hop.value = withDelay(
      delay,
      withSequence(
        withTiming(-12, { duration: 140 }),
        withTiming(7, { duration: duration * 0.35 }),
        withTiming(-4, { duration: 160 }),
        withTiming(0, { duration: 180 }),
      ),
    );

    spin.value = 0;
    spin.value = withDelay(
      delay,
      withTiming(direction * (360 * turns + 14), {
        duration,
        easing: Easing.bezier(0.12, 0.68, 0.18, 1),
      }),
    );

    const flickerEvery = die.sides === 4 ? 46 : die.sides === 6 ? 56 : 64;
    let flicker: ReturnType<typeof setInterval> | undefined;
    const startAt = Date.now() + delay;

    const begin = setTimeout(() => {
      flicker = setInterval(() => {
        const elapsed = Date.now() - startAt;
        if (elapsed > duration - 220) {
          setRollingFace(resultValue);
          return;
        }
        const next =
          die.faces[Math.floor(Math.random() * die.faces.length)] ?? 0;
        setRollingFace(next);
      }, flickerEvery);
    }, delay);

    const done = setTimeout(() => {
      if (flicker) {
        clearInterval(flicker);
      }
      setRollingFace(resultValue);
      settledRef.current?.();
    }, delay + duration);

    return () => {
      clearTimeout(begin);
      clearTimeout(done);
      if (flicker) {
        clearInterval(flicker);
      }
    };
  }, [
    die,
    hop,
    isRolling,
    resultValue,
    rollGeneration,
    rollIndex,
    scale,
    spin,
  ]);

  const canDrag = Boolean(onDragEnd) && !disabled && !isRolling;
  const face = isRolling ? rollingFace : (shownFace ?? restFace(die));

  const gesture = usePanGesture({
    activateAfterLongPress: LONG_PRESS_MS,
    enabled: canDrag,
    onActivate: (event) => {
      didDrag.value = true;
      lift.value = withTiming(1.08, { duration: 80 });
      if (onDragMove) {
        onDragMove(event.absoluteX, event.absoluteY);
      }
      if (onDragStart) {
        scheduleOnRN(onDragStart, { x: event.absoluteX, y: event.absoluteY });
      }
    },
    onUpdate: (event) => {
      if (onDragMove) {
        onDragMove(event.absoluteX, event.absoluteY);
      }
      if (onDragUpdate) {
        scheduleOnRN(onDragUpdate, { x: event.absoluteX, y: event.absoluteY });
      }
    },
    onFinalize: (event) => {
      lift.value = withTiming(1, { duration: 120 });
      if (didDrag.value && onDragEnd) {
        scheduleOnRN(onDragEnd, { x: event.absoluteX, y: event.absoluteY });
      }
      didDrag.value = false;
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: hop.value },
      { scale: scale.value * lift.value },
      { rotateZ: `${spin.value}deg` },
    ],
  }));

  const kindLabel =
    die.kind === 'attack'
      ? storyText('combat.attackShort')
      : storyText('combat.defenseShort');

  return (
    <View style={styles.wrap}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          testID={testID}
          style={[styles.hit, { width: size, height: size }]}
        >
          <Animated.View
            style={[
              styles.body,
              { width: size, height: size },
              animatedStyle,
              isGhost && styles.ghost,
            ]}
          >
            <CombatDieShape
              sides={die.sides}
              size={size}
              fill={palette.fill}
              stroke={palette.stroke}
            />
            <View pointerEvents="none" style={styles.faceLayer}>
              <Text
                style={[
                  styles.face,
                  {
                    color: palette.face,
                    fontSize: size * 0.32,
                  },
                  die.sides === 4 && styles.faceD4,
                  face === 0 && styles.missFace,
                ]}
              >
                {formatFace(face)}
              </Text>
              {!isRolling && (
                <>
                  <View style={styles.badge}>
                    <Text style={styles.badgeLabel}>d{die.sides}</Text>
                  </View>
                  <Text
                    style={[
                      styles.kind,
                      size > 100 && styles.kindLarge,
                      {
                        color: palette.label,
                        fontSize: Math.max(8, size * 0.11),
                      },
                    ]}
                  >
                    {kindLabel}
                  </Text>
                </>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </GestureDetector>
      {showFaces ? (
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[
            styles.strip,
            { maxWidth: Math.max(size, FACE_STRIP_MAX_WIDTH) },
          ]}
        >
          [ {die.faces.map(formatFaceMark).join(' ')} ]
        </Text>
      ) : null}
    </View>
  );
};

export default CombatDie;
