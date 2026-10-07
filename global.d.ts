declare global {
  type AttributeId =
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma'
    | 'energy'
    | 'technical_ability';

  interface IStatus {
    energy: number;
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    technical_ability: number;
  }

  type GameStackParamsList = {
    Start: undefined;
    Game: undefined;
    CharacterCreation: undefined;
    Combat: {
      enemyId: import('@data/story').EnemiesId;
      victoryText?: string[];
      defeatText?: string[];
      background?: import('@data/story').StoryBackgroundImageId;
    };
  };
}

export {};
