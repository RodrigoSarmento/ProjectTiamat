import { useNavigation } from '@react-navigation/native';

import { Common } from '@styles';
import { renderWithProviders } from '@test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';

import BackgroundSelect from './BackgroundSelect';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockReset = jest.fn();

const swipeToPage = (page: number) =>
  fireEvent(screen.getByTestId('BackgroundSelect-list'), 'momentumScrollEnd', {
    nativeEvent: { contentOffset: { x: Common.screenWidth * page, y: 0 } },
  });

describe('BackgroundSelect', () => {
  beforeEach(() => {
    mockReset.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ reset: mockReset });
  });

  it('shows a page for each origin', async () => {
    await renderWithProviders(<BackgroundSelect />);

    expect(screen.getByText('Escolha sua origem')).toBeOnTheScreen();
    expect(screen.getByTestId('BackgroundSelect-corp')).toBeOnTheScreen();
    expect(screen.getByTestId('BackgroundSelect-citizen')).toBeOnTheScreen();
    expect(screen.getByTestId('BackgroundSelect-military')).toBeOnTheScreen();
  });

  it('highlights the first dot when the screen opens', async () => {
    await renderWithProviders(<BackgroundSelect />);

    expect(screen.getByTestId('BackgroundSelect-dot-corp')).toHaveStyle({
      width: 24,
    });
    expect(screen.getByTestId('BackgroundSelect-dot-citizen')).toHaveStyle({
      width: 8,
    });
  });

  it('highlights a dot when it is pressed', async () => {
    await renderWithProviders(<BackgroundSelect />);

    await fireEvent.press(screen.getByTestId('BackgroundSelect-dot-citizen'));

    expect(screen.getByTestId('BackgroundSelect-dot-citizen')).toHaveStyle({
      width: 24,
    });
    expect(screen.getByTestId('BackgroundSelect-dot-corp')).toHaveStyle({
      width: 8,
    });
  });

  it('highlights the dot of the page swiped to', async () => {
    await renderWithProviders(<BackgroundSelect />);

    await swipeToPage(2);

    expect(screen.getByTestId('BackgroundSelect-dot-military')).toHaveStyle({
      width: 24,
    });
    expect(screen.getByTestId('BackgroundSelect-dot-corp')).toHaveStyle({
      width: 8,
    });
  });

  it('starts the game with the origin on screen when chosen', async () => {
    const { store } = await renderWithProviders(<BackgroundSelect />);

    await swipeToPage(1);
    await fireEvent.press(screen.getByText('Escolher'));

    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Game' }],
    });
    expect(store.getState().saves.hasStarted).toBe(true);
    expect(store.getState().saves.save.origin).toBe('citizen');
  });
});
