import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Animated, Pressable, View } from 'react-native';

import { storyText } from '@helper/storyText';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';

import { styles } from './DiceRollD20.styles';
import type { DiceRollD20Props, DiceRollD20Ref } from './DiceRollD20.types';
import { buildDiceHtml } from './diceSceneHtml';

type DiceMessage =
  | { type: 'ready' }
  | { type: 'rolling'; result: number }
  | { type: 'settled'; result: number };

const DiceWebView = WebView as unknown as React.ComponentType<
  React.ComponentProps<typeof WebView> & {
    ref?: React.Ref<WebView>;
  }
>;

/**
 * 3D D20 powered by Three.js (via WebView).
 * Dice engine adapted from react-3d-dice (MIT):
 * https://github.com/ChefJulio/react-3d-dice
 */
const DiceRollD20 = forwardRef<DiceRollD20Ref, DiceRollD20Props>(
  ({ size = 220, color = '#C24122', isSuccess, onComplete }, ref) => {
    const webRef = useRef<WebView>(null);
    const dismissedRef = useRef(false);
    const queuedRollRef = useRef(false);
    const outcomeScale = useRef(new Animated.Value(0)).current;
    const [isRolling, setIsRolling] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [lastResult, setLastResult] = useState<number | null>(null);

    const html = useMemo(() => buildDiceHtml({ color }), [color]);

    const roll = useCallback(() => {
      if (isRolling || !isReady || lastResult != null) {
        return;
      }
      const result = Math.floor(Math.random() * 20) + 1;
      setIsRolling(true);
      webRef.current?.injectJavaScript?.(`window.startRoll(${result}); true;`);
    }, [isReady, isRolling, lastResult]);

    useImperativeHandle(ref, () => ({ roll }), [roll]);

    useEffect(() => {
      if (!isReady || !queuedRollRef.current) {
        return;
      }
      queuedRollRef.current = false;
      roll();
    }, [isReady, roll]);

    useEffect(() => {
      if (lastResult == null) {
        outcomeScale.setValue(0);
        return;
      }
      outcomeScale.setValue(0.35);
      Animated.spring(outcomeScale, {
        toValue: 1,
        friction: 4,
        tension: 140,
        useNativeDriver: true,
      }).start();
    }, [lastResult, outcomeScale]);

    const handlePress = () => {
      if (isRolling || dismissedRef.current) {
        return;
      }
      if (lastResult != null) {
        dismissedRef.current = true;
        onComplete?.(lastResult);
        return;
      }
      if (!isReady) {
        queuedRollRef.current = true;
        return;
      }
      roll();
    };

    const onMessage = useCallback((event: WebViewMessageEvent) => {
      try {
        const data = JSON.parse(event.nativeEvent.data) as DiceMessage;
        if (data.type === 'ready') {
          setIsReady(true);
          return;
        }
        if (data.type === 'rolling') {
          setIsRolling(true);
          return;
        }
        if (data.type === 'settled') {
          setIsRolling(false);
          setLastResult(data.result);
        }
      } catch {
        // ignore malformed messages
      }
    }, []);

    const showOutcome = lastResult != null && isSuccess != null;
    const passed =
      lastResult != null && isSuccess != null ? isSuccess(lastResult) : false;

    return (
      <View style={styles.wrapper}>
        <View style={[styles.diceFrame, { width: size, height: size }]}>
          <DiceWebView
            ref={webRef}
            originWhitelist={['*']}
            source={{ html }}
            onMessage={onMessage}
            style={styles.webview}
            scrollEnabled={false}
            bounces={false}
            overScrollMode="never"
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            setSupportMultipleWindows={false}
            androidLayerType="hardware"
          />
        </View>
        <View style={styles.outcomeSlot} pointerEvents="none">
          {showOutcome ? (
            <Animated.Text
              style={[
                styles.outcome,
                passed ? styles.outcomeSuccess : styles.outcomeFailure,
                { transform: [{ scale: outcomeScale }] },
              ]}
            >
              {storyText(passed ? 'chrome.diceSuccess' : 'chrome.diceFailure')}
            </Animated.Text>
          ) : null}
        </View>
        <Pressable
          testID="dice-roll-d20"
          onPress={handlePress}
          style={styles.hitArea}
        />
      </View>
    );
  },
);

DiceRollD20.displayName = 'DiceRollD20';

export default DiceRollD20;
