import { StyleSheet } from 'react-native';

import { render, screen } from '@testing-library/react-native';

import NineSliceImage from './NineSliceImage';

const styles = StyleSheet.create({
  size: {
    width: 200,
    height: 100,
  },
});

describe('NineSliceImage', () => {
  it('renders', async () => {
    await render(
      <NineSliceImage
        testID="NineSlice"
        source={{ uri: 'https://example.com/panel.png' }}
        capInsets={{ top: 8, left: 8, bottom: 8, right: 8 }}
        sourceSize={{ width: 64, height: 64 }}
        style={styles.size}
      />,
    );

    expect(screen.getByTestId('NineSlice')).toBeOnTheScreen();
  });
});
