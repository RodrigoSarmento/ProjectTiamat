declare global {
  type AttributeId =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma';

  interface IStatus {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  }

  type GameStackParamsList = {
    Start: undefined;
    CharacterCreation: undefined;
    Game: undefined;
  };
}

export {};
