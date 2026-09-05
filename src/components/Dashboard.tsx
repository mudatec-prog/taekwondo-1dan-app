import { ArrowRight, BookOpen, CalendarDays, Check, ClipboardCheck, Flame, Headphones, Map, Target, Zap } from "lucide-react";
import { dictionary } from "../data/dictionary";
import { localDay, shiftDay, streak, DAILY_GOAL, type LearningState } from "../utils/learning";

type Props = {
  learning: LearningState;
  onStartDictionary: () => void; onStartFlashcards: () => void; onStartPoomsae: () => void;
  onStartExam: () => void; onOpenSyllabus: () => void; onOpenTribunal: () => void; onOpenChecklist: () => void;
};

export function Dashboard(props: Props) {
  const { learning } = props;
  const today = localDay();
  const answers = learning.days[today]?.answers ?? 0;
  const complete = answers >= DAILY_GOAL;
  const currentStreak = streak(learning);
  const due = dictionary.filter((entry) => learning.terms[entry.id] && learning.terms[entry.id].due <= today).length;
  const mastered = dictionary.filter((entry) => (learning.terms[entry.id]?.strength ?? 0) >= 3).length;
  const week = Array.from({ length: 7 }, (_, index) => shiftDay(today, index - 6));
  return <section className="home-shell space-y-7">
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="capitalize text-white/50">{new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}</span>
      <span className="flex items-center gap-1.5 font-bold"><Flame size={18} className="text-combat-red" />{currentStreak} {currentStreak === 1 ? "dia" : "dias"}</span>
    </div>
    <div className="space-y-4">
      <p className="eyebrow">{complete ? "Objetivo conseguido" : "Tu rato de taekwondo"}</p>
      <h2 className="home-title">{complete ? "Hoy ya has avanzado." : "Ocho retos. Un paso mas."}</h2>
      <div className="flex justify-between text-sm text-white/60"><span>Reto diario</span><span>{Math.min(answers, DAILY_GOAL)} / {DAILY_GOAL}</span></div>
      <div className="quiz-progress"><span style={{ width: `${Math.min(100, answers / DAILY_GOAL * 100)}%` }} /></div>
      <button className="quiz-primary" onClick={props.onStartFlashcards}>{complete ? "Otra ronda" : answers ? "Seguir entrenando" : "Empezar"}<ArrowRight size={21} /></button>
    </div>
    <div className="grid grid-cols-7 gap-2" aria-label="Actividad de los ultimos siete dias">
      {week.map((day) => { const done = (learning.days[day]?.answers ?? 0) >= DAILY_GOAL; const date = new Date(day + "T12:00:00"); return <div key={day} className="text-center" aria-label={`${date.toLocaleDateString("es-ES")}: ${done ? "objetivo cumplido" : "pendiente"}`}>
        <span className="text-xs text-white/45">{date.toLocaleDateString("es-ES", { weekday: "narrow" })}</span>
        <div className={`week-day ${done ? "done" : ""} ${day === today ? "today" : ""}`}>{done ? <Check size={18} /> : date.getDate()}</div>
      </div>; })}
    </div>
    <div className="grid grid-cols-3 divide-x divide-white/10 border-y border-white/10 py-5">
      <div><Zap size={18} className="mb-2 text-combat-red" /><strong className="text-xl">{learning.xp}</strong><p className="text-xs text-white/50">XP total</p></div>
      <div className="pl-4"><Target size={18} className="mb-2 text-white/60" /><strong className="text-xl">{mastered}</strong><p className="text-xs text-white/50">Consolidadas</p></div>
      <div className="pl-4"><CalendarDays size={18} className="mb-2 text-white/60" /><strong className="text-xl">{due}</strong><p className="text-xs text-white/50">Por repasar</p></div>
    </div>
    <div>
      <h3 className="mb-2 text-sm font-semibold text-white/50">Tu entrenamiento</h3>
      {[
        { label: "Coreano", detail: "Diccionario y audio", icon: BookOpen, action: props.onStartDictionary },
        { label: "Oido de tribunal", detail: "Escucha y responde", icon: Headphones, action: props.onOpenTribunal },
        { label: "Poomsae", detail: "Movimiento a movimiento", icon: Map, action: props.onStartPoomsae },
        { label: "Simulacro", detail: "Examen practico", icon: Target, action: props.onStartExam },
      ].map(({ label, detail, icon: Icon, action }) => <button key={label} className="home-row" onClick={action}><Icon size={21} className="text-white/60" /><span className="min-w-0 flex-1 text-left"><strong className="block font-semibold">{label}</strong><span className="text-sm text-white/45">{detail}</span></span><ArrowRight size={18} /></button>)}
    </div>
    <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4">
      <button className="quiet-link" onClick={props.onOpenSyllabus}><BookOpen size={16} />Temario</button>
      <button className="quiet-link" onClick={props.onOpenChecklist}><ClipboardCheck size={16} />Checklist</button>
    </div>
  </section>;
}
