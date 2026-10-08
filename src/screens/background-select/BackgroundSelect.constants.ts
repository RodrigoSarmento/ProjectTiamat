import type { IBackgroundOption } from './BackgroundSelect.types';

export const BACKGROUNDS: IBackgroundOption[] = [
  { id: 'corp', image: require('@assets/images/background_corp.png') },
  { id: 'citizen', image: require('@assets/images/background_citizen.png') },
  { id: 'military', image: require('@assets/images/background_military.png') },
];
