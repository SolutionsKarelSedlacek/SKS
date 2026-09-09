export type ContentBlock =
  | { type: "text"; heading?: string; body: string }
  | { type: "pdf"; heading?: string; file: string; label?: string }
  | { type: "video"; heading?: string; embedUrl: string; label?: string };

export interface Leaf {
  id: string;
  title: string;
  intro: string;
  img: string;
  tag: string;
  sks?: 'sks24' | 'sks25' | 'sks26' | string | null;
  /** optional: force this leaf to render on a specific row (0-based) */
  row?: number;
  /** optional: force position index within the row/column (0-based) */
  col?: number;
  group?: string;
  groupLabel?: string;
  connections: string[];
  content: ContentBlock[];
}
