import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';

import { useSound } from './useSound';
import { SOUND_EFFECT_FILE, SOUND_FILE_THEMES } from './useSound.constants';
import type { IPlaySoundOptions, IUseSound } from './useSound.types';

type SoundInstance = {
  play: jest.Mock;
  stop: jest.Mock;
  release: jest.Mock;
  setVolume: jest.Mock;
};

const SoundMock = Sound as unknown as jest.Mock & {
  setCategory: jest.Mock;
  MAIN_BUNDLE: string;
};

const lastPlayer = () => SoundMock.mock.instances.at(-1) as SoundInstance;
const lastLoadedFile = () => SoundMock.mock.calls.at(-1)?.[0];

const playLoaded = async (
  playSound: IUseSound['playSound'],
  file: string,
  options?: IPlaySoundOptions,
) => {
  await act(async () => {
    playSound(file, options);
    await Promise.resolve();
  });
};

const finishLastTrack = async (success = true) => {
  await act(async () => {
    lastPlayer().play.mock.calls[0][0](success);
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

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme1);

    expect(SoundMock).toHaveBeenCalledWith(
      'theme_1.mp3',
      'MAIN_BUNDLE',
      expect.any(Function),
    );
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('applies volume when requested', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme2, {
      volume: 0.4,
    });

    expect(lastPlayer().setVolume).toHaveBeenCalledWith(0.4);
  });

  it('plays a file once and releases it when it ends', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_EFFECT_FILE.openCan);
    const player = lastPlayer();
    await finishLastTrack();

    expect(player.release).toHaveBeenCalled();
    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('plays two files at the same time', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme1, {
      loop: true,
    });
    const music = lastPlayer();
    await playLoaded(result.current.playSound, SOUND_EFFECT_FILE.openCan);

    expect(music.stop).not.toHaveBeenCalled();
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('loops through the themes in order', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme1, {
      loop: true,
    });
    await finishLastTrack();
    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme2);

    await finishLastTrack();
    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
  });

  it('picks a different random theme after each one ends', async () => {
    const random = jest.spyOn(Math, 'random').mockReturnValue(0);
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme2, {
      loop: true,
      random: true,
    });
    await finishLastTrack();

    expect(random).toHaveBeenCalled();
    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
    random.mockRestore();
  });

  it('stops the theme loop when a track fails to play', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme1, {
      loop: true,
    });
    await finishLastTrack(false);

    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('only plays the latest request when a file is played twice quickly', async () => {
    const { result } = await renderHook(() => useSound());

    await act(async () => {
      result.current.playSound(SOUND_EFFECT_FILE.openCan);
      result.current.playSound(SOUND_EFFECT_FILE.openCan);
      await Promise.resolve();
    });
    const [first, second] = SoundMock.mock.instances as SoundInstance[];

    expect(first.play).not.toHaveBeenCalled();
    expect(first.release).toHaveBeenCalled();
    expect(second.play).toHaveBeenCalled();
  });

  it('stops the theme loop by the file it started with', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme1, {
      loop: true,
    });
    await finishLastTrack();
    const player = lastPlayer();

    act(() => {
      result.current.stopSound(SOUND_FILE_THEMES.theme1);
    });

    expect(player.stop).toHaveBeenCalled();
    expect(player.release).toHaveBeenCalled();
  });

  it('releases players on unmount', async () => {
    const { result, unmount } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, SOUND_FILE_THEMES.theme1, {
      loop: true,
    });
    const player = lastPlayer();

    unmount();

    expect(player.stop).toHaveBeenCalled();
    expect(player.release).toHaveBeenCalled();
  });
});
