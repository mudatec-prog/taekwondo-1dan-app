export type KoreanSpeechResult = {
  ok: boolean;
  source: "android" | "browser" | "none";
  message: string;
};

type NativeSpeechResponse =
  | boolean
  | "spoken"
  | "queued"
  | "empty"
  | "missing_language"
  | "not_ready"
  | "not_trusted"
  | "unsupported"
  | void;

type NativeSpeechBridge = {
  speakKorean?: (text: string) => NativeSpeechResponse;
};

function getNativeSpeechBridge() {
  return (window as Window & { TaekwondoAndroid?: NativeSpeechBridge }).TaekwondoAndroid;
}

function getKoreanVoice() {
  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("ko") || voice.name.toLowerCase().includes("heami"));
}

function isNativeSpeechAccepted(response: NativeSpeechResponse) {
  return response === true || response === "spoken" || response === "queued";
}

function nativeSpeechMessage(response: NativeSpeechResponse) {
  if (response === "queued") {
    return "Audio preparado. Android lo reproducira en cuanto active la voz coreana.";
  }

  return "Audio enviado a la voz coreana de Android.";
}

export function speakKorean(text: string): Promise<KoreanSpeechResult> {
  const cleanText = text.trim();
  if (!cleanText) {
    return Promise.resolve({
      ok: false,
      source: "none",
      message: "No hay texto coreano para reproducir.",
    });
  }

  const nativeBridge = getNativeSpeechBridge();
  if (nativeBridge?.speakKorean) {
    try {
      const nativeResponse = nativeBridge.speakKorean(cleanText);
      if (isNativeSpeechAccepted(nativeResponse)) {
        return Promise.resolve({
          ok: true,
          source: "android",
          message: nativeSpeechMessage(nativeResponse),
        });
      }
    } catch {
      // Fall back to the browser voice below.
    }
  }

  if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
    return Promise.resolve({
      ok: false,
      source: "none",
      message: "Este navegador o WebView no permite reproducir voz. Instala el APK 0.1.2 para usar audio nativo.",
    });
  }

  const synth = window.speechSynthesis;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "ko-KR";
  utterance.rate = 0.68;
  utterance.pitch = 1;
  utterance.volume = 1;

  const koreanVoice = getKoreanVoice();
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: KoreanSpeechResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    utterance.onstart = () => {
      finish({
        ok: true,
        source: "browser",
        message: koreanVoice
          ? "Audio reproduciendose con la voz coreana del navegador."
          : "Audio enviado al navegador, pero no detecto voz coreana instalada.",
      });
    };

    utterance.onerror = (event) => {
      console.warn("No se pudo reproducir audio coreano", event.error);
      finish({
        ok: false,
        source: "none",
        message: "El navegador ha rechazado el audio. Revisa volumen, permisos o instala el APK 0.1.2.",
      });
    };

    const speak = () => synth.speak(utterance);

    if (synth.paused) {
      synth.resume();
    }

    if (synth.speaking) {
      synth.cancel();
      window.setTimeout(speak, 120);
    } else {
      speak();
    }

    window.setTimeout(() => {
      finish({
        ok: true,
        source: "browser",
        message: koreanVoice
          ? "Audio enviado al navegador."
          : "Audio enviado, pero no detecto voz coreana instalada.",
      });
    }, 900);
  });
}

export function preloadKoreanVoices() {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.getVoices();
}
