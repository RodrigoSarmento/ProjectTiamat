import type { PropsWithChildren } from 'react';

import {
  DEFAULT_THEME,
  SOUND_FILE_BACKGROUNDS,
  SOUND_FILE_THEMES,
  type SoundType,
  useSound,
} from '@hooks/use-sound';
import savesReducer, {
  setThemeOrBackground,
  startGame,
} from '@redux/slices/SavesSlice';
import settingsReducer, { setSoundEnabled } from '@redux/slices/SettingsSlice';
import { createTestStore } from '@test/renderWithProviders';
import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';
import { Provider } from 'react-redux';

import { useSoundSettings } from './useSoundSettings';

const SOUND_TYPES: SoundType[] = ['theme', 'background', 'effect'];

const SoundMock = Sound as unknown as jest.Mock;

const loadedFiles = () => SoundMock.mock.calls.map(([file]) => file);

const savedGame = () => {
  const started = savesReducer(undefined, startGame('corp'));
  const withTheme = savesReducer(
    started,
    setThemeOrBackground({
      soundType: 'theme',
      soundFile: SOUND_FILE_THEMES.theme2,
    }),
  );
  return savesReducer(
    withTheme,
    setThemeOrBackground({
      soundType: 'background',
      soundFile: SOUND_FILE_BACKGROUNDS.metro,
    }),
  );
};

const renderSoundSettings = async (
  store: ReturnType<typeof createTestStore>,
) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );
  await renderHook(() => useSoundSettings(), { wrapper });
  await act(async () => {
    await Promise.resolve();
  });
};

const dispatchSoundEnabled = async (
  store: ReturnType<typeof createTestStore>,
  soundType: SoundType,
  isEnabled: boolean,
) => {
  await act(async () => {
    store.dispatch(setSoundEnabled({ soundType, isEnabled }));
    await Promise.resolve();
  });
};

describe('useSoundSettings', () => {
  beforeEach(() => {
    SoundMock.mockClear();
  });

  afterEach(async () => {
    const { result } = await renderHook(() => useSound());
    await act(async () => {
      result.current.stopSound();
      SOUND_TYPES.forEach((soundType) =>
        result.current.setSoundTypeEnabled(soundType, true),
      );
    });
  });

  it('plays the saved theme and background', async () => {
    await renderSoundSettings(createTestStore({ saves: savedGame() }));

    expect(loadedFiles()).toEqual([
      SOUND_FILE_THEMES.theme2,
      SOUND_FILE_BACKGROUNDS.metro,
    ]);
  });

  it('plays the default theme when nothing was saved', async () => {
    await renderSoundSettings(createTestStore());

    expect(loadedFiles()).toEqual([DEFAULT_THEME.soundFile]);
  });

  it('applies the saved settings before playing', async () => {
    const settings = settingsReducer(
      undefined,
      setSoundEnabled({ soundType: 'background', isEnabled: false }),
    );

    await renderSoundSettings(
      createTestStore({ saves: savedGame(), settings }),
    );

    expect(loadedFiles()).toEqual([SOUND_FILE_THEMES.theme2]);
  });

  it('stops the theme when music is turned off and plays it again when turned back on', async () => {
    const store = createTestStore({ saves: savedGame() });
    await renderSoundSettings(store);
    const theme = SoundMock.mock.instances[0];

    await dispatchSoundEnabled(store, 'theme', false);
    expect(theme.release).toHaveBeenCalled();

    await dispatchSoundEnabled(store, 'theme', true);
    expect(loadedFiles().at(-1)).toBe(SOUND_FILE_THEMES.theme2);
    expect(SoundMock.mock.instances.at(-1).play).toHaveBeenCalled();
  });
});
