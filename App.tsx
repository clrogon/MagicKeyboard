
import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AppState, UserProfile, AppScreen, Level, SessionResult, GameMode, ErrorStats, Theme, CustomLesson, KeyboardLayout } from './types';
import { LEVELS, PLAYER_TITLES, AVATARS, THEME_COLORS, getXpForNextLevel, ACHIEVEMENTS } from './constants';
import LevelSelector from './components/LevelSelector';
import TypingArea from './components/TypingArea';
import StatsBoard from './components/StatsBoard';
import AchievementsScreen from './components/AchievementsScreen';
import UserSelectScreen from './components/UserSelectScreen';
import ParentDashboard from './components/ParentDashboard';
import PrivacyModal from './components/PrivacyModal';
import CookieBanner from './components/CookieBanner';
import HandGuideModal from './components/HandGuideModal';
import ScreenRestriction from './components/ScreenRestriction';
import { Shield, Zap, Star, LogOut, Heart, ArrowRight, Download, WifiOff, Unlock, Medal, TrendingUp, Hourglass, Target, Calendar, CalendarCheck, Crown, Hash, ShieldCheck, Clock, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { audioService } from './services/audioService';
import { ClayButton } from './components/ClayButton';

const IconMap: Record<string, React.ElementType> = {
    Star, Zap, Target, Calendar, Crown, Hash, CalendarCheck, ShieldCheck, Clock, TrendingUp, Hourglass
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('keyboardHeroState');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.users) {
            const legacyUser: UserProfile = {
                id: 'legacy',
                name: 'Jogador',
                ...parsed, 
                achievements: parsed.achievements || [],
                xp: parsed.xp || 0,
                playerLevel: parsed.playerLevel || 1,
                currentTitle: parsed.currentTitle || PLAYER_TITLES[1],
                currentAvatar: parsed.currentAvatar || AVATARS[0],
                theme: parsed.theme || 'rose',
                unlockedLevels: parsed.unlockedLevels || [1],
                history: parsed.history || [],
                errorStats: parsed.errorStats || {},
                soundEnabled: true,
                layout: parsed.layout || 'qwerty'
            };
            return {
                users: { 'legacy': legacyUser },
                activeUserId: null,
                customLessons: []
            };
        }
        
        const migratedUsers = { ...parsed.users };
        Object.keys(migratedUsers).forEach(key => {
            if (!migratedUsers[key].layout) {
                migratedUsers[key].layout = 'qwerty';
            }
        });

        return {
            ...parsed,
            users: migratedUsers,
            customLessons: parsed.customLessons || []
        };
      } catch (e) {
          console.error("Save migration failed", e);
      }
    }
    return {
      users: {},
      activeUserId: null,
      customLessons: []
    };
  });

  const currentUser = appState.activeUserId ? appState.users[appState.activeUserId] : null;

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(
      currentUser ? AppScreen.Dashboard : AppScreen.UserSelect
  );
  
  const [activeLevel, setActiveLevel] = useState<Level>(LEVELS[0]);
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.Campaign);
  
  const [difficultyModifier, setDifficultyModifier] = useState<'normal' | 'hard'>('normal');
  const [timeLimit, setTimeLimit] = useState<number | undefined>(undefined);
  const [blindMode, setBlindMode] = useState<boolean>(false); 
  
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [levelUpData, setLevelUpData] = useState<{old: number, new: number} | null>(null);
  const [levelUnlocked, setLevelUnlocked] = useState<number | null>(null);
  const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState<string[]>([]);

  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHandGuide, setShowHandGuide] = useState(false);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const colors = currentUser ? THEME_COLORS[currentUser.theme] : THEME_COLORS['rose'];

  useEffect(() => {
    localStorage.setItem('keyboardHeroState', JSON.stringify(appState));
  }, [appState]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    const handleInstallPrompt = (e: any) => {
        e.preventDefault();
        setInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
      if (!installPrompt) return;
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
          if (choiceResult.outcome === 'accepted') {
              setInstallPrompt(null);
          }
      });
  };

  const updateUser = useCallback((userId: string, updates: Partial<UserProfile>) => {
      setAppState(prev => ({
          ...prev,
          users: {
              ...prev.users,
              [userId]: { ...prev.users[userId], ...updates }
          }
      }));
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    
    const today = new Date().toISOString().split('T')[0];
    if (!currentUser.dailyChallenge || currentUser.dailyChallenge.date !== today) {
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
  }, [appState.activeUserId, currentUser, updateUser]);

  const handleCreateUser = (name: string, avatar: string, theme: Theme, layout: KeyboardLayout) => {
      const newUser: UserProfile = {
          id: Date.now().toString(),
          name,
          currentAvatar: avatar,
          theme,
          layout,
          xp: 0,
          playerLevel: 1,
          currentTitle: PLAYER_TITLES[1],
          currentLevelId: 1,
          unlockedLevels: [1],
          history: [],
          errorStats: {},
          achievements: [],
          dailyChallenge: null,
          soundEnabled: true
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
    const num1 = Math.floor(Math.random() * 5) + 3; 
    const num2 = Math.floor(Math.random() * 4) + 2; 
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

  const handleAddCustomLesson = (lesson: CustomLesson) => {
      setAppState(prev => ({
          ...prev,
          customLessons: [...prev.customLessons, lesson]
      }));
  };

  const handleDeleteCustomLesson = (lessonId: string) => {
      if (!window.confirm("Apagar esta lição?")) return;
      setAppState(prev => ({
          ...prev,
          customLessons: prev.customLessons.filter(l => l.id !== lessonId)
      }));
  };

  const handleImportData = (newState: AppState) => {
      setAppState(newState);
      alert("Dados importados com sucesso! A página vai recarregar.");
      window.location.reload();
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

  const handleToggleSound = (enabled: boolean) => {
      if (!currentUser) return;
      updateUser(currentUser.id, { soundEnabled: enabled });
      if (enabled) {
          audioService.init();
          audioService.playClick();
      }
  };

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
          textSamples: ["O rato roeu a rolha da garrafa do rei da Rússia.", "Três tristes tigres.", "Quem conta um conto acrescenta um ponto."], 
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
          textSamples: ["foca nos teus erros", "pratica para melhorar", "devagar se vai ao longe", "atenção aos detalhes"],
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
          textSamples: ["Era uma vez um gato que queria aprender a teclar.", "A Ana foi à escola e aprendeu muitas coisas novas hoje.", "O sol brilha no céu azul de Portugal."],
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

  const handleStartDictationMode = () => {
      if (!currentUser) return;
      const maxUnlocked = Math.max(...currentUser.unlockedLevels);
      const unlockedKeys = LEVELS.filter(l => l.id <= maxUnlocked).flatMap(l => l.newKeys);
      const uniqueKeys = Array.from(new Set(unlockedKeys));

      const dictationLevel: Level = {
          id: -4,
          title: "Ditado Mágico",
          description: "Ouve e escreve!",
          newKeys: [],
          allKeys: uniqueKeys,
          textSamples: ["A Ana gosta de ler e escrever.", "O sol brilha muito em Luanda.", "Vamos passear ao parque hoje."],
          difficulty: 'medium',
          minWpm: 0,
          minAccuracy: 0
      };
      setActiveLevel(dictationLevel);
      setActiveMode(GameMode.Dictation);
      setDifficultyModifier('normal');
      setTimeLimit(undefined);
      setCurrentScreen(AppScreen.Exercise);
  };

  const handleStartCustomLesson = (lesson: CustomLesson) => {
      const customLevel: Level = {
          id: -100,
          title: lesson.title,
          description: lesson.description,
          newKeys: [],
          allKeys: [], 
          textSamples: [lesson.content],
          difficulty: 'medium',
          minWpm: 0,
          minAccuracy: 0
      };
      setActiveLevel(customLevel);
      setActiveMode(GameMode.Custom);
      setDifficultyModifier('normal');
      setTimeLimit(undefined);
      setCurrentScreen(AppScreen.Exercise);
  };

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
      if (result.mode === GameMode.Story) xp += 15; 
      if (result.mode === GameMode.Dictation) xp += 20;
      return xp;
  };

  const handleLevelComplete = (result: SessionResult, sessionErrors: ErrorStats, sessionCorrects: ErrorStats) => {
    if (!currentUser) return;
    const isWin = result.stars >= 1; 
    setLevelUpData(null);
    setLevelUnlocked(null);
    setNewlyUnlockedAchievements([]);

    if (isWin || result.mode === GameMode.Timed || result.mode === GameMode.Story || result.mode === GameMode.Custom || result.mode === GameMode.Dictation) {
       if (currentUser.soundEnabled) {
          audioService.init();
          audioService.playWin();
       }
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
    const newHistory = [...currentUser.history, result];
    let newUnlocked = [...currentUser.unlockedLevels];
    let newAchievements = [...currentUser.achievements];
    const unlockedNow: string[] = [];
    
    if (result.mode === GameMode.Campaign && isWin && result.levelId === Math.max(...currentUser.unlockedLevels)) {
        const nextLevelId = result.levelId + 1;
        if (LEVELS.find(l => l.id === nextLevelId) && !newUnlocked.includes(nextLevelId)) {
            newUnlocked.push(nextLevelId);
            setLevelUnlocked(nextLevelId);
        }
    }

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

    const totalPlayTimeMinutes = newHistory.reduce((acc, sess) => acc + (sess.duration || 0), 0);

    const checkForAchievement = (id: string, condition: boolean) => {
        if (condition && !newAchievements.includes(id)) {
            newAchievements.push(id);
            unlockedNow.push(id);
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
    checkForAchievement('marathon_runner', totalPlayTimeMinutes >= 60);

    if (unlockedNow.length > 0) {
        setNewlyUnlockedAchievements(unlockedNow);
    }

    let sessionXp = calculateSessionXp(result);
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
    
    // Check level achievements after update
    if (currentLevel >= 5 && !newAchievements.includes('level_5')) {
        newAchievements.push('level_5');
        setNewlyUnlockedAchievements(prev => [...prev, 'level_5']);
    }

    let newTitle = currentUser.currentTitle;
    if (leveledUp) {
        const unlockedTitles = Object.keys(PLAYER_TITLES).map(Number).filter(lvl => lvl <= currentLevel).sort((a,b) => b-a);
        if (unlockedTitles.length > 0) {
            newTitle = PLAYER_TITLES[unlockedTitles[0]];
        }
        setLevelUpData({ old: currentUser.playerLevel, new: currentLevel });
    }

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
    let goalStatus = "";
    const isWin = lastResult.stars >= 1;

    // Use current activeLevel state to get requirements
    const wpmGoal = activeLevel.minWpm;
    const accuracyGoal = activeLevel.minAccuracy;
    const isCampaign = lastResult.mode === GameMode.Campaign;

    if (lastResult.mode === GameMode.Timed) {
        message = `Escreveste ${Math.round(lastResult.wpm * (lastResult.duration || 1))} palavras!`;
        goalStatus = "Corrida Terminada";
    } else if (lastResult.mode === GameMode.Story) {
        message = "História completada com sucesso!";
        goalStatus = "Livro Fechado";
    } else if (lastResult.mode === GameMode.Custom) {
        message = "Lição completada!";
        goalStatus = "Bom trabalho";
    } else if (lastResult.mode === GameMode.Dictation) {
        message = "Ditado completo!";
        goalStatus = "Bom ouvido!";
    } else {
        // Campaign messages
        if (isWin) {
            message = lastResult.stars === 3 ? "Missão Perfeita!" : "Missão Cumprida!";
            goalStatus = "Nível Completado!";
        } else {
            message = "Quase lá!";
            goalStatus = "Missão Falhada";
        }
    }

    const getConsistencyLabel = (val: number) => {
        if (val >= 90) return "Super Regular!";
        if (val >= 70) return "Regular";
        return "A melhorar";
    };

    let nextLevel = null;
    if (isCampaign && isWin) { 
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
                {/* Level Up Notification */}
                {levelUpData && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 ${colors.bg} z-50 flex flex-col items-center justify-center text-white p-6`}>
                         <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
                            <Star size={48} className="fill-white" />
                         </div>
                         <h2 className="text-4xl font-bold mb-4 font-fredoka">NÍVEL DE JOGADOR {levelUpData.new}!</h2>
                         <ClayButton onClick={() => setLevelUpData(null)} variant="secondary" theme={currentUser.theme}>Uau!</ClayButton>
                    </motion.div>
                )}
                {/* Unlock Notification */}
                {!levelUpData && levelUnlocked && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 bg-emerald-500 z-50 flex flex-col items-center justify-center text-white p-6`}>
                         <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
                            <Unlock size={48} className="fill-white" />
                         </div>
                         <h2 className="text-4xl font-bold mb-4 font-fredoka">NOVO DESAFIO!</h2>
                         <p className="text-xl mb-6">Desbloqueaste o Nível {levelUnlocked}</p>
                         <ClayButton onClick={() => setLevelUnlocked(null)} variant="secondary" theme={currentUser.theme}>Vamos lá!</ClayButton>
                    </motion.div>
                )}
                
                {/* Achievement Notification */}
                {!levelUpData && !levelUnlocked && newlyUnlockedAchievements.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`absolute inset-0 bg-yellow-400 z-50 flex flex-col items-center justify-center text-white p-6`}>
                         {newlyUnlockedAchievements.map(achId => {
                             const ach = ACHIEVEMENTS.find(a => a.id === achId);
                             if (!ach) return null;
                             const Icon = IconMap[ach.icon] || Star;
                             return (
                                 <div key={achId} className="flex flex-col items-center">
                                     <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce">
                                        <Medal size={48} className="fill-white" />
                                     </div>
                                     <h2 className="text-3xl font-bold mb-2 font-fredoka">CONQUISTA!</h2>
                                     <div className="bg-white/20 px-4 py-2 rounded-xl mb-4 flex items-center gap-2">
                                         <Icon size={20} />
                                         <span className="font-bold">{ach.title}</span>
                                     </div>
                                     <p className="text-lg mb-6 max-w-[80%]">{ach.description}</p>
                                 </div>
                             )
                         })}
                         <ClayButton onClick={() => setNewlyUnlockedAchievements([])} variant="secondary" theme={currentUser.theme}>Espetacular!</ClayButton>
                    </motion.div>
                )}

                <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 ${isWin ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {goalStatus}
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2 fun-font">{message}</h2>
                <div className="flex justify-center gap-2 my-4">
                    {[1, 2, 3].map((star) => (
                        <Star key={star} size={40} fill={star <= lastResult.stars ? "#FBBF24" : "#E2E8F0"} className={star <= lastResult.stars ? "text-yellow-400" : "text-slate-200"} />
                    ))}
                </div>

                {isCampaign && (
                    <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Relatório da Missão</p>
                        
                        {/* Speed Goal Check */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                {lastResult.wpm >= wpmGoal ? <Check className="text-emerald-500" size={18} /> : <X className="text-red-400" size={18} />}
                                <span className="text-sm font-bold text-slate-600">Velocidade</span>
                            </div>
                            <div className="text-sm">
                                <span className={`font-bold ${lastResult.wpm >= wpmGoal ? 'text-emerald-600' : 'text-red-500'}`}>{lastResult.wpm} PPM</span>
                                <span className="text-slate-400 mx-1">/</span>
                                <span className="text-slate-400">{wpmGoal} alvo</span>
                            </div>
                        </div>

                        {/* Accuracy Goal Check */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {lastResult.accuracy >= accuracyGoal ? <Check className="text-emerald-500" size={18} /> : <X className="text-red-400" size={18} />}
                                <span className="text-sm font-bold text-slate-600">Precisão</span>
                            </div>
                            <div className="text-sm">
                                <span className={`font-bold ${lastResult.accuracy >= accuracyGoal ? 'text-emerald-600' : 'text-red-500'}`}>{lastResult.accuracy}%</span>
                                <span className="text-slate-400 mx-1">/</span>
                                <span className="text-slate-400">{accuracyGoal}% alvo</span>
                            </div>
                        </div>
                    </div>
                )}

                {!isCampaign && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-blue-50 p-3 rounded-2xl">
                            <div className="text-[10px] md:text-xs font-bold text-blue-400 uppercase">Velocidade</div>
                            <div className="text-2xl md:text-3xl font-bold text-blue-600">{lastResult.wpm}</div>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-2xl">
                            <div className="text-[10px] md:text-xs font-bold text-emerald-400 uppercase">Precisão</div>
                            <div className="text-xl md:text-2xl font-bold text-emerald-600 leading-tight pt-1">
                                {lastResult.accuracy}%
                            </div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-2xl">
                            <div className="text-[10px] md:text-xs font-bold text-purple-400 uppercase">Ritmo</div>
                            <div className="text-sm md:text-base font-bold text-purple-600 leading-tight pt-1">
                                {getConsistencyLabel(lastResult.consistency ?? 100)}
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    {nextLevel && (
                        <ClayButton variant="primary" theme={currentUser.theme} onClick={() => handleStartLevel(nextLevel as Level)} className="w-full py-3">
                            Próximo Nível <ArrowRight size={18} className="ml-2" />
                        </ClayButton>
                    )}
                    {!nextLevel && (
                        <ClayButton variant={lastResult.stars < 2 ? "primary" : "secondary"} theme={currentUser.theme} onClick={() => handleStartLevel(activeLevel)}>
                            {isWin ? "Jogar Novamente" : "Tentar de Novo"}
                        </ClayButton>
                    )}
                    <ClayButton variant="secondary" onClick={() => setCurrentScreen(AppScreen.Dashboard)}>
                        Menu Principal
                    </ClayButton>
                </div>
            </motion.div>
        </div>
    );
  };

  if (!currentUser) {
      if (currentScreen === AppScreen.ParentDashboard) {
          return (
             <ParentDashboard 
                users={Object.values(appState.users)} 
                appState={appState}
                onBack={() => setCurrentScreen(AppScreen.UserSelect)}
                onDeleteUser={handleDeleteUser}
                onAddCustomLesson={handleAddCustomLesson}
                onDeleteCustomLesson={handleDeleteCustomLesson}
                onImportData={handleImportData}
             />
          )
      }
      return (
        <UserSelectScreen users={Object.values(appState.users)} onSelectUser={handleSelectUser} onCreateUser={handleCreateUser} onOpenParentDashboard={handleOpenParentDashboard} />
      );
  }

  const BlobColor1 = currentUser.theme === 'rose' ? 'bg-purple-200' : currentUser.theme === 'blue' ? 'bg-blue-200' : 'bg-yellow-200';
  const BlobColor2 = currentUser.theme === 'rose' ? 'bg-yellow-100' : currentUser.theme === 'blue' ? 'bg-cyan-100' : 'bg-orange-100';
  const BlobColor3 = currentUser.theme === 'rose' ? 'bg-pink-100' : currentUser.theme === 'blue' ? 'bg-indigo-100' : 'bg-amber-100';

  return (
    <div className="font-sans text-slate-800 min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <ScreenRestriction />
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
                 {isOffline && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        <WifiOff size={14} />
                        <span className="hidden sm:inline">Sem Internet</span>
                    </div>
                 )}
             </div>
             <div className="flex items-center gap-4">
                 <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full flex items-center gap-1 shadow-sm border border-white">
                     <button onClick={() => handleSetTheme('rose')} className={`w-6 h-6 rounded-full bg-rose-400 border-2 transition-transform ${currentUser.theme === 'rose' ? 'border-rose-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Rosa" />
                     <button onClick={() => handleSetTheme('blue')} className={`w-6 h-6 rounded-full bg-blue-400 border-2 transition-transform ${currentUser.theme === 'blue' ? 'border-blue-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Azul" />
                     <button onClick={() => handleSetTheme('amber')} className={`w-6 h-6 rounded-full bg-amber-400 border-2 transition-transform ${currentUser.theme === 'amber' ? 'border-amber-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Amarelo" />
                 </div>
                 <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition" title="Sair">
                    <LogOut size={20} />
                 </button>
             </div>
        </header>
        <div className="flex-grow">
            {currentScreen === AppScreen.Dashboard && (
            <LevelSelector levels={LEVELS} unlockedLevels={currentUser.unlockedLevels} customLessons={appState.customLessons} gameState={currentUser as any} onSelectLevel={handleStartLevel} onSelectTimedMode={handleStartTimedMode} onSelectErrorMode={handleStartErrorMode} onSelectStoryMode={handleStartStoryMode} onSelectDictationMode={handleStartDictationMode} onSelectCustomLesson={handleStartCustomLesson} onViewStats={() => setCurrentScreen(AppScreen.Stats)} onChangeAvatar={handleChangeAvatar} onShowHandGuide={() => setShowHandGuide(true)} onToggleBlindMode={setBlindMode} onToggleSound={handleToggleSound} isBlindMode={blindMode} />
            )}
            {currentScreen === AppScreen.Exercise && (
            <TypingArea level={activeLevel} mode={activeMode} theme={currentUser.theme} layout={currentUser.layout} errorStats={currentUser.errorStats} timeLimit={timeLimit} difficultyModifier={difficultyModifier} blindMode={blindMode} soundEnabled={currentUser.soundEnabled} onComplete={handleLevelComplete} onExit={() => setCurrentScreen(AppScreen.Dashboard)} />
            )}
            {currentScreen === AppScreen.Result && lastResult && renderResultScreen()}
            {currentScreen === AppScreen.Stats && (
                <StatsBoard user={currentUser} history={currentUser.history} unlockedLevels={currentUser.unlockedLevels} levels={LEVELS} achievements={currentUser.achievements} theme={currentUser.theme} onBack={() => setCurrentScreen(AppScreen.Dashboard)} onViewAchievements={() => setCurrentScreen(AppScreen.Achievements)} />
            )}
            {currentScreen === AppScreen.Achievements && (
                <AchievementsScreen unlockedIds={currentUser.achievements} onBack={() => setCurrentScreen(AppScreen.Stats)} />
            )}
        </div>
        {currentScreen !== AppScreen.Exercise && (
            <footer className="w-full max-w-7xl mx-auto p-6 text-center text-slate-400 text-sm font-bold flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex flex-col items-center gap-2">
                    <span className="flex items-center gap-2">
                        Feito com <Heart size={14} className="text-red-400 fill-red-400" /> por Cláudio Roberto Gonçalves para a educação em Portugal e Angola 🇵🇹 🇦🇴
                    </span>
                    <span className="text-xs opacity-50">© 2026 Cláudio Roberto Gonçalves. v1.5.0 (2026) | MIT License</span>
                </div>
                <button onClick={() => setShowPrivacyModal(true)} className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                     <Shield size={14} /> Privacidade e Dados
                </button>
                {installPrompt && (
                    <button onClick={handleInstallClick} className="flex items-center gap-1 text-emerald-500 hover:text-emerald-700 transition-colors bg-emerald-50 px-3 py-1 rounded-full animate-bounce">
                        <Download size={14} /> Instalar Aplicação
                    </button>
                )}
            </footer>
        )}
      </div>
      <CookieBanner onOpenPolicy={() => setShowPrivacyModal(true)} theme={currentUser.theme} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} onClearData={handleClearData} theme={currentUser.theme} />
      <HandGuideModal isOpen={showHandGuide} onClose={() => setShowHandGuide(false)} theme={currentUser.theme} />
    </div>
  );
};

export default App;
