import React from 'react';

type NaseHvezdyPageProps = {
  onBack: () => void;
};

const NaseHvezdyPage: React.FC<NaseHvezdyPageProps> = ({ onBack }) => {
  return (
    <div className="local-page-shell">
      <div className="local-page-card">
        <button type="button" className="info-back" onClick={onBack} aria-label="Zpět na domovskou stránku">
          ← Zpět
        </button>

        <h1 className="local-page-title">Naše hvězdy</h1>
        <p className="local-page-copy">
          Tady bude časem připravený obsah o našich hvězdách a hostech.
        </p>
      </div>
    </div>
  );
};

export default NaseHvezdyPage;
