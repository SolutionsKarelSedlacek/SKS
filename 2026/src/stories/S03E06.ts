import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const s03e06OrbVideoId = 'J8TKl6VQ2D8';

export const s03e06Story: StoryItem[] = [
  {
    text: 'Brzy doplníme plný příběh.',
    image: `${publicBaseUrl}/karel_clean.png`,
    youtubeId: s03e06OrbVideoId,
  },
  { text: 'S03E05 - Stará ZOO', image: `${publicBaseUrl}/blackscreen.png` },
  {
    text: 'Tahle epizoda je ve vývoji.',
    image: `${publicBaseUrl}/avatar_karel.png`,
  },
];