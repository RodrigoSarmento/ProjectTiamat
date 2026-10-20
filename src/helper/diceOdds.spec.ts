import { diceOdds, diceValue, expectedBlock, expectedDamage } from './diceOdds';

describe('diceOdds', () => {
  it('always hits a die without blank faces', () => {
    expect(diceOdds([1, 1, 1, 1])).toEqual({
      hitChance: 1,
      average: 1,
      valueChances: [{ value: 1, chance: 1 }],
    });
  });

  it('gives the chance of hitting and of every value', () => {
    expect(diceOdds([0, 1, 1, 2])).toEqual({
      hitChance: 0.75,
      average: 1,
      valueChances: [
        { value: 0, chance: 0.25 },
        { value: 1, chance: 0.5 },
        { value: 2, chance: 0.25 },
      ],
    });
  });

  it('sorts values even when faces are out of order', () => {
    expect(
      diceOdds([5, 0, 0, 4]).valueChances.map(({ value }) => value),
    ).toEqual([0, 4, 5]);
  });
});

describe('expectedDamage', () => {
  it('averages the damage left after defense, never below zero', () => {
    expect(expectedDamage([2, 2], [1, 3])).toBe(0.5);
  });

  it('rewards a risky attack against steady defense', () => {
    expect(expectedDamage([0, 0, 0, 4], [1, 1, 1, 1])).toBeGreaterThan(
      expectedDamage([1, 1, 1, 1], [1, 1, 1, 1]),
    );
  });
});

describe('expectedBlock', () => {
  it('is the attack average minus the damage that gets through', () => {
    expect(expectedBlock([1, 3], [2, 2])).toBe(1.5);
  });
});

describe('diceValue', () => {
  it('values attack by damage against no defense and the reference defense', () => {
    expect(diceValue('attack', [1, 1, 1, 1])).toBe(0.625);
  });

  it('values a riskier attack above a steady one with the same average', () => {
    expect(diceValue('attack', [0, 0, 0, 4])).toBeGreaterThan(
      diceValue('attack', [1, 1, 1, 1]),
    );
  });

  it('values defense by damage blocked from the reference attack', () => {
    expect(diceValue('defense', [1, 1, 1, 1])).toBe(0.75);
  });

  it('values counter by its average face', () => {
    expect(diceValue('counter', [0, 0, 0, 3])).toBe(0.75);
  });
});
