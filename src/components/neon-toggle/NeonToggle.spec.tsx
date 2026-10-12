import { fireEvent, render, screen } from '@testing-library/react-native';

import NeonToggle from './NeonToggle';

describe('NeonToggle', () => {
  it('shows as checked when on', async () => {
    await render(
      <NeonToggle
        value
        onValueChange={jest.fn()}
        accessibilityLabel="Música"
      />,
    );

    expect(screen.getByRole('switch', { name: 'Música' })).toBeChecked();
  });

  it('shows as unchecked when off', async () => {
    await render(
      <NeonToggle
        value={false}
        onValueChange={jest.fn()}
        accessibilityLabel="Música"
      />,
    );

    expect(screen.getByRole('switch', { name: 'Música' })).not.toBeChecked();
  });

  it('asks to turn off when pressed while on', async () => {
    const onValueChange = jest.fn();
    await render(
      <NeonToggle value onValueChange={onValueChange} testID="NeonToggle" />,
    );

    await fireEvent.press(screen.getByTestId('NeonToggle'));

    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('asks to turn on when pressed while off', async () => {
    const onValueChange = jest.fn();
    await render(
      <NeonToggle
        value={false}
        onValueChange={onValueChange}
        testID="NeonToggle"
      />,
    );

    await fireEvent.press(screen.getByTestId('NeonToggle'));

    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('follows a new value from its parent', async () => {
    await render(
      <NeonToggle
        value={false}
        onValueChange={jest.fn()}
        testID="NeonToggle"
      />,
    );

    await screen.rerender(
      <NeonToggle value onValueChange={jest.fn()} testID="NeonToggle" />,
    );

    expect(screen.getByTestId('NeonToggle')).toBeChecked();
  });
});
