import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { StyleSheet, Text, View } from 'react-native';

import WebView, { type WebViewMessageEvent } from 'react-native-webview';

import { buildDiceHtml } from './diceSceneHtml';

export type DiceRollD20Ref = {
  roll: () => void;
};

type DiceRollD20Props = {
  size?: number;
  color?: string;
  onComplete?: (value: number) => void;
};

type DiceMessage =
  | { type: 'ready' }
  | { type: 'rolling'; result: number }
  | { type: 'settled'; result: number };

// react-native-webview typings are incompatible with React 19 Component types
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
  ({ size = 220, color = '#C24122', onComplete }, ref) => {
    const webRef = useRef<WebView>(null);
    const [isRolling, setIsRolling] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [lastResult, setLastResult] = useState<number | null>(null);

    const html = useMemo(() => buildDiceHtml({ color }), [color]);

    const roll = useCallback(() => {
      if (isRolling || !isReady) {
        return;
      }
      const result = Math.floor(Math.random() * 20) + 1;
      setIsRolling(true);
      webRef.current?.injectJavaScript(`window.startRoll(${result}); true;`);
    }, [isReady, isRolling]);

    useImperativeHandle(ref, () => ({ roll }), [roll]);

    const onMessage = useCallback(
      (event: WebViewMessageEvent) => {
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
            onComplete?.(data.result);
          }
        } catch {
          // ignore malformed messages
        }
      },
      [onComplete],
    );

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
            accessibilityLabel="Roll a twenty-sided die"
          />
        </View>
        <Text style={styles.hint}>
          {!isReady
            ? 'Loading 3D die…'
            : isRolling
              ? 'Rolling…'
              : lastResult != null
                ? `Rolled ${lastResult} — tap to roll again`
                : 'Tap the die to roll'}
        </Text>
      </View>
    );
  },
);

DiceRollD20.displayName = 'DiceRollD20';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 12,
  },
  diceFrame: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  hint: {
    color: '#5D5F61',
    fontSize: 13,
  },
});

export default DiceRollD20;
