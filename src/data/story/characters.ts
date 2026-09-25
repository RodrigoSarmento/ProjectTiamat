import type { ImageSourcePropType } from 'react-native';

export enum CharacterId {
  securityGuard = 1,
  maleVoice = 2,
  jo = 3,
  gus = 4,
}

export interface IStoryCharacter {
  id: CharacterId;
  name: string;
  portrait?: ImageSourcePropType;
}

export const CHARACTERS: Record<CharacterId, IStoryCharacter> = {
  [CharacterId.securityGuard]: {
    id: CharacterId.securityGuard,
    name: 'Segurança',
    portrait: require('@assets/characters/character_security_guard.png'),
  },
  [CharacterId.maleVoice]: {
    id: CharacterId.maleVoice,
    name: 'Voz masculina',
  },
  [CharacterId.jo]: {
    id: CharacterId.jo,
    name: 'Jô',
    portrait: require('@assets/characters/character_jo.png'),
  },
  [CharacterId.gus]: {
    name: 'Gus',
    id: CharacterId.gus,
    portrait: require('@assets/characters/character_gus.png'),
  },
};

export const getCharacter = (characterId: CharacterId) =>
  CHARACTERS[characterId];
