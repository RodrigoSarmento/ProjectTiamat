import savesReducer, {
  EMPTY_STATUS,
  applyTemporaryStatus,
  saveCharName,
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
    });
  });

  it('marks the game as started', () => {
    expect(savesReducer(init(), startGame()).hasStarted).toBe(true);
  });

  it('writes character status on create or level up', () => {
    const status: IStatus = { ...EMPTY_STATUS, strength: 3 };
    const state = savesReducer(init(), saveStatus(status));

    expect(state.hasCreatedCharacter).toBe(true);
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

  it('stores the character name', () => {
    const state = savesReducer(init(), saveCharName('  Nyx  '));

    expect(state.save.charName).toBe('Nyx');
  });

  it('stores the current background', () => {
    const state = savesReducer(
      init(),
      setCurrentBackground({ backgroundColor: 'black' }),
    );

    expect(state.save.currentBackground).toEqual({ backgroundColor: 'black' });
  });
});
