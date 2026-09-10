import React from 'react';
import ProgramWidget from './ProgramWidget';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/background.png`;

const chataUrl = 'https://www.e-chalupy.cz/chalupa-u-alenky-albrechtice-v-jizerskych-horach-pronajem-o16371';

type InfoPageProps = {
  onBack: () => void;
  onOpenStars: () => void;
};

const InfoPage: React.FC<InfoPageProps> = ({ onBack, onOpenStars }) => {
  return (
    <div className="info-page page-background">
      <img src={background} alt="background" className="hero-img" />

      <div className="info-top-actions">
        <button
          type="button"
          className="info-back"
          onClick={onBack}
          aria-label="Zpět na domovskou stránku"
        >
          ← Zpět
        </button>
      </div>

      <ProgramWidget />

      <div className="info-stack">
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
          <p className="info-note">
            Organizační tým zajišťuje snídaně a večeře, u obědů nabízí maximálně součinnost
            v půjčení kuchyně a zařízení nákupu.
          </p>
        </div>

        <div className="info-map-wrap">
          <iframe
            className="info-map"
            title="Mapa"
            src="https://mapy.com/s/jovuhulaza"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
