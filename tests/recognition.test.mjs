import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/utils/recognition.ts'], bundle: true, write: false, format: 'cjs', platform: 'node' });

function setup(native = false) {
  let requestId;
  let stopped = 0;
  const window = new EventTarget();
  const timers = new Map();
  let sequence = 0;
  window.setTimeout = (fn) => { timers.set(++sequence, fn); return sequence; };
  if (native) window.TaekwondoAndroid = {
    recognizeKorean: (id) => { requestId = id; },
    stopSpeech: () => { stopped++; },
    cancelRecognition: () => {},
  };
  const context = vm.createContext({ module: { exports: {} }, window, navigator: { userAgent: '' }, clearTimeout: (id) => timers.delete(id) });
  vm.runInContext(bundle.outputFiles[0].text, context);
  return {
    ...context.module.exports,
    stopped: () => stopped,
    notify: (texts, id = requestId) => {
      const event = new Event('taekwondo-recognition');
      event.detail = { id, texts };
      window.dispatchEvent(event);
    },
  };
}

test('voice-unavailable browsers keep a written-answer fallback', async () => {
  const env = setup();
  assert.equal(env.voiceSupport(), 'unavailable');
  const result = await env.recognizeKorean(new AbortController().signal);
  assert.equal(result.transcripts.length, 0);
  assert.ok(result.error);
});

test('native recognition stops the model audio and returns alternatives', async () => {
  const env = setup(true);
  assert.equal(env.voiceSupport(), 'native');
  const result = env.recognizeKorean(new AbortController().signal);
  assert.equal(env.stopped(), 1);
  env.notify(['maki']);
  assert.equal((await result).transcripts[0], 'maki');
});

test('leaving a voice question cancels it without grading an answer', async () => {
  const env = setup(true);
  const controller = new AbortController();
  const result = env.recognizeKorean(controller.signal);
  controller.abort();
  env.notify(['late result']);
  assert.equal((await result).transcripts.length, 0);
});
