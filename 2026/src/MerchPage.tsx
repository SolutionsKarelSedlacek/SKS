import React from 'react';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/background.webp`;
const placeholderArt = `${publicBaseUrl}/mustache.webp`;
const nakupovatUrl = "https://forms.gle/nbKxaF1GeDGQgr6dA";

type MerchItem = {
  name: string;
  description: string;
  price: string;
};

const items: MerchItem[] = [
  {
    name: 'Socks',
    description: 'Vlněné ponožky s jednoduchým knírem a teplou texturou. Netuším jestli se do nich vejde i knír, ale určitě se do nich vejdou nohy.',
    price: 'cca 150,-/pár',
  },
  {
    name: 'Karlodlaci za úplňku',
    description: 'Profesionální tisk vymazlené custom verze naší oblíbené hry.',
    price: 'bude',
  },
];

type MerchPageProps = {
};

const MerchPage: React.FC<MerchPageProps> = () => {
  return (
    <div className="merch-page page-background">
      <img src={background} alt="background" className="hero-img" />

      <div className="merch-shell">
        <div className="merch-header">
          <h1 className="merch-title">Merch</h1>
          <div className="merch-actions">
            <button type="button" className="info-back" onClick={() => window.location.href = nakupovatUrl} aria-label="Přejít na seznam výrobků">
              Nakupovat →
            </button>
          </div>
        </div>

        <div className="merch-grid">
          {items.map((item) => (
            <article key={item.name} className="merch-card">
              <img src={placeholderArt} alt={`${item.name} placeholder`} className="merch-visual" />
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
