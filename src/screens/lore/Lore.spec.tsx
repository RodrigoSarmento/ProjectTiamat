import { useNavigation } from '@react-navigation/native';

import { translate } from '@helper/translate';
import savesReducer, { markLoreRead } from '@redux/slices/SavesSlice';
import { renderWithProviders } from '@test/renderWithProviders';
import { fireEvent, screen, within } from '@testing-library/react-native';

import Lore from './Lore';
import {
  LORE_ENTRIES,
  LORE_TAB_IDLE,
  LORE_TAB_SELECTED,
  loreReadId,
} from './Lore.constants';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockGoBack = jest.fn();

const renderLore = (readIds: string[] = []) => {
  const saves = savesReducer(undefined, { type: '@@INIT' });

  return renderWithProviders(<Lore />, {
    preloadedState: {
      saves: readIds.reduce(
        (state, id) => savesReducer(state, markLoreRead(id)),
        saves,
      ),
    },
  });
};

describe('Lore', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
  });

  it('shows the title and every entry collapsed', async () => {
    await renderLore();

    expect(screen.getByText('Lore')).toBeOnTheScreen();
    LORE_ENTRIES.forEach((id) => {
      expect(screen.getByText(translate(`lore.${id}.title`))).toBeOnTheScreen();
      expect(screen.getByTestId(`Lore-${id}`)).toBeCollapsed();
    });
  });

  it('opens only the pressed entry', async () => {
    const [opened, ...others] = LORE_ENTRIES;
    await renderLore();

    await fireEvent.press(screen.getByTestId(`Lore-${opened}`));

    expect(screen.getByTestId(`Lore-${opened}`)).toBeExpanded();
    expect(
      screen.getByText(translate(`lore.${opened}.description`)),
    ).toBeOnTheScreen();
    others.forEach((id) => {
      expect(screen.getByTestId(`Lore-${id}`)).toBeCollapsed();
    });
  });

  it('marks a lore card as read and drops its new dot', async () => {
    const [opened, ...others] = LORE_ENTRIES;
    const { store } = await renderLore();

    LORE_ENTRIES.forEach((id) => {
      expect(screen.getByTestId(`Lore-${id}-new`)).toBeOnTheScreen();
    });

    await fireEvent.press(screen.getByTestId(`Lore-${opened}`));

    expect(screen.queryByTestId(`Lore-${opened}-new`)).not.toBeOnTheScreen();
    others.forEach((id) => {
      expect(screen.getByTestId(`Lore-${id}-new`)).toBeOnTheScreen();
    });
    expect(store.getState().saves.readLoreIds).toEqual([
      loreReadId('world', opened),
    ]);
  });

  it('keeps a read card without a dot', async () => {
    const [read] = LORE_ENTRIES;
    await renderLore([loreReadId('world', read)]);

    expect(screen.queryByTestId(`Lore-${read}-new`)).not.toBeOnTheScreen();
    LORE_ENTRIES.slice(1).forEach((id) => {
      expect(screen.getByTestId(`Lore-${id}-new`)).toBeOnTheScreen();
    });
  });

  it('opens on Mundo and switches to Personagens', async () => {
    await renderLore();

    expect(
      within(screen.getByTestId('Lore-world')).getByText('Mundo'),
    ).toHaveStyle({ color: LORE_TAB_SELECTED });
    expect(
      within(screen.getByTestId('Lore-characters')).getByText('Personagens'),
    ).toHaveStyle({ color: LORE_TAB_IDLE });
    expect(screen.queryByTestId('Lore-jo-portrait')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('Lore-characters'));

    expect(
      within(screen.getByTestId('Lore-characters')).getByText('Personagens'),
    ).toHaveStyle({ color: LORE_TAB_SELECTED });
    LORE_ENTRIES.forEach((id) => {
      expect(screen.queryByTestId(`Lore-${id}`)).not.toBeOnTheScreen();
    });
    expect(screen.getByText(translate('characters.jo'))).toBeOnTheScreen();
    expect(
      screen.queryByText(translate('lore.characters.jo')),
    ).not.toBeOnTheScreen();
    expect(screen.getByTestId('Lore-jo')).toBeCollapsed();
    expect(screen.getByTestId('Lore-jo-portrait')).toBeOnTheScreen();
    expect(screen.getByTestId('Lore-jo-new')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('Lore-jo'));

    expect(screen.getByTestId('Lore-jo')).toBeExpanded();
    expect(screen.getByText(translate('lore.characters.jo'))).toBeOnTheScreen();
    expect(screen.queryByTestId('Lore-jo-new')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('Lore-world'));

    expect(
      screen.getByText(translate('lore.terceiraGuerra.title')),
    ).toBeOnTheScreen();
    expect(screen.queryByTestId('Lore-jo-portrait')).not.toBeOnTheScreen();
  });

  it('goes back when closed', async () => {
    await renderLore();

    expect(screen.getByTestId('CloseIcon')).toHaveStyle({
      position: 'absolute',
      right: 0,
    });

    await fireEvent.press(screen.getByTestId('CloseIcon'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
