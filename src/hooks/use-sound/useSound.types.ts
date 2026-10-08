export interface IPlaySoundOptions {
  loop?: boolean;
  random?: boolean;
  volume?: number;
}

export interface IUseSound {
  playSound: (file: string, options?: IPlaySoundOptions) => void;
  stopSound: (file?: string) => void;
}
