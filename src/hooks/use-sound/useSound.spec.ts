import { AppState, type AppStateStatus } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';

import { useSound } from './useSound';
import {
  EFFECT_VOLUME,
  SOUND_EFFECT_FILE,
  SOUND_FILE_BACKGROUNDS,
  SOUND_FILE_THEMES,
  THEME_BACKGROUND_VOLUME,
} from './useSound.constants';
import type { IPlaySoundOptions, ISound, IUseSound } from './useSound.types';

type SoundInstance = {
  play: jest.Mock;
  pause: jest.Mock;
  stop: jest.Mock;
  release: jest.Mock;
  setVolume: jest.Mock;
  setNumberOfLoops: jest.Mock;
};

const SoundMock = Sound as unknown as jest.Mock & {
  setCategory: jest.Mock;
  MAIN_BUNDLE: string;
};

const theme = (soundFile: string): ISound => ({
  soundType: 'theme',
  soundFile,
});
const background = (soundFile: string): ISound => ({
  soundType: 'background',
  soundFile,
});
const effect = (soundFile: string): ISound => ({
  soundType: 'effect',
  soundFile,
});

const lastPlayer = () => SoundMock.mock.instances.at(-1) as SoundInstance;
const lastLoadedFile = () => SoundMock.mock.calls.at(-1)?.[0];

const playLoaded = async (
  playSound: IUseSound['playSound'],
  sound: ISound,
  options?: IPlaySoundOptions,
) => {
  await act(async () => {
    playSound(sound, options);
    await Promise.resolve();
  });
};

const finishLastTrack = async (success = true) => {
  await act(async () => {
    lastPlayer().play.mock.calls[0][0](success);
    await Promise.resolve();
  });
};

const failNextLoad = () => {
  SoundMock.mockImplementationOnce(function (
    this: SoundInstance,
    _file: string,
    _bundle: string,
    callback: (error?: Error) => void,
  ) {
    this.play = jest.fn();
    this.pause = jest.fn();
    this.stop = jest.fn();
    this.release = jest.fn();
    this.setVolume = jest.fn();
    this.setNumberOfLoops = jest.fn();
    queueMicrotask(() => callback(new Error('missing file')));
  });
};

const emitAppState = (state: AppStateStatus) => {
  (AppState.addEventListener as jest.Mock).mock.calls.forEach(([, listener]) =>
    (listener as (next: AppStateStatus) => void)(state),
  );
};

const changeAppState = async (state: AppStateStatus) => {
  await act(async () => {
    emitAppState(state);
  });
};

describe('useSound', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    const { result } = await renderHook(() => useSound());
    await act(async () => {
      result.current.stopSound();
    });
  });

  it('enables playback on mount', async () => {
    await renderHook(() => useSound());

    expect(SoundMock.setCategory).toHaveBeenCalledWith('Playback');
  });

  it('plays an effect once at its own volume and releases it', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      effect(SOUND_EFFECT_FILE.openCan),
    );
    const player = lastPlayer();
    await finishLastTrack();

    expect(SoundMock).toHaveBeenCalledWith(
      SOUND_EFFECT_FILE.openCan,
      'MAIN_BUNDLE',
      expect.any(Function),
    );
    expect(player.setVolume).toHaveBeenCalledWith(EFFECT_VOLUME);
    expect(player.release).toHaveBeenCalled();
    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('applies volume to an effect when requested', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      effect(SOUND_EFFECT_FILE.openCan),
      { volume: 0.4 },
    );

    expect(lastPlayer().setVolume).toHaveBeenCalledWith(0.4);
  });

  it('loops a theme at the theme/background volume', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));

    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
    expect(lastPlayer().setVolume).toHaveBeenCalledWith(
      THEME_BACKGROUND_VOLUME,
    );
    expect(lastPlayer().setNumberOfLoops).toHaveBeenCalledWith(-1);
  });

  it('loops a background at the theme/background volume', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );

    expect(lastPlayer().setVolume).toHaveBeenCalledWith(
      THEME_BACKGROUND_VOLUME,
    );
    expect(lastPlayer().setNumberOfLoops).toHaveBeenCalledWith(-1);
  });

  it('replaces the theme with a background, even from another screen', async () => {
    const app = await renderHook(() => useSound());
    const game = await renderHook(() => useSound());

    await playLoaded(
      app.result.current.playSound,
      theme(SOUND_FILE_THEMES.theme1),
    );
    const playing = lastPlayer();
    await playLoaded(
      game.result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );

    expect(playing.stop).toHaveBeenCalled();
    expect(playing.release).toHaveBeenCalled();
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('replaces a background with a theme', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));

    expect(ambience.release).toHaveBeenCalled();
    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
  });

  it('keeps a theme or background going when it is requested again', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();
    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );

    expect(ambience.stop).not.toHaveBeenCalled();
    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('plays an effect on top of the theme', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    await playLoaded(
      result.current.playSound,
      effect(SOUND_EFFECT_FILE.openCan),
    );

    expect(playing.stop).not.toHaveBeenCalled();
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('lets a theme be requested again after it fails to play', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    await finishLastTrack(false);
    expect(SoundMock).toHaveBeenCalledTimes(1);

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    expect(SoundMock).toHaveBeenCalledTimes(2);
  });

  it('only plays the latest request when an effect is played twice quickly', async () => {
    const { result } = await renderHook(() => useSound());

    await act(async () => {
      result.current.playSound(effect(SOUND_EFFECT_FILE.openCan));
      result.current.playSound(effect(SOUND_EFFECT_FILE.openCan));
      await Promise.resolve();
    });
    const [first, second] = SoundMock.mock.instances as SoundInstance[];

    expect(first.play).not.toHaveBeenCalled();
    expect(first.release).toHaveBeenCalled();
    expect(second.play).toHaveBeenCalled();
  });

  it('stops a theme by its file', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const player = lastPlayer();

    await act(async () => {
      result.current.stopSound(SOUND_FILE_THEMES.theme1);
    });

    expect(player.stop).toHaveBeenCalled();
    expect(player.release).toHaveBeenCalled();
  });

  it('only plays the latest theme or background when one replaces another while loading', async () => {
    const { result } = await renderHook(() => useSound());

    await act(async () => {
      result.current.playSound(theme(SOUND_FILE_THEMES.theme1));
      result.current.playSound(background(SOUND_FILE_BACKGROUNDS.metro));
      await Promise.resolve();
    });
    const [replaced, latest] = SoundMock.mock.instances as SoundInstance[];

    expect(replaced.play).not.toHaveBeenCalled();
    expect(replaced.release).toHaveBeenCalled();
    expect(latest.play).toHaveBeenCalled();
  });

  it('lets a theme be requested again after it fails to load', async () => {
    const { result } = await renderHook(() => useSound());

    failNextLoad();
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const failed = lastPlayer();

    expect(failed.play).not.toHaveBeenCalled();
    expect(failed.release).toHaveBeenCalled();

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    expect(SoundMock).toHaveBeenCalledTimes(2);
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('pauses the theme or background when the app goes to the background and resumes it on return', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();

    await changeAppState('background');
    expect(ambience.pause).toHaveBeenCalledTimes(1);

    await changeAppState('active');
    expect(ambience.play).toHaveBeenCalledTimes(2);
    expect(ambience.release).not.toHaveBeenCalled();
  });

  it('pauses and resumes once even with several screens using sound', async () => {
    const app = await renderHook(() => useSound());
    await renderHook(() => useSound());

    await playLoaded(
      app.result.current.playSound,
      theme(SOUND_FILE_THEMES.theme1),
    );
    const playing = lastPlayer();

    await changeAppState('background');
    await changeAppState('active');

    expect(playing.pause).toHaveBeenCalledTimes(1);
    expect(playing.play).toHaveBeenCalledTimes(2);
  });

  it('does not restart the theme when the app becomes active without having been backgrounded', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    await changeAppState('active');

    expect(lastPlayer().play).toHaveBeenCalledTimes(1);
  });

  it('waits for the app to return before playing a theme that finished loading in the background', async () => {
    const { result } = await renderHook(() => useSound());

    await act(async () => {
      result.current.playSound(theme(SOUND_FILE_THEMES.theme1));
      emitAppState('background');
      await Promise.resolve();
    });
    const player = lastPlayer();

    expect(player.play).not.toHaveBeenCalled();
    expect(player.pause).not.toHaveBeenCalled();

    await changeAppState('active');
    expect(player.play).toHaveBeenCalledTimes(1);
  });

  it('releases effects on unmount but keeps the theme playing', async () => {
    const { result, unmount } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    await playLoaded(
      result.current.playSound,
      effect(SOUND_EFFECT_FILE.openCan),
    );
    const can = lastPlayer();

    await unmount();

    expect(can.release).toHaveBeenCalled();
    expect(playing.stop).not.toHaveBeenCalled();
  });
});
