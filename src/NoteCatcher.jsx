import { useState, useRef, useEffect, useCallback } from "react";
import OrganizerRenderer, { ORGANIZER_TEMPLATES, BANDS, getDefaultData } from "./GraphicOrganizers";
const LEVELS = [
  {
    id: "remember",
    label: "Remember & Notice",
    dok: "DOK 1",
    color: "#3B82F6",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    tagBg: "#DBEAFE",
    blocks: [
      { id: "notice", label: "I noticed...", prompt: "What did you observe or see?" },
      { id: "term", label: "Key term:", prompt: "Define the key vocabulary." },
      { id: "fact", label: "Facts / Details:", prompt: "What are the important facts?" },
      { id: "main", label: "The main idea is...", prompt: "What is this mostly about?" },
    ],
  },
  {
    id: "understand",
    label: "Understand & Explain",
    dok: "DOK 2",
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
    tagBg: "#D1FAE5",
    blocks: [
      { id: "means", label: "This means...", prompt: "What does this idea mean?" },
      { id: "words", label: "In my own words...", prompt: "Explain it without the text." },
      { id: "example", label: "An example would be...", prompt: "Give a concrete example." },
      { id: "works", label: "This works by...", prompt: "Explain the process or mechanism." },
    ],
  },
  {
    id: "analyze",
    label: "Apply & Analyze",
    dok: "DOK 3",
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
    tagBg: "#FEF3C7",
    blocks: [
      { id: "connects", label: "This connects to...", prompt: "What prior knowledge or text does this link to?" },
      { id: "pattern", label: "The pattern I see is...", prompt: "What repeats or structures the idea?" },
      { id: "evidence", label: "Evidence:", prompt: "What specific evidence supports this?" },
      { id: "use", label: "I can apply this when...", prompt: "Where does this idea show up in the world?" },
    ],
  },
  {
    id: "evaluate",
    label: "Evaluate & Synthesize",
    dok: "DOK 4",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    tagBg: "#EDE9FE",
    blocks: [
      { id: "claim", label: "My claim is...", prompt: "What argument or position do you want to defend?" },
      { id: "agree", label: "I agree / disagree because...", prompt: "Take a stance and explain your reasoning." },
      { id: "question", label: "A question this raises...", prompt: "What are you still wondering?" },
      { id: "significance", label: "The significance is...", prompt: "Why does this matter beyond the text?" },
    ],
  },
];
const DRAW_COLORS = ["#1C1917", "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6"];

function DoodlePad({ noteUid, color, bg, onDataChange, initialData }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const [penColor, setPenColor] = useState(color);
  const [penSize, setPenSize] = useState(3);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (initialData) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = initialData;
    }
  }, []);

  const save = useCallback(() => {
    if (canvasRef.current && onDataChange) {
      onDataChange(noteUid, canvasRef.current.toDataURL("image/png"));
    }
  }, [noteUid, onDataChange]);

  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
  }

  function draw(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = erasing ? "#FFFFFF" : penColor;
    ctx.lineWidth = erasing ? penSize * 4 : penSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  }

  function endDraw() {
    if (drawing.current) {
      drawing.current = false;
      lastPos.current = null;
      save();
    }
  }

  function clearCanvas() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    save();
  }

  return (
    <div style={{ marginTop: 8 }}>
      {/* Toolbar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6, marginBottom: 6, flexWrap: "wrap",
      }}>
        {DRAW_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => { setPenColor(c); setErasing(false); }}
            style={{
              width: 18, height: 18, borderRadius: "50%", background: c, border: penColor === c && !erasing ? "2.5px solid #1C1917" : "2px solid #D6D3D1",
              cursor: "pointer", padding: 0, boxShadow: penColor === c && !erasing ? "0 0 0 2px #FCD34D" : "none",
            }}
          />
        ))}
        <div style={{ width: 1, height: 16, background: "#D6D3D1", margin: "0 2px" }} />
        {[2, 4, 7].map((s) => (
          <button
            key={s}
            onClick={() => setPenSize(s)}
            style={{
              width: 22, height: 22, borderRadius: 4, background: penSize === s ? "#F5F5F4" : "transparent",
              border: penSize === s ? "1.5px solid #A8A29E" : "1.5px solid transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
            }}
          >
            <div style={{ width: s + 2, height: s + 2, borderRadius: "50%", background: "#1C1917" }} />
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: "#D6D3D1", margin: "0 2px" }} />
        <button
          onClick={() => setErasing((v) => !v)}
          style={{
            fontSize: 10, fontFamily: "monospace", padding: "3px 7px", borderRadius: 4, cursor: "pointer",
            background: erasing ? "#FEE2E2" : "transparent", border: erasing ? "1.5px solid #FCA5A5" : "1.5px solid #D6D3D1",
            color: erasing ? "#DC2626" : "#78716C",
          }}
        >
          eraser
        </button>
        <button
          onClick={clearCanvas}
          style={{
            fontSize: 10, fontFamily: "monospace", padding: "3px 7px", borderRadius: 4, cursor: "pointer",
            background: "transparent", border: "1.5px solid #D6D3D1", color: "#78716C",
          }}
        >
          clear
        </button>
      </div>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={160}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
        style={{
          width: "100%", height: 160, borderRadius: 5, border: "1.5px dashed #D6D3D1",
          cursor: erasing ? "cell" : "crosshair", touchAction: "none", display: "block",
          background: "#FFFFFF",
        }}
      />
    </div>
  );
}

let idCounter = 0;
function uid() { return ++idCounter; }
export default function NoteCatcher() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState([]);
  const [activeLevel, setActiveLevel] = useState("remember");
  const [sidebarMode, setSidebarMode] = useState("blocks"); // "blocks" | "organizers"
  function addBlock(block) {
    setNotes((prev) => [...prev, { ...block, uid: uid(), text: "", drawing: false, drawingData: null }]);
  }
  function addOrganizer(templateId) {
    const tmpl = ORGANIZER_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    const band = BANDS[tmpl.band];
    setNotes((prev) => [...prev, {
      type: "organizer", organizerId: templateId, uid: uid(),
      label: tmpl.label, icon: tmpl.icon,
      color: band.color, bg: band.bg, border: band.border, tagBg: band.tagBg,
      bandLabel: band.label,
      organizerData: getDefaultData(templateId),
    }]);
  }
  function updateOrganizerData(noteUid, data) {
    setNotes((prev) => prev.map((n) => (n.uid === noteUid ? { ...n, organizerData: data } : n)));
  }
  function updateText(uid, text) {
    setNotes((prev) => prev.map((n) => (n.uid === uid ? { ...n, text } : n)));
  }
  function toggleDrawing(uid) {
    setNotes((prev) => prev.map((n) => (n.uid === uid ? { ...n, drawing: !n.drawing } : n)));
  }
  function updateDrawingData(uid, data) {
    setNotes((prev) => prev.map((n) => (n.uid === uid ? { ...n, drawingData: data } : n)));
  }
  function removeNote(uid) {
    setNotes((prev) => prev.filter((n) => n.uid !== uid));
  }
  function moveNote(uid, dir) {
    setNotes((prev) => {
      const idx = prev.findIndex((n) => n.uid === uid);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }
  const activeL = LEVELS.find((l) => l.id === activeLevel);
  return (
    <div style={{
      fontFamily: "'Georgia', serif",
      minHeight: "100vh",
      background: "#F8F7F4",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: "#1C1917",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: "3px solid #D97706",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ color: "#FCD34D", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 3 }}>
            Digital Note Builder
          </div>
          <div style={{ color: "#FAFAF9", fontSize: 18, fontWeight: "bold" }}>
            My Learning Notes
          </div>
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Topic or reading title..."
          style={{
            marginLeft: "auto",
            background: "transparent",
            border: "1px solid #57534E",
            borderRadius: 6,
            padding: "7px 12px",
            color: "#E7E5E4",
            fontSize: 13,
            fontFamily: "Georgia, serif",
            width: 260,
            outline: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 240,
          background: "#FAFAF9",
          borderRight: "1px solid #E7E5E4",
          overflowY: "auto",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Sidebar mode toggle */}
          <div style={{ display: "flex", margin: "10px 10px 6px", borderRadius: 7, overflow: "hidden", border: "1px solid #E7E5E4" }}>
            {[{ key: "blocks", label: "Blocks" }, { key: "organizers", label: "Organizers" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSidebarMode(key)}
                style={{
                  flex: 1, padding: "6px 0", fontSize: 10, fontFamily: "monospace", fontWeight: "bold",
                  letterSpacing: 1, textTransform: "uppercase", border: "none", cursor: "pointer",
                  background: sidebarMode === key ? "#1C1917" : "#FAFAF9",
                  color: sidebarMode === key ? "#FCD34D" : "#78716C",
                }}
              >{label}</button>
            ))}
          </div>

          {sidebarMode === "blocks" ? (
            <>
              <div style={{ padding: "8px 14px 6px", color: "#78716C", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace" }}>
                Block Palette
              </div>
              <div style={{ padding: "0 10px 10px" }}>
                {LEVELS.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setActiveLevel(level.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 10px",
                      marginBottom: 3,
                      borderRadius: 7,
                      border: activeLevel === level.id ? `2px solid ${level.color}` : "2px solid transparent",
                      background: activeLevel === level.id ? level.bg : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#1C1917", fontFamily: "Georgia, serif" }}>{level.label}</span>
                      <span style={{
                        fontSize: 9,
                        color: level.color,
                        background: level.tagBg,
                        padding: "2px 5px",
                        borderRadius: 3,
                        fontFamily: "monospace",
                        fontWeight: "bold",
                      }}>{level.dok}</span>
                    </div>
                  </button>
                ))}
              </div>
              {activeL && (
                <div style={{ padding: "0 10px 14px", flex: 1 }}>
                  <div style={{
                    fontSize: 10,
                    color: activeL.color,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    fontFamily: "monospace",
                    marginBottom: 8,
                    paddingLeft: 2,
                  }}>
                    Click to add →
                  </div>
                  {activeL.blocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => addBlock({ ...block, levelId: activeL.id, color: activeL.color, bg: activeL.bg, border: activeL.border, tagBg: activeL.tagBg, levelLabel: activeL.label })}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 10px",
                        marginBottom: 6,
                        borderRadius: 7,
                        border: `1.5px solid ${activeL.border}`,
                        background: "#FFFFFF",
                        cursor: "pointer",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = activeL.bg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
                    >
                      <div style={{ fontSize: 12, fontWeight: "bold", color: "#1C1917", marginBottom: 2, fontFamily: "Georgia, serif" }}>
                        {block.label}
                      </div>
                      <div style={{ fontSize: 10, color: "#A8A29E", fontFamily: "monospace", lineHeight: 1.4 }}>
                        {block.prompt}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ padding: "8px 10px 14px", flex: 1 }}>
              {["ms", "hs"].map((bandKey) => {
                const band = BANDS[bandKey];
                const templates = ORGANIZER_TEMPLATES.filter((t) => t.band === bandKey);
                return (
                  <div key={bandKey} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: band.color, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 6, paddingLeft: 2 }}>
                      {band.label}
                    </div>
                    {templates.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => addOrganizer(tmpl.id)}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 10px",
                          marginBottom: 5,
                          borderRadius: 7,
                          border: `1.5px solid ${band.border}`,
                          background: "#FFFFFF",
                          cursor: "pointer",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = band.bg; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#FFFFFF"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontSize: 15 }}>{tmpl.icon}</span>
                          <span style={{ fontSize: 12, fontWeight: "bold", color: "#1C1917", fontFamily: "Georgia, serif" }}>{tmpl.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Main Canvas */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {topic && (
            <div style={{
              fontSize: 12,
              color: "#78716C",
              fontFamily: "monospace",
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px dashed #D6D3D1",
              letterSpacing: 1,
            }}>
              TOPIC: {topic.toUpperCase()}
            </div>
          )}
          {notes.length === 0 ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              color: "#A8A29E",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>📓</div>
              <div style={{ fontSize: 15, fontFamily: "Georgia, serif", marginBottom: 6 }}>Your notebook is empty</div>
              <div style={{ fontSize: 12, fontFamily: "monospace", maxWidth: 260, lineHeight: 1.6 }}>
                Choose blocks or graphic organizers from the palette on the left to start building your notes.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 720 }}>
              {notes.map((note, idx) => (
                <div
                  key={note.uid}
                  style={{
                    background: "#FFFFFF",
                    border: `1.5px solid ${note.border}`,
                    borderLeft: `5px solid ${note.color}`,
                    borderRadius: 9,
                    padding: "14px 16px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      {note.type === "organizer" && <span style={{ fontSize: 15 }}>{note.icon}</span>}
                      <span style={{ fontSize: 13, fontWeight: "bold", color: "#1C1917", fontFamily: "Georgia, serif" }}>{note.label}</span>
                      <span style={{
                        fontSize: 9,
                        background: note.tagBg,
                        color: note.color,
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontFamily: "monospace",
                        fontWeight: "bold",
                      }}>{note.type === "organizer" ? note.bandLabel : note.levelLabel}</span>
                    </div>
                    <div style={{ display: "flex", gap: 2 }}>
                      <button onClick={() => moveNote(note.uid, -1)} disabled={idx === 0} style={{ background: "none", border: "none", cursor: idx === 0 ? "default" : "pointer", opacity: idx === 0 ? 0.2 : 0.5, fontSize: 13, padding: "2px 4px" }}>↑</button>
                      <button onClick={() => moveNote(note.uid, 1)} disabled={idx === notes.length - 1} style={{ background: "none", border: "none", cursor: idx === notes.length - 1 ? "default" : "pointer", opacity: idx === notes.length - 1 ? 0.2 : 0.5, fontSize: 13, padding: "2px 4px" }}>↓</button>
                      <button onClick={() => removeNote(note.uid)} style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.35, fontSize: 13, padding: "2px 4px" }}>✕</button>
                    </div>
                  </div>
                  {note.type === "organizer" ? (
                    /* ── Graphic Organizer ── */
                    <OrganizerRenderer
                      type={note.organizerId}
                      data={note.organizerData}
                      onChange={(newData) => updateOrganizerData(note.uid, newData)}
                    />
                  ) : (
                    /* ── Standard Block Note ── */
                    <>
                      <div style={{ fontSize: 10, color: "#A8A29E", fontFamily: "monospace", marginBottom: 7 }}>
                        {note.prompt}
                      </div>
                      <textarea
                        value={note.text}
                        onChange={(e) => updateText(note.uid, e.target.value)}
                        placeholder="Write here..."
                        rows={3}
                        style={{
                          width: "100%",
                          border: "none",
                          background: note.bg,
                          borderRadius: 5,
                          padding: "9px 11px",
                          fontSize: 13,
                          fontFamily: "Georgia, serif",
                          color: "#1C1917",
                          resize: "vertical",
                          outline: "none",
                          lineHeight: 1.6,
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        onClick={() => toggleDrawing(note.uid)}
                        style={{
                          marginTop: 6,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 10,
                          fontFamily: "monospace",
                          padding: "4px 9px",
                          borderRadius: 5,
                          cursor: "pointer",
                          background: note.drawing ? note.tagBg : "transparent",
                          border: note.drawing ? `1.5px solid ${note.color}` : "1.5px solid #D6D3D1",
                          color: note.drawing ? note.color : "#A8A29E",
                          transition: "all 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 13 }}>✏️</span>
                        {note.drawing ? "hide sketch" : "add sketch"}
                      </button>
                      {note.drawing && (
                        <DoodlePad
                          noteUid={note.uid}
                          color={note.color}
                          bg={note.bg}
                          initialData={note.drawingData}
                          onDataChange={updateDrawingData}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Right Summary Panel */}
        <div style={{
          width: 180,
          background: "#FAFAF9",
          borderLeft: "1px solid #E7E5E4",
          padding: "14px 12px",
          flexShrink: 0,
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#78716C", letterSpacing: 2, textTransform: "uppercase", fontFamily: "monospace", marginBottom: 12 }}>
            My Notes Map
          </div>
          {LEVELS.map((level) => {
            const count = notes.filter((n) => n.levelId === level.id).length;
            return (
              <div key={level.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#57534E", fontFamily: "monospace" }}>{level.dok}</span>
                  <span style={{ fontSize: 10, color: level.color, fontWeight: "bold", fontFamily: "monospace" }}>{count}</span>
                </div>
                <div style={{ height: 5, background: "#E7E5E4", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: notes.length > 0 ? `${(count / notes.length) * 100}%` : "0%",
                    background: level.color,
                    borderRadius: 3,
                    transition: "width 0.3s",
                  }} />
                </div>
              </div>
            );
          })}
          <div style={{
            marginTop: 16,
            padding: "9px",
            background: "#F5F5F4",
            borderRadius: 7,
            fontSize: 10,
            fontFamily: "monospace",
            color: "#78716C",
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: "bold", color: "#1C1917", marginBottom: 5 }}>Total: {notes.length} blocks</div>
            {(() => {
              const orgCount = notes.filter(n => n.type === "organizer").length;
              return orgCount > 0 && (
                <div style={{ color: "#0D9488", marginBottom: 4 }}>📐 {orgCount} organizer{orgCount > 1 ? "s" : ""}</div>
              );
            })()}
            {notes.length > 0 && notes.filter(n => n.levelId === "evaluate" || n.levelId === "analyze").length === 0 && notes.some(n => n.type !== "organizer") && (
              <div style={{ color: "#D97706" }}>💡 Try an analysis or evaluation block!</div>
            )}
            {notes.filter(n => n.levelId === "evaluate" || n.levelId === "analyze").length > 0 && (
              <div style={{ color: "#10B981" }}>✓ Strong higher-order thinking!</div>
            )}
            {notes.length >= 5 && (
              <div style={{ color: "#3B82F6", marginTop: 4 }}>📚 Solid note set!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
