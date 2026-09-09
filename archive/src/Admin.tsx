import { useEffect, useState } from "react";

interface LeafStub {
  id: string;
  title: string;
  intro?: string;
  img?: string;
  tag?: string;
  sks?: string | null;
  connections?: string[];
  content?: any[];
}

export default function Admin() {
  const [items, setItems] = useState<LeafStub[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/leaves.json`)
      .then((r) => r.json())
      .then((j) => setItems(j))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  function addNode() {
    const id = `node-${Date.now()}`;
    const node: LeafStub = { id, title: "New node", intro: "", img: "", tag: "", sks: null, connections: [], content: [] };
    setItems((s) => [...s, node]);
    setSelected(items.length);
  }

  function setParent(parentId: string | null) {
    if (selected == null) return;
    const childId = items[selected].id;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === parentId) {
          const conns = Array.from(new Set([...(it.connections || []), childId]));
          return { ...it, connections: conns };
        }
        return it;
      })
    );
  }

  function updateSelected(changes: Partial<LeafStub>) {
    if (selected == null) return;
    setItems((s) => s.map((it, i) => (i === selected ? { ...it, ...changes } : it)));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "leaves.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    navigator.clipboard?.writeText(JSON.stringify(items, null, 2));
    alert("JSON copied to clipboard. Paste into src/data/leaves.ts or public/data/leaves.json as needed.");
  }

  async function saveToDisk() {
    if (!confirm('Save current JSON to public/data/leaves.json on disk? This will overwrite the file.')) return;
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}__admin/save-leaves`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error(await res.text());
      const j = await res.json();
      alert('Saved to disk: ' + (j.path || 'public/data/leaves.json'));
    } catch (e: any) {
      alert('Save failed: ' + String(e));
    }
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif", color: "#eee", background: "#0f0d0c", minHeight: "100vh" }}>
      <h1>Admin (dev only)</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "#f66" }}>{error}</p>}
      <div style={{ display: "flex", gap: 16 }}>
          <div style={{ width: 320 }}>
          <button onClick={addNode} style={{ background: 'transparent', color: '#eee', border: '1px solid #333', padding: '6px 8px' }}>Add node</button>
          <button onClick={exportJSON} style={{ marginLeft: 8, background: 'transparent', color: '#eee', border: '1px solid #333', padding: '6px 8px' }}>Export JSON</button>
          <button onClick={copyToClipboard} style={{ marginLeft: 8, background: '#transparent', color: '#eee', border: '1px solid #333', padding: '6px 8px' }}>Copy JSON</button>
          {import.meta.env.DEV && (
            <button onClick={saveToDisk} style={{ marginLeft: 8, background: '#072', color: '#fff', border: '1px solid #133', padding: '6px 8px' }}>
              Save to disk
            </button>
          )}
          <ul style={{ marginTop: 12 }}>
            {items.map((it, i) => (
              <li key={it.id} style={{ marginBottom: 8 }}>
                <button
                  onClick={() => setSelected(i)}
                  style={{
                    color: selected === i ? "#000" : "#eee",
                    background: selected === i ? "#ffd700" : "transparent",
                    border: '1px solid #333',
                    padding: '6px 8px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  {it.id} — {it.title}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {selected == null ? (
            <p>Select a node to edit</p>
          ) : (
            <div>
              <h3>Editing {items[selected].id}</h3>
              <label>
                Title<br />
                <input
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  value={items[selected].title}
                  onChange={(e) => updateSelected({ title: e.target.value })}
                />
              </label>
              <br />
              <label>
                Intro<br />
                <input
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  value={items[selected].intro ?? ""}
                  onChange={(e) => updateSelected({ intro: e.target.value })}
                />
              </label>
              <br />
              <label>
                Img path<br />
                <input
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  value={items[selected].img ?? ""}
                  onChange={(e) => updateSelected({ img: e.target.value })}
                />
              </label>
              <br />
              <label>
                Tag<br />
                <input
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  value={items[selected].tag ?? ""}
                  onChange={(e) => updateSelected({ tag: e.target.value })}
                />
              </label>
              <br />
              <label>
                SKS assignment<br />
                <select
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  value={items[selected].sks || ''}
                  onChange={(e) => updateSelected({ sks: e.target.value || null })}
                >
                  <option value="">— none —</option>
                  <option value="sks24">SKS 2024</option>
                  <option value="sks25">SKS 2025</option>
                  <option value="sks26">SKS 2026</option>
                </select>
              </label>
              <br />
              <label>
                Connections (comma separated ids)<br />
                <input
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  value={(items[selected].connections || []).join(",")}
                  onChange={(e) => updateSelected({ connections: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                />
              </label>

              <br />
              <label>
                Parent (adds this node id to parent's connections)<br />
                <select
                  style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  onChange={(e) => setParent(e.target.value || null)}
                  defaultValue=""
                >
                  <option value="">— choose parent —</option>
                  {items.map((it) => (
                    it.id === items[selected].id ? null : (
                      <option key={it.id} value={it.id}>{it.id} — {it.title}</option>
                    )
                  ))}
                </select>
              </label>

              <hr style={{ borderColor: '#222', margin: '12px 0' }} />

              <div>
                <h4>Content blocks</h4>
                {(items[selected].content || []).map((block, idx) => (
                  <div key={idx} style={{ border: '1px solid #222', padding: 8, marginBottom: 8 }}>
                    <label>
                      Type<br />
                      <select
                        value={block.type}
                        onChange={(e) => {
                          const t = e.target.value;
                          const next = [...(items[selected].content || [])];
                          next[idx] = { ...next[idx], type: t };
                          updateSelected({ content: next });
                        }}
                        style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                      >
                        <option value="text">text</option>
                        <option value="pdf">pdf</option>
                        <option value="video">video</option>
                      </select>
                    </label>
                    <br />
                    {block.heading !== undefined && (
                      <label>
                        Heading<br />
                        <input
                          value={block.heading || ''}
                          onChange={(e) => {
                            const next = [...(items[selected].content || [])];
                            next[idx] = { ...next[idx], heading: e.target.value };
                            updateSelected({ content: next });
                          }}
                          style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                        />
                      </label>
                    )}
                    <br />
                    {block.type === 'text' && (
                      <label>
                        Body<br />
                        <textarea
                          value={(block as any).body || ''}
                          onChange={(e) => {
                            const next = [...(items[selected].content || [])];
                            next[idx] = { ...next[idx], body: e.target.value };
                            updateSelected({ content: next });
                          }}
                          style={{ width: '100%', minHeight: 80, background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                        />
                      </label>
                    )}
                    {block.type === 'pdf' && (
                      <>
                        <label>
                          File path<br />
                          <input
                            value={(block as any).file || ''}
                            onChange={(e) => {
                              const next = [...(items[selected].content || [])];
                              next[idx] = { ...next[idx], file: e.target.value };
                              updateSelected({ content: next });
                            }}
                            style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                          />
                        </label>
                        <br />
                        <label>
                          Label<br />
                          <input
                            value={(block as any).label || ''}
                            onChange={(e) => {
                              const next = [...(items[selected].content || [])];
                              next[idx] = { ...next[idx], label: e.target.value };
                              updateSelected({ content: next });
                            }}
                            style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                          />
                        </label>
                      </>
                    )}
                    {block.type === 'video' && (
                      <label>
                        Embed URL<br />
                        <input
                          value={(block as any).embedUrl || ''}
                          onChange={(e) => {
                            const next = [...(items[selected].content || [])];
                            next[idx] = { ...next[idx], embedUrl: e.target.value };
                            updateSelected({ content: next });
                          }}
                          style={{ background: '#111', color: '#eee', border: '1px solid #333', padding: '6px' }}
                        />
                      </label>
                    )}

                    <div style={{ marginTop: 8 }}>
                      <button
                        onClick={() => {
                          const next = [...(items[selected].content || [])];
                          next.splice(idx, 1);
                          updateSelected({ content: next });
                        }}
                        style={{ background: 'transparent', color: '#eee', border: '1px solid #333', padding: '6px' }}
                      >
                        Remove block
                      </button>
                    </div>
                  </div>
                ))}

                <div>
                  <button
                    onClick={() => {
                      const next = [...(items[selected].content || [])];
                      next.push({ type: 'text', heading: '', body: '' });
                      updateSelected({ content: next });
                    }}
                    style={{ background: 'transparent', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  >
                    Add text block
                  </button>
                  <button
                    onClick={() => {
                      const next = [...(items[selected].content || [])];
                      next.push({ type: 'pdf', heading: '', file: '', label: '' });
                      updateSelected({ content: next });
                    }}
                    style={{ marginLeft: 8, background: 'transparent', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  >
                    Add PDF block
                  </button>
                  <button
                    onClick={() => {
                      const next = [...(items[selected].content || [])];
                      next.push({ type: 'video', embedUrl: '', label: '' });
                      updateSelected({ content: next });
                    }}
                    style={{ marginLeft: 8, background: 'transparent', color: '#eee', border: '1px solid #333', padding: '6px' }}
                  >
                    Add video block
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <p style={{ color: "#aaa" }}>Dev-only admin tool: edits are not saved back to the repository automatically. Use <strong>Export JSON</strong> or <strong>Copy JSON</strong> to update your project files.</p>
      </div>
    </div>
  );
}
