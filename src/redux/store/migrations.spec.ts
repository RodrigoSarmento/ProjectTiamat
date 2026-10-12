import type { PersistedState } from 'redux-persist';

import { migrations } from './migrations';

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
});
