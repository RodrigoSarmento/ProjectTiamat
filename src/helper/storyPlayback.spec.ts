import {
  CharacterId,
  type IStoryChoice,
  type IStoryPassageNode,
  StoryFlag,
} from '@data/story';

import {
  applyBackground,
  getPassagePages,
  isChoiceAvailable,
  isQuickChoicePrompt,
  passageOpensWithChoices,
  splitConsequences,
  visibleChoices,
  withFlagConsequences,
} from './storyPlayback';

const narratorNode: IStoryPassageNode = {
  type: 'passage',
  title: 'TELA PRETA - Sonhando',
  backgroundColor: 'black',
  text: 'A short narrator line.',
};

const dialogueNode: IStoryPassageNode = {
  type: 'passage',
  characterId: CharacterId.jo,
  text: 'Hello there, paladin.',
};

const choices: IStoryChoice[] = [
  { id: 'open', label: 'Open' },
  {
    id: 'locked',
    label: 'Locked',
    requires: [StoryFlag.dreamedCorporate],
  },
];

describe('storyPlayback', () => {
  it('keeps the last background until a node replaces it', () => {
    expect(applyBackground({ backgroundColor: 'black' }, undefined)).toEqual({
      backgroundColor: 'black',
    });
    expect(
      applyBackground(
        { backgroundColor: 'black' },
        { backgroundImage: 'gameplay_page' },
      ),
    ).toEqual({ backgroundImage: 'gameplay_page' });
  });

  it('builds narrator pages with the passage title', () => {
    const pages = getPassagePages(narratorNode, 10, 40, 3, 38);

    expect(pages).toEqual([
      {
        kind: 'narrator',
        text: 'A short narrator line.',
        title: 'TELA PRETA - Sonhando',
      },
    ]);
  });

  it('builds dialogue pages with the character id', () => {
    const pages = getPassagePages(dialogueNode, 10, 40, 3, 38);

    expect(pages).toEqual([
      {
        kind: 'dialogue',
        characterId: CharacterId.jo,
        text: 'Hello there, paladin.',
        portraitPosition: 'right',
      },
    ]);
  });

  it('unlocks a choice only when required flags are set', () => {
    expect(isChoiceAvailable(choices[1], [])).toBe(false);
    expect(isChoiceAvailable(choices[1], [StoryFlag.dreamedCorporate])).toBe(
      true,
    );
  });

  it('hides consumed and locked choices', () => {
    expect(visibleChoices(choices, [], []).map((choice) => choice.id)).toEqual([
      'open',
    ]);
    expect(
      visibleChoices(choices, [StoryFlag.dreamedCorporate], ['open']).map(
        (choice) => choice.id,
      ),
    ).toEqual(['locked']);
  });

  it('keeps isQuickChoice on presented choices', () => {
    expect(
      visibleChoices(
        [{ id: 'focus', label: 'Focar o Olhar', isQuickChoice: true }],
        [],
        [],
      ),
    ).toEqual([
      {
        id: 'focus',
        label: 'Focar o Olhar',
        isQuickChoice: true,
        disabled: false,
      },
    ]);
  });

  it('treats a prompt as quick only when every choice is timed', () => {
    expect(
      isQuickChoicePrompt([
        {
          id: 'dont-look',
          label: 'Desviar o olhar',
          isQuickChoice: true,
          disabled: false,
        },
        {
          id: 'focus',
          label: 'Focar o Olhar',
          isQuickChoice: true,
          disabled: false,
        },
      ]),
    ).toBe(true);
    expect(
      isQuickChoicePrompt([
        { id: 'open', label: 'Open', disabled: false },
        {
          id: 'focus',
          label: 'Focar o Olhar',
          isQuickChoice: true,
          disabled: false,
        },
      ]),
    ).toBe(false);
  });

  it('keeps once-choices visible and disabled after use', () => {
    const onceChoices: IStoryChoice[] = [
      { id: 'continue', label: 'Continue', next: 'jo-answer' },
      {
        id: 'ask-about-service',
        label: 'Ask about the job',
        next: 'jo-job-first-answer',
        once: true,
      },
    ];

    expect(visibleChoices(onceChoices, [], ['ask-about-service'])).toEqual([
      {
        id: 'continue',
        label: 'Continue',
        next: 'jo-answer',
        disabled: false,
      },
      {
        id: 'ask-about-service',
        label: 'Ask about the job',
        next: 'jo-job-first-answer',
        once: true,
        disabled: true,
      },
    ]);
  });

  it('splits flag and temporaryStatus consequences', () => {
    expect(
      splitConsequences([
        { type: 'flag', value: StoryFlag.dreamedCorporate },
        { type: 'temporaryStatus', value: { energy: 1 } },
        { type: 'temporaryStatus', value: { energy: 2, charisma: 1 } },
      ]),
    ).toEqual({
      flags: [StoryFlag.dreamedCorporate],
      temporaryStatus: { energy: 3, charisma: 1 },
    });
    expect(
      withFlagConsequences(
        [StoryFlag.dreamedCorporate],
        [StoryFlag.dreamedPeace],
      ),
    ).toEqual([StoryFlag.dreamedCorporate, StoryFlag.dreamedPeace]);
  });

  it('plays several beats from lines in one passage', () => {
    const pages = getPassagePages(
      {
        type: 'passage',
        title: 'On the bus',
        lines: [
          { characterId: CharacterId.jo, text: 'Wake up.' },
          { text: 'He shakes a can.' },
        ],
      },
      10,
      40,
      3,
      38,
    );

    expect(pages).toEqual([
      {
        kind: 'dialogue',
        characterId: CharacterId.jo,
        text: 'Wake up.',
        portraitPosition: 'right',
      },
      {
        kind: 'narrator',
        text: 'He shakes a can.',
        title: 'On the bus',
      },
    ]);
  });

  it('opens immediately only when a passage has choices and no text', () => {
    expect(passageOpensWithChoices(narratorNode)).toBe(false);
    expect(
      passageOpensWithChoices({
        type: 'passage',
        choices: [{ id: 'stay', label: 'Stay' }],
      }),
    ).toBe(true);
    expect(
      passageOpensWithChoices({ type: 'endTrecho', nextChapter: 'chapter-01' }),
    ).toBe(false);
  });

  it('uses line portraitPosition and defaults to right', () => {
    expect(
      getPassagePages(
        {
          type: 'passage',
          characterId: CharacterId.jo,
          portraitPosition: 'left',
          text: 'From the passage.',
        },
        10,
        40,
        3,
        38,
      ),
    ).toEqual([
      {
        kind: 'dialogue',
        characterId: CharacterId.jo,
        text: 'From the passage.',
        portraitPosition: 'left',
      },
    ]);
    expect(
      getPassagePages(
        {
          type: 'passage',
          lines: [
            {
              characterId: CharacterId.securityGuard,
              text: 'Left side.',
              portraitPosition: 'left',
            },
            {
              characterId: CharacterId.jo,
              text: 'Default side.',
            },
          ],
        },
        10,
        40,
        3,
        38,
      ),
    ).toEqual([
      {
        kind: 'dialogue',
        characterId: CharacterId.securityGuard,
        text: 'Left side.',
        portraitPosition: 'left',
      },
      {
        kind: 'dialogue',
        characterId: CharacterId.jo,
        text: 'Default side.',
        portraitPosition: 'right',
      },
    ]);
  });
});
