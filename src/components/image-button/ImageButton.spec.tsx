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
});
