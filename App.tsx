
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState, AppScreen, Level, SessionResult, GameMode, ErrorStats, DailyChallenge } from './types';
import { LEVELS, SUCCESS_MESSAGES, ACHIEVEMENTS, getXpForNextLevel, PLAYER_TITLES, AVATARS } from './constants';
import LevelSelector from './components/LevelSelector';
import TypingArea from './components/TypingArea';
import StatsBoard from './components/StatsBoard';
import AchievementsScreen from './components/AchievementsScreen';
import PrivacyModal from './components/PrivacyModal';
import CookieBanner from './components/CookieBanner';
import HandGuideModal from './components/HandGuideModal';
import { ArrowRight, RotateCcw, AlertTriangle, Map, Zap, Heart, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      if (parsed.xp === undefined) parsed.xp = 0;
      if (parsed.playerLevel === undefined) parsed.playerLevel = 1;
      if (!parsed.currentTitle) parsed.currentTitle = PLAYER_TITLES[1];
      if (!parsed.currentAvatar) parsed.currentAvatar = AVATARS[0];
      return parsed;
    }
    return {
      currentLevelId: 1,
      unlockedLevels: [1],
      history: [],
      isPlaying: false,
      errorStats: {},
      achievements: [],
      xp: 0,
      playerLevel: 1,
      currentTitle: PLAYER_TITLES[1],
      currentAvatar: AVATARS[0],
      dailyChallenge: null
    };
  });

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.Dashboard);
  const [activeLevel, setActiveLevel] = useState<Level>(LEVELS[0]);
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.Campaign);
  const [difficultyModifier, setDifficultyModifier] = useState<'normal' | 'hard'>('normal');
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [justUnlockedAchievement, setJustUnlockedAchievement] = useState<string | null>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHandGuide, setShowHandGuide] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{old: number, new: number} | null>(null);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  // Daily Challenge Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setGameState(prev => {
        if (!prev.dailyChallenge || prev.dailyChallenge.date !== today) {
            // Generate a new challenge
            const types: ('stars' | 'wpm' | 'accuracy' | 'matches')[] = ['stars', 'wpm', 'accuracy', 'matches'];
            const type = types[Math.floor(Math.random() * types.length)];
            let target = 0;
            let desc = "";
            const reward = 150 + (prev.playerLevel * 10);

            if (type === 'stars') {
                target = 3;
                desc = "Consegue 3 Estrelas num nível hoje";
            } else if (type === 'wpm') {
                target = Math.min(60, 15 + (prev.playerLevel * 2)); // Dynamic difficulty
                desc = `Atinge ${target} Palavras por Minuto`;
            } else if (type === 'accuracy') {
                target = 100;
                desc = "Completa um exercício com 100% de Precisão";
            } else if (type === 'matches') {
                target = 3;
                desc = "Completa 3 exercícios hoje";
            }

            return {
                ...prev,
                dailyChallenge: {
                    date: today,
                    targetType: type,
                    targetValue: target,
                    currentValue: 0,
                    description: desc,
                    completed: false,
                    rewardXp: reward
                }
            };
        }
        return prev;
    });
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('keyboardHeroState', JSON.stringify(gameState));
  }, [gameState]);

  const handleClearData = () => {
    localStorage.removeItem('keyboardHeroState');
    localStorage.removeItem('cookieConsent');
    window.location.reload();
  };
  
  const handleChangeAvatar = () => {
      setGameState(prev => {
          const currentIndex = AVATARS.indexOf(prev.currentAvatar);
          const nextIndex = (currentIndex + 1) % AVATARS.length;
          return { ...prev, currentAvatar: AVATARS[nextIndex] };
      });
  };

  const handleStartLevel = (level: Level, modifier: 'normal' | 'hard' = 'normal') => {
    setActiveLevel(level);
    setActiveMode(GameMode.Campaign);
    setDifficultyModifier(modifier);
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
      setDifficultyModifier('normal');
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
      setDifficultyModifier('normal');
      setTimeLimit(undefined);
      setCurrentScreen(AppScreen.Exercise);
  }

  const checkStreak = (history: SessionResult[]) => {
      // Extract unique dates (YYYY-MM-DD)
      const dates = [...new Set(history.map(h => h.date.split('T')[0]))].sort();
      if (dates.length < 7) return false;
      
      // Check last 7 days from the most recent session backward
      let consecutive = 1;
      for (let i = dates.length - 1; i > 0; i--) {
          const d1 = new Date(dates[i]);
          const d2 = new Date(dates[i-1]);
          const diffTime = Math.abs(d1.getTime() - d2.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
          
          if (diffDays === 1) consecutive++;
          else break;
      }
      return consecutive >= 7;
  };

  const calculateSessionXp = (result: SessionResult): number => {
      let xp = 20; // Base XP for finishing
      xp += result.stars * 15; // Star bonus
      xp += Math.round(result.wpm); // Speed bonus
      if (result.accuracy === 100) xp += 20; // Perfection bonus
      if (result.mode === GameMode.ErrorDrill) xp += 10; // Extra effort for drilling
      return xp;
  };

  const handleLevelComplete = (result: SessionResult, sessionErrors: ErrorStats, sessionCorrects: ErrorStats) => {
    const isWin = result.stars > 1; 
    setJustUnlockedAchievement(null);
    setLevelUpData(null);

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
        const newErrorStats = { ...prev.errorStats };
        Object.entries(sessionErrors).forEach(([char, count]) => {
            newErrorStats[char] = (newErrorStats[char] || 0) + count;
        });
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
        checkForAchievement('wpm_30', result.wpm >= 30);
        checkForAchievement('symbol_expert', result.levelId === 7 && result.stars === 3);
        checkForAchievement('streak_7', checkStreak(newHistory));
        checkForAchievement('error_crusher', result.mode === GameMode.ErrorDrill && result.accuracy === 100 && result.levelId === -2);
        checkForAchievement('time_lord', result.mode === GameMode.Timed && (result.duration || 0) >= 1 && result.wpm >= 30);

        // --- PROGRESSION SYSTEM ---
        let sessionXp = calculateSessionXp(result);
        
        // Check Daily Challenge
        let daily = prev.dailyChallenge ? { ...prev.dailyChallenge } : null;
        let challengeBonus = 0;
        
        if (daily && !daily.completed) {
            let increment = 0;
            if (daily.targetType === 'matches') increment = 1;
            else if (daily.targetType === 'stars') increment = result.stars >= daily.targetValue ? 1 : 0; // Simple boolean check treated as 1 step
            else if (daily.targetType === 'wpm' && result.wpm >= daily.targetValue) increment = daily.targetValue; // Instant complete
            else if (daily.targetType === 'accuracy' && result.accuracy >= daily.targetValue) increment = daily.targetValue;

            // Update current Value
            if (daily.targetType === 'matches') daily.currentValue += increment;
            else if (daily.targetType === 'stars' && result.stars >= daily.targetValue) daily.currentValue = daily.targetValue;
            else if (daily.targetType === 'wpm' && result.wpm >= daily.targetValue) daily.currentValue = daily.targetValue;
            else if (daily.targetType === 'accuracy' && result.accuracy >= daily.targetValue) daily.currentValue = daily.targetValue;

            if (daily.currentValue >= daily.targetValue) {
                daily.completed = true;
                daily.currentValue = daily.targetValue;
                challengeBonus = daily.rewardXp;
                sessionXp += challengeBonus;
                // Double confetti for challenge complete
                 setTimeout(() => {
                     confetti({
                        particleCount: 100,
                        spread: 100,
                        origin: { y: 0.9 },
                        colors: ['#FFD700', '#FFA500']
                     });
                 }, 500);
            }
        }
        setEarnedXp(sessionXp);

        // Level Up Logic
        let currentXp = prev.xp + sessionXp;
        let currentLevel = prev.playerLevel;
        let nextLevelXp = getXpForNextLevel(currentLevel);
        let leveledUp = false;
        
        while (currentXp >= nextLevelXp) {
            currentXp -= nextLevelXp;
            currentLevel++;
            nextLevelXp = getXpForNextLevel(currentLevel);
            leveledUp = true;
        }
        
        let newTitle = prev.currentTitle;
        if (leveledUp) {
            // Find highest unlocked title
            const unlockedTitles = Object.keys(PLAYER_TITLES)
                .map(Number)
                .filter(lvl => lvl <= currentLevel)
                .sort((a,b) => b-a);
            
            if (unlockedTitles.length > 0) {
                newTitle = PLAYER_TITLES[unlockedTitles[0]];
            }
            setLevelUpData({ old: prev.playerLevel, new: currentLevel });
        }

        return {
            ...prev,
            history: newHistory,
            unlockedLevels: newUnlocked,
            errorStats: newErrorStats,
            achievements: newAchievements,
            xp: currentXp,
            playerLevel: currentLevel,
            currentTitle: newTitle,
            dailyChallenge: daily
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

    // Adaptive Logic
    const isCampaign = lastResult.mode === GameMode.Campaign;
    const nextLevelId = lastResult.levelId + 1;
    const hasNextLevel = LEVELS.some(l => l.id === nextLevelId);
    
    const isExcellent = lastResult.accuracy >= 90 && lastResult.stars === 3;
    const isStruggle = lastResult.accuracy < 85;

    return (
        <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
            >
                {/* Level Up Overlay */}
                {levelUpData && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-indigo-600/95 z-50 flex flex-col items-center justify-center text-white p-6"
                    >
                         <h2 className="text-4xl font-bold mb-4 animate-bounce">SUBISTE DE NÍVEL!</h2>
                         <div className="text-6xl font-black mb-4 bg-white text-indigo-600 w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-400">
                             {levelUpData.new}
                         </div>
                         <p className="text-lg opacity-80 mb-6">Parabéns! Estás cada vez melhor.</p>
                         <button 
                            onClick={() => setLevelUpData(null)}
                            className="bg-yellow-400 text-indigo-900 font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-yellow-300 transition"
                        >
                            Continuar
                        </button>
                    </motion.div>
                )}

                {unlockedBadge && (
                    <motion.div 
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        className="absolute top-0 left-0 w-full bg-yellow-400 py-2 text-white font-bold animate-pulse z-10"
                    >
                        🏆 Nova Conquista Desbloqueada!
                    </motion.div>
                )}

                <h2 className="text-3xl font-bold text-gray-800 mb-2 fun-font mt-6">{message}</h2>
                
                {lastResult.mode !== GameMode.Timed && (
                    <div className="flex justify-center gap-2 my-6">
                        {[1, 2, 3].map((star, i) => (
                            <motion.div 
                                key={star} 
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: star <= lastResult.stars ? 1 : 0.75, rotate: 0 }}
                                transition={{ delay: i * 0.2, type: "spring" }}
                                className={`${star <= lastResult.stars ? 'opacity-100' : 'opacity-20'}`}
                            >
                                <svg width="60" height="60" viewBox="0 0 24 24" fill={star <= lastResult.stars ? "#f59e0b" : "#ccc"} className="drop-shadow-sm">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                            </motion.div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-blue-50 p-4 rounded-xl"
                    >
                        <div className="text-sm text-gray-500 font-bold uppercase">Velocidade</div>
                        <div className="text-3xl font-bold text-blue-600">{lastResult.wpm} <span className="text-sm text-gray-400">PPM</span></div>
                    </motion.div>
                    <motion.div 
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-green-50 p-4 rounded-xl"
                    >
                        <div className="text-sm text-gray-500 font-bold uppercase">Precisão</div>
                        <div className="text-3xl font-bold text-green-600">{lastResult.accuracy}%</div>
                    </motion.div>
                </div>
                
                {/* XP Earned Indicator */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Zap size={16} className="fill-current" /> +{earnedXp} XP
                    </div>
                </div>

                {/* Adaptive Recommendation */}
                {lastResult.mode === GameMode.Campaign && (
                    <div className={`mb-6 p-4 rounded-xl border-2 text-sm text-left shadow-sm ${
                        isExcellent ? 'bg-green-50 border-green-200 text-green-900' :
                        isStruggle ? 'bg-red-50 border-red-200 text-red-900' :
                        'bg-blue-50 border-blue-200 text-blue-900'
                    }`}>
                        <div className="font-bold mb-1 flex items-center gap-2">
                            {isExcellent ? '🚀 Excelente!' : isStruggle ? '🛡️ Dica do Treinador' : '💡 Continua assim!'}
                        </div>
                        {isExcellent && hasNextLevel && "Estás a dominar! A tua precisão é fantástica. Segue para o próximo nível."}
                        {isExcellent && !hasNextLevel && "Incrível! Completaste todos os níveis disponíveis. Que tal um desafio mais difícil ou contra-relógio?"}
                        {isStruggle && "Parece que algumas teclas estão difíceis. Que tal fazeres um Treino de Erros ou repetires este nível mais devagar?"}
                        {!isExcellent && !isStruggle && "Bom trabalho. Tenta aumentar um pouco a precisão antes de avançar para o próximo desafio."}
                    </div>
                )}

                {unlockedBadge && (
                     <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl mb-8 flex items-center gap-4 border-2 border-yellow-300"
                    >
                        <div className="text-4xl">🏅</div>
                        <div className="text-left">
                            <div className="font-bold text-yellow-800">{unlockedBadge.title}</div>
                            <div className="text-xs text-yellow-600">{unlockedBadge.description}</div>
                        </div>
                     </motion.div>
                )}

                <div className="flex flex-col gap-3">
                    {/* Adaptive Actions */}
                    {isExcellent && hasNextLevel && lastResult.mode === GameMode.Campaign && (
                         <button 
                            onClick={() => {
                                const nextLevel = LEVELS.find(l => l.id === nextLevelId);
                                if (nextLevel) handleStartLevel(nextLevel);
                            }}
                            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 transition flex items-center justify-center gap-2 animate-pulse"
                        >
                            Próximo Nível <ArrowRight size={20} />
                        </button>
                    )}

                    {isExcellent && lastResult.mode === GameMode.Campaign && (
                        <button 
                            onClick={() => handleStartLevel(activeLevel, 'hard')}
                            className="w-full bg-orange-100 text-orange-700 font-bold py-3 rounded-xl border-2 border-orange-200 hover:bg-orange-200 transition flex items-center justify-center gap-2"
                        >
                             <Zap size={20} />
                             Desafio Extra (Mais Difícil) 🌶️
                        </button>
                    )}

                    {isStruggle && lastResult.mode === GameMode.Campaign && (
                        <button 
                            onClick={handleStartErrorMode}
                            className="w-full bg-red-100 text-red-600 font-bold py-3 rounded-xl border-2 border-red-200 hover:bg-red-200 transition flex items-center justify-center gap-2"
                        >
                            <AlertTriangle size={20} />
                            Fazer Treino de Erros
                        </button>
                    )}

                    <button 
                        onClick={() => {
                            if (activeMode === GameMode.Timed && timeLimit) handleStartTimedMode(timeLimit);
                            else if (activeMode === GameMode.ErrorDrill) handleStartErrorMode();
                            else handleStartLevel(activeLevel, 'normal');
                        }}
                        className={`w-full font-bold py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${
                            (isExcellent && hasNextLevel) ? 'bg-white text-gray-600 border-2 border-gray-100 hover:bg-gray-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        <RotateCcw size={20} />
                        {isExcellent && hasNextLevel ? 'Repetir este Nível' : 'Tentar Novamente'}
                    </button>
                    
                    <button 
                         onClick={() => setCurrentScreen(AppScreen.Dashboard)}
                         className="w-full bg-transparent text-gray-500 font-bold py-3 rounded-xl hover:text-gray-700 transition flex items-center justify-center gap-2"
                    >
                        <Map size={20} />
                        Voltar ao Mapa
                    </button>
                </div>
            </motion.div>
        </div>
    );
  };

  return (
    <div className="font-sans text-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        {currentScreen === AppScreen.Dashboard && (
          <LevelSelector 
              levels={LEVELS} 
              unlockedLevels={gameState.unlockedLevels}
              gameState={gameState}
              onSelectLevel={(l) => handleStartLevel(l)}
              onSelectTimedMode={handleStartTimedMode}
              onSelectErrorMode={handleStartErrorMode}
              onViewStats={() => setCurrentScreen(AppScreen.Stats)} 
              onChangeAvatar={handleChangeAvatar}
              onShowHandGuide={() => setShowHandGuide(true)}
          />
        )}
        
        {currentScreen === AppScreen.Exercise && (
          <TypingArea 
              level={activeLevel}
              mode={activeMode}
              errorStats={gameState.errorStats}
              timeLimit={timeLimit}
              difficultyModifier={difficultyModifier}
              onComplete={handleLevelComplete}
              onExit={() => setCurrentScreen(AppScreen.Dashboard)}
          />
        )}

        {currentScreen === AppScreen.Result && lastResult && (
            renderResultScreen()
        )}

        {currentScreen === AppScreen.Stats && (
            <StatsBoard 
              history={gameState.history} 
              unlockedLevels={gameState.unlockedLevels}
              levels={LEVELS}
              achievements={gameState.achievements}
              onBack={() => setCurrentScreen(AppScreen.Dashboard)}
              onViewAchievements={() => setCurrentScreen(AppScreen.Achievements)}
            />
        )}

        {currentScreen === AppScreen.Achievements && (
            <AchievementsScreen
              unlockedIds={gameState.achievements}
              onBack={() => setCurrentScreen(AppScreen.Stats)}
            />
        )}
      </div>

      <footer className="py-6 text-center text-slate-500 text-sm bg-white/40 backdrop-blur-md border-t border-white/30 mt-auto relative z-10">
         <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 px-4">
            <span>&copy; {new Date().getFullYear()} <strong>Teclado Mágico</strong></span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="flex items-center gap-1">
                Criado por <strong>Cláudio Gonçalves</strong>
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <span className="flex items-center gap-1 text-xs uppercase tracking-wide opacity-80">
                <Zap size={12} className="text-yellow-500 fill-yellow-500" /> Powered by Gemini
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <button 
                onClick={() => setShowPrivacyModal(true)}
                className="flex items-center gap-1 hover:text-indigo-600 transition font-semibold"
            >
                <Shield size={12} /> Privacidade
            </button>
         </div>
      </footer>

      {/* GDPR & Security Components */}
      <CookieBanner onOpenPolicy={() => setShowPrivacyModal(true)} />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        onClearData={handleClearData}
      />
      <HandGuideModal
        isOpen={showHandGuide}
        onClose={() => setShowHandGuide(false)}
      />
    </div>
  );
};

export default App;
