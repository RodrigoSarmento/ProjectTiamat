import { prologueChapter } from '@data/story';
import { getPassagePages } from '@helper/storyPlayback';
import { SOUND_EFFECT_FILE } from '@hooks/use-sound';
import { renderWithProviders } from '@test/renderWithProviders';
import { fireEvent, screen } from '@testing-library/react-native';
import Sound from 'react-native-sound';

import Game from './Game';
import {
  DIALOGUE_CHARS_PER_LINE,
  DIALOGUE_MAX_LINES,
  NARRATOR_CHARS_PER_LINE,
  NARRATOR_MAX_LINES,
} from './Game.constants';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

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

const renderGame = () => renderWithProviders(<Game />);

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

  it('follows a choice to the next passage', async () => {
    await renderGame();
    await advanceToChoices();

    await fireEvent.press(screen.getByTestId('StoryChoices-corporate'));

    expect(screen.getByText(/A luz toma forma/)).toBeOnTheScreen();
    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();
  });

  it('jumps to a node from the debug list', async () => {
    await renderGame();

    await fireEvent.press(screen.getByTestId('GameDebugJump'));
    await fireEvent.press(screen.getByTestId('GameDebugJump-wake-on-bus'));

    expect(screen.getByText(/Você acorda repentinamente/)).toBeOnTheScreen();
    expect(screen.queryByText('TELA PRETA - Sonhando')).not.toBeOnTheScreen();
  });

  it('plays the sound of a choice when it is selected', async () => {
    const drinkOffer = prologueChapter.nodes['drink-offer'];
    const drinkOfferPages =
      drinkOffer.type === 'passage'
        ? getPassagePages(
            drinkOffer,
            NARRATOR_MAX_LINES,
            NARRATOR_CHARS_PER_LINE,
            DIALOGUE_MAX_LINES,
            DIALOGUE_CHARS_PER_LINE,
          )
        : [];
    await renderGame();
    await fireEvent.press(screen.getByTestId('GameDebugJump'));
    await fireEvent.press(screen.getByTestId('GameDebugJump-drink-offer'));
    for (let index = 0; index < drinkOfferPages.length; index += 1) {
      await fireEvent.press(screen.getByTestId('NarratorText-continue'));
    }

    await fireEvent.press(screen.getByTestId('StoryChoices-accept-drink'));

    expect(Sound).toHaveBeenCalledWith(
      SOUND_EFFECT_FILE.openCan,
      'MAIN_BUNDLE',
      expect.any(Function),
    );
  });

  it('plays the sound of a line when its page opens', async () => {
    const blocked = prologueChapter.nodes['approaching-line-gus-blocked'];
    const blockedPages =
      blocked.type === 'passage'
        ? getPassagePages(
            blocked,
            NARRATOR_MAX_LINES,
            NARRATOR_CHARS_PER_LINE,
            DIALOGUE_MAX_LINES,
            DIALOGUE_CHARS_PER_LINE,
          )
        : [];
    const soundPageIndex = blockedPages.findIndex((page) => page.soundFile);
    const isDeniedLoaded = () =>
      (Sound as unknown as jest.Mock).mock.calls.some(
        ([file]) => file === SOUND_EFFECT_FILE.accessDenied,
      );
    await renderGame();
    await fireEvent.press(screen.getByTestId('GameDebugJump'));
    await fireEvent.press(
      screen.getByTestId('GameDebugJump-approaching-line-gus-blocked'),
    );
    expect(isDeniedLoaded()).toBe(false);

    for (let index = 0; index < soundPageIndex; index += 1) {
      const testID =
        blockedPages[index].kind === 'dialogue' ? 'Dialogue' : 'NarratorText';
      await fireEvent.press(screen.getByTestId(`${testID}-continue`));
    }

    expect(isDeniedLoaded()).toBe(true);
  });

  it('keeps the latest pages in the story log', async () => {
    await renderGame();
    await fireEvent.press(screen.getByTestId('NarratorText-continue'));
    await fireEvent.press(screen.getByTestId('StoryLog-open'));

    expect(screen.getByTestId('StoryLog-dreaming:0')).toBeOnTheScreen();
    expect(screen.getByTestId('StoryLog-dreaming:1')).toBeOnTheScreen();
  });
});
