import { useRef, useState } from 'react';

import { Pressable, Text, View } from 'react-native';

import {
  CombatDie,
  FIELD_DIE_SIZE,
  FLOAT_DIE_SIZE,
  TRAY_DIE_SIZE,
} from '@components/combat-die';
import { CombatantCard } from '@components/combatant-card';
import {
  type ICombatDie,
  type IWindowRect,
  containsPoint,
  hitSlotIndex,
} from '@helper/combatDice';
import { translate } from '@helper/translate';
import { useBlink } from '@hooks/use-blink';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TRAY_SCROLL_THROTTLE_MS } from './Prepare.constants';
import { usePrepare } from './Prepare.hooks';
import { styles } from './Prepare.styles';
import type { IPrepare } from './Prepare.types';

const measureView = (node: View | null, store: (rect: IWindowRect) => void) => {
  node?.measureInWindow((x, y, width, height) => {
    store({ x, y, width, height });
  });
};

const Prepare = ({
  combatRef,
  enemy,
  enemyHealth,
  hand,
  deckCount,
}: IPrepare) => {
  const {
    trayRows,
    canScrollTray,
    onTrayScroll,
    onTrayLayout,
    onTrayContentSizeChange,
    fieldDice,
    chosenDice,
    numOfDices,
    isReady,
    placeDie,
    returnDie,
  } = usePrepare(hand);

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const originX = useSharedValue(0);
  const originY = useSharedValue(0);
  const [draggingDie, setDraggingDie] = useState<ICombatDie | undefined>();
  const [hoverSlot, setHoverSlot] = useState<number | null>(null);
  const [hoverTray, setHoverTray] = useState(false);

  const rootRef = useRef<View>(null);
  const trayRef = useRef<View>(null);
  const slotRefs = useRef<Array<View | null>>([]);
  const trayRect = useRef<IWindowRect | null>(null);
  const slotRects = useRef<Array<IWindowRect | null>>([]);

  const blinkStyle = useBlink();

  const measureDropTargets = () => {
    measureView(rootRef.current, (rect) => {
      originX.value = rect.x;
      originY.value = rect.y;
    });
    measureView(trayRef.current, (rect) => {
      trayRect.current = rect;
    });
    slotRefs.current.forEach((node, index) => {
      measureView(node, (rect) => {
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

  const handleReady = () => {
    combatRef.current?.selectDice(chosenDice);
    combatRef.current?.next();
  };

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragX.value - originX.value - FLOAT_DIE_SIZE / 2 },
      { translateY: dragY.value - originY.value - FLOAT_DIE_SIZE / 2 },
    ],
  }));

  return (
    <SafeAreaView testID="CombatPrepare" style={styles.screen}>
      <Text style={styles.title}>{translate('combat.prepare')}</Text>
      <View
        ref={rootRef}
        collapsable={false}
        onLayout={measureDropTargets}
        style={styles.root}
      >
        <CombatantCard
          side="enemy"
          name={translate(enemy.name)}
          portrait={enemy.portrait}
          health={enemyHealth}
          maxHealth={enemy.health}
          diceCount={enemy.numOfDices}
        />

        <View style={styles.field}>
          <Text style={styles.hint}>
            {translate(isReady ? 'combat.ready' : 'combat.needDice', {
              count: numOfDices,
            })}
          </Text>
          <View style={styles.slots}>
            {fieldDice.map((die, index) => (
              <View
                key={`slot-${index}`}
                ref={(node) => {
                  slotRefs.current[index] = node;
                }}
                collapsable={false}
                testID={`CombatPrepare-slot-${index}`}
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
                    isGhost={draggingDie?.id === die.id}
                    onDragMove={moveDrag}
                    onDragStart={() => handleDragStart(die)}
                    onDragUpdate={(point) => handleDragUpdate(point.x, point.y)}
                    onDragEnd={(point) => handleDragEnd(die, point.x, point.y)}
                  />
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.trayHeader}>
          <Text style={styles.hint}>
            {isReady
              ? translate('combat.fieldHint')
              : translate('combat.trayHint', { count: numOfDices })}
          </Text>
          <Text testID="CombatPrepare-deck" style={styles.hint}>
            {translate('combat.deck', { count: deckCount })}
          </Text>
        </View>
        <View
          ref={trayRef}
          collapsable={false}
          onLayout={measureDropTargets}
          style={[styles.tray, hoverTray && styles.trayHot]}
        >
          <ScrollView
            testID="CombatPrepare-tray"
            horizontal
            scrollEnabled={!draggingDie}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={TRAY_SCROLL_THROTTLE_MS}
            onScroll={onTrayScroll}
            onLayout={onTrayLayout}
            onContentSizeChange={onTrayContentSizeChange}
            contentContainerStyle={styles.trayContent}
          >
            {trayRows.map((row, rowIndex) => (
              <View key={`tray-row-${rowIndex}`} style={styles.trayRow}>
                <Text style={styles.kindLabel}>
                  {rowIndex === 0
                    ? translate('words.attack')
                    : translate('words.defense')}
                </Text>

                {row.map((die) => (
                  <CombatDie
                    key={die.id}
                    die={die}
                    size={TRAY_DIE_SIZE}
                    isGhost={draggingDie?.id === die.id}
                    onDragMove={moveDrag}
                    onDragStart={() => handleDragStart(die)}
                    onDragUpdate={(point) => handleDragUpdate(point.x, point.y)}
                    onDragEnd={(point) => handleDragEnd(die, point.x, point.y)}
                  />
                ))}
              </View>
            ))}
          </ScrollView>
          {canScrollTray ? (
            <Animated.View
              testID="CombatPrepare-scrollHint"
              pointerEvents="none"
              style={[styles.indicator, blinkStyle]}
            >
              <Text style={styles.indicatorLabel}>▶</Text>
            </Animated.View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            testID="CombatPrepare-ready"
            disabled={!isReady}
            onPress={handleReady}
            style={[styles.ready, !isReady && styles.readyDisabled]}
          >
            <Text style={styles.readyLabel}>
              {translate('combat.setReady')}
            </Text>
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
      </View>
    </SafeAreaView>
  );
};

export default Prepare;
