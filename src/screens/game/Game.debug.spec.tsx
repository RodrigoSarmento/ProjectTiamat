import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import GameDebugJump, { GameDebugDice } from './Game.debug';

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

describe('GameDebugJump', () => {
  it('opens the combat poc from the debug control', async () => {
    const onOpenCombat = jest.fn();
    await render(
      <GameDebugJump
        nodeIds={['dreaming']}
        currentNodeId="dreaming"
        onJump={jest.fn()}
        onOpenCombat={onOpenCombat}
      />,
    );

    await fireEvent.press(screen.getByTestId('GameDebugCombat'));
    expect(onOpenCombat).toHaveBeenCalledTimes(1);
  });

  it('highlights the current node in the list', async () => {
    await render(
      <GameDebugJump
        nodeIds={['dreaming', 'wake-on-bus', 'jo-offer']}
        currentNodeId="wake-on-bus"
        onJump={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByTestId('GameDebugJump'));

    expect(
      screen.getByTestId('GameDebugJump-wake-on-bus-current'),
    ).toBeOnTheScreen();
    expect(
      screen.queryByTestId('GameDebugJump-dreaming-current'),
    ).not.toBeOnTheScreen();
  });
});
