import { useNavigation } from '@react-navigation/native';

import {
  DEFAULT_THEME,
  SOUND_FILE_BACKGROUNDS,
  SOUND_FILE_THEMES,
  type SoundType,
  useSound,
} from '@hooks/use-sound';
import { useSoundSettings } from '@hooks/use-sound-settings';
import savesReducer, {
  setThemeOrBackground,
  startGame,
} from '@redux/slices/SavesSlice';
import settingsReducer, { setSoundEnabled } from '@redux/slices/SettingsSlice';
import { renderWithProviders } from '@test/renderWithProviders';
import {
  act,
  fireEvent,
  renderHook,
  screen,
} from '@testing-library/react-native';
import Sound from 'react-native-sound';

import Options from './Options';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const SOUND_TYPES: SoundType[] = ['theme', 'background', 'effect'];

const mockGoBack = jest.fn();
const mockReset = jest.fn();

const SoundMock = Sound as unknown as jest.Mock;

const loadedFiles = () => SoundMock.mock.calls.map(([file]) => file);

const OptionsWithSoundSettings = () => {
  useSoundSettings();
  return <Options />;
};

const renderOptions = (soundType?: SoundType) => {
  const settings = settingsReducer(undefined, { type: '@@INIT' });
  return renderWithProviders(<OptionsWithSoundSettings />, {
    preloadedState: {
      saves: savesReducer(undefined, startGame('corp')),
      settings: soundType
        ? settingsReducer(
            settings,
            setSoundEnabled({ soundType, isEnabled: false }),
          )
        : settings,
    },
  });
};

describe('Options', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    mockReset.mockClear();
    SoundMock.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({
      goBack: mockGoBack,
      getParent: () => ({ reset: mockReset }),
    });
  });

  afterEach(async () => {
    jest.useRealTimers();
    const { result } = await renderHook(() => useSound());
    await act(async () => {
      result.current.stopSound();
      SOUND_TYPES.forEach((soundType) =>
        result.current.setSoundTypeEnabled(soundType, true),
      );
    });
  });

  it('shows the sound switches and the erase option', async () => {
    await renderOptions();

    expect(screen.getByText('Opções')).toBeOnTheScreen();
    expect(screen.getByText('Música')).toBeOnTheScreen();
    expect(screen.getByText('Som ambiente')).toBeOnTheScreen();
    expect(screen.getByText('Efeitos sonoros')).toBeOnTheScreen();
    expect(screen.getByText('Apagar progresso')).toBeOnTheScreen();
  });

  it('shows the saved sound settings', async () => {
    await renderOptions('background');

    expect(screen.getByTestId('Options-theme-toggle')).toBeChecked();
    expect(screen.getByTestId('Options-background-toggle')).not.toBeChecked();
    expect(screen.getByTestId('Options-effect-toggle')).toBeChecked();
  });

  it('turns the music off, saving it and stopping the theme', async () => {
    const { result } = await renderHook(() => useSound());
    await act(async () => {
      result.current.playSound(DEFAULT_THEME);
      await Promise.resolve();
    });
    const playing = SoundMock.mock.instances.at(-1);
    const { store } = await renderOptions();

    await fireEvent.press(screen.getByTestId('Options-theme-toggle'));

    expect(store.getState().settings.soundEnabled.theme).toBe(false);
    expect(screen.getByTestId('Options-theme-toggle')).not.toBeChecked();
    expect(playing.release).toHaveBeenCalled();
  });

  it('turns the music back on when its card is pressed and plays the theme again', async () => {
    const { store } = await renderOptions('theme');
    expect(SoundMock).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByTestId('Options-theme'));
    await act(async () => {
      await Promise.resolve();
    });

    expect(store.getState().settings.soundEnabled.theme).toBe(true);
    expect(loadedFiles()).toEqual([DEFAULT_THEME.soundFile]);
    expect(SoundMock.mock.instances.at(-1).play).toHaveBeenCalled();
  });

  it('asks before erasing the save and keeps it when cancelled', async () => {
    jest.useFakeTimers({ doNotFake: ['queueMicrotask'] });
    const { store } = await renderOptions();

    await fireEvent.press(screen.getByTestId('Options-eraseSave'));
    expect(screen.getByText('Apagar progresso?')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('EraseSaveModal-cancel'));
    await act(async () => {
      jest.runAllTimers();
    });

    expect(screen.queryByText('Apagar progresso?')).not.toBeOnTheScreen();
    expect(store.getState().saves.hasStarted).toBe(true);
    expect(mockReset).not.toHaveBeenCalled();
  });

  it('erases the save, plays the default theme and goes back to Start when confirmed', async () => {
    const { store } = await renderOptions();

    await fireEvent.press(screen.getByTestId('Options-eraseSave'));
    await fireEvent.press(screen.getByTestId('EraseSaveModal-confirm'));

    expect(store.getState().saves.hasStarted).toBe(false);
    expect(loadedFiles()).toEqual([SOUND_FILE_THEMES.theme1]);
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Start' }],
    });
  });

  it('stops the background when the save is erased', async () => {
    const metro = {
      soundType: 'background',
      soundFile: SOUND_FILE_BACKGROUNDS.metro,
    } as const;
    const { result } = await renderHook(() => useSound());
    await act(async () => {
      result.current.playSound(metro);
      await Promise.resolve();
    });
    const ambience = SoundMock.mock.instances.at(-1);
    await renderWithProviders(<Options />, {
      preloadedState: {
        saves: savesReducer(
          savesReducer(undefined, startGame('corp')),
          setThemeOrBackground(metro),
        ),
      },
    });

    await fireEvent.press(screen.getByTestId('Options-eraseSave'));
    await fireEvent.press(screen.getByTestId('EraseSaveModal-confirm'));

    expect(ambience.release).toHaveBeenCalled();
  });

  it('keeps the sound settings when the save is erased', async () => {
    const { store } = await renderOptions('effect');

    await fireEvent.press(screen.getByTestId('Options-eraseSave'));
    await fireEvent.press(screen.getByTestId('EraseSaveModal-confirm'));

    expect(store.getState().settings.soundEnabled.effect).toBe(false);
  });

  it('goes back when closed', async () => {
    await renderOptions();

    await fireEvent.press(screen.getByTestId('CloseButton'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
