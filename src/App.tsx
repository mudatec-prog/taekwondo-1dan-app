import { useState } from "react";
import { Checklist } from "./components/Checklist";
import { Dashboard } from "./components/Dashboard";
import { Dictionary } from "./components/Dictionary";
import { ExamSimulator } from "./components/ExamSimulator";
import { QuizTrainer } from "./components/QuizTrainer";
import { Layout, type ViewId } from "./components/Layout";
import { PoomsaeTrainer } from "./components/PoomsaeTrainer";
import { SyllabusBlock } from "./components/SyllabusBlock";
import { syllabusBlocks } from "./data/examData";
import { useLocalProgress } from "./hooks/useLocalProgress";

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const {
    progress,
    toggleChecklist,
    resetChecklist,
    togglePoomsaeStep,
    recordQuizAnswer,
  } = useLocalProgress();

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === "dashboard" && (
        <Dashboard
          learning={progress.learning}
          onStartDictionary={() => setActiveView("dictionary")}
          onStartFlashcards={() => setActiveView("flashcards")}
          onStartPoomsae={() => setActiveView("poomsae")}
          onStartExam={() => setActiveView("exam")}
          onOpenSyllabus={() => setActiveView("syllabus")}
          onOpenTribunal={() => setActiveView("tribunal")}
          onOpenChecklist={() => setActiveView("checklist")}
        />
      )}
      {activeView === "dictionary" && <Dictionary />}
      {activeView === "flashcards" && (
        <QuizTrainer key="practice" learning={progress.learning} onAnswer={recordQuizAnswer} />
      )}
      {activeView === "tribunal" && (
        <QuizTrainer key="tribunal" tribunal learning={progress.learning} onAnswer={recordQuizAnswer} />
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
