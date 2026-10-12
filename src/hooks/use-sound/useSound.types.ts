import type Sound from 'react-native-sound';

export type SoundType = 'theme' | 'background' | 'effect';

export type LoopingSoundType = Exclude<SoundType, 'effect'>;

export interface ILoopingSlot {
  file: string;
  player: Sound;
  isLoaded: boolean;
  isPaused: boolean;
  fadeTimer?: ReturnType<typeof setTimeout>;
}

export interface ISound {
  soundType: SoundType;
  soundFile: string;
}

export interface IPlaySoundOptions {
  volume?: number;
}

export interface IUseSound {
  playSound: (sound: ISound, options?: IPlaySoundOptions) => void;
  stopSound: (file?: string) => void;
  setSoundTypeEnabled: (soundType: SoundType, isEnabled: boolean) => void;
}
