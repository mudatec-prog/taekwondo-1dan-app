import { useState } from "react";
import { Checklist } from "./components/Checklist";
import { Dashboard } from "./components/Dashboard";
import { Dictionary } from "./components/Dictionary";
import { ExamSimulator } from "./components/ExamSimulator";
import { Flashcards } from "./components/Flashcards";
import { Layout, type ViewId } from "./components/Layout";
import { PoomsaeTrainer } from "./components/PoomsaeTrainer";
import { SyllabusBlock } from "./components/SyllabusBlock";
import { TribunalMode } from "./components/TribunalMode";
import { syllabusBlocks } from "./data/examData";
import { useLocalProgress } from "./hooks/useLocalProgress";

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const {
    progress,
    markFlashcard,
    resetFlashcards,
    toggleChecklist,
    resetChecklist,
    togglePoomsaeStep,
    recordTribunalResult,
  } = useLocalProgress();

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === "dashboard" && (
        <Dashboard
          flashcards={progress.flashcards}
          checklist={progress.checklist}
          onStartFlashcards={() => setActiveView("flashcards")}
          onStartExam={() => setActiveView("exam")}
        />
      )}
      {activeView === "dictionary" && <Dictionary />}
      {activeView === "flashcards" && (
        <Flashcards
          flashcards={progress.flashcards}
          onMark={markFlashcard}
          onReset={resetFlashcards}
        />
      )}
      {activeView === "tribunal" && (
        <TribunalMode
          stats={progress.tribunal}
          onRecordResult={recordTribunalResult}
        />
      )}
      {activeView === "syllabus" && (
        <SyllabusBlock blocks={syllabusBlocks} flashcards={progress.flashcards} />
      )}
      {activeView === "poomsae" && (
        <PoomsaeTrainer
          masteredSteps={progress.poomsae}
          onToggleStep={togglePoomsaeStep}
        />
      )}
      {activeView === "exam" && <ExamSimulator />}
      {activeView === "checklist" && (
        <Checklist
          checked={progress.checklist}
          onToggle={toggleChecklist}
          onReset={resetChecklist}
        />
      )}
    </Layout>
  );
}
