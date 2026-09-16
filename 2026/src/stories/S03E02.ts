import { StoryItem } from './types';

const publicBaseUrl = process.env.PUBLIC_URL || '';

export const s03e02Story: StoryItem[] = [
  { text: 'S03E02 - Karlopolis tě zahltí', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Tahle epizoda je zatím ve vývoji.', image: `${publicBaseUrl}/avatar_karel.png` },
  { text: 'Brzy doplníme plný příběh.', image: `${publicBaseUrl}/karel_clean.png` },
];
