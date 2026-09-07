import React from 'react';

const chataUrl = 'https://www.e-chalupy.cz/chalupa-u-alenky-albrechtice-v-jizerskych-horach-pronajem-o16371';

type InfoPageProps = {
  onBack: () => void;
};

const InfoPage: React.FC<InfoPageProps> = ({ onBack }) => {
  return (
    <div className="info-page">
      <button
        type="button"
        className="info-back"
        onClick={onBack}
        aria-label="Zpět na domovskou stránku"
      >
        ← Zpět
      </button>

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

        <div className="hero-tagline">
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
        <p>Chata má saunu a 2 pípy.</p>
        </div>
    </div>
    </div>
  );
};

export default InfoPage;
