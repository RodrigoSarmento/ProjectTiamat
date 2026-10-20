import type { CombatDieKind } from '@helper/combatDice';
import { diceOdds, diceValue } from '@helper/diceOdds';

import { COMBAT_DICE } from './dices';

const ID_FORMAT =
  /^(enemy-)?(attack|defense|counter)-d(4|6|8)-level([1-3])-([abc])$/;

type Owner = 'player' | 'enemy';

const LEVELS = [1, 2, 3];
const KINDS: CombatDieKind[] = ['attack', 'defense', 'counter'];
const ROLES = ['a', 'b', 'c'];
const ATTACK_AVERAGES = [1, 1.5, 2];
const ATTACK_MAX_RISK_BONUS = 1.5;
const VALUE_TARGETS: Record<Exclude<CombatDieKind, 'attack'>, number[]> = {
  defense: [0.75, 1, 1.25],
  counter: [0.75, 1.25, 1.75],
};
const VALUE_TOLERANCE = 0.1;

const catalog = Object.entries(COMBAT_DICE).map(([id, die]) => {
  const [, enemy, , sides, level, role] = ID_FORMAT.exec(id) ?? [];

  return {
    id,
    die,
    role,
    sides: Number(sides),
    level: Number(level),
    owner: (enemy ? 'enemy' : 'player') as Owner,
    average: diceOdds(die.faces).average,
    value: diceValue(die.kind, die.faces),
    blankChance:
      die.faces.filter((face) => face === 0).length / die.faces.length,
  };
});

type Entry = (typeof catalog)[number];

const entriesOf = (
  owner: Owner,
  kind: CombatDieKind,
  level?: number,
  role?: string,
) =>
  catalog.filter(
    (entry) =>
      entry.owner === owner &&
      entry.die.kind === kind &&
      (level == null || entry.level === level) &&
      (role == null || entry.role === role),
  );

const valuesOf = (entries: Entry[]) => entries.map((entry) => entry.value);

describe('COMBAT_DICE', () => {
  it('names every die as kind, sides, level and role', () => {
    catalog.forEach(({ id, die, sides }) => {
      expect(id).toMatch(ID_FORMAT);
      expect(id).toContain(die.kind);
      expect(sides).toBe(die.sides);
      expect(die.faces).toHaveLength(die.sides);
    });
  });

  it('matches each player attack role to its chance of rolling a blank', () => {
    entriesOf('player', 'attack').forEach(({ role, blankChance }) => {
      if (role === 'a') {
        expect(blankChance).toBe(0);
      } else if (role === 'b') {
        expect(blankChance).toBeGreaterThan(0);
        expect(blankChance).toBeLessThan(0.5);
      } else {
        expect(blankChance).toBeGreaterThanOrEqual(0.75);
      }
    });
  });

  it('keeps player defense steady and counter all-in', () => {
    entriesOf('player', 'defense').forEach(({ role, blankChance }) => {
      if (role === 'a') {
        expect(blankChance).toBe(0);
      } else {
        expect(blankChance).toBeGreaterThan(0);
        expect(blankChance).toBeLessThanOrEqual(1 / 6);
      }
    });
    catalog
      .filter((entry) => entry.die.kind === 'counter')
      .forEach(({ role, blankChance }) => {
        expect(role).toBe('c');
        expect(blankChance).toBeGreaterThanOrEqual(0.75);
      });
  });

  it('gives player attack dice of a level the same average roll', () => {
    LEVELS.forEach((level, index) => {
      entriesOf('player', 'attack', level).forEach(({ average }) => {
        expect(average).toBe(ATTACK_AVERAGES[index]);
      });
    });
  });

  it('rewards riskier player attack dice with more value, within a margin', () => {
    LEVELS.forEach((level) => {
      const byRole = ROLES.map((role) =>
        valuesOf(entriesOf('player', 'attack', level, role)),
      ).filter((values) => values.length > 0);

      byRole.slice(1).forEach((values, index) => {
        expect(Math.min(...values)).toBeGreaterThan(Math.max(...byRole[index]));
      });
      expect(Math.max(...byRole[byRole.length - 1])).toBeLessThanOrEqual(
        Math.min(...byRole[0]) * ATTACK_MAX_RISK_BONUS,
      );
    });
  });

  it('gives player defense and counter dice the value target of their level', () => {
    (['defense', 'counter'] as const).forEach((kind) => {
      LEVELS.forEach((level, index) => {
        valuesOf(entriesOf('player', kind, level)).forEach((value) => {
          expect(
            Math.abs(value - VALUE_TARGETS[kind][index]),
          ).toBeLessThanOrEqual(VALUE_TOLERANCE);
        });
      });
    });
  });

  it('has fewer attack dice at higher levels and less defense than attack', () => {
    const countAt = (kind: CombatDieKind, level: number) =>
      entriesOf('player', kind, level).length;

    LEVELS.slice(1).forEach((level) => {
      expect(countAt('attack', level)).toBeLessThan(
        countAt('attack', level - 1),
      );
    });
    LEVELS.forEach((level) => {
      expect(countAt('defense', level)).toBeLessThan(countAt('attack', level));
    });
  });

  it('never repeats the same faces within a kind', () => {
    const shapes = catalog.map(
      ({ die }) => `${die.kind}:${[...die.faces].sort().join(',')}`,
    );

    expect(new Set(shapes).size).toBe(shapes.length);
  });

  it('keeps every enemy die below the player dice of the same level and role', () => {
    KINDS.forEach((kind) => {
      entriesOf('enemy', kind).forEach(({ level, role, value, average }) => {
        const players = entriesOf('player', kind, level, role);

        expect(players.length).toBeGreaterThan(0);
        expect(value).toBeLessThan(Math.min(...valuesOf(players)));
        expect(average).toBeLessThan(
          Math.min(...players.map((player) => player.average)),
        );
      });
    });
  });
});
