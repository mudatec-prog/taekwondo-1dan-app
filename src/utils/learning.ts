import { dictionary, keywordDictionary, positionDictionary, techniqueDictionary, type DictionaryEntry } from "../data/dictionary";

export type QuizMode = "choice" | "write" | "listen" | "speak";
export type DeckId = "daily" | "keywords" | "positions" | "techniques" | "review";
export type TermMemory = { correct: number; wrong: number; strength: number; due: string; lastCorrectDay?: string };
export type LearningState = {
  terms: Record<string, TermMemory>;
  days: Record<string, { answers: number; correct: number; xp: number }>;
  xp: number;
  recentAttempts: string[];
};
export type AnswerEvent = { attemptId: string; termId: string; correct: boolean; day: string; retry: boolean };
export type Question = { entryId: string; mode: QuizMode; options: string[]; retry: boolean };
export const DAILY_GOAL = 8;
export const emptyLearning = (): LearningState => ({ terms: {}, days: {}, xp: 0, recentAttempts: [] });

export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function shiftDay(day: string, amount: number) {
  const [year, month, date] = day.split("-").map(Number);
  return localDay(new Date(year, month - 1, date + amount, 12));
}

export function streak(learning: LearningState, today = localDay()) {
  let day = learning.days[today]?.answers >= DAILY_GOAL ? today : shiftDay(today, -1);
  let count = 0;
  while (learning.days[day]?.answers >= DAILY_GOAL) { count++; day = shiftDay(day, -1); }
  return count;
}

export function applyAnswer(state: LearningState, answer: AnswerEvent): LearningState {
  if (state.recentAttempts.includes(answer.attemptId)) return state;
  const previous = state.terms[answer.termId] ?? { correct: 0, wrong: 0, strength: 0, due: answer.day };
  // A same-day retry helps recall, but cannot manufacture several days of mastery.
  const strength = answer.correct
    ? Math.min(5, previous.strength + (previous.lastCorrectDay === answer.day || answer.retry ? 0 : 1))
    : 0;
  const xp = answer.correct ? (answer.retry ? 5 : 10) : 2;
  const day = state.days[answer.day] ?? { answers: 0, correct: 0, xp: 0 };
  return {
    terms: { ...state.terms, [answer.termId]: {
      correct: previous.correct + Number(answer.correct), wrong: previous.wrong + Number(!answer.correct), strength,
      due: answer.correct ? shiftDay(answer.day, [1, 1, 3, 7, 14, 30][strength]) : answer.day,
      lastCorrectDay: answer.correct ? answer.day : previous.lastCorrectDay,
    } },
    days: { ...state.days, [answer.day]: { answers: day.answers + 1, correct: day.correct + Number(answer.correct), xp: day.xp + xp } },
    xp: state.xp + xp,
    recentAttempts: [...state.recentAttempts.slice(-199), answer.attemptId],
  };
}

export function normalizeAnswer(value: string) {
  return value.normalize("NFKC").normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC")
    .toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
}

const romanVariants: Array<[RegExp, string]> = [
  [/makki/g, "maki"], [/jireugi/g, "jirugui"], [/chireugi|jjireugi/g, "chirugui"],
  [/chigi/g, "chigui"], [/chagi/g, "chagui"], [/seogi/g, "sogui"],
  [/arae/g, "are"], [/eolgul/g, "olgul"], [/jumeok/g, "chumok"],
  [/junbi|jumbi/g, "chumbi"], [/gyeorugi/g, "kyorugui"], [/gonggyeok/g, "gongkiok"],
];

function canonicalRoman(value: string) {
  return romanVariants.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), normalizeAnswer(value));
}

export function matchesKorean(entry: DictionaryEntry, answer: string) {
  if (!normalizeAnswer(answer)) return false;
  return canonicalRoman(answer) === canonicalRoman(entry.korean)
    || Boolean(entry.speech && normalizeAnswer(answer) === normalizeAnswer(entry.speech));
}

function shuffle<T>(items: T[], random = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function optionsFor(entry: DictionaryEntry, random = Math.random) {
  const candidates = shuffle(dictionary.filter((item) => item.id !== entry.id
    && normalizeAnswer(item.korean) !== normalizeAnswer(entry.korean)
    && (!entry.speech || normalizeAnswer(item.speech ?? "") !== normalizeAnswer(entry.speech))), random)
    .sort((a, b) => Number(b.category === entry.category) - Number(a.category === entry.category));
  const seen = new Set([normalizeAnswer(entry.spanish)]);
  const distractors: string[] = [];
  for (const item of candidates) {
    const key = normalizeAnswer(item.spanish);
    if (!seen.has(key)) { seen.add(key); distractors.push(item.spanish); }
    if (distractors.length === 3) break;
  }
  return shuffle([entry.spanish, ...distractors], random);
}

export function getDeck(deck: DeckId, learning: LearningState, today = localDay()) {
  if (deck === "positions") return positionDictionary;
  if (deck === "techniques") return techniqueDictionary;
  if (deck === "keywords") return keywordDictionary;
  if (deck === "review") return dictionary.filter((item) => learning.terms[item.id] && learning.terms[item.id].due <= today);
  const foundations = keywordDictionary.slice(0, 12);
  if (foundations.filter((item) => (learning.terms[item.id]?.strength ?? 0) >= 1).length < 6) return foundations;
  const basicsReady = keywordDictionary.filter((item) => (learning.terms[item.id]?.strength ?? 0) >= 1).length >= 12;
  const positionsReady = positionDictionary.filter((item) => (learning.terms[item.id]?.strength ?? 0) >= 1).length >= 5;
  return positionsReady ? dictionary : basicsReady ? [...keywordDictionary, ...positionDictionary] : keywordDictionary;
}

export function createQuestions(deck: DeckId, mode: "mixed" | QuizMode, learning: LearningState, today = localDay()) {
  const items = getDeck(deck, learning, today).filter((entry) => mode !== "speak" || entry.speech);
  const priority = (entry: DictionaryEntry) => {
    const memory = learning.terms[entry.id];
    return !memory ? 1 : memory.due <= today ? 0 : 2;
  };
  const chosen = shuffle(items).sort((a, b) => priority(a) - priority(b)).slice(0, DAILY_GOAL);
  return chosen.map((entry, index): Question => ({
    entryId: entry.id,
    mode: mode === "mixed" ? (["choice", "listen", "choice", learning.terms[entry.id]?.correct ? "write" : "choice"] as const)[index % 4] : mode,
    options: optionsFor(entry), retry: false,
  }));
}
