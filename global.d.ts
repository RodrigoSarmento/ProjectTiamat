declare global {
  type AttributeId =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma'
    | 'energy';

  interface IStatus {
    energy: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  }

  type GameStackParamsList = {
    Start: undefined;
    Game: undefined;
    CharacterCreation: undefined;
    Combat: { enemyId: import('@data/story').EnemiesId };
  };
}

export {};
