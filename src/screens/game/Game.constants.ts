import type { ImageSourcePropType } from 'react-native';

export const SAMPLE_DIALOGUE: {
  name: string;
  text: string;
  portrait: ImageSourcePropType;
}[] = [
  {
    name: 'Shop owner',
    text: 'You look lost, paladin. Street like this eats the unarmed. You look lost, paladin. Street like this eats the unarmed.',
    portrait: require('@assets/characters/character_shop_owner.png'),
  },
  {
    name: 'Shop owner',
    text: 'I keep a few things that bite back. Steel, scrap, and secrets.',
    portrait: require('@assets/characters/character_shop_owner.png'),
  },
  {
    name: 'Shop owner',
    text: 'Coin first. Then we talk about what you think you need.',
    portrait: require('@assets/characters/character_shop_owner.png'),
  },
];
