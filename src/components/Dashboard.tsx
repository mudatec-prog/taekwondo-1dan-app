import { Award, CheckCircle2, RotateCcw, Target } from "lucide-react";
import { checklistItems, syllabusBlocks } from "../data/examData";
import type { FlashcardStatus } from "../hooks/useLocalProgress";

type DashboardProps = {
  flashcards: Record<string, FlashcardStatus>;
  checklist: Record<string, boolean>;
  onStartFlashcards: () => void;
  onStartExam: () => void;
};

export function Dashboard({ flashcards, checklist, onStartFlashcards, onStartExam }: DashboardProps) {
  const totalTerms = syllabusBlocks.reduce((sum, block) => sum + block.items.length, 0);
  const knownTerms = Object.values(flashcards).filter((status) => status === "known").length;
  const reviewedTerms = Object.keys(flashcards).length;
  const checklistDone = Object.values(checklist).filter(Boolean).length;
  const completion = Math.round(((knownTerms + checklistDone) / (totalTerms + checklistItems.length)) * 100);

  return (
    <section className="space-y-5">
      <div className="rounded border border-white/10 bg-combat-panel p-5 shadow-glow sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Preparacion integral</p>
            <h2 className="mt-2 text-4xl font-black uppercase sm:text-5xl">Rumbo al negro</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-white/72">
              Prioriza el coreano: escucha el termino, reconoce la tecnica y responde como en tribunal.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="tap-target rounded bg-combat-red px-4 py-3 font-black uppercase text-white shadow-glow"
              onClick={onStartExam}
              type="button"
            >
              Simular
            </button>
            <button
              className="tap-target rounded border border-white/15 px-4 py-3 font-black uppercase text-white"
              onClick={onStartFlashcards}
              type="button"
            >
              Coreano
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric icon={Target} label="Progreso general" value={`${completion}%`} />
        <Metric icon={CheckCircle2} label="Terminos dominados" value={`${knownTerms}/${totalTerms}`} />
        <Metric icon={RotateCcw} label="Tarjetas revisadas" value={`${reviewedTerms}/${totalTerms}`} />
        <Metric icon={Award} label="Checklist tecnico" value={`${checklistDone}/${checklistItems.length}`} />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {syllabusBlocks.map((block) => {
          const known = block.items.filter((item) => flashcards[item.id] === "known").length;
          const percentage = Math.round((known / block.items.length) * 100);
          return (
            <article key={block.id} className="rounded border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black uppercase">{block.title}</h3>
                  <p className="text-sm text-white/60">{block.subtitle}</p>
                </div>
                <span className="rounded bg-white/10 px-2 py-1 text-sm font-black">{percentage}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded bg-white/10">
                <div className="h-full bg-combat-red" style={{ width: `${percentage}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded border border-white/10 bg-combat-panel p-4">
      <Icon className="text-combat-red" size={24} aria-hidden />
      <p className="mt-4 text-sm font-bold uppercase text-white/55">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </article>
  );
}
