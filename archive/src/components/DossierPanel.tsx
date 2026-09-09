import { useEffect, useRef, useState } from "react";
import type { Leaf } from "../data/types";

interface Props {
  leaf: Leaf | null;
  onClose: () => void;
}

export function DossierPanel({ leaf, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (leaf) closeRef.current?.focus();
  }, [leaf]);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 720);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!leaf) return null;

  return (
    <div className="dossier-overlay" onClick={onClose}>
      <aside
        className="dossier"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="dossier__header">
          <span className="dossier__tag">{leaf.tag}</span>
          <button ref={closeRef} className="dossier__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="dossier__hero">
          <img src={leaf.img} alt="" className="dossier__img" />
          <div>
            <h2 id="dossier-title" className="dossier__title">
              {leaf.title}
            </h2>
            <p className="dossier__intro">{leaf.intro}</p>
          </div>
        </div>

        <div className="dossier__body">
          {leaf.content.map((block, i) => (
            <div key={i} className="dossier__block">
              {block.heading && <h3 className="dossier__block-heading">{block.heading}</h3>}
              {block.type === "text" && <p className="dossier__text">{block.body}</p>}
              {block.type === "pdf" && (
                <div className="dossier__pdf">
                  {!isMobile ? (
                    <>
                      <embed src={block.file} type="application/pdf" className="dossier__pdf-embed" />
                      <a href={block.file} target="_blank" rel="noreferrer" className="dossier__link">
                        {block.label ?? "Open PDF"} ↗
                      </a>
                    </>
                  ) : (
                    <>
                      <img src={leaf.img} alt="PDF preview" style={{ width: "100%", height: "auto", borderRadius: 6 }} />
                      <a href={block.file} target="_blank" rel="noreferrer" className="dossier__link">
                        {block.label ?? "Open PDF"} ↗
                      </a>
                    </>
                  )}
                </div>
              )}
              {block.type === "video" && (
                <div className="dossier__video">
                  <div className="dossier__video-frame">
                    <iframe
                      src={block.embedUrl}
                      title={block.label ?? block.heading ?? leaf.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  {block.label && <p className="dossier__caption">{block.label}</p>}
                </div>
              )}
            </div>
          ))}
        </div>

        {leaf.connections.length > 0 && (
          <footer className="dossier__footer">
            <span className="dossier__footer-label">Linked to</span>
            <span className="dossier__footer-list">{leaf.connections.join(" · ")}</span>
          </footer>
        )}
      </aside>
    </div>
  );
}
