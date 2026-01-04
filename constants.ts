
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
 */
export const KEYBOARD_LAYOUT: KeyConfig[][] = [
  // Top Row (QWERTY...)
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
  ],
  // Home Row (ASDF...)
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
    { char: ';', finger: Finger.RightPinky, row: 3 },
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
 * Starts with Home Row (F/J) and expands outwards.
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
    textSamples: ["ala", "asa", "fala", "sala", "fada"],
    difficulty: 'medium',
    minWpm: 10,
    minAccuracy: 90
  },
  {
    id: 4,
    title: "A Subir",
    description: "Vamos subir! Usa o E e o I.",
    newKeys: ['e', 'i'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i'],
    textSamples: ["ele", "ela", "eles", "elas", "esse"],
    difficulty: 'medium',
    minWpm: 12,
    minAccuracy: 90
  },
  {
    id: 5,
    title: "Exploradores",
    description: "O R e o U juntam-se à festa!",
    newKeys: ['r', 'u'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'r', 'u'],
    textSamples: ["rua", "riu", "rio", "reu", "rasa"],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 90
  },
  {
    id: 6,
    title: "O Gigante Shift",
    description: "Usa o Shift para as maiúsculas!",
    newKeys: ['ShiftLeft', 'ShiftRight'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'r', 'u', 'ShiftLeft', 'ShiftRight'],
    textSamples: ["Ana", "Rui", "Luis", "Sara", "Duarte"],
    difficulty: 'hard',
    minWpm: 12,
    minAccuracy: 85
  },
  {
    id: 7,
    title: "Símbolos",
    description: "Pontos e vírgulas para dar pausa.",
    newKeys: ['.', ',', ';'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'r', 'u', 'ShiftLeft', 'ShiftRight', '.', ',', ';'],
    textSamples: ["fale, ria.", "ele riu; ela riu.", "dia, sol, sal."],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 90
  }
];

export const SUCCESS_MESSAGES = [
  "Incrível!", "Fantástico!", "Muito bem!", "És um craque!", "Boa!", "Continua assim!", "Espetacular!"
];
