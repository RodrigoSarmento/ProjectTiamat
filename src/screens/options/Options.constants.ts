import type { ImageSourcePropType } from 'react-native';

import type { Language } from '@helper/language';
import type { SoundType } from '@hooks/use-sound';

export const LANGUAGES: {
  id: Language;
  label: string;
  flag: ImageSourcePropType;
}[] = [
  {
    id: 'pt',
    label: 'words.portuguese',
    flag: require('@assets/icons/brasil.png'),
  },
  {
    id: 'en',
    label: 'words.english',
    flag: require('@assets/icons/usa.png'),
  },
];

export const SOUND_OPTIONS: { soundType: SoundType; label: string }[] = [
  { soundType: 'theme', label: 'options.music' },
  { soundType: 'background', label: 'options.ambience' },
  { soundType: 'effect', label: 'options.effects' },
];
