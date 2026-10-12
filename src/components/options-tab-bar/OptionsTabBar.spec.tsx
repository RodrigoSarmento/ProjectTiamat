import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { fireEvent, render, screen } from '@testing-library/react-native';

import OptionsTabBar from './OptionsTabBar';

const ROUTES = [
  { key: 'deck-key', name: 'Deck', params: undefined },
  { key: 'lore-key', name: 'Lore', params: undefined },
  { key: 'options-key', name: 'Options', params: { from: 'game' } },
];

const DESCRIPTORS = {
  'deck-key': { options: { tabBarLabel: 'Deck label', title: 'Deck title' } },
  'lore-key': { options: { title: 'Lore title' } },
  'options-key': { options: {} },
};

const mockEmit = jest.fn();
const mockNavigate = jest.fn();

const renderTabBar = (focusedIndex = 0) =>
  render(
    <OptionsTabBar
      {...({
        state: { index: focusedIndex, routes: ROUTES },
        descriptors: DESCRIPTORS,
        navigation: { emit: mockEmit, navigate: mockNavigate },
      } as unknown as BottomTabBarProps)}
    />,
  );

describe('OptionsTabBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEmit.mockReturnValue({ defaultPrevented: false });
  });

  it('labels each tab with its tab label, then its title, then its route name', async () => {
    await renderTabBar();

    expect(screen.getByText('Deck label')).toBeOnTheScreen();
    expect(screen.getByText('Lore title')).toBeOnTheScreen();
    expect(screen.getByText('Options')).toBeOnTheScreen();
  });

  it('marks only the focused tab as selected', async () => {
    await renderTabBar(1);

    expect(screen.getByTestId('OptionsTabBar-Lore')).toBeSelected();
    expect(screen.getByTestId('OptionsTabBar-Deck')).not.toBeSelected();
    expect(screen.getByTestId('OptionsTabBar-Options')).not.toBeSelected();
  });

  it('emits tabPress and navigates to an unfocused tab with its params', async () => {
    await renderTabBar(0);

    await fireEvent.press(screen.getByTestId('OptionsTabBar-Options'));

    expect(mockEmit).toHaveBeenCalledWith({
      type: 'tabPress',
      target: 'options-key',
      canPreventDefault: true,
    });
    expect(mockNavigate).toHaveBeenCalledWith('Options', { from: 'game' });
  });

  it('does not navigate when the focused tab is pressed', async () => {
    await renderTabBar(0);

    await fireEvent.press(screen.getByTestId('OptionsTabBar-Deck'));

    expect(mockEmit).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not navigate when a listener prevents the tab press', async () => {
    mockEmit.mockReturnValue({ defaultPrevented: true });
    await renderTabBar(0);

    await fireEvent.press(screen.getByTestId('OptionsTabBar-Lore'));

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
