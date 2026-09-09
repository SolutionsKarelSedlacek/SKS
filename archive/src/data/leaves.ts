import type { Leaf } from './types';

// Runtime loader for leaves. The single source of truth is `public/data/leaves.json`.
// Use this function where server-side or tooling needs to fetch the same dataset.
export async function fetchLeaves(): Promise<Leaf[]> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}data/leaves.json`);
    if (!res.ok) return [];
    const json = await res.json();
    return (json || []).map((it: any) => {
      const img = it.img && !/^https?:\/\//.test(it.img) && !it.img.startsWith(import.meta.env.BASE_URL)
        ? `${import.meta.env.BASE_URL}${it.img.replace(/^\//, '')}`
        : it.img;
      const content = (it.content || []).map((b: any) => {
        if (b.type === 'pdf' && b.file && !/^https?:\/\//.test(b.file) && !b.file.startsWith(import.meta.env.BASE_URL)) {
          return { ...b, file: `${import.meta.env.BASE_URL}${b.file.replace(/^\//, '')}` };
        }
        return b;
      });
      return { ...it, img, content } as Leaf;
    });
  } catch (e) {
    return [];
  }
}

export default fetchLeaves;
