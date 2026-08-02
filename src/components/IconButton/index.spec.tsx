import { IIconButton } from '.';

import { fireEvent, render } from '@testing-library/react-native';
import { IconButton } from 'components';

const mockOnPress = jest.fn();

const defaultProps: IIconButton = {
  onPress: mockOnPress,
  source: require('assets/icons/info.png'),
  testID: 'IconButton',
  imageTestID: 'Image',
};

const renderIconButton = (props?: Partial<IIconButton>) => {
  return render(<IconButton {...defaultProps} {...props} />);
};

describe('IconButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Calls onPress when pressed', () => {
    const { getByTestId } = renderIconButton();

    const button = getByTestId('IconButton');
    fireEvent.press(button);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('Is disabled when isActive is false', () => {
    const { getByTestId } = renderIconButton({ isActive: false });

    const button = getByTestId('IconButton');
    expect(button.props.accessibilityState.disabled).toBe(true);
  });

  it('Applies custom styles to the container and Icon', () => {
    const customStyle = { backgroundColor: 'red' };
    const customIconStyle = { tintColor: 'blue' };

    const { getByTestId } = renderIconButton({ customIconStyle, customStyle });

    const button = getByTestId('IconButton');
    const image = getByTestId('Image');
    expect(button.props.style.backgroundColor).toBe('red');
    expect(image.props.style.tintColor).toBe('blue');
  });

  it('Should render below text if it passed', () => {
    const { getByText } = renderIconButton({ textBelow: 'TextBelow' });

    const text = getByText('TextBelow');
    expect(text).toBeTruthy();
  });
});
