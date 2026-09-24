import { fireEvent, render, screen } from '@testing-library/react-native';

import NarratorText from './NarratorText';
import { CONTINUE_LABEL } from './NarratorText.constants';
import type { INarratorText } from './NarratorText.types';

const mockOnPress = jest.fn();

const defaultProps: INarratorText = {
  title: 'TELA PRETA - Sonhando',
  text: 'De olhos fechados, você já não consegue mais distinguir.',
  onPress: mockOnPress,
};

const renderNarrator = (props: Partial<INarratorText> = {}) =>
  render(<NarratorText {...defaultProps} {...props} />);

describe('NarratorText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the scene title and body', async () => {
    await renderNarrator();

    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'De olhos fechados, você já não consegue mais distinguir.',
      ),
    ).toBeOnTheScreen();
    expect(screen.getByText(CONTINUE_LABEL)).toBeOnTheScreen();
  });

  it('hides the title when none is provided', async () => {
    await renderNarrator({ title: undefined });

    expect(screen.queryByText('TELA PRETA - Sonhando')).not.toBeOnTheScreen();
  });

  it('calls onPress when continue is pressed', async () => {
    await renderNarrator();

    await fireEvent.press(screen.getByTestId('NarratorText-continue'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('does not advance when the page body is pressed', async () => {
    await renderNarrator();

    await fireEvent.press(screen.getByTestId('NarratorText'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });
});
