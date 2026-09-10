import React, { useEffect, useState } from 'react';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const sphere_space = `${publicBaseUrl}/karel_clean.png`;
const apiUrlBase = 'https://script.google.com/macros/s/AKfycbymzsuKrkZvs_XlsVBodLjaARQ-4c5IdBJgULD0UtCHsiZV4cvZgLQfPDcClT_uZ2TT/exec';

type FormPageProps = {
  token: string;
  onBack: () => void;
  onOpenStars: () => void;
};

type ApiResponse = {
  valid?: boolean;
  url?: string;
  error?: string;
};

const FormPage: React.FC<FormPageProps> = ({ token, onBack, onOpenStars }) => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [apiText, setApiText] = useState<string>('');

  useEffect(() => {
    console.log('form token', token);

    const fetchApiResult = async () => {
      try {
        const response = await fetch(`${apiUrlBase}?token=${encodeURIComponent(token)}`);
        const text = await response.text();
        setApiText(text);

        try {
          const parsed = JSON.parse(text) as ApiResponse;
          console.log('api response', parsed);
          setApiData(parsed);
        } catch {
          console.log('api response raw', text);
          setApiData(null);
        }
      } catch {
        setApiText('API call failed.');
        setApiData(null);
      }
    };

    fetchApiResult();
  }, [token]);

  const hasValidLink = Boolean(apiData?.valid && apiData.url);

  return (
    <div className="form-page" data-testid="form-page">
      <img src={sphere_space} alt="Karel Sedláček" className="hero-img form-hero-image" />

      <svg
        className="form-overlay"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Bílý kruh v pozadí"
        role="img"
      >
        <circle cx="50" cy="55" r="69" fill="rgba(255,0,0,0.2)" />
      </svg>

      <button
        type="button"
        className="form-page-back"
        onClick={onBack}
        aria-label="Zpět na domovskou stránku"
      >
        ← Hlavní stránka
      </button>

      <div className="form-overlay-content">
        <h1 className="hero-title form-title">
          {hasValidLink ? (
            <a href={apiData?.url} target="_blank" rel="noopener noreferrer" className="form-stars-link">
              Zažij Karlopolis
            </a>
          ) : apiData ? (
            <span className="form-stars-link form-stars-link-disabled2">{apiData?.error}</span>
          ) : (
            <span className="form-stars-link form-stars-link-disabled2">Proroctví se načítá...</span>
          )}
        </h1>
      </div>
    </div>
  );
};

export default FormPage;
