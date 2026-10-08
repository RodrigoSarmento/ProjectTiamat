import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react-native';

import StoryLog from './StoryLog';

const entries = [
  {
    key: 'dreaming:0',
    nodeId: 'dreaming',
    title: 'TELA PRETA - Sonhando',
    text: 'De olhos fechados.',
  },
  {
    key: 'wake-voice:0',
    nodeId: 'wake-voice',
    speaker: 'Voz masculina',
    text: 'Ô! Acorda aê!',
  },
];

describe('StoryLog', () => {
  it('opens a full-screen recap of the latest pages and closes from the icon', async () => {
    await render(<StoryLog entries={entries} />);

    expect(screen.queryByTestId('StoryLog-dreaming:0')).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('StoryLog-open'));

    expect(screen.getByTestId('StoryLog-dreaming:0')).toBeOnTheScreen();
    expect(screen.getByText('De olhos fechados.')).toBeOnTheScreen();
    expect(screen.getByText('Voz masculina')).toBeOnTheScreen();
    expect(screen.getByText('Ô! Acorda aê!')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('StoryLog-close'));
    expect(screen.queryByTestId('StoryLog-dreaming:0')).not.toBeOnTheScreen();
  });
});
