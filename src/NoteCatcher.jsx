import { useState, useRef, useEffect, useCallback } from "react";
import OrganizerRenderer, { ORGANIZER_TEMPLATES, BANDS, getDefaultData } from "./GraphicOrganizers";
const LEVELS = [
  {
    id: "remember",
    label: "Remember & Notice",
    dok: "DOK 1",
    color: "#13B5EA",
    bg: "#E8F7FD",
    border: "#84DBEF",
    tagBg: "#D0EFFA",
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
    color: "#09B472",
    bg: "#E6F9F0",
    border: "#A3E8B8",
    tagBg: "#D1F4DE",
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
    color: "#A18630",
    bg: "#FFF9E6",
    border: "#FBD206",
    tagBg: "#FFF5BB",
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
    color: "#827AB9",
    bg: "#F0EEF8",
    border: "#C2BDF2",
    tagBg: "#DDD8F5",
    blocks: [
      { id: "claim", label: "My claim is...", prompt: "What argument or position do you want to defend?" },
      { id: "agree", label: "I agree / disagree because...", prompt: "Take a stance and explain your reasoning." },
      { id: "question", label: "A question this raises...", prompt: "What are you still wondering?" },
      { id: "significance", label: "The significance is...", prompt: "Why does this matter beyond the text?" },
    ],
  },
];
const DRAW_COLORS = ["#3F4C4C", "#13B5EA", "#FF6252", "#09B472", "#FBD206", "#827AB9"];

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
              width: 18, height: 18, borderRadius: "50%", background: c, border: penColor === c && !erasing ? "2.5px solid #3F4C4C" : "2px solid #DCE2E1",
              cursor: "pointer", padding: 0, boxShadow: penColor === c && !erasing ? "0 0 0 2px #FBD206" : "none",
            }}
          />
        ))}
        <div style={{ width: 1, height: 16, background: "#DCE2E1", margin: "0 2px" }} />
        {[2, 4, 7].map((s) => (
          <button
            key={s}
            onClick={() => setPenSize(s)}
            style={{
              width: 22, height: 22, borderRadius: 4, background: penSize === s ? "#EEF1F0" : "transparent",
              border: penSize === s ? "1.5px solid #7A8B8B" : "1.5px solid transparent", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
            }}
          >
            <div style={{ width: s + 2, height: s + 2, borderRadius: "50%", background: "#3F4C4C" }} />
          </button>
        ))}
        <div style={{ width: 1, height: 16, background: "#DCE2E1", margin: "0 2px" }} />
        <button
          onClick={() => setErasing((v) => !v)}
          style={{
            fontSize: 10, fontFamily: "'Lexend', sans-serif", padding: "3px 7px", borderRadius: 4, cursor: "pointer",
            background: erasing ? "#FEE2E2" : "transparent", border: erasing ? "1.5px solid #FCA5A5" : "1.5px solid #DCE2E1",
            color: erasing ? "#DC2626" : "#7A8B8B",
          }}
        >
          eraser
        </button>
        <button
          onClick={clearCanvas}
          style={{
            fontSize: 10, fontFamily: "'Lexend', sans-serif", padding: "3px 7px", borderRadius: 4, cursor: "pointer",
            background: "transparent", border: "1.5px solid #DCE2E1", color: "#7A8B8B",
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
          width: "100%", height: 160, borderRadius: 5, border: "1.5px dashed #DCE2E1",
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
      fontFamily: "'Lexend', sans-serif",
      height: "100vh",
      background: "#F4F7F6",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        background: "#FFFFFF",
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: "3px solid #FF6252",
        flexShrink: 0,
      }}>
        <div>
          <div style={{ color: "#FF6252", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", fontFamily: "'Lexend', sans-serif", fontWeight: 600, marginBottom: 3 }}>
            Digital Note Builder
          </div>
          <div style={{ color: "#3F4C4C", fontSize: 18, fontWeight: "bold" }}>
            My Learning Notes
          </div>
        </div>
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="🔍 Topic or reading title..."
          style={{
            marginLeft: "auto",
            background: "#EEF1F0",
            border: "1px solid #DCE2E1",
            borderRadius: 6,
            padding: "7px 12px",
            color: "#3F4C4C",
            fontSize: 13,
            fontFamily: "'Lexend', sans-serif",
            width: 260,
            outline: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{
          width: 240,
          background: "#F4F7F6",
          borderRight: "1px solid #DCE2E1",
          overflowY: "auto",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Sidebar mode toggle */}
          <div style={{ display: "flex", margin: "10px 10px 6px", borderRadius: 7, overflow: "hidden", border: "1px solid #DCE2E1" }}>
            {[{ key: "blocks", label: "Blocks" }, { key: "organizers", label: "Organizers" }].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSidebarMode(key)}
                style={{
                  flex: 1, padding: "6px 0", fontSize: 10, fontFamily: "'Lexend', sans-serif", fontWeight: "bold",
                  letterSpacing: 1, textTransform: "uppercase", border: "none", cursor: "pointer",
                  background: sidebarMode === key ? "#FF6252" : "#F4F7F6",
                  color: sidebarMode === key ? "#FFFFFF" : "#7A8B8B",
                }}
              >{label}</button>
            ))}
          </div>

          {sidebarMode === "blocks" ? (
            <>
              <div style={{ padding: "8px 14px 6px", color: "#7A8B8B", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Lexend', sans-serif" }}>
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
                      <span style={{ fontSize: 12, color: "#3F4C4C", fontFamily: "'Lexend', sans-serif" }}>{level.label}</span>
                      <span style={{
                        fontSize: 9,
                        color: level.color,
                        background: level.tagBg,
                        padding: "2px 5px",
                        borderRadius: 3,
                        fontFamily: "'Lexend', sans-serif",
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
                    fontFamily: "'Lexend', sans-serif",
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
                      <div style={{ fontSize: 12, fontWeight: "bold", color: "#3F4C4C", marginBottom: 2, fontFamily: "'Lexend', sans-serif" }}>
                        {block.label}
                      </div>
                      <div style={{ fontSize: 10, color: "#7A8B8B", fontFamily: "'Lexend', sans-serif", lineHeight: 1.4 }}>
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
                    <div style={{ fontSize: 10, color: band.color, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'Lexend', sans-serif", marginBottom: 6, paddingLeft: 2 }}>
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
                          <span style={{ fontSize: 12, fontWeight: "bold", color: "#3F4C4C", fontFamily: "'Lexend', sans-serif" }}>{tmpl.label}</span>
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
              color: "#7A8B8B",
              fontFamily: "'Lexend', sans-serif",
              marginBottom: 18,
              paddingBottom: 10,
              borderBottom: "1px dashed #DCE2E1",
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
              color: "#7A8B8B",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>📓</div>
              <div style={{ fontSize: 15, fontFamily: "'Lexend', sans-serif", marginBottom: 6 }}>Your notebook is empty</div>
              <div style={{ fontSize: 12, fontFamily: "'Lexend', sans-serif", maxWidth: 260, lineHeight: 1.6 }}>
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
                      <span style={{ fontSize: 13, fontWeight: "bold", color: "#3F4C4C", fontFamily: "'Lexend', sans-serif" }}>{note.label}</span>
                      <span style={{
                        fontSize: 9,
                        background: note.tagBg,
                        color: note.color,
                        padding: "2px 6px",
                        borderRadius: 3,
                        fontFamily: "'Lexend', sans-serif",
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
                      <div style={{ fontSize: 10, color: "#7A8B8B", fontFamily: "'Lexend', sans-serif", marginBottom: 7 }}>
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
                          fontFamily: "'Lexend', sans-serif",
                          color: "#3F4C4C",
                          resize: "vertical",
                          outline: "none",
                          lineHeight: 1.6,
                          boxSizing: "border-box",
                          overflowWrap: "break-word",
                          wordBreak: "break-word",
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
                          fontFamily: "'Lexend', sans-serif",
                          padding: "4px 9px",
                          borderRadius: 5,
                          cursor: "pointer",
                          background: note.drawing ? note.tagBg : "transparent",
                          border: note.drawing ? `1.5px solid ${note.color}` : "1.5px solid #DCE2E1",
                          color: note.drawing ? note.color : "#7A8B8B",
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
          background: "#F4F7F6",
          borderLeft: "1px solid #DCE2E1",
          padding: "14px 12px",
          flexShrink: 0,
          overflowY: "auto",
        }}>
          <div style={{ fontSize: 10, color: "#7A8B8B", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Lexend', sans-serif", marginBottom: 12 }}>
            My Notes Map
          </div>
          {LEVELS.map((level) => {
            const count = notes.filter((n) => n.levelId === level.id).length;
            return (
              <div key={level.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 10, color: "#3F4C4C", fontFamily: "'Lexend', sans-serif" }}>{level.dok}</span>
                  <span style={{ fontSize: 10, color: level.color, fontWeight: "bold", fontFamily: "'Lexend', sans-serif" }}>{count}</span>
                </div>
                <div style={{ height: 5, background: "#DCE2E1", borderRadius: 3, overflow: "hidden" }}>
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
            background: "#EEF1F0",
            borderRadius: 7,
            fontSize: 10,
            fontFamily: "'Lexend', sans-serif",
            color: "#7A8B8B",
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: "bold", color: "#3F4C4C", marginBottom: 5 }}>Total: {notes.length} blocks</div>
            {(() => {
              const orgCount = notes.filter(n => n.type === "organizer").length;
              return orgCount > 0 && (
                <div style={{ color: "#09B472", marginBottom: 4 }}>📐 {orgCount} organizer{orgCount > 1 ? "s" : ""}</div>
              );
            })()}
            {notes.length > 0 && notes.filter(n => n.levelId === "evaluate" || n.levelId === "analyze").length === 0 && notes.some(n => n.type !== "organizer") && (
              <div style={{ color: "#A18630" }}>💡 Try an analysis or evaluation block!</div>
            )}
            {notes.filter(n => n.levelId === "evaluate" || n.levelId === "analyze").length > 0 && (
              <div style={{ color: "#09B472" }}>✓ Strong higher-order thinking!</div>
            )}
            {notes.length >= 5 && (
              <div style={{ color: "#13B5EA", marginTop: 4 }}>📚 Solid note set!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
