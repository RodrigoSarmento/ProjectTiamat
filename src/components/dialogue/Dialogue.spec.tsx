import { fireEvent, render, screen } from '@testing-library/react-native';

import Dialogue from './Dialogue';
import { CONTINUE_LABEL } from './Dialogue.constants';
import type { IDialogue } from './Dialogue.types';

const mockOnPress = jest.fn();

const defaultProps: IDialogue = {
  name: 'Shop owner',
  text: 'You look lost, paladin.',
  portrait: { uri: 'https://example.com/portrait.png' },
  onPress: mockOnPress,
};

const renderDialogue = (props: Partial<IDialogue> = {}) =>
  render(<Dialogue {...defaultProps} {...props} />);

describe('Dialogue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the speaker name and line', async () => {
    await renderDialogue();

    expect(screen.getByText('Shop owner')).toBeOnTheScreen();
    expect(screen.getByText('You look lost, paladin.')).toBeOnTheScreen();
    expect(screen.getByText(CONTINUE_LABEL)).toBeOnTheScreen();
  });

  it('hides the name plate when no name is provided', async () => {
    await renderDialogue({ name: undefined });

    expect(screen.queryByText('Shop owner')).not.toBeOnTheScreen();
    expect(screen.getByText('You look lost, paladin.')).toBeOnTheScreen();
  });

  it('renders the portrait', async () => {
    await renderDialogue({ testID: 'Dialogue' });

    expect(screen.getByTestId('Dialogue-portrait')).toBeOnTheScreen();
  });

  it('hides the portrait when none is provided', async () => {
    await renderDialogue({ portrait: undefined });

    expect(screen.queryByTestId('Dialogue-portrait')).not.toBeOnTheScreen();
  });

  it('calls onPress when continue is pressed', async () => {
    await renderDialogue();

    await fireEvent.press(screen.getByTestId('Dialogue-continue'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not advance when the card body is pressed', async () => {
    await renderDialogue();

    await fireEvent.press(screen.getByTestId('Dialogue'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
