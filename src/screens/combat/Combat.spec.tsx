import { fireEvent, render, screen } from '@testing-library/react-native';

import Combat from './Combat';

const goBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack }),
}));

describe('Combat', () => {
  beforeEach(() => {
    goBack.mockClear();
  });

  it('renders eight dice and keeps run disabled until three are placed', async () => {
    await render(<Combat />);

    expect(screen.getByTestId('Combat')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-attack-d4')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-attack-d6-a')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-attack-d6-b')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-attack-d8')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-defense-d4')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-defense-d6-a')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-defense-d6-b')).toBeOnTheScreen();
    expect(screen.getByTestId('CombatDie-defense-d8')).toBeOnTheScreen();
    expect(screen.getByTestId('Combat-run')).toBeDisabled();
  });

  it('goes back from the header', async () => {
    await render(<Combat />);

    await fireEvent.press(screen.getByTestId('Combat-back'));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
