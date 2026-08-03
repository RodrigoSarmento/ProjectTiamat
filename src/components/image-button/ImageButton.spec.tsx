import React from 'react';

import { render, screen } from '@testing-library/react-native';

import ImageButton from './ImageButton';

describe('ImageButton', () => {
  it('renders the image', async () => {
    await render(
      <ImageButton
        testID="ImageButtonImage"
        source={{ uri: 'https://example.com/icon.png' }}
        onPress={() => {}}
      />,
    );

    expect(screen.getByTestId('ImageButtonImage')).toBeTruthy();
  });

  it('marks the pressable as disabled', async () => {
    await render(
      <ImageButton
        source={{ uri: 'https://example.com/icon.png' }}
        disabled
        onPress={() => {}}
      />,
    );

    expect(screen.getByRole('button').props.accessibilityState?.disabled).toBe(
      true,
    );
  });
});
