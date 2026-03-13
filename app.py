import streamlit as st
from streamlit_drawable_canvas import st_canvas

# ─── Page config ───
st.set_page_config(page_title="Digital Note Builder", page_icon="📓", layout="wide",
                   initial_sidebar_state="expanded")

# ─── Custom CSS (Kiddom brand) ───
st.markdown("""
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
    /* Global font */
    html, body, [class*="css"], .stTextInput input, .stTextArea textarea,
    .stRadio label, .stButton button, .stCheckbox label, .stCaption {
        font-family: 'Lexend', sans-serif !important;
    }
    /* Header bar */
    .header-bar {
        background: #FFFFFF;
        padding: 16px 0 14px;
        border-bottom: 3px solid #FF6252;
        margin-bottom: 12px;
    }
    .header-bar .subtitle {
        color: #FF6252;
        font-size: 11px;
        letter-spacing: 3px;
        text-transform: uppercase;
        font-weight: 600;
        margin-bottom: 2px;
    }
    .header-bar .title {
        color: #3F4C4C;
        font-size: 22px;
        font-weight: 700;
    }
    /* Topic search bar */
    .topic-bar input {
        background: #EEF1F0 !important;
        border: 1.5px solid #DCE2E1 !important;
        border-radius: 8px !important;
        padding: 10px 14px !important;
        font-size: 14px !important;
        color: #3F4C4C !important;
    }
    .topic-bar input:focus {
        border-color: #13B5EA !important;
        box-shadow: 0 0 0 2px rgba(19,181,234,0.15) !important;
        background: #FFFFFF !important;
    }
    .topic-bar input::placeholder {
        color: #A3AAA8 !important;
    }
    /* Note cards */
    .note-card {
        background: #FFFFFF;
        border-radius: 10px;
        padding: 14px 16px;
        margin-bottom: 12px;
        box-shadow: 0 2px 8px rgba(63,76,76,0.08);
    }
    .note-label {
        font-size: 14px;
        font-weight: 600;
        color: #242D2C;
    }
    .note-tag {
        font-size: 10px;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 600;
    }
    .prompt-text {
        font-size: 12px;
        color: #A3AAA8;
        font-weight: 400;
        margin-bottom: 6px;
    }
    .section-label {
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 4px;
        margin-top: 10px;
    }
    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #A3AAA8;
    }
    .empty-state .icon { font-size: 36px; margin-bottom: 14px; }
    .empty-state .msg { font-size: 16px; font-weight: 600; color: #3F4C4C; margin-bottom: 6px; }
    .empty-state .hint { font-size: 13px; color: #A3AAA8; line-height: 1.7; }
    .summary-box {
        background: #EEF1F0;
        border-radius: 8px;
        padding: 10px;
        font-size: 12px;
        color: #3F4C4C;
        line-height: 1.6;
    }
    /* Sidebar */
    [data-testid="stSidebar"] {
        background: #EEF1F0;
    }
    /* Buttons - Kiddom coral on hover */
    .stButton button {
        border-radius: 6px;
        border: 1.5px solid #DCE2E1;
        color: #3F4C4C;
        font-weight: 500;
        transition: all 0.15s;
    }
    .stButton button:hover {
        border-color: #FF6252;
        color: #FF6252;
        background: #FFF;
    }
    /* Text inputs */
    .stTextInput input, .stTextArea textarea {
        border-radius: 6px;
        border: 1.5px solid #DCE2E1;
        color: #242D2C;
    }
    .stTextInput input:focus, .stTextArea textarea:focus {
        border-color: #13B5EA;
        box-shadow: 0 0 0 2px rgba(19,181,234,0.15);
    }
    /* Radio pills */
    .stRadio > div { gap: 4px; }
    /* Tabs - Kiddom brand */
    .stTabs [data-baseweb="tab-list"] {
        gap: 2px;
        background: #EEF1F0;
        border-radius: 8px;
        padding: 4px;
    }
    .stTabs [data-baseweb="tab"] {
        font-family: 'Lexend', sans-serif !important;
        font-size: 13px;
        font-weight: 500;
        color: #3F4C4C;
        border-radius: 6px;
        padding: 8px 16px;
    }
    .stTabs [aria-selected="true"] {
        background: #FFFFFF !important;
        color: #FF6252 !important;
        font-weight: 600;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }
    .stTabs [data-baseweb="tab-highlight"] {
        background-color: #FF6252 !important;
    }
    /* Hide default streamlit chrome */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .block-container { padding-top: 1rem; }
</style>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
# DATA DEFINITIONS
# ──────────────────────────────────────────────

LEVELS = [
    {
        "id": "remember", "label": "Remember & Notice", "dok": "DOK 1",
        "color": "#13B5EA", "bg": "#E8F7FD", "border": "#84DBEF", "tagBg": "#D0EFFA",
        "blocks": [
            {"id": "notice", "label": "I noticed...", "prompt": "What did you observe or see?"},
            {"id": "term", "label": "Key term:", "prompt": "Define the key vocabulary."},
            {"id": "fact", "label": "Facts / Details:", "prompt": "What are the important facts?"},
            {"id": "main", "label": "The main idea is...", "prompt": "What is this mostly about?"},
        ],
    },
    {
        "id": "understand", "label": "Understand & Explain", "dok": "DOK 2",
        "color": "#09B472", "bg": "#E6F9F0", "border": "#A3E8B8", "tagBg": "#D1F4DE",
        "blocks": [
            {"id": "means", "label": "This means...", "prompt": "What does this idea mean?"},
            {"id": "words", "label": "In my own words...", "prompt": "Explain it without the text."},
            {"id": "example", "label": "An example would be...", "prompt": "Give a concrete example."},
            {"id": "works", "label": "This works by...", "prompt": "Explain the process or mechanism."},
        ],
    },
    {
        "id": "analyze", "label": "Apply & Analyze", "dok": "DOK 3",
        "color": "#A18630", "bg": "#FFF9E6", "border": "#FBD206", "tagBg": "#FFF5BB",
        "blocks": [
            {"id": "connects", "label": "This connects to...", "prompt": "What prior knowledge or text does this link to?"},
            {"id": "pattern", "label": "The pattern I see is...", "prompt": "What repeats or structures the idea?"},
            {"id": "evidence", "label": "Evidence:", "prompt": "What specific evidence supports this?"},
            {"id": "use", "label": "I can apply this when...", "prompt": "Where does this idea show up in the world?"},
        ],
    },
    {
        "id": "evaluate", "label": "Evaluate & Synthesize", "dok": "DOK 4",
        "color": "#827AB9", "bg": "#F0EEF8", "border": "#C2BDF2", "tagBg": "#DDD8F5",
        "blocks": [
            {"id": "claim", "label": "My claim is...", "prompt": "What argument or position do you want to defend?"},
            {"id": "agree", "label": "I agree / disagree because...", "prompt": "Take a stance and explain your reasoning."},
            {"id": "question", "label": "A question this raises...", "prompt": "What are you still wondering?"},
            {"id": "significance", "label": "The significance is...", "prompt": "Why does this matter beyond the text?"},
        ],
    },
]

BANDS = {
    "ms": {"color": "#09B472", "bg": "#E6F9F0", "border": "#A3E8B8", "tagBg": "#D1F4DE", "label": "Grades 6-8"},
    "hs": {"color": "#827AB9", "bg": "#F0EEF8", "border": "#C2BDF2", "tagBg": "#DDD8F5", "label": "Grades 9-12"},
}

ORGANIZER_TEMPLATES = [
    {"id": "tchart",     "label": "T-Chart",              "band": "ms", "icon": "⊤"},
    {"id": "mindmap",    "label": "Mind Map",             "band": "ms", "icon": "🕸"},
    {"id": "venn",       "label": "Venn Diagram",         "band": "ms", "icon": "◎"},
    {"id": "frayer",     "label": "Frayer Model",         "band": "ms", "icon": "◫"},
    {"id": "kwl",        "label": "KWL Chart",            "band": "ms", "icon": "K"},
    {"id": "cornell",    "label": "Cornell Notes",        "band": "hs", "icon": "📋"},
    {"id": "argument",   "label": "Argument Map",         "band": "hs", "icon": "⚖"},
    {"id": "matrix",     "label": "Source Comparison",    "band": "hs", "icon": "▦"},
    {"id": "annotation", "label": "Annotation Margin",    "band": "hs", "icon": "✎"},
    {"id": "timeline",   "label": "Timeline / Sequence",  "band": "hs", "icon": "⟶"},
]


def get_default_data(org_type):
    defaults = {
        "tchart":     {"leftHeader": "", "rightHeader": "", "rows": [{"left": "", "right": ""}]},
        "mindmap":    {"center": "", "branches": ["", "", ""]},
        "venn":       {"leftLabel": "", "rightLabel": "", "leftOnly": "", "overlap": "", "rightOnly": ""},
        "frayer":     {"term": "", "definition": "", "characteristics": "", "examples": "", "nonExamples": ""},
        "kwl":        {"know": [""], "want": [""], "learned": [""]},
        "cornell":    {"cues": [""], "notes": "", "summary": ""},
        "argument":   {"claim": "", "evidence": [{"point": "", "reasoning": ""}], "counterargument": ""},
        "matrix":     {"criteria": ["", ""], "sources": [{"name": "", "values": ["", ""]}]},
        "annotation": {"text": "", "annotations": [""]},
        "timeline":   {"events": [{"date": "", "title": "", "description": ""}]},
    }
    return defaults.get(org_type, {})


# ──────────────────────────────────────────────
# SESSION STATE
# ──────────────────────────────────────────────

if "notes" not in st.session_state:
    st.session_state.notes = []
if "note_counter" not in st.session_state:
    st.session_state.note_counter = 0


def next_uid():
    st.session_state.note_counter += 1
    return st.session_state.note_counter


def add_block(block, level, notes_key="notes"):
    st.session_state[notes_key].append({
        "type": "block",
        "uid": next_uid(),
        "label": block["label"],
        "prompt": block["prompt"],
        "levelId": level["id"],
        "levelLabel": level["label"],
        "color": level["color"],
        "bg": level["bg"],
        "border": level["border"],
        "tagBg": level["tagBg"],
        "text": "",
        "drawing": False,
    })


def add_organizer(template_id, notes_key="notes"):
    tmpl = next((t for t in ORGANIZER_TEMPLATES if t["id"] == template_id), None)
    if not tmpl:
        return
    band = BANDS[tmpl["band"]]
    st.session_state[notes_key].append({
        "type": "organizer",
        "organizerId": template_id,
        "uid": next_uid(),
        "label": tmpl["label"],
        "icon": tmpl["icon"],
        "color": band["color"],
        "bg": band["bg"],
        "border": band["border"],
        "tagBg": band["tagBg"],
        "bandLabel": band["label"],
        "organizerData": get_default_data(template_id),
    })


def remove_note(uid, notes_key="notes"):
    st.session_state[notes_key] = [n for n in st.session_state[notes_key] if n["uid"] != uid]


def move_note(uid, direction, notes_key="notes"):
    notes = st.session_state[notes_key]
    idx = next((i for i, n in enumerate(notes) if n["uid"] == uid), None)
    if idx is None:
        return
    swap = idx + direction
    if swap < 0 or swap >= len(notes):
        return
    notes[idx], notes[swap] = notes[swap], notes[idx]


# ──────────────────────────────────────────────
# ORGANIZER RENDERERS
# ──────────────────────────────────────────────


def render_tchart(note, idx):
    d = note["organizerData"]
    c1, c2 = st.columns(2)
    with c1:
        d["leftHeader"] = st.text_input("Left header", d["leftHeader"],
                                         key=f"tc_lh_{note['uid']}", placeholder="Left header...")
    with c2:
        d["rightHeader"] = st.text_input("Right header", d["rightHeader"],
                                          key=f"tc_rh_{note['uid']}", placeholder="Right header...")
    for i, row in enumerate(d["rows"]):
        c1, c2, c3 = st.columns([5, 5, 1])
        with c1:
            d["rows"][i]["left"] = st.text_area("Left", row["left"],
                                                 key=f"tc_l_{note['uid']}_{i}", height=60,
                                                 label_visibility="collapsed", placeholder="...")
        with c2:
            d["rows"][i]["right"] = st.text_area("Right", row["right"],
                                                  key=f"tc_r_{note['uid']}_{i}", height=60,
                                                  label_visibility="collapsed", placeholder="...")
        with c3:
            if len(d["rows"]) > 1 and st.button("✕", key=f"tc_rm_{note['uid']}_{i}"):
                d["rows"].pop(i)
                st.rerun()
    if st.button("+ row", key=f"tc_add_{note['uid']}"):
        d["rows"].append({"left": "", "right": ""})
        st.rerun()


def render_mindmap(note, idx):
    d = note["organizerData"]
    d["center"] = st.text_input("Central idea", d["center"],
                                 key=f"mm_c_{note['uid']}", placeholder="Central idea...")
    cols = st.columns(min(len(d["branches"]), 4))
    for i, b in enumerate(d["branches"]):
        with cols[i % len(cols)]:
            d["branches"][i] = st.text_input(f"Branch {i+1}", b,
                                              key=f"mm_b_{note['uid']}_{i}", placeholder=f"Branch {i+1}")
            if len(d["branches"]) > 1 and st.button("✕", key=f"mm_rm_{note['uid']}_{i}"):
                d["branches"].pop(i)
                st.rerun()
    if st.button("+ branch", key=f"mm_add_{note['uid']}"):
        d["branches"].append("")
        st.rerun()


def render_venn(note, idx):
    d = note["organizerData"]
    c1, c2 = st.columns(2)
    with c1:
        d["leftLabel"] = st.text_input("Left group", d["leftLabel"],
                                        key=f"vn_ll_{note['uid']}", placeholder="Left group label...")
    with c2:
        d["rightLabel"] = st.text_input("Right group", d["rightLabel"],
                                         key=f"vn_rl_{note['uid']}", placeholder="Right group label...")
    c1, c2, c3 = st.columns(3)
    with c1:
        st.caption("Only Left")
        d["leftOnly"] = st.text_area("Left only", d["leftOnly"],
                                      key=f"vn_lo_{note['uid']}", height=100,
                                      label_visibility="collapsed", placeholder="Unique to left...")
    with c2:
        st.caption("Both / Overlap")
        d["overlap"] = st.text_area("Overlap", d["overlap"],
                                     key=f"vn_ov_{note['uid']}", height=100,
                                     label_visibility="collapsed", placeholder="Shared...")
    with c3:
        st.caption("Only Right")
        d["rightOnly"] = st.text_area("Right only", d["rightOnly"],
                                       key=f"vn_ro_{note['uid']}", height=100,
                                       label_visibility="collapsed", placeholder="Unique to right...")


def render_frayer(note, idx):
    d = note["organizerData"]
    d["term"] = st.text_input("Term or Concept", d["term"],
                               key=f"fr_t_{note['uid']}", placeholder="TERM or CONCEPT")
    c1, c2 = st.columns(2)
    with c1:
        st.caption("Definition")
        d["definition"] = st.text_area("Definition", d["definition"],
                                        key=f"fr_d_{note['uid']}", height=80,
                                        label_visibility="collapsed", placeholder="Definition...")
        st.caption("Examples")
        d["examples"] = st.text_area("Examples", d["examples"],
                                      key=f"fr_e_{note['uid']}", height=80,
                                      label_visibility="collapsed", placeholder="Examples...")
    with c2:
        st.caption("Characteristics")
        d["characteristics"] = st.text_area("Characteristics", d["characteristics"],
                                             key=f"fr_c_{note['uid']}", height=80,
                                             label_visibility="collapsed", placeholder="Characteristics...")
        st.caption("Non-Examples")
        d["nonExamples"] = st.text_area("Non-Examples", d["nonExamples"],
                                         key=f"fr_ne_{note['uid']}", height=80,
                                         label_visibility="collapsed", placeholder="Non-Examples...")


def render_kwl(note, idx):
    d = note["organizerData"]
    cols_map = [("know", "K - What I Know"), ("want", "W - Want to Know"), ("learned", "L - What I Learned")]
    columns = st.columns(3)
    for col_idx, (key, label) in enumerate(cols_map):
        with columns[col_idx]:
            st.caption(label)
            for i, item in enumerate(d[key]):
                c1, c2 = st.columns([8, 1])
                with c1:
                    d[key][i] = st.text_input(f"{key}_{i}", item,
                                               key=f"kwl_{key}_{note['uid']}_{i}",
                                               label_visibility="collapsed", placeholder="...")
                with c2:
                    if len(d[key]) > 1 and st.button("✕", key=f"kwl_rm_{key}_{note['uid']}_{i}"):
                        d[key].pop(i)
                        st.rerun()
            if st.button(f"+ item", key=f"kwl_add_{key}_{note['uid']}"):
                d[key].append("")
                st.rerun()


def render_cornell(note, idx):
    d = note["organizerData"]
    c1, c2 = st.columns([1, 3])
    with c1:
        st.caption("Cues / Questions")
        for i, cue in enumerate(d["cues"]):
            rc1, rc2 = st.columns([6, 1])
            with rc1:
                d["cues"][i] = st.text_input(f"cue_{i}", cue,
                                              key=f"cn_cue_{note['uid']}_{i}",
                                              label_visibility="collapsed", placeholder="Cue...")
            with rc2:
                if len(d["cues"]) > 1 and st.button("✕", key=f"cn_rm_{note['uid']}_{i}"):
                    d["cues"].pop(i)
                    st.rerun()
        if st.button("+ cue", key=f"cn_add_{note['uid']}"):
            d["cues"].append("")
            st.rerun()
    with c2:
        st.caption("Notes")
        d["notes"] = st.text_area("Notes", d["notes"],
                                   key=f"cn_notes_{note['uid']}", height=200,
                                   label_visibility="collapsed", placeholder="Main notes...")
    st.caption("Summary")
    d["summary"] = st.text_area("Summary", d["summary"],
                                 key=f"cn_sum_{note['uid']}", height=80,
                                 label_visibility="collapsed", placeholder="Summarize in your own words...")


def render_argument(note, idx):
    d = note["organizerData"]
    st.caption("Claim")
    d["claim"] = st.text_input("Claim", d["claim"],
                                key=f"arg_cl_{note['uid']}",
                                label_visibility="collapsed", placeholder="My claim is...")
    st.caption("Evidence & Reasoning")
    for i, ev in enumerate(d["evidence"]):
        c1, c2, c3 = st.columns([5, 5, 1])
        with c1:
            d["evidence"][i]["point"] = st.text_input(f"Evidence {i+1}", ev["point"],
                                                       key=f"arg_ep_{note['uid']}_{i}",
                                                       label_visibility="collapsed", placeholder="Evidence...")
        with c2:
            d["evidence"][i]["reasoning"] = st.text_input(f"Reasoning {i+1}", ev["reasoning"],
                                                           key=f"arg_er_{note['uid']}_{i}",
                                                           label_visibility="collapsed", placeholder="Reasoning...")
        with c3:
            if len(d["evidence"]) > 1 and st.button("✕", key=f"arg_rm_{note['uid']}_{i}"):
                d["evidence"].pop(i)
                st.rerun()
    if st.button("+ evidence", key=f"arg_add_{note['uid']}"):
        d["evidence"].append({"point": "", "reasoning": ""})
        st.rerun()
    st.caption("Counterargument")
    d["counterargument"] = st.text_area("Counterargument", d["counterargument"],
                                         key=f"arg_ca_{note['uid']}", height=60,
                                         label_visibility="collapsed",
                                         placeholder="What might someone argue against this?")


def render_matrix(note, idx):
    d = note["organizerData"]
    # Criteria headers
    hc = st.columns([2] + [3] * len(d["criteria"]) + [1])
    with hc[0]:
        st.caption("Source")
    for ci, crit in enumerate(d["criteria"]):
        with hc[ci + 1]:
            d["criteria"][ci] = st.text_input(f"Criterion {ci+1}", crit,
                                               key=f"mx_cr_{note['uid']}_{ci}",
                                               label_visibility="collapsed",
                                               placeholder=f"Criterion {ci+1}")
    with hc[-1]:
        if st.button("+col", key=f"mx_addcol_{note['uid']}"):
            d["criteria"].append("")
            for s in d["sources"]:
                s["values"].append("")
            st.rerun()

    # Source rows
    for si, src in enumerate(d["sources"]):
        rc = st.columns([2] + [3] * len(d["criteria"]) + [1])
        with rc[0]:
            d["sources"][si]["name"] = st.text_input(f"Source {si+1}", src["name"],
                                                      key=f"mx_sn_{note['uid']}_{si}",
                                                      label_visibility="collapsed",
                                                      placeholder=f"Source {si+1}")
        for vi, val in enumerate(src["values"]):
            with rc[vi + 1]:
                d["sources"][si]["values"][vi] = st.text_area(
                    f"val_{si}_{vi}", val,
                    key=f"mx_sv_{note['uid']}_{si}_{vi}", height=60,
                    label_visibility="collapsed", placeholder="...")
        with rc[-1]:
            if len(d["sources"]) > 1 and st.button("✕", key=f"mx_rm_{note['uid']}_{si}"):
                d["sources"].pop(si)
                st.rerun()
    if st.button("+ source row", key=f"mx_addrow_{note['uid']}"):
        d["sources"].append({"name": "", "values": [""] * len(d["criteria"])})
        st.rerun()


def render_annotation(note, idx):
    d = note["organizerData"]
    c1, c2 = st.columns([3, 1])
    with c1:
        st.caption("Source Text / Passage")
        d["text"] = st.text_area("Source text", d["text"],
                                  key=f"an_txt_{note['uid']}", height=250,
                                  label_visibility="collapsed",
                                  placeholder="Paste or type the passage here...")
    with c2:
        st.caption("Margin Notes")
        for i, a in enumerate(d["annotations"]):
            ac1, ac2 = st.columns([6, 1])
            with ac1:
                d["annotations"][i] = st.text_area(f"note_{i}", a,
                                                    key=f"an_a_{note['uid']}_{i}",
                                                    height=60, label_visibility="collapsed",
                                                    placeholder="Note...")
            with ac2:
                if len(d["annotations"]) > 1 and st.button("✕", key=f"an_rm_{note['uid']}_{i}"):
                    d["annotations"].pop(i)
                    st.rerun()
        if st.button("+ note", key=f"an_add_{note['uid']}"):
            d["annotations"].append("")
            st.rerun()


def render_timeline(note, idx):
    d = note["organizerData"]
    for i, ev in enumerate(d["events"]):
        c1, c2, c3, c4 = st.columns([2, 4, 6, 1])
        with c1:
            d["events"][i]["date"] = st.text_input(f"Date {i+1}", ev["date"],
                                                    key=f"tl_d_{note['uid']}_{i}",
                                                    label_visibility="collapsed", placeholder="Date...")
        with c2:
            d["events"][i]["title"] = st.text_input(f"Title {i+1}", ev["title"],
                                                     key=f"tl_t_{note['uid']}_{i}",
                                                     label_visibility="collapsed", placeholder="Event title...")
        with c3:
            d["events"][i]["description"] = st.text_input(f"Desc {i+1}", ev["description"],
                                                           key=f"tl_desc_{note['uid']}_{i}",
                                                           label_visibility="collapsed", placeholder="Description...")
        with c4:
            if len(d["events"]) > 1 and st.button("✕", key=f"tl_rm_{note['uid']}_{i}"):
                d["events"].pop(i)
                st.rerun()
    if st.button("+ event", key=f"tl_add_{note['uid']}"):
        d["events"].append({"date": "", "title": "", "description": ""})
        st.rerun()


ORGANIZER_RENDERERS = {
    "tchart": render_tchart,
    "mindmap": render_mindmap,
    "venn": render_venn,
    "frayer": render_frayer,
    "kwl": render_kwl,
    "cornell": render_cornell,
    "argument": render_argument,
    "matrix": render_matrix,
    "annotation": render_annotation,
    "timeline": render_timeline,
}


# ──────────────────────────────────────────────
# CURRICULUM LESSON DATA
# ──────────────────────────────────────────────

EL_G3_LESSON = {
    "title": "Discover Our Topic: The Power of Reading",
    "subtitle": "EL Education \u00b7 Grade 3 \u00b7 Module 1, Unit 1, Lesson 1",
    "targets": [
        "I can infer the topic of this module from texts and images.",
        "I can discuss my predictions about the module using verbs in the future tense.",
    ],
    "blocks": [
        {
            "label": "I Notice / I Wonder",
            "prompt": "Look at the images and texts. What do you notice? What do you wonder?",
            "level": 0,
            "time": "Opening A \u00b7 20 min",
        },
        {
            "label": "Build Background Language",
            "prompt": "What new words or phrases connect to our topic? What do they mean?",
            "level": 1,
            "time": "Work Time A \u00b7 10 min",
        },
        {
            "label": "Module Predictions",
            "prompt": "What do you think this module will be about? Use future tense verbs to explain your predictions.",
            "level": 2,
            "time": "Work Time B \u00b7 20 min",
        },
        {
            "label": "Guiding Questions",
            "prompt": "What are the big questions we will explore? What will we create by the end of this module?",
            "level": 3,
            "time": "Closing A \u00b7 10 min",
        },
    ],
}

MATH_G7_LESSON = {
    "title": "What Are Scaled Copies?",
    "subtitle": "IM v360 Math \u00b7 Grade 7 \u00b7 Unit 1, Lesson 1",
    "targets": [
        "I can describe some characteristics of a scaled copy.",
        "I can tell whether or not a figure is a scaled copy of another figure.",
    ],
    "blocks": [
        {
            "label": "Warm-up: Printing Portraits",
            "prompt": "What happens when you print a photo at different sizes? Which versions look right and which look distorted?",
            "level": 0,
            "time": "Warm-up \u00b7 10 min",
            "organizer": "tchart",
            "organizerData": {
                "leftHeader": "Looks Right (Scaled Copy)",
                "rightHeader": "Looks Distorted (Not Scaled)",
                "rows": [{"left": "", "right": ""}],
            },
        },
        {
            "label": "Scaling F",
            "prompt": "Draw scaled copies of the letter F. What stays the same? What changes?",
            "level": 1,
            "time": "Activity 2 \u00b7 10 min",
        },
        {
            "label": "Pairs of Scaled Polygons",
            "prompt": "Compare each pair of polygons. Which are scaled copies? What evidence supports your answer?",
            "level": 2,
            "time": "Activity 3 \u00b7 15 min",
            "organizer": "venn",
            "organizerData": {
                "leftLabel": "Scaled Copy",
                "rightLabel": "Not a Scaled Copy",
                "leftOnly": "",
                "overlap": "",
                "rightOnly": "",
            },
        },
        {
            "label": "Lesson Synthesis",
            "prompt": "What makes a figure a scaled copy? What characteristics define scaled copies?",
            "level": 3,
            "time": "Synthesis \u00b7 5 min",
        },
        {
            "label": "Cool-down: Scaling L",
            "prompt": "Is the figure a scaled copy? Explain your reasoning using what you learned.",
            "level": 2,
            "time": "Cool-down \u00b7 5 min",
        },
    ],
}

SCI_BIO_LESSON = {
    "title": "Why do ecosystems need protection, and how are they protected?",
    "subtitle": "OpenSciEd Biology \u00b7 Unit 1, Lesson 1",
    "targets": [
        "I can describe an anchoring phenomenon related to ecosystem protection.",
        "I can generate questions about why and how ecosystems are protected.",
    ],
    "blocks": [
        {
            "label": "Anchoring Phenomenon",
            "prompt": "What do you observe about the ecosystem? What patterns or changes do you notice?",
            "level": 0,
            "time": "Anchoring Phenomenon",
            "organizer": "kwl",
            "organizerData": {
                "know": [""],
                "want": [""],
                "learned": [""],
            },
        },
        {
            "label": "What We Will Figure Out",
            "prompt": "What questions do we need to investigate? What do we need to figure out about ecosystems?",
            "level": 1,
            "time": "Building Understanding",
            "organizer": "mindmap",
            "organizerData": {
                "center": "Ecosystem Protection",
                "branches": ["Why protect?", "What threatens?", "How to protect?"],
            },
        },
        {
            "label": "Investigation Notes",
            "prompt": "What evidence supports your thinking? What data or observations are important?",
            "level": 2,
            "time": "Investigation",
            "organizer": "cornell",
            "organizerData": {
                "cues": ["What changes did you observe?", "What caused those changes?"],
                "notes": "",
                "summary": "",
            },
        },
        {
            "label": "Ecosystem Protection Claim",
            "prompt": "Why do ecosystems need protection? What claim can you make based on the evidence?",
            "level": 3,
            "time": "Sensemaking",
            "organizer": "argument",
            "organizerData": {
                "claim": "",
                "evidence": [{"point": "", "reasoning": ""}],
                "counterargument": "",
            },
        },
    ],
}


def render_curriculum_tab(lesson, tab_key, grade_band="ms"):
    """Render an editable curriculum note catcher with DOK counter."""
    notes_key = f"{tab_key}_notes"

    # Initialize notes from lesson blocks on first load
    if notes_key not in st.session_state:
        initial = []
        for block in lesson["blocks"]:
            level = LEVELS[block["level"]]
            org_id = block.get("organizer")
            base = {
                "uid": next_uid(),
                "levelId": level["id"],
                "levelLabel": level["label"],
                "curriculum_label": block["label"],
                "curriculum_prompt": block["prompt"],
                "curriculum_time": block["time"],
            }
            if org_id:
                tmpl = next((t for t in ORGANIZER_TEMPLATES if t["id"] == org_id), None)
                if tmpl:
                    band = BANDS[tmpl["band"]]
                    initial.append({
                        **base,
                        "type": "organizer",
                        "organizerId": org_id,
                        "label": tmpl["label"],
                        "icon": tmpl["icon"],
                        "color": band["color"],
                        "bg": band["bg"],
                        "border": band["border"],
                        "tagBg": band["tagBg"],
                        "bandLabel": band["label"],
                        "organizerData": block["organizerData"],
                    })
                    continue
            # Text block (no organizer or organizer not found)
            initial.append({
                **base,
                "type": "block",
                "label": block["label"],
                "prompt": block["prompt"],
                "color": level["color"],
                "bg": level["bg"],
                "border": level["border"],
                "tagBg": level["tagBg"],
                "text": "",
                "drawing": False,
            })
        st.session_state[notes_key] = initial

    # Lesson header
    st.markdown(
        f'<div style="margin-bottom:16px">'
        f'<div style="color:#FF6252;font-size:11px;letter-spacing:2px;text-transform:uppercase;'
        f'font-weight:600;margin-bottom:4px">{lesson["subtitle"]}</div>'
        f'<div style="color:#3F4C4C;font-size:20px;font-weight:700;margin-bottom:8px">'
        f'{lesson["title"]}</div></div>',
        unsafe_allow_html=True,
    )

    # Learning targets
    targets_html = "".join(
        f'<li style="margin-bottom:4px">{t}</li>' for t in lesson["targets"]
    )
    st.markdown(
        f'<div style="background:#EEF1F0;border-radius:8px;padding:12px 16px;margin-bottom:16px">'
        f'<div style="font-size:11px;color:#3F4C4C;font-weight:600;letter-spacing:1.5px;'
        f'text-transform:uppercase;margin-bottom:6px">Learning Targets</div>'
        f'<ul style="font-size:13px;color:#3F4C4C;margin:0;padding-left:18px">{targets_html}</ul>'
        f'</div>',
        unsafe_allow_html=True,
    )

    main_col, summary_col = st.columns([5, 1])
    notes = st.session_state[notes_key]

    with main_col:
        for idx, note in enumerate(notes):
            border_color = note["color"]
            display_label = note.get("curriculum_label", note["label"])

            # Time badge (curriculum blocks only)
            time_html = ""
            if "curriculum_time" in note:
                time_html = (
                    f'<span style="font-size:10px;color:#A3AAA8;margin-left:auto">'
                    f'{note["curriculum_time"]}</span>'
                )

            # DOK tag
            dok_html = ""
            if "levelId" in note:
                level = next((l for l in LEVELS if l["id"] == note["levelId"]), None)
                if level:
                    dok_html = (
                        f'<span class="note-tag" style="background:{level["tagBg"]};'
                        f'color:{level["color"]}">{level["dok"]}</span>'
                    )

            # Organizer badge
            org_badge = ""
            if note["type"] == "organizer":
                org_badge = (
                    f'<span style="font-size:10px;padding:2px 6px;border-radius:4px;'
                    f'background:#EEF1F0;color:#3F4C4C;font-weight:500">'
                    f'{note.get("icon", "")} {note["label"]}</span>'
                )

            # Band tag for student-added organizers (no DOK)
            band_tag = ""
            if not dok_html and note.get("bandLabel"):
                band_tag = (
                    f'<span class="note-tag" style="background:{note["tagBg"]};'
                    f'color:{border_color}">{note["bandLabel"]}</span>'
                )

            # Icon for student-added organizers
            icon_html = ""
            if note.get("icon") and not note.get("curriculum_label"):
                icon_html = f'<span style="font-size:15px">{note["icon"]}</span>'

            with st.container():
                st.markdown(
                    f'<div style="border-left:5px solid {border_color};border:1.5px solid {note["border"]};'
                    f'border-left:5px solid {border_color};border-radius:9px;padding:4px 0 0 0;'
                    f'margin-bottom:4px;background:#FFFFFF;box-shadow:0 2px 8px rgba(0,0,0,0.05)">'
                    f'<div style="padding:6px 12px 0;display:flex;align-items:center;gap:7px;flex-wrap:wrap">'
                    f'{icon_html}'
                    f'<span class="note-label">{display_label}</span>'
                    f'{dok_html}{band_tag}{org_badge}{time_html}'
                    f'</div></div>',
                    unsafe_allow_html=True,
                )

                # Controls row
                ctrl_cols = st.columns([1, 1, 1, 8])
                with ctrl_cols[0]:
                    if idx > 0 and st.button("↑", key=f"{tab_key}_up_{note['uid']}"):
                        move_note(note["uid"], -1, notes_key)
                        st.rerun()
                with ctrl_cols[1]:
                    if idx < len(notes) - 1 and st.button("↓", key=f"{tab_key}_dn_{note['uid']}"):
                        move_note(note["uid"], 1, notes_key)
                        st.rerun()
                with ctrl_cols[2]:
                    if st.button("✕", key=f"{tab_key}_rm_{note['uid']}"):
                        remove_note(note["uid"], notes_key)
                        st.rerun()

                # Prompt text
                prompt = note.get("curriculum_prompt", note.get("prompt", ""))
                if prompt:
                    st.markdown(
                        f'<div class="prompt-text">{prompt}</div>', unsafe_allow_html=True
                    )

                # Content
                if note["type"] == "organizer":
                    renderer = ORGANIZER_RENDERERS.get(note["organizerId"])
                    if renderer:
                        renderer(note, idx)
                else:
                    note["text"] = st.text_area(
                        "Note text", note.get("text", ""),
                        key=f"{tab_key}_txt_{note['uid']}",
                        height=80, label_visibility="collapsed",
                        placeholder="Write here...",
                    )

                st.markdown("---")

        # Add block / organizer controls
        with st.expander("+ Add a block or organizer"):
            add_mode = st.radio(
                "Add", ["Block", "Organizer"], horizontal=True,
                key=f"{tab_key}_add_mode", label_visibility="collapsed",
            )
            if add_mode == "Block":
                level_names = [f"{l['dok']} - {l['label']}" for l in LEVELS]
                active_idx = st.radio(
                    "DOK Level", range(len(LEVELS)),
                    format_func=lambda i: level_names[i],
                    key=f"{tab_key}_dok_sel",
                    label_visibility="collapsed",
                )
                active_level = LEVELS[active_idx]
                for blk in active_level["blocks"]:
                    if st.button(
                        blk["label"],
                        key=f'{tab_key}_ab_{active_level["id"]}_{blk["id"]}',
                        use_container_width=True,
                    ):
                        add_block(blk, active_level, notes_key)
                        st.rerun()
            else:
                allowed_bands = ["ms"] if grade_band == "ms" else ["ms", "hs"]
                for band_key in allowed_bands:
                    band = BANDS[band_key]
                    templates = [t for t in ORGANIZER_TEMPLATES if t["band"] == band_key]
                    st.markdown(
                        f'<div style="color:{band["color"]};font-size:10px;letter-spacing:1.5px;'
                        f'text-transform:uppercase;font-weight:600;margin:8px 0 6px">'
                        f'{band["label"]}</div>',
                        unsafe_allow_html=True,
                    )
                    for tmpl in templates:
                        if st.button(
                            f'{tmpl["icon"]}  {tmpl["label"]}',
                            key=f'{tab_key}_ao_{tmpl["id"]}',
                            use_container_width=True,
                        ):
                            add_organizer(tmpl["id"], notes_key)
                            st.rerun()

    with summary_col:
        st.markdown(
            '<div style="font-size:10px;color:#3F4C4C;letter-spacing:2px;text-transform:uppercase;'
            'font-weight:600;margin-bottom:10px">My Notes Map</div>',
            unsafe_allow_html=True,
        )
        for level in LEVELS:
            count = len([n for n in notes if n.get("levelId") == level["id"]])
            pct = (count / len(notes) * 100) if notes else 0
            st.markdown(
                f'<div style="margin-bottom:10px">'
                f'<div style="display:flex;justify-content:space-between;margin-bottom:2px">'
                f'<span style="font-size:10px;color:#3F4C4C;font-weight:500">{level["dok"]}</span>'
                f'<span style="font-size:10px;color:{level["color"]};font-weight:700">{count}</span>'
                f'</div>'
                f'<div style="height:5px;background:#DCE2E1;border-radius:3px;overflow:hidden">'
                f'<div style="height:100%;width:{pct}%;background:{level["color"]};border-radius:3px;'
                f'transition:width 0.3s"></div></div></div>',
                unsafe_allow_html=True,
            )
        total = len(notes)
        org_count = len([n for n in notes if n["type"] == "organizer"])
        higher = len([n for n in notes if n.get("levelId") in ("evaluate", "analyze")])
        block_notes = [n for n in notes if n["type"] != "organizer"]
        summary_html = (
            f'<div class="summary-box"><div style="font-weight:bold;color:#3F4C4C;'
            f'margin-bottom:5px">Total: {total} blocks</div>'
        )
        if org_count > 0:
            summary_html += (
                f'<div style="color:#09B472;margin-bottom:4px">'
                f'📐 {org_count} organizer{"s" if org_count > 1 else ""}</div>'
            )
        if total > 0 and higher == 0 and block_notes:
            summary_html += '<div style="color:#A18630">💡 Try an analysis or evaluation block!</div>'
        if higher > 0:
            summary_html += '<div style="color:#09B472">✓ Strong higher-order thinking!</div>'
        if total >= 5:
            summary_html += '<div style="color:#13B5EA;margin-top:4px">📚 Solid note set!</div>'
        summary_html += "</div>"
        st.markdown(summary_html, unsafe_allow_html=True)


# ──────────────────────────────────────────────
# HEADER
# ──────────────────────────────────────────────

st.markdown("""
<div class="header-bar">
    <div class="subtitle">Kiddom</div>
    <div class="title">Digital Note Builder</div>
</div>
""", unsafe_allow_html=True)

# ──────────────────────────────────────────────
# TABS
# ──────────────────────────────────────────────

tab_builder, tab_el, tab_math, tab_sci = st.tabs([
    "Digital Note Builder",
    "EL Grade 3 Note Catcher",
    "Math Grade 7 Note Catcher",
    "Science Biology Note Catcher",
])

# ─── Tab 1: Generic Note Builder ───
with tab_builder:
    with st.container():
        st.markdown('<div class="topic-bar">', unsafe_allow_html=True)
        topic = st.text_input("Topic or reading title", key="topic_input",
                               label_visibility="collapsed",
                               placeholder="🔍  Topic or reading title...")
        st.markdown('</div>', unsafe_allow_html=True)

    main_col, summary_col = st.columns([5, 1])

    with main_col:
        if topic:
            st.markdown(
                f'<div style="font-size:12px;color:#3F4C4C;font-weight:500;margin-bottom:12px;'
                f'padding-bottom:8px;border-bottom:1px dashed #DCE2E1;letter-spacing:1px">'
                f'TOPIC: {topic.upper()}</div>',
                unsafe_allow_html=True,
            )

        if not st.session_state.notes:
            st.markdown("""
            <div class="empty-state">
                <div class="icon">📓</div>
                <div class="msg">Your notebook is empty</div>
                <div class="hint">Choose blocks or graphic organizers from the palette on the left to start building your notes.</div>
            </div>
            """, unsafe_allow_html=True)
        else:
            for idx, note in enumerate(st.session_state.notes):
                border_color = note["color"]
                tag_text = note.get("bandLabel", note.get("levelLabel", ""))
                icon = note.get("icon", "")

                with st.container():
                    st.markdown(
                        f'<div style="border-left:5px solid {border_color};border:1.5px solid {note["border"]};'
                        f'border-left:5px solid {border_color};border-radius:9px;padding:4px 0 0 0;'
                        f'margin-bottom:4px;background:#FFFFFF;box-shadow:0 2px 8px rgba(0,0,0,0.05)">'
                        f'<div style="padding:6px 12px 0;display:flex;align-items:center;gap:7px">'
                        f'{f"<span style=font-size:15px>{icon}</span>" if icon else ""}'
                        f'<span class="note-label">{note["label"]}</span>'
                        f'<span class="note-tag" style="background:{note["tagBg"]};color:{border_color}">{tag_text}</span>'
                        f'</div></div>',
                        unsafe_allow_html=True,
                    )

                    # Controls row
                    ctrl_cols = st.columns([1, 1, 1, 8])
                    with ctrl_cols[0]:
                        if idx > 0 and st.button("↑", key=f"mv_up_{note['uid']}"):
                            move_note(note["uid"], -1)
                            st.rerun()
                    with ctrl_cols[1]:
                        if idx < len(st.session_state.notes) - 1 and st.button("↓", key=f"mv_dn_{note['uid']}"):
                            move_note(note["uid"], 1)
                            st.rerun()
                    with ctrl_cols[2]:
                        if st.button("✕", key=f"rm_{note['uid']}"):
                            remove_note(note["uid"])
                            st.rerun()

                    # Content
                    if note["type"] == "organizer":
                        renderer = ORGANIZER_RENDERERS.get(note["organizerId"])
                        if renderer:
                            renderer(note, idx)
                    else:
                        st.markdown(f'<div class="prompt-text">{note["prompt"]}</div>', unsafe_allow_html=True)
                        note["text"] = st.text_area(
                            "Note text", note["text"],
                            key=f"block_text_{note['uid']}",
                            height=80, label_visibility="collapsed",
                            placeholder="Write here...",
                        )
                        # Drawing toggle
                        draw_key = f"draw_toggle_{note['uid']}"
                        if st.checkbox("✏️ Add sketch", value=note.get("drawing", False), key=draw_key):
                            note["drawing"] = True
                            canvas_result = st_canvas(
                                fill_color="rgba(255, 255, 255, 1)",
                                stroke_width=3,
                                stroke_color=note["color"],
                                background_color="#FFFFFF",
                                width=600,
                                height=160,
                                drawing_mode="freedraw",
                                key=f"canvas_{note['uid']}",
                            )
                        else:
                            note["drawing"] = False

                    st.markdown("---")

    with summary_col:
        st.markdown(
            '<div style="font-size:10px;color:#3F4C4C;letter-spacing:2px;text-transform:uppercase;'
            'font-weight:600;margin-bottom:10px">My Notes Map</div>',
            unsafe_allow_html=True,
        )

        notes = st.session_state.notes
        for level in LEVELS:
            count = len([n for n in notes if n.get("levelId") == level["id"]])
            pct = (count / len(notes) * 100) if notes else 0
            st.markdown(
                f'<div style="margin-bottom:10px">'
                f'<div style="display:flex;justify-content:space-between;margin-bottom:2px">'
                f'<span style="font-size:10px;color:#3F4C4C;font-weight:500">{level["dok"]}</span>'
                f'<span style="font-size:10px;color:{level["color"]};font-weight:700">{count}</span>'
                f'</div>'
                f'<div style="height:5px;background:#DCE2E1;border-radius:3px;overflow:hidden">'
                f'<div style="height:100%;width:{pct}%;background:{level["color"]};border-radius:3px;'
                f'transition:width 0.3s"></div></div></div>',
                unsafe_allow_html=True,
            )

        # Summary box
        total = len(notes)
        org_count = len([n for n in notes if n["type"] == "organizer"])
        higher = len([n for n in notes if n.get("levelId") in ("evaluate", "analyze")])
        block_notes = [n for n in notes if n["type"] != "organizer"]

        summary_html = f'<div class="summary-box"><div style="font-weight:bold;color:#3F4C4C;margin-bottom:5px">Total: {total} blocks</div>'
        if org_count > 0:
            summary_html += f'<div style="color:#09B472;margin-bottom:4px">📐 {org_count} organizer{"s" if org_count > 1 else ""}</div>'
        if total > 0 and higher == 0 and block_notes:
            summary_html += '<div style="color:#A18630">💡 Try an analysis or evaluation block!</div>'
        if higher > 0:
            summary_html += '<div style="color:#09B472">✓ Strong higher-order thinking!</div>'
        if total >= 5:
            summary_html += '<div style="color:#13B5EA;margin-top:4px">📚 Solid note set!</div>'
        summary_html += "</div>"
        st.markdown(summary_html, unsafe_allow_html=True)

# ─── Tab 2: EL Grade 3 Note Catcher ───
with tab_el:
    render_curriculum_tab(EL_G3_LESSON, "el_g3", grade_band="ms")

# ─── Tab 3: Math Grade 7 Note Catcher ───
with tab_math:
    render_curriculum_tab(MATH_G7_LESSON, "math_g7", grade_band="ms")

# ─── Tab 4: Science Biology Note Catcher ───
with tab_sci:
    render_curriculum_tab(SCI_BIO_LESSON, "sci_bio", grade_band="both")

# ──────────────────────────────────────────────
# SIDEBAR (Palette for Digital Note Builder)
# ──────────────────────────────────────────────

with st.sidebar:
    st.markdown('<div style="font-size:16px;font-weight:700;color:#3F4C4C;margin-bottom:4px">Palette</div>',
                unsafe_allow_html=True)
    mode = st.radio("Mode", ["Blocks", "Organizers"], horizontal=True, label_visibility="collapsed")

    if mode == "Blocks":
        st.markdown(
            '<div style="color:#3F4C4C;font-size:11px;letter-spacing:1.5px;'
            'text-transform:uppercase;font-weight:500;margin:8px 0 6px">Block Palette</div>',
            unsafe_allow_html=True,
        )
        level_names = [f"{l['dok']} - {l['label']}" for l in LEVELS]
        active_idx = st.radio("DOK Level", range(len(LEVELS)),
                              format_func=lambda i: level_names[i],
                              label_visibility="collapsed")
        active_level = LEVELS[active_idx]

        st.markdown(
            f'<div style="color:{active_level["color"]};font-size:10px;letter-spacing:1.5px;'
            f'text-transform:uppercase;font-weight:600;margin:12px 0 6px">Click to add</div>',
            unsafe_allow_html=True,
        )
        for block in active_level["blocks"]:
            if st.button(
                f'{block["label"]}',
                key=f'add_block_{active_level["id"]}_{block["id"]}',
                use_container_width=True,
            ):
                add_block(block, active_level)
                st.rerun()

    else:  # Organizers
        for band_key in ["ms", "hs"]:
            band = BANDS[band_key]
            templates = [t for t in ORGANIZER_TEMPLATES if t["band"] == band_key]
            st.markdown(
                f'<div style="color:{band["color"]};font-size:10px;letter-spacing:1.5px;'
                f'text-transform:uppercase;font-weight:600;margin:12px 0 6px">{band["label"]}</div>',
                unsafe_allow_html=True,
            )
            for tmpl in templates:
                if st.button(
                    f'{tmpl["icon"]}  {tmpl["label"]}',
                    key=f'add_org_{tmpl["id"]}',
                    use_container_width=True,
                ):
                    add_organizer(tmpl["id"])
                    st.rerun()
