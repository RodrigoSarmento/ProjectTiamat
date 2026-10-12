import { useNavigation } from '@react-navigation/native';

import { fireEvent, render, screen } from '@testing-library/react-native';

import Deck from './Deck';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockGoBack = jest.fn();

describe('Deck', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
  });

  it('shows the title', async () => {
    await render(<Deck />);

    expect(screen.getByText('Baralho')).toBeOnTheScreen();
  });

  it('goes back when closed', async () => {
    await render(<Deck />);

    await fireEvent.press(screen.getByTestId('CloseButton'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
