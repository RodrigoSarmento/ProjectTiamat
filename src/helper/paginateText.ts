const wrapWords = (text: string, maxCharsPerLine: number): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';

  const pushHardWrapped = (word: string) => {
    let rest = word;
    while (rest.length > maxCharsPerLine) {
      lines.push(rest.slice(0, maxCharsPerLine));
      rest = rest.slice(maxCharsPerLine);
    }
    current = rest;
  };

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      current = next;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    if (word.length > maxCharsPerLine) {
      pushHardWrapped(word);
    } else {
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
};

export const paginateText = (
  text: string,
  maxLines: number,
  maxCharsPerLine: number,
): string[] => {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const lines: string[] = [];
  paragraphs.forEach((paragraph, index) => {
    if (index > 0) {
      lines.push('');
    }
    lines.push(...wrapWords(paragraph, maxCharsPerLine));
  });

  if (lines.length === 0) {
    return [''];
  }

  const pages: string[] = [];
  for (let index = 0; index < lines.length; index += maxLines) {
    const pageLines = lines.slice(index, index + maxLines);
    if (pageLines[0] === '') {
      pageLines.shift();
    }
    pages.push(pageLines.join('\n'));
  }

  return pages.filter((page) => page.length > 0);
};
