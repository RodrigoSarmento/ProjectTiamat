import { useImperativeHandle, useRef, useState } from 'react';

import { View } from 'react-native';

import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { STORY_BACKGROUND_IMAGES, getEnemy } from '@data/story';
import { type ICombatDie, discardUsedDice, handSize } from '@helper/combatDice';
import type { RootState } from '@redux/store';
import { useSelector } from 'react-redux';

import {
  COMBAT_STEPS,
  DEFAULT_RESULT_BACKGROUND,
  PLAYER_MAX_HEALTH,
} from './Combat.constants';
import { styles } from './Combat.styles';
import type {
  CombatHealth,
  CombatHits,
  CombatOutcome,
  CombatStep,
  ICombatRef,
} from './Combat.types';
import { FinalResult } from './final-result';
import { Prepare } from './prepare';
import { Running } from './running';

const Combat = () => {
  const { params } = useRoute<RouteProp<GameStackParamsList, 'Combat'>>();
  const navigation = useNavigation<StackNavigationProp<GameStackParamsList>>();
  const enemy = getEnemy(params.enemyId);
  const deckIds = useSelector((state: RootState) => state.saves.dices);
  const numOfDices = useSelector((state: RootState) => state.saves.numOfDices);

  const combatRef = useRef<ICombatRef>(null);
  const [step, setStep] = useState<CombatStep>('prepare');
  const [selectedDice, setSelectedDice] = useState<ICombatDie[]>([]);
  const [deadIds, setDeadIds] = useState<string[]>([]);
  const [health, setHealth] = useState<CombatHealth>({
    player: PLAYER_MAX_HEALTH,
    enemy: enemy.health,
  });
  const [hits, setHits] = useState<CombatHits>({});
  const outcome: CombatOutcome = health.enemy <= 0 ? 'victory' : 'defeat';

  useImperativeHandle(
    combatRef,
    () => ({
      next: () =>
        setStep(
          (current) =>
            COMBAT_STEPS[
              (COMBAT_STEPS.indexOf(current) + 1) % COMBAT_STEPS.length
            ],
        ),
      goTo: setStep,
      selectDice: (dice) => {
        setSelectedDice(dice);
        setDeadIds((current) =>
          discardUsedDice(
            deckIds,
            current,
            dice.map((die) => die.id),
            handSize(deckIds.length, numOfDices),
          ),
        );
      },
      applyDamage: (target, amount) => {
        setHealth((current) => ({
          ...current,
          [target]: Math.max(0, current[target] - amount),
        }));
        setHits((current) => ({
          ...current,
          [target]: { amount, key: (current[target]?.key ?? 0) + 1 },
        }));
      },
      restart: () => {
        setHealth({ player: PLAYER_MAX_HEALTH, enemy: enemy.health });
        setHits({});
        setDeadIds([]);
        setSelectedDice([]);
        setStep('prepare');
      },
      finish: () => navigation.goBack(),
    }),
    [deckIds, enemy.health, navigation, numOfDices],
  );

  return (
    <View testID="Combat" style={styles.screen}>
      {step === 'prepare' ? (
        <Prepare
          combatRef={combatRef}
          enemy={enemy}
          enemyHealth={health.enemy}
          deadIds={deadIds}
        />
      ) : null}
      {step === 'running' ? (
        <Running
          combatRef={combatRef}
          dice={selectedDice}
          enemy={enemy}
          health={health}
          hits={hits}
        />
      ) : null}
      {step === 'finalResult' ? (
        <FinalResult
          combatRef={combatRef}
          outcome={outcome}
          enemy={enemy}
          health={health}
          narrative={
            (outcome === 'victory' ? params.victoryText : params.defeatText) ??
            []
          }
          background={
            STORY_BACKGROUND_IMAGES[
              params.background ?? DEFAULT_RESULT_BACKGROUND
            ]
          }
        />
      ) : null}
    </View>
  );
};

export default Combat;
