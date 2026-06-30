import { Shuffle } from "lucide-react";
import { useMemo, useState } from "react";
import {
  examRules,
  ownCombinationRequirements,
  syllabusBlocks,
  type CategoryId,
  type Technique,
} from "../data/examData";

type ExamSection = {
  label: string;
  items: Technique[];
};

function pickRandom(items: Technique[], count: number): Technique[] {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

function getItems(category: CategoryId) {
  return syllabusBlocks.find((block) => block.id === category)?.items ?? [];
}

function buildExam(): ExamSection[] {
  const randomTaeguk = pickRandom(getItems("poomsae").filter((item) => item.id !== "taeguk-8"), 1);
  const taeguk8 = getItems("poomsae").filter((item) => item.id === "taeguk-8");

  return [
    ...examRules.map((rule) => ({
      label: rule.label,
      items: pickRandom(getItems(rule.category), rule.count),
    })),
    { label: "Poomsae aleatorio", items: randomTaeguk },
    { label: "Poomsae obligatorio", items: taeguk8 },
  ];
}

export function ExamSimulator() {
  const [seed, setSeed] = useState(0);
  const exam = useMemo(() => buildExam(), [seed]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Simulacro real</p>
          <h2 className="mt-1 text-3xl font-black uppercase">Simulador de examen</h2>
        </div>
        <button
          className="tap-target rounded bg-combat-red px-4 py-3 font-black uppercase text-white shadow-glow"
          onClick={() => setSeed((current) => current + 1)}
          type="button"
        >
          <Shuffle className="inline" size={18} aria-hidden /> Nuevo examen
        </button>
      </div>

      <div className="grid gap-3">
        {exam.map((section) => (
          <article key={section.label} className="rounded border border-white/10 bg-combat-panel p-4">
            <h3 className="font-black uppercase text-combat-red">{section.label}</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <div key={item.id} className="rounded border border-white/10 bg-white/[0.04] p-3">
                  <p className="text-lg font-black">{item.korean}</p>
                  <p className="mt-1 text-sm text-white/65">{item.spanish}</p>
                </div>
              ))}
            </div>
          </article>
        ))}

        <article className="rounded border border-combat-red/35 bg-combat-red/10 p-4">
          <h3 className="font-black uppercase text-red-100">Combinacion propia tipo Poomsae</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ownCombinationRequirements.map((requirement) => (
              <div key={requirement} className="rounded border border-white/10 bg-combat-black/50 p-3 text-sm font-bold text-white/80">
                {requirement}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
