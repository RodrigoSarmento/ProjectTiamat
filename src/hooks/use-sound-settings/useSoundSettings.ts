import { useEffect } from 'react';

import { DEFAULT_THEME, type SoundType, useSound } from '@hooks/use-sound';
import type { RootState } from '@redux/store';
import { useSelector, useStore } from 'react-redux';

export const useSoundSettings = () => {
  const { playSound, setSoundTypeEnabled } = useSound();
  const store = useStore<RootState>();
  const soundEnabled = useSelector(
    (state: RootState) => state.settings.soundEnabled,
  );

  useEffect(() => {
    (Object.keys(soundEnabled) as SoundType[]).forEach((soundType) =>
      setSoundTypeEnabled(soundType, soundEnabled[soundType]),
    );
  }, [setSoundTypeEnabled, soundEnabled]);

  useEffect(() => {
    const { save } = store.getState().saves;
    playSound(save.themeSound ?? DEFAULT_THEME);
    if (save.backgroundSound) {
      playSound(save.backgroundSound);
    }
  }, [playSound, store]);
};
