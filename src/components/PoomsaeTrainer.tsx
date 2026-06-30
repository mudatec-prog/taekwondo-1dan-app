import { CheckCircle2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { poomsaeLibrary, type Poomsae, type PoomsaeStep, type StudyMode } from "../data/poomsaeData";

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
                <h3 className="font-black uppercase text-combat-red">Mapa de recorrido</h3>
                <p className="text-sm text-white/55">Vista superior: posicion, direccion y orientacion.</p>
              </div>
              <button
                className="tap-target rounded border border-white/15 px-3 py-2 text-sm font-black uppercase text-white"
                onClick={() => setStepIndex(0)}
                type="button"
              >
                <RotateCcw className="inline" size={16} aria-hidden /> Inicio
              </button>
            </div>

            <div className="mt-4 aspect-square w-full rounded border border-white/10 bg-combat-black p-3">
              <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-2">
                {Array.from({ length: gridSize * gridSize }).map((_, cellIndex) => {
                  const x = (cellIndex % gridSize) - 2;
                  const y = 4 - Math.floor(cellIndex / gridSize);
                  const stepsHere = activePath.filter((step) => step.x === x && step.y === y);
                  const lastStep = stepsHere[stepsHere.length - 1];
                  const isCurrent = currentStep.x === x && currentStep.y === y;
                  const isStart = x === 0 && y === 0;

                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`relative grid place-items-center rounded border text-xs font-black ${
                        isCurrent
                          ? "border-combat-red bg-combat-red text-white shadow-glow"
                          : stepsHere.length
                            ? "border-white/35 bg-white/12 text-white"
                            : isStart
                              ? "border-white/20 bg-white/[0.06] text-white/45"
                              : "border-white/5 bg-white/[0.025] text-white/20"
                      }`}
                    >
                      {isStart && !lastStep && <span>START</span>}
                      {lastStep && <StepMarker step={lastStep} isCurrent={isCurrent} />}
                    </div>
                  );
                })}
              </div>
            </div>

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

function StepMarker({ step, isCurrent }: { step: PoomsaeStep; isCurrent: boolean }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <span className={isCurrent ? "text-[0.65rem]" : "text-[0.6rem]"}>{step.orientationDegrees}deg</span>
      <span className="mt-1 text-sm">{step.number}</span>
    </div>
  );
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
