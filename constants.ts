
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
  { 
      id: 1, 
      title: "A Linha Mágica", 
      description: "Dedos indicadores! F e J.", 
      newKeys: ['f', 'j', ' '], 
      allKeys: ['f', 'j', ' '], 
      textSamples: [
          "fff jjj", "jf jf", "fjfj", "jfjf", "ff jj", "jj ff", "j f j f", "f f j j",
          "fff", "jjj", "jjj fff", "f j f", "j f j", "fff j", "jjj f", "ff jj ff", 
          "jj ff jj", "fjf", "jfj", "f j f j", "j f j f", "jf jf jf", "fj fj fj",
          "j j f f", "f f j j", "jjf", "ffj", "fjj", "jff", "jfjfjf", "fjfjfj",
          "j j j", "f f f", "j f", "f j", "jf", "fj", "fjf jfj", "jfj fjf",
          "ff jj f", "jj ff j", "fffjjj", "jjjfff", "f j f j f", "j f j f j", "ff j ff",
          "jj f jj", "f j f", "f f f j j j", "j j j f f f"
      ], 
      difficulty: 'easy', 
      minWpm: 5, 
      minAccuracy: 85 
  },
  { 
      id: 2, 
      title: "Vizinhos Amigos", 
      description: "D e K. Usa os dedos médios!", 
      newKeys: ['d', 'k'], 
      allKeys: ['f', 'j', ' ', 'd', 'k'], 
      textSamples: [
          "dk dk", "kd kd", "df jk", "jk df", "dd kk", "kk dd", "fd kj", "kj fd",
          "dkf jkd", "dfjk", "jkdf", "ddkk", "ffjj", "ddff", "kkjj", "d f k j",
          "k d j f", "ddd kkk", "kkk ddd", "dfjk dfjk", "kjd kjd", "fdk jdl", "dkfj",
          "dk f j", "k d j f", "dd kk ff jj", "kjd", "dfk", "kdf", "djk", "fjd",
          "kfd", "jkd", "dkf", "kdj", "fdk", "jkd", "kdfj", "jdfk", "dkfj",
          "kfjd", "djkf", "fjkd", "kdfj", "jdkf", "fkdj", "kdjf", "djfk", "fdkj"
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
          "ala", "sala", "fala", "fada", "lasca", "salsa", "asa", "saca", "laça", "assa",
          "lada", "jaca", "faca", "caca", "dada", "gala", "lago", "fofa", "sofá", "alfa",
          "falsa", "la", "ja", "as", "da", "fa", "ka", "sa", "ca", "la",
          "alas", "salas", "falas", "fadas", "lascas", "salsas", "asas", "sacas", "laças", "assas",
          "aladas", "caladas", "saladas", "faladas", "safadas", "fofas", "lajes", "lajes", "fajutas", "fajutas",
          "lsls", "asas", "klkl", "çlçl", "sasa", "fafa", "jaja", "kaka", "lala", "çaca",
          "a s d f", "j k l ç", "asdf", "jklç", "fdsa", "çlkj", "aa ss dd ff", "jj kk ll çç"
      ], 
      difficulty: 'medium', 
      minWpm: 10, 
      minAccuracy: 90 
  },
  { 
      id: 4, 
      title: "A Subir", 
      description: "E, I, O, T. Para a fila de cima!", 
      newKeys: ['e', 'i', 'o', 't'], 
      allKeys: ['f', 'j', ' ', 'd', 'k', 's', 'l', 'a', 'ç', 'e', 'i', 'o', 't'], 
      textSamples: [
          "ele", "ela", "tio", "tia", "oito", "leite", "teto", "fita", "fato", "fofo",
          "foto", "jota", "jeito", "lote", "loto", "liso", "leito", "laço", "loja", "ledo",
          "sete", "site", "siso", "solo", "soco", "selo", "seta", "seda", "sota", "soja",
          "isto", "isso", "esse", "essa", "elite", "lista", "teste", "tosta", "torta", "tosta",
          "dedo", "dito", "dia", "dose", "dote", "data", "dela", "dele", "deste", "desta",
          "teia", "tala", "tela", "tole", "tola", "tolo", "todo", "toda", "tato", "taco",
          "ali", "aqui", "acolá", "tali", "tili", "lili", "lolo", "toto", "jojo", "fifi"
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
          "rua", "rio", "mar", "ver", "comer", "cantar", "correr", "carta", "curto", "cravo",
          "carro", "corre", "cinto", "conta", "canto", "cento", "cinco", "cume", "cova", "cura",
          "curso", "navio", "neve", "nove", "nuvem", "nunca", "nome", "noite", "norte", "novo",
          "muro", "mesa", "meta", "medo", "moto", "morte", "morto", "monte", "muito", "mudo",
          "vento", "vela", "vale", "vida", "vulto", "vaca", "vara", "vaso", "vera", "verde",
          "ave", "uva", "um", "uma", "uns", "umas", "nos", "nas", "vos", "vas",
          "amor", "amar", "ator", "atriz", "ar", "arte", "arco", "arca", "alto", "alta"
      ], 
      difficulty: 'hard', 
      minWpm: 15, 
      minAccuracy: 90 
  },
  { 
      id: 6, 
      title: "Mestre do Alfabeto", 
      description: "B, G, H, P, Q, W, X, Y, Z.", 
      newKeys: ['b', 'g', 'h', 'p', 'q', 'w', 'x', 'y', 'z', 'ShiftLeft', 'ShiftRight'], 
      allKeys: [...ALPHA_KEYS], 
      textSamples: [
          "zebra", "xadrez", "quase", "queijo", "quanto", "quando", "hoje", "hora", "hotel", "hino",
          "gato", "galo", "golo", "gula", "guerra", "golpe", "gente", "geral", "grito", "grupo",
          "bola", "bala", "belo", "bico", "boca", "bule", "bota", "bata", "base", "beijo",
          "pato", "pata", "pelo", "pula", "pipa", "pote", "pulo", "pano", "pino", "pena",
          "kwanza", "yoga", "kiwi", "taxi", "texto", "exame", "boxe", "fax", "web", "watt",
          "azul", "azeite", "azia", "zona", "zero", "zinco", "zola", "zangado", "zumbido", "zelo",
          "Walter", "William", "Xavier", "Yara", "Zulmira", "Quim", "Helena", "Gustavo", "Beatriz", "Paulo",
          "Angola", "Portugal", "Luanda", "Lisboa", "Porto", "Benguela", "Huambo", "Coimbra", "Faro", "Braga"
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
      allKeys: [...ALPHA_KEYS, '.', ',', ';'], 
      textSamples: [
          "ola, tudo bem.", "sim, eu gosto.", "o gato; o cao.", "luanda, angola.", "porto, portugal.",
          "um, dois, tres.", "dia, tarde, noite.", "sol, lua, mar.", "a casa, a rua.", "o pai, a mae.",
          "agua, pao, vinho.", "mesa, cadeira, sofa.", "lapis, caneta, papel.", "vermelho, verde, azul.", "um; dois; tres.",
          "sim; nao; talvez.", "hoje, amanha.", "aqui, ali.", "perto, longe.", "alto, baixo.",
          "gato, cao, peixe.", "leao, zebra, girafa.", "banana, maca, pera.", "arroz, massa, batata.", "carro, mota, barco.",
          "ana, rui, ze.", "sara, rita, luis.", "primavera, verao.", "outono, inverno.", "norte, sul, este.",
          "segunda, terca.", "quarta, quinta.", "sexta, sabado.", "domingo, feriado.", "janeiro, fevereiro.", "marco, abril."
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
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5'], 
      textSamples: [
          "123", "45", "1 2 3 4 5", "12345", "54321", "11 22 33", "44 55", "12 13 14", "15 25 35", "45 54 32",
          "tenho 10 anos", "1 pato", "2 gatos", "3 caes", "4 bolas", "5 dedos", "a1 b2 c3", "sala 12", "rua 34", "ano 1",
          "1a classe", "2o lugar", "3a vez", "4 patas", "5 estrelas", "numero 1", "teste 2", "licao 3", "parte 4", "nivel 5",
          "1, 2, 3.", "4 e 5.", "123 ola.", "135 impar.", "24 par.", "31 dias.", "52 semanas.", "12 meses.", "24 horas.", "4 estaçoes."
      ], 
      difficulty: 'medium', 
      minWpm: 10, 
      minAccuracy: 85 
  },
  { 
      id: 9, 
      title: "Números (Dir.)", 
      description: "Completa a contagem com a mão direita.", 
      newKeys: ['6', '7', '8', '9', '0'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 
      textSamples: [
          "678", "90", "6 7 8 9 0", "67890", "09876", "66 77 88", "99 00", "1990", "2000", "2026",
          "dia 10", "60 segundos", "70 minutos", "80 pontos", "90 porcento", "100 euros", "nota 10", "top 10", "6 7 8 9 0", "ano 2025",
          "pagina 67", "quarto 89", "senha 007", "agente 86", "rota 66", "km 90", "voo 747", "bus 80", "18 anos", "100 metros",
          "67 68 69", "70 80 90", "10 20 30", "40 50 60", "0 1 2", "7 dias", "9 vidas", "8 patas", "6 faces", "0 problemas"
      ], 
      difficulty: 'medium', 
      minWpm: 10, 
      minAccuracy: 85 
  },
  { 
      id: 10, 
      title: "Pontuação Extra", 
      description: "Perguntas e emoções! ? ! -", 
      newKeys: ['?', '!', '-'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-'], 
      textSamples: [
          "ola!", "tudo bem?", "sim!", "nao!", "socorro!", "parabens!", "feliz aniversario!", "bom dia!", "boa tarde!", "boa noite!",
          "que horas sao?", "onde estas?", "quem es tu?", "anda ca!", "foge!", "golo!", "angola!", "portugal!", "viva!", "forca!",
          "sim-nao", "10-5=5", "ano-novo", "tique-taque", "ping-pong", "arco-iris", "beija-flor", "guarda-chuva", "bem-vindo", "mal-educado",
          "posso ir?", "queres brincar?", "vamos jogar?", "que giro!", "que fixe!", "que pena!", "ai!", "ui!", "ei!", "ou!",
          "norte-sul", "este-oeste", "alto-baixo", "frente-tras", "dentro-fora", "1-0", "2-1", "3-2", "4-3", "5-4"
      ], 
      difficulty: 'medium', 
      minWpm: 15, 
      minAccuracy: 90 
  },
  { 
      id: 11, 
      title: "Histórias do Mundo", 
      description: "Escreve histórias sobre Portugal e Angola.", 
      newKeys: [], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-'], 
      textSamples: [
          "O sol brilha no ceu azul.", "A menina brinca com a bola.", "O menino corre na praia.", "Gosto muito de ler livros.", "A escola e divertida.",
          "Tenho muitos amigos.", "O gato dorme no sofa.", "O cao ladra alto.", "Vamos passear no parque.", "A comida esta boa.",
          "Luanda e uma cidade grande.", "Lisboa tem eletricos amarelos.", "O Rio Tejo e bonito.", "O Rio Kwanza e longo.", "A Serra da Estrela tem neve.",
          "Gosto de pasteis de nata.", "A muamba e deliciosa.", "O imbondeiro e uma arvore gigante.", "O galo de barcelos e colorido.", "A palanca negra e rara.",
          "Vou visitar os meus avos.", "A minha casa e amarela.", "O carro e vermelho.", "A bicicleta e azul.", "O autocarro e verde.",
          "Estudo matematica e portugues.", "Gosto de desenhar e pintar.", "Toco piano e viola.", "Jogo futebol e basquetebol.", "Nado na piscina e no mar.",
          "O meu animal favorito e o leao.", "A girafa tem o pescoco comprido.", "O elefante tem uma tromba grande.", "O macaco gosta de bananas.", "O passaro voa alto.",
          "Hoje esta a chover.", "Amanha vai fazer sol.", "Ontem fui ao cinema.", "Logo vou jantar fora.", "Agora estou a aprender."
      ], 
      difficulty: 'hard', 
      minWpm: 20, 
      minAccuracy: 92 
  },
  { 
      id: 12, 
      title: "Acentos Agudos", 
      description: "Primeiro o acento, depois a letra! (´ e `)", 
      newKeys: ['´', '`'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-', '´', '`'], 
      textSamples: [
          "café", "página", "avó", "está", "água", "àquela", "pé", "fé", "chaminé", "jacaré",
          "boné", "sofá", "olá", "águia", "árvore", "óculos", "último", "único", "rápido", "fácil",
          "difícil", "útil", "amável", "incrível", "túnel", "açúcar", "à", "àquele", "àquilo", "às",
          "lápis", "tênis", "prémio", "próprio", "sério", "história", "vitória", "glória", "memória", "férias",
          "fábula", "música", "física", "química", "prática", "lógica", "mágico", "trágico", "cómico", "épico",
          "língua", "régua", "bússola", "pássaro", "fósforo", "chá", "pá", "dá", "cá", "lá",
          "nós", "vós", "trás", "atrás", "sofás", "cafés", "bambus", "perus", "baús", "saúde"
      ], 
      difficulty: 'hard', 
      minWpm: 12, 
      minAccuracy: 85 
  },
  { 
      id: 13, 
      title: "Ondas e Chapéus", 
      description: "Usa o Til (~) e o Chapéu (^) nas vogais.", 
      newKeys: ['~', '^'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-', '´', '`', '~', '^'], 
      textSamples: [
          "mãe", "pão", "amanhã", "você", "pântano", "cão", "mão", "não", "são", "tão",
          "vão", "chão", "lição", "ação", "balão", "coração", "melão", "limão", "avô", "mês",
          "três", "português", "inglês", "francês", "lâmpada", "câmara", "pêssego", "estômago", "autocarro", "ônibus",
          "voo", "enjoo", "campeão", "leão", "avião", "camião", "irmão", "irmã", "maçã", "lã",
          "rã", "fã", "grão", "órgão", "sótão", "bênção", "estância", "ambulância", "ciência", "paciência",
          "experiência", "consequência", "frequência", "sequência", "pêndulo", "gênero", "tênue", "vôlei", "pônei", "robô"
      ], 
      difficulty: 'hard', 
      minWpm: 12, 
      minAccuracy: 85 
  },
  { 
      id: 14, 
      title: "Gritos e Emoções", 
      description: "Letras grandes com acento! Á, É, Í, Ó, Ú.", 
      newKeys: [], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-', '´', '`', '~', '^'], 
      textSamples: [
          "ÁGUA!", "OLÁ!", "É TÃO BOM!", "ÓTIMO!", "ÚNICO!", "ÂNGELA", "ÊXITO", "ÍNDIA", "ÁFRICA", "ÁSIA",
          "ÓSCAR", "ÉVORA", "ÁGUEDA", "ÂNIMO", "ÍCONE", "ÓPERA", "ÚLTIMO", "ÁRVORE", "ÉTER", "ÍRIS",
          "É bom.", "Água fresca.", "Ótimo dia.", "Última vez.", "Ângulo reto.", "Ênfase.", "Íman.", "Órbita.", "Útero.", "Átomo.",
          "Às vezes.", "À tarde.", "À noite.", "Às 10h.", "Às segundas.", "Às terças.", "Às quartas.", "Às quintas.", "Às sextas.", "À vontade.",
          "JOÃO", "MÃE", "CÃO", "PÃO", "NÃO", "AVÔ", "AVÓ", "VOCÊ", "TRÊS", "MÊS",
          "PORTUGUÊS", "FRANCÊS", "INGLÊS", "CHINÊS", "JAPONÊS", "ALEMÃO", "ESPANHOL", "ITALIANO", "RUSSO", "GREGO"
      ], 
      difficulty: 'hard', 
      minWpm: 12, 
      minAccuracy: 85 
  },
  { 
      id: 15, 
      title: "Símbolos Mágicos", 
      description: "Descobre os símbolos escondidos nos números! # $ % &", 
      newKeys: ['#', '$', '%', '&'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-', '´', '`', '~', '^', '#', '$', '%', '&'], 
      textSamples: [
          "#hashtag", "100%", "Eu & Tu", "5$", "10$", "#teclado", "#magico", "#escola", "50%", "20$",
          "#angola", "#portugal", "#brasil", "#lisboa", "#luanda", "#porto", "#maputo", "#praia", "#dili", "#macau",
          "desconto 10%", "taxa 5%", "preco 20$", "juros 2%", "bateria 100%", "volume 50%", "brilho 75%", "zoom 200%", "lucro 10%", "perda 5%",
          "pai & mae", "caes & gatos", "sol & lua", "dia & noite", "preto & branco", "sim & nao", "alto & baixo", "perto & longe", "frio & quente", "doce & salgado",
          "#fyp", "#tbt", "#love", "#instagood", "#photooftheday", "#fashion", "#beautiful", "#happy", "#cute", "#like4like"
      ], 
      difficulty: 'hard', 
      minWpm: 15, 
      minAccuracy: 90 
  },
  { 
      id: 16, 
      title: "A Grande Mistura", 
      description: "Números, símbolos e letras. O derradeiro teste!", 
      newKeys: [], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '?', '!', '-', '´', '`', '~', '^', '#', '$', '%', '&'], 
      textSamples: [
          'A Ana disse: "Olá!"', "(Fim do jogo)", "O preco e 10$.", "Eu tenho 100% de bateria.", "Ola #mundo!", "Tu & Eu = Nos.",
          "A nota foi 100%.", "Desconto de 50%.", "Custou 5$ e 20 cêntimos.", "1, 2, 3... Fogo!", "A+B=C", "E=mc2", "H2O", "CO2",
          "Rua 25 de Abril, n.º 10", "Av. da Liberdade, 100", "Tel: 21 123 45 67", "Tlm: 91 234 56 78", "NIF: 123 456 789", "IBAN: PT50...",
          "www.google.com", "user@email.com", "http://", "https://", "ftp://", "192.168.1.1", "127.0.0.1", "localhost:3000",
          "Data: 01/01/2026", "Hora: 12:00", "Temp: 25ºC", "Peso: 50kg", "Altura: 1.60m", "Vel: 100km/h", "Dist: 10km", "Area: 100m2"
      ], 
      difficulty: 'hard', 
      minWpm: 15, 
      minAccuracy: 90 
  },
  { 
      id: 17, 
      title: "O Poeta Mágico", 
      description: "Rimas e canções com muitos acentos!", 
      newKeys: [], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '´', '~', '^', '`', '?', '!', '-', '#', '$', '%', '&'], 
      textSamples: [
          "A avó põe o pão na mesa.", "O céu é tão azul!", "Atirei o pau ao gato.", "Mas o gato não morreu.", "Dona Chica admirou-se.",
          "Do berro que o gato deu.", "Miau!", "Joana come a papa.", "Papagaio louro do bico dourado.", "Quem está na janela?",
          "Eu sou o coelhinho.", "De olhos vermelhos.", "De pelo branquinho.", "O balão do João.", "Sobe, sobe, balão azul.", "Cai, cai, balão.",
          "Parabéns a você.", "Nesta data querida.", "Muitas felicidades.", "Muitos anos de vida.", "Hoje é dia de festa.",
          "Cantam as nossas almas.", "Para o menino Jesus.", "Uma salva de palmas.", "A saia da Carolina.", "Tem um lagarto pintado.",
          "O lagarto mexeu o rabo.", "A Carolina ficou de lado.", "Jardim da Celeste.", "Tem cravos e rosas.", "Tem muitas meninas.",
          "Que são muito formosas.", "Malhão, malhão.", "Ó malhão triste vida.", "Ó malhão, malhão.", "Que vida é a tua.",
          "Comer e beber.", "Passear na rua.", "Oliveirinha da serra.", "O vento leva a flor.", "Só a mim ninguém me leva.",
          "Para ao pé do meu amor.", "As pombinhas da Catrina.", "Andaram de mão em mão.", "Foram ter à quinta nova.", "Ao pombal de S. João."
      ], 
      difficulty: 'hard', 
      minWpm: 25, 
      minAccuracy: 95 
  },
  { 
      id: 18, 
      title: "O Código (Variáveis)", 
      description: "Aprende a escrever como um programador! camelCase e snake_case.", 
      newKeys: ['_'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '?', '!', '-', '_', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], 
      textSamples: ["minhaVariavel", "nome_do_utilizador"], 
      difficulty: 'hard', 
      minWpm: 15, 
      minAccuracy: 90 
  },
  { 
      id: 19, 
      title: "O Hacker (Alt Gr)", 
      description: "Usa a tecla Alt Gr (ou Ctrl+Alt) para símbolos especiais!", 
      newKeys: ['@', '[', ']', '{', '}', '€'], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '?', '!', '-', '_', '@', '[', ']', '{', '}', '€', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'AltRight'], 
      textSamples: ["user@gmail.com", "[1, 2, 3]"], 
      difficulty: 'hard', 
      minWpm: 12, 
      minAccuracy: 85 
  },
  { 
      id: 20, 
      title: "O Sistema (Comandos)", 
      description: "Mistura tudo! Código real e comandos de sistema.", 
      newKeys: [], 
      allKeys: [...ALPHA_KEYS, '.', ',', ';', '?', '!', '-', '_', '@', '[', ']', '{', '}', '€', '/', '=', '"', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'AltRight'], 
      textSamples: ["ls -la", "console.log()"], 
      difficulty: 'hard', 
      minWpm: 20, 
      minAccuracy: 95 
  }
];

export const SUCCESS_MESSAGES = [
  "Incrível!", "Fantástico!", "Muito bem!", "És um craque!", "Boa!", "Continua assim!", "Espetacular!"
];
