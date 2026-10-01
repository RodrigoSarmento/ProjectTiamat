import {
  Easing,
  type SharedValue,
  cancelAnimation,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type RollValues = {
  spin: SharedValue<number>;
  hop: SharedValue<number>;
  scale: SharedValue<number>;
  squash: SharedValue<number>;
};

type RollTiming = {
  delay: number;
  duration: number;
  turns: number;
  direction: 1 | -1;
  size: number;
};

export const resetRoll = (values: RollValues) => {
  Object.values(values).forEach((value) => cancelAnimation(value));
  values.spin.value = 0;
  values.hop.value = 0;
  values.scale.value = 1;
  values.squash.value = 0;
};

const landSquash = (at: number) =>
  withDelay(
    at,
    withSequence(
      withTiming(0.2, { duration: 60 }),
      withTiming(-0.08, { duration: 90 }),
      withTiming(0.04, { duration: 80 }),
      withTiming(0, { duration: 100 }),
    ),
  );

export const startRoll = (v: RollValues, t: RollTiming) => {
  resetRoll(v);

  const up = t.duration * 0.4;
  const down = t.duration * 0.45;

  v.hop.value = withDelay(
    t.delay,
    withSequence(
      withTiming(-t.size * 1.35, {
        duration: up,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(0, { duration: down, easing: Easing.bounce }),
    ),
  );
  v.scale.value = withDelay(
    t.delay,
    withSequence(
      withTiming(0.7, { duration: up, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: down * 0.4 }),
    ),
  );
  v.spin.value = withDelay(
    t.delay,
    withTiming(t.direction * 360 * t.turns, {
      duration: up + down * 0.4,
      easing: Easing.out(Easing.quad),
    }),
  );
  v.squash.value = landSquash(t.delay + up + down * 0.38);
};
