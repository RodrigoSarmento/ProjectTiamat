import { fireEvent, render, screen } from '@testing-library/react-native';

import TagButton from './TagButton';
import {
  TAG_BUTTON_HEIGHT,
  TAG_BUTTON_SLANT_WIDTH,
  TAG_BUTTON_STROKE_WIDTH,
} from './TagButton.constants';

describe('TagButton', () => {
  it('shows its label', async () => {
    await render(<TagButton label="Mundo" onPress={jest.fn()} />);

    expect(screen.getByText('Mundo')).toBeOnTheScreen();
  });

  it('runs its action when pressed', async () => {
    const onPress = jest.fn();
    await render(<TagButton label="Mundo" onPress={onPress} />);

    await fireEvent.press(screen.getByTestId('TagButton'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('draws the slanted plate from its measured width', async () => {
    const width = 120;
    await render(<TagButton label="Mundo" onPress={jest.fn()} />);

    await fireEvent(screen.getByTestId('TagButton'), 'layout', {
      nativeEvent: { layout: { width, height: TAG_BUTTON_HEIGHT, x: 0, y: 0 } },
    });

    const inset = TAG_BUTTON_STROKE_WIDTH / 2;
    const bottom = TAG_BUTTON_HEIGHT - inset;
    const points = [
      [inset, inset],
      [width - TAG_BUTTON_SLANT_WIDTH, inset],
      [width - inset, bottom],
      [inset, bottom],
    ];
    expect(screen.getByTestId('TagButton-plate').props.d).toBe(
      `M${points.map(([x, y]) => `${x} ${y}`).join(' ')}z`,
    );
  });
});
