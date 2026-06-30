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
];

export function getTechniqueVisual(techniqueId: string) {
  return techniqueVisuals.find((visual) => visual.techniqueId === techniqueId);
}
