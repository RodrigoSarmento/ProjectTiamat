import { act, fireEvent, render, screen } from '@testing-library/react-native';

import Collapsible from './Collapsible';
import { COLLAPSIBLE_ANIMATION_DURATION_MS } from './Collapsible.constants';

const TITLE = 'Nova São Paulo';
const DESCRIPTION = 'Uma megacidade erguida sobre a antiga São Paulo.';

const advanceTime = async (ms: number) => {
  await act(async () => {
    jest.advanceTimersByTime(ms);
  });
};

describe('Collapsible', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows only the title while collapsed', async () => {
    await render(<Collapsible title={TITLE} description={DESCRIPTION} />);

    expect(screen.getByText(TITLE)).toBeOnTheScreen();
    expect(screen.queryByText(DESCRIPTION)).not.toBeOnTheScreen();
    expect(screen.queryByTestId('Collapsible-new')).not.toBeOnTheScreen();
    expect(screen.getByTestId('Collapsible')).toBeCollapsed();
  });

  it('opens and shows the description when pressed', async () => {
    await render(<Collapsible title={TITLE} description={DESCRIPTION} />);

    await fireEvent.press(screen.getByTestId('Collapsible'));

    expect(screen.getByText(DESCRIPTION)).toBeOnTheScreen();
    expect(screen.getByTestId('Collapsible')).toBeExpanded();
  });

  it('collapses again when pressed a second time', async () => {
    jest.useFakeTimers({ doNotFake: ['queueMicrotask'] });
    await render(<Collapsible title={TITLE} description={DESCRIPTION} />);

    await fireEvent.press(screen.getByTestId('Collapsible'));
    await fireEvent.press(screen.getByTestId('Collapsible'));

    expect(screen.getByTestId('Collapsible')).toBeCollapsed();

    await advanceTime(COLLAPSIBLE_ANIMATION_DURATION_MS + 100);

    expect(screen.queryByText(DESCRIPTION)).not.toBeOnTheScreen();
  });

  it('keeps the description when reopened while collapsing', async () => {
    jest.useFakeTimers({ doNotFake: ['queueMicrotask'] });
    await render(
      <Collapsible title={TITLE} description={DESCRIPTION} isOpen />,
    );

    await fireEvent.press(screen.getByTestId('Collapsible'));
    await advanceTime(COLLAPSIBLE_ANIMATION_DURATION_MS / 2);
    await fireEvent.press(screen.getByTestId('Collapsible'));
    await advanceTime(COLLAPSIBLE_ANIMATION_DURATION_MS * 2);

    expect(screen.getByText(DESCRIPTION)).toBeOnTheScreen();
    expect(screen.getByTestId('Collapsible')).toBeExpanded();
  });

  it('shows a new dot when the entry is unread', async () => {
    await render(<Collapsible title={TITLE} description={DESCRIPTION} isNew />);

    expect(screen.getByTestId('Collapsible-new')).toBeOnTheScreen();
  });

  it('shows a portrait when one is given', async () => {
    const portrait = { uri: 'https://example.com/jo.png' };
    await render(
      <Collapsible
        title={TITLE}
        description={DESCRIPTION}
        portrait={portrait}
      />,
    );

    expect(screen.getByTestId('Collapsible-portrait')).toBeOnTheScreen();
  });

  it('starts open when asked', async () => {
    await render(
      <Collapsible title={TITLE} description={DESCRIPTION} isOpen />,
    );

    expect(screen.getByText(DESCRIPTION)).toBeOnTheScreen();
  });
});
