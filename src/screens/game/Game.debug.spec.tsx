import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import { GameDebugDice } from './Game.debug';

describe('GameDebugDice', () => {
  it('forces success or failure when the debug buttons are pressed', async () => {
    const onForceSuccess = jest.fn();
    const onForceFailure = jest.fn();
    await render(
      <GameDebugDice
        onForceSuccess={onForceSuccess}
        onForceFailure={onForceFailure}
      />,
    );

    await fireEvent.press(screen.getByTestId('GameDebugDice-success'));
    expect(onForceSuccess).toHaveBeenCalledTimes(1);

    await fireEvent.press(screen.getByTestId('GameDebugDice-failure'));
    expect(onForceFailure).toHaveBeenCalledTimes(1);
  });
});
