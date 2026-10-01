import { Pressable, Text, View } from 'react-native';

import { CombatantCard } from '@components/combatant-card';
import { translate } from '@helper/translate';
import type { RootState } from '@redux/store';
import { Colors } from '@styles';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { PLAYER_MAX_HEALTH } from '../Combat.constants';

import { useRunning } from './Running.hooks';
import { styles } from './Running.styles';
import type { IRunning } from './Running.types';
import { DiceSide } from './dice-side';
import { InitiativeToast } from './initiative-toast';

const Running = (props: IRunning) => {
  const { enemy, health, hits } = props;
  const {
    initiative,
    phase,
    exchange,
    rolls,
    playerAttacks,
    playerDice,
    enemySideDice,
    result,
    markSettled,
    advance,
  } = useRunning(props);
  const charName = useSelector((state: RootState) => state.saves.save.charName);
  const numOfDices = useSelector((state: RootState) => state.saves.numOfDices);

  const enemyName = translate(enemy.name);
  const isRolling = phase === 'rolling';
  const showResult = phase === 'result';
  const attackLabel = translate('combat.attackShort');
  const defenseLabel = translate('combat.defenseShort');
  const tapHint =
    phase === 'initiative'
      ? translate('combat.tapToRoll')
      : showResult
        ? translate('combat.tapToContinue')
        : '';

  return (
    <SafeAreaView testID="CombatRunning" style={styles.screen}>
      <Pressable
        testID="CombatRunning-tap"
        disabled={isRolling}
        onPress={advance}
        style={styles.tapArea}
      >
        <CombatantCard
          side="enemy"
          name={enemyName}
          portrait={enemy.portrait}
          health={health.enemy}
          maxHealth={enemy.health}
          diceCount={enemy.numOfDices}
          hit={hits.enemy}
        />

        <View style={styles.pillRow}>
          {phase !== 'initiative' ? (
            <Text
              testID="CombatRunning-turn"
              style={[
                styles.pill,
                playerAttacks ? styles.pillAttack : styles.pillDefend,
              ]}
            >
              {translate(
                playerAttacks ? 'combat.youAttack' : 'combat.youDefend',
              )}
            </Text>
          ) : null}
        </View>

        <View style={styles.stage}>
          {phase === 'initiative' ? (
            <InitiativeToast initiative={initiative} enemyName={enemyName} />
          ) : (
            <Animated.View
              key={`exchange-${exchange}`}
              entering={FadeIn.duration(240)}
              style={styles.exchange}
            >
              <DiceSide
                testID="CombatRunning-enemyDice"
                label={translate(
                  playerAttacks ? 'combat.enemyDefense' : 'combat.enemyAttack',
                )}
                color={playerAttacks ? Colors.neonCyan : Colors.warningRed}
                dice={enemySideDice}
                rolls={rolls}
                isRolling={isRolling}
                total={
                  showResult
                    ? playerAttacks
                      ? `${defenseLabel} ${result.defense}`
                      : `${attackLabel} ${result.attack}`
                    : undefined
                }
                onRollSettled={markSettled}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerLabel}>
                  {translate('combat.versus')}
                </Text>
                <View style={styles.dividerLine} />
              </View>

              <DiceSide
                testID="CombatRunning-playerDice"
                label={translate(
                  playerAttacks ? 'combat.yourAttack' : 'combat.yourDefense',
                )}
                color={playerAttacks ? Colors.warningRed : Colors.neonCyan}
                dice={playerDice}
                rolls={rolls}
                isRolling={isRolling}
                total={
                  showResult
                    ? playerAttacks
                      ? `${attackLabel} ${result.attack}`
                      : `${defenseLabel} ${result.defense}`
                    : undefined
                }
                onRollSettled={markSettled}
              />

              <View style={styles.damageRow}>
                {showResult ? (
                  <Animated.Text
                    testID="CombatRunning-damage"
                    entering={FadeIn.duration(200)}
                    style={[
                      styles.damage,
                      !playerAttacks && styles.damageTaken,
                    ]}
                  >
                    {translate('combat.damageLine', {
                      attack: result.attack,
                      defense: result.defense,
                      damage: result.damage,
                    })}
                  </Animated.Text>
                ) : null}
              </View>
            </Animated.View>
          )}
        </View>

        <Text testID="CombatRunning-tapHint" style={styles.tapHint}>
          {tapHint}
        </Text>

        <CombatantCard
          side="player"
          name={charName || translate('characters.you')}
          health={health.player}
          maxHealth={PLAYER_MAX_HEALTH}
          diceCount={numOfDices}
          hit={hits.player}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default Running;
