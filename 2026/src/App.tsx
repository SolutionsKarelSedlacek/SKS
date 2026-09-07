import React, { useState } from 'react';
import './App.css';
import InfoPage from './InfoPage';
import NaseHvezdyPage from './NaseHvezdyPage';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const hero = `${publicBaseUrl}/karel.png`;
const background = `${publicBaseUrl}/background.png`;
const discord = `${publicBaseUrl}/discord.svg`;
const discordHover = `${publicBaseUrl}/discord2.svg`;

const discordUrl = 'https://discord.gg/34mxUjXMF6';
const regUrl = 'https://forms.gle/KtAXmtLjXV3k5EzT8';

const SilvesterPage: React.FC = () => {
  const [page, setPage] = useState<'home' | 'info' | 'stars'>('home');
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);

  const heroClassName = page === 'home' ? 'hero' : 'hero hero-info-open';

  return (
    <div className={heroClassName} style={{ backgroundImage: `url(${background})` }}>
      {page === 'home' ? (
        <>
          <img src={hero} alt="Karel Sedláček" className="hero-img" />

          <div className="hero-info">
            <h1 className="hero-title">SILVESTER S KARLEM SEDLÁČKEM</h1>
            <p className="hero-dates">27.12.2026 &ndash; 3.1.2027</p>
            <p className="hero-tagline">Program, běžky, sauna a točená bezinka</p>

            <div className="hero-links">
              <a
                href={regUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-info-link"
              >
                Přihláška
              </a>
              <button
                type="button"
                className="hero-info-link hero-info-button"
                onClick={() => setPage('info')}
              >
                Info
              </button>
              <button
                type="button"
                className="hero-info-link hero-info-button"
                onClick={() => setPage('info')}
              >
                Poznej Karlopolis
              </button>
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
        <InfoPage
          onBack={() => setPage('home')}
          onOpenStars={() => setPage('stars')}
        />
      ) : (
        <NaseHvezdyPage onBack={() => setPage('home')} />
      )}
    </div>
  );
};

export default SilvesterPage;
