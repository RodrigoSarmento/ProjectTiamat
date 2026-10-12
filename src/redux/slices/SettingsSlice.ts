import type { SoundType } from '@hooks/use-sound';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ISettings {
  soundEnabled: Record<SoundType, boolean>;
}

const initialState: ISettings = {
  soundEnabled: {
    theme: true,
    background: true,
    effect: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSoundEnabled: (
      state,
      action: PayloadAction<{ soundType: SoundType; isEnabled: boolean }>,
    ) => {
      state.soundEnabled[action.payload.soundType] = action.payload.isEnabled;
    },
  },
});

export const { setSoundEnabled } = settingsSlice.actions;

export default settingsSlice.reducer;
