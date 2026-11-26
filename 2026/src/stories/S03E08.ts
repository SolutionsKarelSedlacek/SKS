import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const s03e08OrbVideoId = '3C5ofWfcuHw';

export const s03e08Story: StoryItem[] = [
  {
    text: 'Brzy doplníme plný příběh.',
    image: `${publicBaseUrl}/karel_clean.png`,
    youtubeId: s03e08OrbVideoId,
  },
  { text: 'S03E07 - Femme fatale', image: `${publicBaseUrl}/blackscreen.png` },
  {
    text: 'Tahle epizoda je ve vývoji.',
    image: `${publicBaseUrl}/avatar_karel.png`,
  },
];