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
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '...', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Kde to jsem?', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '...', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Co se stalo?', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '<zvuk kroků>', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '...', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Vstávej Karle.', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '...', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Kdo je Karel?', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '...', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Ošklivě jsi se praštil do hlavy.', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Kdo je Karel?', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Ty jsi Karel.', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'já...?', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '...já jsem Karel!', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'a sloužím lidem...', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Karlopolis!', image: `${publicBaseUrl}/karel_clean.png` },
  { text: '', image: `${publicBaseUrl}/karel_clean.png` },
  { text: '', image: `${publicBaseUrl}/evzen_open_eyes.png` },
  { text: 'Evžen?', image: `${publicBaseUrl}/evzen_open_eyes2.png` },
  { text: 'Ukaž, pomůžu ti se postavit na nohy.', image: `${publicBaseUrl}/evzen.png` },
  { text: 'Dávej pozor a pojď se mnou.', image: `${publicBaseUrl}/karel_clean.png` },
  { text: '', image: `${publicBaseUrl}/recursion.png` },
  { text: 'Silvester s Karlem Sedláčkem 2026.', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'S03E01 - Karel poznává svořitele', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '<dunění těžkých psací strojů>', image: `${publicBaseUrl}/blackscreen.png` },
  { text: 'Ty máš umpalumpy?', image: `${publicBaseUrl}/karel_clean.png` },
  { text: '<zvuk Evženova smíchu>', image: `${publicBaseUrl}/evzen.png` },
  { text: 'Ne, to jsou jen svobodní lidé Karlopolis.', image: `${publicBaseUrl}/evzen.png` },
  { text: 'Jejich hloupé nápady jim nepřekáží v tom co dělají.', image: `${publicBaseUrl}/evzen.png` },
  { text: 'A to jen díky tobě Karle.', image: `${publicBaseUrl}/evzen2.png` },
  { text: 'Okey... asi si je potřebuju připomenout?', image: `${publicBaseUrl}/karel_clean.png` },
  { text: 'Ale jistě!', image: `${publicBaseUrl}/evzen.png` },
  { text: 'Tohle je Tadedáš.', image: `${publicBaseUrl}/evzen2.png` },
  { text: 'Tadedáš.', image: `${publicBaseUrl}/tadeas.png` },
  { text: 'Tadedáš je přímočarej.', image: `${publicBaseUrl}/tadeas.png` },
  { text: 'Tohle je Ondra.', image: `${publicBaseUrl}/evzen3.png` },
  { text: 'O Ondrovi ještě uslyšíš.', image: `${publicBaseUrl}/ondra.png` },
  { text: 'Dalibora si musíš pamatovat. Jsme rádi, že se k nám vrátil.', image: `${publicBaseUrl}/evzen2.png` },
  { text: 'Dalibor.', image: `${publicBaseUrl}/dalibor.png` },
  { text: 'Tohle je Klátra.', image: `${publicBaseUrl}/evzen3.png` },
  { text: '', image: `${publicBaseUrl}/klatra.png` },
  { text: 'Klátra tu je, aby tu byl někdo schopnej.', image: `${publicBaseUrl}/klatra.png` },
  { text: 'A tohle je !.', image: `${publicBaseUrl}/karel_empty.png` },
  { text: 'Faktoriál je velmi zodpovědný...', image: `${publicBaseUrl}/fak1.png` },
  { text: '...je zodpovědný za většinu našich problémů.', image: `${publicBaseUrl}/fak2.png` },
  { text: '...', image: `${publicBaseUrl}/karel_clean.png` },
  { text: '...nějak se mi z toho točí hlava...', image: `${publicBaseUrl}/karel_clean.png` },
  { text: 'Ale tohle je pochopitilné Karle...', image: `${publicBaseUrl}/evzen.png` },
  { text: '...tohle si nemáš pamatovat.', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '<zvuk ticha>', image: `${publicBaseUrl}/blackscreen.png` },
  { text: '', image: `${publicBaseUrl}/blackscreen.png` },
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
    <div className="people-page">
      <img src={background} alt="Karel Sedláček" className="hero-img" />
      <img src={current.image} alt="Karlopolis" className="hero-img people-figure" />

      <button type="button" className="info-back people-back" onClick={onBack} aria-label="Zpět na domovskou stránku">
        ← Zpět
      </button>

      <div className="people-stage" aria-label="Přehled příběhu Karlopolisu">
        <div className="people-orbit" aria-hidden="true" />

        {hasLeftArrow && (
          <button type="button" className="people-arrow people-arrow-left" onClick={goPrevious} aria-label="Předchozí">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M40 16L20 32l20 16" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {hasRightArrow && (
          <button type="button" className="people-arrow people-arrow-right" onClick={goNext} aria-label="Další">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <path d="M24 16l20 16-20 16" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      <p className="hero-date people-text">{current.text}</p>
    </div>
  );
};

export default PeopleOfKarlopolisPage;