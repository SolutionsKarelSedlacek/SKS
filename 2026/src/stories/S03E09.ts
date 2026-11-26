import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const s03e09OrbVideoId = 'j74_Q2KpKsw';

export const s03e09Story: StoryItem[] = [
  {
    text: 'Brzy doplníme plný příběh.',
    image: `${publicBaseUrl}/karel_clean.webp`,
    youtubeId: s03e09OrbVideoId,
  },
  { text: 'S03E08 - Staří známí', image: `${publicBaseUrl}/blackscreen.webp` },
  {
    text: 'Tahle epizoda je ve vývoji.',
    image: `${publicBaseUrl}/avatar_karel.webp`,
  },
];