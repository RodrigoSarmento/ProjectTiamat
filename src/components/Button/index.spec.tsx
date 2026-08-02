import { IButton } from '.';

import { fireEvent, render } from '@testing-library/react-native';
import { Button } from 'components';

const mockOnPress = jest.fn();

const defaultProps: IButton = {
  onPress: mockOnPress,
  title: 'Title',
};

const renderButton = (props?: Partial<IButton>) => {
  return render(<Button {...defaultProps} {...props} />);
};

describe('Button Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Render with correct text and subtitle', () => {
    const { getByText } = renderButton({ subtitle: 'subtitle' });

    expect(getByText('Title')).toBeTruthy();
    expect(getByText('subtitle')).toBeTruthy();
  });

  it('Calls onPress when pressed', () => {
    const { getByText } = renderButton();
    const button = getByText('Title');

    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('Displays the loading indicator when loading is true', () => {
    const { getByTestId } = renderButton({ loading: true });

    expect(getByTestId('LoadingIndicator')).toBeTruthy();
  });

  it('Applies custom styles to button and text', () => {
    const customStyle = { backgroundColor: 'blue' };
    const customTextStyle = { color: 'red' };

    const { getByText } = renderButton({ customStyle, customTextStyle });

    const button = getByText('Title');
    expect(button.props.style.color).toBe('red');
  });

  it('Handles inactive state correctly', () => {
    const { getByTestId } = renderButton({ isActive: false, testID: 'Button' });

    const button = getByTestId('Button');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });
});
