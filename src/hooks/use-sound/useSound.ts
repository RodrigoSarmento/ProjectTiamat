import { useCallback, useEffect, useRef } from 'react';

import Sound from 'react-native-sound';

import { SOUND_FILE_THEMES } from './useSound.constants';
import type { IPlaySoundOptions, IUseSound } from './useSound.types';

const THEME_FILES: string[] = Object.values(SOUND_FILE_THEMES);

const nextThemeFile = (current: string, random?: boolean) => {
  if (!random) {
    return THEME_FILES[(THEME_FILES.indexOf(current) + 1) % THEME_FILES.length];
  }
  const others = THEME_FILES.filter((file) => file !== current);
  return others.length
    ? others[Math.floor(Math.random() * others.length)]
    : current;
};

const releasePlayer = (player: Sound) => {
  player.stop();
  player.release();
};

export const useSound = (): IUseSound => {
  const players = useRef(new Map<string, Sound>());

  useEffect(() => {
    Sound.setCategory('Playback');
    const active = players.current;

    return () => {
      active.forEach(releasePlayer);
      active.clear();
    };
  }, []);

  const stopSound = useCallback((file?: string) => {
    if (file) {
      const player = players.current.get(file);
      if (!player) {
        return;
      }
      releasePlayer(player);
      players.current.delete(file);
      return;
    }

    players.current.forEach(releasePlayer);
    players.current.clear();
  }, []);

  const playSound = useCallback(
    (file: string, options?: IPlaySoundOptions) => {
      const playTrack = (track: string) => {
        const player = new Sound(track, Sound.MAIN_BUNDLE, (error) => {
          if (players.current.get(file) !== player) {
            player.release();
            return;
          }
          if (error) {
            players.current.delete(file);
            player.release();
            return;
          }

          if (options?.volume != null) {
            player.setVolume(options.volume);
          }

          player.play((success) => {
            if (players.current.get(file) !== player) {
              return;
            }
            player.release();
            players.current.delete(file);
            if (success && options?.loop) {
              playTrack(nextThemeFile(track, options.random));
            }
          });
        });

        players.current.set(file, player);
      };

      stopSound(file);
      playTrack(file);
    },
    [stopSound],
  );

  return { playSound, stopSound };
};
