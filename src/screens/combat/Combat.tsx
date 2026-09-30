import { useRef, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import {
  CombatDie,
  FIELD_DIE_SIZE,
  FLOAT_DIE_SIZE,
  TRAY_DIE_SIZE,
} from '@components/combat-die';
import {
  type ICombatDie,
  type IWindowRect,
  containsPoint,
  formatFace,
  hitSlotIndex,
} from '@helper/combatDice';
import { storyText } from '@helper/storyText';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCombatPoc } from './Combat.hooks';
import { styles } from './Combat.styles';

const measureView = (node: View | null, store: (rect: IWindowRect) => void) => {
  node?.measureInWindow((x, y, width, height) => {
    store({ x, y, width, height });
  });
};

const Combat = () => {
  const navigation = useNavigation<StackNavigationProp<GameStackParamsList>>();
  const {
    trayRows,
    fieldDice,
    phase,
    rolls,
    rollGeneration,
    canDrag,
    canRun,
    summary,
    placeDie,
    returnDie,
    runAction,
    markSettled,
    resetRound,
  } = useCombatPoc();

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const [draggingDie, setDraggingDie] = useState<ICombatDie | undefined>();
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [hoverTray, setHoverTray] = useState(false);

  const trayRef = useRef<View>(null);
  const slotRefs = [useRef<View>(null), useRef<View>(null), useRef<View>(null)];
  const trayRect = useRef<IWindowRect | null>(null);
  const slotRects = useRef<Array<IWindowRect | null>>([null, null, null]);

  const measureDropTargets = () => {
    measureView(trayRef.current, (rect) => {
      trayRect.current = rect;
    });
    slotRefs.forEach((ref, index) => {
      measureView(ref.current, (rect) => {
        slotRects.current[index] = rect;
      });
    });
  };

  const moveDrag = (x: number, y: number) => {
    'worklet';
    dragX.value = x;
    dragY.value = y;
  };

  const handleDragStart = (die: ICombatDie) => {
    measureDropTargets();
    setDraggingDie(die);
  };

  const handleDragUpdate = (x: number, y: number) => {
    const slot = hitSlotIndex(slotRects.current, x, y);
    setHoverSlot(slot >= 0 ? slot : null);
    setHoverTray(slot < 0 && containsPoint(trayRect.current, x, y));
  };

  const handleDragEnd = (die: ICombatDie, x: number, y: number) => {
    const slot = hitSlotIndex(slotRects.current, x, y);
    if (slot >= 0) {
      placeDie(die.id, slot);
    } else if (containsPoint(trayRect.current, x, y)) {
      returnDie(die.id);
    }
    setDraggingDie(undefined);
    setHoverSlot(null);
    setHoverTray(false);
  };

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragX.value - FLOAT_DIE_SIZE / 2 },
      { translateY: dragY.value - FLOAT_DIE_SIZE / 2 },
    ],
  }));

  const isRolling = phase === 'rolling';
  const showResult = phase === 'result';
  const actionLabel = showResult
    ? storyText('combat.newRound')
    : storyText('combat.runAction');

  return (
    <SafeAreaView testID="Combat" style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable
            testID="Combat-back"
            onPress={() => navigation.goBack()}
            style={styles.back}
          >
            <Text style={styles.backLabel}>{storyText('combat.back')}</Text>
          </Pressable>
          <Text style={styles.title}>{storyText('combat.title')}</Text>
          <View style={styles.back} />
        </View>
        <Text style={styles.hint}>
          {storyText(canRun ? 'combat.fieldHint' : 'combat.trayHint')}
        </Text>
      </View>

      <View
        ref={trayRef}
        collapsable={false}
        onLayout={measureDropTargets}
        style={[styles.tray, hoverTray && styles.trayHot]}
      >
        <ScrollView
          horizontal
          scrollEnabled={!draggingDie}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trayContent}
        >
          {trayRows.map((row, rowIndex) => (
            <View key={`tray-row-${rowIndex}`} style={styles.trayRow}>
              {row.map((die) => (
                <CombatDie
                  key={die.id}
                  die={die}
                  size={TRAY_DIE_SIZE}
                  isGhost={draggingDie?.id === die.id}
                  disabled={!canDrag}
                  onDragMove={moveDrag}
                  onDragStart={() => handleDragStart(die)}
                  onDragUpdate={(point) => handleDragUpdate(point.x, point.y)}
                  onDragEnd={(point) => handleDragEnd(die, point.x, point.y)}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.result}>
        {showResult ? (
          <>
            <View style={styles.resultFaces}>
              {fieldDice.map((die) =>
                die ? (
                  <Text
                    key={`${die.id}-result`}
                    style={[
                      styles.resultFace,
                      rolls[die.id] === 0 && styles.resultMiss,
                    ]}
                  >
                    {rolls[die.id] === 0
                      ? storyText('combat.miss')
                      : formatFace(rolls[die.id])}
                  </Text>
                ) : null,
              )}
            </View>
            <Text style={styles.resultLine}>
              {storyText('combat.attack')}: {summary.attack}
              {'   '}
              {storyText('combat.defense')}: {summary.defense}
            </Text>
            <Text style={[styles.resultLine, styles.resultAccent]}>
              {storyText('combat.total')}: {summary.total}
              {'  ·  '}
              {storyText('combat.hits', { count: summary.hits })}
              {'  ·  '}
              {storyText('combat.misses', { count: summary.misses })}
            </Text>
          </>
        ) : (
          <></>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.hint}>
          {canRun ? storyText('combat.ready') : storyText('combat.needThree')}
        </Text>
        <View style={styles.slots}>
          {fieldDice.map((die, index) => (
            <View
              key={`slot-${index}`}
              ref={slotRefs[index]}
              collapsable={false}
              testID={`Combat-slot-${index}`}
              onLayout={measureDropTargets}
              style={[
                styles.slot,
                die && styles.slotFilled,
                hoverSlot === index && styles.slotHot,
              ]}
            >
              <Text style={styles.slotIndex}>{index + 1}</Text>
              {die ? (
                <CombatDie
                  die={die}
                  size={FIELD_DIE_SIZE}
                  shownFace={rolls[die.id] != null ? rolls[die.id] : undefined}
                  isGhost={draggingDie?.id === die.id}
                  isRolling={isRolling}
                  rollIndex={index}
                  rollGeneration={rollGeneration}
                  resultValue={rolls[die.id]}
                  disabled={!canDrag}
                  showFaces={!isRolling}
                  onDragMove={moveDrag}
                  onDragStart={() => handleDragStart(die)}
                  onDragUpdate={(point) => handleDragUpdate(point.x, point.y)}
                  onDragEnd={(point) => handleDragEnd(die, point.x, point.y)}
                  onRollSettled={markSettled}
                />
              ) : null}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          testID="Combat-run"
          disabled={!canRun && !showResult}
          onPress={showResult ? resetRound : runAction}
          style={[styles.run, !canRun && !showResult && styles.runDisabled]}
        >
          <Text style={styles.runLabel}>{actionLabel}</Text>
        </Pressable>
      </View>

      {draggingDie ? (
        <View pointerEvents="none" style={styles.floatingLayer}>
          <Animated.View style={[styles.floatingDie, floatingStyle]}>
            <CombatDie
              die={draggingDie}
              size={FLOAT_DIE_SIZE}
              disabled
              showFaces={false}
            />
          </Animated.View>
        </View>
      ) : null}
    </SafeAreaView>
  );
};

export default Combat;
