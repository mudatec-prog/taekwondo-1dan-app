function getKoreanVoice() {
  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().startsWith("ko") || voice.name.toLowerCase().includes("heami"));
}

export function speakKorean(text: string) {
  if (!("speechSynthesis" in window)) {
    globalThis.alert?.("Este navegador no permite reproducir voz con speechSynthesis.");
    return;
  }

  const synth = window.speechSynthesis;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.68;
  utterance.pitch = 1;
  utterance.volume = 1;

  const koreanVoice = getKoreanVoice();
  if (koreanVoice) {
    utterance.voice = koreanVoice;
  }

  utterance.onerror = (event) => {
    console.warn("No se pudo reproducir audio coreano", event.error);
  };

  if (synth.paused) {
    synth.resume();
  }

  if (synth.speaking) {
    synth.cancel();
    window.setTimeout(() => synth.speak(utterance), 120);
    return;
  }

  synth.speak(utterance);
}

export function preloadKoreanVoices() {
  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.getVoices();
}
