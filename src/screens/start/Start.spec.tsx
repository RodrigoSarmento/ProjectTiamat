import { useNavigation } from '@react-navigation/native';

import { renderWithProviders } from '@test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';

import Start from './Start';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockNavigate = jest.fn();

describe('Start', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  it('navigates to BackgroundSelect when Start is pressed', async () => {
    const { store } = await renderWithProviders(<Start />);

    await fireEvent.press(screen.getByText('Iniciar'));

    expect(mockNavigate).toHaveBeenCalledWith('BackgroundSelect');
    expect(store.getState().saves.hasStarted).toBe(false);
  });
});
