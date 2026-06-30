import { syllabusBlocks, type Technique } from "./examData";
import { keyTerms } from "./keyTerms";

export type DictionaryEntry = Technique & {
  category: string;
  phase: "keywords" | "techniques";
};

export const keywordDictionary: DictionaryEntry[] = keyTerms.map((item) => ({
  ...item,
  category: `Palabras clave - ${item.group}`,
  phase: "keywords",
}));

export const techniqueDictionary: DictionaryEntry[] = syllabusBlocks.flatMap((block) =>
  block.items.map((item) => ({
    ...item,
    category: block.subtitle,
    phase: "techniques",
  })),
);

export const positionDictionary = techniqueDictionary.filter((entry) => entry.category === "Posiciones");

export const dictionary: DictionaryEntry[] = [...keywordDictionary, ...techniqueDictionary];
