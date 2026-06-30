import { Search, Volume2 } from "lucide-react";
import { useMemo, useState } from "react";
import { dictionary } from "../data/dictionary";
import { speakKorean } from "../utils/speech";

type DictionaryPhase = "keywords" | "techniques";

export function Dictionary() {
  const [query, setQuery] = useState("");
  const [phase, setPhase] = useState<DictionaryPhase>("keywords");
  const normalizedQuery = query.trim().toLowerCase();

  const results = useMemo(
    () =>
      dictionary.filter((entry) => {
        const text = `${entry.korean} ${entry.spanish} ${entry.category}`.toLowerCase();
        return entry.phase === phase && text.includes(normalizedQuery);
      }),
    [normalizedQuery, phase],
  );

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Coreano - Espanol</p>
        <h2 className="mt-1 text-3xl font-black uppercase">Diccionario tecnico</h2>
        <p className="mt-2 max-w-2xl text-sm text-white/62">
          Empieza por las palabras base: defensa, ataque, puno, alto, bajo, giro. Luego las tecnicas largas dejan de parecer un bloque raro.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className={`tap-target rounded border px-3 py-3 font-black uppercase ${
            phase === "keywords"
              ? "border-combat-red bg-combat-red text-white shadow-glow"
              : "border-white/10 bg-white/[0.04] text-white/75"
          }`}
          onClick={() => setPhase("keywords")}
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
          onClick={() => setPhase("techniques")}
          type="button"
        >
          Tecnicas
        </button>
      </div>

      <label className="flex items-center gap-3 rounded border border-white/10 bg-combat-panel px-4 py-3">
        <Search className="text-combat-red" size={22} aria-hidden />
        <input
          className="w-full bg-transparent text-base font-semibold text-white placeholder:text-white/35"
          placeholder={phase === "keywords" ? "Buscar defensa, giro, alto..." : "Buscar tecnica, bloque o significado"}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {results.map((entry) => (
          <article key={entry.id} className="rounded border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black">{entry.korean}</h3>
                <p className="mt-1 text-white/75">{entry.spanish}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  aria-label={`Reproducir ${entry.korean}`}
                  className="tap-target grid w-12 place-items-center rounded border border-combat-red/45 bg-combat-red/15 text-red-100"
                  onClick={() => speakKorean(entry.korean)}
                  type="button"
                >
                  <Volume2 size={20} aria-hidden />
                </button>
                <span className="rounded bg-combat-red/20 px-2 py-1 text-xs font-black uppercase text-red-100">
                  {entry.category}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
