import type { SyllabusBlock as SyllabusBlockType } from "../data/examData";
import type { FlashcardStatus } from "../hooks/useLocalProgress";

type SyllabusBlockProps = {
  blocks: SyllabusBlockType[];
  flashcards: Record<string, FlashcardStatus>;
};

export function SyllabusBlock({ blocks, flashcards }: SyllabusBlockProps) {
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
                    <p className="font-black">{item.korean}</p>
                    <p className="mt-1 text-sm text-white/65">{item.spanish}</p>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
