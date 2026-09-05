import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const compiled = ts.transpileModule(readFileSync(new URL('../src/utils/speech.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;

function setup(bridge) {
  const timers = new Map();
  let timerId = 0;
  const spoken = [];
  const window = new EventTarget();
  const synth = {
    getVoices: () => [{ lang: 'ko-KR' }],
    speak: (utterance) => spoken.push(utterance),
    cancel: () => {},
    resume: () => {},
  };
  Object.assign(window, {
    speechSynthesis: synth,
    SpeechSynthesisUtterance: class {},
    TaekwondoAndroid: bridge,
    setTimeout: (fn) => { timers.set(++timerId, fn); return timerId; },
    clearTimeout: (id) => timers.delete(id),
  });
  const context = vm.createContext({ window, navigator: { userAgent: 'test' }, exports: {}, SpeechSynthesisUtterance: window.SpeechSynthesisUtterance });
  vm.runInContext(compiled, context);
  return {
    speak: context.exports.speakKorean,
    spoken,
    timeout: () => [...timers.values()].forEach((fn) => fn()),
    notify: (id, status) => {
      const event = new Event('taekwondo-speech');
      event.detail = { id, status };
      window.dispatchEvent(event);
    },
  };
}

test('silent browser fails instead of reporting success after a timeout', async () => {
  const env = setup();
  const result = env.speak('test');
  assert.equal(env.spoken.length, 1, 'speech must be requested synchronously during the tap');
  env.timeout();
  assert.equal((await result).ok, false);
});

test('browser start is required for success', async () => {
  const env = setup();
  const result = env.speak('test');
  env.spoken[0].onstart();
  assert.equal((await result).ok, true);
});

test('missing browser voice reports a useful error', async () => {
  const env = setup();
  const result = env.speak('test');
  env.spoken[0].onerror({ error: 'language-unavailable' });
  assert.match((await result).message, /Instala Coreano/);
});

test('native result must match the current utterance', async () => {
  let id;
  const env = setup({ speakKoreanWithId: (_, requestId) => { id = requestId; } });
  const result = env.speak('test');
  env.notify('old-request', 'started');
  env.notify(id, 'missing_language');
  assert.equal((await result).ok, false);
});

test('native playback waits for engine start', async () => {
  let id;
  const env = setup({ speakKoreanWithId: (_, requestId) => { id = requestId; } });
  const result = env.speak('test');
  env.notify(id, 'started');
  assert.equal((await result).source, 'android');
});

test('unresponsive native engine reports a timeout', async () => {
  const env = setup({ speakKoreanWithId: () => {} });
  const result = env.speak('test');
  env.timeout();
  assert.equal((await result).ok, false);
});

test('old Android bridge requests an update instead of using a silent WebView', async () => {
  const env = setup({ speakKorean: () => 'spoken' });
  assert.match((await env.speak('test')).message, /actualizacion/);
  assert.equal(env.spoken.length, 0);
});

test('a new request settles the previous pending request', async () => {
  const env = setup();
  const first = env.speak('first');
  const second = env.speak('second');
  env.spoken[1].onstart();
  assert.equal((await first).ok, false);
  assert.equal((await second).ok, true);
});
