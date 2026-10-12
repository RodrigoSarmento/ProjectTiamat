/**
 * @format
 */
import React from 'react';

import {
  DEFAULT_THEME,
  SOUND_FILE_BACKGROUNDS,
  SOUND_FILE_THEMES,
  type SoundType,
  useSound,
} from '@hooks/use-sound';
import { eraseSave, setThemeOrBackground } from '@redux/slices/SavesSlice';
import { setSoundEnabled } from '@redux/slices/SettingsSlice';
import { store } from '@redux/store';
import { act, renderHook } from '@testing-library/react-native';
import Sound from 'react-native-sound';
import ReactTestRenderer from 'react-test-renderer';

import App from '../App';

jest.mock('@navigators/GameStackNavigator', () => {
  const MockReact = require('react');
  const { View: MockView } = require('react-native');
  return {
    __esModule: true,
    default: () => MockReact.createElement(MockView, { testID: 'GameStack' }),
  };
});

jest.mock('@redux/store', () => {
  const { configureStore } = require('@reduxjs/toolkit');
  const saves = require('@redux/slices/SavesSlice').default;
  const settings = require('@redux/slices/SettingsSlice').default;
  return {
    store: configureStore({ reducer: { saves, settings } }),
    persistor: {
      subscribe: () => () => {},
      getState: () => ({ bootstrapped: true }),
    },
  };
});

const SOUND_TYPES: SoundType[] = ['theme', 'background', 'effect'];

const loadedFiles = () =>
  (Sound as unknown as jest.Mock).mock.calls.map(([file]) => file);

let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

const renderApp = async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
};

beforeEach(() => {
  (Sound as unknown as jest.Mock).mockClear();
  store.dispatch(eraseSave());
  SOUND_TYPES.forEach((soundType) =>
    store.dispatch(setSoundEnabled({ soundType, isEnabled: true })),
  );
});

afterEach(async () => {
  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
  renderer = undefined;
  const { result } = await renderHook(() => useSound());
  await act(async () => {
    result.current.stopSound();
    SOUND_TYPES.forEach((soundType) =>
      result.current.setSoundTypeEnabled(soundType, true),
    );
  });
});

test('renders correctly', async () => {
  await renderApp();
});

test('plays the default theme when nothing was saved', async () => {
  await renderApp();

  expect(loadedFiles()).toEqual([DEFAULT_THEME.soundFile]);
});

test('plays the saved theme and background together when the app reopens', async () => {
  store.dispatch(
    setThemeOrBackground({
      soundType: 'theme',
      soundFile: SOUND_FILE_THEMES.theme2,
    }),
  );
  store.dispatch(
    setThemeOrBackground({
      soundType: 'background',
      soundFile: SOUND_FILE_BACKGROUNDS.metro,
    }),
  );

  await renderApp();

  expect(loadedFiles()).toEqual([
    SOUND_FILE_THEMES.theme2,
    SOUND_FILE_BACKGROUNDS.metro,
  ]);
});

test('plays the default theme under a saved background', async () => {
  store.dispatch(
    setThemeOrBackground({
      soundType: 'background',
      soundFile: SOUND_FILE_BACKGROUNDS.metro,
    }),
  );

  await renderApp();

  expect(loadedFiles()).toEqual([
    DEFAULT_THEME.soundFile,
    SOUND_FILE_BACKGROUNDS.metro,
  ]);
});

test('keeps the music off when it was turned off before the app closed', async () => {
  store.dispatch(setSoundEnabled({ soundType: 'theme', isEnabled: false }));

  await renderApp();

  expect(loadedFiles()).toEqual([]);
});
