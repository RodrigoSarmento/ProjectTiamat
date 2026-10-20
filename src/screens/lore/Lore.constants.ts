import type { ImageSourcePropType } from 'react-native';

import { Colors } from '@styles';

import type { LoreTab } from './Lore.types';

export const loreReadId = (tab: LoreTab, id: string) => `${tab}:${id}`;

export const LORE_ENTRIES = ['terceiraGuerra', 'colapso', 'privatizacoes'];

export const CHARACTER_ENTRIES: {
  id: 'jo';
  portrait: ImageSourcePropType;
}[] = [
  {
    id: 'jo',
    portrait: require('@assets/characters/character_jo_square.png'),
  },
];

export const LORE_TAB_IDLE = '#7EC8D6';
export const LORE_TAB_SELECTED = Colors.neonCyan;
export const LORE_TAB_FILL = 'rgba(10, 10, 16, 0.85)';
export const LORE_TAB_FILL_SELECTED = 'rgba(60, 246, 255, 0.22)';
