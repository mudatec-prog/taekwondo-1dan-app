import { Image, X } from "lucide-react";
import { useState } from "react";
import type { SyllabusBlock as SyllabusBlockType } from "../data/examData";
import { getTechniqueVisual, type TechniqueVisual } from "../data/techniqueVisuals";
import type { FlashcardStatus } from "../hooks/useLocalProgress";

type SyllabusBlockProps = {
  blocks: SyllabusBlockType[];
  flashcards: Record<string, FlashcardStatus>;
};

export function SyllabusBlock({ blocks, flashcards }: SyllabusBlockProps) {
  const [selectedVisual, setSelectedVisual] = useState<TechniqueVisual | null>(null);

  return (
    <section className="space-y-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Programa oficial</p>
        <h2 className="mt-1 text-3xl font-black uppercase">Temario por bloques</h2>
      </div>

      <div className="space-y-4">
        {blocks.map((block) => (
          <article key={block.id} className="rounded border border-white/10 bg-combat-panel p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black uppercase">{block.title}</h3>
                <p className="text-white/60">{block.subtitle}</p>
                {block.examMode && <p className="mt-2 max-w-2xl text-sm text-white/58">{block.examMode}</p>}
              </div>
              <span className="rounded bg-white/10 px-2 py-1 text-sm font-bold">
                {block.examCount ? `${block.examCount}/${block.items.length}` : block.items.length}
              </span>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {block.items.map((item) => {
                const status = flashcards[item.id];
                return (
                  <div
                    key={item.id}
                    className={`rounded border p-3 ${
                      status === "known"
                        ? "border-emerald-400/35 bg-emerald-400/10"
                        : status === "unknown"
                          ? "border-combat-red/45 bg-combat-red/10"
                          : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-black">{item.korean}</p>
                        <p className="mt-1 break-words text-sm text-white/65">{item.spanish}</p>
                      </div>
                      {getTechniqueVisual(item.id) && (
                        <button
                          className="tap-target flex shrink-0 items-center gap-1 rounded border border-combat-red/45 bg-combat-red/15 px-2 py-2 text-xs font-black uppercase text-red-100"
                          onClick={() => setSelectedVisual(getTechniqueVisual(item.id) ?? null)}
                          type="button"
                        >
                          <Image size={16} aria-hidden />
                          Visual
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {selectedVisual && (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/70 p-3 backdrop-blur sm:place-items-center">
          <article className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded border border-white/10 bg-combat-panel shadow-glow">
            <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Tecnica visual</p>
                <h3 className="mt-1 text-2xl font-black uppercase">{selectedVisual.title}</h3>
                <p className="text-white/62">{selectedVisual.subtitle}</p>
                <p
                  className={`mt-2 inline-block rounded px-2 py-1 text-xs font-black uppercase ${
                    selectedVisual.reviewStatus === "reviewed"
                      ? "bg-emerald-400/15 text-emerald-100"
                      : "bg-combat-red/20 text-red-100"
                  }`}
                >
                  {selectedVisual.reviewStatus === "reviewed" ? "Revisada" : "Pendiente maestro"}
                </p>
              </div>
              <button
                aria-label="Cerrar visual"
                className="tap-target grid w-12 shrink-0 place-items-center rounded border border-white/15 text-white"
                onClick={() => setSelectedVisual(null)}
                type="button"
              >
                <X size={22} aria-hidden />
              </button>
            </div>
            <div className="grid gap-4 p-4 lg:grid-cols-[1fr_20rem]">
              <div className="overflow-hidden rounded border border-white/10 bg-combat-black">
                <img
                  alt={`${selectedVisual.title} - ${selectedVisual.subtitle}`}
                  className="h-auto w-full object-contain"
                  src={selectedVisual.imageUrl}
                />
              </div>
              <div className="space-y-3">
                <div className="rounded border border-white/10 bg-combat-black p-3">
                  <p className="text-xs font-bold uppercase text-white/45">Estado tecnico</p>
                  <p className="mt-1 text-sm font-bold text-white/78">{selectedVisual.reviewNote}</p>
                </div>
                {selectedVisual.cues.map((cue) => (
                  <div key={cue} className="rounded border border-white/10 bg-white/[0.04] p-3">
                    <p className="text-sm font-bold text-white/78">{cue}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
