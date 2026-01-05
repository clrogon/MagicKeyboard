
import { Finger, KeyConfig, Level, Achievement, Theme, KeyboardLayout } from './types';

/**
 * Theme Configuration Object.
 * Maps the 'Theme' type to specific Tailwind CSS classes.
 * This centralization prevents Tailwind JIT pruning issues and makes theming cleaner.
 */
export const THEME_COLORS: Record<Theme, {
    base: string;
    bg: string;
    bgSoft: string;
    text: string;
    textSoft: string;
    border: string;
    shadow: string;
    gradient: string;
    iconBg: string;
}> = {
    rose: {
        base: 'rose',
        bg: 'bg-rose-500',
        bgSoft: 'bg-rose-100',
        text: 'text-rose-500',
        textSoft: 'text-rose-400',
        border: 'border-rose-200',
        shadow: 'shadow-rose-200',
        gradient: 'from-rose-300 to-rose-500',
        iconBg: 'bg-rose-100'
    },
    blue: {
        base: 'blue',
        bg: 'bg-blue-500',
        bgSoft: 'bg-blue-100',
        text: 'text-blue-500',
        textSoft: 'text-blue-400',
        border: 'border-blue-200',
        shadow: 'shadow-blue-200',
        gradient: 'from-blue-300 to-blue-500',
        iconBg: 'bg-blue-100'
    },
    amber: {
        base: 'amber',
        bg: 'bg-amber-500',
        bgSoft: 'bg-amber-100',
        text: 'text-amber-600',
        textSoft: 'text-amber-500',
        border: 'border-amber-200',
        shadow: 'shadow-amber-200',
        gradient: 'from-amber-300 to-amber-500',
        iconBg: 'bg-amber-100'
    }
};

/**
 * localized names for fingers to display in the UI (PT-PT).
 */
export const FINGER_NAMES: Record<Finger, string> = {
  [Finger.LeftPinky]: 'Mindinho Esq.',
  [Finger.LeftRing]: 'Anelar Esq.',
  [Finger.LeftMiddle]: 'Médio Esq.',
  [Finger.LeftIndex]: 'Indicador Esq.',
  [Finger.RightIndex]: 'Indicador Dir.',
  [Finger.RightMiddle]: 'Médio Dir.',
  [Finger.RightRing]: 'Anelar Dir.',
  [Finger.RightPinky]: 'Mindinho Dir.',
  [Finger.Thumb]: 'Polegares'
};

/**
 * Physical Keyboard Layout Definitions.
 * Includes standard PT-PT (QWERTY) and French/Immigrant (AZERTY).
 */
const QWERTY: KeyConfig[][] = [
  // Number Row (1234567890')
  [
    { char: '1', subLabel: '!', finger: Finger.LeftPinky, row: 0 },
    { char: '2', subLabel: '"', finger: Finger.LeftRing, row: 0 },
    { char: '3', subLabel: '#', finger: Finger.LeftMiddle, row: 0 },
    { char: '4', subLabel: '$', finger: Finger.LeftIndex, row: 0 },
    { char: '5', subLabel: '%', finger: Finger.LeftIndex, row: 0 },
    { char: '6', subLabel: '&', finger: Finger.RightIndex, row: 0 },
    { char: '7', subLabel: '/', finger: Finger.RightIndex, row: 0 },
    { char: '8', subLabel: '(', finger: Finger.RightMiddle, row: 0 },
    { char: '9', subLabel: ')', finger: Finger.RightRing, row: 0 },
    { char: '0', subLabel: '=', finger: Finger.RightPinky, row: 0 },
    { char: "'", subLabel: '?', finger: Finger.RightPinky, row: 0 }, 
  ],
  // Top Row (QWERTY...) + Acute Accent
  [
    { char: 'q', finger: Finger.LeftPinky, row: 1 },
    { char: 'w', finger: Finger.LeftRing, row: 1 },
    { char: 'e', finger: Finger.LeftMiddle, row: 1 },
    { char: 'r', finger: Finger.LeftIndex, row: 1 },
    { char: 't', finger: Finger.LeftIndex, row: 1 },
    { char: 'y', finger: Finger.RightIndex, row: 1 },
    { char: 'u', finger: Finger.RightIndex, row: 1 },
    { char: 'i', finger: Finger.RightMiddle, row: 1 },
    { char: 'o', finger: Finger.RightRing, row: 1 },
    { char: 'p', finger: Finger.RightPinky, row: 1 },
    { char: '´', subLabel: '`', finger: Finger.RightPinky, row: 1 }, // Acute/Grave Accent Key
  ],
  // Home Row (ASDF...) + Tilde/Circumflex
  [
    { char: 'a', finger: Finger.LeftPinky, row: 2 },
    { char: 's', finger: Finger.LeftRing, row: 2 },
    { char: 'd', finger: Finger.LeftMiddle, row: 2 },
    { char: 'f', finger: Finger.LeftIndex, row: 2 },
    { char: 'g', finger: Finger.LeftIndex, row: 2 },
    { char: 'h', finger: Finger.RightIndex, row: 2 },
    { char: 'j', finger: Finger.RightIndex, row: 2 },
    { char: 'k', finger: Finger.RightMiddle, row: 2 },
    { char: 'l', finger: Finger.RightRing, row: 2 },
    { char: 'ç', finger: Finger.RightPinky, row: 2 },
    { char: '~', subLabel: '^', finger: Finger.RightPinky, row: 2 }, // Tilde/Circumflex Key
  ],
  // Bottom Row (ZXCV...)
  [
    { char: 'ShiftLeft', label: 'Shift', finger: Finger.LeftPinky, row: 3, width: 1.5 },
    { char: 'z', finger: Finger.LeftPinky, row: 3 },
    { char: 'x', finger: Finger.LeftRing, row: 3 },
    { char: 'c', finger: Finger.LeftMiddle, row: 3 },
    { char: 'v', finger: Finger.LeftIndex, row: 3 },
    { char: 'b', finger: Finger.LeftIndex, row: 3 },
    { char: 'n', finger: Finger.RightIndex, row: 3 },
    { char: 'm', finger: Finger.RightIndex, row: 3 },
    { char: ',', finger: Finger.RightMiddle, row: 3 },
    { char: '.', finger: Finger.RightRing, row: 3 }, 
    { char: '-', subLabel: '_', finger: Finger.RightPinky, row: 3 },
    { char: 'ShiftRight', label: 'Shift', finger: Finger.RightPinky, row: 3, width: 1.5 },
  ]
];

const AZERTY: KeyConfig[][] = [
  // Number Row (AZERTY uses Shift for numbers)
  [
    { char: '&', subLabel: '1', finger: Finger.LeftPinky, row: 0 },
    { char: 'é', subLabel: '2', finger: Finger.LeftRing, row: 0 },
    { char: '"', subLabel: '3', finger: Finger.LeftMiddle, row: 0 },
    { char: "'", subLabel: '4', finger: Finger.LeftIndex, row: 0 },
    { char: '(', subLabel: '5', finger: Finger.LeftIndex, row: 0 },
    { char: '-', subLabel: '6', finger: Finger.RightIndex, row: 0 },
    { char: 'è', subLabel: '7', finger: Finger.RightIndex, row: 0 },
    { char: '_', subLabel: '8', finger: Finger.RightMiddle, row: 0 },
    { char: 'ç', subLabel: '9', finger: Finger.RightRing, row: 0 },
    { char: 'à', subLabel: '0', finger: Finger.RightPinky, row: 0 },
    { char: ')', subLabel: '°', finger: Finger.RightPinky, row: 0 },
  ],
  // Top Row (AZERTY)
  [
    { char: 'a', finger: Finger.LeftPinky, row: 1 },
    { char: 'z', finger: Finger.LeftRing, row: 1 },
    { char: 'e', finger: Finger.LeftMiddle, row: 1 },
    { char: 'r', finger: Finger.LeftIndex, row: 1 },
    { char: 't', finger: Finger.LeftIndex, row: 1 },
    { char: 'y', finger: Finger.RightIndex, row: 1 },
    { char: 'u', finger: Finger.RightIndex, row: 1 },
    { char: 'i', finger: Finger.RightMiddle, row: 1 },
    { char: 'o', finger: Finger.RightRing, row: 1 },
    { char: 'p', finger: Finger.RightPinky, row: 1 },
    { char: '^', subLabel: '¨', finger: Finger.RightPinky, row: 1 },
  ],
  // Home Row (QSDFG...)
  [
    { char: 'q', finger: Finger.LeftPinky, row: 2 },
    { char: 's', finger: Finger.LeftRing, row: 2 },
    { char: 'd', finger: Finger.LeftMiddle, row: 2 },
    { char: 'f', finger: Finger.LeftIndex, row: 2 },
    { char: 'g', finger: Finger.LeftIndex, row: 2 },
    { char: 'h', finger: Finger.RightIndex, row: 2 },
    { char: 'j', finger: Finger.RightIndex, row: 2 },
    { char: 'k', finger: Finger.RightMiddle, row: 2 },
    { char: 'l', finger: Finger.RightRing, row: 2 },
    { char: 'm', finger: Finger.RightPinky, row: 2 },
    { char: 'ù', subLabel: '%', finger: Finger.RightPinky, row: 2 },
  ],
  // Bottom Row (WXCVBN...)
  [
    { char: 'ShiftLeft', label: 'Shift', finger: Finger.LeftPinky, row: 3, width: 1.5 },
    { char: 'w', finger: Finger.LeftPinky, row: 3 },
    { char: 'x', finger: Finger.LeftRing, row: 3 },
    { char: 'c', finger: Finger.LeftMiddle, row: 3 },
    { char: 'v', finger: Finger.LeftIndex, row: 3 },
    { char: 'b', finger: Finger.LeftIndex, row: 3 },
    { char: 'n', finger: Finger.RightIndex, row: 3 },
    { char: ',', subLabel: '?', finger: Finger.RightIndex, row: 3 },
    { char: ';', subLabel: '.', finger: Finger.RightMiddle, row: 3 },
    { char: ':', subLabel: '/', finger: Finger.RightRing, row: 3 },
    { char: '!', subLabel: '§', finger: Finger.RightPinky, row: 3 },
    { char: 'ShiftRight', label: 'Shift', finger: Finger.RightPinky, row: 3, width: 1.5 },
  ]
];

export const KEYBOARD_LAYOUTS: Record<KeyboardLayout, KeyConfig[][]> = {
    qwerty: QWERTY,
    azerty: AZERTY
};

/**
 * List of available Achievements.
 */
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_3_stars',
    title: 'Estrela Nascente',
    description: 'Conquistaste 3 estrelas pela primeira vez!',
    icon: 'Star',
    color: 'bg-yellow-400'
  },
  {
    id: 'wpm_30',
    title: 'Velocista Júnior',
    description: 'Atingiste 30 Palavras por Minuto!',
    icon: 'Zap',
    color: 'bg-blue-400'
  },
  {
    id: 'speed_demon',
    title: 'Relâmpago',
    description: 'Atingiste 50 Palavras por Minuto!',
    icon: 'Zap',
    color: 'bg-blue-600'
  },
  {
    id: 'accuracy_master',
    title: 'Perfeccionista',
    description: 'Completaste um nível com 100% de precisão.',
    icon: 'Target',
    color: 'bg-emerald-500'
  },
  {
    id: 'session_streak',
    title: 'Dedicação',
    description: 'Completaste 10 sessões de treino.',
    icon: 'Calendar',
    color: 'bg-purple-500'
  },
  {
    id: 'streak_7',
    title: 'Semana Perfeita',
    description: 'Treinaste 7 dias seguidos!',
    icon: 'CalendarCheck',
    color: 'bg-orange-500'
  },
  {
    id: 'home_row_master',
    title: 'Mestre da Base',
    description: 'Completaste o Nível 3 (Home Row Completa) com 3 estrelas.',
    icon: 'Crown',
    color: 'bg-pink-500'
  },
  {
    id: 'symbol_expert',
    title: 'Mestre dos Símbolos',
    description: 'Dominaste o Nível 7 com 3 estrelas.',
    icon: 'Hash',
    color: 'bg-indigo-500'
  },
  {
    id: 'error_crusher',
    title: 'Caçador de Erros',
    description: '100% de precisão num Treino de Erros.',
    icon: 'ShieldCheck',
    color: 'bg-red-500'
  },
  {
    id: 'time_lord',
    title: 'Senhor do Tempo',
    description: '+30 PPM num desafio de 60s.',
    icon: 'Clock',
    color: 'bg-violet-500'
  },
  {
    id: 'level_5',
    title: 'A Subir na Vida',
    description: 'Chegaste ao Nível de Jogador 5!',
    icon: 'TrendingUp',
    color: 'bg-cyan-500'
  },
  {
    id: 'marathon_runner',
    title: 'Maratonista',
    description: 'Jogaste mais de 1 hora no total.',
    icon: 'Hourglass',
    color: 'bg-teal-500'
  }
];

// Progression Titles based on Player Level
export const PLAYER_TITLES: Record<number, string> = {
    1: 'Aprendiz',
    2: 'Estudante',
    3: 'Teclista',
    5: 'Escritor Veloz',
    8: 'Mestre das Palavras',
    10: 'Hacker Júnior',
    15: 'Lenda do Teclado',
    20: 'Divindade da Digitação',
    30: 'O Escolhido'
};

// Available Avatars for the profile
export const AVATARS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🦄', '🐙', '🦖', '🚀', '👽', '🤖'];

// Calculate XP needed for next level: 100 * Level
export const getXpForNextLevel = (level: number) => level * 250;

/**
 * Progression Levels.
 * Designed for children learning PT (European/Angolan style).
 * 
 * FALLBACK SAMPLES NOTE:
 * These samples are used if the AI is offline. 
 * They include a deliberate mix of Portugal (PT) and Angola (AO) context
 * to ensure cultural representation even without the AI engine.
 */
export const LEVELS: Level[] = [
  {
    id: 1,
    title: "A Linha Mágica",
    description: "Vamos começar com os dedos indicadores! F e J.",
    newKeys: ['f', 'j', ' '],
    allKeys: ['f', 'j', ' '],
    textSamples: [
      "fff jjj", "jfjf", "fjf jfj", "jjj fff", "jf jf", 
      "fj fj", "jj ff", "f f j j", "j j f f", "fff jjj fff",
      "jjj fff jjj", "fjfjf", "jfjfj", "jjff", "ffjj",
      "j f j f", "f j f j", "fjj", "jff", "jfj",
      "jjj f f", "fff j j", "jf jf jf", "fj fj fj", "j f j",
      "f j f", "jjf jjf", "ffj ffj", "jjjfff", "fffjjj",
      "jf jf jf jf", "fj fj fj fj", "f j f j f", "j f j f j", "fff jjj f f j j",
      "j j f f j j", "f f j j f f", "jfjf jfjf", "fjfj fjfj", "jj ff jj ff",
      "j j j f f f", "f f f j j j", "jf jf jf", "f j f j", "jjj fff jj f",
      "fff jjj ff j", "j f j f j f", "f j f j f j"
    ],
    difficulty: 'easy',
    minWpm: 5,
    minAccuracy: 85
  },
  {
    id: 2,
    title: "Vizinhos Amigos",
    description: "Adiciona o D e o K. Usa os dedos médios!",
    newKeys: ['d', 'k'],
    allKeys: ['f', 'j', ' ', 'd', 'k'],
    textSamples: [
        "df jk", "fd kj", "dk dk", "kd kd", "dd kk",
        "k k d d", "d d k k", "j k d f", "f d k j", "jkjk",
        "dfdf", "kdkd", "djdj", "fkfk", "dkjf",
        "fjdk", "kdjf", "dj fk", "fk dj", "ddkk",
        "kkdd", "jk df", "fd jk", "kj fd", "jkdf",
        "fdkj", "d k d k", "k d k d", "j k j k", "f d f d",
        "df jk df", "kj fd kj", "dk dk dk", "kd kd kd", "jk df jk",
        "fd kj fd", "dfjk", "kjfd", "dkdk", "kdkd",
        "d d k k j j f f", "f f d d k k j j", "jk jk df df", "df df jk jk", "kd kd jf jf",
        "jf jf kd kd", "dk dk fj fj", "fj fj dk dk"
    ],
    difficulty: 'easy',
    minWpm: 8,
    minAccuracy: 85
  },
  {
    id: 3,
    title: "Família Completa",
    description: "S, L, A e Ç. A linha do meio completa!",
    newKeys: ['s', 'l', 'a', 'ç'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç'],
    textSamples: [
        "ala", "asa", "fala", "sala", "fada", "lã", "sal",
        "lala", "sasa", "dada", "caca", "ja ja", "ka ka",
        "laça", "assa", "faca", "jaca", "saca", "cala",
        "dela", "falsa", "calça", "falta", "salsa", "alfa",
        "alas", "asas", "fadas", "salas", "falas", "laços",
        "a la a la", "sa sa sa", "da da da", "fa fa fa", "la la la",
        "a sala", "a fada", "a faca", "a salsa", "a calça",
        "fala dada", "dada fala", "sala lala", "lala sala", "sasa assa",
        "assa sasa", "laça cala", "cala laça", "falsa fada", "fada falsa",
        "alfa sal", "sal alfa", "falta sal", "sal falta", "dada cala",
        "faca afiada", "laço de fita"
    ],
    difficulty: 'medium',
    minWpm: 10,
    minAccuracy: 90
  },
  {
    id: 4,
    title: "A Subir",
    description: "E, I, O, T. Vamos para a fila de cima!",
    newKeys: ['e', 'i', 'o', 't'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't'],
    textSamples: [
        "ele", "ela", "eles", "tia", "tio", "oito", "leite", "tosta", "festa", "teto", "leito",
        "tolo", "loto", "foto", "fofa", "jota", "seda", "seta", "saloio", "teia",
        "seita", "fita", "lote", "dote", "toca", "foca", "jato", "tato", "talia",
        "fatia", "tostas", "festas", "leitos", "tolos", "lotos", "fotos", "fofas",
        "jotas", "sedas", "setas", "teias", "seitas", "fitas", "lotes", "dotes",
        "tocas", "focas", "jatos", "tatos", "o tio e a tia", "o gato da tia", "a festa na sala",
        "o leite e a tosta", "a fita de seda", "o lote de tostas", "a foto da festa", "a teia no teto",
        "o jato no ceu", "a fatia de bolo", "o tio tito", "a tia tita", "o leite quente"
    ],
    difficulty: 'medium',
    minWpm: 12,
    minAccuracy: 90
  },
  {
    id: 5,
    title: "Exploradores",
    description: "R, U, N, M, C, V. Palavras novas!",
    newKeys: ['r', 'u', 'n', 'm', 'c', 'v'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v'],
    textSamples: [
        "rua", "rio", "mar", "ver", "comer", "nuvem", "conta", "vento", "navio", "treino",
        "Cuito", "Cunene", "morro", "nu", "terra", "turma", "carro", "muro", "vaca", "faca",
        "caca", "cama", "lama", "rama", "mana", "nora", "neto", "neve", "nove", "novo",
        "uva", "um", "uma", "uns", "umas", "ovo", "ave", "avo", "avó", "amor",
        "amar", "ator", "atriz", "arte", "arco", "arma", "alma", "alta", "alto", "ano",
        "ana", "ama", "ame", "amo", "anta", "ante", "anti", "arco", "ares", "arte",
        "o carro corre", "a nave voa", "o mar azul", "o rio calmo", "a neve branca",
        "o vento forte", "a nuvem escura", "o navio grande", "a turma atenta", "o morro alto",
        "a terra seca", "o muro de pedra", "a vaca no campo", "a faca afiada", "a cama macia"
    ],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 90
  },
  {
    id: 6,
    title: "Mestre do Alfabeto",
    description: "Completa o alfabeto com B, G, H, P, Q, W, X, Y, Z.",
    newKeys: ['b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v', 'b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight'],
    textSamples: [
        "Kwanza", "Zola", "Benguela", "Huambo", "Imbondeiro", "Muxima", "Semba", "Ginguba",
        "Gato", "Hoje", "Queijo", "Xadrez", "Zebra", "Soba", "Njinga", "gato", "galo", "gola",
        "gula", "haja", "hoje", "hora", "horta", "hotel", "pato", "pele", "pelo", "pela",
        "pico", "pipa", "poço", "pulo", "puma", "quase", "queda", "quilo", "quota", "xale",
        "xarope", "xote", "zebra", "zero", "zona", "bela", "bico", "bola", "bolo", "bota",
        "bula", "kilo", "watt", "yoga", "zoom", "Ginguba de Angola", "O rio Kwanza",
        "A cidade de Benguela", "O planalto do Huambo", "A planta Imbondeiro", "A nossa Muxima",
        "Vamos dançar Semba", "O Soba da aldeia", "A Rainha Njinga", "O gato mia", "O galo canta",
        "A hora passa", "O pato nada", "A pele macia", "O poço fundo", "O puma corre"
    ],
    difficulty: 'hard',
    minWpm: 12,
    minAccuracy: 85
  },
  {
    id: 7,
    title: "Símbolos",
    description: "Pontos e vírgulas para dar pausa.",
    newKeys: ['.', ',', ';'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v', 'b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight', '.', ',', ';'],
    textSamples: [
        "Luanda, Angola.", "Tejo, Douro.", "Dia de sol, dia de praia.", "Lubango, Huíla.", "Porto, Norte.",
        "Sim, claro.", "Não, obrigado.", "Hoje, amanhã, sempre.", "Um, dois, três.", "Azul, verde, vermelho.",
        "Gato, cão, rato.", "Sol, lua, estrelas.", "Mar, rio, lago.", "Pão, queijo, fiambre.",
        "Água, sumo, leite.", "Mãe, pai, filho.", "Avô, avó, neto.", "Tio, tia, primo.",
        "Escola, casa, rua.", "Carro, autocarro, comboio.", "Lisboa, Porto, Faro.", "Coimbra, Braga, Aveiro.",
        "Évora, Beja, Setúbal.", "Guarda, Viseu, Bragança.", "Viana, Vila Real, Leiria.", "Santarém, Portalegre, Castelo Branco.",
        "Funchal, Ponta Delgada, Horta.", "Angra, Santa Cruz, Velas.", "Madalena, Lajes, Vila do Porto.", "Corvo, Flores, Graciosa.",
        "São Jorge, Terceira, Faial.", "Pico, São Miguel, Santa Maria."
    ],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 90
  },
  {
    id: 8,
    title: "Números (Esq.)",
    description: "Vamos contar até 5 com a mão esquerda!",
    newKeys: ['1', '2', '3', '4', '5'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v', 'b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight', '.', ',', ';', '1', '2', '3', '4', '5'],
    textSamples: [
        "1 2 3", "321", "12345", "1 2 1", "543", "1 2 3 4 5", "5 4 3 2 1",
        "11 22 33 44 55", "12 34 51", "13 52 41", "14 25 31", "15 24 32", "123",
        "234", "345", "543", "432", "321", "12 12", "34 34", "55 11", "23 45",
        "51 42", "35 24", "1 1 2 2", "3 3 4 4", "5 5 1 1", "2 2 3 3", "4 4 5 5",
        "1, 2, 3.", "3, 2, 1.", "1; 2; 3.", "4, 5.", "5, 4.", "1 e 2.", "3 e 4.",
        "2 e 3.", "4 e 5.", "1, 3, 5.", "2, 4.", "5, 3, 1.", "4, 2.", "1.2.3.", "3.4.5.",
        "1,2,3,4,5", "5,4,3,2,1", "1 2 3, 4 5", "5 4 3, 2 1", "1 2, 3 4, 5"
    ],
    difficulty: 'hard',
    minWpm: 10,
    minAccuracy: 85
  },
  {
    id: 9,
    title: "Números (Dir.)",
    description: "Completa a contagem com a mão direita.",
    newKeys: ['6', '7', '8', '9', '0'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v', 'b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight', '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    textSamples: [
        "6 7 8", "9 0 9", "67890", "123 789", "10 20", "6 7 8 9 0", "0 9 8 7 6",
        "66 77 88 99 00", "67 89 06", "68 07 96", "69 70 86", "60 79 87", "678",
        "789", "890", "098", "987", "876", "67 67", "89 89", "00 66", "78 90",
        "06 97", "80 79", "6 6 7 7", "8 8 9 9", "0 0 6 6", "7 7 8 8", "9 9 0 0",
        "6, 7, 8.", "8, 7, 6.", "6; 7; 8.", "9, 0.", "0, 9.", "6 e 7.", "8 e 9.",
        "7 e 8.", "9 e 0.", "6, 8, 0.", "7, 9.", "0, 8, 6.", "9, 7.", "6.7.8.", "8.9.0.",
        "1, 2, 3, 4, 5, 6, 7, 8, 9, 0", "0, 9, 8, 7, 6, 5, 4, 3, 2, 1",
        "10, 20, 30, 40, 50, 60, 70, 80, 90, 100", "1999, 2000, 2024, 2025"
    ],
    difficulty: 'hard',
    minWpm: 10,
    minAccuracy: 85
  },
  {
    id: 10,
    title: "Pontuação Extra",
    description: "Perguntas e emoções! ? ! -",
    newKeys: ['?', '!', '-'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v', 'b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight', '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-'],
    textSamples: [
        "Olá!", "Tudo bem?", "Sim - disse ela.", "1-2-3!", "Fim?", "Como estás?",
        "Estou bem!", "Que horas são?", "São 10 horas!", "Vamos brincar?", "Sim, vamos!",
        "Gostas de ler?", "Sim, muito!", "Qual o teu nome?", "O meu nome é Ana.",
        "Onde moras?", "Moro em Lisboa.", "E tu?", "Moro em Luanda!",
        "Um - dois - três!", "Quatro - cinco - seis!", "Sete - oito - nove!", "Dez!",
        "Cuidado!", "Atenção!", "Perigo!", "Socorro!", "Ajuda!",
        "Parabéns!", "Feliz aniversário!", "Bom dia!", "Boa tarde!", "Boa noite!",
        "Até logo!", "Até amanhã!", "Adeus!", "Obrigado!", "De nada!",
        "Desculpa!", "Com licença!", "Por favor!", "Verdade?", "Mentira!",
        "Sério?", "Brincadeira!", "Que fixe!", "Que pena!", "Que bom!",
        "Estás pronto?", "Vamos lá!", "Força!", "Coragem!", "Vence!",
        "Perdeu!", "Empate!", "Jogo!", "Fim de jogo!", "Vitória!"
    ],
    difficulty: 'hard',
    minWpm: 12,
    minAccuracy: 90
  },
  {
    id: 11,
    title: "Histórias do Mundo",
    description: "Escreve histórias sobre Portugal e Angola.",
    newKeys: [], 
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', 
        '.', ',', ';', '?', '!', '-', 
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
    ],
    textSamples: [
        "A Ana vive em Luanda e gosta de ler.", "O Zola viu uma Palanca Negra gigante.",
        "Em Lisboa e Benguela o sol brilha muito.", "O Rio Kwanza é muito bonito.",
        "Vamos dançar Kizomba e Semba!", "A Rainha Njinga foi muito forte.",
        "O Galo de Barcelos canta de manhã.", "O fado ouve-se em Alfama.",
        "A serra da Estrela tem neve.", "O deserto do Namibe é grande.",
        "As quedas de Kalandula são lindas.", "O rio Douro atravessa o Porto.",
        "A torre de Belém é antiga.", "O castelo de São Jorge é alto.",
        "A ilha de Luanda tem praias.", "O Mussulo é um lugar calmo.",
        "A comida angolana é saborosa.", "O pastel de nata é doce.",
        "O bacalhau é um prato típico.", "A muamba de galinha é boa.",
        "O funge com calulu é forte.", "A francesinha é do Porto.",
        "O choco frito é de Setúbal.", "A ginguba torrada é boa.",
        "O sumo de múcua é fresco.", "O vinho do Porto é famoso.",
        "A azeitona de Elvas é boa.", "O queijo da serra é mole.",
        "O pão de Mafra é estaladiço.", "O bolo do caco é da Madeira.",
        "O ananás dos Açores é doce.", "A banana da Madeira é pequena.",
        "O café de Angola é forte.", "O chá dos Açores é quente.",
        "A água do Luso é pura.", "A cerveja Cuca é fresca.",
        "O marisco da costa é fresco.", "O peixe grelhado é bom.",
        "A cataplana de peixe é rica.", "O arroz de marisco é bom.",
        "A feijoada à transmontana.", "O cozido à portuguesa.",
        "A sopa da pedra é de Almeirim.", "O leitão da Bairrada.",
        "O cabrito assado no forno.", "A vitela de Lafões.",
        "O bife à café.", "O prego no pão.", "A bifana de Vendas Novas."
    ],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 92
  },
  {
    id: 12,
    title: "Acentos Agudos",
    description: "Primeiro o acento, depois a letra! (´ e `)",
    newKeys: ['´', '`'],
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', '´', '`'
    ],
    textSamples: [
        "chá", "pé", "avó", "baú", "olá", "sofá", "jacaré", "boné", "dominó", "às vezes",
        "fácil", "água", "rápido", "música", "próximo", "lógico", "química", "física",
        "matemática", "história", "geografia", "biologia", "filosofia", "psicologia",
        "sociologia", "economia", "política", "gramática", "ortografia", "sintaxe",
        "análise", "síntese", "tese", "antítese", "hipótese", "teoria", "prática",
        "método", "técnica", "ciência", "tecnologia", "indústria", "comércio",
        "serviço", "público", "privado", "social", "cultural", "artístico", "literário",
        "poético", "dramático", "cómico", "trágico", "épico", "lírico", "satírico",
        "ironia", "humor", "amor", "ódio", "paixão", "emoção", "razão", "lógica",
        "ética", "moral", "direito", "dever", "liberdade", "justiça", "verdade",
        "beleza", "bondade", "felicidade", "paz", "guerra", "vida", "morte"
    ],
    difficulty: 'hard',
    minWpm: 10,
    minAccuracy: 85
  },
  {
    id: 13,
    title: "Ondas e Chapéus",
    description: "Usa o Til (~) e o Chapéu (^) nas vogais.",
    newKeys: ['~', '^'],
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', '´', '`', '~', '^'
    ],
    textSamples: [
        "mão", "pão", "cão", "avião", "não", "limão", "lã", "leão", "avô", "você", "puré",
        "bebê", "português", "lâmpada", "câmera", "tênis", "ônibus", "mecânico", "dinâmico",
        "orgânico", "botânico", "vulcânico", "oceânico", "atlântico", "pacífico", "indico",
        "ártico", "antártico", "elétrico", "eletrônico", "atômico", "nuclear", "térmico",
        "hídrico", "eólico", "solar", "lunar", "estelar", "planetário", "cósmico",
        "galáctico", "universal", "mundial", "nacional", "regional", "local", "urbano",
        "rural", "agrícola", "industrial", "comercial", "financeiro", "econômico",
        "político", "social", "cultural", "educacional", "médico", "jurídico", "militar",
        "religioso", "espiritual", "físico", "químico", "biológico", "geológico",
        "astronômico", "meteorológico", "climático", "ambiental", "ecológico"
    ],
    difficulty: 'hard',
    minWpm: 10,
    minAccuracy: 85
  },
  {
    id: 14,
    title: "Gritos e Emoções",
    description: "Letras grandes com acento! Á, É, Í, Ó, Ú.",
    newKeys: [], 
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', '´', '`', '~', '^',
        '.', ',', ';', '?', '!', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
    ],
    textSamples: [
        "Ágata", "Évora", "Índia", "Óscar", "Úrsula", "Áurea", "Énio", "Íris", "Átila",
        "Olá Ágata!", "É verdade?", "Óscar, anda cá!", "A Úrsula é fixe.", "O Ícaro voa.",
        "Érica e Évora.", "Álvaro e Átila.", "Avo e Avó.", "És tu?", "Água fresca.",
        "Óleo e azeite.", "Único e último.", "Índio e ilha.", "Épico!", "Ótimo!",
        "A Águia voa alto.", "O pó é do avô.", "A pá é da avó.", "É ele?", "É ela?"
    ],
    difficulty: 'hard',
    minWpm: 12,
    minAccuracy: 90
  },
  {
    id: 15,
    title: "Símbolos Mágicos",
    description: "Descobre os símbolos escondidos nos números! # $ % &",
    newKeys: ['"', '#', '$', '%', '&', '/', '(', ')', '='],
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', '´', '`', '~', '^',
        '.', ',', ';', '?', '!', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '"', '#', '$', '%', '&', '/', '(', ')', '='
    ],
    textSamples: [
        "#Top1", "100%", "Eu & Tu", "Sim/Não", "(1+1)", "Ouro $", "A=B", "Data: 20/10",
        "Preço: 50$", "Desconto: 20%", "Hashtag #Fixe", "Azul & Verde", "Certo (Sim)",
        "Erro (Não)", "1+2=3", "4+4=8", "Atenção!", "\"Olá\"", "\"Bom dia\"",
        "O teu #ID", "Código: (123)", "Pai & Filho", "Sol & Mar", "50% Off",
        "10/10/2026", "A+B=C", "X=Y", "O #Rei", "A #Rainha"
    ],
    difficulty: 'hard',
    minWpm: 12,
    minAccuracy: 88
  },
  {
    id: 16,
    title: "A Grande Mistura",
    description: "Números, símbolos e letras. O derradeiro teste!",
    newKeys: [],
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', '´', '`', '~', '^',
        '.', ',', ';', '?', '!', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '"', '#', '$', '%', '&', '/', '(', ')', '='
    ],
    textSamples: [
        "Rua 25, n.º 10.", "Tel: 912 345 678", "Email: ana@sapo.pt", "100% Amigos!",
        "Data: 01/01/2026", "Preço: 15€", "Código: #A1-B2", "(3+2)=5", "Nota 20!",
        "O meu PC é #1.", "Siga: @teclado", "User: zola_99", "Pass: 1234!",
        "Lisboa, 2026.", "Porto & Gaia.", "Luanda #1", "B.I. 123456", "Conta: 100$",
        "A turma (5.º B)", "O jogo: 5-0", "Vencedor: Tu!", "Fim da Fase 16."
    ],
    difficulty: 'hard',
    minWpm: 18,
    minAccuracy: 92
  },
  {
    id: 17,
    title: "O Poeta Mágico",
    description: "Rimas e canções com muitos acentos!",
    newKeys: [],
    allKeys: [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'ç', ' ', 'ShiftLeft', 'ShiftRight', '´', '`', '~', '^',
        '.', ',', ';', '?', '!', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
        '"', '#', '$', '%', '&', '/', '(', ')', '='
    ],
    textSamples: [
        "A avó levou o avô ao café de Azeitão.", "O leão comeu pão e caiu no chão.",
        "O João tem um balão e um cão.", "A lição do camaleão é uma canção.",
        "O capitão tem um botão no casacão.", "A mão do irmão segura o peão.",
        "A avelã é da irmã do cristão.", "O fogão tem carvão e feijão.",
        "O coração do dragão é um vulcão.", "A maça e o amanhã.",
        "Põe o pão na mão, não no chão.", "A bênção da mãe é proteção.",
        "O algodão é macio como o verão.", "A multidão viu o avião.",
        "O tubarão é o patrão do oceano.", "A romã é sã e dá paixão."
    ],
    difficulty: 'hard',
    minWpm: 20,
    minAccuracy: 95
  }
];

export const SUCCESS_MESSAGES = [
  "Incrível!", "Fantástico!", "Muito bem!", "És um craque!", "Boa!", "Continua assim!", "Espetacular!"
];
