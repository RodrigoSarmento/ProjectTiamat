import type { IStoryChapter } from '../Story.types';
import { CharacterId } from '../characters';

export const prologoChapter = {
  id: 'prologo',
  entry: 'cena-00',
  nodes: {
    'cena-00': {
      type: 'passage',
      text: 'prologo.cena-00.text',
      next: 'cena-01',
    },
    'cena-01': {
      type: 'passage',
      lines: [
        {
          text: 'prologo.cena-01.lines.0',
        },
        {
          text: 'prologo.cena-01.lines.1',
        },
        {
          text: 'prologo.cena-01.lines.2',
        },
        {
          text: 'prologo.cena-01.lines.3',
          characterId: CharacterId.maleVoice,
        },
      ],
    },
  },
} satisfies IStoryChapter;
