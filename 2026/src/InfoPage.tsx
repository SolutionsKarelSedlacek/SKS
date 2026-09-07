import React from 'react';
import ProgramWidget from './ProgramWidget';

const chataUrl = 'https://www.e-chalupy.cz/chalupa-u-alenky-albrechtice-v-jizerskych-horach-pronajem-o16371';

type InfoPageProps = {
  onBack: () => void;
  onOpenStars: () => void;
};

const InfoPage: React.FC<InfoPageProps> = ({ onBack, onOpenStars }) => {
  return (
    <div className="info-page">
      <div className="info-top-actions">
        <button
          type="button"
          className="info-back"
          onClick={onBack}
          aria-label="Zpět na domovskou stránku"
        >
          ← Zpět
        </button>

        <button
          type="button"
          className="local-link-button"
          onClick={onOpenStars}
          aria-label="Naše hvězdy"
        >
          Naše hvězdy
        </button>
      </div>

      <ProgramWidget />

      <div className="info-stack">
        <div className="info-card">
          <div className="info-map-wrap">
            <iframe
              className="info-map"
              title="Mapa"
              src="https://mapy.com/s/jovuhulaza"
              loading="lazy"
              allowFullScreen
            />
          </div>

          <div className="hero-tagline info-detail">
            <a
              href={chataUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="info-link"
            >
              Chata Klauzovka
            </a>
            <span className="info-copy">
              {' '}se nachází v srdci Jizerských hor, nedaleko Bedřichova. Vyzývá k běžkování,
              lyžování a neodpočinkovému programu. O dodávce sněhu zatím jednáme.
            </span>
            <p className="info-note">Chata má saunu a 2 pípy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
