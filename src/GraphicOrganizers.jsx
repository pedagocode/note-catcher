import { useState } from "react";

/* ─── Band colors ─── */
const BANDS = {
  ms: { color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", tagBg: "#CCFBF1", label: "Grades 6–8" },
  hs: { color: "#6366F1", bg: "#EEF2FF", border: "#C7D2FE", tagBg: "#E0E7FF", label: "Grades 9–12" },
};

/* ─── Template registry ─── */
export const ORGANIZER_TEMPLATES = [
  { id: "tchart",      label: "T-Chart",              band: "ms", icon: "⊤" },
  { id: "mindmap",     label: "Mind Map",             band: "ms", icon: "🕸" },
  { id: "venn",        label: "Venn Diagram",         band: "ms", icon: "◎" },
  { id: "frayer",      label: "Frayer Model",         band: "ms", icon: "◫" },
  { id: "kwl",         label: "KWL Chart",            band: "ms", icon: "K" },
  { id: "cornell",     label: "Cornell Notes",        band: "hs", icon: "📋" },
  { id: "argument",    label: "Argument Map",         band: "hs", icon: "⚖" },
  { id: "matrix",      label: "Source Comparison",    band: "hs", icon: "▦" },
  { id: "annotation",  label: "Annotation Margin",    band: "hs", icon: "✎" },
  { id: "timeline",    label: "Timeline / Sequence",  band: "hs", icon: "⟶" },
];

/* ─── Default data factories ─── */
export function getDefaultData(type) {
  switch (type) {
    case "tchart":     return { leftHeader: "", rightHeader: "", rows: [{ left: "", right: "" }] };
    case "mindmap":    return { center: "", branches: ["", "", ""] };
    case "venn":       return { leftLabel: "", rightLabel: "", leftOnly: "", overlap: "", rightOnly: "" };
    case "frayer":     return { term: "", definition: "", characteristics: "", examples: "", nonExamples: "" };
    case "kwl":        return { know: [""], want: [""], learned: [""] };
    case "cornell":    return { cues: [""], notes: "", summary: "" };
    case "argument":   return { claim: "", evidence: [{ point: "", reasoning: "" }], counterargument: "" };
    case "matrix":     return { criteria: ["", ""], sources: [{ name: "", values: ["", ""] }] };
    case "annotation": return { text: "", annotations: [""] };
    case "timeline":   return { events: [{ date: "", title: "", description: "" }] };
    default:           return {};
  }
}

/* ─── Shared styles ─── */
const S = {
  cell: {
    width: "100%", border: "none", borderRadius: 4, padding: "7px 9px",
    fontSize: 12, fontFamily: "Georgia, serif", color: "#1C1917",
    resize: "vertical", outline: "none", lineHeight: 1.5, boxSizing: "border-box",
  },
  hdr: {
    fontSize: 10, fontWeight: "bold", fontFamily: "monospace", textTransform: "uppercase",
    letterSpacing: 1.5, marginBottom: 5,
  },
  addBtn: (color) => ({
    fontSize: 10, fontFamily: "monospace", padding: "4px 10px", borderRadius: 5,
    cursor: "pointer", border: `1.5px dashed ${color}`, background: "transparent",
    color, marginTop: 6,
  }),
  rmBtn: {
    background: "none", border: "none", cursor: "pointer", opacity: 0.35, fontSize: 12, padding: "0 4px",
  },
  secLabel: (color) => ({
    fontSize: 9, fontFamily: "monospace", fontWeight: "bold", textTransform: "uppercase",
    letterSpacing: 1, color, marginBottom: 4, marginTop: 10,
  }),
};

/* helper input */
function In({ value, onChange, placeholder, rows, style }) {
  const Tag = rows && rows > 1 ? "textarea" : "input";
  return (
    <Tag
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || ""}
      {...(Tag === "textarea" ? { rows } : {})}
      style={{ ...S.cell, ...style }}
    />
  );
}

/* ═══════════════════════════════════════════
   MIDDLE SCHOOL (Grades 6-8) organizers
   ═══════════════════════════════════════════ */

function TChart({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  const bg = band.bg;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <In value={d.leftHeader} onChange={(v) => set((p) => ({ ...p, leftHeader: v }))} placeholder="Left header..." style={{ background: bg, fontWeight: "bold" }} />
        </div>
        <div>
          <In value={d.rightHeader} onChange={(v) => set((p) => ({ ...p, rightHeader: v }))} placeholder="Right header..." style={{ background: bg, fontWeight: "bold" }} />
        </div>
      </div>
      {d.rows.map((row, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 20px", gap: 10, marginTop: 6, alignItems: "start" }}>
          <In value={row.left} onChange={(v) => set((p) => {
            const rows = [...p.rows]; rows[i] = { ...rows[i], left: v }; return { ...p, rows };
          })} placeholder="..." style={{ background: "#fff" }} rows={2} />
          <In value={row.right} onChange={(v) => set((p) => {
            const rows = [...p.rows]; rows[i] = { ...rows[i], right: v }; return { ...p, rows };
          })} placeholder="..." style={{ background: "#fff" }} rows={2} />
          {d.rows.length > 1 && <button onClick={() => set((p) => ({ ...p, rows: p.rows.filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
        </div>
      ))}
      <button onClick={() => set((p) => ({ ...p, rows: [...p.rows, { left: "", right: "" }] }))} style={S.addBtn(band.color)}>+ row</button>
    </div>
  );
}

function MindMap({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div style={{ textAlign: "center" }}>
      <In value={d.center} onChange={(v) => set((p) => ({ ...p, center: v }))} placeholder="Central idea..." style={{ background: band.bg, fontWeight: "bold", textAlign: "center", fontSize: 14, borderRadius: 20, padding: "10px 16px" }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 12 }}>
        {d.branches.map((b, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ color: band.color, fontSize: 16 }}>↗</span>
            <In value={b} onChange={(v) => set((p) => {
              const branches = [...p.branches]; branches[i] = v; return { ...p, branches };
            })} placeholder={`Branch ${i + 1}`} style={{ background: "#fff", width: 140 }} />
            {d.branches.length > 1 && <button onClick={() => set((p) => ({ ...p, branches: p.branches.filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
          </div>
        ))}
      </div>
      <button onClick={() => set((p) => ({ ...p, branches: [...p.branches, ""] }))} style={S.addBtn(band.color)}>+ branch</button>
    </div>
  );
}

function VennDiagram({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 8 }}>
        <In value={d.leftLabel} onChange={(v) => set((p) => ({ ...p, leftLabel: v }))} placeholder="Left group label..." style={{ background: band.bg, fontWeight: "bold" }} />
        <In value={d.rightLabel} onChange={(v) => set((p) => ({ ...p, rightLabel: v }))} placeholder="Right group label..." style={{ background: band.bg, fontWeight: "bold" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <div>
          <div style={S.secLabel(band.color)}>Only Left</div>
          <In value={d.leftOnly} onChange={(v) => set((p) => ({ ...p, leftOnly: v }))} rows={4} style={{ background: "#fff" }} placeholder="Unique to left..." />
        </div>
        <div>
          <div style={S.secLabel(band.color)}>Both / Overlap</div>
          <In value={d.overlap} onChange={(v) => set((p) => ({ ...p, overlap: v }))} rows={4} style={{ background: band.bg }} placeholder="Shared..." />
        </div>
        <div>
          <div style={S.secLabel(band.color)}>Only Right</div>
          <In value={d.rightOnly} onChange={(v) => set((p) => ({ ...p, rightOnly: v }))} rows={4} style={{ background: "#fff" }} placeholder="Unique to right..." />
        </div>
      </div>
    </div>
  );
}

function FrayerModel({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 10 }}>
        <In value={d.term} onChange={(v) => set((p) => ({ ...p, term: v }))} placeholder="TERM or CONCEPT" style={{ background: band.bg, fontWeight: "bold", textAlign: "center", fontSize: 14, borderRadius: 20, padding: "8px 16px" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { key: "definition", label: "Definition" },
          { key: "characteristics", label: "Characteristics" },
          { key: "examples", label: "Examples" },
          { key: "nonExamples", label: "Non-Examples" },
        ].map(({ key, label }) => (
          <div key={key}>
            <div style={S.secLabel(band.color)}>{label}</div>
            <In value={d[key]} onChange={(v) => set((p) => ({ ...p, [key]: v }))} rows={3} style={{ background: "#fff" }} placeholder={`${label}...`} />
          </div>
        ))}
      </div>
    </div>
  );
}

function KWLChart({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  const cols = [
    { key: "know", label: "K - What I Know" },
    { key: "want", label: "W - What I Want to Know" },
    { key: "learned", label: "L - What I Learned" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
      {cols.map(({ key, label }) => (
        <div key={key}>
          <div style={{ ...S.hdr, color: band.color }}>{label}</div>
          {d[key].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "start" }}>
              <In value={item} onChange={(v) => set((p) => {
                const arr = [...p[key]]; arr[i] = v; return { ...p, [key]: arr };
              })} style={{ background: "#fff" }} placeholder="..." />
              {d[key].length > 1 && <button onClick={() => set((p) => ({ ...p, [key]: p[key].filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
            </div>
          ))}
          <button onClick={() => set((p) => ({ ...p, [key]: [...p[key], ""] }))} style={S.addBtn(band.color)}>+ item</button>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   HIGH SCHOOL (Grades 9-12) organizers
   ═══════════════════════════════════════════ */

function CornellNotes({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 10 }}>
        <div>
          <div style={{ ...S.hdr, color: band.color }}>Cues / Questions</div>
          {d.cues.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "start" }}>
              <In value={c} onChange={(v) => set((p) => {
                const cues = [...p.cues]; cues[i] = v; return { ...p, cues };
              })} style={{ background: "#fff" }} placeholder="Cue..." />
              {d.cues.length > 1 && <button onClick={() => set((p) => ({ ...p, cues: p.cues.filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
            </div>
          ))}
          <button onClick={() => set((p) => ({ ...p, cues: [...p.cues, ""] }))} style={S.addBtn(band.color)}>+ cue</button>
        </div>
        <div>
          <div style={{ ...S.hdr, color: band.color }}>Notes</div>
          <In value={d.notes} onChange={(v) => set((p) => ({ ...p, notes: v }))} rows={8} style={{ background: "#fff" }} placeholder="Main notes..." />
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <div style={{ ...S.hdr, color: band.color }}>Summary</div>
        <In value={d.summary} onChange={(v) => set((p) => ({ ...p, summary: v }))} rows={3} style={{ background: band.bg }} placeholder="Summarize in your own words..." />
      </div>
    </div>
  );
}

function ArgumentMap({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div>
      <div style={{ ...S.hdr, color: band.color }}>Claim</div>
      <In value={d.claim} onChange={(v) => set((p) => ({ ...p, claim: v }))} style={{ background: band.bg, fontWeight: "bold" }} placeholder="My claim is..." />
      <div style={S.secLabel(band.color)}>Evidence & Reasoning</div>
      {d.evidence.map((ev, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 20px", gap: 8, marginBottom: 6, alignItems: "start" }}>
          <In value={ev.point} onChange={(v) => set((p) => {
            const evidence = [...p.evidence]; evidence[i] = { ...evidence[i], point: v }; return { ...p, evidence };
          })} style={{ background: "#fff" }} placeholder="Evidence..." />
          <In value={ev.reasoning} onChange={(v) => set((p) => {
            const evidence = [...p.evidence]; evidence[i] = { ...evidence[i], reasoning: v }; return { ...p, evidence };
          })} style={{ background: "#fff" }} placeholder="Reasoning..." />
          {d.evidence.length > 1 && <button onClick={() => set((p) => ({ ...p, evidence: p.evidence.filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
        </div>
      ))}
      <button onClick={() => set((p) => ({ ...p, evidence: [...p.evidence, { point: "", reasoning: "" }] }))} style={S.addBtn(band.color)}>+ evidence</button>
      <div style={{ ...S.hdr, color: band.color, marginTop: 12 }}>Counterargument</div>
      <In value={d.counterargument} onChange={(v) => set((p) => ({ ...p, counterargument: v }))} rows={2} style={{ background: "#fff" }} placeholder="What might someone argue against this?" />
    </div>
  );
}

function SourceMatrix({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 6, tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th style={{ width: 100 }} />
            {d.criteria.map((c, ci) => (
              <th key={ci}>
                <In value={c} onChange={(v) => set((p) => {
                  const criteria = [...p.criteria]; criteria[ci] = v; return { ...p, criteria };
                })} style={{ background: band.bg, fontWeight: "bold", textAlign: "center" }} placeholder={`Criterion ${ci + 1}`} />
              </th>
            ))}
            <th style={{ width: 30 }}>
              <button onClick={() => set((p) => ({
                ...p,
                criteria: [...p.criteria, ""],
                sources: p.sources.map((s) => ({ ...s, values: [...s.values, ""] })),
              }))} style={{ ...S.addBtn(band.color), padding: "2px 6px" }}>+</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {d.sources.map((src, si) => (
            <tr key={si}>
              <td>
                <In value={src.name} onChange={(v) => set((p) => {
                  const sources = [...p.sources]; sources[si] = { ...sources[si], name: v }; return { ...p, sources };
                })} style={{ background: "#fff", fontWeight: "bold" }} placeholder={`Source ${si + 1}`} />
              </td>
              {src.values.map((val, vi) => (
                <td key={vi}>
                  <In value={val} onChange={(v) => set((p) => {
                    const sources = [...p.sources];
                    const values = [...sources[si].values]; values[vi] = v;
                    sources[si] = { ...sources[si], values };
                    return { ...p, sources };
                  })} style={{ background: "#fff" }} rows={2} placeholder="..." />
                </td>
              ))}
              <td>
                {d.sources.length > 1 && <button onClick={() => set((p) => ({ ...p, sources: p.sources.filter((_, j) => j !== si) }))} style={S.rmBtn}>✕</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => set((p) => ({
        ...p,
        sources: [...p.sources, { name: "", values: p.criteria.map(() => "") }],
      }))} style={S.addBtn(band.color)}>+ source row</button>
    </div>
  );
}

function AnnotationMargin({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 10 }}>
      <div>
        <div style={{ ...S.hdr, color: band.color }}>Source Text / Passage</div>
        <In value={d.text} onChange={(v) => set((p) => ({ ...p, text: v }))} rows={10} style={{ background: "#fff" }} placeholder="Paste or type the passage here..." />
      </div>
      <div>
        <div style={{ ...S.hdr, color: band.color }}>Margin Notes</div>
        {d.annotations.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 4, marginBottom: 4, alignItems: "start" }}>
            <In value={a} onChange={(v) => set((p) => {
              const annotations = [...p.annotations]; annotations[i] = v; return { ...p, annotations };
            })} style={{ background: band.bg }} placeholder="Note..." rows={2} />
            {d.annotations.length > 1 && <button onClick={() => set((p) => ({ ...p, annotations: p.annotations.filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
          </div>
        ))}
        <button onClick={() => set((p) => ({ ...p, annotations: [...p.annotations, ""] }))} style={S.addBtn(band.color)}>+ note</button>
      </div>
    </div>
  );
}

function Timeline({ data, onChange, band }) {
  const d = data;
  const set = (fn) => onChange(fn(d));
  return (
    <div>
      {d.events.map((ev, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: band.color, flexShrink: 0 }} />
            {i < d.events.length - 1 && <div style={{ width: 2, flex: 1, background: band.border, minHeight: 30 }} />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
              <In value={ev.date} onChange={(v) => set((p) => {
                const events = [...p.events]; events[i] = { ...events[i], date: v }; return { ...p, events };
              })} style={{ background: band.bg, width: 100, fontWeight: "bold" }} placeholder="Date..." />
              <In value={ev.title} onChange={(v) => set((p) => {
                const events = [...p.events]; events[i] = { ...events[i], title: v }; return { ...p, events };
              })} style={{ background: "#fff", fontWeight: "bold", flex: 1 }} placeholder="Event title..." />
              {d.events.length > 1 && <button onClick={() => set((p) => ({ ...p, events: p.events.filter((_, j) => j !== i) }))} style={S.rmBtn}>✕</button>}
            </div>
            <In value={ev.description} onChange={(v) => set((p) => {
              const events = [...p.events]; events[i] = { ...events[i], description: v }; return { ...p, events };
            })} rows={2} style={{ background: "#fff" }} placeholder="Description..." />
          </div>
        </div>
      ))}
      <button onClick={() => set((p) => ({ ...p, events: [...p.events, { date: "", title: "", description: "" }] }))} style={S.addBtn(band.color)}>+ event</button>
    </div>
  );
}

/* ─── Renderer ─── */
const COMPONENTS = {
  tchart: TChart,
  mindmap: MindMap,
  venn: VennDiagram,
  frayer: FrayerModel,
  kwl: KWLChart,
  cornell: CornellNotes,
  argument: ArgumentMap,
  matrix: SourceMatrix,
  annotation: AnnotationMargin,
  timeline: Timeline,
};

export default function OrganizerRenderer({ type, data, onChange }) {
  const tmpl = ORGANIZER_TEMPLATES.find((t) => t.id === type);
  const band = tmpl ? BANDS[tmpl.band] : BANDS.ms;
  const Comp = COMPONENTS[type];
  if (!Comp) return <div style={{ color: "#A8A29E", fontSize: 12 }}>Unknown organizer type</div>;
  return <Comp data={data} onChange={onChange} band={band} />;
}

export { BANDS };
