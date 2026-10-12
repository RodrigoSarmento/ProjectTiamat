import { useNavigation } from '@react-navigation/native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import CloseButton from './CloseButton';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockGoBack = jest.fn();

describe('CloseButton', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
  });

  it('shows the close label', async () => {
    await render(<CloseButton />);

    expect(screen.getByText('Fechar')).toBeOnTheScreen();
  });

  it('goes back when pressed', async () => {
    await render(<CloseButton />);

    await fireEvent.press(screen.getByTestId('CloseButton'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('runs its own action instead of going back when given one', async () => {
    const onPress = jest.fn();
    await render(<CloseButton onPress={onPress} />);

    await fireEvent.press(screen.getByTestId('CloseButton'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
