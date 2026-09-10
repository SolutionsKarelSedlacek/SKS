import React, { useMemo, useState } from 'react';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/karel_clean.png`;

type StoryItem = {
  text: string;
  image: string;
};

const story: StoryItem[] = [
  { text: 'Byl jednou jeden Karel...', image: `${publicBaseUrl}/karel_stoji.png` },
  { text: 'ten neuměl stát...', image: `${publicBaseUrl}/karel_stoji.png` },
  { text: '', image: `${publicBaseUrl}/karel_nestoji.png` },
];

type PeopleOfKarlopolisPageProps = {
  onBack: () => void;
};

const PeopleOfKarlopolisPage: React.FC<PeopleOfKarlopolisPageProps> = ({ onBack }) => {
  const [index, setIndex] = useState(0);

  const current = useMemo(() => story[index] ?? story[0], [index]);
  const hasLeftArrow = index > 0;
  const hasRightArrow = index < story.length - 1;

  const goNext = () => {
    setIndex((value) => Math.min(value + 1, story.length - 1));
  };

  const goPrevious = () => {
    setIndex((value) => Math.max(value - 1, 0));
  };

  return (
    <div>
      <img src={background} alt="Karel Sedláček" className="hero-img" />
      <img src={current.image} alt="Karlopolis" className="hero-img" />

      <button type="button" className="info-back people-back" onClick={onBack} aria-label="Zpět na domovskou stránku">
        ← Zpět
      </button>

      <div className="people-controls">
        {hasLeftArrow && (
          <button type="button" className="people-arrow people-arrow-left" onClick={goPrevious} aria-label="Další">
            ←
          </button>
        )}

        {hasRightArrow && (
          <button type="button" className="people-arrow people-arrow-right" onClick={goNext} aria-label="Předchozí">
            →
          </button>
        )}
      </div>

      <p className="hero-date people-text">{current.text}</p>
    </div>
  );
};

export default PeopleOfKarlopolisPage;