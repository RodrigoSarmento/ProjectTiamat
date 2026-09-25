import type { AttributeMeta } from './CharacterCreation.types';

export const INITIAL_ATTRIBUTES: IStatus = {
  energy: 0,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
};

export const TOTAL_POINTS = 10;

export const ATTRIBUTE_META: AttributeMeta[] = [
  {
    id: 'strength',
    label: 'characterCreation.attributes.strength.label',
    shortLabel: 'STR',
    description: 'characterCreation.attributes.strength.description',
  },
  {
    id: 'dexterity',
    label: 'characterCreation.attributes.dexterity.label',
    shortLabel: 'DEX',
    description: 'characterCreation.attributes.dexterity.description',
  },
  {
    id: 'constitution',
    label: 'characterCreation.attributes.constitution.label',
    shortLabel: 'CON',
    description: 'characterCreation.attributes.constitution.description',
  },
  {
    id: 'intelligence',
    label: 'characterCreation.attributes.intelligence.label',
    shortLabel: 'INT',
    description: 'characterCreation.attributes.intelligence.description',
  },
  {
    id: 'wisdom',
    label: 'characterCreation.attributes.wisdom.label',
    shortLabel: 'WIS',
    description: 'characterCreation.attributes.wisdom.description',
  },
  {
    id: 'charisma',
    label: 'characterCreation.attributes.charisma.label',
    shortLabel: 'CHA',
    description: 'characterCreation.attributes.charisma.description',
  },
];
