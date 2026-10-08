import { DECK_MAX_SIZE, DECK_MIN_SIZE, HAND_SIZE } from '@data/combat';
import { StoryFlag } from '@data/story';

import savesReducer, {
  EMPTY_STATUS,
  STARTER_DICES,
  STARTER_NUM_OF_DICES,
  applyTemporaryStatus,
  eraseSave,
  saveCharName,
  saveProgress,
  saveStatus,
  setCurrentBackground,
  startGame,
} from './SavesSlice';

const init = () => savesReducer(undefined, { type: '@@INIT' });

describe('SavesSlice', () => {
  it('starts with an empty save that has not begun', () => {
    expect(init()).toEqual({
      hasStarted: false,
      hasCreatedCharacter: false,
      save: {
        charName: '',
        status: EMPTY_STATUS,
        temporaryStatus: EMPTY_STATUS,
        currentBackground: {},
      },
      dices: STARTER_DICES,
      numOfDices: STARTER_NUM_OF_DICES,
    });
  });

  it('starts with a deck inside the deck size limits and bigger than a hand', () => {
    expect(STARTER_DICES.length).toBeGreaterThanOrEqual(DECK_MIN_SIZE);
    expect(STARTER_DICES.length).toBeLessThanOrEqual(DECK_MAX_SIZE);
    expect(STARTER_DICES.length).toBeGreaterThan(HAND_SIZE);
  });

  it('marks the game as started with the chosen origin', () => {
    const state = savesReducer(init(), startGame('military'));

    expect(state.hasStarted).toBe(true);
    expect(state.save.origin).toBe('military');
  });

  it('writes character status on create or level up', () => {
    const status: IStatus = { ...EMPTY_STATUS, strength: 3 };
    const state = savesReducer(init(), saveStatus(status));

    expect(state.hasCreatedCharacter).toBe(false);
    expect(state.save.status).toEqual(status);
    expect(state.save.temporaryStatus).toEqual(EMPTY_STATUS);
  });

  it('stacks temporaryStatus deltas', () => {
    const status: IStatus = { ...EMPTY_STATUS, charisma: 2 };
    const created = savesReducer(init(), saveStatus(status));
    const state = savesReducer(
      created,
      applyTemporaryStatus({ energy: 1, charisma: 1 }),
    );

    expect(state.save.status).toEqual(status);
    expect(state.save.temporaryStatus).toEqual({
      ...EMPTY_STATUS,
      energy: 1,
      charisma: 1,
    });
  });

  it('only updates status on a later saveStatus', () => {
    const created = savesReducer(
      init(),
      saveStatus({ ...EMPTY_STATUS, strength: 3 }),
    );
    const withBuffs = savesReducer(
      created,
      applyTemporaryStatus({ energy: 1 }),
    );
    const withBackground = savesReducer(
      withBuffs,
      setCurrentBackground({ backgroundColor: 'black' }),
    );
    const upgraded = savesReducer(
      withBackground,
      saveStatus({ ...EMPTY_STATUS, strength: 4 }),
    );

    expect(upgraded.save.status.strength).toBe(4);
    expect(upgraded.save.temporaryStatus).toEqual({
      ...EMPTY_STATUS,
      energy: 1,
    });
    expect(upgraded.save.currentBackground).toEqual({
      backgroundColor: 'black',
    });
  });

  it('stores the character name and marks the character as created', () => {
    const state = savesReducer(init(), saveCharName('  Nyx  '));

    expect(state.save.charName).toBe('Nyx');
    expect(state.hasCreatedCharacter).toBe(true);
  });

  it('stores the current background', () => {
    const state = savesReducer(
      init(),
      setCurrentBackground({ backgroundColor: 'black' }),
    );

    expect(state.save.currentBackground).toEqual({ backgroundColor: 'black' });
  });

  it('stores the story progress', () => {
    const progress = {
      nodeId: 'wake-on-bus',
      flags: [StoryFlag.helpedGusWithForcePassage],
      usedChoiceIds: ['ask-about-service'],
      storyLog: [
        { key: 'wake-on-bus:0', nodeId: 'wake-on-bus', text: 'Acorda!' },
      ],
    };
    const state = savesReducer(init(), saveProgress(progress));

    expect(state.save.progress).toEqual(progress);
  });

  it('erases the whole save back to a new game', () => {
    const played = [
      startGame('corp'),
      saveStatus({ ...EMPTY_STATUS, strength: 3 }),
      saveProgress({
        nodeId: 'wake-on-bus',
        flags: [],
        usedChoiceIds: [],
        storyLog: [],
      }),
    ].reduce(savesReducer, init());

    expect(savesReducer(played, eraseSave())).toEqual(init());
  });
});
