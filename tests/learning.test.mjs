import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { build } from 'esbuild';

const bundle = await build({ entryPoints: ['src/utils/learning.ts'], bundle: true, write: false, format: 'cjs', platform: 'node' });
const context = vm.createContext({ module: { exports: {} } });
vm.runInContext(bundle.outputFiles[0].text, context);
const { applyAnswer, emptyLearning, streak, shiftDay, matchesKorean, optionsFor, createQuestions, getDeck } = context.module.exports;
const answer = (id, day, correct = true, retry = false) => ({ attemptId: id, termId: 'key-maki', day, correct, retry });

test('replaying a saved answer cannot award duplicate XP', () => {
  const event = answer('round:0', '2026-09-05');
  const first = applyAnswer(emptyLearning(), event);
  assert.equal(applyAnswer(first, event), first);
  assert.equal(first.xp, 10);
  assert.equal(first.days['2026-09-05'].answers, 1);
});

test('same-day repetition does not manufacture mastery', () => {
  let state = emptyLearning();
  for (let i = 0; i < 20; i++) state = applyAnswer(state, answer(String(i), '2026-09-05'));
  assert.equal(state.terms['key-maki'].strength, 1);
  state = applyAnswer(state, answer('next-day', '2026-09-06'));
  assert.equal(state.terms['key-maki'].strength, 2);
});

test('a failed answer returns to review and a retry earns reduced XP', () => {
  let state = applyAnswer(emptyLearning(), answer('first', '2026-09-05', false));
  assert.equal(state.terms['key-maki'].due, '2026-09-05');
  state = applyAnswer(state, answer('retry', '2026-09-05', true, true));
  assert.equal(state.xp, 7);
  assert.equal(state.terms['key-maki'].strength, 0);
  assert.equal(state.terms['key-maki'].due, '2026-09-06');
});

test('streak survives until the end of today and resets after a missed day', () => {
  const state = emptyLearning();
  state.days = { '2026-09-03': { answers: 8 }, '2026-09-04': { answers: 8 } };
  assert.equal(streak(state, '2026-09-05'), 2);
  assert.equal(streak(state, '2026-09-06'), 0);
  assert.equal(shiftDay('2026-03-29', 1), '2026-03-30');
  assert.equal(shiftDay('2026-01-01', -1), '2025-12-31');
});

test('written answers accept romanization variants but reject another technique', () => {
  const entry = { korean: 'Are Maki', speech: '\uC544\uB798 \uB9C9\uAE30' };
  assert.equal(matchesKorean(entry, ' arae-makki '), true);
  assert.equal(matchesKorean(entry, '\uC544\uB798\uB9C9\uAE30'), true);
  assert.equal(matchesKorean(entry, 'Maki'), false);
  assert.equal(matchesKorean(entry, 'Olgul Maki'), false);
  assert.equal(matchesKorean(entry, ' '), false);
});

test('every question has four distinct choices and exactly one expected answer', () => {
  for (const entry of getDeck('techniques', emptyLearning()).concat(getDeck('keywords', emptyLearning()))) {
    const options = optionsFor(entry);
    assert.equal(options.length, 4, entry.id);
    assert.equal(new Set(options).size, 4, entry.id);
    assert.equal(options.filter((text) => text === entry.spanish).length, 1, entry.id);
  }
});

test('new learners start with keywords; empty review produces no fake round', () => {
  const state = emptyLearning();
  const questions = createQuestions('daily', 'mixed', state);
  assert.equal(questions.length, 8);
  assert.equal(new Set(questions.map((question) => question.entryId)).size, 8);
  assert.ok(questions.every((question) => question.entryId.startsWith('key-')));
  assert.equal(createQuestions('review', 'mixed', state).length, 0);
});

test('due words have priority over new words', () => {
  const state = applyAnswer(emptyLearning(), answer('wrong', '2026-09-05', false));
  const questions = createQuestions('daily', 'choice', state, '2026-09-05');
  assert.equal(questions[0].entryId, 'key-maki');
});
