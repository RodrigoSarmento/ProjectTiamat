import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ISave {
  status: IStatus;
}
export interface ISaves {
  save: ISave | undefined;
}

const initialState: ISaves = {
  save: undefined,
};

const savesSlice = createSlice({
  name: 'saves',
  initialState,
  reducers: {
    saveStatus: (state, action: PayloadAction<IStatus>) => {
      state.save = {
        status: action.payload,
      };
    },
  },
});

export const { saveStatus } = savesSlice.actions;

export default savesSlice.reducer;
