import { useCallback, useEffect, useRef } from 'react';

import { AppState, type AppStateStatus } from 'react-native';

import Sound from 'react-native-sound';

import {
  BACKGROUND_END_VOLUME,
  BACKGROUND_FADE_DELAY_MS,
  BACKGROUND_FADE_STEPS,
  BACKGROUND_FADE_STEP_MS,
  BACKGROUND_START_VOLUME,
  EFFECT_VOLUME,
  LOOPING_SOUND_TYPES,
  THEME_VOLUME,
} from './useSound.constants';
import type {
  ILoopingSlot,
  IPlaySoundOptions,
  ISound,
  IUseSound,
  LoopingSoundType,
  SoundType,
} from './useSound.types';

const releasePlayer = (player: Sound) => {
  player.stop();
  player.release();
};

// Shared by every useSound instance, so a theme started in App and a
// background started in Game play together, and each replaces its own kind.
const loopingSlots: Record<LoopingSoundType, ILoopingSlot | undefined> = {
  theme: undefined,
  background: undefined,
};

// Remembered while its sound type is disabled, so it can start once enabled.
const requestedLoopingSounds: Record<
  LoopingSoundType,
  { sound: ISound; options?: IPlaySoundOptions } | undefined
> = {
  theme: undefined,
  background: undefined,
};

const disabledSoundTypes = new Set<SoundType>();
const mountedEffects = new Set<Map<string, Sound>>();

const isLoopingSoundType = (
  soundType: SoundType,
): soundType is LoopingSoundType => soundType !== 'effect';

const releaseEffects = (effects: Map<string, Sound>) => {
  effects.forEach(releasePlayer);
  effects.clear();
};

const stopLoopingSound = (soundType: LoopingSoundType) => {
  const slot = loopingSlots[soundType];
  if (slot) {
    clearTimeout(slot.fadeTimer);
    releasePlayer(slot.player);
  }
  loopingSlots[soundType] = undefined;
};

const startLoopingSound = (soundType: LoopingSoundType, player: Sound) => {
  player.play(() => {
    const slot = loopingSlots[soundType];
    if (slot?.player !== player) {
      return;
    }
    clearTimeout(slot.fadeTimer);
    player.release();
    loopingSlots[soundType] = undefined;
  });
};

const fadeBackgroundStep = (slot: ILoopingSlot, step: number) => {
  slot.fadeTimer = setTimeout(
    () => {
      if (step >= BACKGROUND_FADE_STEPS) {
        slot.player.setVolume(BACKGROUND_END_VOLUME);
        slot.fadeTimer = undefined;
        return;
      }
      slot.player.setVolume(
        BACKGROUND_START_VOLUME -
          ((BACKGROUND_START_VOLUME - BACKGROUND_END_VOLUME) * step) /
            BACKGROUND_FADE_STEPS,
      );
      fadeBackgroundStep(slot, step + 1);
    },
    step === 1
      ? BACKGROUND_FADE_DELAY_MS + BACKGROUND_FADE_STEP_MS
      : BACKGROUND_FADE_STEP_MS,
  );
};

const playLoopingSound = (
  soundType: LoopingSoundType,
  sound: ISound,
  options?: IPlaySoundOptions,
) => {
  requestedLoopingSounds[soundType] = { sound, options };
  if (disabledSoundTypes.has(soundType)) {
    stopLoopingSound(soundType);
    return;
  }
  if (loopingSlots[soundType]?.file === sound.soundFile) {
    return;
  }
  const isPaused = loopingSlots[soundType]?.isPaused ?? false;
  stopLoopingSound(soundType);

  const player = new Sound(sound.soundFile, Sound.MAIN_BUNDLE, (error) => {
    const slot = loopingSlots[soundType];
    if (slot?.player !== player) {
      player.release();
      return;
    }
    if (error) {
      player.release();
      loopingSlots[soundType] = undefined;
      return;
    }

    slot.isLoaded = true;
    player.setNumberOfLoops(-1);
    if (options?.volume !== undefined) {
      player.setVolume(options.volume);
    } else if (soundType === 'background') {
      player.setVolume(BACKGROUND_START_VOLUME);
      fadeBackgroundStep(slot, 1);
    } else {
      player.setVolume(THEME_VOLUME);
    }
    if (!slot.isPaused) {
      startLoopingSound(soundType, player);
    }
  });

  loopingSlots[soundType] = {
    file: sound.soundFile,
    player,
    isLoaded: false,
    isPaused,
  };
};

const setSoundTypeEnabled = (soundType: SoundType, isEnabled: boolean) => {
  if (isEnabled) {
    disabledSoundTypes.delete(soundType);
    if (!isLoopingSoundType(soundType)) {
      return;
    }
    const requested = requestedLoopingSounds[soundType];
    if (requested) {
      playLoopingSound(soundType, requested.sound, requested.options);
    }
    return;
  }

  disabledSoundTypes.add(soundType);
  if (isLoopingSoundType(soundType)) {
    stopLoopingSound(soundType);
    return;
  }
  mountedEffects.forEach(releaseEffects);
};

const followAppState = (state: AppStateStatus) => {
  LOOPING_SOUND_TYPES.forEach((soundType) => {
    const slot = loopingSlots[soundType];
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
        startLoopingSound(soundType, slot.player);
      }
    }
  });
};

export const useSound = (): IUseSound => {
  const effects = useRef(new Map<string, Sound>());

  useEffect(() => {
    Sound.setCategory('Playback');
    const active = effects.current;
    mountedEffects.add(active);
    const subscription = AppState.addEventListener('change', followAppState);

    return () => {
      subscription.remove();
      mountedEffects.delete(active);
      releaseEffects(active);
    };
  }, []);

  const stopSound = useCallback((file?: string) => {
    if (!file) {
      releaseEffects(effects.current);
      LOOPING_SOUND_TYPES.forEach((soundType) => {
        requestedLoopingSounds[soundType] = undefined;
        stopLoopingSound(soundType);
      });
      return;
    }

    LOOPING_SOUND_TYPES.forEach((soundType) => {
      if (requestedLoopingSounds[soundType]?.sound.soundFile === file) {
        requestedLoopingSounds[soundType] = undefined;
      }
      if (loopingSlots[soundType]?.file === file) {
        stopLoopingSound(soundType);
      }
    });
    const player = effects.current.get(file);
    if (player) {
      releasePlayer(player);
      effects.current.delete(file);
    }
  }, []);

  const playEffect = useCallback(
    (file: string, options?: IPlaySoundOptions) => {
      if (disabledSoundTypes.has('effect')) {
        return;
      }
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
      if (isLoopingSoundType(sound.soundType)) {
        playLoopingSound(sound.soundType, sound, options);
        return;
      }
      playEffect(sound.soundFile, options);
    },
    [playEffect],
  );

  return { playSound, stopSound, setSoundTypeEnabled };
};
