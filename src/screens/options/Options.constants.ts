import type { SoundType } from '@hooks/use-sound';

export const SOUND_OPTIONS: { soundType: SoundType; label: string }[] = [
  { soundType: 'theme', label: 'options.music' },
  { soundType: 'background', label: 'options.ambience' },
  { soundType: 'effect', label: 'options.effects' },
];
