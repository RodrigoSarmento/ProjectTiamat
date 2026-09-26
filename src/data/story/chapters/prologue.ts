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
      //TODO: Maybe we could add an animation showing this board instead of having the text
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
      choices: [
        {
          id: 'help-gus',
          label: 'prologue.gus-approaching.choices.help-gus',
          consequences: [{ type: 'flag', value: StoryFlag.helpedGus }],
          next: 'try-to-help-gus',
        },
        {
          id: 'explain-to-gus-you-are-not-from-the-maintenance',
          label:
            'prologue.gus-approaching.choices.explain-to-gus-you-are-not-from-the-maintenance',
          next: 'explain-to-gus-you-are-not-from-the-maintenance',
        },
      ],
    },
    'explain-to-gus-you-are-not-from-the-maintenance': {
      type: 'passage',
      text: 'prologue.explain-to-gus-you-are-not-from-the-maintenance.text',
      characterId: CharacterId.gus,
      choices: [
        {
          id: 'help-gus',
          label:
            'prologue.explain-to-gus-you-are-not-from-the-maintenance.choices.help-gus',
          consequences: [{ type: 'flag', value: StoryFlag.helpedGus }],
          next: 'try-to-help-gus',
        },
        {
          id: 'say-no-to-gus',
          label:
            'prologue.explain-to-gus-you-are-not-from-the-maintenance.choices.say-no-to-gus',
          consequences: [{ type: 'flag', value: StoryFlag.sayNoToGus }],
          next: 'choose-to-not-help-gus',
        },
      ],
    },
    'choose-to-not-help-gus': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.choose-to-not-help-gus.lines.0',
        },
        {
          characterId: CharacterId.gus,
          text: 'prologue.choose-to-not-help-gus.lines.1',
        },
        {
          text: 'prologue.choose-to-not-help-gus.lines.2',
        },
        {
          text: 'prologue.choose-to-not-help-gus.lines.3',
        },
        {
          text: 'prologue.choose-to-not-help-gus.lines.4',
        },
      ],
      startCharCreation: true,
    },
    'try-to-help-gus': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.try-to-help-gus.lines.0',
        },
        {
          text: 'prologue.try-to-help-gus.lines.1',
        },
        {
          characterId: CharacterId.gus,
          text: 'prologue.try-to-help-gus.lines.2',
        },
      ],
      choices: [
        {
          once: true,
          id: 'force-passage',
          label: 'prologue.try-to-help-gus.choices.force-passage',
          rollDice: {
            attribute: 'strength',
            minToPass: 10,
            success: {
              next: 'force-passage-success',
              consequences: [
                { type: 'flag', value: StoryFlag.helpedGusWithForcePassage },
              ],
            },
            failure: { next: 'force-passage-failure' },
          },
        },
        {
          once: true,
          id: 'hack-terminal',
          label: 'prologue.try-to-help-gus.choices.hack-terminal',
          rollDice: {
            attribute: 'intelligence',
            minToPass: 10,
            success: {},
            failure: {},
          },
        },
        {
          once: true,
          id: 'use-card',
          label: 'prologue.try-to-help-gus.choices.use-card',
          next: 'use-card-response',
        },
      ],
    },
    'use-card-response': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.use-card-response.lines.0',
        },
        {
          text: 'prologue.use-card-response.lines.1',
        },
      ],
      choices: [
        {
          id: 'use-card-confirm',
          label: 'prologue.use-card-response.choices.use-card-confirm',
          consequences: [{ type: 'flag', value: StoryFlag.useCardToHelpGus }],
        },
        {
          id: 'rethink',
          label: 'prologue.use-card-response.choices.rethink',
          next: 'rethink-use-card',
          consequences: [{ type: 'flag', value: StoryFlag.sayNoToGus }],
        },
      ],
    },
    'rethink-use-card': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.rethink-use-card.lines.0',
        },
        {
          text: 'prologue.rethink-use-card.lines.1',
          characterId: CharacterId.you,
        },
        {
          text: 'prologue.rethink-use-card.lines.2',
          characterId: CharacterId.gus,
        },
      ],
    },
    'use-card-confirm': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.use-card-confirm.lines.0',
          characterId: CharacterId.gus,
        },
        {
          text: 'prologue.use-card-confirm.lines.1',
        },
        {
          text: 'prologue.use-card-confirm.lines.2',
        },
        {
          text: 'prologue.use-card-confirm.lines.3',
          characterId: CharacterId.gus,
        },
        {
          text: 'prologue.use-card-confirm.lines.4',
          characterId: CharacterId.jo,
          portraitPosition: 'left',
        },
        {
          text: 'prologue.use-card-confirm.lines.5',
        },
        {
          text: 'prologue.use-card-confirm.lines.6',
        },
        {
          text: 'prologue.use-card-confirm.lines.7',
        },
      ],
      startCharCreation: true,
    },
    'force-passage-success': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.force-passage-success.lines.0',
        },
        {
          text: 'prologue.force-passage-success.lines.1',
          characterId: CharacterId.gus,
        },
        {
          text: 'prologue.force-passage-success.lines.2',
          characterId: CharacterId.jo,
          portraitPosition: 'left',
        },
        {
          text: 'prologue.force-passage-success.lines.3',
        },
        {
          text: 'prologue.force-passage-success.lines.4',
        },
        {
          text: 'prologue.force-passage-success.lines.5',
        },
      ],
      startCharCreation: true,
    },
    'force-passage-failure': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'prologue.force-passage-failure.text',
      choices: [
        {
          id: 'ignore-gus-and-force-it',
          label:
            'prologue.force-passage-failure.choices.ignore-gus-and-force-it',
          rollDice: {
            attribute: 'strength',
            minToPass: 15,
            success: {
              next: 'force-passage-success',
              consequences: [
                { type: 'flag', value: StoryFlag.helpedGusWithForcePassage },
              ],
            },
            failure: {
              next: 'force-passage-failure-twice',
              consequences: [
                { type: 'temporaryStatus', value: { energy: -2 } },
                {
                  type: 'flag',
                  value: StoryFlag.tryToForcePassageFailureTwice,
                },
              ],
            },
          },
        },
        {
          id: 'rethink-the-issue',
          label: 'prologue.force-passage-failure.choices.rethink-the-issue',
          next: 'rethink-the-forcing-passage',
        },
      ],
    },
    'rethink-the-forcing-passage': {
      type: 'passage',
      text: 'prologue.rethink-the-forcing-passage.text',
      next: 'try-to-help-gus',
    },
    'force-passage-failure-twice': {
      type: 'passage',
      lines: [
        {
          text: 'prologue.force-passage-failure-twice.lines.0',
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.1',
          characterId: CharacterId.you,
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.2',
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.3',
          characterId: CharacterId.you,
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.4',
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.5',
          characterId: CharacterId.you,
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.6',
        },
        {
          text: 'prologue.force-passage-failure-twice.lines.7',
          characterId: CharacterId.gus,
        },
      ],
    },
  },
} satisfies IStoryChapter;
