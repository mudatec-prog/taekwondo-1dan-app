import type { Technique } from "./examData";

export type KeyTerm = Technique & {
  group:
    | "direccion"
    | "nivel"
    | "accion"
    | "arma"
    | "concepto"
    | "conteo"
    | "orden"
    | "protocolo"
    | "cotidiano";
};

export const keyTermGroups: Array<{ id: KeyTerm["group"]; label: string }> = [
  { id: "accion", label: "Acciones" },
  { id: "direccion", label: "Direccion" },
  { id: "nivel", label: "Niveles" },
  { id: "arma", label: "Armas" },
  { id: "concepto", label: "Conceptos" },
  { id: "conteo", label: "Contar" },
  { id: "orden", label: "Ordenes" },
  { id: "protocolo", label: "Saludo" },
  { id: "cotidiano", label: "Dojang" },
];

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
  { id: "key-hana", korean: "Hana", speech: "하나", spanish: "Uno", group: "conteo" },
  { id: "key-dul", korean: "Dul", speech: "둘", spanish: "Dos", group: "conteo" },
  { id: "key-set", korean: "Set", speech: "셋", spanish: "Tres", group: "conteo" },
  { id: "key-net", korean: "Net", speech: "넷", spanish: "Cuatro", group: "conteo" },
  { id: "key-daseot", korean: "Daseot", speech: "다섯", spanish: "Cinco", group: "conteo" },
  { id: "key-yeoseot", korean: "Yeoseot", speech: "여섯", spanish: "Seis", group: "conteo" },
  { id: "key-ilgop", korean: "Ilgop", speech: "일곱", spanish: "Siete", group: "conteo" },
  { id: "key-yeodeol", korean: "Yeodeol", speech: "여덟", spanish: "Ocho", group: "conteo" },
  { id: "key-ahop", korean: "Ahop", speech: "아홉", spanish: "Nueve", group: "conteo" },
  { id: "key-yeol", korean: "Yeol", speech: "열", spanish: "Diez", group: "conteo" },
  { id: "key-charyot", korean: "Charyot", speech: "차렷", spanish: "Firmes / atencion", group: "orden" },
  { id: "key-kyeongnye", korean: "Kyeongnye", speech: "경례", spanish: "Saludar / reverencia", group: "orden" },
  { id: "key-jumbi", korean: "Jumbi", speech: "준비", spanish: "Preparados", group: "orden" },
  { id: "key-sijak", korean: "Sijak", speech: "시작", spanish: "Comenzar", group: "orden" },
  { id: "key-geuman", korean: "Geuman", speech: "그만", spanish: "Parar / detener", group: "orden" },
  { id: "key-gallyeo", korean: "Gallyeo", speech: "갈려", spanish: "Separarse / alto en combate", group: "orden" },
  { id: "key-gyesok", korean: "Gyesok", speech: "계속", spanish: "Continuar", group: "orden" },
  { id: "key-baro-order", korean: "Baro", speech: "바로", spanish: "Volver / recuperar posicion", group: "orden" },
  { id: "key-swiyo", korean: "Swiyo", speech: "쉬어", spanish: "Descanso", group: "orden" },
  { id: "key-dwiro-dora", korean: "Dwiro Dora", speech: "뒤로 돌아", spanish: "Media vuelta / girarse", group: "orden" },
  { id: "key-dobok", korean: "Dobok", speech: "도복", spanish: "Uniforme de taekwondo", group: "cotidiano" },
  { id: "key-ti", korean: "Ti", speech: "띠", spanish: "Cinturon", group: "cotidiano" },
  { id: "key-dojang", korean: "Dojang", speech: "도장", spanish: "Sala de entrenamiento", group: "cotidiano" },
  { id: "key-sabomnim", korean: "Sabomnim", speech: "사범님", spanish: "Maestro / profesor", group: "protocolo" },
  { id: "key-kwanjangnim", korean: "Kwanjangnim", speech: "관장님", spanish: "Director de escuela / gran maestro", group: "protocolo" },
  { id: "key-seonsaengnim", korean: "Seonsaengnim", speech: "선생님", spanish: "Profesor / senor maestro", group: "protocolo" },
  { id: "key-annyeonghaseyo", korean: "Annyeonghaseyo", speech: "안녕하세요", spanish: "Hola / saludo respetuoso", group: "protocolo" },
  { id: "key-gamsahamnida", korean: "Gamsahamnida", speech: "감사합니다", spanish: "Gracias", group: "protocolo" },
  { id: "key-sugohaesseumnida", korean: "Sugohaesseumnida", speech: "수고하셨습니다", spanish: "Gracias por el trabajo / buen entrenamiento", group: "protocolo" },
  { id: "key-mianhamnida", korean: "Mianhamnida", speech: "미안합니다", spanish: "Lo siento / disculpa formal", group: "protocolo" },
  { id: "key-ne", korean: "Ne", speech: "네", spanish: "Si", group: "cotidiano" },
  { id: "key-aniyo", korean: "Aniyo", speech: "아니요", spanish: "No", group: "cotidiano" },
  { id: "key-ppalli", korean: "Ppalli", speech: "빨리", spanish: "Rapido", group: "cotidiano" },
  { id: "key-cheoncheonhi", korean: "Cheoncheonhi", speech: "천천히", spanish: "Despacio", group: "cotidiano" },
  { id: "key-dasi", korean: "Dasi", speech: "다시", spanish: "Otra vez / repetir", group: "cotidiano" },
  { id: "key-jalhaesseoyo", korean: "Jalhaesseoyo", speech: "잘했어요", spanish: "Bien hecho", group: "cotidiano" },
];
