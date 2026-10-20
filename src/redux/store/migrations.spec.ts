import { PLAYER_MAX_SLOTS } from '@data/combat';
import { STARTER_DICES, STARTER_NUM_OF_DICES } from '@redux/slices/SavesSlice';
import type { PersistedState } from 'redux-persist';

import { PERSIST_VERSION, migrations } from './migrations';

const PERSIST = { _persist: { version: -1, rehydrated: false } };

const persistedWith = (themeOrBackground?: object) =>
  ({
    ...PERSIST,
    saves: {
      hasStarted: true,
      save: { charName: 'Rin', themeOrBackground },
    },
  }) as unknown as PersistedState;

describe('persist migrations', () => {
  it('ships every migration up to the current persist version', () => {
    expect(PERSIST_VERSION).toBe(5);
    expect(
      Object.keys(migrations)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  describe('version 1', () => {
    it('moves a saved theme into themeSound', () => {
      const theme = { soundType: 'theme', soundFile: 'theme_2.mp3' };

      const migrated = migrations[1](persistedWith(theme));

      expect(migrated).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin', themeSound: theme },
        },
      });
    });

    it('moves a saved background into backgroundSound', () => {
      const background = {
        soundType: 'background',
        soundFile: 'background_metro.mp3',
      };

      const migrated = migrations[1](persistedWith(background));

      expect(migrated).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin', backgroundSound: background },
        },
      });
    });

    it('leaves saves without the old field untouched', () => {
      const persisted = persistedWith();

      expect(migrations[1](persisted)).toBe(persisted);
    });

    it('leaves a fresh install untouched', () => {
      expect(migrations[1](undefined)).toBeUndefined();
    });
  });

  describe('version 2', () => {
    const persistedDices = (dices?: string[]) =>
      ({
        ...PERSIST,
        saves: { hasStarted: true, save: { charName: 'Rin' }, dices },
      }) as unknown as PersistedState;

    it('replaces a deck with retired dice ids by the starter deck', () => {
      const migrated = migrations[2](
        persistedDices(['attack-d4-a', 'defense-d4-level1-a']),
      );

      expect(migrated).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin' },
          dices: STARTER_DICES,
        },
      });
    });

    it('keeps a deck whose ids all exist in the catalog', () => {
      const persisted = persistedDices(['attack-d4-level1-a']);

      expect(migrations[2](persisted)).toBe(persisted);
    });

    it('leaves saves without a deck and fresh installs untouched', () => {
      const persisted = persistedDices();

      expect(migrations[2](persisted)).toBe(persisted);
      expect(migrations[2](undefined)).toBeUndefined();
    });
  });

  describe('version 3', () => {
    const persistedDices = (dices: string[]) =>
      ({
        ...PERSIST,
        saves: { hasStarted: true, save: { charName: 'Rin' }, dices },
      }) as unknown as PersistedState;

    it('replaces a deck with dice removed by the rebalance', () => {
      const migrated = migrations[3](
        persistedDices(['attack-d8-level1-a', 'defense-d4-level1-a']),
      );

      expect(migrated).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin' },
          dices: STARTER_DICES,
        },
      });
    });

    it('keeps a deck that already uses counter dice', () => {
      const persisted = persistedDices(['counter-d4-level1-c']);

      expect(migrations[3](persisted)).toBe(persisted);
    });
  });

  describe('version 4', () => {
    const persistedCount = (numOfDices?: number) =>
      ({
        ...PERSIST,
        saves: { hasStarted: true, save: { charName: 'Rin' }, numOfDices },
      }) as unknown as PersistedState;

    it('raises a two-slot save to the starter pool', () => {
      expect(migrations[4](persistedCount(2))).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin' },
          numOfDices: STARTER_NUM_OF_DICES,
        },
      });
    });

    it('caps a save above the player maximum', () => {
      expect(migrations[4](persistedCount(8))).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin' },
          numOfDices: PLAYER_MAX_SLOTS,
        },
      });
    });

    it('keeps a save already inside the range', () => {
      const persisted = persistedCount(4);

      expect(migrations[4](persisted)).toBe(persisted);
      expect(migrations[4](undefined)).toBeUndefined();
    });
  });

  describe('version 5', () => {
    const persistedDices = (dices: string[]) =>
      ({
        ...PERSIST,
        saves: { hasStarted: true, save: { charName: 'Rin' }, dices },
      }) as unknown as PersistedState;

    it('drops repeated copies of the same die', () => {
      expect(
        migrations[5](
          persistedDices(['attack-d4-level1-a', 'attack-d4-level1-a']),
        ),
      ).toEqual({
        ...PERSIST,
        saves: {
          hasStarted: true,
          save: { charName: 'Rin' },
          dices: ['attack-d4-level1-a'],
        },
      });
    });

    it('keeps a deck that already has one copy of each die', () => {
      const persisted = persistedDices(['attack-d4-level1-a']);

      expect(migrations[5](persisted)).toBe(persisted);
    });

    it('leaves a save without a dice list untouched', () => {
      const persisted = {
        ...PERSIST,
        saves: { hasStarted: true, save: { charName: 'Rin' } },
      } as unknown as PersistedState;

      expect(migrations[5](persisted)).toBe(persisted);
      expect(migrations[5](undefined)).toBeUndefined();
    });
  });
});
