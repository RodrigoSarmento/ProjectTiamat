import { COMBAT_DICE, PLAYER_MAX_SLOTS } from '@data/combat';
import type { ISound } from '@hooks/use-sound';
import {
  type ISave,
  type ISaves,
  STARTER_DICES,
  STARTER_NUM_OF_DICES,
} from '@redux/slices/SavesSlice';
import type { MigrationManifest, PersistedState } from 'redux-persist';

type PersistedRoot = PersistedState & {
  saves?: Omit<ISaves, 'dices'> & {
    save: ISave & { themeOrBackground?: ISound };
    dices?: string[];
  };
};

const isKnownDie = (id: string) => id in COMBAT_DICE;

const resetUnknownDice = (persisted: PersistedState) => {
  const state = persisted as PersistedRoot;
  const dices = state?.saves?.dices;

  if (!state?.saves || !dices || dices.every(isKnownDie)) {
    return persisted;
  }

  return {
    ...state,
    saves: { ...state.saves, dices: [...STARTER_DICES] },
  } as PersistedRoot;
};

const raisePlayerSlots = (persisted: PersistedState) => {
  const state = persisted as PersistedRoot;
  const count = state?.saves?.numOfDices;
  const next = Math.min(
    PLAYER_MAX_SLOTS,
    Math.max(STARTER_NUM_OF_DICES, count ?? STARTER_NUM_OF_DICES),
  );

  if (!state?.saves || count === next) {
    return persisted;
  }

  return {
    ...state,
    saves: { ...state.saves, numOfDices: next },
  } as PersistedRoot;
};

const dedupeDice = (persisted: PersistedState) => {
  const state = persisted as PersistedRoot;
  const dices = state?.saves?.dices;

  if (!state?.saves || !dices) {
    return persisted;
  }

  const unique = [...new Set(dices)];
  if (unique.length === dices.length) {
    return persisted;
  }

  return {
    ...state,
    saves: { ...state.saves, dices: unique },
  } as PersistedRoot;
};

export const PERSIST_VERSION = 5;

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
  2: resetUnknownDice,
  3: resetUnknownDice,
  4: raisePlayerSlots,
  5: dedupeDice,
};
