import { useEffect, useState } from "react";
import { ForceGraph } from "./components/ForceGraph";
import { DossierPanel } from "./components/DossierPanel";
import type { Leaf } from "./data/types";

export default function App() {
  const [leaves, setLeaves] = useState<Leaf[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/leaves.json`)
      .then((r) => r.json())
      .then((j: any[]) => {
        const mapped = (j || []).map((it) => {
          const img = it.img && !/^https?:\/\//.test(it.img) && !it.img.startsWith(import.meta.env.BASE_URL)
            ? `${import.meta.env.BASE_URL}${it.img.replace(/^\//, "")}`
            : it.img;
          const content = (it.content || []).map((b: any) => {
            if (b.type === "pdf" && b.file && !/^https?:\/\//.test(b.file) && !b.file.startsWith(import.meta.env.BASE_URL)) {
              return { ...b, file: `${import.meta.env.BASE_URL}${b.file.replace(/^\//, "")}` };
            }
            return b;
          });
          return { ...it, img, content } as Leaf;
        });
        setLeaves(mapped);
      })
      .catch(() => {
        setLeaves([]);
      });
  }, []);

  // Close detail view on Escape, but ignore when typing in inputs or editable elements.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const active = document.activeElement as HTMLElement | null;
      if (!active) {
        setActiveId(null);
        return;
      }
      const tag = active.tagName?.toLowerCase();
      const isEditable = active.isContentEditable || tag === "input" || tag === "textarea" || active.getAttribute("role") === "textbox";
      if (!isEditable) setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const activeLeaf = leaves.find((l) => l.id === activeId) ?? null;
  // read optional layout param from URL (?layout=horizontal)
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const layoutParam = urlParams.get('layout') === 'horizontal' ? 'horizontal' : 'vertical';

  return (
    <div className="app">
      <header className="masthead">
        <p className="masthead__eyebrow">an unaffiliated record</p>
        <h1 className="masthead__title">SKS // Archive</h1>
        <p className="masthead__intro">Karle, než se vrátíš do Karlopolis, měl by sis připomenout, co se zatím stalo.</p>
      </header>

      <div className="graph-wrap">
        <ForceGraph leaves={leaves} activeId={activeId} onSelect={setActiveId} orientation={layoutParam as 'vertical' | 'horizontal'} />
      </div>

      <ul className="fallback-list" aria-label="Event sections">
        {leaves.map((leaf) => (
          <li key={leaf.id}>
            <button className="fallback-list__item" onClick={() => setActiveId(leaf.id)}>
              <img src={leaf.img} alt="" />
              <span>
                <span className="fallback-list__tag">{leaf.tag}</span>
                <span className="fallback-list__title">{leaf.title}</span>
                <span className="fallback-list__intro">{leaf.intro}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <DossierPanel leaf={activeLeaf} onClose={() => setActiveId(null)} />
    </div>
  );
}
