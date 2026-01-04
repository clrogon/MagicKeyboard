
import { Finger, KeyConfig, Level, Achievement, Theme } from './types';

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
 * Physical Keyboard Layout Definition (QWERTY - PT-PT standard).
 * Mapped to rows for rendering the 3D Virtual Keyboard.
 * Updated to include Shift-characters for symbols and ACCENTS.
 */
export const KEYBOARD_LAYOUT: KeyConfig[][] = [
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
 * They include a mix of Portugal and Angola context.
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
      "j f j f", "f j f j", "fjj", "jff", "jfj"
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
    textSamples: ["df jk", "fd kj", "dk dk", "kd kd", "dd kk"],
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
    textSamples: ["ala", "asa", "fala", "sala", "fada", "lã", "sal"],
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
    textSamples: ["ele", "ela", "eles", "tia", "tio", "oito", "leite", "tosta", "festa", "teto", "leito"],
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
        "Cuito", "Cunene", "morro", "nu", "terra", "turma"
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
        "Kwanza", "Zola", "Benguela", "Huambo", "Imbondeiro", "Muxima", "Semba", 
        "Ginguba", "Gato", "Hoje", "Queijo", "Xadrez", "Zebra", "Soba", "Njinga"
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
    textSamples: ["Luanda, Angola.", "Tejo, Douro.", "Dia de sol, dia de praia.", "Lubango, Huíla.", "Porto, Norte."],
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
    textSamples: ["1 2 3", "321", "12345", "1 2 1", "543"],
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
    textSamples: ["6 7 8", "9 0 9", "67890", "123 789", "10 20"],
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
    textSamples: ["Olá!", "Tudo bem?", "Sim - disse ela.", "1-2-3!", "Fim?"],
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
        "A Ana vive em Luanda e gosta de ler.", 
        "O Zola viu uma Palanca Negra gigante.", 
        "Em Lisboa e Benguela o sol brilha muito.",
        "O Rio Kwanza é muito bonito.",
        "Vamos dançar Kizomba e Semba!",
        "A Rainha Njinga foi muito forte.",
        "O Galo de Barcelos canta de manhã."
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
        "chá", "pé", "avó", "baú", "olá", "sofá", "jacaré", "boné", "dominó", "às vezes", "fácil", "água"
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
        "mão", "pão", "cão", "avião", "não", "limão", "lã", "leão", "avô", "você", "puré", "bebê", "português", "lâmpada"
    ],
    difficulty: 'hard',
    minWpm: 10,
    minAccuracy: 85
  }
];

export const SUCCESS_MESSAGES = [
  "Incrível!", "Fantástico!", "Muito bem!", "És um craque!", "Boa!", "Continua assim!", "Espetacular!"
];