import {
  DIALOGUE_FONT_SIZE,
  DIALOGUE_HORIZONTAL_PADDING,
} from '@components/dialogue';
import {
  NARRATOR_FONT_SIZE,
  NARRATOR_HORIZONTAL_PADDING,
} from '@components/narrator-text';
import { Common } from '@styles';

export { DIALOGUE_MAX_LINES } from '@components/dialogue';
export { NARRATOR_MAX_LINES } from '@components/narrator-text';

const CHAR_WIDTH_RATIO = 0.55;

const charsPerLine = (fontSize: number, horizontalPadding: number) =>
  Math.max(
    20,
    Math.floor(
      (Common.screenWidth - horizontalPadding) / (fontSize * CHAR_WIDTH_RATIO),
    ),
  );

export const NARRATOR_CHARS_PER_LINE = charsPerLine(
  NARRATOR_FONT_SIZE,
  NARRATOR_HORIZONTAL_PADDING,
);
export const DIALOGUE_CHARS_PER_LINE = charsPerLine(
  DIALOGUE_FONT_SIZE,
  DIALOGUE_HORIZONTAL_PADDING,
);
