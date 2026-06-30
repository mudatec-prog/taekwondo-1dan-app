# Taekwondo 1er DAN Exam Trainer

Web app responsive para preparar el examen de cinturon negro 1er DAN de Taekwondo.

La base de datos inicial se ha construido a partir del temario oficial `12.- 1 DAN.pdf`.
El flujo de estudio prioriza el reconocimiento rapido del coreano para responder a lo que pide el tribunal.

## Stack

- React + Vite
- TypeScript
- Tailwind CSS
- Persistencia local con `localStorage`
- Sin backend

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Estructura

```text
src/
  data/
    examData.ts
    dictionary.ts
  components/
    Layout.tsx
    Dashboard.tsx
    Dictionary.tsx
    Flashcards.tsx
    SyllabusBlock.tsx
    ExamSimulator.tsx
    Checklist.tsx
  hooks/
    useLocalProgress.ts
  App.tsx
```
