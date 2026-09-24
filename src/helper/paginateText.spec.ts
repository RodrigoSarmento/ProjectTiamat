import { paginateText } from './paginateText';

describe('paginateText', () => {
  it('keeps short text on a single page', () => {
    expect(paginateText('A short line.', 10, 40)).toEqual(['A short line.']);
  });

  it('wraps words that exceed the line width', () => {
    expect(paginateText('one two three four', 10, 9)).toEqual([
      'one two\nthree\nfour',
    ]);
  });

  it('splits into another page when line count is exceeded', () => {
    expect(paginateText('one two three four', 2, 9)).toEqual([
      'one two\nthree',
      'four',
    ]);
  });

  it('keeps paragraph breaks and paginates across them', () => {
    const pages = paginateText(
      'First paragraph is long enough.\n\nSecond paragraph follows.',
      2,
      18,
    );

    expect(pages.length).toBeGreaterThan(1);
    expect(pages[0]).toContain('First paragraph');
    expect(pages.join('\n')).toContain('Second paragraph');
  });

  it('hard-wraps a word longer than the line', () => {
    expect(paginateText('supercalifragilistic', 10, 8)).toEqual([
      'supercal\nifragili\nstic',
    ]);
  });
});
