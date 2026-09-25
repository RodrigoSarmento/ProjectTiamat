import { fireEvent, render, screen } from '@testing-library/react-native';

import StoryChoices from './StoryChoices';
import type { IStoryChoices } from './StoryChoices.types';

const mockOnSelect = jest.fn();

const defaultProps: IStoryChoices = {
  choices: [
    {
      id: 'corporate',
      label: 'Como um grande figurão corporativo',
      disabled: false,
    },
    { id: 'crime', label: 'Como uma lenda do crime', disabled: false },
  ],
  onSelect: mockOnSelect,
};

describe('StoryChoices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders each choice label', async () => {
    await render(<StoryChoices {...defaultProps} />);

    expect(
      screen.getByText('Como um grande figurão corporativo'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Como uma lenda do crime')).toBeOnTheScreen();
  });

  it('calls onSelect with the pressed choice', async () => {
    await render(<StoryChoices {...defaultProps} />);

    await fireEvent.press(screen.getByTestId('StoryChoices-corporate'));
    expect(mockOnSelect).toHaveBeenCalledWith(defaultProps.choices[0]);
  });

  it('does not call onSelect for a used once-choice', async () => {
    await render(
      <StoryChoices
        {...defaultProps}
        choices={[
          {
            id: 'ask-about-service',
            label: 'Ask about the job',
            once: true,
            disabled: true,
          },
        ]}
      />,
    );

    await fireEvent.press(screen.getByTestId('StoryChoices-ask-about-service'));
    expect(mockOnSelect).not.toHaveBeenCalled();
  });

  it('marks the continue choice when optional topics are also listed', async () => {
    await render(
      <StoryChoices
        {...defaultProps}
        choices={[
          {
            id: 'continue-dialog-with-jo',
            label: 'Continue talking',
            disabled: false,
          },
          {
            id: 'ask-about-service',
            label: 'Ask about the job',
            once: true,
            disabled: false,
          },
        ]}
      />,
    );

    expect(
      screen.getByTestId('StoryChoices-continue-dialog-with-jo-continue'),
    ).toBeOnTheScreen();
    expect(
      screen.queryByTestId('StoryChoices-ask-about-service-continue'),
    ).not.toBeOnTheScreen();
  });
});
