
import { Finger, KeyConfig, Level, Achievement } from './types';

export const FINGER_NAMES: Record<Finger, string> = {
  [Finger.LeftPinky]: 'Mindinho Esquerdo',
  [Finger.LeftRing]: 'Anelar Esquerdo',
  [Finger.LeftMiddle]: 'Médio Esquerdo',
  [Finger.LeftIndex]: 'Indicador Esquerdo',
  [Finger.RightIndex]: 'Indicador Direito',
  [Finger.RightMiddle]: 'Médio Direito',
  [Finger.RightRing]: 'Anelar Direito',
  [Finger.RightPinky]: 'Mindinho Direito',
  [Finger.Thumb]: 'Polegares'
};

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

export const AVATARS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🦄', '🐙', '🦖', '🚀', '👽', '🤖'];

// Calculate XP needed for next level: 100 * Level
export const getXpForNextLevel = (level: number) => level * 250;

// Progressive Levels designed for Kids learning PT (European/Angolan style)
export const LEVELS: Level[] = [
  {
    id: 1,
    title: "A Linha Mágica (Home Row 1)",
    description: "Vamos começar com os dedos indicadores! F e J.",
    newKeys: ['f', 'j', ' '],
    allKeys: ['f', 'j', ' '],
    textSamples: [
      "fff jjj", "jfjf", "fjf jfj", "jjj fff", "jf jf", 
      "fj fj", "jj ff", "f f j j", "j j f f", "fff jjj fff",
      "jjj fff jjj", "fjfjf", "jfjfj", "jjff", "ffjj",
      "j f j f", "f j f j", "fjj", "jff", "jfj",
      "fjf jjj", "jf f jf", "j f j", "f j f", "jf jf jf",
      "ff jj ff", "jj ff jj", "fjfjf jfjfj", "j f", "f j",
      "fffjjj", "jjjfff", "f j f j f", "j f j f j", "ff j ff",
      "jj f jj", "fjfjfj", "jfjfjf", "fff j fff", "jjj f jjj",
      "fj ff jj", "jf jj ff", "f f f", "j j j", "fj",
      "jf", "ff", "jj", "fjf", "jfj", "f f j j f f j j"
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
      "df jk", "fd kj", "dk dk", "kd kd", "dd kk", 
      "kk dd", "dfjk", "kjdf", "fjdk", "dkfj",
      "k d k d", "d k d k", "fff ddd", "jjj kkk", "ddff",
      "kkjj", "dkfj", "fkjd", "kdjf", "jd kf",
      "dk dk dk", "kd kd kd", "df df", "jk jk", "kjd",
      "dfk", "kfd", "jkd", "dkf", "fjk",
      "kdf", "jd k", "kf d", "dd kk dd", "kk dd kk",
      "dfjk dfjk", "kjdf kjdf", "d f k j", "k j d f", "ddk",
      "kkd", "ffd", "jjk", "ddf", "kkj",
      "k k d d", "d d k k", "fd fd", "jk jk", "kdk",
      "dkf jkd", "fkj dkf", "kdj fkd", "jkd fjk", "dk dk"
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
      "ala", "asa", "fala", "sala", "fada", "dada",
      "lala", "assa", "salsa", "falsa", "laça", "faça",
      "saca", "jaca", "faca", "caca", "laca", "laska",
      "alas", "asas", "falas", "salas", "fadas", "dadas",
      "lalas", "assas", "salsas", "falsas", "laças", "faças",
      "salada", "calada", "sacada", "ada", "adas", "alfa",
      "asdf", "jklç", "çlkj", "fdsa", "asdfg", "hjklç",
      "sad", "lad", "kad", "fad", "jad", "dalas",
      "lasca", "casca", "sasca", "falda", "safas",
      "safada", "calas", "falas", "faia", "saia",
      "gaia", "gaja", "laja", "saja", "kaja",
      "fafa", "jaja", "kaka", "sasa", "lala", "dada",
      "a fada fala", "a sala dada", "lala assa", "a salsa falsa",
      "a s d f j k l ç", "fala a fada", "a sala e falsa"
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
      "ele", "ela", "eles", "elas", "esse", "essa",
      "isso", "ilha", "ideia", "feia", "seia", "leia",
      "fale", "fali", "sale", "sali", "cale", "cali",
      "dela", "dele", "seda", "sede", "ceda", "cedi",
      "fiel", "fies", "lies", "dias", "fias", "lias",
      "ideias", "ilhas", "feias", "seias", "leias", "fales",
      "falis", "sales", "salis", "cales", "calis", "delas",
      "deles", "sedas", "sedes", "cedas", "cedis", "fiei",
      "liei", "siei", "fale", "fali", "file", "fili",
      "se", "si", "li", "da", "de", "di", "fe", "fi",
      "je", "ji", "ke", "ki", "le", "fia", "sia",
      "leal", "laje", "aida", "lidia", "seis", "lei",
      "ela le", "ele ri", "a fada le", "a sala e feia",
      "ideia fiel", "dia de lida", "ela e leal"
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
      "rua", "riu", "rio", "reu", "rasa", "raso",
      "rara", "raro", "rula", "rulo", "rura", "ruro",
      "ura", "ure", "uri", "uro", "usa", "use",
      "usi", "uso", "fura", "fure", "furi", "furo",
      "sura", "sure", "suri", "suro", "dura", "dure",
      "duri", "duro", "cura", "cure", "curi", "curo",
      "lura", "lure", "luri", "luro", "jura", "jure",
      "juri", "juro", "ruras", "ruros", "uras", "ures",
      "uris", "uros", "usas", "uses", "usis", "usos",
      "furas", "fures", "furis", "furos", "suras", "sures",
      "ar", "lar", "sal", "ser", "ler", "dar", "ir",
      "rir", "sair", "cair", "falar", "andar", "saltar",
      "saude", "saudade", "idade", "real", "rede", "rei",
      "lei", "sul", "lua", "a rua e dura", "a lua riu",
      "fura a rede", "a saude e real", "rir e falar"
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
      "Ana", "Rui", "Luis", "Sara", "Duarte", "Carla",
      "Filipe", "Isa", "Elias", "Raul", "Lara", "Katia",
      "Sura", "Dalia", "Ariel", "Iris", "Luisa", "Rita",
      "Kika", "Ze", "Fe", "Li", "Du", "Ju",
      "Ana e Rui", "Sara e Luis", "Carla e Raul", "Isa e Elias", "Lara e Filipe",
      "Duarte e Katia", "Rita e Ariel", "Luisa e Sura", "Kika e Dalia", "Ze e Fe",
      "Li e Du", "Ju e Iris", "Rui e Ana", "Luis e Sara", "Raul e Carla",
      "Elias e Isa", "Filipe e Lara", "Katia e Duarte", "Ariel e Rita", "Sura e Luisa",
      "Dalia e Kika", "Fe e Ze", "Du e Li", "Iris e Ju", "Eu sou",
      "Tu es", "Ele e", "Ela e", "Nos somos", "Eles sao",
      "A Ana ri", "O Rui le", "A Sara fala", "A Lara sai",
      "Dalia e Lidia", "Kika e Kaka", "Lulu e Lili", "Rute e Rita",
      "Ariel e Raul", "Sara e Luis e Ana"
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
      "fale, ria.", "ele riu; ela riu.", "dia, sol, sal.", "fui. sai.", "sim, nao.",
      "ola; adeus.", "um, dois.", "tres; quatro.", "luz, cor.", "ceu. mar.",
      "lua; sol.", "pai, mae.", "tio; tia.", "avo. avo.", "irma, irmao.",
      "casa; rua.", "porta, janela.", "mesa; cadeira.", "copo. prato.", "garfo, faca.",
      "colher; taca.", "agua. sumo.", "leite, pao.", "queijo; fiambre.", "ovo. fruta.",
      "maca, pera.", "uva; banana.", "doce. salgado.", "quente, frio.", "alto; baixo.",
      "gordo. magro.", "bom, mau.", "feio; bonito.", "rico. pobre.", "novo, velho.",
      "grande; pequeno.", "largo. estreito.", "cheio, vazio.", "limpo; sujo.", "seco. molhado.",
      "duro, mole.", "aspero; liso.", "claro. escuro.", "dia, noite.", "cedo; tarde.",
      "hoje. amanha.", "ontem, agora.", "sempre; nunca.", "talvez. quiça.", "sim, claro.",
      "Eu sou a Ana.", "Tu es o Rui.", "Ela ri; ele fala.", "A rua e larga.",
      "O dia e lindo.", "A lua e clara.", "Sair, rir, ler.",
      "A Ana ri; o Rui fala.", "Lara, sai da rua.", "Eu li, tu leste."
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
