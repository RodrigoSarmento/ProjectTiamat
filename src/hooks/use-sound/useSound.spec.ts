import { AppState, type AppStateStatus } from 'react-native';

import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';

import { useSound } from './useSound';
import {
  BACKGROUND_END_VOLUME,
  BACKGROUND_FADE_DELAY_MS,
  BACKGROUND_FADE_DURATION_MS,
  BACKGROUND_FADE_STEP_MS,
  BACKGROUND_START_VOLUME,
  EFFECT_VOLUME,
  SOUND_EFFECT_FILE,
  SOUND_FILE_BACKGROUNDS,
  SOUND_FILE_THEMES,
  THEME_VOLUME,
} from './useSound.constants';
import type {
  IPlaySoundOptions,
  ISound,
  IUseSound,
  SoundType,
} from './useSound.types';

const SOUND_TYPES: SoundType[] = ['theme', 'background', 'effect'];

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

const appStateSubscription = (index: number) =>
  (AppState.addEventListener as jest.Mock).mock.results[index].value as {
    remove: jest.Mock;
  };

const emitAppState = (state: AppStateStatus) => {
  (AppState.addEventListener as jest.Mock).mock.calls.forEach(
    ([, listener], index) => {
      if (appStateSubscription(index).remove.mock.calls.length === 0) {
        (listener as (next: AppStateStatus) => void)(state);
      }
    },
  );
};

const changeAppState = async (state: AppStateStatus) => {
  await act(async () => {
    emitAppState(state);
  });
};

const toggleSoundType = async (
  setSoundTypeEnabled: IUseSound['setSoundTypeEnabled'],
  soundType: SoundType,
  isEnabled: boolean,
) => {
  await act(async () => {
    setSoundTypeEnabled(soundType, isEnabled);
    await Promise.resolve();
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
      SOUND_TYPES.forEach((soundType) =>
        result.current.setSoundTypeEnabled(soundType, true),
      );
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

  it('loops a theme at the theme volume', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));

    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
    expect(lastPlayer().setVolume).toHaveBeenCalledWith(THEME_VOLUME);
    expect(lastPlayer().setNumberOfLoops).toHaveBeenCalledWith(-1);
  });

  it('loops a background starting at the louder background volume', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );

    expect(lastPlayer().setVolume).toHaveBeenCalledWith(
      BACKGROUND_START_VOLUME,
    );
    expect(lastPlayer().setNumberOfLoops).toHaveBeenCalledWith(-1);
  });

  it('plays a background alongside the theme, even from another screen', async () => {
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

    expect(playing.stop).not.toHaveBeenCalled();
    expect(playing.release).not.toHaveBeenCalled();
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('keeps the background playing when a new theme starts', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));

    expect(ambience.stop).not.toHaveBeenCalled();
    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
  });

  it('replaces a background with another background', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const metro = lastPlayer();
    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.crowdedNoise),
    );

    expect(metro.release).toHaveBeenCalled();
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('replaces a theme with another theme', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const first = lastPlayer();
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme2));

    expect(first.release).toHaveBeenCalled();
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  describe('background fade', () => {
    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['queueMicrotask'] });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const advanceTime = async (ms: number) => {
      await act(async () => {
        jest.advanceTimersByTime(ms);
      });
    };

    const volumes = (player: SoundInstance) =>
      player.setVolume.mock.calls.map(([volume]) => volume as number);

    it('holds the background loud, then fades it step by step to the end volume', async () => {
      const fadeSteps = BACKGROUND_FADE_DURATION_MS / BACKGROUND_FADE_STEP_MS;
      const halfway = fadeSteps / 2;
      const fadedVolume = (step: number) =>
        BACKGROUND_START_VOLUME -
        ((BACKGROUND_START_VOLUME - BACKGROUND_END_VOLUME) * step) / fadeSteps;
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.metro),
      );
      const ambience = lastPlayer();

      await advanceTime(BACKGROUND_FADE_DELAY_MS);
      expect(volumes(ambience)).toEqual([BACKGROUND_START_VOLUME]);

      await advanceTime(BACKGROUND_FADE_STEP_MS);
      expect(volumes(ambience).at(-1)).toBeCloseTo(fadedVolume(1));

      await advanceTime(BACKGROUND_FADE_STEP_MS * (halfway - 1));
      expect(volumes(ambience).at(-1)).toBeCloseTo(fadedVolume(halfway));

      await advanceTime(BACKGROUND_FADE_STEP_MS * halfway);
      expect(volumes(ambience).at(-1)).toBe(BACKGROUND_END_VOLUME);
      expect(volumes(ambience)).toHaveLength(fadeSteps + 1);

      await advanceTime(BACKGROUND_FADE_DURATION_MS * 2);
      expect(volumes(ambience)).toHaveLength(fadeSteps + 1);
    });

    it('does not fade the theme', async () => {
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        theme(SOUND_FILE_THEMES.theme1),
      );
      await advanceTime(60_000);

      expect(volumes(lastPlayer())).toEqual([THEME_VOLUME]);
    });

    it('stops fading a background once another background replaces it', async () => {
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.metro),
      );
      const metro = lastPlayer();
      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.crowdedNoise),
      );
      await advanceTime(60_000);

      expect(volumes(metro)).toEqual([BACKGROUND_START_VOLUME]);
      expect(volumes(lastPlayer()).at(-1)).toBe(BACKGROUND_END_VOLUME);
    });

    it('starts the new background loud again', async () => {
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.metro),
      );
      await advanceTime(60_000);
      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.crowdedNoise),
      );

      expect(volumes(lastPlayer())).toEqual([BACKGROUND_START_VOLUME]);
    });

    it('stops fading a background that was stopped', async () => {
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.metro),
      );
      const metro = lastPlayer();
      await act(async () => {
        result.current.stopSound(SOUND_FILE_BACKGROUNDS.metro);
      });
      await advanceTime(60_000);

      expect(volumes(metro)).toEqual([BACKGROUND_START_VOLUME]);
    });

    it('stops fading the background when ambience is turned off mid-fade', async () => {
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.metro),
      );
      const metro = lastPlayer();
      await advanceTime(BACKGROUND_FADE_DELAY_MS + BACKGROUND_FADE_STEP_MS);
      const fadedSoFar = volumes(metro).length;

      await toggleSoundType(
        result.current.setSoundTypeEnabled,
        'background',
        false,
      );
      await advanceTime(BACKGROUND_FADE_DURATION_MS);

      expect(metro.release).toHaveBeenCalled();
      expect(volumes(metro)).toHaveLength(fadedSoFar);
    });

    it('plays a background at a requested volume without fading', async () => {
      const { result } = await renderHook(() => useSound());

      await playLoaded(
        result.current.playSound,
        background(SOUND_FILE_BACKGROUNDS.metro),
        { volume: 0.3 },
      );
      await advanceTime(60_000);

      expect(volumes(lastPlayer())).toEqual([0.3]);
    });
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

  it('only plays the latest background when one replaces another while loading', async () => {
    const { result } = await renderHook(() => useSound());

    await act(async () => {
      result.current.playSound(background(SOUND_FILE_BACKGROUNDS.metro));
      result.current.playSound(background(SOUND_FILE_BACKGROUNDS.crowdedNoise));
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

  it('pauses the theme and background when the app goes to the background and resumes them on return', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();

    await changeAppState('background');
    expect(playing.pause).toHaveBeenCalledTimes(1);
    expect(ambience.pause).toHaveBeenCalledTimes(1);

    await changeAppState('active');
    expect(playing.play).toHaveBeenCalledTimes(2);
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

  it('removes its app state listener on unmount', async () => {
    const { result, unmount } = await renderHook(() => useSound());
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    const subscription = appStateSubscription(
      (AppState.addEventListener as jest.Mock).mock.calls.length - 1,
    );
    expect(subscription.remove).not.toHaveBeenCalled();

    await unmount();
    expect(subscription.remove).toHaveBeenCalledTimes(1);

    await changeAppState('background');
    expect(playing.pause).not.toHaveBeenCalled();
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

  it('stops the theme when music is turned off and does not play another one', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', false);

    expect(playing.stop).toHaveBeenCalled();
    expect(playing.release).toHaveBeenCalled();

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme2));
    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the background playing when music is turned off', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();
    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', false);

    expect(ambience.stop).not.toHaveBeenCalled();
  });

  it('stops the background when ambience is turned off, but still plays the theme', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    const ambience = lastPlayer();
    await toggleSoundType(
      result.current.setSoundTypeEnabled,
      'background',
      false,
    );

    expect(ambience.release).toHaveBeenCalled();

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme1);
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('keeps the theme playing when the story asks for a background while ambience is off', async () => {
    const { result } = await renderHook(() => useSound());

    await toggleSoundType(
      result.current.setSoundTypeEnabled,
      'background',
      false,
    );
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );

    expect(playing.stop).not.toHaveBeenCalled();
    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('plays the latest requested theme when music is turned back on', async () => {
    const { result } = await renderHook(() => useSound());

    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', false);
    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme2));
    expect(SoundMock).not.toHaveBeenCalled();

    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', true);

    expect(lastLoadedFile()).toBe(SOUND_FILE_THEMES.theme2);
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('does not bring back a theme that was stopped when music is turned back on', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    await act(async () => {
      result.current.stopSound(SOUND_FILE_THEMES.theme1);
    });
    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', false);
    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', true);

    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('does not start the background when music is turned back on', async () => {
    const { result } = await renderHook(() => useSound());

    await toggleSoundType(
      result.current.setSoundTypeEnabled,
      'background',
      false,
    );
    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.metro),
    );
    await toggleSoundType(result.current.setSoundTypeEnabled, 'theme', true);

    expect(SoundMock).not.toHaveBeenCalled();
  });

  it('plays the latest requested background when ambience is turned back on', async () => {
    const { result } = await renderHook(() => useSound());

    await toggleSoundType(
      result.current.setSoundTypeEnabled,
      'background',
      false,
    );
    await playLoaded(
      result.current.playSound,
      background(SOUND_FILE_BACKGROUNDS.corporate),
    );
    expect(SoundMock).not.toHaveBeenCalled();

    await toggleSoundType(
      result.current.setSoundTypeEnabled,
      'background',
      true,
    );

    expect(lastLoadedFile()).toBe(SOUND_FILE_BACKGROUNDS.corporate);
    expect(lastPlayer().play).toHaveBeenCalled();
  });

  it('releases a theme that is still loading when music is turned off, without playing it', async () => {
    const { result } = await renderHook(() => useSound());

    await act(async () => {
      result.current.playSound(theme(SOUND_FILE_THEMES.theme1));
      result.current.setSoundTypeEnabled('theme', false);
      await Promise.resolve();
    });

    expect(lastPlayer().release).toHaveBeenCalled();
    expect(lastPlayer().play).not.toHaveBeenCalled();
  });

  it('stops effects on every screen when sound effects are turned off and plays no new ones', async () => {
    const game = await renderHook(() => useSound());
    const options = await renderHook(() => useSound());

    await playLoaded(
      game.result.current.playSound,
      effect(SOUND_EFFECT_FILE.alarm),
    );
    const alarm = lastPlayer();
    await toggleSoundType(
      options.result.current.setSoundTypeEnabled,
      'effect',
      false,
    );

    expect(alarm.stop).toHaveBeenCalled();
    expect(alarm.release).toHaveBeenCalled();

    await playLoaded(
      game.result.current.playSound,
      effect(SOUND_EFFECT_FILE.punch),
    );
    expect(SoundMock).toHaveBeenCalledTimes(1);
  });

  it('keeps the theme playing when sound effects are turned off', async () => {
    const { result } = await renderHook(() => useSound());

    await playLoaded(result.current.playSound, theme(SOUND_FILE_THEMES.theme1));
    const playing = lastPlayer();
    await toggleSoundType(result.current.setSoundTypeEnabled, 'effect', false);

    expect(playing.stop).not.toHaveBeenCalled();
  });
});
