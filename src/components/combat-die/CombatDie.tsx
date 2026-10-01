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
import { Colors } from '@styles';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { resetRoll, startRoll } from './CombatDie.animations';
import {
  FACE_STRIP_MAX_WIDTH,
  FLICKER_MS,
  LONG_PRESS_MS,
} from './CombatDie.constants';
import { styles } from './CombatDie.styles';
import type { ICombatDieView } from './CombatDie.types';
import CombatDieShape from './CombatDieShape';

const PALETTE = {
  attack: {
    fill: '#3A1018',
    stroke: Colors.warningRed,
    face: '#FFC4C4',
  },
  defense: {
    fill: '#082028',
    stroke: Colors.neonCyan,
    face: '#C9FBFF',
  },
};

const CombatDie: React.FC<ICombatDieView> = ({
  die,
  size,
  shownFace,
  isRolling = false,
  rollIndex = 0,
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
  const squash = useSharedValue(0);
  const lift = useSharedValue(1);
  const didDrag = useSharedValue(false);
  const settledRef = useRef(onRollSettled);

  useEffect(() => {
    settledRef.current = onRollSettled;
  }, [onRollSettled]);

  useEffect(() => {
    const values = { spin, hop, scale, squash };

    if (!isRolling || resultValue == null) {
      resetRoll(values);
      return;
    }

    const duration = rollDurationMs(die);
    const delay = rollDelayMs(rollIndex);
    const flickerEvery = FLICKER_MS[die.sides];

    startRoll(values, {
      delay,
      duration,
      turns: rollTurnCount(die),
      direction: die.kind === 'attack' ? 1 : -1,
      size,
    });

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
  }, [die, hop, isRolling, resultValue, rollIndex, scale, size, spin, squash]);

  const canDrag = Boolean(onDragEnd) && !disabled && !isRolling;
  const face = isRolling
    ? formatFace(rollingFace)
    : shownFace != null
      ? formatFace(shownFace)
      : `d${die.sides}`;

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

  const animatedStyle = useAnimatedStyle(() => {
    const base = scale.value * lift.value;
    return {
      transform: [
        { translateY: hop.value },
        { scaleX: base * (1 + squash.value) },
        { scaleY: base * (1 - squash.value) },
        { rotateZ: `${spin.value}deg` },
      ],
    };
  });

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
                ]}
              >
                {face}
              </Text>
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
