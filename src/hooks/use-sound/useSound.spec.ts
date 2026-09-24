import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';

import { SOUND_FILE } from './useSound.constants';
import { useSound } from './useSound';

type SoundInstance = {
  play: jest.Mock;
  stop: jest.Mock;
  release: jest.Mock;
  setVolume: jest.Mock;
  setNumberOfLoops: jest.Mock;
};

const SoundMock = Sound as unknown as jest.Mock & {
  setCategory: jest.Mock;
  MAIN_BUNDLE: string;
};

jest.mock('react-native-sound', () => {
  const MockSound = jest.fn(
    (
      _file: string,
      _bundle: string,
      callback?: (error: Error | undefined) => void,
    ) => {
      const instance: SoundInstance = {
        play: jest.fn(),
        stop: jest.fn(),
        release: jest.fn(),
        setVolume: jest.fn(),
        setNumberOfLoops: jest.fn(),
      };
      callback?.(undefined);
      return instance;
    },
  );

  (MockSound as unknown as { setCategory: jest.Mock }).setCategory = jest.fn();
  (MockSound as unknown as { MAIN_BUNDLE: string }).MAIN_BUNDLE = 'MAIN_BUNDLE';

  return MockSound;
});

const lastPlayer = () =>
  SoundMock.mock.results.at(-1)?.value as SoundInstance;

describe('useSound', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables playback on mount', async () => {
    await renderHook(() => useSound());

    expect(SoundMock.setCategory).toHaveBeenCalledWith('Playback');
  });

  it('loads a bundled file and plays it', async () => {
    const { result } = await renderHook(() => useSound());

    act(() => {
      result.current.playSound(SOUND_FILE.theme1);
    });

    expect(SoundMock).toHaveBeenCalledWith(
      'theme_1.mp3',
      'MAIN_BUNDLE',
      expect.any(Function),
    );
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('loops and applies volume when requested', async () => {
    const { result } = await renderHook(() => useSound());

    act(() => {
      result.current.playSound(SOUND_FILE.theme2, { loop: true, volume: 0.4 });
    });

    expect(lastPlayer().setNumberOfLoops).toHaveBeenCalledWith(-1);
    expect(lastPlayer().setVolume).toHaveBeenCalledWith(0.4);
  });

  it('stops and releases a playing file', async () => {
    const { result } = await renderHook(() => useSound());

    act(() => {
      result.current.playSound(SOUND_FILE.theme1, { loop: true });
    });
    const player = lastPlayer();

    act(() => {
      result.current.stopSound(SOUND_FILE.theme1);
    });

    expect(player.stop).toHaveBeenCalled();
    expect(player.release).toHaveBeenCalled();
  });

  it('releases players on unmount', async () => {
    const { result, unmount } = await renderHook(() => useSound());

    act(() => {
      result.current.playSound(SOUND_FILE.theme1, { loop: true });
    });
    const player = lastPlayer();

    unmount();

    expect(player.stop).toHaveBeenCalled();
    expect(player.release).toHaveBeenCalled();
  });
});
