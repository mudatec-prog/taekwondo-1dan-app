export type TechniqueVisual = {
  techniqueId: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  cues: string[];
};

export const techniqueVisuals: TechniqueVisual[] = [
  {
    techniqueId: "are-maki",
    imageUrl: "/techniques/are-maki-v1.png",
    title: "Are Maki",
    subtitle: "Defensa baja",
    cues: [
      "Brazo de defensa firme hacia zona baja",
      "Puno contrario recogido en la cintura",
      "Cadera estable y centro bajo",
      "Mirada al frente antes de finalizar",
    ],
  },
  {
    techniqueId: "momtong-an-maki",
    imageUrl: "/techniques/momtong-an-maki-v1.png",
    title: "Momtong An Maki",
    subtitle: "Defensa media hacia dentro",
    cues: [
      "Antebrazo cruza hacia la linea central",
      "Codo controlado, sin abrir el hombro",
      "Puno contrario recogido en cintura",
      "Foco al nivel medio del atacante",
    ],
  },
  {
    techniqueId: "olgul-maki",
    imageUrl: "/techniques/olgul-maki-v1.png",
    title: "Olgul Maki",
    subtitle: "Defensa alta",
    cues: [
      "Antebrazo protege por encima de la frente",
      "Muneca firme y codo con angulo natural",
      "Hombros relajados, cuello libre",
      "Base estable antes del foco final",
    ],
  },
  {
    techniqueId: "momtong-bakat-maki",
    imageUrl: "/techniques/momtong-bakat-maki-v1.png",
    title: "Momtong Bakat Maki",
    subtitle: "Defensa media hacia fuera",
    cues: [
      "Bloqueo sale desde el centro hacia fuera",
      "Puño a altura media, no demasiado alto",
      "Cadera acompaña el final de la defensa",
      "No pierdas la guardia del brazo contrario",
    ],
  },
  {
    techniqueId: "sonnal-momtong-maki",
    imageUrl: "/techniques/sonnal-momtong-maki-v1.png",
    title: "Sonnal Momtong Maki",
    subtitle: "Defensa media con canto de mano",
    cues: [
      "Mano abierta con canto bien alineado",
      "Mano de apoyo protege la linea media",
      "Mantiene base atrasada y estable",
      "Foco claro al terminar la defensa",
    ],
  },
];

export function getTechniqueVisual(techniqueId: string) {
  return techniqueVisuals.find((visual) => visual.techniqueId === techniqueId);
}
