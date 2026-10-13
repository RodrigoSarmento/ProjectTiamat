import { SOUND_EFFECT_FILE, SOUND_FILE_BACKGROUNDS } from '@hooks/use-sound';

import type { IStoryChapter } from '../Story.types';
import { CharacterId } from '../characters';
import { StoryFlag } from '../flags';

export const firstActCitizenChapter = {
  id: 'first-act-citizen',
  entry: 'dreaming',
  nodes: {
    dreaming: {
      type: 'passage',
      title: 'first-act-citizen.dreaming.title',
      backgroundColor: 'black',
      text: 'first-act-citizen.dreaming.text',
      choices: [
        {
          id: 'corporate',
          label: 'first-act-citizen.dreaming.choices.corporate',
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
          label: 'first-act-citizen.dreaming.choices.financial',
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
          label: 'first-act-citizen.dreaming.choices.crime',
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
          label: 'first-act-citizen.dreaming.choices.peace',
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
      title: 'first-act-citizen.wake-on-bus-corporate.title',
      text: 'first-act-citizen.wake-on-bus-corporate.text',
      next: 'wake-voice',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.corporate,
      },
    },
    'wake-on-bus-financial': {
      type: 'passage',
      title: 'first-act-citizen.wake-on-bus-financial.title',
      text: 'first-act-citizen.wake-on-bus-financial.text',
      next: 'wake-voice',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.financial,
      },
    },
    'wake-on-bus-crime': {
      type: 'passage',
      title: 'first-act-citizen.wake-on-bus-crime.title',
      text: 'first-act-citizen.wake-on-bus-crime.text',
      next: 'wake-voice',
    },
    'wake-on-bus-peace': {
      type: 'passage',
      title: 'first-act-citizen.wake-on-bus-peace.title',
      text: 'first-act-citizen.wake-on-bus-peace.text',
      next: 'wake-voice',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.peace,
      },
    },
    'wake-voice': {
      type: 'passage',
      title: 'first-act-citizen.wake-voice.title',
      characterId: CharacterId.maleVoice,
      text: 'first-act-citizen.wake-voice.text',
      next: 'wake-on-bus',
    },
    'wake-on-bus': {
      type: 'passage',
      backgroundImage: 'metro_crowded',
      text: 'first-act-citizen.wake-on-bus.text',
      next: 'jo-offer',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.metro,
      },
    },
    'jo-offer': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.jo-offer.lines.0',
          characterId: CharacterId.jo,
        },
        {
          text: 'first-act-citizen.jo-offer.lines.1',
        },
        {
          text: 'first-act-citizen.jo-offer.lines.2',
          characterId: CharacterId.jo,
        },
      ],
      next: 'drink-offer',
    },
    'drink-offer': {
      type: 'passage',
      text: 'first-act-citizen.drink-offer.text',
      choices: [
        {
          id: 'accept-drink',
          label: 'first-act-citizen.drink-offer.choices.accept-drink',
          next: 'accepted-drink',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.openCan,
          },
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
          label: 'first-act-citizen.drink-offer.choices.refuse-drink',
          next: 'refused-drink',
        },
      ],
    },
    'accepted-drink': {
      type: 'passage',
      text: 'first-act-citizen.accepted-drink.text',
      next: 'bus-system-message',
    },
    'refused-drink': {
      type: 'passage',
      text: 'first-act-citizen.refused-drink.text',
      next: 'bus-system-message',
      dispatchNewSound: {
        soundType: 'effect',
        soundFile: SOUND_EFFECT_FILE.crashCan,
      },
    },
    'bus-system-message': {
      type: 'passage',
      characterId: CharacterId.busSystem,
      text: 'first-act-citizen.bus-system-message.text',
      next: 'riding-bus',
    },
    'riding-bus': {
      //TODO: Maybe we could add an animation showing this board instead of having the text
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.riding-bus.lines.0',
        },
        {
          text: 'first-act-citizen.riding-bus.lines.1',
        },
        {
          text: 'first-act-citizen.riding-bus.lines.2',
        },
        {
          text: 'first-act-citizen.riding-bus.lines.3',
        },
      ],
      next: 'jo-offer-service',
    },
    'jo-offer-service': {
      type: 'passage',
      choices: [
        {
          id: 'continue-dialog-with-jo',
          label: 'first-act-citizen.jo-offer-service.choices.continue-dialog-with-jo',
          next: 'jo-answer',
        },
        {
          id: 'ask-about-service',
          label: 'first-act-citizen.jo-offer-service.choices.ask-about-service',
          next: 'jo-job-first-answer',
          optional: true,
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.askedJoAboutService,
            },
          ],
        },
      ],
    },
    'jo-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'first-act-citizen.jo-answer.text',
      next: 'jo-job-talk',
    },
    'jo-job-first-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'first-act-citizen.jo-job-first-answer.text',
      next: 'jo-job-first-answer-part-2',
    },
    'jo-job-talk': {
      type: 'passage',
      choices: [
        {
          id: 'what-history',
          label: 'first-act-citizen.jo-job-talk.choices.what-history',
          next: 'jo-client-history-answer',
        },
        {
          id: 'who-is-the-client',
          label: 'first-act-citizen.jo-job-talk.choices.who-is-the-client',
          next: 'jo-client-answer',
          optional: true,
        },
        {
          id: 'why-client-wants',
          label: 'first-act-citizen.jo-job-talk.choices.why-client-wants',
          next: 'jo-client-why-wants-answer',
          optional: true,
        },
      ],
    },
    'jo-job-first-answer-part-2': {
      type: 'passage',
      text: 'first-act-citizen.jo-job-first-answer-part-2.text',
      next: 'jo-offer-service',
    },
    'jo-client-history-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'first-act-citizen.jo-client-history-answer.text',
      choices: [
        {
          id: 'i-ll-think',
          label: 'first-act-citizen.jo-client-history-answer.choices.i-ll-think',
          next: 'approaching-line',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.answerYesToJoCase,
            },
          ],
        },
        {
          id: 'not-sure',
          label: 'first-act-citizen.jo-client-history-answer.choices.not-sure',
          next: 'approaching-line',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.answerNoToJoCase,
            },
          ],
        },
      ],
    },
    'jo-client-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'first-act-citizen.jo-client-answer.text',
      next: 'jo-job-talk',
    },
    'jo-client-why-wants-answer': {
      type: 'passage',
      characterId: CharacterId.jo,
      text: 'first-act-citizen.jo-client-why-wants-answer.text',
      next: 'jo-job-talk',
    },
    'approaching-line': {
      type: 'passage',
      backgroundImage: 'building_turnstiles',
      text: 'first-act-citizen.approaching-line.text',
      next: 'approaching-line-gus-blocked',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.crowdedNoise,
      },
    },
    'approaching-line-gus-blocked': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.0',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.punch,
          },
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.1',
          characterId: CharacterId.terminal,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessDenied,
          },
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.2',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.punch,
          },
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.3',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.4',
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.5',
          characterId: CharacterId.terminal,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessDenied,
          },
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.6',
          characterId: CharacterId.terminal,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.warningOneMoreTry,
          },
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.7',
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.8',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.9',
          characterId: CharacterId.securityGuard,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.10',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.11',
          characterId: CharacterId.securityGuard,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.12',
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.13',
        },
        {
          text: 'first-act-citizen.approaching-line-gus-blocked.lines.14',
          characterId: CharacterId.gus,
        },
      ],
      choices: [
        {
          id: 'dont-look',
          label: 'first-act-citizen.approaching-line-gus-blocked.choices.dont-look',
          next: 'dont-look-answer',
          isQuickChoice: true,
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dontLookAtGus,
            },
          ],
        },
        {
          id: 'dont-react',
          label: 'first-act-citizen.approaching-line-gus-blocked.choices.dont-react',
          next: 'dont-react-answer',
          isQuickChoice: true,
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.dontReactToGus,
            },
          ],
        },
        {
          id: 'focus',
          label: 'first-act-citizen.approaching-line-gus-blocked.choices.focus',
          next: 'focus-answer',
          isQuickChoice: true,
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.focusOnGus,
            },
          ],
        },
      ],
    },
    'dont-look-answer': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'first-act-citizen.dont-look-answer.text',
      next: 'gus-approaching',
    },
    'dont-react-answer': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'first-act-citizen.dont-react-answer.text',
      next: 'gus-approaching',
    },
    'focus-answer': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.focus-answer.lines.0',
        },
        {
          text: 'first-act-citizen.focus-answer.lines.1',
          characterId: CharacterId.gus,
        },
      ],
      next: 'gus-approaching',
    },
    'gus-approaching': {
      type: 'passage',
      text: 'first-act-citizen.gus-approaching.text',
      choices: [
        {
          id: 'help-gus',
          label: 'first-act-citizen.gus-approaching.choices.help-gus',
          next: 'try-to-help-gus',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.helpedGus,
            },
          ],
        },
        {
          id: 'explain-to-gus-you-are-not-from-the-maintenance',
          label: 'first-act-citizen.gus-approaching.choices.explain-to-gus-you-are-not-from-the-maintenance',
          next: 'explain-to-gus-you-are-not-from-the-maintenance',
        },
      ],
    },
    'try-to-help-gus': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.try-to-help-gus.lines.0',
        },
        {
          text: 'first-act-citizen.try-to-help-gus.lines.1',
          characterId: CharacterId.terminal,
        },
        {
          text: 'first-act-citizen.try-to-help-gus.lines.2',
        },
        {
          text: 'first-act-citizen.try-to-help-gus.lines.3',
          characterId: CharacterId.gus,
        },
      ],
      choices: [
        {
          id: 'force-passage',
          label: 'first-act-citizen.try-to-help-gus.choices.force-passage',
          once: true,
          rollDice: {
            attribute: 'strength',
            minToPass: 10,
            success: {
              next: 'force-passage-success',
              consequences: [
                {
                  type: 'flag',
                  value: StoryFlag.helpedGusWithForcePassage,
                },
              ],
            },
            failure: {
              next: 'force-passage-failure',
            },
          },
        },
        {
          id: 'hack-terminal',
          label: 'first-act-citizen.try-to-help-gus.choices.hack-terminal',
          next: 'prev-hack-terminal',
          once: true,
        },
        {
          id: 'use-card',
          label: 'first-act-citizen.try-to-help-gus.choices.use-card',
          next: 'use-card-response',
          optional: true,
        },
      ],
    },
    'explain-to-gus-you-are-not-from-the-maintenance': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'first-act-citizen.explain-to-gus-you-are-not-from-the-maintenance.text',
      choices: [
        {
          id: 'help-gus',
          label: 'first-act-citizen.explain-to-gus-you-are-not-from-the-maintenance.choices.help-gus',
          next: 'try-to-help-gus',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.helpedGus,
            },
          ],
        },
        {
          id: 'say-no-to-gus',
          label: 'first-act-citizen.explain-to-gus-you-are-not-from-the-maintenance.choices.say-no-to-gus',
          next: 'choose-to-not-help-gus',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.sayNoToGus,
            },
          ],
        },
      ],
    },
    'force-passage-success': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.force-passage-success.lines.0',
        },
        {
          text: 'first-act-citizen.force-passage-success.lines.1',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.force-passage-success.lines.2',
          characterId: CharacterId.jo,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-success.lines.3',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.metalLatchOpen,
          },
        },
        {
          text: 'first-act-citizen.force-passage-success.lines.4',
          characterId: CharacterId.terminal2,
        },
        {
          text: 'first-act-citizen.force-passage-success.lines.5',
        },
        {
          text: 'first-act-citizen.force-passage-success.lines.6',
          characterId: CharacterId.terminal2,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
    },
    'force-passage-failure': {
      type: 'passage',
      characterId: CharacterId.gus,
      text: 'first-act-citizen.force-passage-failure.text',
      choices: [
        {
          id: 'ignore-gus-and-force-it',
          label: 'first-act-citizen.force-passage-failure.choices.ignore-gus-and-force-it',
          rollDice: {
            attribute: 'strength',
            minToPass: 15,
            success: {
              next: 'force-passage-success-2',
              consequences: [
                {
                  type: 'flag',
                  value: StoryFlag.helpedGusWithForcePassage,
                },
              ],
            },
            failure: {
              next: 'force-passage-failure-twice',
              consequences: [
                {
                  type: 'temporaryStatus',
                  value: {
                    energy: -2,
                  },
                },
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
          label: 'first-act-citizen.force-passage-failure.choices.rethink-the-issue',
          next: 'rethink-the-forcing-passage',
        },
      ],
    },
    'prev-hack-terminal': {
      type: 'passage',
      text: 'first-act-citizen.prev-hack-terminal.text',
      choices: [
        {
          id: 'connect-to-terminal',
          label: 'first-act-citizen.prev-hack-terminal.choices.connect-to-terminal',
          rollDice: {
            attribute: 'technical_ability',
            minToPass: 10,
            success: {
              next: 'connect-to-terminal-success',
            },
            failure: {
              next: 'connect-to-terminal-failure',
              consequences: [
                {
                  type: 'flag',
                  value: StoryFlag.failedToHackTerminal,
                },
              ],
            },
          },
        },
        {
          id: 'rethink-problem',
          label: 'first-act-citizen.prev-hack-terminal.choices.rethink-problem',
          next: 'rethink-hacking',
        },
      ],
    },
    'use-card-response': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.use-card-response.lines.0',
        },
        {
          text: 'first-act-citizen.use-card-response.lines.1',
          characterId: CharacterId.terminal,
        },
      ],
      choices: [
        {
          id: 'use-card-confirm',
          label: 'first-act-citizen.use-card-response.choices.use-card-confirm',
          next: 'use-card-confirm',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.useCardToHelpGus,
            },
          ],
        },
        {
          id: 'rethink',
          label: 'first-act-citizen.use-card-response.choices.rethink',
          next: 'rethink-use-card',
          consequences: [
            {
              type: 'flag',
              value: StoryFlag.sayNoToGus,
            },
          ],
        },
      ],
    },
    'choose-to-not-help-gus': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.choose-to-not-help-gus.lines.0',
        },
        {
          text: 'first-act-citizen.choose-to-not-help-gus.lines.1',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.choose-to-not-help-gus.lines.2',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.metalLatchOpen,
          },
        },
        {
          text: 'first-act-citizen.choose-to-not-help-gus.lines.3',
          characterId: CharacterId.terminal2,
        },
        {
          text: 'first-act-citizen.choose-to-not-help-gus.lines.4',
        },
        {
          text: 'first-act-citizen.choose-to-not-help-gus.lines.5',
          characterId: CharacterId.terminal2,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
    },
    'force-passage-success-2': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.force-passage-success-2.lines.0',
        },
        {
          text: 'first-act-citizen.force-passage-success-2.lines.1',
        },
        {
          text: 'first-act-citizen.force-passage-success-2.lines.2',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.force-passage-success-2.lines.3',
        },
        {
          text: 'first-act-citizen.force-passage-success-2.lines.4',
          characterId: CharacterId.jo,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-success-2.lines.5',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.metalLatchOpen,
          },
        },
        {
          text: 'first-act-citizen.force-passage-success-2.lines.6',
          characterId: CharacterId.terminal2,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
    },
    'force-passage-failure-twice': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.0',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.1',
          characterId: CharacterId.you,
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.2',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.3',
          characterId: CharacterId.you,
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.4',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.5',
          characterId: CharacterId.you,
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.6',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.boneCrack,
          },
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.7',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.8',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.alarm,
          },
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.9',
          characterId: CharacterId.securityAgents,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.10',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.11',
          characterId: CharacterId.securityAgents,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.12',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.13',
          characterId: CharacterId.securityAgents,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.14',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.15',
          characterId: CharacterId.jo,
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.16',
          characterId: CharacterId.securityAgents,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.17',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.18',
          characterId: CharacterId.securityAgents,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.19',
        },
        {
          text: 'first-act-citizen.force-passage-failure-twice.lines.20',
          characterId: CharacterId.scanner,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
    },
    'rethink-the-forcing-passage': {
      type: 'passage',
      text: 'first-act-citizen.rethink-the-forcing-passage.text',
      next: 'try-to-help-gus',
      skipNextText: true,
    },
    'connect-to-terminal-success': {
      type: 'passage',
      backgroundImage: 'background_hacking',
      lines: [
        {
          text: 'first-act-citizen.connect-to-terminal-success.lines.0',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.plugCable,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success.lines.1',
        },
      ],
      next: 'connect-to-terminal-success-2',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.hacking,
      },
    },
    'connect-to-terminal-failure': {
      type: 'passage',
      backgroundImage: 'background_hacking',
      lines: [
        {
          text: 'first-act-citizen.connect-to-terminal-failure.lines.0',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.plugCable,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure.lines.1',
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure.lines.2',
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure.lines.3',
        },
      ],
      next: 'connect-to-terminal-failure-2',
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.hacking,
      },
    },
    'rethink-hacking': {
      type: 'passage',
      text: 'first-act-citizen.rethink-hacking.text',
      next: 'try-to-help-gus',
      skipNextText: true,
    },
    'use-card-confirm': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.use-card-confirm.lines.0',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.1',
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.2',
          characterId: CharacterId.terminal,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.3',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.metalLatchOpen,
          },
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.4',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.5',
          characterId: CharacterId.jo,
          portraitPosition: 'left',
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.6',
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.7',
          characterId: CharacterId.terminal2,
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.8',
        },
        {
          text: 'first-act-citizen.use-card-confirm.lines.9',
          characterId: CharacterId.terminal2,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
    },
    'rethink-use-card': {
      type: 'passage',
      lines: [
        {
          text: 'first-act-citizen.rethink-use-card.lines.0',
        },
        {
          text: 'first-act-citizen.rethink-use-card.lines.1',
          characterId: CharacterId.you,
        },
        {
          text: 'first-act-citizen.rethink-use-card.lines.2',
          characterId: CharacterId.gus,
        },
      ],
      next: 'try-to-help-gus',
      skipNextText: true,
    },
    'connect-to-terminal-success-2': {
      type: 'passage',
      backgroundImage: 'building_turnstiles',
      lines: [
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.0',
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.1',
          characterId: CharacterId.terminal,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.2',
          characterId: CharacterId.you,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.3',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.metalLatchOpen,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.4',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.5',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.unplugCable,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.6',
          characterId: CharacterId.jo,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.7',
        },
        {
          text: 'first-act-citizen.connect-to-terminal-success-2.lines.8',
          characterId: CharacterId.terminal2,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.crowdedNoise,
      },
    },
    'connect-to-terminal-failure-2': {
      type: 'passage',
      backgroundImage: 'building_turnstiles',
      lines: [
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.0',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.powerDown,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.1',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.2',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.computerPowerUp,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.3',
          characterId: CharacterId.terminal,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.4',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.metalLatchOpen,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.5',
          characterId: CharacterId.gus,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.6',
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.unplugCable,
          },
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.7',
          characterId: CharacterId.jo,
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.8',
        },
        {
          text: 'first-act-citizen.connect-to-terminal-failure-2.lines.9',
          characterId: CharacterId.terminal2,
          dispatchNewSound: {
            soundType: 'effect',
            soundFile: SOUND_EFFECT_FILE.accessGranted,
          },
        },
      ],
      startCharCreation: true,
      dispatchNewSound: {
        soundType: 'background',
        soundFile: SOUND_FILE_BACKGROUNDS.crowdedNoise,
      },
    },
  },
} satisfies IStoryChapter;
