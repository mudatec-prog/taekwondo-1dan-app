import { BookOpen, ClipboardCheck, Dumbbell, Home, Layers, Map, Search } from "lucide-react";
import type { ReactNode } from "react";

export type ViewId = "dashboard" | "dictionary" | "flashcards" | "syllabus" | "poomsae" | "exam" | "checklist";

type LayoutProps = {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  children: ReactNode;
};

const navItems: Array<{ id: ViewId; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "Inicio", icon: Home },
  { id: "dictionary", label: "Diccionario", icon: Search },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "syllabus", label: "Temario", icon: BookOpen },
  { id: "poomsae", label: "Poomsae", icon: Map },
  { id: "exam", label: "Examen", icon: Dumbbell },
  { id: "checklist", label: "Checklist", icon: ClipboardCheck },
];

export function Layout({ activeView, onViewChange, children }: LayoutProps) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden pb-28 text-combat-white md:pb-8">
      <header className="border-b border-white/10 bg-combat-black/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-combat-red">1er DAN</p>
            <h1 className="mt-1 text-2xl font-black uppercase leading-tight sm:text-3xl">Taekwondo Exam Trainer</h1>
          </div>
          <div className="hidden rounded border border-combat-red/40 px-3 py-2 text-right text-sm font-bold uppercase text-white sm:block">
            Kukkiwon Mode
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl min-w-0 gap-6 px-4 py-6 sm:px-6 md:grid-cols-[13rem_1fr]">
        <nav className="hidden md:block">
          <div className="sticky top-6 space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`tap-target flex w-full items-center gap-3 rounded border px-3 py-3 text-left text-sm font-bold uppercase transition ${
                  activeView === id
                    ? "border-combat-red bg-combat-red text-white shadow-glow"
                    : "border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:text-white"
                }`}
                onClick={() => onViewChange(id)}
                type="button"
              >
                <Icon size={18} aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </nav>

        <main className="min-w-0">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 max-w-full overflow-hidden border-t border-white/10 bg-combat-black/95 px-1 py-2 backdrop-blur md:hidden">
        <div className="grid min-w-0 grid-cols-7 gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-label={label}
              className={`tap-target flex min-w-0 flex-col items-center justify-center rounded border px-0.5 py-2 text-[0.65rem] font-bold uppercase ${
                activeView === id
                  ? "border-combat-red bg-combat-red text-white"
                  : "border-transparent text-white/70"
              }`}
              onClick={() => onViewChange(id)}
              type="button"
            >
              <Icon size={20} aria-hidden />
              <span className="mt-1 hidden max-w-full truncate min-[430px]:block">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
