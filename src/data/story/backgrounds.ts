import type { ImageSourcePropType } from 'react-native';

export const STORY_BACKGROUND_IMAGES = {
  gameplay_page: require('@assets/backgrounds/gameplay_page.png'),
} as const;

export type StoryBackgroundImageId = keyof typeof STORY_BACKGROUND_IMAGES;

export const getStoryBackgroundImage = (
  id?: string,
): ImageSourcePropType | undefined => {
  if (!id || !(id in STORY_BACKGROUND_IMAGES)) {
    return undefined;
  }
  return STORY_BACKGROUND_IMAGES[id as StoryBackgroundImageId];
};
