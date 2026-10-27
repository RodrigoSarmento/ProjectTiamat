import { type Language, deviceLanguage } from '@helper/language';
import type { SoundType } from '@hooks/use-sound';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export interface ISettings {
  soundEnabled: Record<SoundType, boolean>;
  language: Language;
}

const initialState: ISettings = {
  soundEnabled: {
    theme: true,
    background: true,
    effect: true,
  },
  language: deviceLanguage(),
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
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage, setSoundEnabled } = settingsSlice.actions;

export default settingsSlice.reducer;
