/**
 * @format
 */
import React from 'react';

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

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
