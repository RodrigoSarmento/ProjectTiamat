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

  it('does not call onSelect for a used optional choice', async () => {
    await render(
      <StoryChoices
        {...defaultProps}
        choices={[
          {
            id: 'use-card',
            label: 'Use the card',
            optional: true,
            disabled: true,
          },
        ]}
      />,
    );

    await fireEvent.press(screen.getByTestId('StoryChoices-use-card'));
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
            optional: true,
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

  it('does not use once as the continue marker', async () => {
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
      screen.queryByTestId('StoryChoices-continue-dialog-with-jo-continue'),
    ).not.toBeOnTheScreen();
  });

  it('does not mark continue when once and optional are mixed without a main path', async () => {
    await render(
      <StoryChoices
        {...defaultProps}
        choices={[
          {
            id: 'force-passage',
            label: 'Force the passage',
            once: true,
            disabled: false,
          },
          {
            id: 'hack-terminal',
            label: 'Hack the terminal',
            once: true,
            disabled: false,
          },
          {
            id: 'use-card',
            label: 'Use the card',
            optional: true,
            disabled: false,
          },
        ]}
      />,
    );

    expect(
      screen.queryByTestId('StoryChoices-force-passage-continue'),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByTestId('StoryChoices-hack-terminal-continue'),
    ).not.toBeOnTheScreen();
    expect(
      screen.queryByTestId('StoryChoices-use-card-continue'),
    ).not.toBeOnTheScreen();
  });
});
