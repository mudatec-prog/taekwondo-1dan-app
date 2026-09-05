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
  const layoutRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [activeView]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const measure = () => layoutRef.current?.style.setProperty("--bottom-nav-height", `${nav.getBoundingClientRect().height}px`);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layoutRef} className="app-layout w-full text-combat-white">
      <header className="shrink-0 border-b border-white/10 bg-combat-black/90 backdrop-blur md:sticky md:top-0 md:z-20">
        <div className="mx-auto flex w-full max-w-[680px] items-center justify-between px-4 py-2 md:max-w-6xl md:px-6">
          <button
            aria-label="Ir al inicio"
            className="flex min-w-0 items-center gap-3 text-left"
            onClick={() => onViewChange("dashboard")}
            type="button"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-combat-red text-sm font-black">
              1D
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">Taekwondo 1er DAN</span>
            </span>
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[680px] min-w-0 px-4 md:grid md:max-w-6xl md:grid-cols-[13rem_1fr] md:gap-6 md:px-6 md:pb-8 md:pt-6">
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
          className="min-w-0 pb-5 pt-5 md:pb-0 md:pt-0"
        >
          {children}
        </main>
      </div>

      <nav ref={navRef} aria-label="Navegacion principal" className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[680px] border-t border-white/10 bg-combat-black px-2 pb-[calc(0.55rem+env(safe-area-inset-bottom))] pt-2 md:hidden">
        <div className="grid min-w-0 grid-cols-5 gap-1.5">
          {primaryNavItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-label={label}
              className={`tap-target flex min-w-0 flex-col items-center justify-center rounded border px-1 py-2 text-[0.65rem] font-black uppercase ${
                activeView === id
                  ? "border-transparent bg-white/[0.06] text-combat-red"
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
