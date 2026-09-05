import { useEffect, useMemo, useState } from "react";
import { applyAnswer, emptyLearning, type AnswerEvent, type LearningState } from "../utils/learning";

export type FlashcardStatus = "known" | "unknown";
export type TribunalResult = "correct" | "wrong";

export type TribunalStats = {
  correct: number;
  wrong: number;
  lastResult?: TribunalResult;
};

type ProgressState = {
  flashcards: Record<string, FlashcardStatus>;
  checklist: Record<string, boolean>;
  poomsae: Record<string, Record<string, boolean>>;
  tribunal: Record<string, TribunalStats>;
  learning: LearningState;
};

const STORAGE_KEY = "taekwondo-1dan-progress";

const initialProgress: ProgressState = {
  flashcards: {},
  checklist: {},
  poomsae: {},
  tribunal: {},
  learning: emptyLearning(),
};

function readProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialProgress;
    const parsed = JSON.parse(stored);
    const learning = parsed?.learning;
    return { ...initialProgress, ...parsed, learning: learning && typeof learning.terms === "object"
      && learning.terms && typeof learning.days === "object" && learning.days
      && Number.isFinite(learning.xp) && Array.isArray(learning.recentAttempts) ? learning : emptyLearning() };
  } catch {
    return initialProgress;
  }
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // The app should keep working even if storage is unavailable or full.
    }
  }, [progress]);

  const actions = useMemo(
    () => ({
      recordQuizAnswer(answer: AnswerEvent) {
        setProgress((current) => {
          const learning = applyAnswer(current.learning, answer);
          if (learning === current.learning) return current;
          const previous = current.tribunal[answer.termId] ?? { correct: 0, wrong: 0 };
          return { ...current, learning,
            flashcards: { ...current.flashcards, [answer.termId]: learning.terms[answer.termId].strength >= 3 ? "known" : "unknown" },
            tribunal: { ...current.tribunal, [answer.termId]: {
              correct: previous.correct + Number(answer.correct), wrong: previous.wrong + Number(!answer.correct),
              lastResult: answer.correct ? "correct" : "wrong",
            } },
          };
        });
      },
      markFlashcard(id: string, status: FlashcardStatus) {
        setProgress((current) => ({
          ...current,
          flashcards: { ...current.flashcards, [id]: status },
        }));
      },
      toggleChecklist(id: string) {
        setProgress((current) => ({
          ...current,
          checklist: { ...current.checklist, [id]: !current.checklist[id] },
        }));
      },
      resetFlashcards() {
        setProgress((current) => ({ ...current, flashcards: {} }));
      },
      resetChecklist() {
        setProgress((current) => ({ ...current, checklist: {} }));
      },
      togglePoomsaeStep(poomsaeId: string, stepId: string) {
        setProgress((current) => ({
          ...current,
          poomsae: {
            ...current.poomsae,
            [poomsaeId]: {
              ...current.poomsae[poomsaeId],
              [stepId]: !current.poomsae[poomsaeId]?.[stepId],
            },
          },
        }));
      },
      recordTribunalResult(id: string, result: TribunalResult) {
        setProgress((current) => {
          const currentStats = current.tribunal[id] ?? { correct: 0, wrong: 0 };
          return {
            ...current,
            tribunal: {
              ...current.tribunal,
              [id]: {
                correct: currentStats.correct + (result === "correct" ? 1 : 0),
                wrong: currentStats.wrong + (result === "wrong" ? 1 : 0),
                lastResult: result,
              },
            },
          };
        });
      },
    }),
    [],
  );

  return { progress, ...actions };
}
