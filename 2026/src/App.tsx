import React, { useEffect, useState } from 'react';
import './App.css';
import InfoPage from './InfoPage';
import NaseHvezdyPage from './NaseHvezdyPage';
import FormPage from './FormPage';
import MerchPage from './MerchPage';
import PeopleOfKarlopolisPage from './PeopleOfKarlopolisPage';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const hero = `${publicBaseUrl}/karel.png`;
const discord = `${publicBaseUrl}/discord.svg`;
const discordHover = `${publicBaseUrl}/discord2.svg`;

const discordUrl = 'https://discord.gg/34mxUjXMF6';
const archiveUrl = 'https://solutionskarelsedlacek.github.io/SKS/archive';

type AppPage = 'home' | 'info' | 'stars' | 'form' | 'merch' | 'people';

const getCurrentRoute = (): { page: AppPage; token: string } => {
  if (typeof window === 'undefined') {
    return { page: 'home', token: 'xxxx' };
  }

  const pathname = window.location.pathname;
  const basePath = publicBaseUrl ? publicBaseUrl.replace(/\/+$/, '') : '';
  const relativePath = basePath && pathname.startsWith(basePath)
    ? pathname.slice(basePath.length) || '/'
    : pathname;

  if (relativePath === '/info') {
    return { page: 'info', token: 'xxxx' };
  }

  if (relativePath === '/stars') {
    return { page: 'stars', token: 'xxxx' };
  }

  if (relativePath === '/merch') {
    return { page: 'merch', token: 'xxxx' };
  }

  if (relativePath === '/people') {
    return { page: 'people', token: 'xxxx' };
  }

  if (relativePath.startsWith('/form')) {
    const token = relativePath.replace(/^\/form\/?/, '') || 'xxxx';
    return { page: 'form', token };
  }

  return { page: 'home', token: 'xxxx' };
};

const SilvesterPage: React.FC = () => {
  const [page, setPage] = useState<AppPage>(() => getCurrentRoute().page);
  const [formToken, setFormToken] = useState<string>(() => getCurrentRoute().token);
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);

  const navigate = (nextPage: AppPage, token = 'xxxx') => {
    const routeByPage = {
      home: publicBaseUrl ? `${publicBaseUrl}/` : '/',
      info: `${publicBaseUrl}/info`,
      stars: `${publicBaseUrl}/stars`,
      merch: `${publicBaseUrl}/merch`,
      people: `${publicBaseUrl}/people`,
      form: `${publicBaseUrl}/form/${token}`,
    }[nextPage];

    window.history.pushState({}, '', routeByPage);
    setPage(nextPage);
    setFormToken(token);
  };

  useEffect(() => {
    const syncPageFromLocation = () => {
      const route = getCurrentRoute();
      setPage(route.page);
      setFormToken(route.token);
    };

    syncPageFromLocation();
    window.addEventListener('popstate', syncPageFromLocation);

    return () => window.removeEventListener('popstate', syncPageFromLocation);
  }, []);

  const heroClassName = page === 'home' ? 'hero' : 'hero hero-info-open';

  return (
    <div className={heroClassName}>
      {page === 'home' ? (
        <>
          <img src={hero} alt="Karel Sedláček" className="hero-img" />

          <div className="hero-info">
            <h1 className="hero-title">SILVESTR S KARLEM SEDLÁČKEM</h1>
            <p className="hero-dates">27.12.2026 &ndash; 3.1.2027</p>
            <p className="hero-tagline">Program, běžky, sauna a točená bezinka</p>

            <div className="hero-links">
              <button
                type="button"
                className="hero-info-link hero-info-button"
                onClick={() => navigate('merch')}
              >
                Merch
              </button>
              <button
                type="button"
                className="hero-info-link hero-info-button"
                onClick={() => navigate('info')}
              >
                Info
              </button>
              <button
                type="button"
                className="hero-info-link hero-info-button"
                onClick={() => navigate('people')}
              >
                Účastníci
              </button>
              <a
                href={archiveUrl}
                className="hero-info-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Archiv
              </a>
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-discord-link"
                aria-label="Discord"
              >
                <img
                  src={isDiscordHovered ? discordHover : discord}
                  className="hero-discord-icon"
                  alt="Discord"
                  onMouseEnter={() => setIsDiscordHovered(true)}
                  onMouseLeave={() => setIsDiscordHovered(false)}
                  onFocus={() => setIsDiscordHovered(true)}
                  onBlur={() => setIsDiscordHovered(false)}
                />
              </a>
            </div>
          </div>
        </>
      ) : page === 'info' ? (
        <InfoPage />
      ) : page === 'stars' ? (
        <NaseHvezdyPage />
      ) : page === 'merch' ? (
        <MerchPage />
      ) : page === 'people' ? (
        <PeopleOfKarlopolisPage />
      ) : (
        <FormPage token={formToken} onBack={() => navigate('home')} />
      )}
    </div>
  );
};

export default SilvesterPage;
