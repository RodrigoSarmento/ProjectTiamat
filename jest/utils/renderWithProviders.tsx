import { type PropsWithChildren, type ReactElement } from 'react';

import SavesSlice, { type ISaves } from '@redux/slices/SavesSlice';
import { configureStore } from '@reduxjs/toolkit';
import { type RenderOptions, render } from '@testing-library/react-native';
import { Provider } from 'react-redux';

type PreloadedState = {
  saves: ISaves;
};

export const createTestStore = (preloadedState?: PreloadedState) =>
  configureStore({
    reducer: { saves: SavesSlice },
    ...(preloadedState ? { preloadedState } : {}),
  });

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: PreloadedState;
  store?: ReturnType<typeof createTestStore>;
};

export const renderWithProviders = async (
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>{children}</Provider>
  );

  const result = await render(ui, { wrapper, ...renderOptions });

  return { store, ...result };
};
