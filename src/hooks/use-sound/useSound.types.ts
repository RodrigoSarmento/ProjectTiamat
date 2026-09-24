export interface IPlaySoundOptions {
  loop?: boolean;
  volume?: number;
}

export interface IUseSound {
  playSound: (file: string, options?: IPlaySoundOptions) => void;
  stopSound: (file?: string) => void;
}
