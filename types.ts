export enum Finger {
  LeftPinky = 'pink-500',
  LeftRing = 'blue-500',
  LeftMiddle = 'green-500',
  LeftIndex = 'yellow-500',
  RightIndex = 'orange-500',
  RightMiddle = 'purple-500',
  RightRing = 'teal-500',
  RightPinky = 'red-500',
  Thumb = 'gray-400'
}

export interface KeyConfig {
  char: string;
  finger: Finger;
  row: number; // 0 = number, 1 = top, 2 = home, 3 = bottom
  width?: number; // relative width, default 1
  label?: string; // Display label if different from char
}

export interface Level {
  id: number;
  title: string;
  description: string;
  newKeys: string[]; // Keys introduced in this level
  allKeys: string[]; // All keys available up to this level
  textSamples: string[]; // Hardcoded samples
  difficulty: 'easy' | 'medium' | 'hard';
  minWpm: number;
  minAccuracy: number;
}

export enum GameMode {
  Campaign = 'CAMPAIGN',
  Timed = 'TIMED',
  ErrorDrill = 'ERROR_DRILL'
}

export interface ErrorStats {
  [targetChar: string]: number; // Count of misses for this character
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
}

export interface GameState {
  currentLevelId: number;
  unlockedLevels: number[];
  history: SessionResult[];
  isPlaying: boolean;
  errorStats: ErrorStats;
  achievements: string[]; // IDs of unlocked achievements
}

export interface SessionResult {
  levelId: number;
  mode: GameMode;
  wpm: number;
  accuracy: number;
  date: string;
  stars: 1 | 2 | 3;
  duration?: number;
  correctStats?: ErrorStats; // New: track correct presses for decay logic
}

export enum AppScreen {
  Dashboard = 'DASHBOARD',
  Exercise = 'EXERCISE',
  Result = 'RESULT',
  Stats = 'STATS',
  Achievements = 'ACHIEVEMENTS'
}