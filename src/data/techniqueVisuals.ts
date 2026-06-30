export type TechniqueVisual = {
  techniqueId: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  reviewStatus: "reviewed" | "needs-master-review";
  reviewNote: string;
  cues: string[];
};

export const techniqueVisuals: TechniqueVisual[] = [
  {
    techniqueId: "are-maki",
    imageUrl: "/techniques/are-maki-v1.png",
    title: "Are Maki",
    subtitle: "Defensa baja",
    reviewStatus: "needs-master-review",
    reviewNote: "Prototipo visual: validar con maestro antes de usar como referencia definitiva.",
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
    reviewStatus: "needs-master-review",
    reviewNote: "Puño contrario recogido; revisar posicion exacta y angulo del bloqueo con maestro.",
    cues: [
      "Antebrazo cruza hacia la linea central",
      "Codo controlado, sin abrir el hombro",
      "Puno contrario recogido en cintura",
      "Foco al nivel medio del atacante",
    ],
  },
  {
    techniqueId: "momtong-maki",
    imageUrl: "/techniques/momtong-maki-v1.png",
    title: "Momtong Maki",
    subtitle: "Defensa media",
    reviewStatus: "needs-master-review",
    reviewNote: "Prototipo con puño contrario recogido; validar angulo exacto del antebrazo y posicion con maestro.",
    cues: [
      "Bloqueo a nivel medio del tronco",
      "Antebrazo firme delante de la linea central",
      "Puno contrario recogido en cintura",
      "Base estable y mirada al objetivo",
    ],
  },
  {
    techniqueId: "olgul-maki",
    imageUrl: "/techniques/olgul-maki-v1.png",
    title: "Olgul Maki",
    subtitle: "Defensa alta",
    reviewStatus: "reviewed",
    reviewNote: "Corregida: brazo de bloqueo alto y puño contrario recogido en cintura/cadera.",
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
    reviewStatus: "needs-master-review",
    reviewNote: "Puño contrario recogido; revisar trayectoria y angulo final con maestro.",
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
    reviewStatus: "needs-master-review",
    reviewNote: "Prototipo delicado por mano abierta y mano de apoyo; validar con maestro.",
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
