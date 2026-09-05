import { Search, Volume2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { dictionary } from "../data/dictionary";
import { keyTermGroups, type KeyTerm } from "../data/keyTerms";
import { preloadKoreanVoices, speakKorean, type KoreanSpeechResult } from "../utils/speech";

type DictionaryPhase = "keywords" | "techniques";
type GroupFilter = "all" | KeyTerm["group"];

export function Dictionary() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<DictionaryPhase>("keywords");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("all");
  const [speechResult, setSpeechResult] = useState<KoreanSpeechResult | null>(null);
  const [speechEntryId, setSpeechEntryId] = useState<string | null>(null);
  const speechRequest = useRef(0);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    preloadKoreanVoices();
  }, []);

  const results = useMemo(
    () =>
      dictionary.filter((entry) => {
        const text = `${entry.korean} ${entry.spanish} ${entry.category}`.toLowerCase();
        const matchesPhase = entry.phase === phase;
        const matchesSearch = text.includes(normalizedQuery);
        const matchesGroup =
          phase === "techniques" || groupFilter === "all" || entry.category === `Palabras clave - ${groupFilter}`;

        return matchesPhase && matchesSearch && matchesGroup;
      }),
    [groupFilter, normalizedQuery, phase],
  );

  function selectPhase(nextPhase: DictionaryPhase) {
    setPhase(nextPhase);
    setGroupFilter("all");
  }

  async function playKorean(id: string, text: string) {
    const request = ++speechRequest.current;
    setSpeechEntryId(id);
    setSpeechResult({ ok: true, source: "none", message: "Preparando audio..." });
    const result = await speakKorean(text);
    if (request === speechRequest.current) setSpeechResult(result);
  }

  return (
    <section className="min-w-0 max-w-full overflow-hidden space-y-4">
      <div className="min-w-0">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Coreano - Espanol</p>
        <h2 className="mt-1 text-3xl font-black uppercase">Diccionario tecnico</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/62">
          Empieza por las palabras base: defensa, ataque, puno, alto, bajo, giro. Luego las tecnicas largas dejan de parecer un bloque raro.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-2 gap-2">
        <button
          className={`tap-target rounded border px-3 py-3 font-black uppercase ${
            phase === "keywords"
              ? "border-combat-red bg-combat-red text-white shadow-glow"
              : "border-white/10 bg-white/[0.04] text-white/75"
          }`}
          onClick={() => selectPhase("keywords")}
          type="button"
        >
          Palabras clave
        </button>
        <button
          className={`tap-target rounded border px-3 py-3 font-black uppercase ${
            phase === "techniques"
              ? "border-combat-red bg-combat-red text-white shadow-glow"
              : "border-white/10 bg-white/[0.04] text-white/75"
          }`}
          onClick={() => selectPhase("techniques")}
          type="button"
        >
          Tecnicas
        </button>
      </div>

      {phase === "keywords" && (
        <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
          <button
            className={`tap-target shrink-0 rounded border px-3 py-2 text-xs font-black uppercase ${
              groupFilter === "all"
                ? "border-combat-red bg-combat-red text-white"
                : "border-white/10 bg-white/[0.04] text-white/72"
            }`}
            onClick={() => setGroupFilter("all")}
            type="button"
          >
            Todo
          </button>
          {keyTermGroups.map((group) => (
            <button
              key={group.id}
              className={`tap-target shrink-0 rounded border px-3 py-2 text-xs font-black uppercase ${
                groupFilter === group.id
                  ? "border-combat-red bg-combat-red text-white"
                  : "border-white/10 bg-white/[0.04] text-white/72"
              }`}
              onClick={() => setGroupFilter(group.id)}
              type="button"
            >
              {group.label}
            </button>
          ))}
        </div>
      )}

      <label className="flex min-w-0 items-center gap-3 rounded border border-white/10 bg-combat-panel px-4 py-3">
        <Search className="text-combat-red" size={22} aria-hidden />
        <input
          className="min-w-0 w-full bg-transparent text-base font-semibold text-white placeholder:text-white/35"
          placeholder={phase === "keywords" ? "Buscar defensa, giro, alto..." : "Buscar tecnica, bloque o significado"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {results.map((entry) => (
          <article key={entry.id} className="min-w-0 rounded border border-white/10 bg-white/[0.04] p-4">
            <div className="flex min-w-0 flex-col gap-3">
              <div className="min-w-0">
                <h3 className="break-words text-xl font-black">{entry.korean}</h3>
                {entry.speech && <p className="mt-1 text-lg font-black text-combat-red">{entry.speech}</p>}
                <p className="mt-1 break-words text-white/75">{entry.spanish}</p>
              </div>
              <div className="grid gap-2 min-[420px]:grid-cols-[auto_1fr] min-[420px]:items-center">
                <button
                  aria-label={`Reproducir ${entry.korean}`}
                  className="tap-target flex w-full items-center justify-center gap-2 rounded border border-combat-red/45 bg-combat-red/15 px-3 py-3 font-black uppercase text-red-100 min-[420px]:w-auto"
                  onClick={() => void playKorean(entry.id, entry.speech ?? entry.korean)}
                  type="button"
                >
                  <Volume2 size={20} aria-hidden />
                  <span>Escuchar</span>
                </button>
                <span className="min-w-0 break-words rounded bg-combat-red/20 px-2 py-2 text-center text-xs font-black uppercase text-red-100">
                  {entry.category}
                </span>
              </div>
              {speechEntryId === entry.id && speechResult && (
                <p role="status" className={`break-words text-sm ${speechResult.ok ? "text-white/70" : "text-red-200"}`}>
                  {speechResult.message}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
