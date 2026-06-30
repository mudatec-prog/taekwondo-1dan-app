import type { Technique } from "./examData";

export type KeyTerm = Technique & {
  group: "direccion" | "nivel" | "accion" | "arma" | "concepto";
};

export const keyTerms: KeyTerm[] = [
  { id: "key-maki", korean: "Maki", spanish: "Defensa", group: "accion" },
  { id: "key-gong-kiok", korean: "Gong Kiok", spanish: "Ataque", group: "accion" },
  { id: "key-jirugui", korean: "Jirugui", spanish: "Golpear con puno", group: "accion" },
  { id: "key-chigui", korean: "Chigui", spanish: "Golpear", group: "accion" },
  { id: "key-chirugui", korean: "Chirugui", spanish: "Pinchar o atacar penetrando", group: "accion" },
  { id: "key-chagui", korean: "Chagui", spanish: "Patada", group: "accion" },
  { id: "key-sogui", korean: "Sogui", spanish: "Posicion", group: "concepto" },
  { id: "key-chumbi", korean: "Chumbi", spanish: "Preparacion", group: "concepto" },
  { id: "key-kibon", korean: "Kibon", spanish: "Basico", group: "concepto" },
  { id: "key-pum", korean: "Pum", spanish: "Movimiento o forma tecnica", group: "concepto" },
  { id: "key-poomsae", korean: "Poomsae", spanish: "Forma", group: "concepto" },
  { id: "key-kyorugui", korean: "Kyorugui", spanish: "Combate", group: "concepto" },
  { id: "key-chumok", korean: "Chumok", spanish: "Puno", group: "arma" },
  { id: "key-sonnal", korean: "Sonnal", spanish: "Canto de mano", group: "arma" },
  { id: "key-batagson", korean: "Batagson", spanish: "Base de la palma", group: "arma" },
  { id: "key-palkup", korean: "Palkup", spanish: "Codo", group: "arma" },
  { id: "key-murup", korean: "Murup", spanish: "Rodilla", group: "arma" },
  { id: "key-bal", korean: "Bal", spanish: "Pie", group: "arma" },
  { id: "key-ap", korean: "Ap", spanish: "Frente", group: "direccion" },
  { id: "key-tuit", korean: "Tuit", spanish: "Atras", group: "direccion" },
  { id: "key-yop", korean: "Yop", spanish: "Lado", group: "direccion" },
  { id: "key-an", korean: "An", spanish: "Hacia dentro", group: "direccion" },
  { id: "key-bakat", korean: "Bakat", spanish: "Hacia fuera", group: "direccion" },
  { id: "key-dollyo", korean: "Dollyo", spanish: "Circular o girando", group: "direccion" },
  { id: "key-mom-dollyo", korean: "Mom Dollyo", spanish: "Giro del cuerpo", group: "direccion" },
  { id: "key-neryo", korean: "Neryo", spanish: "Descendente", group: "direccion" },
  { id: "key-ollyo", korean: "Ollyo", spanish: "Ascendente", group: "direccion" },
  { id: "key-are", korean: "Are", spanish: "Nivel bajo", group: "nivel" },
  { id: "key-momtong", korean: "Momtong", spanish: "Nivel medio o tronco", group: "nivel" },
  { id: "key-olgul", korean: "Olgul", spanish: "Nivel alto o cara", group: "nivel" },
  { id: "key-wen", korean: "Wen", spanish: "Izquierda", group: "direccion" },
  { id: "key-oreun", korean: "Oreun", spanish: "Derecha", group: "direccion" },
  { id: "key-baro", korean: "Baro", spanish: "Mismo lado que la pierna adelantada", group: "concepto" },
  { id: "key-bande", korean: "Bande", spanish: "Lado contrario a la pierna adelantada", group: "concepto" },
  { id: "key-tuio", korean: "Tuio", spanish: "Salto", group: "accion" },
];
