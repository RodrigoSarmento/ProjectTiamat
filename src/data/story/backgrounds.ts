import type { ImageSourcePropType } from 'react-native';

export const STORY_BACKGROUND_IMAGES = {
  gameplay_page: require('@assets/backgrounds/gameplay_page.png'),
} as const;

export type StoryBackgroundImageId = keyof typeof STORY_BACKGROUND_IMAGES;

export const getStoryBackgroundImage = (
  id?: StoryBackgroundImageId,
): ImageSourcePropType | undefined => {
  if (!id) {
    return undefined;
  }
  return STORY_BACKGROUND_IMAGES[id];
};
