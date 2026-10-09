export type SoundType = 'theme' | 'background' | 'effect';

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
}
