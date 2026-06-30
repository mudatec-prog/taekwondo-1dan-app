import { Check, RotateCcw } from "lucide-react";
import { checklistItems } from "../data/examData";

type ChecklistProps = {
  checked: Record<string, boolean>;
  onToggle: (id: string) => void;
  onReset: () => void;
};

export function Checklist({ checked, onToggle, onReset }: ChecklistProps) {
  const done = Object.values(checked).filter(Boolean).length;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-combat-red">Valoracion</p>
          <h2 className="mt-1 text-3xl font-black uppercase">Checklist tecnico</h2>
        </div>
        <button
          className="tap-target rounded border border-white/15 px-3 py-2 text-sm font-black uppercase text-white/80"
          onClick={onReset}
          type="button"
        >
          <RotateCcw className="inline" size={16} aria-hidden /> Reset
        </button>
      </div>

      <div className="rounded border border-white/10 bg-combat-panel p-4 shadow-glow">
        <div className="flex items-center justify-between text-sm font-bold uppercase text-white/65">
          <span>Puntos controlados</span>
          <span>{done}/{checklistItems.length}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded bg-white/10">
          <div className="h-full bg-combat-red" style={{ width: `${(done / checklistItems.length) * 100}%` }} />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {checklistItems.map((item) => {
          const id = item.toLowerCase().replace(/\s+/g, "-");
          const isChecked = checked[id];
          return (
            <button
              key={id}
              className={`tap-target flex items-center gap-3 rounded border p-4 text-left font-black uppercase transition ${
                isChecked
                  ? "border-combat-red bg-combat-red text-white shadow-glow"
                  : "border-white/10 bg-white/[0.04] text-white/85 hover:border-white/25"
              }`}
              onClick={() => onToggle(id)}
              type="button"
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded border ${
                  isChecked ? "border-white bg-white text-combat-red" : "border-white/20"
                }`}
              >
                {isChecked && <Check size={18} aria-hidden />}
              </span>
              {item}
            </button>
          );
        })}
      </div>
    </section>
  );
}
