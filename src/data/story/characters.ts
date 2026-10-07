import type { ImageSourcePropType } from 'react-native';

export enum CharacterId {
  securityGuard = 1,
  maleVoice = 2,
  jo = 3,
  gus = 4,
  you = 5,
  busSystem = 6,
  terminal = 7,
  terminal2 = 8,
  scanner = 9,
  securityAgents = 10,
}

export interface IStoryCharacter {
  id: CharacterId;
  name: string;
  portrait?: ImageSourcePropType;
}

export const CHARACTERS: Record<CharacterId, IStoryCharacter> = {
  [CharacterId.securityGuard]: {
    id: CharacterId.securityGuard,
    name: 'characters.securityGuard',
    portrait: require('@assets/characters/character_security_guard.png'),
  },
  [CharacterId.maleVoice]: {
    id: CharacterId.maleVoice,
    name: 'characters.maleVoice',
  },
  [CharacterId.jo]: {
    id: CharacterId.jo,
    name: 'characters.jo',
    portrait: require('@assets/characters/character_jo.png'),
  },
  [CharacterId.gus]: {
    name: 'characters.gus',
    id: CharacterId.gus,
    portrait: require('@assets/characters/character_gus.png'),
  },
  [CharacterId.you]: {
    name: 'characters.you',
    id: CharacterId.you,
    portrait: require('@assets/characters/character_gus.png'), //TODO: Add your portrait
  },
  [CharacterId.busSystem]: {
    name: 'characters.busSystem',
    id: CharacterId.busSystem,
  },
  [CharacterId.terminal]: {
    name: 'characters.terminal',
    id: CharacterId.terminal,
  },
  [CharacterId.terminal2]: {
    name: 'characters.terminal2',
    id: CharacterId.terminal2,
  },
  [CharacterId.scanner]: {
    name: 'characters.scanner',
    id: CharacterId.scanner,
  },
  [CharacterId.securityAgents]: {
    name: 'characters.securityAgent',
    id: CharacterId.securityAgents,
  },
};

export const getCharacter = (characterId: CharacterId) =>
  CHARACTERS[characterId];
