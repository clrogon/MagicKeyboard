
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { GameState, AppScreen, Level, SessionResult, GameMode, ErrorStats, DailyChallenge, Theme } from './types';
import { LEVELS, SUCCESS_MESSAGES, ACHIEVEMENTS, getXpForNextLevel, PLAYER_TITLES, AVATARS, THEME_COLORS } from './constants';
import LevelSelector from './components/LevelSelector';
import TypingArea from './components/TypingArea';
import StatsBoard from './components/StatsBoard';
import AchievementsScreen from './components/AchievementsScreen';
import PrivacyModal from './components/PrivacyModal';
import CookieBanner from './components/CookieBanner';
import HandGuideModal from './components/HandGuideModal';
import { ClayButton } from './components/ClayButton';
import { Shield, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('keyboardHeroState');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.achievements) parsed.achievements = [];
      if (parsed.xp === undefined) parsed.xp = 0;
      if (parsed.playerLevel === undefined) parsed.playerLevel = 1;
      if (!parsed.currentTitle) parsed.currentTitle = PLAYER_TITLES[1];
      if (!parsed.currentAvatar) parsed.currentAvatar = AVATARS[0];
      if (!parsed.theme) parsed.theme = 'rose';
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
      dailyChallenge: null,
      theme: 'rose'
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

  const colors = THEME_COLORS[gameState.theme];

  // Daily Challenge Logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setGameState(prev => {
        if (!prev.dailyChallenge || prev.dailyChallenge.date !== today) {
            const types: ('stars' | 'wpm' | 'accuracy' | 'matches')[] = ['stars', 'wpm', 'accuracy', 'matches'];
            const type = types[Math.floor(Math.random() * types.length)];
            let target = 0;
            let desc = "";
            const reward = 150 + (prev.playerLevel * 10);

            if (type === 'stars') {
                target = 3;
                desc = "Consegue 3 Estrelas num nível hoje";
            } else if (type === 'wpm') {
                target = Math.min(60, 15 + (prev.playerLevel * 2)); 
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

  const handleSetTheme = (theme: Theme) => {
      setGameState(prev => ({ ...prev, theme }));
  };

  const handleStartLevel = (level: Level, modifier: 'normal' | 'hard' = 'normal') => {
    setActiveLevel(level);
    setActiveMode(GameMode.Campaign);
    setDifficultyModifier(modifier);
    setTimeLimit(undefined);
    setCurrentScreen(AppScreen.Exercise);
  };

  const handleStartTimedMode = (duration: number) => {
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
      const dates = [...new Set(history.map(h => h.date.split('T')[0]))].sort();
      if (dates.length < 7) return false;
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
      let xp = 20; 
      xp += result.stars * 15;
      xp += Math.round(result.wpm);
      if (result.accuracy === 100) xp += 20;
      if (result.mode === GameMode.ErrorDrill) xp += 10;
      return xp;
  };

  const handleLevelComplete = (result: SessionResult, sessionErrors: ErrorStats, sessionCorrects: ErrorStats) => {
    const isWin = result.stars > 1; 
    setJustUnlockedAchievement(null);
    setLevelUpData(null);

    if (isWin || result.mode === GameMode.Timed) {
       const confettiColors = gameState.theme === 'rose' 
         ? ['#F43F5E', '#FB7185', '#FDA4AF', '#FFF1F2'] 
         : gameState.theme === 'blue'
            ? ['#3B82F6', '#60A5FA', '#93C5FD', '#EFF6FF']
            : ['#F59E0B', '#FBBF24', '#FCD34D', '#FFFBEB'];

       confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: confettiColors
       });
    }

    setLastResult(result);
    
    setGameState(prev => {
        const newHistory = [...prev.history, result];
        let newUnlocked = [...prev.unlockedLevels];
        let newAchievements = [...prev.achievements];
        
        if (result.mode === GameMode.Campaign && isWin && result.levelId === Math.max(...prev.unlockedLevels)) {
            const nextLevelId = result.levelId + 1;
            if (LEVELS.find(l => l.id === nextLevelId) && !newUnlocked.includes(nextLevelId)) {
                newUnlocked.push(nextLevelId);
            }
        }

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

        let sessionXp = calculateSessionXp(result);
        
        let daily = prev.dailyChallenge ? { ...prev.dailyChallenge } : null;
        if (daily && !daily.completed) {
            let increment = 0;
            if (daily.targetType === 'matches') increment = 1;
            else if (daily.targetType === 'stars') increment = result.stars >= daily.targetValue ? 1 : 0;
            else if (daily.targetType === 'wpm' && result.wpm >= daily.targetValue) increment = daily.targetValue;
            else if (daily.targetType === 'accuracy' && result.accuracy >= daily.targetValue) increment = daily.targetValue;

            if (daily.targetType === 'matches') daily.currentValue += increment;
            else if (daily.targetType === 'stars' && result.stars >= daily.targetValue) daily.currentValue = daily.targetValue;
            else if (daily.targetType === 'wpm' && result.wpm >= daily.targetValue) daily.currentValue = daily.targetValue;
            else if (daily.targetType === 'accuracy' && result.accuracy >= daily.targetValue) daily.currentValue = daily.targetValue;

            if (daily.currentValue >= daily.targetValue) {
                daily.completed = true;
                daily.currentValue = daily.targetValue;
                sessionXp += daily.rewardXp;
            }
        }
        setEarnedXp(sessionXp);

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
        message = lastResult.stars === 3 ? SUCCESS_MESSAGES[0] : lastResult.stars === 2 ? "Muito bem!" : "Tenta de novo!";
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden border-4 border-white"
            >
                {/* Level Up Overlay */}
                {levelUpData && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute inset-0 ${colors.bg} z-50 flex flex-col items-center justify-center text-white p-6`}
                    >
                         <h2 className="text-4xl font-bold mb-4 font-fredoka">NÍVEL {levelUpData.new}!</h2>
                         <ClayButton onClick={() => setLevelUpData(null)} variant="secondary" theme={gameState.theme}>Continuar</ClayButton>
                    </motion.div>
                )}

                <h2 className="text-3xl font-bold text-slate-800 mb-2 fun-font">{message}</h2>
                <div className="flex justify-center gap-2 my-6">
                    {[1, 2, 3].map((star) => (
                        <Star key={star} size={48} fill={star <= lastResult.stars ? "#FBBF24" : "#E2E8F0"} className={star <= lastResult.stars ? "text-yellow-400" : "text-slate-200"} />
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-blue-400 uppercase">Velocidade</div>
                        <div className="text-3xl font-bold text-blue-600">{lastResult.wpm}</div>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-2xl">
                        <div className="text-xs font-bold text-emerald-400 uppercase">Precisão</div>
                        <div className="text-3xl font-bold text-emerald-600">{lastResult.accuracy}%</div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-3">
                    <ClayButton variant="primary" theme={gameState.theme} onClick={() => setCurrentScreen(AppScreen.Dashboard)}>
                        Continuar
                    </ClayButton>
                    <ClayButton variant="secondary" onClick={() => handleStartLevel(activeLevel)}>
                        Tentar de Novo
                    </ClayButton>
                </div>
            </motion.div>
        </div>
    );
  };

  const BlobColor1 = gameState.theme === 'rose' ? 'bg-purple-200' : gameState.theme === 'blue' ? 'bg-blue-200' : 'bg-yellow-200';
  const BlobColor2 = gameState.theme === 'rose' ? 'bg-yellow-100' : gameState.theme === 'blue' ? 'bg-cyan-100' : 'bg-orange-100';
  const BlobColor3 = gameState.theme === 'rose' ? 'bg-pink-100' : gameState.theme === 'blue' ? 'bg-indigo-100' : 'bg-amber-100';

  return (
    <div className="font-sans text-slate-800 min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      
      {/* Lava Lamp Blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] ${BlobColor1} rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob transition-colors duration-1000`}></div>
          <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] ${BlobColor2} rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000 transition-colors duration-1000`}></div>
          <div className={`absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] ${BlobColor3} rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000 transition-colors duration-1000`}></div>
      </div>

      <div className="flex-grow relative z-10">
        <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
             <div className="flex items-center gap-2">
                 <div className={`${colors.bg} text-white p-2 rounded-xl shadow-lg ${colors.shadow} transition-colors duration-300`}>
                    <Zap size={24} fill="currentColor" />
                 </div>
                 <h1 className="text-2xl font-bold text-slate-700 fun-font hidden md:block">Teclado Mágico</h1>
             </div>
             
             <div className="flex items-center gap-4">
                 {/* Theme Selector */}
                 <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full flex items-center gap-1 shadow-sm border border-white">
                     <button onClick={() => handleSetTheme('rose')} className={`w-6 h-6 rounded-full bg-rose-400 border-2 transition-transform ${gameState.theme === 'rose' ? 'border-rose-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Rosa" />
                     <button onClick={() => handleSetTheme('blue')} className={`w-6 h-6 rounded-full bg-blue-400 border-2 transition-transform ${gameState.theme === 'blue' ? 'border-blue-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Azul" />
                     <button onClick={() => handleSetTheme('amber')} className={`w-6 h-6 rounded-full bg-amber-400 border-2 transition-transform ${gameState.theme === 'amber' ? 'border-amber-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Amarelo" />
                 </div>

                 <button onClick={() => setShowPrivacyModal(true)} className="text-slate-400 hover:text-slate-600 transition">
                     <Shield size={20} />
                 </button>
             </div>
        </header>

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
              theme={gameState.theme}
              errorStats={gameState.errorStats}
              timeLimit={timeLimit}
              difficultyModifier={difficultyModifier}
              onComplete={handleLevelComplete}
              onExit={() => setCurrentScreen(AppScreen.Dashboard)}
          />
        )}

        {currentScreen === AppScreen.Result && lastResult && renderResultScreen()}

        {currentScreen === AppScreen.Stats && (
            <StatsBoard 
              history={gameState.history} 
              unlockedLevels={gameState.unlockedLevels}
              levels={LEVELS}
              achievements={gameState.achievements}
              theme={gameState.theme}
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

      <CookieBanner onOpenPolicy={() => setShowPrivacyModal(true)} theme={gameState.theme} />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        onClearData={handleClearData}
        theme={gameState.theme}
      />
      <HandGuideModal
        isOpen={showHandGuide}
        onClose={() => setShowHandGuide(false)}
        theme={gameState.theme}
      />
    </div>
  );
};

export default App;
