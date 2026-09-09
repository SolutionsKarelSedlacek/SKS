# SIGNAL // 2026

A single-page event site: your event's content as a draggable network graph.
Each node is a "leaf" — a small header (image, title, one-line intro) that
expands into a full dossier panel on click, holding any mix of text, an
embedded PDF, and an embedded video.

Built with React + TypeScript + Vite. Physics/layout via `d3-force`,
drag via `d3-drag`, pan/zoom via `d3-zoom` — everything else is plain
React + CSS, no UI framework.

## Structure

- `src/data/leaves.ts` — **this is the file you edit.** Every node's title,
  image, intro, tag, content blocks, and which other leaves it connects to.
- `src/data/types.ts` — the shape of a leaf and its content blocks.
- `src/components/ForceGraph.tsx` — the graph itself.
- `src/components/DossierPanel.tsx` — the expanded detail view.
- `public/img/` — leaf images (currently placeholder mask icons).
- `public/pdfs/` — PDF files referenced by `type: "pdf"` content blocks
  (currently placeholder dossiers).

## Editing content

Open `src/data/leaves.ts`. Each leaf looks like:

```ts
{
  id: "keynote",
  title: "Opening Keynote",
  intro: "The talk that sets the tone for the day.",
  img: "/img/node-03.svg",
  tag: "MAIN STAGE",
  connections: ["root", "arrival", "workshop-a"], // ids of linked leaves
  content: [
    { type: "text", heading: "Synopsis", body: "..." },
    { type: "video", embedUrl: "https://www.youtube-nocookie.com/embed/VIDEO_ID" },
  ],
}
```

Content block types:

- `{ type: "text", heading?, body }`
- `{ type: "pdf", heading?, file, label? }` — `file` is a path under `public/`
  (e.g. drop a PDF in `public/pdfs/` and reference `/pdfs/yours.pdf`)
- `{ type: "video", heading?, embedUrl, label? }` — use a YouTube
  (`youtube-nocookie.com/embed/...`) or Vimeo (`player.vimeo.com/video/...`)
  embed URL, not the regular watch/share link

To add a leaf: add an object to the array and add its `id` to the
`connections` of whichever leaves should link to it (edges are
de-duplicated, so you only need to declare a link on one side).

Replace the placeholder images in `public/img/` with real photos/art —
same filenames, or update the `img` path per leaf.

## Local development

```bash
npm install
npm run dev
```

## Deploying to GitHub Pages

Two things to set before your first deploy:

1. **`vite.config.ts`** — set `base` to `/your-repo-name/` (already set to
   `/anon-event/`; change it to match your actual repo name). If this will
   live at `https://your-username.github.io` directly (a user/org page,
   not a project page), set `base: '/'` instead.
2. **`package.json`** — update the `homepage` field to your real GitHub
   Pages URL.

### Option A — GitHub Actions (recommended, already set up)

`.github/workflows/deploy.yml` builds and deploys on every push to `main`.
One-time setup in your repo: **Settings → Pages → Source → GitHub Actions**.
Push to `main` and it deploys automatically.

### Option B — manual deploy via `gh-pages`

```bash
npm run deploy
```

This builds the app and pushes `dist/` to a `gh-pages` branch. Then set
**Settings → Pages → Source → Deploy from a branch → `gh-pages`**.

## Notes

- The graph targets desktop/laptop screens (drag + scroll-to-zoom). Below
  720px width it swaps automatically to a scrollable list of the same
  leaves, so it stays usable on a phone without trying to force a graph
  interaction onto a small touch screen.
- PDFs are embedded inline with `<embed>` plus a fallback "open" link,
  since inline PDF rendering support varies by browser.
