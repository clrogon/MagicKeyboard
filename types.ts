
/**
 * Maps logical fingers to Tailwind CSS color classes.
 */
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

export type Theme = 'rose' | 'blue' | 'amber';
export type KeyboardLayout = 'qwerty' | 'azerty';

export interface KeyConfig {
  char: string;
  finger: Finger;
  row: number;
  width?: number;
  label?: string;
  subLabel?: string;
  tertLabel?: string;
}

export interface Level {
  id: number;
  title: string;
  description: string;
  newKeys: string[];
  allKeys: string[];
  textSamples: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  minWpm: number;
  minAccuracy: number;
}

export interface CustomLesson {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
}

export enum GameMode {
  Campaign = 'CAMPAIGN',
  Timed = 'TIMED',
  ErrorDrill = 'ERROR_DRILL',
  Story = 'STORY',
  Custom = 'CUSTOM',
  Dictation = 'DICTATION',
  Library = 'LIBRARY'
}

export interface ErrorStats {
  [targetChar: string]: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface DailyChallenge {
  date: string;
  description: string;
  targetType: 'stars' | 'wpm' | 'accuracy' | 'matches';
  targetValue: number;
  currentValue: number;
  completed: boolean;
  rewardXp: number;
}

export interface GhostRecord {
  wpm: number;
  accuracy: number;
  timestamp: string;
  events: number[];
}

export interface SessionResult {
  levelId: number;
  mode: GameMode;
  wpm: number;
  accuracy: number;
  consistency?: number;
  date: string;
  stars: 1 | 2 | 3;
  duration?: number;
  correctStats?: ErrorStats;
}

export interface UserProfile {
  id: string;
  name: string;
  currentLevelId: number;
  unlockedLevels: number[];
  history: SessionResult[];
  errorStats: ErrorStats;
  achievements: string[];
  xp: number;
  playerLevel: number;
  currentTitle: string;
  currentAvatar: string;
  dailyChallenge: DailyChallenge | null;
  theme: Theme;
  soundEnabled: boolean;
  layout: KeyboardLayout;
  kioskMode?: boolean;
  ghosts?: Record<string, GhostRecord>;
}

export interface AppState {
  users: Record<string, UserProfile>;
  activeUserId: string | null;
  customLessons: CustomLesson[];
}

export enum AppScreen {
  UserSelect = 'USER_SELECT',
  ParentDashboard = 'PARENT_DASHBOARD',
  Dashboard = 'DASHBOARD',
  Exercise = 'EXERCISE',
  Result = 'RESULT',
  Stats = 'STATS',
  Achievements = 'ACHIEVEMENTS',
  Library = 'LIBRARY'
}
