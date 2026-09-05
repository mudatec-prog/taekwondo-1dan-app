export type KoreanSpeechResult = {
  ok: boolean;
  source: "android" | "browser" | "none";
  message: string;
};

type NativeSpeechBridge = {
  stopSpeech?: () => void;
  speakKoreanWithId?: (text: string, requestId: string) => void;
  speakKorean?: (text: string) => unknown;
};

let cancelPending: (() => void) | undefined;
// Keep the utterance alive until the browser finishes or cancels it.
let activeUtterance: SpeechSynthesisUtterance | undefined;
let sequence = 0;

const failure = (message: string): KoreanSpeechResult => ({ ok: false, source: "none", message });

export function speakKorean(text: string): Promise<KoreanSpeechResult> {
  cancelPending?.();
  const cleanText = text.trim();
  if (!cleanText) return Promise.resolve(failure("No hay texto coreano para reproducir."));

  const bridge = (window as Window & { TaekwondoAndroid?: NativeSpeechBridge }).TaekwondoAndroid;
  if (bridge?.speakKoreanWithId) {
    return new Promise((resolve) => {
      const requestId = `tkd-${Date.now()}-${++sequence}`;
      const finish = (result: KoreanSpeechResult) => {
        window.clearTimeout(timer);
        window.removeEventListener("taekwondo-speech", onSpeech);
        if (cancelPending === cancel) cancelPending = undefined;
        resolve(result);
      };
      const cancel = () => finish(failure("Audio sustituido por otra solicitud."));
      const onSpeech = (event: Event) => {
        const detail = (event as CustomEvent<{ id: string; status: string }>).detail;
        if (!detail || detail.id !== requestId) return;
        if (detail.status === "started") {
          finish({ ok: true, source: "android", message: "Reproduciendo en coreano." });
        } else if (detail.status === "missing_language") {
          finish(failure("Falta la voz coreana. En Ajustes de Android > Texto a voz > Instalar datos de voz, descarga Coreano y vuelve a intentarlo."));
        } else {
          finish(failure("Android no ha podido reproducir la voz. Revisa el motor de texto a voz y el volumen multimedia."));
        }
      };
      const timer = window.setTimeout(() => finish(failure("La voz de Android no ha arrancado. Revisa el motor de texto a voz en Ajustes y vuelve a intentarlo.")), 12000);
      cancelPending = cancel;
      window.addEventListener("taekwondo-speech", onSpeech);
      try { bridge.speakKoreanWithId!(cleanText, requestId); }
      catch { finish(failure("No se puede conectar con la voz de Android. Actualiza la app desde Inicio.")); }
    });
  }

  if (bridge || /Taekwondo1DanAndroid\//.test(navigator.userAgent)) {
    return Promise.resolve(failure("Esta app tiene el motor de audio antiguo. Descarga la actualizacion desde Inicio e instalala sobre la app actual."));
  }
  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return Promise.resolve(failure("Este navegador no permite reproducir voz. Abre la web en Chrome o usa la app Android actualizada."));
  }

  const synth = window.speechSynthesis;
  return new Promise((resolve) => {
    let settled = false;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    activeUtterance = utterance;
    utterance.lang = "ko-KR";
    utterance.rate = 0.72;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith("ko"));
    if (voice) utterance.voice = voice;
    const finish = (result: KoreanSpeechResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      if (cancelPending === cancel) cancelPending = undefined;
      resolve(result);
    };
    const cancel = () => {
      finish(failure("Audio sustituido por otra solicitud."));
      synth.cancel();
    };
    cancelPending = cancel;
    utterance.onstart = () => finish({ ok: true, source: "browser", message: voice
      ? "Reproduciendo en coreano."
      : "Reproduciendo. El dispositivo no informa de una voz coreana instalada." });
    utterance.onend = () => { if (activeUtterance === utterance) activeUtterance = undefined; };
    utterance.onerror = (event) => {
      if (activeUtterance === utterance) activeUtterance = undefined;
      finish(failure(event.error === "language-unavailable" || event.error === "voice-unavailable"
        ? "No hay una voz coreana disponible. Instala Coreano en los ajustes de texto a voz del dispositivo."
        : "No se ha podido reproducir el audio. Revisa la voz coreana y el volumen multimedia del dispositivo."));
    };
    const timer = window.setTimeout(() => {
      finish(failure("El dispositivo no ha iniciado el audio. Revisa que tenga una voz coreana instalada o usa la app Android actualizada."));
      synth.cancel();
    }, 10000);
    try {
      if (synth.speaking || synth.pending) synth.cancel();
      if (synth.paused) synth.resume();
      // Stay inside the tap's user activation, required by mobile browsers.
      synth.speak(utterance);
    } catch {
      finish(failure("El navegador ha bloqueado la voz. Vuelve a pulsar Escuchar."));
    }
  });
}

export function preloadKoreanVoices() {
  if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
}

export function stopKoreanSpeech() {
  cancelPending?.();
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  activeUtterance = undefined;
  try { (window as Window & { TaekwondoAndroid?: NativeSpeechBridge }).TaekwondoAndroid?.stopSpeech?.(); } catch { /* The old app has no stop method. */ }
}
