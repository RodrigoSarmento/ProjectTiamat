import { useNavigation } from '@react-navigation/native';

import { renderWithProviders } from '@test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';

import CharacterCreation from './CharacterCreation';
import { INITIAL_ATTRIBUTES } from './CharacterCreation.constants';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockReplace = jest.fn();

const increase = async (shortLabel: string, times: number) => {
  for (let index = 0; index < times; index += 1) {
    await fireEvent.press(screen.getByTestId(`StatBar-${shortLabel}-increase`));
  }
};

describe('CharacterCreation', () => {
  beforeEach(() => {
    mockReplace.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ replace: mockReplace });
  });

  it('saves spent points across stats and replaces to Game', async () => {
    const { store } = await renderWithProviders(<CharacterCreation />);

    await fireEvent.press(screen.getByText('Inicializar'));
    expect(mockReplace).not.toHaveBeenCalled();
    expect(store.getState().saves.save).toBeUndefined();

    await increase('STR', 4);
    await increase('DEX', 3);
    await increase('CON', 3);

    expect(screen.getByText('Pontos restantes:   0')).toBeOnTheScreen();

    await fireEvent.press(screen.getByText('Inicializar'));

    expect(store.getState().saves.save?.status).toEqual({
      ...INITIAL_ATTRIBUTES,
      strength: 4,
      dexterity: 3,
      constitution: 3,
    });
    expect(mockReplace).toHaveBeenCalledWith('Game');
  });
});
