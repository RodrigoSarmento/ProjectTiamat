import { fireEvent, render, screen } from '@testing-library/react-native';

import ChoiceSelectModal from './ChoiceSelectModal';
import type { IChoiceSelectModal } from './ChoiceSelectModal.types';

const mockOnSelect = jest.fn();
const mockOnClose = jest.fn();

const defaultProps: IChoiceSelectModal = {
  isVisible: true,
  choices: [
    {
      id: 'corporate',
      label: 'Como um grande figurão corporativo',
      disabled: false,
    },
    { id: 'crime', label: 'Como uma lenda do crime', disabled: false },
  ],
  onSelect: mockOnSelect,
  onClose: mockOnClose,
};

describe('ChoiceSelectModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the choices when visible', async () => {
    await render(<ChoiceSelectModal {...defaultProps} />);

    expect(screen.getByTestId('ChoiceSelectModal')).toBeOnTheScreen();
    expect(
      screen.getByText('Como um grande figurão corporativo'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Como uma lenda do crime')).toBeOnTheScreen();
  });

  it('does not render when hidden', async () => {
    await render(<ChoiceSelectModal {...defaultProps} isVisible={false} />);

    expect(screen.queryByTestId('ChoiceSelectModal')).not.toBeOnTheScreen();
  });

  it('closes from the backdrop', async () => {
    await render(<ChoiceSelectModal {...defaultProps} />);

    await fireEvent.press(screen.getByTestId('ChoiceSelectModal-backdrop'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('selects a choice', async () => {
    await render(<ChoiceSelectModal {...defaultProps} />);

    await fireEvent.press(screen.getByTestId('StoryChoices-corporate'));
    expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.choices[0]);
  });
});
