import React from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import DiceRollD20 from './DiceRollD20';

type WebViewMessage = (event: { nativeEvent: { data: string } }) => void;

let mockOnMessage: WebViewMessage | undefined;

jest.mock('react-native-webview', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: { onMessage?: WebViewMessage }) => {
      mockOnMessage = props.onMessage;
      return <View testID="dice-scene" />;
    },
  };
});

const emitMessage = (data: object) => {
  act(() => {
    mockOnMessage?.({ nativeEvent: { data: JSON.stringify(data) } });
  });
};

describe('DiceRollD20', () => {
  it('grows a success label after a passing roll and continues on the next tap', async () => {
    const onComplete = jest.fn();
    await render(
      <DiceRollD20 isSuccess={(face) => face >= 10} onComplete={onComplete} />,
    );

    emitMessage({ type: 'ready' });
    await fireEvent.press(screen.getByTestId('dice-roll-d20'));
    expect(onComplete).not.toHaveBeenCalled();
    expect(screen.queryByText('Sucesso')).toBeNull();

    emitMessage({ type: 'settled', result: 17 });
    expect(screen.getByText('Sucesso')).toBeTruthy();
    expect(onComplete).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByTestId('dice-roll-d20'));
    expect(onComplete).toHaveBeenCalledWith(17);
  });

  it('grows a failure label after a failing roll', async () => {
    await render(<DiceRollD20 isSuccess={(face) => face >= 10} />);

    emitMessage({ type: 'ready' });
    await fireEvent.press(screen.getByTestId('dice-roll-d20'));
    emitMessage({ type: 'settled', result: 4 });

    expect(screen.getByText('Falha')).toBeTruthy();
    expect(screen.queryByText('Sucesso')).toBeNull();
  });
});
