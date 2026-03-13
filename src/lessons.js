import { ORGANIZER_TEMPLATES, BANDS } from "./GraphicOrganizers";

const LEVELS = [
  { id: "remember", color: "#13B5EA", bg: "#E8F7FD", border: "#84DBEF", tagBg: "#D0EFFA", label: "Remember & Notice" },
  { id: "understand", color: "#09B472", bg: "#E6F9F0", border: "#A3E8B8", tagBg: "#D1F4DE", label: "Understand & Explain" },
  { id: "analyze", color: "#A18630", bg: "#FFF9E6", border: "#FBD206", tagBg: "#FFF5BB", label: "Apply & Analyze" },
  { id: "evaluate", color: "#827AB9", bg: "#F0EEF8", border: "#C2BDF2", tagBg: "#DDD8F5", label: "Evaluate & Synthesize" },
];

let _uid = 9000;
function uid() { return ++_uid; }

function buildNotes(blocks) {
  return blocks.map((b) => {
    const level = LEVELS[b.level];
    const base = {
      uid: uid(),
      label: b.label,
      prompt: b.prompt,
      levelId: level.id,
      color: level.color,
      bg: level.bg,
      border: level.border,
      tagBg: level.tagBg,
      levelLabel: level.label,
      time: b.time,
      text: "",
      drawing: false,
      drawingData: null,
    };
    if (b.organizer) {
      const tmpl = ORGANIZER_TEMPLATES.find((t) => t.id === b.organizer);
      const band = tmpl ? BANDS[tmpl.band] : BANDS.ms;
      return {
        ...base,
        type: "organizer",
        organizerId: b.organizer,
        icon: tmpl?.icon || "",
        organizerData: b.organizerData,
        bandLabel: band.label,
      };
    }
    return base;
  });
}

export const EL_G3_LESSON = {
  title: "Discover Our Topic: The Power of Reading",
  subtitle: "EL Education · Grade 3 · Module 1, Unit 1, Lesson 1",
  targets: [
    "I can infer the topic of this module from texts and images.",
    "I can discuss my predictions about the module using verbs in the future tense.",
  ],
  gradeBand: "ms",
  blocks: [
    { label: "I Notice / I Wonder", prompt: "Look at the images and texts. What do you notice? What do you wonder?", level: 0, time: "Opening A · 20 min" },
    { label: "Build Background Language", prompt: "What new words or phrases connect to our topic? What do they mean?", level: 1, time: "Work Time A · 10 min" },
    { label: "Module Predictions", prompt: "What do you think this module will be about? Use future tense verbs to explain your predictions.", level: 2, time: "Work Time B · 20 min" },
    { label: "Guiding Questions", prompt: "What are the big questions we will explore? What will we create by the end of this module?", level: 3, time: "Closing A · 10 min" },
  ],
};

export const MATH_G7_LESSON = {
  title: "What Are Scaled Copies?",
  subtitle: "IM v360 Math · Grade 7 · Unit 1, Lesson 1",
  targets: [
    "I can describe some characteristics of a scaled copy.",
    "I can tell whether or not a figure is a scaled copy of another figure.",
  ],
  gradeBand: "ms",
  blocks: [
    {
      label: "Warm-up: Printing Portraits",
      prompt: "What happens when you print a photo at different sizes? Which versions look right and which look distorted?",
      level: 0, time: "Warm-up · 10 min",
      organizer: "tchart",
      organizerData: { leftHeader: "Looks Right (Scaled Copy)", rightHeader: "Looks Distorted (Not Scaled)", rows: [{ left: "", right: "" }] },
    },
    { label: "Scaling F", prompt: "Draw scaled copies of the letter F. What stays the same? What changes?", level: 1, time: "Activity 2 · 10 min" },
    {
      label: "Pairs of Scaled Polygons",
      prompt: "Compare each pair of polygons. Which are scaled copies? What evidence supports your answer?",
      level: 2, time: "Activity 3 · 15 min",
      organizer: "venn",
      organizerData: { leftLabel: "Scaled Copy", rightLabel: "Not a Scaled Copy", leftOnly: "", overlap: "", rightOnly: "" },
    },
    { label: "Lesson Synthesis", prompt: "What makes a figure a scaled copy? What characteristics define scaled copies?", level: 3, time: "Synthesis · 5 min" },
    { label: "Cool-down: Scaling L", prompt: "Is the figure a scaled copy? Explain your reasoning using what you learned.", level: 2, time: "Cool-down · 5 min" },
  ],
};

export const SCI_BIO_LESSON = {
  title: "Why do ecosystems need protection, and how are they protected?",
  subtitle: "OpenSciEd Biology · Unit 1, Lesson 1",
  targets: [
    "I can describe an anchoring phenomenon related to ecosystem protection.",
    "I can generate questions about why and how ecosystems are protected.",
  ],
  gradeBand: "hs",
  blocks: [
    {
      label: "Anchoring Phenomenon",
      prompt: "What do you observe about the ecosystem? What patterns or changes do you notice?",
      level: 0, time: "Anchoring Phenomenon",
      organizer: "kwl",
      organizerData: { know: [""], want: [""], learned: [""] },
    },
    {
      label: "What We Will Figure Out",
      prompt: "What questions do we need to investigate? What do we need to figure out about ecosystems?",
      level: 1, time: "Building Understanding",
      organizer: "mindmap",
      organizerData: { center: "Ecosystem Protection", branches: ["Why protect?", "What threatens?", "How to protect?"] },
    },
    {
      label: "Investigation Notes",
      prompt: "What evidence supports your thinking? What data or observations are important?",
      level: 2, time: "Investigation",
      organizer: "cornell",
      organizerData: { cues: ["What changes did you observe?", "What caused those changes?"], notes: "", summary: "" },
    },
    {
      label: "Ecosystem Protection Claim",
      prompt: "Why do ecosystems need protection? What claim can you make based on the evidence?",
      level: 3, time: "Sensemaking",
      organizer: "argument",
      organizerData: { claim: "", evidence: [{ point: "", reasoning: "" }], counterargument: "" },
    },
  ],
};

export function buildLessonNotes(lesson) {
  return buildNotes(lesson.blocks);
}

export const TABS = [
  { key: "builder", label: "Digital Note Builder", lesson: null },
  { key: "el-g3", label: "EL Grade 3", lesson: EL_G3_LESSON },
  { key: "math-g7", label: "Math Grade 7", lesson: MATH_G7_LESSON },
  { key: "sci-bio", label: "Science Biology", lesson: SCI_BIO_LESSON },
];
