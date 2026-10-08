import { CombatDieId } from '@data/combat';
import type { IStoryBackground, StoryFlag, StoryNodeId } from '@data/story';
import type { IStoryLogEntry } from '@helper/storyLog';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const EMPTY_STATUS: IStatus = {
  energy: 0,
  strength: 0,
  dexterity: 0,
  constitution: 0,
  intelligence: 0,
  wisdom: 0,
  charisma: 0,
  technical_ability: 0,
};

export interface IStoryProgress {
  nodeId: StoryNodeId;
  flags: StoryFlag[];
  usedChoiceIds: string[];
  storyLog: IStoryLogEntry[];
}

export interface ISave {
  charName: string;
  origin?: BackgroundId;
  status: IStatus;
  temporaryStatus: IStatus;
  currentBackground: IStoryBackground;
  progress?: IStoryProgress;
}

export interface ISaves {
  hasStarted: boolean;
  hasCreatedCharacter: boolean;
  save: ISave;
  dices: CombatDieId[];
  numOfDices: number;
}

export const STARTER_DICES: CombatDieId[] = [
  'attack-d4-a',
  'attack-d4-b',
  'attack-d6-a',
  'attack-d6-b',
  'attack-d8-a',
  'attack-d8-b',
  'defense-d4-a',
  'defense-d4-b',
  'defense-d6-a',
  'defense-d6-b',
  'defense-d8-a',
  'defense-d8-a',
];

export const STARTER_NUM_OF_DICES = 2;

const initialState: ISaves = {
  hasStarted: false,
  hasCreatedCharacter: false,
  save: {
    charName: '',
    status: { ...EMPTY_STATUS },
    temporaryStatus: { ...EMPTY_STATUS },
    currentBackground: {},
  },
  dices: [...STARTER_DICES],
  numOfDices: STARTER_NUM_OF_DICES,
};

const addTemporaryStatus = (
  current: IStatus,
  delta: Partial<IStatus>,
): IStatus => {
  const next = { ...current };
  (Object.keys(delta) as AttributeId[]).forEach((attribute) => {
    const amount = delta[attribute];
    if (amount == null) {
      return;
    }
    next[attribute] += amount;
  });
  return next;
};

const savesSlice = createSlice({
  name: 'saves',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<BackgroundId>) => {
      state.hasStarted = true;
      state.save.origin = action.payload;
    },
    saveStatus: (state, action: PayloadAction<IStatus>) => {
      state.save.status = action.payload;
    },
    saveCharName: (state, action: PayloadAction<string>) => {
      state.save.charName = action.payload.trim();
      state.hasCreatedCharacter = true;
    },
    applyTemporaryStatus: (state, action: PayloadAction<Partial<IStatus>>) => {
      state.save.temporaryStatus = addTemporaryStatus(
        state.save.temporaryStatus,
        action.payload,
      );
    },
    setCurrentBackground: (state, action: PayloadAction<IStoryBackground>) => {
      state.save.currentBackground = action.payload;
    },
    saveProgress: (state, action: PayloadAction<IStoryProgress>) => {
      state.save.progress = action.payload;
    },
    eraseSave: () => initialState,
  },
});

export const {
  startGame,
  saveStatus,
  saveCharName,
  applyTemporaryStatus,
  setCurrentBackground,
  saveProgress,
  eraseSave,
} = savesSlice.actions;

export default savesSlice.reducer;
