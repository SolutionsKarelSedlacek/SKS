import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const s03e05OrbVideoId = '_imAKpSBcKA';

export const s03e05Story: StoryItem[] = [
  {
    text: 'Brzy doplníme plný příběh.',
    image: `${publicBaseUrl}/karel_clean.png`,
    youtubeId: s03e05OrbVideoId,
  },
  { text: 'S03E04 - Kluk co chtěl být astronaut', image: `${publicBaseUrl}/blackscreen.png` },
  {
    text: 'Tahle epizoda je ve vývoji.',
    image: `${publicBaseUrl}/avatar_karel.png`,
  },
];