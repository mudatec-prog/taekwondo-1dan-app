import { stopKoreanSpeech } from "./speech";

type RecognitionResult = { transcripts: string[]; error?: string };
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void; abort: () => void;
};
type VoiceWindow = Window & {
  TaekwondoAndroid?: { recognizeKorean?: (id: string) => void; cancelRecognition?: () => void };
  SpeechRecognition?: new () => Recognition;
  webkitSpeechRecognition?: new () => Recognition;
};

export function voiceSupport(): "native" | "browser" | "keyboard" {
  const host = window as VoiceWindow;
  if (host.TaekwondoAndroid?.recognizeKorean) return "native";
  if (host.TaekwondoAndroid || /Taekwondo1DanAndroid\//.test(navigator.userAgent)) return "keyboard";
  return host.SpeechRecognition || host.webkitSpeechRecognition ? "browser" : "keyboard";
}

export function recognizeKorean(signal: AbortSignal): Promise<RecognitionResult> {
  stopKoreanSpeech();
  const host = window as VoiceWindow;
  return new Promise((resolve) => {
    let settled = false;
    let recognition: Recognition | undefined;
    const id = `voice-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const finish = (result: RecognitionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      signal.removeEventListener("abort", abort);
      window.removeEventListener("taekwondo-recognition", nativeResult);
      if (recognition) { recognition.onresult = null; recognition.onerror = null; recognition.onend = null; recognition.abort(); }
      resolve(result);
    };
    const abort = () => {
      try { host.TaekwondoAndroid?.cancelRecognition?.(); } catch { /* Already closed. */ }
      finish({ transcripts: [] });
    };
    const nativeResult = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; texts?: string[]; error?: string }>).detail;
      if (detail?.id !== id) return;
      finish({ transcripts: detail.texts ?? [], error: detail.error ? "No se ha reconocido la voz. Puedes reintentar o responder por escrito." : undefined });
    };
    const timeout = window.setTimeout(() => { abort(); }, 25000);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) { abort(); return; }
    if (host.TaekwondoAndroid?.recognizeKorean) {
      window.addEventListener("taekwondo-recognition", nativeResult);
      try { host.TaekwondoAndroid.recognizeKorean(id); }
      catch { finish({ transcripts: [], error: "No se ha podido abrir el microfono." }); }
      return;
    }
    const Constructor = host.SpeechRecognition ?? host.webkitSpeechRecognition;
    if (!Constructor) { finish({ transcripts: [], error: "El reconocimiento de voz no esta disponible aqui." }); return; }
    recognition = new Constructor();
    recognition.lang = "ko-KR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.onresult = (event) => finish({ transcripts: Array.from(event.results[0] ?? []).map((item) => item.transcript) });
    recognition.onerror = (event) => finish({ transcripts: [], error: event.error === "not-allowed"
      ? "Permite el microfono para hablar, o responde por escrito."
      : "No se ha reconocido la voz. Reintenta o responde por escrito." });
    recognition.onend = () => finish({ transcripts: [], error: "No he recibido una palabra. Prueba otra vez." });
    try { recognition.start(); } catch { finish({ transcripts: [], error: "No se ha podido iniciar el microfono." }); }
  });
}
