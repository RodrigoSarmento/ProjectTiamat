import savesReducer, {
  EMPTY_STATUS,
  applyTemporaryStatus,
  saveStatus,
  setCurrentBackground,
} from './SavesSlice';

describe('SavesSlice', () => {
  it('copies the base status into temporaryStatus when creating a save', () => {
    const status: IStatus = { ...EMPTY_STATUS, strength: 3 };

    expect(savesReducer({ save: undefined }, saveStatus(status))).toEqual({
      save: {
        status,
        temporaryStatus: status,
        currentBackground: {},
      },
    });
  });

  it('stacks temporaryStatus deltas on an existing save', () => {
    const status: IStatus = { ...EMPTY_STATUS, charisma: 2 };
    const withSave = savesReducer({ save: undefined }, saveStatus(status));
    const state = savesReducer(
      withSave,
      applyTemporaryStatus({ energy: 1, charisma: 1 }),
    );

    expect(state.save?.status).toEqual(status);
    expect(state.save?.temporaryStatus).toEqual({
      ...status,
      energy: 1,
      charisma: 3,
    });
  });

  it('stores the current background on an existing save', () => {
    const withSave = savesReducer(
      { save: undefined },
      saveStatus({ ...EMPTY_STATUS }),
    );
    const state = savesReducer(
      withSave,
      setCurrentBackground({ backgroundColor: 'black' }),
    );

    expect(state.save?.currentBackground).toEqual({ backgroundColor: 'black' });
  });
});
