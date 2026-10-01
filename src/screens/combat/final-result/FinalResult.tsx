import { Image, ImageBackground, Pressable, Text, View } from 'react-native';

import { translate } from '@helper/translate';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PLAYER_MAX_HEALTH } from '../Combat.constants';

import {
  ACTIONS_DELAY_MS,
  BACKGROUND_BLUR,
  OUTCOME_COLOR,
  OUTCOME_TINT,
  PANEL_DELAY_MS,
} from './FinalResult.constants';
import { useBlink } from './FinalResult.hooks';
import { styles } from './FinalResult.styles';
import type { IFinalResult } from './FinalResult.types';

const FinalResult = ({
  combatRef,
  outcome,
  enemy,
  health,
  narrative,
  background,
}: IFinalResult) => {
  const blinkStyle = useBlink();
  const color = OUTCOME_COLOR[outcome];
  const isVictory = outcome === 'victory';

  return (
    <ImageBackground
      testID="CombatFinalResult"
      source={background}
      blurRadius={BACKGROUND_BLUR}
      resizeMode="cover"
      style={styles.background}
    >
      <View
        pointerEvents="none"
        style={[styles.tint, { backgroundColor: OUTCOME_TINT[outcome] }]}
      />
      <SafeAreaView style={styles.screen}>
        <Animated.View
          testID="CombatFinalResult-enemy"
          entering={FadeIn}
          style={[styles.portrait, { borderColor: color }]}
        >
          <Image source={enemy.portrait} style={styles.portraitImage} />
        </Animated.View>
        <Animated.View entering={FadeIn} style={styles.header}>
          <Text
            testID="CombatFinalResult-badge"
            style={[styles.badge, { color, borderColor: color }]}
          >
            {translate(isVictory ? 'combat.victory' : 'combat.defeat')}
          </Text>
          <Text style={styles.health}>
            {translate('combat.healthShort', {
              health: health.player,
              max: PLAYER_MAX_HEALTH,
            })}
          </Text>
        </Animated.View>

        <View style={styles.body}>
          {narrative.length > 1 ? (
            <Animated.View
              testID="CombatFinalResult-narrative"
              entering={FadeInDown.delay(PANEL_DELAY_MS)}
              style={styles.panel}
            >
              {narrative.map((line, index) => (
                <Text key={`${index}-${line}`} style={styles.narrative}>
                  {translate(line)}
                </Text>
              ))}
              <Animated.View style={[styles.indicator, blinkStyle]}>
                <Text style={styles.indicatorLabel}>▼</Text>
              </Animated.View>
            </Animated.View>
          ) : null}
        </View>

        <Animated.View
          entering={FadeIn.delay(ACTIONS_DELAY_MS)}
          style={styles.actions}
        >
          {isVictory ? null : (
            <Pressable
              testID="CombatFinalResult-retry"
              onPress={() => combatRef.current?.restart()}
              style={[styles.action, styles.retry]}
            >
              <Text style={styles.retryLabel}>{translate('combat.retry')}</Text>
            </Pressable>
          )}
          <Pressable
            testID="CombatFinalResult-continue"
            onPress={() => combatRef.current?.finish()}
            style={[styles.action, styles.continue]}
          >
            <Text style={styles.continueLabel}>
              {translate('combat.continue')}
            </Text>
          </Pressable>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default FinalResult;
