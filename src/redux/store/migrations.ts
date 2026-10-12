import type { ISound } from '@hooks/use-sound';
import type { ISave, ISaves } from '@redux/slices/SavesSlice';
import type { MigrationManifest, PersistedState } from 'redux-persist';

type PersistedRoot = PersistedState & {
  saves?: ISaves & { save: ISave & { themeOrBackground?: ISound } };
};

export const PERSIST_VERSION = 1;

export const migrations: MigrationManifest = {
  1: (persisted) => {
    const state = persisted as PersistedRoot;
    const save = state?.saves?.save;

    if (!state?.saves || !save?.themeOrBackground) {
      return persisted;
    }

    const { themeOrBackground, ...rest } = save;
    const slot =
      themeOrBackground.soundType === 'background'
        ? 'backgroundSound'
        : 'themeSound';

    return {
      ...state,
      saves: { ...state.saves, save: { ...rest, [slot]: themeOrBackground } },
    } as PersistedRoot;
  },
};
