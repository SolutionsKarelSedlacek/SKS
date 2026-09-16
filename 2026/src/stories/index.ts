import { s03e01Story } from './S03E01';
import { s03e02Story } from './S03E02';
import { StoryItem } from './types';

export const storiesByEpisodeId: Record<string, StoryItem[]> = {
  S03E01: s03e01Story,
  S03E02: s03e02Story,
};

export const getStoryByEpisodeId = (episodeId: string | null): StoryItem[] | null => {
  if (!episodeId) {
    return null;
  }

  return storiesByEpisodeId[episodeId] ?? null;
};
