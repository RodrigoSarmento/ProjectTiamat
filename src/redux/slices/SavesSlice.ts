import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import type { IStoryBackground } from '@data/story';

export const EMPTY_STATUS: IStatus = {
  energy: 0,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
};

export interface ISave {
  status: IStatus;
  temporaryStatus: IStatus;
  currentBackground: IStoryBackground;
}

export interface ISaves {
  hasStarted: boolean;
  hasCreatedCharacter: boolean;
  save: ISave;
}

const initialState: ISaves = {
  hasStarted: false,
  hasCreatedCharacter: false,
  save: {
    status: { ...EMPTY_STATUS },
    temporaryStatus: { ...EMPTY_STATUS },
    currentBackground: {},
  },
};

const addTemporaryStatus = (
  current: IStatus,
  delta: Partial<IStatus>,
): IStatus => {
  const next = { ...current };
  (Object.keys(delta) as AttributeId[]).forEach((attribute) => {
    const amount = delta[attribute];
    if (amount == null) {
      return;
    }
    next[attribute] += amount;
  });
  return next;
};

const savesSlice = createSlice({
  name: 'saves',
  initialState,
  reducers: {
    startGame: (state) => {
      state.hasStarted = true;
    },
    saveStatus: (state, action: PayloadAction<IStatus>) => {
      state.save.status = action.payload;
      state.hasCreatedCharacter = true;
    },
    applyTemporaryStatus: (state, action: PayloadAction<Partial<IStatus>>) => {
      state.save.temporaryStatus = addTemporaryStatus(
        state.save.temporaryStatus,
        action.payload,
      );
    },
    setCurrentBackground: (state, action: PayloadAction<IStoryBackground>) => {
      state.save.currentBackground = action.payload;
    },
  },
});

export const {
  startGame,
  saveStatus,
  applyTemporaryStatus,
  setCurrentBackground,
} = savesSlice.actions;

export default savesSlice.reducer;
