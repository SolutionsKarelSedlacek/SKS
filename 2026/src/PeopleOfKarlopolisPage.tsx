import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EpisodesWidget from './EpisodesWidget';
import { getStoryByEpisodeId, storiesByEpisodeId } from './stories';
import { StoryItem } from './stories/types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/karel_clean.png`;
const PREFETCH_CHUNK_SIZE = 4;
const ORB_HOLE_BOUNDS = { x: 688, y: 388, width: 293, height: 297 };
const KAREL_CLEAN_DIMENSIONS = { width: 1672, height: 941 };
const HERO_OBJECT_POSITION = { x: 0.5, y: 0.22 };

type HoleFrameRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

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

const buildYoutubeEmbedUrl = (youtubeId?: string) => {
  if (!youtubeId) {
    return null;
  }

  const normalizedId = youtubeId.trim();
  if (!/^[a-zA-Z0-9_-]{11}$/.test(normalizedId)) {
    return null;
  }

  const params = new URLSearchParams({
    autoplay: '1',
    controls: '1',
    disablekb: '0',
    fs: '1',
    loop: '1',
    modestbranding: '1',
    mute: '0',
    playsinline: '1',
    rel: '0',
    playlist: normalizedId,
  });

  return `https://www.youtube.com/embed/${normalizedId}?${params.toString()}`;
};

const PeopleOfKarlopolisPage: React.FC = () => {
  const [selectedTaleId, setSelectedTaleId] = useState<string | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [holeFrameRect, setHoleFrameRect] = useState<HoleFrameRect | null>(null);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const figureRef = useRef<HTMLImageElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSoundRef = useRef<string | null>(null);

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
  const currentYoutubeEmbedUrl = useMemo(
    () => buildYoutubeEmbedUrl(current?.youtubeId),
    [current?.youtubeId]
  );
  const currentSound = current?.sound?.trim() || null;
  const isKarelCleanFrame = Boolean(current?.image.endsWith('/karel_clean.png'));
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

  const recalculateHoleFrameRect = useCallback(() => {
    const pageElement = pageRef.current;
    const figureElement = figureRef.current;

    if (!pageElement || !figureElement) {
      return;
    }

    const pageRect = pageElement.getBoundingClientRect();
    const naturalWidth = figureElement.naturalWidth || KAREL_CLEAN_DIMENSIONS.width;
    const naturalHeight = figureElement.naturalHeight || KAREL_CLEAN_DIMENSIONS.height;

    if (!naturalWidth || !naturalHeight || !pageRect.width || !pageRect.height) {
      return;
    }

    const scale = Math.max(pageRect.width / naturalWidth, pageRect.height / naturalHeight);
    const renderedWidth = naturalWidth * scale;
    const renderedHeight = naturalHeight * scale;
    const offsetX = (pageRect.width - renderedWidth) * HERO_OBJECT_POSITION.x;
    const offsetY = (pageRect.height - renderedHeight) * HERO_OBJECT_POSITION.y;

    setHoleFrameRect({
      left: offsetX + ORB_HOLE_BOUNDS.x * scale,
      top: offsetY + ORB_HOLE_BOUNDS.y * scale,
      width: ORB_HOLE_BOUNDS.width * scale,
      height: ORB_HOLE_BOUNDS.height * scale,
    });
  }, []);

  useEffect(() => {
    if (!isStoryOpen || !currentYoutubeEmbedUrl || !isKarelCleanFrame) {
      setHoleFrameRect(null);
      return;
    }

    recalculateHoleFrameRect();
    window.addEventListener('resize', recalculateHoleFrameRect);

    const figureElement = figureRef.current;
    figureElement?.addEventListener('load', recalculateHoleFrameRect);

    return () => {
      window.removeEventListener('resize', recalculateHoleFrameRect);
      figureElement?.removeEventListener('load', recalculateHoleFrameRect);
    };
  }, [isStoryOpen, currentYoutubeEmbedUrl, isKarelCleanFrame, activeImage, recalculateHoleFrameRect]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
      activeSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!isStoryOpen || !currentSound) {
      if (activeSoundRef.current) {
        audio.pause();
        audio.currentTime = 0;
        audio.removeAttribute('src');
        audio.load();
        activeSoundRef.current = null;
      }
      return;
    }

    if (activeSoundRef.current === currentSound) {
      return;
    }

    audio.pause();
    audio.src = currentSound;
    audio.currentTime = 0;
    activeSoundRef.current = currentSound;
    audio.play().catch(() => {
      // Autoplay can be blocked without a direct user gesture.
    });
  }, [isStoryOpen, currentSound]);

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
    <div className="people-page" ref={pageRef}>
      <img src={background} alt="Karel Sedláček" className="hero-img" decoding="async" fetchPriority="high" />

      {isStoryOpen && currentYoutubeEmbedUrl && holeFrameRect && (
        <div
          className="people-hole-video"
          style={{
            left: `${holeFrameRect.left}px`,
            top: `${holeFrameRect.top}px`,
            width: `${holeFrameRect.width}px`,
            height: `${holeFrameRect.height}px`,
          }}
          aria-hidden="true"
        >
          <iframe
            className="people-hole-video-frame"
            src={currentYoutubeEmbedUrl}
            title="YouTube video v otvoru"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        </div>
      )}

      <img
        src={activeImage}
        alt="Karlopolis"
        className="hero-img people-figure"
        decoding="async"
        fetchPriority="high"
        ref={figureRef}
      />

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

      {isStoryOpen && <p className={`hero-date people-text${current?.bg ? ' people-text-bg' : ''}`}>{renderStoryText()}</p>}
    </div>
  );
};

export default PeopleOfKarlopolisPage;