import type { AttributeMeta } from './CharacterCreation.types';

export const INITIAL_ATTRIBUTES: IStatus = {
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
    label: 'Strength',
    shortLabel: 'STR',
    description: 'Bonus to force, lifting, and breaking barriers.',
  },
  {
    id: 'dexterity',
    label: 'Dexterity',
    shortLabel: 'DEX',
    description: 'Bonus to agility, jumping, and quiet movement.',
  },
  {
    id: 'constitution',
    label: 'Constitution',
    shortLabel: 'CON',
    description: 'Bonus to endurance and resisting hardship.',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    shortLabel: 'INT',
    description: 'Bonus to investigation and recalling knowledge.',
  },
  {
    id: 'wisdom',
    label: 'Wisdom',
    shortLabel: 'WIS',
    description: 'Bonus to perception, insight, and intuition.',
  },
  {
    id: 'charisma',
    label: 'Charisma',
    shortLabel: 'CHA',
    description: 'Bonus to persuasion, presence, and leadership.',
  },
];
