import { useCallback, useEffect, useRef } from 'react';

import { AppState, type AppStateStatus } from 'react-native';

import Sound from 'react-native-sound';

import { EFFECT_VOLUME, THEME_BACKGROUND_VOLUME } from './useSound.constants';
import type { IPlaySoundOptions, ISound, IUseSound } from './useSound.types';

const releasePlayer = (player: Sound) => {
  player.stop();
  player.release();
};

// Shared by every useSound instance, so a theme started in App and a
// background started in Game replace each other.
let themeOrBackground:
  | { file: string; player: Sound; isLoaded: boolean; isPaused: boolean }
  | undefined;

const stopThemeOrBackground = () => {
  if (themeOrBackground) {
    releasePlayer(themeOrBackground.player);
  }
  themeOrBackground = undefined;
};

const startThemeOrBackground = (player: Sound) => {
  player.play(() => {
    if (themeOrBackground?.player !== player) {
      return;
    }
    player.release();
    themeOrBackground = undefined;
  });
};

const playThemeOrBackground = (
  soundFile: string,
  options?: IPlaySoundOptions,
) => {
  if (themeOrBackground?.file === soundFile) {
    return;
  }
  const isPaused = themeOrBackground?.isPaused ?? false;
  stopThemeOrBackground();

  const player = new Sound(soundFile, Sound.MAIN_BUNDLE, (error) => {
    const slot = themeOrBackground;
    if (slot?.player !== player) {
      player.release();
      return;
    }
    if (error) {
      player.release();
      themeOrBackground = undefined;
      return;
    }

    slot.isLoaded = true;
    player.setVolume(options?.volume ?? THEME_BACKGROUND_VOLUME);
    player.setNumberOfLoops(-1);
    if (!slot.isPaused) {
      startThemeOrBackground(player);
    }
  });

  themeOrBackground = {
    file: soundFile,
    player,
    isLoaded: false,
    isPaused,
  };
};

const followAppState = (state: AppStateStatus) => {
  const slot = themeOrBackground;
  if (!slot) {
    return;
  }
  if (state === 'background' && !slot.isPaused) {
    slot.isPaused = true;
    if (slot.isLoaded) {
      slot.player.pause();
    }
    return;
  }
  if (state === 'active' && slot.isPaused) {
    slot.isPaused = false;
    if (slot.isLoaded) {
      startThemeOrBackground(slot.player);
    }
  }
};

export const useSound = (): IUseSound => {
  const effects = useRef(new Map<string, Sound>());

  useEffect(() => {
    Sound.setCategory('Playback');
    const active = effects.current;
    const subscription = AppState.addEventListener('change', followAppState);

    return () => {
      subscription.remove();
      active.forEach(releasePlayer);
      active.clear();
    };
  }, []);

  const stopSound = useCallback((file?: string) => {
    if (!file) {
      effects.current.forEach(releasePlayer);
      effects.current.clear();
      stopThemeOrBackground();
      return;
    }

    if (themeOrBackground?.file === file) {
      stopThemeOrBackground();
    }
    const player = effects.current.get(file);
    if (player) {
      releasePlayer(player);
      effects.current.delete(file);
    }
  }, []);

  const playEffect = useCallback(
    (file: string, options?: IPlaySoundOptions) => {
      const current = effects.current.get(file);
      if (current) {
        releasePlayer(current);
      }

      const player = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
        if (effects.current.get(file) !== player) {
          player.release();
          return;
        }
        if (error) {
          effects.current.delete(file);
          player.release();
          return;
        }

        player.setVolume(options?.volume ?? EFFECT_VOLUME);
        player.play(() => {
          if (effects.current.get(file) !== player) {
            return;
          }
          player.release();
          effects.current.delete(file);
        });
      });

      effects.current.set(file, player);
    },
    [],
  );

  const playSound = useCallback(
    (sound: ISound, options?: IPlaySoundOptions) => {
      if (sound.soundType === 'effect') {
        playEffect(sound.soundFile, options);
        return;
      }
      playThemeOrBackground(sound.soundFile, options);
    },
    [playEffect],
  );

  return { playSound, stopSound };
};
