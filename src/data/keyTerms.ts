import type { Technique } from "./examData";

export type KeyTerm = Technique & {
  group: "direccion" | "nivel" | "accion" | "arma" | "concepto";
};

export const keyTerms: KeyTerm[] = [
  { id: "key-maki", korean: "Maki", speech: "막기", spanish: "Defensa", group: "accion" },
  { id: "key-gong-kiok", korean: "Gong Kiok", speech: "공격", spanish: "Ataque", group: "accion" },
  { id: "key-jirugui", korean: "Jirugui", speech: "지르기", spanish: "Golpear con puno", group: "accion" },
  { id: "key-chigui", korean: "Chigui", speech: "치기", spanish: "Golpear", group: "accion" },
  { id: "key-chirugui", korean: "Chirugui", speech: "찌르기", spanish: "Pinchar o atacar penetrando", group: "accion" },
  { id: "key-chagui", korean: "Chagui", speech: "차기", spanish: "Patada", group: "accion" },
  { id: "key-sogui", korean: "Sogui", speech: "서기", spanish: "Posicion", group: "concepto" },
  { id: "key-chumbi", korean: "Chumbi", speech: "준비", spanish: "Preparacion", group: "concepto" },
  { id: "key-kibon", korean: "Kibon", speech: "기본", spanish: "Basico", group: "concepto" },
  { id: "key-pum", korean: "Pum", speech: "품", spanish: "Movimiento o forma tecnica", group: "concepto" },
  { id: "key-poomsae", korean: "Poomsae", speech: "품새", spanish: "Forma", group: "concepto" },
  { id: "key-kyorugui", korean: "Kyorugui", speech: "겨루기", spanish: "Combate", group: "concepto" },
  { id: "key-chumok", korean: "Chumok", speech: "주먹", spanish: "Puno", group: "arma" },
  { id: "key-sonnal", korean: "Sonnal", speech: "손날", spanish: "Canto de mano", group: "arma" },
  { id: "key-batagson", korean: "Batagson", speech: "바탕손", spanish: "Base de la palma", group: "arma" },
  { id: "key-palkup", korean: "Palkup", speech: "팔굽", spanish: "Codo", group: "arma" },
  { id: "key-murup", korean: "Murup", speech: "무릎", spanish: "Rodilla", group: "arma" },
  { id: "key-bal", korean: "Bal", speech: "발", spanish: "Pie", group: "arma" },
  { id: "key-ap", korean: "Ap", speech: "앞", spanish: "Frente", group: "direccion" },
  { id: "key-tuit", korean: "Tuit", speech: "뒤", spanish: "Atras", group: "direccion" },
  { id: "key-yop", korean: "Yop", speech: "옆", spanish: "Lado", group: "direccion" },
  { id: "key-an", korean: "An", speech: "안", spanish: "Hacia dentro", group: "direccion" },
  { id: "key-bakat", korean: "Bakat", speech: "바깥", spanish: "Hacia fuera", group: "direccion" },
  { id: "key-dollyo", korean: "Dollyo", speech: "돌려", spanish: "Circular o girando", group: "direccion" },
  { id: "key-mom-dollyo", korean: "Mom Dollyo", speech: "몸 돌려", spanish: "Giro del cuerpo", group: "direccion" },
  { id: "key-neryo", korean: "Neryo", speech: "내려", spanish: "Descendente", group: "direccion" },
  { id: "key-ollyo", korean: "Ollyo", speech: "올려", spanish: "Ascendente", group: "direccion" },
  { id: "key-are", korean: "Are", speech: "아래", spanish: "Nivel bajo", group: "nivel" },
  { id: "key-momtong", korean: "Momtong", speech: "몸통", spanish: "Nivel medio o tronco", group: "nivel" },
  { id: "key-olgul", korean: "Olgul", speech: "얼굴", spanish: "Nivel alto o cara", group: "nivel" },
  { id: "key-wen", korean: "Wen", speech: "왼", spanish: "Izquierda", group: "direccion" },
  { id: "key-oreun", korean: "Oreun", speech: "오른", spanish: "Derecha", group: "direccion" },
  { id: "key-baro", korean: "Baro", speech: "바로", spanish: "Mismo lado que la pierna adelantada", group: "concepto" },
  { id: "key-bande", korean: "Bande", speech: "반대", spanish: "Lado contrario a la pierna adelantada", group: "concepto" },
  { id: "key-tuio", korean: "Tuio", speech: "뛰어", spanish: "Salto", group: "accion" },
];
