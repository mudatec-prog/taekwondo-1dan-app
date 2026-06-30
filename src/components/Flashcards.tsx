import { Eye, RotateCcw, Volume2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { dictionary, keywordDictionary, positionDictionary } from "../data/dictionary";
import type { FlashcardStatus } from "../hooks/useLocalProgress";
import { speakKorean } from "../utils/speech";

type FlashcardsProps = {
  flashcards: Record<string, FlashcardStatus>;
  onMark: (id: string, status: FlashcardStatus) => void;
  onReset: () => void;
};

type DeckId = "keywords" | "positions" | "all";

const decks = [
  { id: "keywords" as const, label: "Palabras clave" },
  { id: "positions" as const, label: "Posiciones" },
  { id: "all" as const, label: "Todo" },
];

export function Flashcards({ flashcards, onMark, onReset }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [deckId, setDeckId] = useState<DeckId>("keywords");
  const deck = deckId === "keywords" ? keywordDictionary : deckId === "positions" ? positionDictionary : dictionary;

  const studyQueue = useMemo(
    () =>
      [...deck].sort((a, b) => {
        const score = (id: string) => (flashcards[id] === "known" ? 2 : flashcards[id] === "unknown" ? 0 : 1);
        return score(a.id) - score(b.id);
      }),
    [deck, flashcards],
  );
  const card = studyQueue[index % studyQueue.length];

  const stats = useMemo(() => {
    const known = Object.values(flashcards).filter((status) => status === "known").length;
    const deckKnown = deck.filter((entry) => flashcards[entry.id] === "known").length;
    return { known, deckKnown, total: dictionary.length, deckTotal: deck.length };
  }, [deck, flashcards]);

  function selectDeck(nextDeckId: DeckId) {
    setDeckId(nextDeckId);
    setIndex(0);
    setRevealed(false);
  }

  function mark(status: FlashcardStatus) {
    onMark(card.id, status);
    setRevealed(false);
    setIndex((current) => (current + 1) % studyQueue.length);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Memoria activa</p>
          <h2 className="mt-1 text-3xl font-black uppercase">Flashcards</h2>
        </div>
        <button
          className="tap-target rounded border border-white/15 px-3 py-2 text-sm font-black uppercase text-white/80"
          onClick={onReset}
          type="button"
        >
          <RotateCcw className="inline" size={16} aria-hidden /> Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {decks.map((deckOption) => (
          <button
            key={deckOption.id}
            className={`tap-target rounded border px-2 py-3 text-xs font-black uppercase sm:text-sm ${
              deckId === deckOption.id
                ? "border-combat-red bg-combat-red text-white shadow-glow"
                : "border-white/10 bg-white/[0.04] text-white/75"
            }`}
            onClick={() => selectDeck(deckOption.id)}
            type="button"
          >
            {deckOption.label}
          </button>
        ))}
      </div>

      <div className="rounded border border-white/10 bg-combat-panel p-5 shadow-glow sm:p-7">
        <div className="flex items-center justify-between text-sm font-bold uppercase text-white/55">
          <span>Modo tribunal - {card.category}</span>
          <span>{index + 1} / {studyQueue.length}</span>
        </div>

        <div className="my-8 min-h-48 rounded border border-white/10 bg-combat-black p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-combat-red">El tribunal dice</p>
          <h3 className="mt-4 text-4xl font-black sm:text-6xl">{card.korean}</h3>
          <button
            className="tap-target mx-auto mt-5 rounded border border-combat-red/45 bg-combat-red/15 px-4 py-3 font-black uppercase text-red-100"
            onClick={() => speakKorean(card.speech ?? card.korean)}
            type="button"
          >
            <Volume2 className="inline" size={18} aria-hidden /> Escuchar
          </button>
          {revealed && (
            <div className="mt-6">
              <p className="text-sm font-bold uppercase text-white/45">Debes reconocer y ejecutar</p>
              <p className="mt-2 text-2xl font-bold text-white/82">{card.spanish}</p>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            className="tap-target rounded border border-white/15 px-4 py-3 font-black uppercase text-white"
            onClick={() => setRevealed(true)}
            type="button"
          >
            <Eye className="inline" size={18} aria-hidden /> Ver significado
          </button>
          <button
            className="tap-target rounded bg-white px-4 py-3 font-black uppercase text-combat-black"
            onClick={() => mark("known")}
            type="button"
          >
            La se
          </button>
          <button
            className="tap-target rounded bg-combat-red px-4 py-3 font-black uppercase text-white"
            onClick={() => mark("unknown")}
            type="button"
          >
            <X className="inline" size={18} aria-hidden /> No la se
          </button>
        </div>
      </div>

      <div className="rounded border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between text-sm font-bold uppercase text-white/65">
          <span>Dominadas</span>
          <span>{stats.deckKnown}/{stats.deckTotal}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-white/10">
          <div className="h-full bg-combat-red" style={{ width: `${(stats.deckKnown / stats.deckTotal) * 100}%` }} />
        </div>
        <p className="mt-2 text-xs font-bold uppercase text-white/35">Total general: {stats.known}/{stats.total}</p>
      </div>
    </section>
  );
}
