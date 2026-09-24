import type { ImageSourcePropType } from 'react-native';

export interface IStoryCharacter {
  id: string;
  name: string;
  portrait?: ImageSourcePropType;
}

export const CHARACTERS: Record<string, IStoryCharacter> = {
  'shop-owner': {
    id: 'shop-owner',
    name: 'Shop owner',
    portrait: require('@assets/characters/character_shop_owner.png'),
  },
  'male-voice': {
    id: 'male-voice',
    name: 'Voz masculina',
  },
  jo: {
    id: 'jo',
    name: 'Jô',
    portrait: require('@assets/characters/character_shop_owner.png'),
  },
};

export const getCharacter = (characterId: string) => CHARACTERS[characterId];
