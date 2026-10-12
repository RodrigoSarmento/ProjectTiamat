import { Text } from 'react-native';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import Modal from './Modal';
import type { IModal } from './Modal.types';

const mockOnBackdropPress = jest.fn();

const defaultProps: IModal = {
  isVisible: true,
  title: 'Test Modal Title',
  message: 'Test Modal Message',
  variant: 'regular',
  onBackdropPress: mockOnBackdropPress,
};

const renderModal = (props: Partial<IModal> = {}) =>
  render(<Modal {...defaultProps} {...props} />);

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title and message', async () => {
    await renderModal();
    expect(screen.getByText('Test Modal Title')).toBeTruthy();
    expect(screen.getByText('Test Modal Message')).toBeTruthy();
  });

  it('renders custom children if provided', async () => {
    await renderModal({
      children: <Text>Custom Content</Text>,
      message: undefined,
    });
    expect(screen.getByText('Custom Content')).toBeTruthy();
  });

  it('calls onBackdropPress when the backdrop is pressed', async () => {
    await renderModal();
    const backdrop = screen.getByTestId('modalBackDrop');
    await fireEvent.press(backdrop);
    expect(mockOnBackdropPress).toHaveBeenCalledTimes(1);
  });

  it('renders modal with correct variant (regular)', async () => {
    await renderModal({
      variant: 'regular',
      testID: 'Modal-Regular',
    });
    expect(screen.getByTestId('Modal-Regular')).toBeTruthy();
  });

  it('renders modal with correct variant (bottom)', async () => {
    await renderModal({
      variant: 'bottom',
      testID: 'Modal-Bottom',
    });
    expect(screen.getByTestId('Modal-Bottom')).toBeTruthy();
  });

  describe('closing', () => {
    const ANIMATION_TIMING = 300;

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    const advanceTime = async (ms: number) => {
      await act(async () => {
        jest.advanceTimersByTime(ms);
      });
    };

    it('stays on screen while it animates out, then hides', async () => {
      await renderModal({ animationTiming: ANIMATION_TIMING });

      await screen.rerender(
        <Modal
          {...defaultProps}
          animationTiming={ANIMATION_TIMING}
          isVisible={false}
        />,
      );
      expect(screen.getByText('Test Modal Title')).toBeOnTheScreen();

      await advanceTime(ANIMATION_TIMING * 2);

      expect(screen.queryByText('Test Modal Title')).not.toBeOnTheScreen();
    });

    it('stays on screen when reopened while it animates out', async () => {
      await renderModal({ animationTiming: ANIMATION_TIMING });

      await screen.rerender(
        <Modal
          {...defaultProps}
          animationTiming={ANIMATION_TIMING}
          isVisible={false}
        />,
      );
      await advanceTime(ANIMATION_TIMING / 2);
      await screen.rerender(
        <Modal {...defaultProps} animationTiming={ANIMATION_TIMING} />,
      );
      await advanceTime(ANIMATION_TIMING * 2);

      expect(screen.getByText('Test Modal Title')).toBeOnTheScreen();
    });
  });
});
