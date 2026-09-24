import { useCallback, useEffect, useRef } from 'react';

import Sound from 'react-native-sound';

import type { IPlaySoundOptions, IUseSound } from './useSound.types';

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

  const playSound = useCallback((file: string, options?: IPlaySoundOptions) => {
    const current = players.current.get(file);
    if (current) {
      releasePlayer(current);
      players.current.delete(file);
    }

    const player = new Sound(file, Sound.MAIN_BUNDLE, (error) => {
      if (error || players.current.get(file) !== player) {
        if (players.current.get(file) === player) {
          players.current.delete(file);
        }
        player.release();
        return;
      }

      if (options?.volume != null) {
        player.setVolume(options.volume);
      }
      if (options?.loop) {
        player.setNumberOfLoops(-1);
      }

      player.play(() => {
        if (options?.loop || players.current.get(file) !== player) {
          return;
        }
        player.release();
        players.current.delete(file);
      });
    });

    players.current.set(file, player);
  }, []);

  return { playSound, stopSound };
};
