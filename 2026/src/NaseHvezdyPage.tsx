import React from 'react';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const hero = `${publicBaseUrl}/karel.png`;

type NaseHvezdyPageProps = {
};

const NaseHvezdyPage: React.FC<NaseHvezdyPageProps> = () => {
  return (
    <div className="local-page-shell page-background">
      <img src={hero} alt="Karel Sedláček" className="hero-img" />

      <div className="local-page-card">
        <h1 className="local-page-title">Naše hvězdy</h1>
        <p className="local-page-copy">
          Tady bude časem připravený obsah o našich hvězdách a hostech.
        </p>
      </div>
    </div>
  );
};

export default NaseHvezdyPage;
