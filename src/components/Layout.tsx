import { BookOpen, ClipboardCheck, Dumbbell, Home, Layers, Map, Search, Siren } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export type ViewId = "dashboard" | "dictionary" | "flashcards" | "tribunal" | "syllabus" | "poomsae" | "exam" | "checklist";

type LayoutProps = {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
  children: ReactNode;
};

const primaryNavItems: Array<{ id: ViewId; label: string; icon: typeof Home }> = [
  { id: "dashboard", label: "Hoy", icon: Home },
  { id: "dictionary", label: "Coreano", icon: Search },
  { id: "flashcards", label: "Practica", icon: Layers },
  { id: "poomsae", label: "Poomsae", icon: Map },
  { id: "exam", label: "Examen", icon: Dumbbell },
];

const secondaryNavItems: Array<{ id: ViewId; label: string; icon: typeof Home }> = [
  { id: "syllabus", label: "Temario", icon: BookOpen },
  { id: "tribunal", label: "Tribunal", icon: Siren },
  { id: "checklist", label: "Checklist", icon: ClipboardCheck },
];

export function Layout({ activeView, onViewChange, children }: LayoutProps) {
  const allDesktopItems = [...primaryNavItems, ...secondaryNavItems];
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [activeView]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden text-combat-white md:block md:h-auto md:min-h-dvh md:overflow-x-hidden md:overflow-y-visible">
      <header className="shrink-0 border-b border-white/10 bg-combat-black/90 backdrop-blur md:sticky md:top-0 md:z-20">
        <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-4 py-4 md:max-w-6xl md:px-6">
          <button
            aria-label="Ir al inicio"
            className="flex min-w-0 items-center gap-3 text-left"
            onClick={() => onViewChange("dashboard")}
            type="button"
          >
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded border border-combat-red bg-combat-red text-lg font-black shadow-glow">
              1D
            </span>
            <span className="min-w-0">
              <span className="block text-[0.68rem] font-black uppercase tracking-[0.18em] text-combat-red">Black belt prep</span>
              <span className="block truncate text-lg font-black uppercase leading-tight">Taekwondo 1er DAN</span>
            </span>
          </button>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-black text-white/75">
            JM
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[680px] min-w-0 flex-1 gap-0 overflow-hidden px-4 md:grid md:max-w-6xl md:grid-cols-[13rem_1fr] md:gap-6 md:overflow-visible md:px-6 md:pb-8 md:pt-6">
        <nav className="hidden md:block">
          <div className="sticky top-6 space-y-2">
            {allDesktopItems.map(({ id, label, icon: Icon }) => (
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

        <main
          ref={mainRef}
          className="min-w-0 flex-1 overflow-y-auto pb-5 pt-5 [-webkit-overflow-scrolling:touch] md:overflow-visible md:pb-0 md:pt-0"
        >
          {children}
        </main>
      </div>

      <nav className="mx-auto w-full max-w-[680px] shrink-0 overflow-hidden border-t border-white/10 bg-combat-black/96 px-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="grid min-w-0 grid-cols-5 gap-1.5">
          {primaryNavItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-label={label}
              className={`tap-target flex min-w-0 flex-col items-center justify-center rounded border px-1 py-2 text-[0.65rem] font-black uppercase ${
                activeView === id
                  ? "border-combat-red bg-combat-red text-white shadow-glow"
                  : "border-transparent text-white/64"
              }`}
              onClick={() => onViewChange(id)}
              type="button"
            >
              <Icon size={20} aria-hidden />
              <span className="mt-1 max-w-full truncate">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
