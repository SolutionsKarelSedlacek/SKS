import React from 'react';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/background.png`;

type MerchItem = {
  name: string;
  description: string;
  price: string;
};

const items: MerchItem[] = [
  {
    name: 'T-shirt',
    description: 'Lehké tričko s motivem Karlopolisu a černou grafikou.',
    price: '799 Kč',
  },
  {
    name: 'Socks',
    description: 'Vlněné ponožky s jednoduchým logem a teplou texturou.',
    price: '299 Kč',
  },
  {
    name: 'Jacket',
    description: 'Mikina se silným střihem a klasickým festivalovým stylem.',
    price: '1 999 Kč',
  },
];

type MerchPageProps = {
  onBack: () => void;
};

const MerchPage: React.FC<MerchPageProps> = ({ onBack }) => {
  return (
    <div className="merch-page page-background">
      <img src={background} alt="background" className="hero-img" />

      <div className="merch-shell">
        <div className="merch-header">
          <h1 className="merch-title">Merch</h1>
          <button type="button" className="info-back" onClick={onBack} aria-label="Zpět na domovskou stránku">
            ← Zpět
          </button>
        </div>

        <div className="merch-grid">
          {items.map((item) => (
            <article key={item.name} className="merch-card">
              <div className="merch-visual" aria-hidden="true" />
              <h2 className="merch-name">{item.name}</h2>
              <p className="merch-description">{item.description}</p>
              <p className="merch-price">{item.price}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MerchPage;
