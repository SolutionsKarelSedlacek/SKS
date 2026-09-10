import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, useParams } from 'react-router-dom';
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

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);

  return (
    <div className="hero">
      <img src={hero} alt="Karel Sedláček" className="hero-img" />

      <div className="hero-info">
        <h1 className="hero-title">SILVESTER S KARLEM SEDLÁČKEM</h1>
        <p className="hero-dates">27.12.2026 &ndash; 3.1.2027</p>
        <p className="hero-tagline">Program, běžky, sauna a točená bezinka</p>

        <div className="hero-links">
          <button type="button" className="hero-info-link hero-info-button" onClick={() => navigate('/merch')}>
            Merch
          </button>
          <button type="button" className="hero-info-link hero-info-button" onClick={() => navigate('/info')}>
            Info
          </button>
          <button type="button" className="hero-info-link hero-info-button" onClick={() => navigate('/people')}>
            Karlopolis
          </button>
          <button type="button" className="hero-info-link hero-info-button" onClick={() => navigate('/form/xxxx')}>
            Archiv
          </button>
          <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="hero-discord-link" aria-label="Discord">
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
    </div>
  );
};

const InfoRoute: React.FC = () => {
  const navigate = useNavigate();
  return <InfoPage onBack={() => navigate('/')} onOpenStars={() => navigate('/stars')} />;
};

const StarsRoute: React.FC = () => {
  const navigate = useNavigate();
  return <NaseHvezdyPage onBack={() => navigate('/')} />;
};

const MerchRoute: React.FC = () => {
  const navigate = useNavigate();
  return <MerchPage onBack={() => navigate('/')} />;
};

const PeopleRoute: React.FC = () => {
  const navigate = useNavigate();
  return <PeopleOfKarlopolisPage onBack={() => navigate('/')} />;
};

const FormRoute: React.FC = () => {
  const navigate = useNavigate();
  const { token = 'xxxx' } = useParams();
  return <FormPage token={token} onBack={() => navigate('/')} onOpenStars={() => navigate('/people')} />;
};

const SilvesterPage: React.FC = () => (
  <BrowserRouter basename="/SKS/2026">
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/info" element={<InfoRoute />} />
      <Route path="/stars" element={<StarsRoute />} />
      <Route path="/merch" element={<MerchRoute />} />
      <Route path="/people" element={<PeopleRoute />} />
      <Route path="/form/:token" element={<FormRoute />} />
    </Routes>
  </BrowserRouter>
);

export default SilvesterPage;
