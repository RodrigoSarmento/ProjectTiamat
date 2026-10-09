/**
 * @format
 */
import React from 'react';

import {
  DEFAULT_THEME,
  SOUND_FILE_BACKGROUNDS,
  useSound,
} from '@hooks/use-sound';
import { eraseSave, setThemeOrBackground } from '@redux/slices/SavesSlice';
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

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@redux/store', () => {
  const { configureStore } = require('@reduxjs/toolkit');
  const saves = require('@redux/slices/SavesSlice').default;
  return {
    store: configureStore({ reducer: { saves } }),
    persistor: {
      subscribe: () => () => {},
      getState: () => ({ bootstrapped: true }),
    },
  };
});

const loadedFiles = () =>
  (Sound as unknown as jest.Mock).mock.calls.map(([file]) => file);

const renderApp = async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
  });
};

beforeEach(() => {
  (Sound as unknown as jest.Mock).mockClear();
  store.dispatch(eraseSave());
});

afterEach(async () => {
  const { result } = await renderHook(() => useSound());
  await act(async () => {
    result.current.stopSound();
  });
});

test('renders correctly', async () => {
  await renderApp();
});

test('plays the default theme when nothing was saved', async () => {
  await renderApp();

  expect(loadedFiles()).toEqual([DEFAULT_THEME.soundFile]);
});

test('plays the saved theme or background when the app reopens', async () => {
  store.dispatch(
    setThemeOrBackground({
      soundType: 'background',
      soundFile: SOUND_FILE_BACKGROUNDS.metro,
    }),
  );

  await renderApp();

  expect(loadedFiles()).toEqual([SOUND_FILE_BACKGROUNDS.metro]);
});
