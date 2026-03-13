import { useState } from "react";
import NoteCatcher from "./NoteCatcher";
import { TABS } from "./lessons";

function App() {
  const [activeTab, setActiveTab] = useState("builder");
  const tab = TABS.find((t) => t.key === activeTab);

  return (
    <div style={{ fontFamily: "'Lexend', sans-serif", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Tab bar */}
      <div style={{
        display: "flex",
        background: "#FFFFFF",
        borderBottom: "1px solid #DCE2E1",
        flexShrink: 0,
      }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              flex: 1,
              padding: "10px 8px",
              fontSize: 11,
              fontFamily: "'Lexend', sans-serif",
              fontWeight: activeTab === t.key ? 700 : 400,
              letterSpacing: 0.5,
              border: "none",
              borderBottom: activeTab === t.key ? "3px solid #FF6252" : "3px solid transparent",
              background: activeTab === t.key ? "#FFF5F4" : "#FFFFFF",
              color: activeTab === t.key ? "#FF6252" : "#7A8B8B",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Active tab content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <NoteCatcher
          key={activeTab}
          lesson={tab?.lesson || null}
          gradeBand={tab?.lesson?.gradeBand || "ms"}
        />
      </div>
    </div>
  );
}

export default App;
