import { Text } from 'react-native';

import { IModal } from '.';

import { fireEvent, render } from '@testing-library/react-native';
import { Modal } from 'components';

const mockOnButtonOnePress = jest.fn();
const mockOnButtonTwoPress = jest.fn();
const mockOnBackdropPress = jest.fn();

const defaultProps: IModal = {
  isVisible: true,
  title: 'Test Modal Title',
  message: 'Test Modal Message',
  buttonOneText: 'Confirm',
  buttonTwoText: 'Cancel',
  variant: 'regular',
  onButtonOnePress: mockOnButtonOnePress,
  onButtonTwoPress: mockOnButtonTwoPress,
  onBackdropPress: mockOnBackdropPress,
};

const renderModal = (props: Partial<IModal> = {}) =>
  render(<Modal {...defaultProps} {...props} />);

describe('Modal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with title and message', () => {
    const { getByText } = renderModal();
    expect(getByText('Test Modal Title')).toBeTruthy();
    expect(getByText('Test Modal Message')).toBeTruthy();
  });

  it('renders buttons when button text is provided', () => {
    const { getByText } = renderModal();
    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onButtonPress when buttons are pressed', () => {
    const { getByText } = renderModal();
    const buttonOne = getByText('Confirm');
    const buttonTwo = getByText('Cancel');

    fireEvent.press(buttonOne);
    fireEvent.press(buttonTwo);
    expect(mockOnButtonOnePress).toHaveBeenCalledTimes(1);
    expect(mockOnButtonTwoPress).toHaveBeenCalledTimes(1);
  });

  it('renders custom children if provided', () => {
    const { getByText } = renderModal({
      children: <Text>Custom Content</Text>,
      message: undefined,
    });
    expect(getByText('Custom Content')).toBeTruthy();
  });

  it('renders close button when shouldRenderCloseButton is true', () => {
    const { getByTestId } = renderModal({ shouldRenderCloseButton: true });
    const closeButton = getByTestId('modalCloseButton');
    expect(closeButton).toBeTruthy();
  });

  it('calls onBackdropPress when the backdrop is pressed', () => {
    const { getByTestId } = renderModal();
    const backdrop = getByTestId('modalBackDrop');
    fireEvent.press(backdrop);
    expect(mockOnBackdropPress).toHaveBeenCalledTimes(1);
  });

  it('renders modal with correct variant (regular)', () => {
    const { getByTestId } = renderModal({
      variant: 'regular',
      testID: 'Modal-Regular',
    });
    const modalContainer = getByTestId('Modal-Regular');
    expect(modalContainer).toBeTruthy();
  });

  it('renders modal with correct variant (bottom)', () => {
    const { getByTestId } = renderModal({
      variant: 'bottom',
      testID: 'Modal-Bottom',
    });
    const modalContainer = getByTestId('Modal-Bottom');
    expect(modalContainer).toBeTruthy();
  });
});
