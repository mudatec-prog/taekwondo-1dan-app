import { CheckCircle2, RotateCcw, Shuffle, Timer, Volume2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { keywordDictionary, techniqueDictionary, type DictionaryEntry } from "../data/dictionary";
import type { TribunalResult, TribunalStats } from "../hooks/useLocalProgress";
import { preloadKoreanVoices, speakKorean } from "../utils/speech";

type TribunalDeckId = "keywords" | "positions" | "defenses" | "attacks" | "kicks" | "weak";

type TribunalModeProps = {
  stats: Record<string, TribunalStats>;
  onRecordResult: (id: string, result: TribunalResult) => void;
};

const decks: Array<{ id: TribunalDeckId; label: string; description: string }> = [
  { id: "keywords", label: "Claves", description: "Palabras base que construyen las tecnicas" },
  { id: "positions", label: "Posiciones", description: "Sogui que puede pedir el tribunal" },
  { id: "defenses", label: "Defensas", description: "Maki con manos" },
  { id: "attacks", label: "Ataques", description: "Gong Kiok con manos" },
  { id: "kicks", label: "Patadas", description: "Bal Kisul y Tuio basico" },
  { id: "weak", label: "Fallos", description: "Repaso inteligente de lo que mas fallas" },
];

const allTribunalItems = [...keywordDictionary, ...techniqueDictionary];

function getBaseDeckItems(deckId: TribunalDeckId) {
  if (deckId === "keywords") return keywordDictionary;
  if (deckId === "positions") return techniqueDictionary.filter((entry) => entry.category === "Posiciones");
  if (deckId === "defenses") return techniqueDictionary.filter((entry) => entry.category === "Defensas con las manos");
  if (deckId === "attacks") return techniqueDictionary.filter((entry) => entry.category === "Ataques con las manos");
  if (deckId === "weak") return [];
  return techniqueDictionary.filter((entry) => entry.category === "Tecnicas de pierna" || entry.category === "Patadas en salto");
}

function getWeakItems(stats: Record<string, TribunalStats>) {
  return allTribunalItems
    .filter((entry) => (stats[entry.id]?.wrong ?? 0) > 0)
    .sort((a, b) => {
      const aStats = stats[a.id] ?? { correct: 0, wrong: 0 };
      const bStats = stats[b.id] ?? { correct: 0, wrong: 0 };
      return bStats.wrong - bStats.correct - (aStats.wrong - aStats.correct);
    });
}

function pickWeighted(items: DictionaryEntry[], stats: Record<string, TribunalStats>) {
  const weighted = items.flatMap((item) => {
    const itemStats = stats[item.id];
    const misses = itemStats?.wrong ?? 0;
    const hits = itemStats?.correct ?? 0;
    const weight = Math.max(1, 2 + misses * 2 - hits);
    return Array.from({ length: weight }, () => item);
  });

  return weighted[Math.floor(Math.random() * weighted.length)] ?? items[0];
}

export function TribunalMode({ stats, onRecordResult }: TribunalModeProps) {
  const [deckId, setDeckId] = useState<TribunalDeckId>("keywords");
  const weakItems = useMemo(() => getWeakItems(stats), [stats]);
  const deckItems = useMemo(
    () => (deckId === "weak" ? weakItems.length ? weakItems : keywordDictionary : getBaseDeckItems(deckId)),
    [deckId, weakItems],
  );
  const [current, setCurrent] = useState<DictionaryEntry>(() => getBaseDeckItems("keywords")[0]);
  const [revealed, setRevealed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  const deckStats = useMemo(() => {
    const attempts = deckItems.reduce(
      (acc, item) => {
        const itemStats = stats[item.id];
        return {
          correct: acc.correct + (itemStats?.correct ?? 0),
          wrong: acc.wrong + (itemStats?.wrong ?? 0),
        };
      },
      { correct: 0, wrong: 0 },
    );
    const total = attempts.correct + attempts.wrong;
    const accuracy = total ? Math.round((attempts.correct / total) * 100) : 0;
    return { ...attempts, total, accuracy };
  }, [deckItems, stats]);

  useEffect(() => {
    preloadKoreanVoices();
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      setRevealed(true);
      return;
    }

    const timeout = window.setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(timeout);
  }, [isRunning, secondsLeft]);

  function nextCommand(shouldSpeak = true) {
    const next = pickWeighted(deckItems, stats);
    setCurrent(next);
    setRevealed(false);
    setSecondsLeft(5);
    setIsRunning(true);
    if (shouldSpeak) {
      window.setTimeout(() => speakKorean(next.speech ?? next.korean), 100);
    }
  }

  function selectDeck(nextDeck: TribunalDeckId) {
    const nextItems = nextDeck === "weak" ? getWeakItems(stats) : getBaseDeckItems(nextDeck);
    setDeckId(nextDeck);
    setCurrent(nextItems[0] ?? keywordDictionary[0]);
    setRevealed(false);
    setSecondsLeft(5);
    setIsRunning(false);
  }

  function record(result: TribunalResult) {
    onRecordResult(current.id, result);
    nextCommand(false);
  }

  return (
    <section className="min-w-0 space-y-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Modo Tribunal</p>
        <h2 className="mt-1 text-3xl font-black uppercase">Reacciona al coreano</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/62">
          La app te lanza una orden como si estuvieras delante del tribunal. Reconoce, ejecuta y marca el resultado.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6">
        {decks.map((deck) => (
          <button
            key={deck.id}
            className={`tap-target rounded border px-2 py-3 text-xs font-black uppercase ${
              deckId === deck.id
                ? "border-combat-red bg-combat-red text-white shadow-glow"
                : "border-white/10 bg-white/[0.04] text-white/75"
            }`}
            onClick={() => selectDeck(deck.id)}
            type="button"
          >
            {deck.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Metric label="Intentos" value={String(deckStats.total)} />
        <Metric label="Aciertos" value={String(deckStats.correct)} />
        <Metric label="Precision" value={`${deckStats.accuracy}%`} />
      </div>

      <WeaknessPanel items={weakItems.slice(0, 5)} stats={stats} onPractice={() => selectDeck("weak")} />

      <article className="rounded border border-white/10 bg-combat-panel p-5 shadow-glow sm:p-7">
        <div className="flex items-center justify-between gap-3 text-sm font-bold uppercase text-white/55">
          <span>{decks.find((deck) => deck.id === deckId)?.description}</span>
          <span className="flex items-center gap-1 text-combat-red">
            <Timer size={17} aria-hidden />
            {secondsLeft}s
          </span>
        </div>

        <div className="my-6 rounded border border-white/10 bg-combat-black p-5 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-combat-red">El tribunal dice</p>
          <h3 className="mt-4 break-words text-4xl font-black sm:text-6xl">{current.korean}</h3>
          {current.speech && <p className="mt-3 text-3xl font-black text-combat-red">{current.speech}</p>}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              className="tap-target rounded border border-combat-red/45 bg-combat-red/15 px-4 py-3 font-black uppercase text-red-100"
              onClick={() => speakKorean(current.speech ?? current.korean)}
              type="button"
            >
              <Volume2 className="inline" size={18} aria-hidden /> Escuchar
            </button>
            <button
              className="tap-target rounded border border-white/15 px-4 py-3 font-black uppercase text-white"
              onClick={() => setRevealed((value) => !value)}
              type="button"
            >
              {revealed ? "Ocultar ayuda" : "Ver significado"}
            </button>
          </div>

          {revealed && (
            <div className="mt-5 rounded border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm font-bold uppercase text-white/45">Debes ejecutar</p>
              <p className="mt-1 text-2xl font-black text-white">{current.spanish}</p>
              <p className="mt-2 text-sm font-bold uppercase text-white/45">{current.category}</p>
            </div>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            className="tap-target rounded bg-white px-4 py-3 font-black uppercase text-combat-black"
            onClick={() => record("correct")}
            type="button"
          >
            <CheckCircle2 className="inline" size={18} aria-hidden /> Lo hice
          </button>
          <button
            className="tap-target rounded bg-combat-red px-4 py-3 font-black uppercase text-white"
            onClick={() => record("wrong")}
            type="button"
          >
            <XCircle className="inline" size={18} aria-hidden /> Falle
          </button>
          <button
            className="tap-target rounded border border-white/15 px-4 py-3 font-black uppercase text-white"
            onClick={() => nextCommand(true)}
            type="button"
          >
            <Shuffle className="inline" size={18} aria-hidden /> Nueva
          </button>
          <button
            className="tap-target rounded border border-white/15 px-4 py-3 font-black uppercase text-white sm:col-span-3"
            onClick={() => {
              setRevealed(false);
              setSecondsLeft(5);
              setIsRunning(true);
            }}
            type="button"
          >
            <RotateCcw className="inline" size={18} aria-hidden /> Repetir temporizador
          </button>
        </div>
      </article>
    </section>
  );
}

function WeaknessPanel({
  items,
  stats,
  onPractice,
}: {
  items: DictionaryEntry[];
  stats: Record<string, TribunalStats>;
  onPractice: () => void;
}) {
  if (!items.length) {
    return (
      <article className="rounded border border-white/10 bg-combat-panel p-4">
        <p className="text-sm font-black uppercase text-combat-red">Puntos debiles</p>
        <p className="mt-2 text-sm text-white/60">
          Todavia no hay fallos registrados. Cuando marques algun fallo, aparecera aqui para repasarlo.
        </p>
      </article>
    );
  }

  return (
    <article className="rounded border border-white/10 bg-combat-panel p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-combat-red">Puntos debiles</p>
          <p className="mt-1 text-sm text-white/58">La app prioriza estas ordenes en el banco Fallos.</p>
        </div>
        <button
          className="tap-target rounded bg-combat-red px-4 py-3 text-sm font-black uppercase text-white shadow-glow"
          onClick={onPractice}
          type="button"
        >
          Practicar fallos
        </button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => {
          const itemStats = stats[item.id] ?? { correct: 0, wrong: 0 };
          return (
            <div key={item.id} className="rounded border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="break-words font-black">{item.korean}</p>
                  <p className="mt-1 break-words text-sm text-white/62">{item.spanish}</p>
                </div>
                <span className="shrink-0 rounded bg-combat-red/20 px-2 py-1 text-xs font-black text-red-100">
                  {itemStats.wrong} fallos
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-combat-panel p-4">
      <p className="text-xs font-bold uppercase text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
