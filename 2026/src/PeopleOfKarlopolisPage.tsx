import React, { useEffect, useMemo, useState } from 'react';
import EpisodesWidget from './EpisodesWidget';
import { getStoryByEpisodeId, storiesByEpisodeId } from './stories';
import { StoryItem } from './stories/types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/karel_clean.png`;
const PREFETCH_CHUNK_SIZE = 4;

const scheduleIdle = (callback: () => void) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    const requestIdle = (window as Window & {
      requestIdleCallback?: (cb: IdleRequestCallback) => number;
    }).requestIdleCallback;

    if (requestIdle) {
      requestIdle(() => callback());
      return;
    }
  }

  window.setTimeout(callback, 150);
};

const prefetchImages = (urls: string[]) => {
  let cursor = 0;

  const loadNextChunk = () => {
    const chunk = urls.slice(cursor, cursor + PREFETCH_CHUNK_SIZE);
    if (chunk.length === 0) {
      return;
    }

    chunk.forEach((url) => {
      const img = new Image();
      img.src = url;
    });

    cursor += PREFETCH_CHUNK_SIZE;
    scheduleIdle(loadNextChunk);
  };

  scheduleIdle(loadNextChunk);
};

const extractBracketName = (value: string) => {
  const match = value.match(/\{([^}]+)\}/);
  return match ? match[1] : value;
};

const deriveStoryParts = (activeStory: StoryItem[]) => {
  return activeStory
    .flatMap((item, offset) => {
      if (!item.name) {
        return [];
      }

      return [
        {
          label: extractBracketName(item.name),
          startIndex: offset,
        },
      ];
    });
};

const PeopleOfKarlopolisPage: React.FC = () => {
  const [selectedTaleId, setSelectedTaleId] = useState<string | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const selectedStory = useMemo(() => getStoryByEpisodeId(selectedTaleId), [selectedTaleId]);

  useEffect(() => {
    const allStories = Object.values(storiesByEpisodeId).flat();
    const uniqueImages = Array.from(new Set(allStories.map((item) => item.image)));
    prefetchImages(uniqueImages);
  }, []);

  useEffect(() => {
    if (selectedStory && isStoryOpen) {
      setIndex(0);
    }
  }, [selectedStory, isStoryOpen]);

  const current = useMemo(
    () => (selectedStory && isStoryOpen ? selectedStory[index] ?? selectedStory[0] : null),
    [selectedStory, index, isStoryOpen]
  );
  const activeImage = current?.image ?? background;
  const activeEnd = Math.max((selectedStory?.length ?? 1) - 1, 0);
  const hasLeftArrow = Boolean(selectedStory && isStoryOpen && index > 0);
  const hasRightArrow = Boolean(selectedStory && isStoryOpen && index < activeEnd);
  const partList = useMemo(() => {
    if (!selectedStory) {
      return [];
    }

    return deriveStoryParts(selectedStory);
  }, [selectedStory]);

  const goNext = () => {
    if (!selectedStory || !isStoryOpen) {
      return;
    }
    setIndex((value) => Math.min(value + 1, activeEnd));
  };

  const goPrevious = () => {
    if (!selectedStory || !isStoryOpen) {
      return;
    }
    setIndex((value) => Math.max(value - 1, 0));
  };

  const openStory = () => {
    if (!selectedStory) {
      return;
    }

    setIndex(0);
    setIsStoryOpen(true);
  };

  const backToChooser = () => {
    setIsStoryOpen(false);
    setIndex(0);
  };

  const renderStoryText = () => {
    if (!current) {
      return isStoryOpen ? '' : 'Vyber epizodu a stiskni play.';
    }

    if (!current.name) {
      return current.text;
    }

    return current.name.split(/(\{[^}]+\})/).map((part, nameIndex) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return (
          <span key={`${part}-${nameIndex}`} style={{ color: '#d22626' }}>
            {part.slice(1, -1)}
          </span>
        );
      }

      return <React.Fragment key={`${part}-${nameIndex}`}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="people-page">
      <img src={background} alt="Karel Sedláček" className="hero-img" decoding="async" fetchPriority="high" />
      <img src={activeImage} alt="Karlopolis" className="hero-img people-figure" decoding="async" fetchPriority="high" />

      {isStoryOpen && (
        <button type="button" className="info-back people-back" onClick={backToChooser} aria-label="Zpět na výběr epizody">
          ← Zpět
        </button>
      )}

      {!isStoryOpen && (
        <>
          <div className="people-shell people-chooser-shell">
            <EpisodesWidget activeEpisodeId={selectedTaleId} onSelectEpisode={setSelectedTaleId} />
          </div>

          {selectedTaleId && (
            <div className="people-stage-chooser" aria-label="Výběr příběhu Karlopolisu">
              <button type="button" className="people-play-button" onClick={openStory} aria-label="Spustit příběh">
                <span className="people-play-icon" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}

      {isStoryOpen && (
        <div className="people-stage" aria-label="Přehled příběhu Karlopolisu">
          <div className="people-orbit" aria-hidden="true" />

          {hasLeftArrow && (
            <button type="button" className="people-arrow people-arrow-left" onClick={goPrevious} aria-label="Předchozí">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M40 16L20 32l20 16" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {hasRightArrow && (
            <button type="button" className="people-arrow people-arrow-right" onClick={goNext} aria-label="Další">
              <svg viewBox="0 0 64 64" aria-hidden="true">
                <path d="M24 16l20 16-20 16" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}

      {selectedTaleId && partList.length > 0 && (
        <div className="people-shell people-parts-shell">
          <ul className="people-issue-list people-part-list" aria-label="Části příběhu">
            {partList.map((part) => {
              const isActivePart = index === part.startIndex;
              return (
                <li key={`${part.label}-${part.startIndex}`}>
                  <button
                    type="button"
                    className={`people-issue-link${isActivePart ? ' is-active' : ''}`}
                    onClick={() => setIndex(part.startIndex)}
                  >
                    {part.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isStoryOpen && <p className="hero-date people-text">{renderStoryText()}</p>}
    </div>
  );
};

export default PeopleOfKarlopolisPage;