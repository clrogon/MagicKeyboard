
/**
 * Maps logical fingers to Tailwind CSS color classes.
 * Used for visual feedback in the Virtual Keyboard and Hands Display.
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

/**
 * Available color themes for the application.
 * - Rose: Default/Girl
 * - Blue: Boy
 * - Amber: Neutral
 */
export type Theme = 'rose' | 'blue' | 'amber';

/**
 * Configuration for a single key on the virtual keyboard.
 */
export interface KeyConfig {
  char: string;         // The character to display/match
  finger: Finger;       // Which finger should press this key
  row: number;          // Physical row index (0-3)
  width?: number;       // Relative width (e.g., 1.5 for Shift)
  label?: string;       // Optional label (e.g., "Shift" instead of "ShiftLeft")
  subLabel?: string;    // Label for the Shift-state (e.g. "!" for key "1")
}

/**
 * Defines the structure of a Campaign Level.
 */
export interface Level {
  id: number;
  title: string;
  description: string;
  newKeys: string[];    // Keys introduced in this specific level
  allKeys: string[];    // Accumulative list of keys available
  textSamples: string[]; // Fallback text if AI generation fails
  difficulty: 'easy' | 'medium' | 'hard';
  minWpm: number;       // Requirement for 3 stars
  minAccuracy: number;  // Requirement for 3 stars
}

/**
 * Game Modes available in the application.
 */
export enum GameMode {
  Campaign = 'CAMPAIGN',      // Progression-based levels
  Timed = 'TIMED',            // 60s speed challenge
  ErrorDrill = 'ERROR_DRILL', // AI-generated drill based on user weak keys
  Story = 'STORY'             // Coherent story generation for flow practice
}

/**
 * Tracks the number of errors per character.
 * Key: The character missed. Value: Number of times missed.
 */
export interface ErrorStats {
  [targetChar: string]: number;
}

/**
 * Achievement badge definition.
 */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Corresponds to Lucide React icon names
  color: string;
}

/**
 * Daily Challenge logic.
 * Reset daily based on local date.
 */
export interface DailyChallenge {
  date: string; // ISO Date YYYY-MM-DD
  description: string;
  targetType: 'stars' | 'wpm' | 'accuracy' | 'matches';
  targetValue: number;
  currentValue: number;
  completed: boolean;
  rewardXp: number;
}

/**
 * Result of a single typing session.
 */
export interface SessionResult {
  levelId: number;
  mode: GameMode;
  wpm: number;
  accuracy: number;
  consistency?: number;        // Rhythm score (0-100), based on variance of keystroke latency
  date: string;
  stars: 1 | 2 | 3;
  duration?: number;           // In seconds
  correctStats?: ErrorStats;   // Used to decay the global error stats
}

/**
 * Represents a single user profile.
 */
export interface UserProfile {
  id: string;
  name: string;
  currentLevelId: number;      // Highest level reached
  unlockedLevels: number[];    // Array of unlocked level IDs
  history: SessionResult[];    // History of all completed sessions
  errorStats: ErrorStats;      // Global error heatmap
  achievements: string[];      // IDs of unlocked achievements
  
  // Progression System
  xp: number;
  playerLevel: number;
  currentTitle: string;
  currentAvatar: string;
  dailyChallenge: DailyChallenge | null;
  theme: Theme;
  soundEnabled: boolean; // New Phase 8 Feature
}

/**
 * Global App State persisted in LocalStorage.
 * Now supports multiple users.
 */
export interface AppState {
  users: Record<string, UserProfile>; // Map of ID -> Profile
  activeUserId: string | null;        // Currently logged in user
}

/**
 * Enum for managing the active screen in the main App component.
 */
export enum AppScreen {
  UserSelect = 'USER_SELECT', // New Screen
  ParentDashboard = 'PARENT_DASHBOARD', // Phase 6.2: Parent Analytics
  Dashboard = 'DASHBOARD',
  Exercise = 'EXERCISE',
  Result = 'RESULT',
  Stats = 'STATS',
  Achievements = 'ACHIEVEMENTS'
}
