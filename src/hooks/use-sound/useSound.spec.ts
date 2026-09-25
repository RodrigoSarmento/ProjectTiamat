import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';

import { useSound } from './useSound';
import { SOUND_FILE } from './useSound.constants';
import type { IPlaySoundOptions } from './useSound.types';

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

const lastPlayer = () => SoundMock.mock.instances.at(-1) as SoundInstance;

const playLoaded = async (
  playSound: (file: string, options?: IPlaySoundOptions) => void,
  file: string,
  options?: IPlaySoundOptions,
) => {
  await act(async () => {
    playSound(file, options);
    await Promise.resolve();
  });
};

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

    await playLoaded(result.current.playSound, SOUND_FILE.theme1);

    expect(SoundMock).toHaveBeenCalledWith(
      'theme_1.mp3',
      'MAIN_BUNDLE',
      expect.any(Function),
    );
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('loops and applies volume when requested', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE.theme2, {
      loop: true,
      volume: 0.4,
    });

    expect(lastPlayer().setNumberOfLoops).toHaveBeenCalledWith(-1);
    expect(lastPlayer().setVolume).toHaveBeenCalledWith(0.4);
  });

  it('stops and releases a playing file', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE.theme1, {
      loop: true,
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

    await playLoaded(result.current.playSound, SOUND_FILE.theme1, {
      loop: true,
    });
    const player = lastPlayer();

    unmount();

    expect(player.stop).toHaveBeenCalled();
    expect(player.release).toHaveBeenCalled();
  });
});
