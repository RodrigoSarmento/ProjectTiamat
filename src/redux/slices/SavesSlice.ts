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
  save: ISave | undefined;
}

const initialState: ISaves = {
  save: undefined,
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
    saveStatus: (state, action: PayloadAction<IStatus>) => {
      state.save = {
        status: action.payload,
        temporaryStatus: { ...action.payload },
        currentBackground: state.save?.currentBackground ?? {},
      };
    },
    applyTemporaryStatus: (state, action: PayloadAction<Partial<IStatus>>) => {
      if (!state.save) {
        return;
      }
      state.save.temporaryStatus = addTemporaryStatus(
        state.save.temporaryStatus,
        action.payload,
      );
    },
    setCurrentBackground: (state, action: PayloadAction<IStoryBackground>) => {
      if (!state.save) {
        return;
      }
      state.save.currentBackground = action.payload;
    },
  },
});

export const { saveStatus, applyTemporaryStatus, setCurrentBackground } =
  savesSlice.actions;

export default savesSlice.reducer;
