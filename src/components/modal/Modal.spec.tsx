import { Text } from 'react-native';

import { fireEvent, render, screen } from '@testing-library/react-native';

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
});
