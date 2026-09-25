import { useNavigation } from '@react-navigation/native';

import { renderWithProviders } from '@test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';

import Start from './Start';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockReplace = jest.fn();

describe('Start', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('replaces to Game when Start is pressed', async () => {
    await renderWithProviders(<Start />);

    await fireEvent.press(screen.getByText('Iniciar'));

    expect(mockReplace).toHaveBeenCalledWith('Game');
  });
});
