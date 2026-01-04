
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AppState, UserProfile, AppScreen, Level, SessionResult, GameMode, ErrorStats, DailyChallenge, Theme } from './types';
import { LEVELS, SUCCESS_MESSAGES, PLAYER_TITLES, AVATARS, THEME_COLORS, getXpForNextLevel } from './constants';
import LevelSelector from './components/LevelSelector';
import TypingArea from './components/TypingArea';
import StatsBoard from './components/StatsBoard';
import AchievementsScreen from './components/AchievementsScreen';
import UserSelectScreen from './components/UserSelectScreen';
import ParentDashboard from './components/ParentDashboard';
import PrivacyModal from './components/PrivacyModal';
import CookieBanner from './components/CookieBanner';
import HandGuideModal from './components/HandGuideModal';
import { ClayButton } from './components/ClayButton';
import { Shield, Zap, Star, LogOut, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * App Component
 * 
 * The root component of the application.
 * Manages global Game State, Routing (simple state-based navigation), and High-level Logic.
 */
const App: React.FC = () => {
  // Initialize State from LocalStorage or Default
  const [appState, setAppState] = useState<AppState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('keyboardHeroState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migration: If old save format (no 'users' key), migrate to new format
        if (!parsed.users) {
            const legacyUser: UserProfile = {
                id: 'legacy',
                name: 'Jogador',
                ...parsed, // Spread existing fields
                // Ensure new fields exist
                achievements: parsed.achievements || [],
                xp: parsed.xp || 0,
                playerLevel: parsed.playerLevel || 1,
                currentTitle: parsed.currentTitle || PLAYER_TITLES[1],
                currentAvatar: parsed.currentAvatar || AVATARS[0],
                theme: parsed.theme || 'rose',
                unlockedLevels: parsed.unlockedLevels || [1],
                history: parsed.history || [],
                errorStats: parsed.errorStats || {}
            };
            return {
                users: { 'legacy': legacyUser },
                activeUserId: null // Force selection screen
            };
        }
        return parsed;
      } catch (e) {
          console.error("Save migration failed", e);
      }
    }
    // Default Empty State
    return {
      users: {},
      activeUserId: null
    };
  });

  // Derived State: Current User
  const currentUser = appState.activeUserId ? appState.users[appState.activeUserId] : null;

  // UI State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.UserSelect);
  const [activeLevel, setActiveLevel] = useState<Level>(LEVELS[0]);
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.Campaign);
  
  // Game Configuration State
  const [difficultyModifier, setDifficultyModifier] = useState<'normal' | 'hard'>('normal');
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [blindMode, setBlindMode] = useState<boolean>(false); 
  
  // Session Result State
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [justUnlockedAchievement, setJustUnlockedAchievement] = useState<string | null>(null);
  const [levelUpData, setLevelUpData] = useState<{old: number, new: number} | null>(null);
  const [earnedXp, setEarnedXp] = useState<number>(0);

  // Modals State
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHandGuide, setShowHandGuide] = useState(false);

  // Determine current theme colors
  const colors = currentUser ? THEME_COLORS[currentUser.theme] : THEME_COLORS['rose'];

  // Effect: Persist state to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('keyboardHeroState', JSON.stringify(appState));
  }, [appState]);

  // Effect: Generate Daily Challenge for Active User
  useEffect(() => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    if (!currentUser.dailyChallenge || currentUser.dailyChallenge.date !== today) {
        // ... (Same Daily Challenge Logic as before, just updating specific user)
        const types: ('stars' | 'wpm' | 'accuracy' | 'matches')[] = ['stars', 'wpm', 'accuracy', 'matches'];
        const type = types[Math.floor(Math.random() * types.length)];
        let target = 0;
        let desc = "";
        const reward = 150 + (currentUser.playerLevel * 10); 

        if (type === 'stars') { target = 3; desc = "Consegue 3 Estrelas num nível hoje"; }
        else if (type === 'wpm') { target = Math.min(60, 15 + (currentUser.playerLevel * 2)); desc = `Atinge ${target} Palavras por Minuto`; }
        else if (type === 'accuracy') { target = 100; desc = "Completa um exercício com 100% de Precisão"; }
        else if (type === 'matches') { target = 3; desc = "Completa 3 exercícios hoje"; }

        updateUser(currentUser.id, {
            dailyChallenge: {
                date: today,
                targetType: type,
                targetValue: target,
                currentValue: 0,
                description: desc,
                completed: false,
                rewardXp: reward
            }
        });
    }
  }, [appState.activeUserId]); // Run when user switches

  // Helper to update specific user data
  const updateUser = (userId: string, updates: Partial<UserProfile>) => {
      setAppState(prev => ({
          ...prev,
          users: {
              ...prev.users,
              [userId]: { ...prev.users[userId], ...updates }
          }
      }));
  };

  // --- USER MANAGEMENT HANDLERS ---

  const handleCreateUser = (name: string, avatar: string, theme: Theme) => {
      const newUser: UserProfile = {
          id: Date.now().toString(),
          name,
          currentAvatar: avatar,
          theme,
          xp: 0,
          playerLevel: 1,
          currentTitle: PLAYER_TITLES[1],
          currentLevelId: 1,
          unlockedLevels: [1],
          history: [],
          errorStats: {},
          achievements: [],
          dailyChallenge: null
      };
      
      setAppState(prev => ({
          ...prev,
          users: { ...prev.users, [newUser.id]: newUser },
          activeUserId: newUser.id
      }));
      setCurrentScreen(AppScreen.Dashboard);
  };

  const handleSelectUser = (userId: string) => {
      setAppState(prev => ({ ...prev, activeUserId: userId }));
      setCurrentScreen(AppScreen.Dashboard);
  };

  const handleOpenParentDashboard = () => {
    // Simple "Parent Gate" - Math Challenge
    const num1 = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const num2 = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const answer = prompt(`Controlo Parental:\nQuanto é ${num1} + ${num2}?`);
    
    if (answer && parseInt(answer) === num1 + num2) {
        setCurrentScreen(AppScreen.ParentDashboard);
    } else {
        alert("Resposta incorreta.");
    }
  };

  const handleDeleteUser = (userId: string) => {
      if (!window.confirm("ATENÇÃO: Tens a certeza que queres apagar este perfil? Esta ação não pode ser desfeita.")) return;
      setAppState(prev => {
          const newUsers = { ...prev.users };
          delete newUsers[userId];
          return {
              ...prev,
              users: newUsers,
              activeUserId: prev.activeUserId === userId ? null : prev.activeUserId
          };
      });
  };

  const handleLogout = () => {
      setAppState(prev => ({ ...prev, activeUserId: null }));
      setCurrentScreen(AppScreen.UserSelect);
  };

  const handleClearData = () => {
    localStorage.removeItem('keyboardHeroState');
    localStorage.removeItem('cookieConsent');
    window.location.reload();
  };
  
  const handleChangeAvatar = () => {
      if (!currentUser) return;
      const currentIndex = AVATARS.indexOf(currentUser.currentAvatar);
      const nextIndex = (currentIndex + 1) % AVATARS.length;
      updateUser(currentUser.id, { currentAvatar: AVATARS[nextIndex] });
  };

  const handleSetTheme = (theme: Theme) => {
      if (!currentUser) return;
      updateUser(currentUser.id, { theme });
  };

  // --- GAME START HANDLERS ---

  const handleStartLevel = (level: Level, modifier: 'normal' | 'hard' = 'normal') => {
    setActiveLevel(level);
    setActiveMode(GameMode.Campaign);
    setDifficultyModifier(modifier);
    setTimeLimit(undefined);
    setCurrentScreen(AppScreen.Exercise);
  };

  const handleStartTimedMode = (duration: number) => {
      if (!currentUser) return;
      const maxUnlocked = Math.max(...currentUser.unlockedLevels);
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
      if (!currentUser) return;
      const maxUnlocked = Math.max(...currentUser.unlockedLevels);
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
  };

  const handleStartStoryMode = () => {
      if (!currentUser) return;
      const maxUnlocked = Math.max(...currentUser.unlockedLevels);
      const unlockedKeys = LEVELS.filter(l => l.id <= maxUnlocked).flatMap(l => l.newKeys);
      const uniqueKeys = Array.from(new Set(unlockedKeys));

      const storyLevel: Level = {
          id: -3,
          title: "Modo História",
          description: "Era uma vez...",
          newKeys: [],
          allKeys: uniqueKeys,
          textSamples: [],
          difficulty: 'hard',
          minWpm: 0,
          minAccuracy: 0
      };
      setActiveLevel(storyLevel);
      setActiveMode(GameMode.Story);
      setDifficultyModifier('normal');
      setTimeLimit(undefined);
      setCurrentScreen(AppScreen.Exercise);
  };

  // --- GAME COMPLETION LOGIC ---

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
      let xp = 20; // Base XP
      xp += result.stars * 15;
      xp += Math.round(result.wpm);
      if (result.accuracy === 100) xp += 20;
      if (result.mode === GameMode.ErrorDrill) xp += 10;
      if (result.mode === GameMode.Story) xp += 15;
      return xp;
  };

  const handleLevelComplete = (result: SessionResult, sessionErrors: ErrorStats, sessionCorrects: ErrorStats) => {
    if (!currentUser) return;
    
    // Win Condition: Now >= 1 star (Level Completion) is enough to progress
    const isWin = result.stars >= 1; 
    setJustUnlockedAchievement(null);
    setLevelUpData(null);

    // Trigger Confetti on Win
    if (isWin || result.mode === GameMode.Timed || result.mode === GameMode.Story) {
       const confettiColors = currentUser.theme === 'rose' 
         ? ['#F43F5E', '#FB7185', '#FDA4AF', '#FFF1F2'] 
         : currentUser.theme === 'blue'
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
    
    // Calculate New State
    const newHistory = [...currentUser.history, result];
    let newUnlocked = [...currentUser.unlockedLevels];
    let newAchievements = [...currentUser.achievements];
    
    // Unlock next level logic
    if (result.mode === GameMode.Campaign && isWin && result.levelId === Math.max(...currentUser.unlockedLevels)) {
        const nextLevelId = result.levelId + 1;
        if (LEVELS.find(l => l.id === nextLevelId) && !newUnlocked.includes(nextLevelId)) {
            newUnlocked.push(nextLevelId);
        }
    }

    // Update Global Error Stats
    const newErrorStats = { ...currentUser.errorStats };
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

    // Check Achievements
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

    // XP & Leveling Logic
    let sessionXp = calculateSessionXp(result);
    
    // Daily Challenge Progress
    let daily = currentUser.dailyChallenge ? { ...currentUser.dailyChallenge } : null;
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

    let currentXp = currentUser.xp + sessionXp;
    let currentLevel = currentUser.playerLevel;
    let nextLevelXp = getXpForNextLevel(currentLevel);
    let leveledUp = false;
    
    while (currentXp >= nextLevelXp) {
        currentXp -= nextLevelXp;
        currentLevel++;
        nextLevelXp = getXpForNextLevel(currentLevel);
        leveledUp = true;
    }
    
    let newTitle = currentUser.currentTitle;
    if (leveledUp) {
        const unlockedTitles = Object.keys(PLAYER_TITLES)
            .map(Number)
            .filter(lvl => lvl <= currentLevel)
            .sort((a,b) => b-a);
        
        if (unlockedTitles.length > 0) {
            newTitle = PLAYER_TITLES[unlockedTitles[0]];
        }
        setLevelUpData({ old: currentUser.playerLevel, new: currentLevel });
    }

    // UPDATE STATE
    updateUser(currentUser.id, {
        history: newHistory,
        unlockedLevels: newUnlocked,
        errorStats: newErrorStats,
        achievements: newAchievements,
        xp: currentXp,
        playerLevel: currentLevel,
        currentTitle: newTitle,
        dailyChallenge: daily
    });

    setCurrentScreen(AppScreen.Result);
  };

  const renderResultScreen = () => {
    if (!lastResult || !currentUser) return null;
    
    let message = "";
    if (lastResult.mode === GameMode.Timed) {
        message = `Escreveste ${Math.round(lastResult.wpm * (lastResult.duration || 1))} palavras!`;
    } else if (lastResult.mode === GameMode.Story) {
        message = "História completada com sucesso!";
    } else {
        message = lastResult.stars === 3 ? SUCCESS_MESSAGES[0] : lastResult.stars === 2 ? "Muito bem!" : "Bom esforço!";
    }

    // Calculate Next Level Logic
    let nextLevel = null;
    if (lastResult.mode === GameMode.Campaign && lastResult.stars >= 1) { // Changed condition to >= 1 star
        const nextId = lastResult.levelId + 1;
        nextLevel = LEVELS.find(l => l.id === nextId);
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
                         <ClayButton onClick={() => setLevelUpData(null)} variant="secondary" theme={currentUser.theme}>Continuar</ClayButton>
                    </motion.div>
                )}

                <h2 className="text-3xl font-bold text-slate-800 mb-2 fun-font">{message}</h2>
                <div className="flex justify-center gap-2 my-6">
                    {[1, 2, 3].map((star) => (
                        <Star key={star} size={48} fill={star <= lastResult.stars ? "#FBBF24" : "#E2E8F0"} className={star <= lastResult.stars ? "text-yellow-400" : "text-slate-200"} />
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-blue-50 p-3 rounded-2xl">
                        <div className="text-[10px] md:text-xs font-bold text-blue-400 uppercase">Velocidade</div>
                        <div className="text-2xl md:text-3xl font-bold text-blue-600">{lastResult.wpm}</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-2xl">
                        <div className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase">Precisão</div>
                        <div className="text-2xl md:text-3xl font-bold text-emerald-600">{lastResult.accuracy}%</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-2xl">
                         <div className="text-[10px] md:text-xs font-bold text-purple-400 uppercase">Ritmo</div>
                         <div className="text-2xl md:text-3xl font-bold text-purple-600">{lastResult.consistency ?? 100}%</div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-3">
                    {/* Next Level Button (Primary) */}
                    {nextLevel && (
                        <ClayButton 
                            variant="primary" 
                            theme={currentUser.theme} 
                            onClick={() => handleStartLevel(nextLevel as Level)}
                            className="w-full py-3"
                        >
                            Próximo Nível <ArrowRight size={18} className="ml-2" />
                        </ClayButton>
                    )}

                    {/* Retry Button (Secondary if won, Primary if lost) */}
                    {!nextLevel && (
                        <ClayButton 
                            variant={lastResult.stars < 2 ? "primary" : "secondary"}
                            theme={currentUser.theme}
                            onClick={() => handleStartLevel(activeLevel)}
                        >
                            Tentar de Novo
                        </ClayButton>
                    )}
                    
                    {/* Return to Menu */}
                    <ClayButton variant="secondary" onClick={() => setCurrentScreen(AppScreen.Dashboard)}>
                        Menu Principal
                    </ClayButton>
                </div>
            </motion.div>
        </div>
    );
  };

  // If no user is selected, show User Selection Screen
  if (!currentUser) {
      if (currentScreen === AppScreen.ParentDashboard) {
          return (
             <ParentDashboard 
                users={Object.values(appState.users)} 
                onBack={() => setCurrentScreen(AppScreen.UserSelect)}
                onDeleteUser={handleDeleteUser}
             />
          )
      }

      return (
        <UserSelectScreen 
            users={Object.values(appState.users)} 
            onSelectUser={handleSelectUser}
            onCreateUser={handleCreateUser}
            onOpenParentDashboard={handleOpenParentDashboard}
        />
      );
  }

  // Lava Lamp Background Colors based on theme
  const BlobColor1 = currentUser.theme === 'rose' ? 'bg-purple-200' : currentUser.theme === 'blue' ? 'bg-blue-200' : 'bg-yellow-200';
  const BlobColor2 = currentUser.theme === 'rose' ? 'bg-yellow-100' : currentUser.theme === 'blue' ? 'bg-cyan-100' : 'bg-orange-100';
  const BlobColor3 = currentUser.theme === 'rose' ? 'bg-pink-100' : currentUser.theme === 'blue' ? 'bg-indigo-100' : 'bg-amber-100';

  return (
    <div className="font-sans text-slate-800 min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      
      {/* Lava Lamp Blobs Background Effect */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] ${BlobColor1} rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob transition-colors duration-1000`}></div>
          <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] ${BlobColor2} rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000 transition-colors duration-1000`}></div>
          <div className={`absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] ${BlobColor3} rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000 transition-colors duration-1000`}></div>
      </div>

      <div className="flex-grow flex flex-col relative z-10">
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
                     <button onClick={() => handleSetTheme('rose')} className={`w-6 h-6 rounded-full bg-rose-400 border-2 transition-transform ${currentUser.theme === 'rose' ? 'border-rose-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Rosa" />
                     <button onClick={() => handleSetTheme('blue')} className={`w-6 h-6 rounded-full bg-blue-400 border-2 transition-transform ${currentUser.theme === 'blue' ? 'border-blue-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Azul" />
                     <button onClick={() => handleSetTheme('amber')} className={`w-6 h-6 rounded-full bg-amber-400 border-2 transition-transform ${currentUser.theme === 'amber' ? 'border-amber-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Amarelo" />
                 </div>

                 {/* Logout Button */}
                 <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition" title="Sair">
                    <LogOut size={20} />
                 </button>
             </div>
        </header>

        {/* --- ROUTER VIEW --- */}
        <div className="flex-grow">
            {currentScreen === AppScreen.Dashboard && (
            <LevelSelector 
                levels={LEVELS} 
                unlockedLevels={currentUser.unlockedLevels}
                gameState={currentUser as any} // Cast for compatibility with shared props
                onSelectLevel={(l) => handleStartLevel(l)}
                onSelectTimedMode={handleStartTimedMode}
                onSelectErrorMode={handleStartErrorMode}
                onSelectStoryMode={handleStartStoryMode}
                onViewStats={() => setCurrentScreen(AppScreen.Stats)} 
                onChangeAvatar={handleChangeAvatar}
                onShowHandGuide={() => setShowHandGuide(true)}
                onToggleBlindMode={setBlindMode}
                isBlindMode={blindMode}
            />
            )}
            
            {currentScreen === AppScreen.Exercise && (
            <TypingArea 
                level={activeLevel}
                mode={activeMode}
                theme={currentUser.theme}
                errorStats={currentUser.errorStats}
                timeLimit={timeLimit}
                difficultyModifier={difficultyModifier}
                blindMode={blindMode}
                onComplete={handleLevelComplete}
                onExit={() => setCurrentScreen(AppScreen.Dashboard)}
            />
            )}

            {currentScreen === AppScreen.Result && lastResult && renderResultScreen()}

            {currentScreen === AppScreen.Stats && (
                <StatsBoard 
                history={currentUser.history} 
                unlockedLevels={currentUser.unlockedLevels}
                levels={LEVELS}
                achievements={currentUser.achievements}
                theme={currentUser.theme}
                onBack={() => setCurrentScreen(AppScreen.Dashboard)}
                onViewAchievements={() => setCurrentScreen(AppScreen.Achievements)}
                />
            )}

            {currentScreen === AppScreen.Achievements && (
                <AchievementsScreen
                unlockedIds={currentUser.achievements}
                onBack={() => setCurrentScreen(AppScreen.Stats)}
                />
            )}
        </div>

        {/* --- FOOTER with Angolan Reference --- */}
        {currentScreen !== AppScreen.Exercise && (
            <footer className="w-full max-w-7xl mx-auto p-6 text-center text-slate-400 text-sm font-bold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <span className="flex items-center gap-2">
                    Feito com <Heart size={14} className="text-red-400 fill-red-400" /> para a educação em Portugal e Angola 🇵🇹 🇦🇴
                </span>
                <button onClick={() => setShowPrivacyModal(true)} className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                     <Shield size={14} /> Privacidade e Dados
                </button>
            </footer>
        )}
      </div>

      {/* --- GLOBAL MODALS --- */}
      <CookieBanner onOpenPolicy={() => setShowPrivacyModal(true)} theme={currentUser.theme} />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)}
        onClearData={handleClearData}
        theme={currentUser.theme}
      />
      <HandGuideModal
        isOpen={showHandGuide}
        onClose={() => setShowHandGuide(false)}
        theme={currentUser.theme}
      />
    </div>
  );
};

export default App;
