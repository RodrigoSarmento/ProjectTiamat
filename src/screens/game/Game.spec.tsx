import { prologueChapter } from '@data/story';
import { getPassagePages } from '@helper/storyPlayback';
import SavesSlice from '@redux/slices/SavesSlice';
import { configureStore } from '@reduxjs/toolkit';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { Provider } from 'react-redux';

import Game from './Game';
import {
  DIALOGUE_CHARS_PER_LINE,
  DIALOGUE_MAX_LINES,
  NARRATOR_CHARS_PER_LINE,
  NARRATOR_MAX_LINES,
} from './Game.constants';

const dreamingNode = prologueChapter.nodes.dreaming;

const dreamingPages =
  dreamingNode.type === 'passage'
    ? getPassagePages(
        dreamingNode,
        NARRATOR_MAX_LINES,
        NARRATOR_CHARS_PER_LINE,
        DIALOGUE_MAX_LINES,
        DIALOGUE_CHARS_PER_LINE,
      )
    : [];

const renderGame = () => {
  const store = configureStore({ reducer: { saves: SavesSlice } });
  return render(
    <Provider store={store}>
      <Game />
    </Provider>,
  );
};

const advanceToChoices = async () => {
  for (let index = 0; index < dreamingPages.length; index += 1) {
    await fireEvent.press(screen.getByTestId('NarratorText-continue'));
  }
};

describe('Game', () => {
  it('starts on the black-screen narrator, not a character dialogue box', async () => {
    await renderGame();

    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();
    expect(screen.getByText(/De olhos fechados/)).toBeOnTheScreen();
    expect(screen.queryByTestId('Dialogue')).not.toBeOnTheScreen();
  });

  it('splits overflow onto another narrator page', async () => {
    await renderGame();

    expect(dreamingPages.length).toBeGreaterThan(1);
    expect(screen.getByText(/De olhos fechados/)).toBeOnTheScreen();
    expect(screen.queryByText(/luz no fim do túnel/)).not.toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('NarratorText-continue'));

    expect(screen.getByText(/luz no fim do túnel/)).toBeOnTheScreen();
  });

  it('opens choices in a bottom modal while keeping the last page', async () => {
    await renderGame();
    await advanceToChoices();

    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();
    expect(screen.getByTestId('ChoiceSelectModal')).toBeOnTheScreen();
    expect(
      screen.getByText('Como um grande figurão corporativo'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('Livre de todos os seus problemas financeiros'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Como uma lenda do crime')).toBeOnTheScreen();
    expect(
      screen.getByText('Finalmente em paz fora do caos de Nova São Paulo'),
    ).toBeOnTheScreen();
  });

  it('closes the choices modal from the backdrop and reopens from continue', async () => {
    await renderGame();
    await advanceToChoices();

    await fireEvent.press(screen.getByTestId('ChoiceSelectModal-backdrop'));
    await waitFor(() => {
      expect(screen.queryByTestId('ChoiceSelectModal')).not.toBeOnTheScreen();
    });
    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();

    await fireEvent.press(screen.getByTestId('NarratorText-continue'));
    expect(screen.getByTestId('ChoiceSelectModal')).toBeOnTheScreen();
  });

  it('follows a choice to the next passage', async () => {
    await renderGame();
    await advanceToChoices();

    await fireEvent.press(screen.getByTestId('StoryChoices-corporate'));

    expect(screen.getByText(/A luz toma forma/)).toBeOnTheScreen();
    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();
  });
});
