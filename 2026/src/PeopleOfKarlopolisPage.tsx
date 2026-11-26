import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EpisodesWidget from './EpisodesWidget';
import { getStoryByEpisodeId } from './stories';
import { StoryItem } from './stories/types';

const publicBaseUrl = process.env.PUBLIC_URL || '';
const background = `${publicBaseUrl}/karel_clean.webp`;
const PREFETCH_CHUNK_SIZE = 4;
// How many upcoming frames to load ahead of the reader.
const PREFETCH_AHEAD = 4;
// How many frames to load from each section/part start (the jump target and what follows).
const PREFETCH_JUMP_DEPTH = 2;
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

// Keeps a reference to every requested image so each URL is fetched once
// and in-flight requests are not dropped by garbage collection.
const prefetchedImages = new Map<string, HTMLImageElement>();

const prefetchImage = (url: string) => {
  if (prefetchedImages.has(url)) {
    return;
  }

  const img = new Image();
  img.decoding = 'async';
  img.src = url;
  prefetchedImages.set(url, img);
};

const uniqueImageUrls = (items: (StoryItem | undefined)[]) =>
  Array.from(new Set(items.flatMap((item) => item?.image ? [item.image] : [])))
    .filter((url) => !prefetchedImages.has(url));

// Loads now (for frames the reader is about to see).
const prefetchImagesNow = (items: (StoryItem | undefined)[]) => {
  uniqueImageUrls(items).forEach(prefetchImage);
};

// Loads in small chunks while the browser is idle (for jump targets).
const prefetchImagesIdle = (items: (StoryItem | undefined)[]) => {
  const urls = uniqueImageUrls(items);
  let cursor = 0;

  const loadNextChunk = () => {
    const chunk = urls.slice(cursor, cursor + PREFETCH_CHUNK_SIZE);
    if (chunk.length === 0) {
      return;
    }

    chunk.forEach(prefetchImage);
    cursor += PREFETCH_CHUNK_SIZE;
    scheduleIdle(loadNextChunk);
  };

  scheduleIdle(loadNextChunk);
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

type ScreenLayout = 'desktop' | 'wide-phone' | 'portrait-phone';

// Small upright screens: names only on the intro screen.
const PORTRAIT_PHONE_QUERY = '(max-width: 640px) and (orientation: portrait)';
// Phones held sideways: wide but short, names go to the top so they don't cover subtitles.
const WIDE_PHONE_QUERY = '(orientation: landscape) and (max-height: 500px)';

const PeopleOfKarlopolisPage: React.FC = () => {
  const [selectedTaleId, setSelectedTaleId] = useState<string | null>(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [holeFrameRect, setHoleFrameRect] = useState<HoleFrameRect | null>(null);
  const [layout, setLayout] = useState<ScreenLayout>('desktop');
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement | null>(null);
  const figureRef = useRef<HTMLImageElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSoundRef = useRef<string | null>(null);

  const selectedStory = useMemo(() => getStoryByEpisodeId(selectedTaleId), [selectedTaleId]);
  const sectionList = useMemo(() =>
    selectedStory ? deriveStorySections(selectedStory) : [],
  [selectedStory]);
  const frameIndices = useMemo(() =>
    selectedStory ? deriveStoryFrameIndices(selectedStory) : [],
  [selectedStory]);
  const partList = useMemo(() =>
    selectedStory ? deriveStoryNames(selectedStory) : [],
  [selectedStory]);

  const current = useMemo(
    () => (selectedStory && isStoryOpen ? selectedStory[index] ?? selectedStory[0] : null),
    [selectedStory, index, isStoryOpen]
  );
  const currentYoutubeEmbedUrl = useMemo(
    () => buildYoutubeEmbedUrl(current?.youtubeId),
    [current?.youtubeId]
  );
  const currentSound = current?.sound?.trim() || null;
  const isKarelCleanFrame = Boolean(current?.image?.endsWith('/karel_clean.webp'));
  const framePosition = frameIndices.indexOf(index) + 1;
  const isOpeningScreen = isStoryOpen && isIntroOpen;
  const activeImage = isOpeningScreen
    ? `${publicBaseUrl}/blackscreen.webp`
    : (current?.image ?? background);
  const activeSectionIndex = sectionList.reduce((activeIndex, section, position) =>
    section.startIndex <= index ? position : activeIndex,
  -1);
  const hasLeftArrow = !isOpeningScreen && (framePosition > 1 || (layout === 'portrait-phone' && framePosition === 1));
  const hasRightArrow = !isOpeningScreen && framePosition > 0 && framePosition < frameIndices.length;
  const canPreviousSection = activeSectionIndex > 0;
  const canNextSection = activeSectionIndex >= 0 && activeSectionIndex < sectionList.length - 1;
  // A single section (or none) has nothing to jump between, so only the page counter is shown.
  const hasSectionNavigation = sectionList.length > 1;

  // Story items for `count` frames starting at story index `startIndex`.
  const framesFrom = useCallback((startIndex: number, count: number) => {
    if (!selectedStory) {
      return [];
    }

    const position = frameIndices.indexOf(startIndex);
    if (position < 0) {
      return [];
    }

    return frameIndices
      .slice(position, position + count)
      .map((frameIndex) => selectedStory[frameIndex]);
  }, [selectedStory, frameIndices]);

  // Episode chosen: load its opening frames right away, then every section
  // and part start in the background so jumps between parts are instant.
  useEffect(() => {
    if (!selectedStory) {
      return;
    }

    prefetchImage(`${publicBaseUrl}/blackscreen.webp`);
    prefetchImagesNow(frameIndices.slice(0, PREFETCH_AHEAD).map((frameIndex) => selectedStory[frameIndex]));

    const jumpTargets = [...sectionList, ...partList]
      .flatMap((target) => framesFrom(target.startIndex, PREFETCH_JUMP_DEPTH));
    prefetchImagesIdle(jumpTargets);
  }, [selectedStory, frameIndices, sectionList, partList, framesFrom]);

  // While reading: load the next few frames, plus the neighbouring
  // section starts that the previous/next section buttons jump to.
  useEffect(() => {
    if (!selectedStory || !isStoryOpen) {
      return;
    }

    prefetchImagesNow(framesFrom(index, PREFETCH_AHEAD + 1));

    const neighbourSections = [sectionList[activeSectionIndex - 1], sectionList[activeSectionIndex + 1]];
    prefetchImagesNow(neighbourSections.flatMap((section) =>
      section ? framesFrom(section.startIndex, PREFETCH_JUMP_DEPTH) : []
    ));
  }, [selectedStory, isStoryOpen, index, sectionList, activeSectionIndex, framesFrom]);

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

    if (isIntroOpen) {
      setIsIntroOpen(false);
      return;
    }

    const currentFramePosition = frameIndices.indexOf(index);
    if (currentFramePosition >= 0 && currentFramePosition < frameIndices.length - 1) {
      setIndex(frameIndices[currentFramePosition + 1]);
    }
  };

  const goPrevious = () => {
    if (!selectedStory || !isStoryOpen) {
      return;
    }

    const currentFramePosition = frameIndices.indexOf(index);
    if (currentFramePosition > 0) {
      setIndex(frameIndices[currentFramePosition - 1]);
    } else if (currentFramePosition === 0 && layout === 'portrait-phone') {
      setIsIntroOpen(true);
    }
  };

  const jumpToName = (startIndex: number) => {
    setIndex(startIndex);
    setIsIntroOpen(false);
  };

  const goPreviousSection = () => {
    if (canPreviousSection) {
      setIndex(sectionList[activeSectionIndex - 1].startIndex);
    }
  };

  const goNextSection = () => {
    if (canNextSection) {
      setIndex(sectionList[activeSectionIndex + 1].startIndex);
    }
  };

  const openStory = () => {
    if (!selectedStory) {
      return;
    }

    const firstFrameIndex = selectedStory.findIndex((item) => !item.section);
    setIndex(firstFrameIndex >= 0 ? firstFrameIndex : 0);
    setIsIntroOpen(layout === 'portrait-phone');
    setIsStoryOpen(true);
  };

  const backToChooser = () => {
    setIsStoryOpen(false);
    setIsIntroOpen(false);
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
        const label = part.slice(1, -1);
        const target = partList.find((name) => name.label === label);
        return (
          <button
            type="button"
            key={`${part}-${nameIndex}`}
            onClick={target ? () => jumpToName(target.startIndex) : undefined}
            style={{
              border: 0,
              padding: 0,
              background: 'transparent',
              color: '#d22626',
              font: 'inherit',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        );
      }

      return <React.Fragment key={`${part}-${nameIndex}`}>{part}</React.Fragment>;
    });
  };

  useEffect(() => {
    const portraitQuery = window.matchMedia(PORTRAIT_PHONE_QUERY);
    const wideQuery = window.matchMedia(WIDE_PHONE_QUERY);
    const updateLayout = () => {
      if (portraitQuery.matches) {
        setLayout('portrait-phone');
      } else if (wideQuery.matches) {
        setLayout('wide-phone');
      } else {
        setLayout('desktop');
      }
    };

    updateLayout();
    portraitQuery.addEventListener?.('change', updateLayout);
    wideQuery.addEventListener?.('change', updateLayout);

    return () => {
      portraitQuery.removeEventListener?.('change', updateLayout);
      wideQuery.removeEventListener?.('change', updateLayout);
    };
  }, []);

  useEffect(() => {
    // Intro screen exists only on portrait phones; drop it when the phone is rotated.
    if (layout !== 'portrait-phone') {
      setIsIntroOpen(false);
    }
  }, [layout]);

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

      {isStoryOpen && frameIndices.length > 0 && (
        <div
          className={`people-story-counter${hasSectionNavigation ? '' : ' is-pages-only'}`}
          aria-label="Číslování příběhu"
        >
          {hasSectionNavigation && (
            <div className="people-section-counter">
              <span>Část: {Math.max(activeSectionIndex + 1, 1)}/{sectionList.length}</span>
              <button type="button" onClick={goPreviousSection} disabled={!canPreviousSection} aria-label="Předchozí část">‹</button>
              <button type="button" onClick={goNextSection} disabled={!canNextSection} aria-label="Další část">›</button>
            </div>
          )}
          <div className="people-frame-counter">{framePosition}/{frameIndices.length}</div>
        </div>
      )}

      {isStoryOpen && isOpeningScreen && (
        <div className="people-opening-info">
          <h2>Na tomto displeji není příběh zobrazen v plné kvalitě</h2>
          <p>Pro nejlepší zážitek otoč telefon, použij větší obrazovku nebo zvětši okno.</p>
          {partList.length > 0 && (
            <ul className="people-opening-names" aria-label="Jména postav">
              {partList.map((name) => (
                <li key={`opening-${name.label}-${name.startIndex}`}>
                  <button
                    type="button"
                    className={`people-issue-link${index === name.startIndex ? ' is-active' : ''}`}
                    onClick={() => jumpToName(name.startIndex)}
                  >
                    {name.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button type="button" className="people-issue-link is-active people-opening-start" onClick={goNext}>
            Začít příběh ›
          </button>
        </div>
      )}

      {isStoryOpen && layout !== 'portrait-phone' && partList.length > 0 && (
        <div className={`people-shell people-parts-shell${layout === 'wide-phone' ? ' is-top' : ''}`}>
          <ul className="people-issue-list people-part-list" aria-label="Jména postav">
            {partList.map((part) => {
              const isActivePart = index === part.startIndex;
              return (
                <li key={`${part.label}-${part.startIndex}`}>
                  <button
                    type="button"
                    className={`people-issue-link${isActivePart ? ' is-active' : ''}`}
                    onClick={() => jumpToName(part.startIndex)}
                  >
                    {part.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {isStoryOpen && !isOpeningScreen && (
        <p className={`hero-date people-text${current?.bg ? ' people-text-bg' : ''}`}>{renderStoryText()}</p>
      )}
    </div>
  );
};

const extractBracketName = (value: string) => {
  const match = value.match(/\{([^}]+)\}/);
  return match ? match[1] : value;
};

const deriveStorySections = (activeStory: StoryItem[]) =>
  activeStory.flatMap((item, offset) => {
    if (!item.section) {
      return [];
    }

    const firstFrameIndex = activeStory.findIndex((candidate, candidateIndex) =>
      candidateIndex > offset && !candidate.section
    );

    return firstFrameIndex >= 0
      ? [{ label: item.section, startIndex: firstFrameIndex }]
      : [];
  });

const deriveStoryFrameIndices = (activeStory: StoryItem[]) =>
  activeStory.flatMap((item, offset) => item.section ? [] : [offset]);

const deriveStoryNames = (activeStory: StoryItem[]) =>
  activeStory.flatMap((item, offset) => {
    if (!item.name) {
      return [];
    }

    return [{
      label: extractBracketName(item.name),
      startIndex: offset,
    }];
  });

export default PeopleOfKarlopolisPage;