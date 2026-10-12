import { useNavigation } from '@react-navigation/native';

import { translate } from '@helper/translate';
import { fireEvent, render, screen } from '@testing-library/react-native';

import Lore from './Lore';
import { LORE_ENTRIES } from './Lore.constants';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

const mockGoBack = jest.fn();

describe('Lore', () => {
  beforeEach(() => {
    mockGoBack.mockClear();
    (useNavigation as jest.Mock).mockReturnValue({ goBack: mockGoBack });
  });

  it('shows the title and every entry collapsed', async () => {
    await render(<Lore />);

    expect(screen.getByText('Lore')).toBeOnTheScreen();
    LORE_ENTRIES.forEach((id) => {
      expect(screen.getByText(translate(`lore.${id}.title`))).toBeOnTheScreen();
      expect(screen.getByTestId(`Lore-${id}`)).toBeCollapsed();
    });
  });

  it('opens only the pressed entry', async () => {
    const [opened, ...others] = LORE_ENTRIES;
    await render(<Lore />);

    await fireEvent.press(screen.getByTestId(`Lore-${opened}`));

    expect(screen.getByTestId(`Lore-${opened}`)).toBeExpanded();
    expect(
      screen.getByText(translate(`lore.${opened}.description`)),
    ).toBeOnTheScreen();
    others.forEach((id) => {
      expect(screen.getByTestId(`Lore-${id}`)).toBeCollapsed();
    });
  });

  it('goes back when closed', async () => {
    await render(<Lore />);

    await fireEvent.press(screen.getByTestId('CloseButton'));

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
