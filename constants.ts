import { Finger, KeyConfig, Level } from './types';

// Standard Portuguese Layout mapping for visual keyboard
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

// Progressive Levels designed for Kids learning PT (European/Angolan style)
export const LEVELS: Level[] = [
  {
    id: 1,
    title: "A Linha Mágica (Home Row 1)",
    description: "Vamos começar com os dedos indicadores! F e J.",
    newKeys: ['f', 'j', ' '],
    allKeys: ['f', 'j', ' '],
    textSamples: [
      "fff jjj fjf jfj",
      "fala ja",
      "faj jaf",
      "jj ff jf"
    ],
    difficulty: 'easy',
    minWpm: 5,
    minAccuracy: 85
  },
  {
    id: 2,
    title: "Vizinhos Amigos (Home Row 2)",
    description: "Adiciona o D e o K. Usa os dedos médios!",
    newKeys: ['d', 'k'],
    allKeys: ['f', 'j', ' ', 'd', 'k'],
    textSamples: [
      "dad kad fada",
      "kapa daka",
      "fada dada",
      "kaka da jaf"
    ],
    difficulty: 'easy',
    minWpm: 8,
    minAccuracy: 85
  },
  {
    id: 3,
    title: "A Família Completa (Home Row 3)",
    description: "S, L, A e Ç. A linha do meio completa!",
    newKeys: ['s', 'l', 'a', 'ç'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç'],
    textSamples: [
      "sal alas laça",
      "falsa sala",
      "laço dado",
      "asada lasca"
    ],
    difficulty: 'medium',
    minWpm: 10,
    minAccuracy: 90
  },
  {
    id: 4,
    title: "A Subir a Montanha (Topo E/I)",
    description: "Vamos subir! Usa o E e o I.",
    newKeys: ['e', 'i'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i'],
    textSamples: [
      "ele ela ilha",
      "feia ideia",
      "fale ali",
      "sede lide"
    ],
    difficulty: 'medium',
    minWpm: 12,
    minAccuracy: 90
  },
  {
    id: 5,
    title: "Exploradores R e U",
    description: "O R e o U juntam-se à festa!",
    newKeys: ['r', 'u'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'r', 'u'],
    textSamples: [
      "rua riu feriu",
      "fura rara",
      "usar rir",
      "aula real"
    ],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 90
  },
  {
    id: 6,
    title: "O Gigante Shift (Maiúsculas)",
    description: "Usa o Shift para as maiúsculas! Shift Esq para a mão direita, Shift Dir para a esquerda.",
    newKeys: ['ShiftLeft', 'ShiftRight'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'r', 'u', 'ShiftLeft', 'ShiftRight'],
    textSamples: [
      "Ana e Ela",
      "Rui e Sara",
      "Fada Fria",
      "Dia de Sol"
    ],
    difficulty: 'hard',
    minWpm: 12,
    minAccuracy: 85
  },
  {
    id: 7,
    title: "Símbolos Divertidos",
    description: "Pontos e vírgulas para dar pausa.",
    newKeys: ['.', ',', ';'],
    allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'r', 'u', 'ShiftLeft', 'ShiftRight', '.', ',', ';'],
    textSamples: [
      "fale, ria.",
      "ele riu; ela riu.",
      "dia, sol, sal.",
      "fui. sai."
    ],
    difficulty: 'hard',
    minWpm: 15,
    minAccuracy: 90
  }
];

export const SUCCESS_MESSAGES = [
  "Incrível!",
  "Fantástico!",
  "Muito bem!",
  "És um craque!",
  "Boa!",
  "Continua assim!",
  "Espetacular!"
];
