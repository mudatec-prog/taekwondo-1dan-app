import { useEffect, useMemo, useState } from "react";

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
};

const STORAGE_KEY = "taekwondo-1dan-progress";

const initialProgress: ProgressState = {
  flashcards: {},
  checklist: {},
  poomsae: {},
  tribunal: {},
};

function readProgress(): ProgressState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...initialProgress, ...JSON.parse(stored) } : initialProgress;
  } catch {
    return initialProgress;
  }
}

export function useLocalProgress() {
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const actions = useMemo(
    () => ({
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
