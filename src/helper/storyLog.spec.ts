import { STORY_LOG_LIMIT, appendStoryLog, toStoryLogEntry } from './storyLog';

describe('appendStoryLog', () => {
  it('ignores a consecutive duplicate and keeps only the latest entries', () => {
    const first = { key: 'a:0', nodeId: 'a', text: 'one' };
    const second = { key: 'b:0', nodeId: 'b', text: 'two' };

    expect(appendStoryLog([first], first)).toEqual([first]);

    const filled = Array.from({ length: STORY_LOG_LIMIT }, (_, index) => ({
      key: `n:${index}`,
      nodeId: 'n',
      text: String(index),
    }));
    expect(appendStoryLog(filled, second)).toEqual([
      ...filled.slice(1),
      second,
    ]);
  });
});

describe('toStoryLogEntry', () => {
  it('keys a narrator page by node and index', () => {
    expect(
      toStoryLogEntry(
        {
          kind: 'narrator',
          title: 'TELA PRETA - Sonhando',
          text: 'De olhos fechados.',
        },
        'dreaming',
        0,
      ),
    ).toEqual({
      key: 'dreaming:0',
      nodeId: 'dreaming',
      speaker: undefined,
      title: 'TELA PRETA - Sonhando',
      text: 'De olhos fechados.',
    });
  });
});
