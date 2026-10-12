import settingsReducer, { setSoundEnabled } from './SettingsSlice';

const init = () => settingsReducer(undefined, { type: '@@INIT' });

describe('SettingsSlice', () => {
  it('starts with every sound turned on', () => {
    expect(init().soundEnabled).toEqual({
      theme: true,
      background: true,
      effect: true,
    });
  });

  it('turns a sound type off without touching the others', () => {
    const state = settingsReducer(
      init(),
      setSoundEnabled({ soundType: 'background', isEnabled: false }),
    );

    expect(state.soundEnabled).toEqual({
      theme: true,
      background: false,
      effect: true,
    });
  });

  it('turns a sound type back on', () => {
    const off = settingsReducer(
      init(),
      setSoundEnabled({ soundType: 'effect', isEnabled: false }),
    );
    const state = settingsReducer(
      off,
      setSoundEnabled({ soundType: 'effect', isEnabled: true }),
    );

    expect(state.soundEnabled.effect).toBe(true);
  });
});
