export type CategoryId =
  | "sogui"
  | "maki"
  | "gongkiok"
  | "pum"
  | "bal"
  | "yonsok"
  | "tuio"
  | "poomsae"
  | "kyorugui";

export type Technique = {
  id: string;
  korean: string;
  spanish: string;
  notes?: string;
};

export type SyllabusBlock = {
  id: CategoryId;
  title: string;
  subtitle: string;
  examCount?: number;
  examMode?: string;
  items: Technique[];
};

export const syllabusBlocks: SyllabusBlock[] = [
  {
    id: "sogui",
    title: "Sogui Kisul",
    subtitle: "Posiciones",
    examCount: 3,
    examMode: "El tribunal pide tres posiciones. Se realizan una sola vez.",
    items: [
      { id: "charyot-sogui", korean: "Charyot Sogui", spanish: "Posicion de atencion" },
      { id: "pionji-sogui", korean: "Pionji Sogui", spanish: "Posicion preparatoria con pies abiertos" },
      { id: "moa-sogui", korean: "Moa Sogui", spanish: "Posicion con pies juntos" },
      { id: "ap-sogui", korean: "Ap Sogui", spanish: "Posicion corta hacia delante" },
      { id: "ap-kubi-sogui", korean: "Ap Kubi Sogui", spanish: "Posicion larga frontal" },
      { id: "chuchum-sogui", korean: "Chuchum Sogui", spanish: "Posicion de jinete" },
      { id: "bom-sogui", korean: "Bom Sogui", spanish: "Posicion de tigre" },
      { id: "tuit-kubi-sogui", korean: "Tuit Kubi Sogui", spanish: "Posicion atrasada" },
      { id: "tuit-koa-sogui", korean: "Tuit Koa Sogui", spanish: "Posicion cruzada por detras" },
      { id: "naranji-sogui", korean: "Naranji Sogui", spanish: "Posicion paralela" },
      { id: "uen-sogui", korean: "Uen Sogui", spanish: "Posicion izquierda" },
      { id: "orun-sogui", korean: "Orun Sogui", spanish: "Posicion derecha" },
    ],
  },
  {
    id: "maki",
    title: "Son Kisul Maki",
    subtitle: "Defensas con las manos",
    examCount: 3,
    examMode: "Una tecnica en un sogui determinado, dos veces hacia delante y dos hacia atras.",
    items: [
      { id: "are-maki", korean: "Are Maki", spanish: "Defensa baja" },
      { id: "momtong-an-maki", korean: "Momtong An Maki", spanish: "Defensa media hacia dentro" },
      { id: "momtong-maki", korean: "Momtong Maki", spanish: "Defensa media" },
      { id: "olgul-maki", korean: "Olgul Maki", spanish: "Defensa alta" },
      { id: "jansonnal-momtong-bakat-maki", korean: "Jansonnal Momtong Bakat Maki", spanish: "Defensa media exterior con canto de una mano" },
      { id: "sonnal-momtong-maki", korean: "Sonnal Momtong Maki", spanish: "Defensa media con canto de mano" },
      { id: "momtong-bakat-maki", korean: "Momtong Bakat Maki", spanish: "Defensa media hacia fuera" },
      { id: "olgul-bakat-maki", korean: "Olgul Bakat Maki", spanish: "Defensa alta hacia fuera" },
      { id: "gechio-are-maki", korean: "Gechio Are Maki", spanish: "Defensa baja abriendo" },
      { id: "batagson-momtong-maki", korean: "Batagson Momtong Maki", spanish: "Defensa media con base de la palma" },
      { id: "batagson-momtong-an-maki", korean: "Batagson Momtong An Maki", spanish: "Defensa media interior con base de la palma" },
      { id: "sonnal-are-maki", korean: "Sonnal Are Maki", spanish: "Defensa baja con canto de mano" },
      { id: "goduro-batagson-momtong-an-maki", korean: "Goduro Batagson Momtong An Maki", spanish: "Defensa media interior asistida con base de la palma" },
      { id: "gechio-momtong-maki", korean: "Gechio Momtong Maki", spanish: "Defensa media abriendo" },
      { id: "okgoro-are-maki", korean: "Okgoro Are Maki", spanish: "Defensa baja cruzada" },
      { id: "jansonnal-momtong-yop-maki", korean: "Jansonnal Momtong Yop Maki", spanish: "Defensa lateral media con canto de una mano" },
      { id: "goduro-momtong-maki", korean: "Goduro Momtong Maki", spanish: "Defensa media asistida" },
      { id: "goduro-are-maki", korean: "Goduro Are Maki", spanish: "Defensa baja asistida" },
    ],
  },
  {
    id: "gongkiok",
    title: "Son Kisul Gong Kiok",
    subtitle: "Ataques con las manos",
    examCount: 3,
    examMode: "Una tecnica en un sogui determinado, dos veces hacia delante y dos hacia atras.",
    items: [
      { id: "momtong-bande-jirugui", korean: "Momtong Bande Jirugui", spanish: "Puno medio con el lado de la pierna atrasada" },
      { id: "momtong-baro-jirugui", korean: "Momtong Baro Jirugui", spanish: "Puno medio con el lado de la pierna adelantada" },
      { id: "olgul-bande-jirugui", korean: "Olgul Bande Jirugui", spanish: "Puno alto en bande" },
      { id: "momtong-dubong-jirugui", korean: "Momtong Dubong Jirugui", spanish: "Doble puno medio" },
      { id: "sonnal-an-chigui", korean: "Sonnal An Chigui", spanish: "Golpe hacia dentro con canto de mano" },
      { id: "pioson-kut-seuo-chirugui", korean: "Pioson Kut Seuo Chirugui", spanish: "Ataque vertical con punta de dedos" },
      { id: "dung-chumok-ape-chigui", korean: "Dung Chumok Ape Chigui", spanish: "Golpe frontal con reverso del puno" },
      { id: "me-chumok-neryo-yop-chigui", korean: "Me Chumok Neryo Yop Chigui", spanish: "Golpe lateral descendente de martillo" },
      { id: "palkup-dollio-chigui", korean: "Palkup Dollio Chigui", spanish: "Golpe circular de codo" },
      { id: "du-checho-jirugui", korean: "Du Checho Jirugui", spanish: "Doble puno girado hacia arriba" },
      { id: "dung-chumok-bakat-chigui", korean: "Dung Chumok Bakat Chigui", spanish: "Golpe hacia fuera con reverso del puno" },
      { id: "yop-jirugui", korean: "Yop Jirugui", spanish: "Puno lateral" },
    ],
  },
  {
    id: "pum",
    title: "Pum",
    subtitle: "Movimientos especiales",
    examCount: 2,
    examMode: "El tribunal pide dos tecnicas. Cada una se realiza una vez en su posicion propia.",
    items: [
      { id: "kibon-chumbi", korean: "Kibon Chumbi", spanish: "Preparacion basica" },
      { id: "chebipum-mok-chigui", korean: "Chebipum Mok Chigui", spanish: "Golpe al cuello en movimiento de golondrina" },
      { id: "momtong-piochok-palkup-chigui", korean: "Momtong Piochok Palkup Chigui", spanish: "Golpe de codo al blanco a nivel medio" },
      { id: "bituro-jansonnal-olgul-bakat-maki", korean: "Bituro Jansonnal Olgul Bakat Maki", spanish: "Defensa alta exterior retorcida con canto de una mano" },
      { id: "bo-chumok-chumbi", korean: "Bo Chumok Chumbi", spanish: "Preparacion con puno cubierto" },
      { id: "gawi-maki", korean: "Gawi Maki", spanish: "Defensa en tijera" },
      { id: "dangkio-ollyo-murup-chigui", korean: "Dangkio Ollyo Murup Chigui", spanish: "Rodillazo ascendente agarrando" },
      { id: "piochok-chagui", korean: "Piochok Chagui", spanish: "Patada al blanco" },
      { id: "oe-santul-maki", korean: "Oe Santul Maki", spanish: "Defensa de montana de un lado" },
      { id: "dangkio-tok-jirugui", korean: "Dangkio Tok Jirugui", spanish: "Puno al menton agarrando" },
    ],
  },
  {
    id: "bal",
    title: "Bal Kisul",
    subtitle: "Tecnicas de pierna",
    examCount: 3,
    examMode: "El tribunal pide tres patadas. Se realizan dos repeticiones sobre el mismo sitio.",
    items: [
      { id: "ap-chagui", korean: "Ap Chagui", spanish: "Patada frontal" },
      { id: "dollyo-chagui", korean: "Dollyo Chagui", spanish: "Patada circular" },
      { id: "yop-chagui", korean: "Yop Chagui", spanish: "Patada lateral" },
      { id: "tuit-chagui", korean: "Tuit Chagui", spanish: "Patada hacia atras" },
      { id: "nacko-chagui", korean: "Nacko Chagui", spanish: "Patada en gancho" },
      { id: "furio-chagui", korean: "Furio Chagui", spanish: "Patada de latigo" },
      { id: "neryo-chagui", korean: "Neryo Chagui", spanish: "Patada descendente" },
      { id: "mom-dollyo-yop-chagui", korean: "Mom Dollyo Yop Chagui", spanish: "Patada lateral con giro del cuerpo" },
      { id: "mom-dollyo-tuit-chagui", korean: "Mom Dollyo Tuit Chagui", spanish: "Patada atras con giro del cuerpo" },
      { id: "mom-dollyo-nacko-chagui", korean: "Mom Dollyo Nacko Chagui", spanish: "Patada de gancho con giro del cuerpo" },
      { id: "mom-dollyo-furio-chagui", korean: "Mom Dollyo Furio Chagui", spanish: "Patada de latigo con giro del cuerpo" },
    ],
  },
  {
    id: "yonsok",
    title: "Yonsok Dong Chak",
    subtitle: "Combinaciones de piernas",
    examCount: 2,
    examMode: "El tribunal pide dos combinaciones. Se avanza y se vuelve al punto de partida andando hacia atras.",
    items: [
      { id: "neryo-ap-yop", korean: "Neryo Chagui, Ap Chagui, Yop Chagui", spanish: "Descendente, frontal y lateral" },
      { id: "yop-dollyo-mom-dollyo-tuit", korean: "Yop Chagui, Dollyo Chagui, Mom Dollyo Tuit Chagui", spanish: "Lateral, circular y atras con giro" },
      { id: "ap-nacko-dollyo", korean: "Ap Chagui, Nacko Chagui, Dollyo Chagui", spanish: "Frontal, gancho y circular" },
      { id: "dollyo-yop-mom-dollyo-nacko", korean: "Dollyo Chagui, Yop Chagui, Mom Dollyo Nacko Chagui", spanish: "Circular, lateral y gancho con giro" },
      { id: "nacko-dollyo-mom-dollyo-yop", korean: "Nacko Chagui, Dollyo Chagui, Mom Dollyo Yop Chagui", spanish: "Gancho, circular y lateral con giro" },
      { id: "furio-yop-neryo", korean: "Furio Chagui, Yop Chagui, Neryo Chagui", spanish: "Latigo, lateral y descendente" },
    ],
  },
  {
    id: "tuio",
    title: "Tuio",
    subtitle: "Patadas en salto",
    examCount: 2,
    examMode: "El tribunal pide dos Tuio. Se realiza una vez con cada pierna.",
    items: [
      { id: "tuio-ap-chagui", korean: "Tuio Ap Chagui", spanish: "Patada frontal en salto" },
      { id: "tuio-yop-chagui", korean: "Tuio Yop Chagui", spanish: "Patada lateral en salto" },
      { id: "tuio-tuit-chagui", korean: "Tuio Tuit Chagui", spanish: "Patada atras en salto" },
      { id: "tuio-dollyo-chagui", korean: "Tuio Dollyo Chagui", spanish: "Patada circular en salto" },
      { id: "tuio-mom-dollyo-tuit-chagui", korean: "Tuio Mom Dollyo Tuit Chagui", spanish: "Patada atras en salto con giro" },
      { id: "tuio-mom-dollyo-yop-chagui", korean: "Tuio Mom Dollyo Yop Chagui", spanish: "Patada lateral en salto con giro" },
    ],
  },
  {
    id: "poomsae",
    title: "Poomsae",
    subtitle: "Formas",
    examCount: 2,
    examMode: "Minimo dos Poomsae: uno aleatorio del 1 al 7 y Taeguk Pal Chang obligatorio.",
    items: [
      { id: "taeguk-1", korean: "Taeguk Il Chang", spanish: "Taeguk 1" },
      { id: "taeguk-2", korean: "Taeguk I Chang", spanish: "Taeguk 2" },
      { id: "taeguk-3", korean: "Taeguk Sam Chang", spanish: "Taeguk 3" },
      { id: "taeguk-4", korean: "Taeguk Sa Chang", spanish: "Taeguk 4" },
      { id: "taeguk-5", korean: "Taeguk Oh Chang", spanish: "Taeguk 5" },
      { id: "taeguk-6", korean: "Taeguk Yuk Chang", spanish: "Taeguk 6" },
      { id: "taeguk-7", korean: "Taeguk Chil Chang", spanish: "Taeguk 7" },
      { id: "taeguk-8", korean: "Taeguk Pal Chang", spanish: "Taeguk 8 obligatorio" },
    ],
  },
  {
    id: "kyorugui",
    title: "Kyorugui",
    subtitle: "Combate",
    examMode: "Sebon Kyorugui, Hanbon Kyorugui y combate si no se acredita antes del examen.",
    items: [
      { id: "sebon-kyorugui", korean: "Sebon Kyorugui", spanish: "Tres pasos: tres defensas y contraataques a Olgul y Momtong" },
      { id: "hanbon-kyorugui", korean: "Hanbon Kyorugui", spanish: "Un paso: cinco defensas y contraataques a Olgul y Momtong" },
      { id: "kyorugui", korean: "Kyorugui", spanish: "Combate" },
      { id: "olgul", korean: "Olgul", spanish: "Nivel alto" },
      { id: "momtong", korean: "Momtong", spanish: "Nivel medio" },
      { id: "ap-kubi-are-maki", korean: "Ap Kubi Are Maki", spanish: "Posicion de inicio para ataques en Kyorugui tradicional" },
    ],
  },
];

export const examRules = [
  { category: "sogui" as const, label: "Posiciones", count: 3 },
  { category: "maki" as const, label: "Defensas", count: 3 },
  { category: "gongkiok" as const, label: "Ataques", count: 3 },
  { category: "pum" as const, label: "Pum", count: 2 },
  { category: "bal" as const, label: "Patadas", count: 3 },
  { category: "yonsok" as const, label: "Combinaciones de pierna", count: 2 },
  { category: "tuio" as const, label: "Tuio", count: 2 },
];

export const ownCombinationRequirements = [
  "Combinacion de creacion propia tipo Poomsae",
  "Minimo 20 movimientos",
  "Debe incluir Gechio Are Maki",
  "Debe incluir Jansonnal Momtong Bakat Maki",
  "Debe incluir Pioson Kut Seuo Chirugui",
  "Debe incluir Dung Chumok Bakat Chigui",
  "Debe incluir tecnicas de pierna del nivel",
  "Debe tener logica, aplicacion y secuencia de Poomsae",
];

export const checklistItems = [
  "Correcta ejecucion tecnica",
  "Potencia y fuerza",
  "Equilibrio",
  "Estetica",
  "Concentracion",
  "Coordinacion de movimientos",
  "Finalizar Poomsae en el punto inicial",
  "Final de los movimientos (Foco)",
];
