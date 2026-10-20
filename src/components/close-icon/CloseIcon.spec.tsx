import { useNavigation } from '@react-navigation/native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import CloseIcon from './CloseIcon';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockGoBack = jest.fn();

describe('CloseIcon', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
  });

  it('sits on the right of its row', async () => {
    await render(<CloseIcon />);

    expect(screen.getByTestId('CloseIcon')).toHaveStyle({
      position: 'absolute',
      right: 0,
    });
  });

  it('goes back when pressed', async () => {
    await render(<CloseIcon />);

    await fireEvent.press(screen.getByTestId('CloseIcon'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('runs its own action instead of going back when given one', async () => {
    const onPress = jest.fn();
    await render(<CloseIcon onPress={onPress} />);

    await fireEvent.press(screen.getByTestId('CloseIcon'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockGoBack).not.toHaveBeenCalled();
  });
});
