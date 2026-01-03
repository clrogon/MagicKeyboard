import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState, AppScreen, Level, SessionResult, GameMode, ErrorStats } from './types';
import { LEVELS, SUCCESS_MESSAGES, ACHIEVEMENTS } from './constants';
import LevelSelector from './components/LevelSelector';
import TypingArea from './components/TypingArea';
import StatsBoard from './components/StatsBoard';

// Utility for simple sound
const playSound = (type: 'win' | 'click') => {
   // Placeholder for sound effects
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('keyboardHeroState');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure new fields exist if loading from old state
      if (!parsed.achievements) parsed.achievements = [];
      return parsed;
    }
    return {
      currentLevelId: 1,
      unlockedLevels: [1],
      history: [],
      isPlaying: false,
      errorStats: {},
      achievements: []
    };
  });

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Dashboard);
  const [activeLevel, setActiveLevel] = useState<Level>(LEVELS[0]);
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.Campaign);
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [justUnlockedAchievement, setJustUnlockedAchievement] = useState<string | null>(null);

  // Persist state
  useEffect(() => {
    localStorage.setItem('keyboardHeroState', JSON.stringify(gameState));
  }, [gameState]);

  const handleStartLevel = (level: Level) => {
    setActiveLevel(level);
    setActiveMode(GameMode.Campaign);
    setTimeLimit(undefined);
    setCurrentScreen(AppScreen.Exercise);
    playSound('click');
  };

  const handleStartTimedMode = (duration: number) => {
      // Create a pseudo-level for timed mode that includes all unlocked keys
      const maxUnlocked = Math.max(...gameState.unlockedLevels);
      const unlockedKeys = LEVELS.filter(l => l.id <= maxUnlocked).flatMap(l => l.newKeys);
      const uniqueKeys = Array.from(new Set(unlockedKeys));
      
      const timedLevel: Level = {
          id: -1,
          title: "Desafio de Tempo",
          description: "Corra!",
          newKeys: [],
          allKeys: uniqueKeys,
          textSamples: [],
          difficulty: 'medium',
          minWpm: 0,
          minAccuracy: 0
      };
      
      setActiveLevel(timedLevel);
      setActiveMode(GameMode.Timed);
      setTimeLimit(duration);
      setCurrentScreen(AppScreen.Exercise);
  };

  const handleStartErrorMode = () => {
      // Similar to timed, but we pass error mode
      const maxUnlocked = Math.max(...gameState.unlockedLevels);
      const unlockedKeys = LEVELS.filter(l => l.id <= maxUnlocked).flatMap(l => l.newKeys);
      const uniqueKeys = Array.from(new Set(unlockedKeys));

      const errorLevel: Level = {
          id: -2,
          title: "Treino de Erros",
          description: "Foco!",
          newKeys: [],
          allKeys: uniqueKeys,
          textSamples: [],
          difficulty: 'hard',
          minWpm: 0,
          minAccuracy: 0
      };

      setActiveLevel(errorLevel);
      setActiveMode(GameMode.ErrorDrill);
      setTimeLimit(undefined);
      setCurrentScreen(AppScreen.Exercise);
  }

  const handleLevelComplete = (result: SessionResult, sessionErrors: ErrorStats, sessionCorrects: ErrorStats) => {
    const isWin = result.stars > 1; 
    setJustUnlockedAchievement(null);

    // Confetti
    if (isWin || result.mode === GameMode.Timed) {
       confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
       });
    }

    setLastResult(result);
    
    // Update State
    setGameState(prev => {
        const newHistory = [...prev.history, result];
        let newUnlocked = [...prev.unlockedLevels];
        let newAchievements = [...prev.achievements];
        
        // Unlock logic only for Campaign
        if (result.mode === GameMode.Campaign && isWin && result.levelId === Math.max(...prev.unlockedLevels)) {
            const nextLevelId = result.levelId + 1;
            if (LEVELS.find(l => l.id === nextLevelId) && !newUnlocked.includes(nextLevelId)) {
                newUnlocked.push(nextLevelId);
            }
        }

        // --- ERROR DECAY SYSTEM ---
        // 1. Merge new errors
        const newErrorStats = { ...prev.errorStats };
        Object.entries(sessionErrors).forEach(([char, count]) => {
            newErrorStats[char] = (newErrorStats[char] || 0) + count;
        });
        
        // 2. Apply decay based on correct presses
        // Rule: Every 3 correct presses reduce 1 historical error
        const DECAY_RATE = 0.33; 
        Object.entries(sessionCorrects).forEach(([char, count]) => {
            if (newErrorStats[char] && newErrorStats[char] > 0) {
                 const reduction = Math.floor(count * DECAY_RATE);
                 newErrorStats[char] = Math.max(0, newErrorStats[char] - reduction);
            }
        });

        // --- ACHIEVEMENT SYSTEM ---
        const checkForAchievement = (id: string, condition: boolean) => {
            if (condition && !newAchievements.includes(id)) {
                newAchievements.push(id);
                setJustUnlockedAchievement(id);
            }
        };

        checkForAchievement('first_3_stars', result.stars === 3);
        checkForAchievement('speed_demon', result.wpm >= 50);
        checkForAchievement('accuracy_master', result.accuracy === 100 && result.levelId > 0);
        checkForAchievement('session_streak', newHistory.length >= 10);
        checkForAchievement('home_row_master', result.levelId === 3 && result.stars === 3);

        return {
            ...prev,
            history: newHistory,
            unlockedLevels: newUnlocked,
            errorStats: newErrorStats,
            achievements: newAchievements
        };
    });

    setCurrentScreen(AppScreen.Result);
  };

  const renderResultScreen = () => {
    if (!lastResult) return null;
    
    let message = "";
    if (lastResult.mode === GameMode.Timed) {
        message = `Escreveste ${Math.round(lastResult.wpm * (lastResult.duration || 1))} palavras!`;
    } else {
        message = lastResult.stars === 3 
            ? SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
            : lastResult.stars === 2 
                ? "Muito bem! Quase lá!" 
                : "Vamos tentar outra vez!";
    }

    const unlockedBadge = justUnlockedAchievement 
        ? ACHIEVEMENTS.find(a => a.id === justUnlockedAchievement) 
        : null;

    return (
        <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-bounce-in relative overflow-hidden">
                
                {unlockedBadge && (
                    <div className="absolute top-0 left-0 w-full bg-yellow-400 py-2 text-white font-bold animate-pulse">
                        🏆 Nova Conquista Desbloqueada!
                    </div>
                )}

                <h2 className="text-3xl font-bold text-gray-800 mb-2 fun-font mt-6">{message}</h2>
                
                {lastResult.mode !== GameMode.Timed && (
                    <div className="flex justify-center gap-2 my-6">
                        {[1, 2, 3].map(star => (
                            <div key={star} className={`transform transition-all duration-500 ${star <= lastResult.stars ? 'scale-100' : 'scale-75 opacity-20'}`}>
                                <svg width="60" height="60" viewBox="0 0 24 24" fill={star <= lastResult.stars ? "#f59e0b" : "#ccc"} className="drop-shadow-sm">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-500 font-bold uppercase">Velocidade</div>
                        <div className="text-3xl font-bold text-blue-600">{lastResult.wpm} <span className="text-sm text-gray-400">PPM</span></div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-sm text-gray-500 font-bold uppercase">Precisão</div>
                        <div className="text-3xl font-bold text-green-600">{lastResult.accuracy}%</div>
                    </div>
                </div>

                {unlockedBadge && (
                     <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mb-8 flex items-center gap-4 border-2 border-yellow-300">
                        <div className="text-4xl">🏅</div>
                        <div className="text-left">
                            <div className="font-bold text-yellow-800">{unlockedBadge.title}</div>
                            <div className="text-xs text-yellow-600">{unlockedBadge.description}</div>
                        </div>
                     </div>
                )}

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={() => {
                            if (activeMode === GameMode.Timed && timeLimit) handleStartTimedMode(timeLimit);
                            else if (activeMode === GameMode.ErrorDrill) handleStartErrorMode();
                            else handleStartLevel(activeLevel);
                        }}
                        className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition"
                    >
                        Tentar Novamente
                    </button>
                    <button 
                         onClick={() => setCurrentScreen(AppScreen.Dashboard)}
                         className="w-full bg-white text-gray-500 font-bold py-3 rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition"
                    >
                        Voltar ao Mapa
                    </button>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="font-sans text-gray-900">
      {currentScreen === AppScreen.Dashboard && (
        <LevelSelector 
            levels={LEVELS} 
            unlockedLevels={gameState.unlockedLevels}
            onSelectLevel={handleStartLevel}
            onSelectTimedMode={handleStartTimedMode}
            onSelectErrorMode={handleStartErrorMode}
            onViewStats={() => setCurrentScreen(AppScreen.Result)} // Redirect to stats board (fallback)
        />
      )}
      
      {currentScreen === AppScreen.Exercise && (
        <TypingArea 
            level={activeLevel}
            mode={activeMode}
            errorStats={gameState.errorStats}
            timeLimit={timeLimit}
            onComplete={handleLevelComplete}
            onExit={() => setCurrentScreen(AppScreen.Dashboard)}
        />
      )}

      {currentScreen === AppScreen.Result && lastResult && (
          renderResultScreen()
      )}

      {/* Override for Stats View if triggered from dashboard but no result */}
      {currentScreen === AppScreen.Result && !lastResult && (
          <StatsBoard 
            history={gameState.history} 
            unlockedLevels={gameState.unlockedLevels}
            levels={LEVELS}
            achievements={gameState.achievements}
            onBack={() => setCurrentScreen(AppScreen.Dashboard)}
          />
      )}
    </div>
  );
};

export default App;