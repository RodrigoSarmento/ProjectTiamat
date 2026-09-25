import type { IStoryChapter } from '../Story.types';
import { CharacterId } from '../characters';
import { StoryFlag } from '../flags';

export const prologueChapter = {
  id: 'prologue',
  entry: 'dreaming',
  nodes: {
    dreaming: {
      type: 'passage',
      title: 'prologue.dreaming.title',
      backgroundColor: 'black',
      text: 'prologue.dreaming.text',
      choices: [
        {
          id: 'corporate',
          label: 'prologue.dreaming.choices.corporate',
          next: 'wake-on-bus-corporate',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedCorporate,
            },
          ],
        },
        {
          id: 'financial',
          label: 'prologue.dreaming.choices.financial',
          next: 'wake-on-bus-financial',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedFinancial,
            },
          ],
        },
        {
          id: 'crime',
          label: 'prologue.dreaming.choices.crime',
          next: 'wake-on-bus-crime',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedCrime,
            },
          ],
        },
        {
          id: 'peace',
          label: 'prologue.dreaming.choices.peace',
          next: 'wake-on-bus-peace',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dreamedPeace,
            },
          ],
        },
      ],
    },
    'wake-on-bus-corporate': {
      type: 'passage',
      title: 'prologue.wake-on-bus-corporate.title',
      text: 'prologue.wake-on-bus-corporate.text',
      next: 'wake-voice',
    },
    'wake-on-bus-financial': {
      type: 'passage',
      title: 'prologue.wake-on-bus-financial.title',
      text: 'prologue.wake-on-bus-financial.text',
      next: 'wake-voice',
    },
    'wake-on-bus-crime': {
      type: 'passage',
      title: 'prologue.wake-on-bus-crime.title',
      text: 'prologue.wake-on-bus-crime.text',
      next: 'wake-voice',
    },
    'wake-on-bus-peace': {
      type: 'passage',
      title: 'prologue.wake-on-bus-peace.title',
      text: 'prologue.wake-on-bus-peace.text',
      next: 'wake-voice',
    },
    'wake-voice': {
      type: 'passage',
      title: 'prologue.wake-voice.title',
      characterId: CharacterId.maleVoice,
      text: 'prologue.wake-voice.text',
      next: 'wake-on-bus',
    },
    'wake-on-bus': {
      type: 'passage',
      backgroundImage: 'metro_crowded',
      text: 'prologue.wake-on-bus.text',
      next: 'jo-offer',
    },
    'jo-offer': {
      type: 'passage',
      lines: [
        {
          characterId: CharacterId.jo,
          text: 'prologue.jo-offer.lines.0',
        },
        {
          text: 'prologue.jo-offer.lines.1',
        },
        {
          characterId: CharacterId.jo,
          text: 'prologue.jo-offer.lines.2',
        },
      ],
      next: 'drink-offer',
    },
    'drink-offer': {
      type: 'passage',
      text: 'prologue.drink-offer.text',
      choices: [
        {
          id: 'accept-drink',
          label: 'prologue.drink-offer.choices.accept-drink',
          next: 'accepted-drink',
          consequences: [
            {
              type: 'temporaryStatus',
              value: {
                energy: 1,
              },
            },
          ],
        },
        {
          id: 'refuse-drink',
          label: 'prologue.drink-offer.choices.refuse-drink',
          next: 'refused-drink',
        },
      ],
    },
    'accepted-drink': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.accepted-drink.lines.0',
        },
        {
          text: 'prologue.accepted-drink.lines.1',
        },
      ],
      next: 'riding-bus',
    },
    'refused-drink': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.refused-drink.lines.0',
        },
        {
          text: 'prologue.refused-drink.lines.1',
        },
      ],
      next: 'riding-bus',
    },
    'riding-bus': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.riding-bus.lines.0',
        },
        {
          text: 'prologue.riding-bus.lines.1',
        },
        {
          text: 'prologue.riding-bus.lines.2',
        },
        {
          text: 'prologue.riding-bus.lines.3',
        },
      ],
      next: 'jo-offer-service',
    },
    'jo-offer-service': {
      type: 'passage',
      choices: [
        {
          id: 'continue-dialog-with-jo',
          label: 'prologue.jo-offer-service.choices.continue-dialog-with-jo',
          next: 'jo-answer',
        },
        {
          id: 'ask-about-service',
          label: 'prologue.jo-offer-service.choices.ask-about-service',
          next: 'jo-job-first-answer',
          once: true,
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.askedJoAboutService,
            },
          ],
        },
      ],
    },
    'jo-job-first-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'prologue.jo-job-first-answer.text',
      next: 'jo-job-first-answer-part-2',
    },
    'jo-job-first-answer-part-2': {
      type: 'passage',
      text: 'prologue.jo-job-first-answer-part-2.text',
      next: 'jo-offer-service',
    },
    'jo-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'prologue.jo-answer.text',
      next: 'jo-job-talk',
    },
    'jo-job-talk': {
      type: 'passage',
      choices: [
        {
          id: 'what-history',
          label: 'prologue.jo-job-talk.choices.what-history',
          next: 'jo-client-history-answer',
        },
        {
          id: 'who-is-the-client',
          label: 'prologue.jo-job-talk.choices.who-is-the-client',
          once: true,
          next: 'jo-client-answer',
        },
        {
          id: 'why-client-wants',
          label: 'prologue.jo-job-talk.choices.why-client-wants',
          once: true,
          next: 'jo-client-why-wants-answer',
        },
      ],
    },
    'jo-client-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'prologue.jo-client-answer.text',
      next: 'jo-job-talk',
    },
    'jo-client-why-wants-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'prologue.jo-client-why-wants-answer.text',
      next: 'jo-job-talk',
    },
    'jo-client-history-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'prologue.jo-client-history-answer.text',
      choices: [
        {
          id: 'i-ll-think',
          label: 'prologue.jo-client-history-answer.choices.i-ll-think',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.answerYesToJoCase,
            },
          ],
          next: 'approaching-line',
        },
        {
          id: 'not-sure',
          label: 'prologue.jo-client-history-answer.choices.not-sure',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.answerNoToJoCase,
            },
          ],
          next: 'approaching-line',
        },
      ],
    },
    'approaching-line': {
      type: 'passage',
      text: 'prologue.approaching-line.text',
      next: 'approaching-line-gus-blocked',
      backgroundImage: 'building_turnstiles',
    },
    'approaching-line-gus-blocked': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.approaching-line-gus-blocked.lines.0',
        },
        {
          text: 'prologue.approaching-line-gus-blocked.lines.1',
        },
        {
          text: 'prologue.approaching-line-gus-blocked.lines.2',
          characterId: CharacterId.gus,
        },
        {
          text: 'prologue.approaching-line-gus-blocked.lines.3',
        },
        {
          text: 'prologue.approaching-line-gus-blocked.lines.4',
        },
        {
          characterId: CharacterId.gus,
          text: 'prologue.approaching-line-gus-blocked.lines.5',
        },
        {
          characterId: CharacterId.securityGuard,
          text: 'prologue.approaching-line-gus-blocked.lines.6',
          portraitPosition: 'left',
        },
        {
          characterId: CharacterId.gus,
          text: 'prologue.approaching-line-gus-blocked.lines.7',
        },
        {
          characterId: CharacterId.securityGuard,
          text: 'prologue.approaching-line-gus-blocked.lines.8',
          portraitPosition: 'left',
        },
        {
          text: 'prologue.approaching-line-gus-blocked.lines.9',
        },
        {
          text: 'prologue.approaching-line-gus-blocked.lines.10',
        },
        {
          characterId: CharacterId.gus,
          text: 'prologue.approaching-line-gus-blocked.lines.11',
        },
      ],
      choices: [
        {
          id: 'dont-look',
          label: 'prologue.approaching-line-gus-blocked.choices.dont-look',
          next: 'dont-look-answer',
          isQuickChoice: true,
          consequences: [{ type: 'flag', value: StoryFlag.dontLookAtGus }],
        },
        {
          id: 'dont-react',
          label: 'prologue.approaching-line-gus-blocked.choices.dont-react',
          next: 'dont-react-answer',
          isQuickChoice: true,
          consequences: [{ type: 'flag', value: StoryFlag.dontReactToGus }],
        },
        {
          id: 'focus',
          label: 'prologue.approaching-line-gus-blocked.choices.focus',
          next: 'focus-answer',
          isQuickChoice: true,
          consequences: [{ type: 'flag', value: StoryFlag.focusOnGus }],
        },
      ],
    },
    'dont-look-answer': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'prologue.dont-look-answer.text',
      next: 'gus-approaching',
    },
    'dont-react-answer': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'prologue.dont-react-answer.text',
      next: 'gus-approaching',
    },
    'focus-answer': {
      type: 'passage',
      lines: [
        { text: 'prologue.focus-answer.lines.0' },
        {
          characterId: CharacterId.gus,
          text: 'prologue.focus-answer.lines.1',
        },
      ],
      next: 'gus-approaching',
    },
    'gus-approaching': {
      type: 'passage',
      text: 'prologue.gus-approaching.text',
    },
  },
} satisfies IStoryChapter;
