import { s03e01Story } from './S03E01';
import { s03e03Story } from './S03E03';
import { s03e04Story } from './S03E04';
import { s03e05Story } from './S03E05';
import { s03e06Story } from './S03E06';
import { s03e07Story } from './S03E07';
import { s03e08Story } from './S03E08';
import { s03e09Story } from './S03E09';
import { StoryItem } from './types';

export const storiesByEpisodeId: Record<string, StoryItem[]> = {
  S03E01: s03e01Story,
  S03E02: s03e03Story,
  S03E03: s03e04Story,
  S03E04: s03e05Story,
  S03E05: s03e06Story,
  S03E06: s03e07Story,
  S03E07: s03e08Story,
  S03E08: s03e09Story,
};

export const getStoryByEpisodeId = (episodeId: string | null): StoryItem[] | null => {
  if (!episodeId) {
    return null;
  }

  return storiesByEpisodeId[episodeId] ?? null;
};
