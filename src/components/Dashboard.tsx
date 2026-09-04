import { Award, BookOpen, CheckCircle2, ClipboardCheck, Download, Dumbbell, Layers, Map, RotateCcw, Search, Siren, Target } from "lucide-react";
import { checklistItems, syllabusBlocks } from "../data/examData";
import type { FlashcardStatus } from "../hooks/useLocalProgress";

type DashboardProps = {
  flashcards: Record<string, FlashcardStatus>;
  checklist: Record<string, boolean>;
  onStartDictionary: () => void;
  onStartFlashcards: () => void;
  onStartPoomsae: () => void;
  onStartExam: () => void;
  onOpenSyllabus: () => void;
  onOpenTribunal: () => void;
  onOpenChecklist: () => void;
};

export function Dashboard({
  flashcards,
  checklist,
  onStartDictionary,
  onStartFlashcards,
  onStartPoomsae,
  onStartExam,
  onOpenSyllabus,
  onOpenTribunal,
  onOpenChecklist,
}: DashboardProps) {
  const totalTerms = syllabusBlocks.reduce((sum, block) => sum + block.items.length, 0);
  const knownTerms = Object.values(flashcards).filter((status) => status === "known").length;
  const reviewedTerms = Object.keys(flashcards).length;
  const checklistDone = Object.values(checklist).filter(Boolean).length;
  const completion = Math.round(((knownTerms + checklistDone) / (totalTerms + checklistItems.length)) * 100);
  const today = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const blockProgress = syllabusBlocks.map((block) => {
    const known = block.items.filter((item) => flashcards[item.id] === "known").length;
    const percentage = Math.round((known / block.items.length) * 100);
    return { ...block, percentage };
  });

  return (
    <section className="space-y-5">
      <div className="text-sm font-bold capitalize text-white/55">{today}</div>

      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 text-[0.68rem] font-black uppercase tracking-[0.1em] text-white/48">
        <span>Coreano</span>
        <i className="h-px bg-white/12" />
        <span>{knownTerms}/{totalTerms}</span>
      </div>

      <article className="rounded border border-combat-red/35 bg-combat-panel p-5 shadow-glow sm:p-7">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-combat-red">Plan de hoy</p>
        <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-5xl">Entiende al tribunal</h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-white/72">
          Primero palabras clave, luego posiciones y despues tecnica. La app debe llevarte rapido de "que ha dicho" a "que ejecuto".
        </p>
        <button
          className="tap-target mt-6 flex w-full items-center justify-center gap-2 rounded bg-combat-red px-5 py-4 text-base font-black uppercase text-white shadow-glow"
          onClick={onStartDictionary}
          type="button"
        >
          <Search size={20} aria-hidden /> Empezar por coreano
        </button>
      </article>

      <div className="grid gap-3 sm:grid-cols-3">
        <ActionCard
          icon={Layers}
          label="Practica"
          title="Flashcards"
          text={`${reviewedTerms}/${totalTerms} revisadas`}
          onClick={onStartFlashcards}
        />
        <ActionCard
          icon={Map}
          label="Forma"
          title="Poomsae"
          text="Il Chang cargado"
          onClick={onStartPoomsae}
        />
        <ActionCard
          icon={Dumbbell}
          label="Simulacro"
          title="Examen"
          text="Sorteo oficial"
          onClick={onStartExam}
        />
      </div>

      <div className="rounded border border-white/10 bg-white/[0.04] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-white/45">Progreso general</p>
            <p className="mt-1 text-3xl font-black">{completion}%</p>
          </div>
          <Target className="text-combat-red" size={34} aria-hidden />
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded bg-white/10">
          <div className="h-full bg-combat-red" style={{ width: `${completion}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <MiniMetric icon={CheckCircle2} label="Domino" value={`${knownTerms}/${totalTerms}`} />
        <MiniMetric icon={RotateCcw} label="Repaso" value={`${reviewedTerms}/${totalTerms}`} />
        <MiniMetric icon={Award} label="Tecnica" value={`${checklistDone}/${checklistItems.length}`} />
      </div>

      <details className="overflow-hidden rounded border border-white/10 bg-white/[0.04]">
        <summary className="tap-target flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 marker:hidden">
          <span>
            <span className="block text-xs font-black uppercase tracking-[0.16em] text-combat-red">Mapa del examen</span>
            <span className="mt-1 block text-lg font-black uppercase">Bloques del temario</span>
          </span>
          <BookOpen className="shrink-0 text-combat-red" size={22} aria-hidden />
        </summary>
        <div className="grid gap-3 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
          {blockProgress.map((block) => (
            <article key={block.id} className="rounded border border-white/10 bg-combat-black/45 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-black uppercase">{block.title}</h3>
                  <p className="text-sm text-white/60">{block.subtitle}</p>
                </div>
                <span className="rounded bg-white/10 px-2 py-1 text-sm font-black">{block.percentage}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded bg-white/10">
                <div className="h-full bg-combat-red" style={{ width: `${block.percentage}%` }} />
              </div>
            </article>
          ))}
        </div>
      </details>

      <div className="grid gap-2 sm:grid-cols-3">
        <SecondaryAction icon={BookOpen} label="Temario completo" onClick={onOpenSyllabus} />
        <SecondaryAction icon={Siren} label="Modo tribunal" onClick={onOpenTribunal} />
        <SecondaryAction icon={ClipboardCheck} label="Checklist tecnico" onClick={onOpenChecklist} />
      </div>

      <a
        className="tap-target flex items-center justify-between gap-3 rounded border border-combat-red/35 bg-combat-red/10 px-4 py-3 text-left text-sm font-black uppercase text-red-100"
        download
        href="/downloads/taekwondo-1dan-0.1.0-debug.apk"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Download className="shrink-0 text-combat-red" size={18} aria-hidden />
          <span className="truncate">Descargar app Android</span>
        </span>
        <span className="text-combat-red">APK</span>
      </a>
    </section>
  );
}

function ActionCard({
  icon: Icon,
  label,
  title,
  text,
  onClick,
}: {
  icon: typeof Target;
  label: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      className="tap-target rounded border border-white/10 bg-white/[0.04] p-4 text-left transition hover:border-combat-red/40"
      onClick={onClick}
      type="button"
    >
      <span className="grid h-10 w-10 place-items-center rounded bg-combat-red/15 text-combat-red">
        <Icon size={22} aria-hidden />
      </span>
      <span className="mt-4 block text-xs font-black uppercase tracking-[0.16em] text-combat-red">{label}</span>
      <span className="mt-1 block text-xl font-black uppercase">{title}</span>
      <span className="mt-1 block text-sm font-bold text-white/55">{text}</span>
    </button>
  );
}

function MiniMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded border border-white/10 bg-combat-panel p-3 text-center">
      <Icon className="mx-auto text-combat-red" size={20} aria-hidden />
      <p className="mt-2 text-[0.65rem] font-black uppercase text-white/45">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </article>
  );
}

function SecondaryAction({ icon: Icon, label, onClick }: { icon: typeof Target; label: string; onClick: () => void }) {
  return (
    <button
      className="tap-target flex items-center justify-between gap-3 rounded border border-white/10 bg-combat-panel px-4 py-3 text-left text-sm font-black uppercase text-white/78"
      onClick={onClick}
      type="button"
    >
      <span className="flex min-w-0 items-center gap-3">
        <Icon className="shrink-0 text-combat-red" size={18} aria-hidden />
        <span className="truncate">{label}</span>
      </span>
      <span className="text-combat-red">+</span>
    </button>
  );
}
