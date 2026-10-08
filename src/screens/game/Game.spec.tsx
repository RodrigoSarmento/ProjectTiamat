import { StoryFlag, prologueChapter } from '@data/story';
import { toStoryLogEntry } from '@helper/storyLog';
import { type IStoryPage, getPassagePages } from '@helper/storyPlayback';
import { SOUND_EFFECT_FILE } from '@hooks/use-sound';
import savesReducer, { type IStoryProgress } from '@redux/slices/SavesSlice';
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

const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), reset: mockReset }),
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

const renderSavedGame = (progress: IStoryProgress) => {
  const saves = savesReducer(undefined, { type: '@@INIT' });
  return renderWithProviders(<Game />, {
    preloadedState: {
      saves: {
        ...saves,
        hasStarted: true,
        save: { ...saves.save, progress },
      },
    },
  });
};

const nodePages = (nodeId: keyof typeof prologueChapter.nodes) => {
  const node = prologueChapter.nodes[nodeId];
  return node.type === 'passage'
    ? getPassagePages(
        node,
        NARRATOR_MAX_LINES,
        NARRATOR_CHARS_PER_LINE,
        DIALOGUE_MAX_LINES,
        DIALOGUE_CHARS_PER_LINE,
      )
    : [];
};

const logEntry = (
  nodeId: keyof typeof prologueChapter.nodes,
  pageIndex: number,
) => toStoryLogEntry(nodePages(nodeId)[pageIndex], nodeId, pageIndex);

const continuePages = async (pages: IStoryPage[], count = pages.length) => {
  for (let index = 0; index < count; index += 1) {
    const testID =
      pages[index].kind === 'dialogue' ? 'Dialogue' : 'NarratorText';
    await fireEvent.press(screen.getByTestId(`${testID}-continue`));
  }
};

const advanceToChoices = () => continuePages(dreamingPages);

describe('Game', () => {
  beforeEach(() => {
    mockReset.mockClear();
  });

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
    const blockedPages = nodePages('approaching-line-gus-blocked');
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

    await continuePages(blockedPages, soundPageIndex);

    expect(isDeniedLoaded()).toBe(true);
  });

  it('saves the node reached by a choice', async () => {
    const { store } = await renderGame();
    await advanceToChoices();

    await fireEvent.press(screen.getByTestId('StoryChoices-corporate'));

    const corporate =
      dreamingNode.type === 'passage'
        ? dreamingNode.choices?.find((choice) => choice.id === 'corporate')
        : undefined;
    expect(store.getState().saves.save.progress?.nodeId).toBe(corporate?.next);
  });

  it('resumes from the saved node', async () => {
    await renderSavedGame({
      nodeId: 'wake-on-bus',
      flags: [],
      usedChoiceIds: [],
      storyLog: [],
    });

    expect(screen.getByText(/Você acorda repentinamente/)).toBeOnTheScreen();
    expect(screen.queryByText('TELA PRETA - Sonhando')).not.toBeOnTheScreen();
  });

  it('restores used choices and flags when resuming', async () => {
    const { store } = await renderSavedGame({
      nodeId: 'try-to-help-gus',
      flags: [StoryFlag.helpedGusWithForcePassage],
      usedChoiceIds: ['hack-terminal'],
      storyLog: [],
    });

    await continuePages(nodePages('try-to-help-gus'));

    expect(screen.getByTestId('StoryChoices-hack-terminal')).toBeDisabled();
    expect(screen.getByTestId('StoryChoices-force-passage')).toBeEnabled();

    await fireEvent.press(screen.getByTestId('StoryChoices-use-card'));

    expect(store.getState().saves.save.progress).toEqual(
      expect.objectContaining({
        nodeId: 'use-card-response',
        flags: [StoryFlag.helpedGusWithForcePassage],
        usedChoiceIds: ['hack-terminal', 'use-card'],
      }),
    );
  });

  it('restores the story log, replaying the current node once', async () => {
    const { store } = await renderSavedGame({
      nodeId: 'wake-on-bus',
      flags: [],
      usedChoiceIds: [],
      storyLog: [
        logEntry('dreaming', 0),
        logEntry('dreaming', 1),
        logEntry('wake-on-bus', 0),
      ],
    });

    await fireEvent.press(screen.getByTestId('StoryLog-open'));

    expect(screen.getByTestId('StoryLog-dreaming:0')).toBeOnTheScreen();
    expect(screen.getByTestId('StoryLog-dreaming:1')).toBeOnTheScreen();
    expect(screen.getByTestId('StoryLog-wake-on-bus:0')).toBeOnTheScreen();
    expect(
      store.getState().saves.save.progress?.storyLog.map((entry) => entry.key),
    ).toEqual(['dreaming:0', 'dreaming:1', 'wake-on-bus:0']);
  });

  it('goes back to the latest logged node when the saved node no longer exists', async () => {
    const { store } = await renderSavedGame({
      nodeId: 'missing-node',
      flags: [StoryFlag.helpedGusWithForcePassage],
      usedChoiceIds: ['hack-terminal'],
      storyLog: [
        logEntry('dreaming', 0),
        logEntry('wake-on-bus', 0),
        { key: 'missing-node:0', nodeId: 'missing-node', text: 'Removida' },
      ],
    });

    expect(screen.getByText(/Você acorda repentinamente/)).toBeOnTheScreen();
    expect(store.getState().saves.save.progress).toEqual({
      nodeId: 'wake-on-bus',
      flags: [StoryFlag.helpedGusWithForcePassage],
      usedChoiceIds: ['hack-terminal'],
      storyLog: [logEntry('dreaming', 0), logEntry('wake-on-bus', 0)],
    });
  });

  it('starts over when no logged node exists anymore', async () => {
    const { store } = await renderSavedGame({
      nodeId: 'missing-node',
      flags: [StoryFlag.helpedGusWithForcePassage],
      usedChoiceIds: ['hack-terminal'],
      storyLog: [],
    });

    expect(screen.getByText('TELA PRETA - Sonhando')).toBeOnTheScreen();
    expect(store.getState().saves.save.progress).toEqual(
      expect.objectContaining({
        nodeId: prologueChapter.entry,
        flags: [],
        usedChoiceIds: [],
      }),
    );
  });

  it('erases the save and goes back to Start from the debug menu', async () => {
    const { store } = await renderGame();
    await fireEvent.press(screen.getByTestId('GameDebugJump'));
    await fireEvent.press(screen.getByTestId('GameDebugJump-wake-on-bus'));

    await fireEvent.press(screen.getByTestId('GameDebugJump'));
    await fireEvent.press(screen.getByTestId('GameDebugEraseSave'));

    expect(store.getState().saves.save.progress).toBeUndefined();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Start' }],
    });
  });

  it('keeps the latest pages in the story log', async () => {
    await renderGame();
    await fireEvent.press(screen.getByTestId('NarratorText-continue'));
    await fireEvent.press(screen.getByTestId('StoryLog-open'));

    expect(screen.getByTestId('StoryLog-dreaming:0')).toBeOnTheScreen();
    expect(screen.getByTestId('StoryLog-dreaming:1')).toBeOnTheScreen();
  });
});
