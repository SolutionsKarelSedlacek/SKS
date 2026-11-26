import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const s03e07OrbVideoId = '7TlOSYyy7nw';

export const s03e07Story: StoryItem[] = [
  {
    text: 'Brzy doplníme plný příběh.',
    image: `${publicBaseUrl}/karel_clean.png`,
    youtubeId: s03e07OrbVideoId,
  },
  { text: 'S03E06 - Rorschach', image: `${publicBaseUrl}/blackscreen.png` },
  {
    text: 'Tahle epizoda je ve vývoji.',
    image: `${publicBaseUrl}/avatar_karel.png`,
  },
];