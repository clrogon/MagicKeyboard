
import { Finger, KeyConfig, Level, Achievement, Theme, KeyboardLayout } from './types';

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

const QWERTY: KeyConfig[][] = [
  [
    { char: '1', subLabel: '!', finger: Finger.LeftPinky, row: 0 },
    { char: '2', subLabel: '"', tertLabel: '@', finger: Finger.LeftRing, row: 0 },
    { char: '3', subLabel: '#', tertLabel: '£', finger: Finger.LeftMiddle, row: 0 },
    { char: '4', subLabel: '$', tertLabel: '§', finger: Finger.LeftIndex, row: 0 },
    { char: '5', subLabel: '%', tertLabel: '€', finger: Finger.LeftIndex, row: 0 },
    { char: '6', subLabel: '&', finger: Finger.RightIndex, row: 0 },
    { char: '7', subLabel: '/', tertLabel: '{', finger: Finger.RightIndex, row: 0 },
    { char: '8', subLabel: '(', tertLabel: '[', finger: Finger.RightMiddle, row: 0 },
    { char: '9', subLabel: ')', tertLabel: ']', finger: Finger.RightRing, row: 0 },
    { char: '0', subLabel: '=', tertLabel: '}', finger: Finger.RightPinky, row: 0 },
    { char: "'", subLabel: '?', finger: Finger.RightPinky, row: 0 }, 
  ],
  [
    { char: 'q', finger: Finger.LeftPinky, row: 1 },
    { char: 'w', finger: Finger.LeftRing, row: 1 },
    { char: 'e', tertLabel: '€', finger: Finger.LeftMiddle, row: 1 },
    { char: 'r', finger: Finger.LeftIndex, row: 1 },
    { char: 't', finger: Finger.LeftIndex, row: 1 },
    { char: 'y', finger: Finger.RightIndex, row: 1 },
    { char: 'u', finger: Finger.RightIndex, row: 1 },
    { char: 'i', finger: Finger.RightMiddle, row: 1 },
    { char: 'o', finger: Finger.RightRing, row: 1 },
    { char: 'p', finger: Finger.RightPinky, row: 1 },
    { char: '´', subLabel: '`', finger: Finger.RightPinky, row: 1 },
  ],
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
    { char: '~', subLabel: '^', finger: Finger.RightPinky, row: 2 },
  ],
  [
    { char: 'ShiftLeft', label: 'Shift', finger: Finger.LeftPinky, row: 3, width: 1.5 },
    { char: 'z', tertLabel: '<', finger: Finger.LeftPinky, row: 3 },
    { char: 'x', tertLabel: '>', finger: Finger.LeftRing, row: 3 },
    { char: 'c', finger: Finger.LeftMiddle, row: 3 },
    { char: 'v', finger: Finger.LeftIndex, row: 3 },
    { char: 'b', finger: Finger.LeftIndex, row: 3 },
    { char: 'n', finger: Finger.RightIndex, row: 3 },
    { char: 'm', finger: Finger.RightIndex, row: 3 },
    { char: ',', finger: Finger.RightMiddle, row: 3 },
    { char: '.', finger: Finger.RightRing, row: 3 }, 
    { char: '-', subLabel: '_', finger: Finger.RightPinky, row: 3 },
    { char: 'ShiftRight', label: 'Shift', finger: Finger.RightPinky, row: 3, width: 1.5 },
  ],
  [
    { char: 'ControlLeft', label: 'Ctrl', finger: Finger.LeftPinky, row: 4, width: 1.5 },
    { char: 'AltLeft', label: 'Alt', finger: Finger.Thumb, row: 4, width: 1.5 },
    { char: ' ', label: 'Espaço', finger: Finger.Thumb, row: 4, width: 7 },
    { char: 'AltRight', label: 'AltGr', finger: Finger.Thumb, row: 4, width: 1.5 },
    { char: 'ControlRight', label: 'Ctrl', finger: Finger.RightPinky, row: 4, width: 1.5 }
  ]
];

export const KEYBOARD_LAYOUTS: Record<KeyboardLayout, KeyConfig[][]> = {
    qwerty: QWERTY,
    azerty: QWERTY 
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_3_stars', title: 'Estrela Nascente', description: 'Conquistaste 3 estrelas pela primeira vez!', icon: 'Star', color: 'bg-yellow-400' },
  { id: 'wpm_30', title: 'Velocista Júnior', description: 'Atingiste 30 Palavras por Minuto!', icon: 'Zap', color: 'bg-blue-400' },
  { id: 'speed_demon', title: 'Relâmpago', description: 'Atingiste 50 Palavras por Minuto!', icon: 'Zap', color: 'bg-blue-600' },
  { id: 'accuracy_master', title: 'Perfeccionista', description: 'Completaste um nível com 100% de precisão.', icon: 'Target', color: 'bg-emerald-500' },
  { id: 'marathon_runner', title: 'Maratonista', description: 'Jogaste mais de 1 hora no total.', icon: 'Hourglass', color: 'bg-teal-500' }
];

export const PLAYER_TITLES: Record<number, string> = {
    1: 'Aprendiz',
    2: 'Estudante',
    3: 'Teclista',
    5: 'Escritor Veloz',
    10: 'Lenda do Teclado'
};

export const AVATARS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🦄', '🐙', '🦖', '🚀', '👽', '🤖'];

export const getXpForNextLevel = (level: number) => level * 250;

export const HOMEWORK_CODES: Record<string, { title: string; content: string; desc: string }> = {
    'TPC-1': { title: 'Desafio do CH', desc: 'Palavras com CH', content: 'chave chuva chefe chato cheio tacho bicho cacho chofer chutar chaminé' },
    'TPC-2': { title: 'Desafio do LH', desc: 'Palavras com LH', content: 'milho filho olho alho telha velha folha ilha palha colher coelho ovelha' },
};

export const LIBRARY_TEXTS = [
    { id: 'lib_1', title: "Mayombe", author: "Pepetela", origin: "Angola", content: "A mata aceitou-os. O Mayombe é uma mancha escura de árvores gigantescas, onde o sol custa a penetrar. No fundo do vale, o rio corria entre pedras enormes, cobertas de musgo verde." },
    { id: 'lib_2', title: "Luuanda", author: "José Luandino Vieira", origin: "Angola", content: "O sol de Luanda batia nas chapas de zinco dos musseques. O cheiro do peixe frito subia no ar quente da tarde de domingo, enquanto as crianças corriam pelas areias vermelhas." },
    { id: 'lib_3', title: "Sagrada Esperança", author: "Agostinho Neto", origin: "Angola", content: "Não basta que a nossa causa seja pura e justa. É necessário que a pureza e a justiça existam dentro de nós. Para que o nosso passo seja firme e o nosso olhar seja claro para o futuro." },
    { id: 'lib_4', title: "Mensagem", author: "Fernando Pessoa", origin: "Portugal", content: "O mar salgado, quanto do teu sal são lágrimas de Portugal! Por te cruzarmos, quantas mães choraram, quantos filhos em vão rezaram! Valeu a pena? Tudo vale a pena se a alma não é pequena." },
    { id: 'lib_5', title: "Memorial do Convento", author: "José Saramago", origin: "Portugal", content: "O homem que vai a pé, o homem que vai a cavalo, o homem que vai no carro, todos vão para o mesmo fim, a morte, mas cada um vai ao seu passo e com o seu fôlego." },
    { id: 'lib_6', title: "Os Lusíadas", author: "Luís de Camões", origin: "Portugal", content: "As armas e os barões assinalados, que da ocidental praia Lusitana, por mares nunca dantes navegados, passaram ainda além da Taprobana, em perigos e guerras esforçados." },
    { id: 'lib_7', title: "Ubirajara", author: "José de Alencar", origin: "Brasil", content: "Ubirajara, o senhor da lança, partiu para a caça. A floresta tremeu com o seu passo firme e o seu arco de guerra. O guerreiro era como o jaguar, rápido e certeiro." },
    { id: 'lib_8', title: "O Alienista", author: "Machado de Assis", origin: "Brasil", content: "As crônicas da vila de Itaguaí dizem que em tempos remotos vivera ali um certo médico, o Dr. Simão Bacamarte, filho da nobreza da terra e o maior dos médicos do Brasil." }
];

const ALPHA_KEYS = ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v', 'b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight'];

export const LEVELS: Level[] = [
  { id: 1, title: "A Linha Mágica", description: "Dedos indicadores! F e J.", newKeys: ['f', 'j', ' '], allKeys: ['f', 'j', ' '], textSamples: ["fff jjj", "jfjf", "fjf jfj"], difficulty: 'easy', minWpm: 5, minAccuracy: 85 },
  { id: 2, title: "Vizinhos Amigos", description: "D e K. Usa os dedos médios!", newKeys: ['d', 'k'], allKeys: ['f', 'j', ' ', 'd', 'k'], textSamples: ["df jk", "fd kj", "dk dk"], difficulty: 'easy', minWpm: 8, minAccuracy: 85 },
  { id: 3, title: "Família Completa", description: "S, L, A e Ç. A linha do meio completa!", newKeys: ['s', 'l', 'a', 'ç'], allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç'], textSamples: ["ala", "asa", "fala", "sala"], difficulty: 'medium', minWpm: 10, minAccuracy: 90 },
  { id: 4, title: "A Subir", description: "E, I, O, T. Para a fila de cima!", newKeys: ['e', 'i', 'o', 't'], allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't'], textSamples: ["ele", "ela", "tio", "oito", "leite"], difficulty: 'medium', minWpm: 12, minAccuracy: 90 },
  { id: 5, title: "Exploradores", description: "R, U, N, M, C, V. Palavras novas!", newKeys: ['r', 'u', 'n', 'm', 'c', 'v'], allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't', 'r', 'u', 'n', 'm', 'c', 'v'], textSamples: ["rua", "rio", "mar", "ver", "comer"], difficulty: 'hard', minWpm: 15, minAccuracy: 90 },
  { id: 6, title: "Mestre do Alfabeto", description: "B, G, H, P, Q, W, X, Y, Z.", newKeys: ['b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight'], allKeys: [...ALPHA_KEYS], textSamples: ["Kwanza", "Zola", "Benguela", "Huambo"], difficulty: 'hard', minWpm: 12, minAccuracy: 85 },
  { id: 7, title: "Símbolos", description: "Pontos e vírgulas para dar pausa.", newKeys: ['.', ',', ';'], allKeys: [...ALPHA_KEYS, '.', ',', ';'], textSamples: ["Luanda, Angola.", "Porto, Norte."], difficulty: 'hard', minWpm: 15, minAccuracy: 90 },
  { id: 8, title: "Números (Esq.)", description: "A fila de cima! 1, 2, 3, 4, 5.", newKeys: ['1', '2', '3', '4', '5'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5'], textSamples: ["123", "45", "1 2 3 4 5"], difficulty: 'medium', minWpm: 10, minAccuracy: 85 },
  { id: 9, title: "Números (Dir.)", description: "A fila de cima! 6, 7, 8, 9, 0.", newKeys: ['6', '7', '8', '9', '0'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], textSamples: ["678", "90", "6 7 8 9 0"], difficulty: 'medium', minWpm: 10, minAccuracy: 85 },
  { id: 10, title: "A Minha Escola", description: "Revisão de letras e números.", newKeys: [], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], textSamples: ["Estou no 3 ano", "Tenho 10 anos"], difficulty: 'medium', minWpm: 15, minAccuracy: 90 },
  { id: 11, title: "Grandes Aventuras", description: "Textos mais longos para treinar a fluidez.", newKeys: [], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], textSamples: ["O meu pai foi ao mercado comprar peixe fresco para o jantar."], difficulty: 'hard', minWpm: 20, minAccuracy: 92 },
  { id: 12, title: "Acentos Mágicos", description: "O acento agudo (´). café, avó, página.", newKeys: ['´'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´'], textSamples: ["café", "página", "avó", "está", "água"], difficulty: 'hard', minWpm: 12, minAccuracy: 85 },
  { id: 13, title: "O Som do Mar", description: "O til (~). mãe, pão, amanhã.", newKeys: ['~'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´', '~'], textSamples: ["mãe", "pão", "amanhã", "coringão", "avião"], difficulty: 'hard', minWpm: 12, minAccuracy: 85 },
  { id: 14, title: "O Chapéu do Rei", description: "Circunflexo (^) e Grave (`).", newKeys: ['^', '`'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´', '~', '^', '`'], textSamples: ["você", "pântano", "àquela", "avô"], difficulty: 'hard', minWpm: 12, minAccuracy: 85 },
  { id: 15, title: "Emoções", description: "Pergunta e Exclamação (? ! : ).", newKeys: ['?', '!', ':'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´', '~', '^', '`', '?', '!', ':'], textSamples: ["Olá!", "Tudo bem?", "Atenção: perigo!"], difficulty: 'hard', minWpm: 15, minAccuracy: 90 },
  { id: 16, title: "Diálogos", description: "Aspas, parênteses e hífens.", newKeys: ['"', '(', ')', '-'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´', '~', '^', '`', '?', '!', ':', '"', '(', ')', '-'], textSamples: ['A Ana disse: "Olá!"', "(Fim do jogo)"], difficulty: 'hard', minWpm: 15, minAccuracy: 90 },
  { id: 17, title: "O Último Desafio", description: "Prepara-te para os níveis de código!", newKeys: [], allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´', '~', '^', '`', '?', '!', ':', '"', '(', ')', '-'], textSamples: ["O 1 desafio está quase a acabar!", "99% pronto!"], difficulty: 'hard', minWpm: 25, minAccuracy: 95 },
  { id: 18, title: "O Código (Variáveis)", description: "camelCase e snake_case.", newKeys: ['_'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '?', '!', '-', '_', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], textSamples: ["minhaVariavel", "nome_do_utilizador"], difficulty: 'hard', minWpm: 15, minAccuracy: 90 },
  { id: 19, title: "O Hacker (Alt Gr)", description: "@, [, ], {, }, €.", newKeys: ['@', '[', ']', '{', '}', '€'], allKeys: [...ALPHA_KEYS, '.', ',', ';', '?', '!', '-', '_', '@', '[', ']', '{', '}', '€', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'AltRight'], textSamples: ["user@gmail.com", "[1, 2, 3]"], difficulty: 'hard', minWpm: 12, minAccuracy: 85 },
  { id: 20, title: "O Sistema (Comandos)", description: "Terminal e Código.", newKeys: [], allKeys: [...ALPHA_KEYS, '.', ',', ';', '?', '!', '-', '_', '@', '[', ']', '{', '}', '€', '/', '=', '"', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'AltRight'], textSamples: ["ls -la", "console.log()"], difficulty: 'hard', minWpm: 20, minAccuracy: 95 }
];

export const SUCCESS_MESSAGES = [
  "Incrível!", "Fantástico!", "Muito bem!", "És um craque!", "Boa!", "Continua assim!", "Espetacular!"
];
