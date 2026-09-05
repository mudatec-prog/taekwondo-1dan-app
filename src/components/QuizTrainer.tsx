import { ArrowLeft, ArrowRight, Check, Headphones, Mic, Play, RotateCcw, Trophy, Volume2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { dictionary } from "../data/dictionary";
import { createQuestions, DAILY_GOAL, localDay, matchesKorean, type AnswerEvent, type DeckId, type LearningState, type Question, type QuizMode } from "../utils/learning";
import { speakKorean, stopKoreanSpeech } from "../utils/speech";
import { recognizeKorean, voiceSupport } from "../utils/recognition";

type Mode = "mixed" | QuizMode;
type Feedback = { correct: boolean; answer: string; day: string };
type Session = { id: string; queue: Question[]; index: number; answers: Feedback[]; feedback: Feedback | null; deck: DeckId; mode: Mode };
type Props = { learning: LearningState; onAnswer: (answer: AnswerEvent) => void; tribunal?: boolean };
const modes: Array<{ id: Mode; label: string }> = [
  { id: "mixed", label: "Mixto" }, { id: "choice", label: "Elegir" }, { id: "write", label: "Escribir" },
  { id: "listen", label: "Escuchar" }, { id: "speak", label: "Hablar" },
];
const decks: Array<{ id: DeckId; label: string }> = [
  { id: "daily", label: "Mi camino" }, { id: "keywords", label: "Palabras clave" },
  { id: "positions", label: "Posiciones" }, { id: "techniques", label: "Tecnicas" }, { id: "review", label: "Repaso pendiente" },
];

function readSession(key: string): Session | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!value || typeof value.id !== "string" || !Number.isInteger(value.index) || value.index < 0
      || !Array.isArray(value.queue) || value.queue.length < 1 || value.queue.length > DAILY_GOAL * 2 || value.index > value.queue.length
      || !Array.isArray(value.answers) || value.answers.length !== value.index
      || !decks.some((deck) => deck.id === value.deck) || !modes.some((mode) => mode.id === value.mode)) return null;
    const validFeedback = (item: Feedback) => item && typeof item.correct === "boolean" && typeof item.answer === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.day);
    if (!value.answers.every(validFeedback) || (value.feedback !== null && !validFeedback(value.feedback))) return null;
    if (!value.queue.every((question: Question) => dictionary.some((entry) => entry.id === question.entryId && question.options?.includes(entry.spanish))
      && ["choice", "write", "listen", "speak"].includes(question.mode) && Array.isArray(question.options)
      && typeof question.retry === "boolean" && question.options.length === 4 && question.options.every((option) => typeof option === "string"))) return null;
    return value;
  } catch { return null; }
}

export function QuizTrainer({ learning, onAnswer, tribunal = false }: Props) {
  const storageKey = `tkd-quiz-v1-${tribunal ? "tribunal" : "practice"}`;
  const [session, setSession] = useState<Session | null>(() => readSession(storageKey));
  const [paused, setPaused] = useState(false);
  const [deck, setDeck] = useState<DeckId>(session?.deck ?? "daily");
  const [mode, setMode] = useState<Mode>(session?.mode ?? (tribunal ? "listen" : "mixed"));
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [audioBusy, setAudioBusy] = useState(false);
  const [heard, setHeard] = useState(false);
  const [voiceFallback, setVoiceFallback] = useState(false);
  const [showWord, setShowWord] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [voiceMiss, setVoiceMiss] = useState(false);
  const locked = useRef(false);
  const request = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const question = session?.queue[session.index];
  const entry = dictionary.find((item) => item.id === question?.entryId);
  const feedback = session?.feedback;
  const support = voiceSupport();

  useEffect(() => {
    try {
      if (session) localStorage.setItem(storageKey, JSON.stringify(session));
      else localStorage.removeItem(storageKey);
    } catch { /* The current round remains playable without storage. */ }
    if (session?.feedback && question) onAnswer({
      attemptId: `${session.id}:${session.index}`, termId: question.entryId,
      correct: session.feedback.correct, day: session.feedback.day, retry: question.retry,
    });
  }, [session, storageKey, onAnswer, question]);

  useEffect(() => {
    locked.current = Boolean(feedback);
    setInput(""); setMessage(""); setHeard(false); setVoiceFallback(false); setShowWord(false); setTranscript(""); setVoiceMiss(false);
    setListening(false); setAudioBusy(false);
    request.current++;
    controller.current?.abort();
    stopKoreanSpeech();
    window.scrollTo({ top: 0 });
    return () => { request.current++; controller.current?.abort(); stopKoreanSpeech(); };
  }, [session?.id, session?.index]);

  useEffect(() => {
    if (feedback) feedbackRef.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
  }, [feedback]);

  function start() {
    const queue = createQuestions(deck, mode, learning);
    if (!queue.length) { setMessage("No tienes repaso pendiente. Prueba otra ronda de Mi camino."); return; }
    locked.current = false;
    setPaused(false);
    setSession({ id: crypto.randomUUID(), queue, index: 0, answers: [], feedback: null, deck, mode });
  }

  function submit(answer: string, correct: boolean) {
    if (!session || !question || feedback || locked.current) return;
    locked.current = true;
    controller.current?.abort();
    stopKoreanSpeech();
    const queue = !correct && !question.retry ? [...session.queue, { ...question, retry: true }] : session.queue;
    setSession({ ...session, queue, feedback: { correct, answer, day: localDay() } });
  }

  async function play() {
    if (!entry || listening) return;
    const current = ++request.current;
    setAudioBusy(true); setMessage("");
    const result = await speakKorean(entry.speech ?? entry.korean);
    if (current !== request.current) return;
    setAudioBusy(false);
    setHeard(result.ok);
    if (!result.ok) setMessage(result.message);
  }

  async function listen() {
    if (!entry || feedback || listening) return;
    const current = ++request.current;
    controller.current?.abort();
    controller.current = new AbortController();
    setListening(true); setMessage(""); setTranscript(""); setVoiceMiss(false);
    const result = await recognizeKorean(controller.current.signal);
    if (current !== request.current) return;
    setListening(false);
    if (!result.transcripts.length) { setMessage(result.error ?? "No se ha recibido voz. Puedes volver a intentarlo."); return; }
    const matching = result.transcripts.find((text) => matchesKorean(entry, text));
    setTranscript(matching ?? result.transcripts[0]);
    if (matching) submit(matching, true);
    else setVoiceMiss(true);
  }

  function advance() {
    if (!session || !feedback) return;
    setSession({ ...session, index: session.index + 1, answers: [...session.answers, feedback], feedback: null });
  }

  if (!session || paused) return (
    <section className="quiz-shell space-y-6">
      <div><p className="eyebrow">{tribunal ? "Modo tribunal" : "Entrenamiento"}</p><h2 className="screen-title">Un poco mejor cada dia.</h2></div>
      <div className="flex items-center gap-2 text-sm text-white/60"><Play size={16} />8 retos<span className="text-white/25">/</span>Unos 3 minutos</div>
      <label className="block space-y-2"><span className="text-sm text-white/60">Que practicamos</span><select className="quiz-select" value={deck} onChange={(event) => setDeck(event.target.value as DeckId)}>{decks.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <fieldset><legend className="mb-2 text-sm text-white/60">Tipo de reto</legend><div className="quiz-modes">{modes.map((item) => <button key={item.id} aria-pressed={mode === item.id} className={mode === item.id ? "selected" : ""} onClick={() => setMode(item.id)}>{item.label}</button>)}</div></fieldset>
      {mode === "speak" && <p className="text-sm leading-relaxed text-white/50">Comprobamos la palabra reconocida, no el acento. El servicio de voz del dispositivo puede usar internet.</p>}
      <button className="quiz-primary" onClick={() => session ? setPaused(false) : start()}>{session ? "Continuar ronda" : "Empezar ronda"} <ArrowRight size={20} /></button>
      {session && <button className="quiz-secondary" onClick={start}>Empezar una ronda nueva</button>}
      {message && <p role="status" className="text-sm text-white/70">{message}</p>}
      <p className="text-sm text-white/45">{Object.values(learning.terms).filter((item) => item.strength >= 3).length} palabras consolidadas</p>
    </section>
  );

  if (!question || !entry) {
    const correct = session.answers.filter((item) => item.correct).length;
    const xp = session.answers.reduce((sum, item, index) => sum + (item.correct ? session.queue[index].retry ? 5 : 10 : 2), 0);
    return <section className="quiz-shell space-y-6 py-4">
      <Trophy className="text-combat-red" size={44} aria-hidden />
      <div><p className="eyebrow">Ronda completada</p><h2 className="screen-title">Buen entrenamiento.</h2></div>
      <div className="grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 py-5"><div><strong className="text-3xl">+{xp}</strong><p className="text-sm text-white/50">XP</p></div><div className="pl-5"><strong className="text-3xl">{correct}/{session.answers.length}</strong><p className="text-sm text-white/50">Aciertos</p></div></div>
      <p className="text-white/65">{learning.days[localDay()]?.answers >= DAILY_GOAL ? "Objetivo de hoy cumplido. Manana seguimos." : "Cada intento cuenta. Tu progreso esta guardado."}</p>
      <button className="quiz-primary" onClick={start}><RotateCcw size={20} /> Otra ronda</button>
      <button className="quiz-secondary" onClick={() => setSession(null)}>Elegir entrenamiento</button>
    </section>;
  }

  const isWrite = question.mode === "write" || voiceFallback;
  const keyboardVoice = question.mode === "speak" && !voiceFallback && support === "keyboard";
  const audioQuestion = question.mode === "listen" && !showWord;
  const canAnswerChoice = question.mode !== "listen" || heard || showWord;
  return <section className="quiz-shell space-y-5">
    <div className="flex items-center justify-between gap-3">
      <button className="icon-button" title="Guardar y salir de la ronda" aria-label="Guardar y salir de la ronda" onClick={() => { request.current++; controller.current?.abort(); stopKoreanSpeech(); setListening(false); setAudioBusy(false); setMessage(""); setPaused(true); }}><ArrowLeft size={20} /></button>
      <span className="text-sm text-white/60">{question.retry ? "Repaso" : "Reto"} {session.index + 1} / {session.queue.length}</span>
      <span className="text-sm font-bold">{session.answers.filter((item) => item.correct).length} <Check className="inline text-combat-red" size={16} /></span>
    </div>
    <div role="progressbar" aria-label="Progreso de la ronda" aria-valuenow={session.index} aria-valuemin={0} aria-valuemax={session.queue.length} className="quiz-progress"><span style={{ width: `${session.index / session.queue.length * 100}%` }} /></div>
    <div className="quiz-prompt">
      <p className="eyebrow">{isWrite ? "Escribe en coreano" : question.mode === "speak" ? "Di esta palabra" : audioQuestion ? "Escucha y elige" : "Que significa"}</p>
      {audioQuestion && !feedback ? <button className="audio-challenge" aria-label="Escuchar pregunta" onClick={() => void play()} disabled={audioBusy}><Headphones size={38} /><span>{audioBusy ? "Preparando..." : heard ? "Otra vez" : "Escuchar"}</span></button>
        : <><h2 className="quiz-word">{isWrite ? entry.spanish : entry.korean}</h2>{!isWrite && entry.speech && <p className="mt-2 text-2xl text-white/45" lang="ko">{entry.speech}</p>}</>}
      {!audioQuestion && !isWrite && <button className="icon-button mt-3" onClick={() => void play()} disabled={listening || audioBusy} aria-label="Escuchar pronunciacion" title="Escuchar pronunciacion"><Volume2 size={22} /></button>}
    </div>

    {(question.mode === "choice" || question.mode === "listen") && <div className="grid gap-2">{question.options.map((option) => (
      <button key={option} disabled={Boolean(feedback) || !canAnswerChoice} onClick={() => submit(option, option === entry.spanish)}
        className={`quiz-option ${feedback && option === entry.spanish ? "correct" : feedback?.answer === option ? "incorrect" : ""}`}>
        <span>{option}</span>{feedback && option === entry.spanish ? <Check size={20} /> : feedback?.answer === option ? <X size={20} /> : null}
      </button>
    ))}</div>}

    {(isWrite || keyboardVoice) && <form onSubmit={(event) => { event.preventDefault(); if (input.trim()) submit(input, matchesKorean(entry, input)); }} className="space-y-3">
      {keyboardVoice && <p className="text-sm leading-relaxed text-white/65">Toca el campo y usa el microfono de tu teclado en coreano. Si no tienes dictado, puedes escribir.</p>}
      <label className="sr-only" htmlFor="quiz-answer">Tu respuesta en coreano</label>
      <input id="quiz-answer" className="quiz-select" placeholder={keyboardVoice ? "Tu palabra dictada o escrita" : "Romanizado o hangul"} lang={keyboardVoice ? "ko" : undefined} autoComplete="off" autoCapitalize="none" spellCheck={false} value={input} disabled={Boolean(feedback)} onChange={(event) => setInput(event.target.value)} />
      {!feedback && <button className="quiz-primary" disabled={!input.trim()} type="submit">Comprobar <Check size={20} /></button>}
    </form>}

    {question.mode === "speak" && !voiceFallback && !keyboardVoice && !feedback && <div className="space-y-3">
      <button className={`quiz-primary ${listening ? "listening" : ""}`} onClick={() => listening ? controller.current?.abort() : void listen()}><Mic size={22} />{listening ? "Cancelar escucha" : voiceMiss ? "Reintentar" : "Hablar"}</button>
      <p className="text-xs leading-relaxed text-white/45">Reconocimiento de palabras, no evaluacion del acento. Puede usar internet.</p>
      {voiceMiss && <p role="status" className="text-sm text-white/80">He entendido: <span lang="ko">{transcript}</span>. No coincide con {entry.speech}. Escucha el modelo y prueba de nuevo.</p>}
      <button className="quiz-secondary" disabled={listening} onClick={() => { setVoiceFallback(true); setTranscript(""); setMessage(""); }}>Responder por escrito</button>
    </div>}

    {message && <div role="status" className="text-sm leading-relaxed text-white/65">{message}{audioQuestion && !heard && <button className="mt-2 block underline" onClick={() => setShowWord(true)}>Continuar leyendo la palabra</button>}</div>}
    {!feedback && <button className="quiz-skip" disabled={listening} onClick={() => submit("", false)}>No recuerdo</button>}
    {feedback && <div ref={feedbackRef} className={`quiz-feedback ${feedback.correct ? "success" : ""}`} role="status">
      <div className="flex items-center gap-2 font-bold">{feedback.correct ? <Check size={20} /> : <RotateCcw size={20} />}{feedback.correct ? question.mode === "speak" && !voiceFallback && !keyboardVoice ? "Palabra reconocida" : "Correcto" : "Vamos a fijarla"}<span className="ml-auto text-sm">+{feedback.correct ? question.retry ? 5 : 10 : 2} XP</span></div>
      <p className="mt-2 font-bold">{entry.korean} <span className="font-normal text-white/65">{entry.spanish}</span></p>
      {!feedback.correct && feedback.answer && <p className="mt-1 break-words text-sm text-white/50">Tu respuesta: {feedback.answer}</p>}
      {question.mode === "speak" && !voiceFallback && transcript && <p className="mt-1 text-sm" lang="ko">{transcript}</p>}
      <button className="quiz-primary mt-4" onClick={advance}>{session.index + 1 === session.queue.length ? "Ver resultado" : "Siguiente"}<ArrowRight size={20} /></button>
    </div>}
  </section>;
}
