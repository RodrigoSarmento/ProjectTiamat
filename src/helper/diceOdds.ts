import type { CombatDieKind } from './combatDice';

export interface IFaceChance {
  value: number;
  chance: number;
}

export interface IDiceOdds {
  hitChance: number;
  average: number;
  valueChances: IFaceChance[];
}

export const BALANCE_DEFENSES = [[0], [0, 1, 1, 1]];

export const BALANCE_ATTACK_FACES = [0, 1, 2, 3];

const averageOf = <T>(items: T[], value: (item: T) => number) =>
  items.reduce((total, item) => total + value(item), 0) / items.length;

export const diceOdds = (faces: number[]): IDiceOdds => {
  const counts = new Map<number, number>();
  faces.forEach((face) => counts.set(face, (counts.get(face) ?? 0) + 1));

  return {
    hitChance: faces.filter((face) => face > 0).length / faces.length,
    average: averageOf(faces, (face) => face),
    valueChances: [...counts.keys()]
      .sort((a, b) => a - b)
      .map((value) => ({
        value,
        chance: (counts.get(value) ?? 0) / faces.length,
      })),
  };
};

export const expectedDamage = (attackFaces: number[], defenseFaces: number[]) =>
  averageOf(attackFaces, (attack) =>
    averageOf(defenseFaces, (defense) => Math.max(0, attack - defense)),
  );

export const expectedBlock = (defenseFaces: number[], attackFaces: number[]) =>
  averageOf(attackFaces, (attack) => attack) -
  expectedDamage(attackFaces, defenseFaces);

export const diceValue = (kind: CombatDieKind, faces: number[]) => {
  if (kind === 'attack') {
    return averageOf(BALANCE_DEFENSES, (defense) =>
      expectedDamage(faces, defense),
    );
  }
  const block = expectedBlock(faces, BALANCE_ATTACK_FACES);
  return kind === 'counter'
    ? block + expectedDamage(faces, BALANCE_ATTACK_FACES)
    : block;
};
