import { act, fireEvent, render, screen } from '@testing-library/react-native';

import ChoiceSelectModal from './ChoiceSelectModal';
import { QUICK_CHOICE_MS_PER_OPTION } from './ChoiceSelectModal.constants';
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

const quickChoices = [
  {
    id: 'dont-look',
    label: 'Desviar o olhar',
    isQuickChoice: true,
    disabled: false,
  },
  {
    id: 'dont-react',
    label: 'Não Reagir',
    isQuickChoice: true,
    disabled: false,
  },
  {
    id: 'focus',
    label: 'Focar o Olhar',
    isQuickChoice: true,
    disabled: false,
  },
];

describe('ChoiceSelectModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  it('confirms the selected quick choice without waiting', async () => {
    await render(
      <ChoiceSelectModal {...defaultProps} choices={quickChoices} />,
    );

    await fireEvent.press(screen.getByTestId('StoryChoices-dont-react'));
    await fireEvent.press(screen.getByTestId('ChoiceSelectModal-confirm'));

    expect(mockOnSelect).toHaveBeenCalledWith(quickChoices[1]);
  });

  it('auto-confirms the first quick choice when the timer ends', async () => {
    jest.useFakeTimers();
    await render(
      <ChoiceSelectModal {...defaultProps} choices={quickChoices} />,
    );

    await act(() => {
      jest.advanceTimersByTime(
        quickChoices.length * QUICK_CHOICE_MS_PER_OPTION - 1,
      );
    });
    expect(mockOnSelect).not.toHaveBeenCalled();

    await act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(mockOnSelect).toHaveBeenCalledWith(quickChoices[0]);
  });
});
