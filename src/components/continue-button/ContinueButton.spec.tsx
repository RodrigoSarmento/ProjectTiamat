import { fireEvent, render, screen } from '@testing-library/react-native';

import ContinueButton from './ContinueButton';
import { CONTINUE_LABEL } from './ContinueButton.constants';

const mockOnPress = jest.fn();

describe('ContinueButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the continue label', async () => {
    await render(<ContinueButton onPress={mockOnPress} />);

    expect(screen.getByText(CONTINUE_LABEL)).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    await render(<ContinueButton onPress={mockOnPress} />);

    await fireEvent.press(screen.getByTestId('ContinueButton'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
