import { useEffect, useMemo, useRef, useState } from "react";
import type { Leaf } from "../data/types";

interface GraphNode {
  id: string;
  leaf: Leaf;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface Props {
  leaves: Leaf[];
  activeId: string | null;
  onSelect: (id: string) => void;
  /** layout orientation: 'vertical' (rows top->bottom) or 'horizontal' (columns left->right) */
  orientation?: 'vertical' | 'horizontal';
}

export function ForceGraph({ leaves, activeId, onSelect, orientation = "vertical" }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const viewportRef = useRef<SVGGElement | null>(null);
  const pendingScrollRef = useRef<string | null>(null);
  const [resizeTick, setResizeTick] = useState(0);
  const [levelRows, setLevelRows] = useState<
    { level: number; y: number; rectX: number; rectWidth: number; sks?: string | null; screenY?: number; screenHeight?: number; label?: string; color?: string }[]
  >([]);
  const [svgWidth, setSvgWidth] = useState<number>(0);
  const ROW_SPACING = 260;
 

  const { nodes, links, adj } = useMemo(() => {
    const groupMembers = new Map<string, Leaf[]>();
    for (const leaf of leaves) {
      if (!leaf.group) continue;
      const arr = groupMembers.get(leaf.group) ?? [];
      arr.push(leaf);
      groupMembers.set(leaf.group, arr);
    }

    const canonicalizeId = (id: string) => {
      const leaf = leaves.find((item) => item.id === id);
      if (!leaf?.group) return id;
      const members = groupMembers.get(leaf.group) ?? [];
      return members.length > 1 ? leaf.group : id;
    };

    const syntheticGroupNodes = new Map<string, Leaf>();
    for (const [groupId, members] of groupMembers.entries()) {
      if (members.length < 2) continue;
      const first = members[0];
      syntheticGroupNodes.set(groupId, {
        ...first,
        id: groupId,
        title: first.groupLabel ?? `${members[0].title} — ${members[members.length - 1].title}`,
        intro: `${members.length} issues`,
        content: members.flatMap((member) => member.content),
        connections: Array.from(new Set(members.flatMap((member) => member.connections).map(canonicalizeId)))
      });
    }

    const nodes: GraphNode[] = leaves.map((leaf) => {
      const groupId = leaf.group && (groupMembers.get(leaf.group)?.length ?? 0) > 1 ? leaf.group : leaf.id;
      return { id: groupId, leaf: syntheticGroupNodes.get(groupId) ?? leaf };
    }).filter((node, index, arr) => arr.findIndex((other) => other.id === node.id) === index);

    const seen = new Set<string>();
    const links: GraphLink[] = [];
    const MAX_CONN_PER_NODE = 3;
    const outgoingCounts = new Map<string, number>();
    const exists = new Set(leaves.map((l) => l.id));
    for (const leaf of leaves) {
      const sourceId = canonicalizeId(leaf.id);
      let added = 0;
      for (const target of leaf.connections) {
        if (added >= MAX_CONN_PER_NODE) break;
        if (sourceId === canonicalizeId(target)) continue;
        if (!exists.has(target)) continue;
        const key = [sourceId, canonicalizeId(target)].sort().join("::");
        if (seen.has(key)) continue;
        const current = outgoingCounts.get(sourceId) ?? 0;
        if (current >= MAX_CONN_PER_NODE) break;
        seen.add(key);
        links.push({ source: sourceId, target: canonicalizeId(target) });
        outgoingCounts.set(sourceId, current + 1);
        added += 1;
      }
    }

    const adj = new Map<string, string[]>();
    for (const node of nodes) adj.set(node.id, []);
    for (const l of links) {
      const s = typeof l.source === 'string' ? l.source : l.source.id;
      const t = typeof l.target === 'string' ? l.target : l.target.id;
      if (!adj.has(s)) adj.set(s, []);
      if (!adj.has(t)) adj.set(t, []);
      const sa = adj.get(s)!;
      const ta = adj.get(t)!;
      if (!sa.includes(t)) sa.push(t);
      if (!ta.includes(s)) ta.push(s);
    }

    return { nodes, links, adj } as unknown as { nodes: GraphNode[]; links: GraphLink[]; adj: Map<string, string[]> };
  }, [leaves]);

  // state for folding: revealed = fully visible & clickable; hinted = greyed children
  const [revealed, setRevealed] = useState<Set<string>>(() => {
    const root = leaves.find((l) => l.id === "root") ?? leaves[0];
    return new Set(root ? [root.id] : []);
  });
  const [hinted, setHinted] = useState<Set<string>>(() => new Set());
  const [lastExpanded, setLastExpanded] = useState<string | null>(() => {
    const root = leaves.find((l) => l.id === "root") ?? leaves[0];
    return root?.id ?? null;
  });

  // If leaves are loaded/changed after mount, ensure `revealed` contains the root.
  // This handles the case where `leaves` is initially empty (loaded async).
  useEffect(() => {
    if (!leaves || leaves.length === 0) return;
    const rootLeaf = leaves.find((l) => l.id === "root") ?? leaves[0];
    if (!rootLeaf) return;
    setRevealed((curr) => {
      if (curr.size === 0 || !curr.has(rootLeaf.id)) {
        const next = new Set(curr);
        next.add(rootLeaf.id);
        return next;
      }
      return curr;
    });
    setLastExpanded((curr) => curr ?? rootLeaf.id);
  }, [leaves]);

  const nodeRefs = useRef<Map<string, SVGGElement>>(new Map());
  const linkRefs = useRef<Map<string, SVGLineElement>>(new Map());

  // initialize hinted based on initial revealed
  useEffect(() => {
    if (!adj) return;
    const next = new Set<string>();
    for (const id of Array.from(revealed)) {
      const children = adj.get(id) ?? [];
      for (const c of children) if (!revealed.has(c)) next.add(c);
    }
    // Diagnostic logs to help debug missing nodes (temporary)
    try {
      // log root adjacency and computed hinted/displayed ids
      // eslint-disable-next-line no-console
      console.log('ForceGraph: adj[root]=', adj.get('root'));
      // eslint-disable-next-line no-console
      console.log('ForceGraph: revealed=', Array.from(revealed));
      // eslint-disable-next-line no-console
      console.log('ForceGraph: hinted(before)=', Array.from(next));
    } catch (e) {}
    setHinted(next);
  }, [adj, revealed]);

  const displayedIds = useMemo(() => {
    const s = new Set([...Array.from(revealed), ...Array.from(hinted)]);
    if (s.size === 0 && nodes.length > 0) s.add(nodes[0].id);
    return s;
  }, [revealed, hinted, nodes]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const bounds = svgEl.getBoundingClientRect();
    const width = bounds.width || 1200;
    const height = bounds.height || 800;

    // Arrange nodes in layered rows by BFS distance from the root to reduce crossings.
    const SPACING = ROW_SPACING; // vertical spacing between layers
    const displayedIds = new Set<string>([...Array.from(revealed), ...Array.from(hinted)]);
    const displayedNodes = nodes.filter((n) => displayedIds.has(n.id));

    // compute masthead height to avoid overlap
    let mastheadOffset = 0;
    try {
      const mast = document.querySelector('.masthead');
      if (mast) mastheadOffset = Math.ceil((mast as HTMLElement).getBoundingClientRect().height) + 20;
    } catch (e) {
      mastheadOffset = 60;
    }

    // Determine BFS levels from root
    const rootLeaf = (leaves.find((l) => l.id === 'root') ?? leaves[0]);
    const rootId = rootLeaf?.id;
    const levels = new Map<string, number>();
    if (rootId && displayedIds.has(rootId)) {
      const q: string[] = [rootId];
      levels.set(rootId, 0);
      while (q.length) {
        const cur = q.shift()!;
        const curLevel = levels.get(cur) ?? 0;
        const neigh = adj.get(cur) ?? [];
        for (const n of neigh) {
          if (!displayedIds.has(n)) continue;
          if (!levels.has(n)) {
            levels.set(n, curLevel + 1);
            q.push(n);
          }
        }
      }
    }

    // Apply any forced `row` overrides from the leaf data. These explicitly set
    // which row (level) a node should appear on. We allow overriding BFS levels
    // so you can pin specific nodes (e.g., "Karlopolis 4-9") to the same row.
    for (const n of displayedNodes) {
      const forced = typeof n.leaf.row === 'number' ? Math.max(0, Math.floor(n.leaf.row)) : null;
      if (forced !== null) {
        levels.set(n.id, forced);
      }
    }

    // Nodes not reachable from root get placed at deeper level after others.
    // Also ensure `maxLevel` includes any forced rows.
    let maxLevel = 0;
    for (const n of displayedNodes) {
      if (!levels.has(n.id)) levels.set(n.id, (maxLevel += 1));
      maxLevel = Math.max(maxLevel, levels.get(n.id) ?? 0);
    }

    // bucket nodes per level to compute x positions
    const buckets: string[][] = [];
    for (const [id, lvl] of levels.entries()) {
      if (!buckets[lvl]) buckets[lvl] = [];
      buckets[lvl].push(id);
    }

    const paddingX = 40;
    const paddingY = mastheadOffset;

    // compute positions: each level is a horizontal row (vertical orientation)
    if (orientation === 'vertical') {
      for (let lvl = 0; lvl <= maxLevel; lvl++) {
        const bucket = buckets[lvl] || [];
        // respect optional `col` override per node
        const forcedMap = new Map<number, string>();
        const remaining: string[] = [];
        let maxForced = -1;
        for (const id of bucket) {
          const n = nodes.find((x) => x.id === id);
          if (n && typeof n.leaf.col === 'number' && Number.isFinite(n.leaf.col)) {
            const idx = Math.max(0, Math.floor(n.leaf.col));
            forcedMap.set(idx, id);
            maxForced = Math.max(maxForced, idx);
          } else {
            remaining.push(id);
          }
        }
        // total columns is max of explicit indices or count of items
        const cols = Math.max(bucket.length, maxForced + 1);
        const positions: (string | null)[] = new Array(Math.max(1, cols)).fill(null);
        for (const [idx, id] of forcedMap.entries()) positions[idx] = id;
        remaining.sort();
        let ri = 0;
        for (let p = 0; p < positions.length; p++) {
          if (positions[p] == null && ri < remaining.length) {
            positions[p] = remaining[ri++];
          }
        }

        const rowY = paddingY + lvl * SPACING + SPACING / 2;
        const totalWidth = (positions.length - 1) * SPACING;
        const startX = Math.max(paddingX + SPACING / 2, (width - totalWidth) / 2);
        positions.forEach((id, idx) => {
          if (!id) return;
          const node = nodes.find((n) => n.id === id);
          if (node) {
            node.x = startX + idx * SPACING;
            node.y = rowY;
          }
        });
      }
    } else {
      // horizontal orientation: each level becomes a column, nodes in a column stack vertically
      for (let lvl = 0; lvl <= maxLevel; lvl++) {
        const bucket = buckets[lvl] || [];
        const forcedMap = new Map<number, string>();
        const remaining: string[] = [];
        let maxForced = -1;
        for (const id of bucket) {
          const n = nodes.find((x) => x.id === id);
          if (n && typeof n.leaf.col === 'number' && Number.isFinite(n.leaf.col)) {
            const idx = Math.max(0, Math.floor(n.leaf.col));
            forcedMap.set(idx, id);
            maxForced = Math.max(maxForced, idx);
          } else {
            remaining.push(id);
          }
        }
        const rowsCount = Math.max(bucket.length, maxForced + 1);
        const positions: (string | null)[] = new Array(Math.max(1, rowsCount)).fill(null);
        for (const [idx, id] of forcedMap.entries()) positions[idx] = id;
        remaining.sort();
        let ri = 0;
        for (let p = 0; p < positions.length; p++) {
          if (positions[p] == null && ri < remaining.length) {
            positions[p] = remaining[ri++];
          }
        }

        const colX = paddingX + lvl * SPACING + SPACING / 2;
        const totalHeight = (positions.length - 1) * SPACING;
        const startY = Math.max(paddingY + SPACING / 2, (height - totalHeight) / 2);
        positions.forEach((id, idx) => {
          if (!id) return;
          const node = nodes.find((n) => n.id === id);
          if (node) {
            node.x = colX;
            node.y = startY + idx * SPACING;
          }
        });
      }
    }

    // Position SVG elements based on computed grid coordinates.
    // Only render links between displayed nodes
    // Render straight links (lines) between node centers.
    for (const link of links) {
      const sId = typeof link.source === "string" ? link.source : link.source.id;
      const tId = typeof link.target === "string" ? link.target : link.target.id;
      if (!displayedIds.has(sId) || !displayedIds.has(tId)) continue;
      const el = linkRefs.current.get(linkKey(link));
      const s = nodes.find((n) => n.id === sId);
      const t = nodes.find((n) => n.id === tId);
      if (el && s?.x != null && t?.x != null) {
        el.setAttribute("x1", String(s.x));
        el.setAttribute("y1", String(s.y ?? 0));
        el.setAttribute("x2", String(t.x));
        el.setAttribute("y2", String(t.y ?? 0));
      }
    }

    for (const node of nodes) {
      const el = nodeRefs.current.get(node.id);
      if (el && node.x != null && displayedIds.has(node.id)) {
        el.setAttribute("transform", `translate(${node.x}, ${node.y ?? 0})`);
      } else if (el) {
        // hide nodes that aren't displayed
        el.setAttribute("transform", `translate(-9999, -9999)`);
      }
    }

    // Compute content size based on bucketed layout (differs by orientation)
    const maxCols = buckets.reduce((m, b) => Math.max(m, (b || []).length), 0) || 1;
    let contentWidth = Math.max(0, paddingX * 2 + maxCols * SPACING + 40);
    let contentHeight = paddingY + (maxLevel + 1) * SPACING + 40;
    if (orientation === 'horizontal') {
      // width grows with levels, height grows with largest bucket size
      contentWidth = paddingX + (maxLevel + 1) * SPACING + 40;
      contentHeight = Math.max(0, paddingY * 2 + maxCols * SPACING + 40);
    }

    // Build per-level row metadata for rendering subtle background and SKS label
    const rows: { level: number; y: number; rectX: number; rectWidth: number; sks?: string | null }[] = [];
    for (let lvl = 0; lvl <= maxLevel; lvl++) {
      const bucket = buckets[lvl] || [];
      const rowY = paddingY + lvl * SPACING + SPACING / 2;
      const rectX = paddingX;
      const rectWidth = Math.max(0, maxCols * SPACING);
      // find first sks assignment in this bucket (if any)
      let sksVal: string | null = null;
      for (const id of bucket) {
        const n = nodes.find((x) => x.id === id);
        if (n?.leaf?.sks) {
          sksVal = n.leaf.sks as string;
          break;
        }
      }
      rows.push({ level: lvl, y: rowY, rectX, rectWidth, sks: sksVal });
    }
    // compute screen coordinates for full-width (or full-height) glows
    const screenRows = rows.map((r) => {
      const scale = Math.min(1, width / Math.max(contentWidth, 1));
      const translateY = 0;
      const screenY = r.y * scale + translateY;
      const screenHeight = ROW_SPACING * scale;
      const label: string | undefined = r.sks === 'sks24' ? 'SKS 2024' : r.sks === 'sks25' ? 'SKS 2025' : r.sks === 'sks26' ? 'SKS 2026' : r.sks ?? undefined;
      const color: string | undefined = r.sks === 'sks24' ? '#ff9aa2' : r.sks === 'sks25' ? '#ff6b6b' : r.sks === 'sks26' ? '#ff3b3b' : '#ff4d4d';
      return { ...r, screenY, screenHeight, label, color };
    });
    setLevelRows(screenRows);
    setSvgWidth(width);

    // Make SVG full-width to avoid horizontal page scroll; we'll scale content to fit if too wide
    svgEl.style.display = "block";
    svgEl.style.width = "100%";
    svgEl.style.height = `${contentHeight}px`;

    // Scale factor to fit content into viewport width
    const scale = Math.min(1, width / Math.max(contentWidth, 1));
    // Compute cluster bounds (minX/maxX) of positioned nodes to center cluster precisely
    const displayedNodesPositions = nodes.filter((n) => displayedIds.has(n.id) && n.x != null).map((n) => n.x as number);
    let translateX = 0;
    if (displayedNodesPositions.length > 0) {
      const minX = Math.min(...displayedNodesPositions);
      const maxX = Math.max(...displayedNodesPositions);
      const centerX = (minX + maxX) / 2;
      // We want centerX (in content coords) to map to width/2 (screen coords), so translateX satisfies:
      // (centerX + translateX) * scale = width/2  => translateX = width/(2*scale) - centerX
      translateX = width / (2 * scale) - centerX;
    } else {
      translateX = Math.max(0, (width - contentWidth * scale) / 2) / scale;
    }
    const translateY = 0; // keep aligned to top
    const vp = viewportRef.current;
    if (vp) {
      vp.setAttribute("transform", `translate(${translateX}, ${translateY}) scale(${scale})`);
    }

    // If a node was just revealed, only scroll minimally so the revealed node is visible (no jump-to-top)
    const pending = pendingScrollRef.current;
    if (pending) {
      const nodeEl = nodeRefs.current.get(pending);
      if (nodeEl) {
        const rect = nodeEl.getBoundingClientRect();
        const nodeTop = rect.top + window.scrollY;
        const nodeBottom = rect.bottom + window.scrollY;
        const viewTop = window.scrollY;
        const viewBottom = window.scrollY + window.innerHeight;
        let targetScroll: number | null = null;
        const margin = 80;
        if (nodeTop < viewTop + margin) {
          targetScroll = Math.max(0, nodeTop - margin);
        } else if (nodeBottom > viewBottom - margin) {
          targetScroll = Math.max(0, nodeTop - Math.floor(window.innerHeight * 0.4));
        }
        if (targetScroll != null) window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
      pendingScrollRef.current = null;
    }

    // Leave the viewport transform as-is (we set translate+scale above).

    // Re-run layout when nodes/links/reveal state or on explicit resize tick changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links, revealed, hinted, resizeTick]);

  // helper to reveal a hinted node: move it to revealed and add its children as hinted
  function revealNode(id: string) {
    if (revealed.has(id)) return;
    const nextRevealed = new Set(revealed);
    nextRevealed.add(id);
    const nextHinted = new Set(hinted);
    nextHinted.delete(id);
    const children = adj.get(id) ?? [];
    for (const c of children) if (!nextRevealed.has(c)) nextHinted.add(c);
    setRevealed(nextRevealed);
    setHinted(nextHinted);
    setLastExpanded(id);
    pendingScrollRef.current = id;
  }

  // recompute layout on window resize
  useEffect(() => {
    function onResize() {
      setResizeTick((t) => t + 1);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <svg ref={svgRef} className="graph-svg" role="img" aria-label="Event network graph">
      {/* full-width level glows (render behind viewport) */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {levelRows
          .filter((r) => r.sks)
          .map((r) => {
            const color = r.color || '#ff6b6b';
            return (
              <>
                <linearGradient id={`grad-top-${r.level}`} key={`grad-top-${r.level}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
                <linearGradient id={`grad-bottom-${r.level}`} key={`grad-bottom-${r.level}`} x1="0" x2="0" y1="1" y2="0">
                  <stop offset="0%" stopColor={color} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </>
            );
          })}
      </defs>
      <g className="graph-level-glow">
        {levelRows.map((r) => {
          if (!r.sks || r.screenY == null || r.screenHeight == null) return null;
          const topY = r.screenY - r.screenHeight / 2;
          const bottomY = r.screenY + r.screenHeight / 2;
          const midY = r.screenY;
          const gradTopId = `grad-top-${r.level}`;
          const gradBottomId = `grad-bottom-${r.level}`;
          const borderHeight = 3;
          return (
            <g key={`glow-${r.level}`}> 
              {/* top solid border */}
              <rect x={0} y={topY} width="100%" height={borderHeight} fill={r.color} opacity={0.18} />
              {/* bottom solid border */}
              <rect x={0} y={bottomY - borderHeight} width="100%" height={borderHeight} fill={r.color} opacity={0.18} />

              {/* top inward fading glow down to middle */}
              <rect x={0} y={topY + borderHeight} width="100%" height={Math.max(0, midY - (topY + borderHeight))} fill={`url(#${gradTopId})`} filter="url(#glow)" />
              {/* bottom inward fading glow up to middle */}
              <rect x={0} y={midY} width="100%" height={Math.max(0, (bottomY - borderHeight) - midY)} fill={`url(#${gradBottomId})`} filter="url(#glow)" />

              <text x={(svgWidth || window.innerWidth) - 18} y={r.screenY + 6} textAnchor="end" fill="#ffffff" fontSize={12} fontFamily="IBM Plex Sans" fontWeight={600}>{r.label}</text>
            </g>
          );
        })}
      </g>

      <g ref={viewportRef}>
        <g className="graph-levels">
          {levelRows.map((r) => {
            if (!r.sks) return null;
            const label = r.sks === 'sks24' ? 'SKS 2024' : r.sks === 'sks25' ? 'SKS 2025' : r.sks === 'sks26' ? 'SKS 2026' : r.sks;
            const color = r.sks === 'sks24' ? '#ff9aa2' : r.sks === 'sks25' ? '#ff6b6b' : r.sks === 'sks26' ? '#ff3b3b' : '#ff4d4d';
            return (
              <g key={`lvl-${r.level}`}>
                <rect
                  x={r.rectX}
                  y={r.y - ROW_SPACING / 2}
                  width={r.rectWidth}
                  height={ROW_SPACING}
                    fill={"none"}
                    stroke={color}
                    strokeWidth={2}
                    opacity={0.18}
                />
                  <text x={r.rectX + r.rectWidth + 12} y={r.y + 6} fill="#ffffff" fontSize={12} fontFamily="IBM Plex Sans">
                  {label}
                </text>
              </g>
            );
          })}
        </g>
        <g className="graph-links">
          {links
            .filter((link) => {
              const s = typeof link.source === "string" ? link.source : link.source.id;
              const t = typeof link.target === "string" ? link.target : link.target.id;
              return displayedIds.has(s) && displayedIds.has(t);
            })
            .map((link) => {
              const s = typeof link.source === "string" ? link.source : link.source.id;
              const t = typeof link.target === "string" ? link.target : link.target.id;
              // Highlight only when connected to a revealed node that is NOT a hinted (greyed) node.
              const isConnectedToRevealed =
                (revealed.has(s) && !hinted.has(t)) || (revealed.has(t) && !hinted.has(s));
              const className = "graph-link" + (isConnectedToRevealed ? " graph-link--revealed" : "");
              return (
                <line
                  key={linkKey(link)}
                  ref={(el) => {
                    if (el) linkRefs.current.set(linkKey(link), el);
                  }}
                  className={className}
                />
              );
            })}
        </g>
        <g className="graph-nodes">
          {nodes.map((node) => (
            <g
              key={node.id}
              data-id={node.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(node.id, el);
              }}
              className={
                "graph-node" +
                (revealed.has(node.id) ? " graph-node--revealed" : "") +
                (hinted.has(node.id) ? " graph-node--hint" : "") +
                (activeId === node.id ? " graph-node--active" : "") +
                (lastExpanded === node.id ? " graph-node--last" : "")
              }
              tabIndex={0}
              role="button"
              aria-label={`${node.leaf.title} — ${node.leaf.intro}`}
              onClick={() => {
                if (hinted.has(node.id)) {
                  revealNode(node.id);
                  // open detail immediately when first clicked (even if it was hinted)
                  setTimeout(() => onSelect(node.id), 80);
                } else if (revealed.has(node.id)) onSelect(node.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (hinted.has(node.id)) {
                    revealNode(node.id);
                    setTimeout(() => onSelect(node.id), 80);
                  } else if (revealed.has(node.id)) onSelect(node.id);
                }
              }}
            >
              <circle className="graph-node__ring" r="44" />
              <clipPath id={`clip-${node.id}`}>
                <circle r="36" />
              </clipPath>
              <image
                href={node.leaf.img}
                x={-36}
                y={-36}
                width={72}
                height={72}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#clip-${node.id})`}
              />
              {/* tag removed from graph visualization */}
              <rect
                className="graph-node__title-bg"
                x={-80}
                y={48}
                width={160}
                height={26}
                rx={6}
                fill="#000"
                opacity={0.9}
              />
              <text className="graph-node__title" y={62} textAnchor="middle">
                {node.leaf.title}
              </text>
              <text className="graph-node__intro" y={80} textAnchor="middle">
                {truncate(node.leaf.intro, 34)}
              </text>
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

function linkKey(link: GraphLink) {
  const s = typeof link.source === "string" ? link.source : link.source.id;
  const t = typeof link.target === "string" ? link.target : link.target.id;
  return [s, t].sort().join("::");
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
