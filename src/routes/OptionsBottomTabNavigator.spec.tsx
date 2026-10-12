import { NavigationContainer } from '@react-navigation/native';

import savesReducer, { startGame } from '@redux/slices/SavesSlice';
import { renderWithProviders } from '@test';
import { fireEvent, screen } from '@testing-library/react-native';

import OptionsBottomTabNavigator from './OptionsBottomTabNavigator';

const renderNavigator = () =>
  renderWithProviders(
    <NavigationContainer>
      <OptionsBottomTabNavigator />
    </NavigationContainer>,
    { preloadedState: { saves: savesReducer(undefined, startGame('corp')) } },
  );

describe('OptionsBottomTabNavigator', () => {
  it('shows a tab for each screen and starts on the deck', async () => {
    await renderNavigator();

    expect(screen.getByTestId('OptionsTabBar-Deck')).toBeSelected();
    expect(screen.getByTestId('OptionsTabBar-Lore')).not.toBeSelected();
    expect(screen.getByTestId('OptionsTabBar-Options')).not.toBeSelected();
    expect(screen.getAllByText('Baralho')).toHaveLength(2);
  });

  it('opens the lore from its tab', async () => {
    await renderNavigator();

    await fireEvent.press(screen.getByTestId('OptionsTabBar-Lore'));

    expect(screen.getByTestId('OptionsTabBar-Lore')).toBeSelected();
    expect(screen.getByTestId('Lore-terceiraGuerra')).toBeOnTheScreen();
  });

  it('opens the options from its tab', async () => {
    await renderNavigator();

    await fireEvent.press(screen.getByTestId('OptionsTabBar-Options'));

    expect(screen.getByTestId('OptionsTabBar-Options')).toBeSelected();
    expect(screen.getByTestId('Options-eraseSave')).toBeOnTheScreen();
  });
});
