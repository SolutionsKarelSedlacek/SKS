import React from 'react';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/background.png`;
const placeholderArt = `${publicBaseUrl}/mustache.png`;

type MerchItem = {
  name: string;
  description: string;
  price: string;
};

const items: MerchItem[] = [
  {
    name: 'Vymazelný merch',
    description: 'Vymazelný merch s motivem Karlopolisu a knírem. Netuším zda to bude někdo nosit, ale bude to vymazelný.',
    price: 'k nezaplacení',
  },
  {
    name: 'T-shirt',
    description: 'Lehké tričko s motivem Karlopolisu a černou grafikou. Netuším zda to bude někdo nosit, jsem AI.',
    price: '69 Kč',
  },
  {
    name: 'Socks',
    description: 'Vlněné ponožky s jednoduchým knírem a teplou texturou. Netuším jestli se do nich vejde i knír, ale určitě se do nich vejdou nohy.',
    price: '666 Kč',
  },
  {
    name: 'Polokošile',
    description: 'Polokošile s krátkým rukávem a klasickým knírem. Netuším proč by někdo chtěl nosit polokošili, ale je to stylové.',
    price: '666 Kč',
  },
  {
    name: 'Mikina',
    description: 'Mikina se silným střihem a klasickým festivalovým stylem. Netušíme, zda se do ní vejde i knír.',
    price: '6 666 Kč',
  },
  {
    name: 'Karlodlaci za úplňku',
    description: 'Profesionální tisk vymazlené custom verze naší oblíbené hry.',
    price: 'tba Kč',
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
            <button type="button" className="info-back" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Přejít na seznam výrobků">
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
