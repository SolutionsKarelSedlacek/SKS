import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const s03e04OrbVideoId = '2knMkQdvKEM';

export const s03e04Story: StoryItem[] = [
  {
    text: 'Brzy doplníme plný příběh.',
    image: `${publicBaseUrl}/karel_clean.webp`,
    youtubeId: s03e04OrbVideoId,
  },
  { text: 'S03E03 - Staré dobré pivo', image: `${publicBaseUrl}/blackscreen.webp` },
	{ bg: true, text: 'Ten den v Karlopolisu pršelo od oběda. Tramvaje za oknem zvonily o křižovatku dřív než obvykle. Vzduch byl cítit šedou barvou.', image: `${publicBaseUrl}/raining.webp` },
  {
    text: 'Tahle epizoda je ve vývoji.',
    image: `${publicBaseUrl}/avatar_karel.webp`,
  },
];