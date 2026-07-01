import { CheckCircle2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { poomsaeLibrary, type Poomsae, type PoomsaeStep, type StudyMode } from "../data/poomsaeData";
import { getTechniqueVisual, type TechniqueVisual } from "../data/techniqueVisuals";

type PoomsaeTrainerProps = {
  masteredSteps: Record<string, Record<string, boolean>>;
  onToggleStep: (poomsaeId: string, stepId: string) => void;
};

const studyModes: Array<{ id: StudyMode; label: string }> = [
  { id: "coreano", label: "Coreano" },
  { id: "traduccion", label: "Traduccion" },
  { id: "correccion", label: "Correccion tecnica" },
  { id: "memoria", label: "Memoria" },
];

const gridSize = 5;
const poomsaeStanceVisualMap: Record<string, string> = {
  "Ap Seogi": "ap-sogui",
  "Ap Sogui": "ap-sogui",
  "Ap Kubi": "ap-kubi-sogui",
  "Ap Kubi Sogui": "ap-kubi-sogui",
  "Chuchum Sogui": "chuchum-sogui",
  "Tuit Kubi": "tuit-kubi-sogui",
  "Tuit Kubi Sogui": "tuit-kubi-sogui",
  "Bom Sogui": "bom-sogui",
  "Moa Sogui": "moa-sogui",
  "Naranji Sogui": "naranji-sogui",
  "Pionji Sogui": "pionji-sogui",
  "Charyot Sogui": "charyot-sogui",
};

export function PoomsaeTrainer({ masteredSteps, onToggleStep }: PoomsaeTrainerProps) {
  const [selectedPoomsaeId, setSelectedPoomsaeId] = useState(poomsaeLibrary[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [studyMode, setStudyMode] = useState<StudyMode>("coreano");

  const poomsae = poomsaeLibrary.find((item) => item.id === selectedPoomsaeId) ?? poomsaeLibrary[0];
  const currentStep = poomsae.steps[stepIndex];
  const poomsaeProgress = getPoomsaeProgress(poomsae, masteredSteps[poomsae.id] ?? {});
  const activePath = useMemo(() => poomsae.steps.slice(0, stepIndex + 1), [poomsae.steps, stepIndex]);

  function selectPoomsae(id: string) {
    setSelectedPoomsaeId(id);
    setStepIndex(0);
  }

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, poomsae.steps.length - 1));
  }

  function goPrevious() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function resetAnimation() {
    setStepIndex(0);
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Poomsae visual</p>
          <h2 className="mt-1 text-3xl font-black uppercase">{poomsae.korean}</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/62">{poomsae.meaning}</p>
        </div>
        <div className="rounded border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-black uppercase text-white/70">
          {poomsae.steps.length ? `${stepIndex + 1}/${poomsae.totalMovements}` : "Pendiente"}
        </div>
      </div>

      <div className="rounded border border-white/10 bg-combat-panel p-3">
        <label className="text-xs font-black uppercase text-white/50" htmlFor="poomsae-selector">
          Seleccionar poomsae
        </label>
        <select
          id="poomsae-selector"
          className="tap-target mt-2 w-full rounded border border-white/10 bg-combat-black px-3 py-3 font-black uppercase text-white"
          value={selectedPoomsaeId}
          onChange={(event) => selectPoomsae(event.target.value)}
        >
          {poomsaeLibrary.map((item) => (
            <option key={item.id} value={item.id}>
              {item.korean}
            </option>
          ))}
        </select>
      </div>

      <PoomsaeSummary poomsae={poomsae} mastered={poomsaeProgress.mastered} pending={poomsaeProgress.pending} percent={poomsaeProgress.percent} />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {studyModes.map((mode) => (
          <button
            key={mode.id}
            className={`tap-target rounded border px-3 py-3 text-sm font-black uppercase ${
              studyMode === mode.id
                ? "border-combat-red bg-combat-red text-white shadow-glow"
                : "border-white/10 bg-white/[0.04] text-white/75"
            }`}
            onClick={() => setStudyMode(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>

      {currentStep ? (
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded border border-white/10 bg-combat-panel p-4 shadow-glow">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-black uppercase text-combat-red">Lamina de recorrido</h3>
                <p className="text-sm text-white/55">Lineas del poomsae, movimiento activo y retorno al inicio.</p>
              </div>
              <button
                className="tap-target rounded border border-white/15 px-3 py-2 text-sm font-black uppercase text-white"
                onClick={resetAnimation}
                type="button"
              >
                <RotateCcw className="inline" size={16} aria-hidden /> Inicio
              </button>
            </div>

            <PoomsaeDiagram poomsae={poomsae} currentStep={currentStep} activePath={activePath} />

            <div className="mt-4 h-2 overflow-hidden rounded bg-white/10">
              <div className="h-full bg-combat-red" style={{ width: `${((stepIndex + 1) / poomsae.steps.length) * 100}%` }} />
            </div>
          </article>

          <article className="rounded border border-white/10 bg-combat-panel p-5 shadow-glow">
            <MovementCard
              mode={studyMode}
              poomsaeId={poomsae.id}
              step={currentStep}
              isMastered={Boolean(masteredSteps[poomsae.id]?.[currentStep.id])}
              onToggleStep={onToggleStep}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                className="tap-target rounded border border-white/15 px-4 py-3 font-black uppercase text-white disabled:opacity-40"
                disabled={stepIndex === 0}
                onClick={goPrevious}
                type="button"
              >
                <ChevronLeft className="inline" size={18} aria-hidden /> Anterior
              </button>
              <button
                className="tap-target rounded bg-combat-red px-4 py-3 font-black uppercase text-white shadow-glow disabled:opacity-40"
                disabled={stepIndex === poomsae.steps.length - 1}
                onClick={goNext}
                type="button"
              >
                Siguiente <ChevronRight className="inline" size={18} aria-hidden />
              </button>
            </div>

            <p className="mt-4 text-xs leading-5 text-white/42">{poomsae.sourceNote}</p>
          </article>
        </div>
      ) : (
        <article className="rounded border border-white/10 bg-combat-panel p-6 text-center shadow-glow">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Estructura preparada</p>
          <h3 className="mt-2 text-2xl font-black uppercase">{poomsae.korean}</h3>
          <p className="mx-auto mt-3 max-w-xl text-white/62">
            Este poomsae ya existe en la base de datos, pero aun no tiene movimientos. Puedes introducirlos usando el mismo formato de Taeguk Il Chang.
          </p>
        </article>
      )}
    </section>
  );
}

function MovementCard({
  mode,
  poomsaeId,
  step,
  isMastered,
  onToggleStep,
}: {
  mode: StudyMode;
  poomsaeId: string;
  step: PoomsaeStep;
  isMastered: boolean;
  onToggleStep: (poomsaeId: string, stepId: string) => void;
}) {
  const isMemory = mode === "memoria";
  const stanceVisual = getStanceVisual(step.stance);

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-combat-red">Movimiento {step.number}</p>
          <h3 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{step.korean}</h3>
        </div>
        <OrientationBadge degrees={step.orientationDegrees} />
      </div>

      <div className="mt-4 rounded border border-white/10 bg-combat-black p-5">
        {isMemory ? (
          <div className="space-y-3">
            <Info label="Numero" value={String(step.number)} />
            <Info label="Direccion" value={step.direction} />
            <Info label="Coreano" value={step.korean} highlight />
          </div>
        ) : (
          <div className="space-y-3">
            {stanceVisual && <StanceVisualCard visual={stanceVisual} stance={step.stance} />}
            {(mode === "coreano" || mode === "traduccion") && (
              <>
                <Info label="Coreano" value={step.korean} highlight={mode === "coreano"} />
                <Info label="Traduccion" value={step.spanish} highlight={mode === "traduccion"} />
              </>
            )}
            {mode === "correccion" && (
              <>
                <Info label="Correccion tecnica" value={step.notes} highlight />
                <Info label="Trabajo de pies" value={step.footwork} />
              </>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Sogui" value={step.stance} />
              <Info label="Tecnica" value={step.technique} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Direccion" value={step.direction} />
              <Info label="Orientacion" value={`${step.orientationDegrees} deg`} />
            </div>
            {step.kihap && <Info label="Clave" value="Kihap" highlight />}
          </div>
        )}
      </div>

      <button
        className={`tap-target mt-4 w-full rounded border px-4 py-3 font-black uppercase ${
          isMastered
            ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
            : "border-white/15 bg-white/[0.04] text-white"
        }`}
        onClick={() => onToggleStep(poomsaeId, step.id)}
        type="button"
      >
        <CheckCircle2 className="inline" size={18} aria-hidden />{" "}
        {isMastered ? "Movimiento dominado" : "Marcar movimiento como dominado"}
      </button>
    </div>
  );
}

function StanceVisualCard({ visual, stance }: { visual: TechniqueVisual; stance: string }) {
  return (
    <div className="overflow-hidden rounded border border-white/10 bg-white/[0.04]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
        <div>
          <p className="text-xs font-bold uppercase text-white/45">Posicion del movimiento</p>
          <p className="mt-1 text-sm font-black uppercase text-white">{stance}</p>
        </div>
        <span className="rounded border border-combat-red/40 bg-combat-red/15 px-2 py-1 text-[0.65rem] font-black uppercase text-white">
          Sogui
        </span>
      </div>
      <div className="grid gap-0 sm:grid-cols-[0.78fr_1fr]">
        <div className="aspect-[4/5] bg-combat-black sm:aspect-auto">
          <img className="h-full w-full object-cover object-top" src={visual.imageUrl} alt={visual.title} loading="lazy" />
        </div>
        <div className="space-y-2 p-3">
          <p className="text-lg font-black uppercase text-white">{visual.title}</p>
          <p className="text-sm font-bold text-white/62">{visual.subtitle}</p>
          <div className="grid gap-2">
            {visual.cues.slice(0, 3).map((cue) => (
              <p key={cue} className="rounded border border-white/10 bg-combat-black px-2 py-2 text-xs font-bold text-white/62">
                {cue}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PoomsaeSummary({
  poomsae,
  mastered,
  pending,
  percent,
}: {
  poomsae: Poomsae;
  mastered: number;
  pending: number;
  percent: number;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SummaryMetric label="Dominados" value={`${mastered}`} />
      <SummaryMetric label="Pendientes" value={`${pending}`} />
      <SummaryMetric label="Progreso" value={`${percent}%`} />
      <div className="sm:col-span-3">
        <div className="h-2 overflow-hidden rounded bg-white/10">
          <div className="h-full bg-combat-red" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-xs font-bold uppercase text-white/40">
          {poomsae.steps.length ? `${poomsae.steps.length} movimientos cargados` : "Sin movimientos cargados todavia"}
        </p>
      </div>
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-white/10 bg-combat-panel p-4">
      <p className="text-xs font-bold uppercase text-white/50">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function PoomsaeDiagram({
  poomsae,
  currentStep,
  activePath,
}: {
  poomsae: Poomsae;
  currentStep: PoomsaeStep;
  activePath: PoomsaeStep[];
}) {
  const viewBox = 360;
  const pathPoints = activePath.map((step) => toSvgPoint(step, viewBox));
  const currentPoint = toSvgPoint(currentStep, viewBox);
  const pathValue = pathPoints.map((point) => `${point.x},${point.y}`).join(" ");
  const completedIds = new Set(activePath.map((step) => step.id));
  const groupedSteps = groupStepsByPosition(poomsae.steps);
  const isBackAtStart = currentStep.x === 0 && currentStep.y === 0 && currentStep.number === poomsae.totalMovements;

  return (
    <div className="mt-4 overflow-hidden rounded border border-white/10 bg-combat-black">
      <div className="relative aspect-square w-full">
        <svg className="h-full w-full" viewBox={`0 0 ${viewBox} ${viewBox}`} role="img" aria-label={`Lamina de recorrido ${poomsae.korean}`}>
          <defs>
            <pattern id="poomsae-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </pattern>
            <filter id="diagram-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#ef233c" floodOpacity="0.7" />
            </filter>
          </defs>

          <rect width={viewBox} height={viewBox} fill="url(#poomsae-grid)" />
          <path d="M 60 276 H 300 M 60 180 H 300 M 60 84 H 300 M 180 276 V 84" stroke="rgba(255,255,255,0.22)" strokeLinecap="round" strokeWidth="10" />
          <path d="M 60 276 H 300 M 60 180 H 300 M 60 84 H 300 M 180 276 V 84" stroke="rgba(17,18,23,0.82)" strokeLinecap="round" strokeWidth="6" />

          {pathPoints.length > 1 && (
            <polyline
              points={pathValue}
              fill="none"
              stroke="#ef233c"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="6"
              opacity="0.86"
            />
          )}

          {groupedSteps.map((group) => {
            const point = toSvgPoint(group[0], viewBox);
            const isDone = group.some((step) => completedIds.has(step.id));
            const isCurrent = group.some((step) => step.id === currentStep.id);
            const label = group.map((step) => step.number).join("/");

            return (
              <g key={`${group[0].x}-${group[0].y}`}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isCurrent ? 19 : group.length > 1 ? 16 : 13}
                  fill={isCurrent ? "#ef233c" : isDone ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.14)"}
                  stroke={isCurrent ? "white" : "rgba(255,255,255,0.22)"}
                  strokeWidth={isCurrent ? "3" : "2"}
                  filter={isCurrent ? "url(#diagram-glow)" : undefined}
                />
                <text
                  x={point.x}
                  y={point.y + 4}
                  textAnchor="middle"
                  className={`text-[10px] font-black ${isCurrent || isDone ? "fill-combat-black" : "fill-white/55"}`}
                >
                  {label}
                </text>
              </g>
            );
          })}

          <g style={{ transform: `translate(${currentPoint.x}px, ${currentPoint.y}px)`, transition: "transform 300ms ease" }}>
            <path
              d={directionArrowPath(currentStep.orientationDegrees)}
              fill="none"
              stroke="white"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
            />
          </g>

          <circle cx="180" cy="276" r="24" fill="none" stroke={isBackAtStart ? "#34d399" : "rgba(255,255,255,0.28)"} strokeDasharray="4 4" strokeWidth="2" />
          <text x="180" y="315" textAnchor="middle" className={isBackAtStart ? "fill-emerald-300 text-[10px] font-black uppercase" : "fill-white/35 text-[10px] font-black uppercase"}>
            Punto inicial
          </text>

          <text x="180" y="31" textAnchor="middle" className="fill-white/40 text-[10px] font-black uppercase">
            Frente
          </text>
        </svg>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase text-white/45">Movimiento en la lamina</p>
            <p className="mt-1 text-base font-black uppercase text-white">{currentStep.korean}</p>
          </div>
          <span className="rounded border border-combat-red bg-combat-red/15 px-3 py-2 text-sm font-black text-white">
            {currentStep.orientationDegrees} deg
          </span>
        </div>
        <p className="mt-2 text-sm font-bold text-white/60">{currentStep.footwork}</p>
        {isBackAtStart && (
          <p className="mt-2 rounded border border-emerald-400/35 bg-emerald-400/10 px-3 py-2 text-sm font-black uppercase text-emerald-100">
            Cierra en el punto inicial
          </p>
        )}
      </div>
    </div>
  );
}

function toSvgPoint(step: PoomsaeStep, viewBox: number) {
  const safeX = step.x ?? 0;
  const safeY = step.y ?? 0;
  const stepSize = viewBox / (gridSize + 1.2);

  return {
    x: viewBox / 2 + safeX * stepSize,
    y: viewBox - 84 - safeY * stepSize,
  };
}

function groupStepsByPosition(steps: PoomsaeStep[]) {
  const groups = new Map<string, PoomsaeStep[]>();

  steps.forEach((step) => {
    const key = `${step.x ?? 0}:${step.y ?? 0}`;
    groups.set(key, [...(groups.get(key) ?? []), step]);
  });

  return Array.from(groups.values());
}

function directionArrowPath(degrees: number) {
  if (degrees === 90) {
    return "M -5 -12 L 12 0 L -5 12 M 12 0 H -18";
  }

  if (degrees === 180) {
    return "M -12 -5 L 0 12 L 12 -5 M 0 12 V -18";
  }

  if (degrees === 270) {
    return "M 5 -12 L -12 0 L 5 12 M -12 0 H 18";
  }

  return "M -12 5 L 0 -12 L 12 5 M 0 -12 V 18";
}

function getStanceVisual(stance: string) {
  const visualId = poomsaeStanceVisualMap[stance];

  return visualId ? getTechniqueVisual(visualId) : undefined;
}

function OrientationBadge({ degrees }: { degrees: number }) {
  return (
    <span className="grid h-14 w-14 shrink-0 place-items-center rounded border border-combat-red bg-combat-red/20 text-sm font-black text-white">
      {degrees}deg
    </span>
  );
}

function Info({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded border p-3 ${highlight ? "border-combat-red bg-combat-red/15" : "border-white/10 bg-white/[0.04]"}`}>
      <p className="text-xs font-bold uppercase text-white/45">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}

function getPoomsaeProgress(poomsae: Poomsae, masteredMap: Record<string, boolean>) {
  const total = poomsae.steps.length;
  const mastered = poomsae.steps.filter((step) => masteredMap[step.id]).length;
  const pending = Math.max(total - mastered, 0);
  const percent = total ? Math.round((mastered / total) * 100) : 0;

  return { mastered, pending, percent };
}
