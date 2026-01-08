
import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AppState, UserProfile, AppScreen, Level, SessionResult, GameMode, ErrorStats, Theme, CustomLesson, KeyboardLayout, GhostRecord } from './types';
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
import { Shield, Zap, Star, LogOut, Heart, ArrowRight, Download, WifiOff, Unlock, Medal, TrendingUp, Hourglass, Target, Calendar, CalendarCheck, Crown, Hash, ShieldCheck, Clock, Check, X, Code, AtSign, Terminal, Lock, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import { audioService } from './services/audioService';
import { ClayButton } from './components/ClayButton';
import QRCode from 'react-qr-code';

const IconMap: Record<string, React.ElementType> = {
    Star, Zap, Target, Calendar, Crown, Hash, CalendarCheck, ShieldCheck, Clock, TrendingUp, Hourglass, Code, AtSign, Terminal
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
                layout: parsed.layout || 'qwerty',
                ghosts: {},
                kioskMode: false
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
            if (!migratedUsers[key].ghosts) {
                migratedUsers[key].ghosts = {};
            }
            // Ensure kioskMode defaults to false if missing
            if (migratedUsers[key].kioskMode === undefined) {
                migratedUsers[key].kioskMode = false;
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
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [showQR, setShowQR] = useState(false);

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
        else if (type === 'accuracy') { 
            target = currentUser.playerLevel < 5 ? 95 : 100; 
            desc = `Completa um exercício com ${target}% de Precisão`; 
        }
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
          soundEnabled: true,
          ghosts: {},
          kioskMode: false
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
      // If Kiosk Mode is on, secure the logout action
      if (currentUser?.kioskMode) {
          handleOpenParentDashboard();
          // NOTE: handleOpenParentDashboard switches to ParentDashboard on success. 
          // From there, teachers can disable Kiosk Mode or switch users.
          return;
      }
      setAppState(prev => ({ ...prev, activeUserId: null }));
      setCurrentScreen(AppScreen.UserSelect);
  };

  const handleClearData = () => {
    localStorage.removeItem('keyboardHeroState');
    localStorage.removeItem('cookieConsent');
    window.location.reload();
  };
  
  const handleChangeAvatar = () => {
      if (!currentUser || currentUser.kioskMode) return; // Locked in Kiosk
      const currentIndex = AVATARS.indexOf(currentUser.currentAvatar);
      const nextIndex = (currentIndex + 1) % AVATARS.length;
      updateUser(currentUser.id, { currentAvatar: AVATARS[nextIndex] });
  };

  const handleSetTheme = (theme: Theme) => {
      if (!currentUser || currentUser.kioskMode) return; // Locked in Kiosk
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
          // Updated default story samples to be more engaging
          textSamples: [
              "A Ana encontrou um mapa antigo no sótão do avô.", 
              "O gato Miau saltou para o telhado para ver a lua.", 
              "Em Luanda, o Zola correu para ver o mar azul."
          ],
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
          // Simpler, distinct sentences better suited for audio dictation
          textSamples: [
              "O sol brilha.", 
              "A Ana gosta de ler.", 
              "Vamos brincar no parque."
          ],
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

  const handleLevelComplete = (result: SessionResult, sessionErrors: ErrorStats, sessionCorrects: ErrorStats, ghostData?: GhostRecord) => {
    if (!currentUser) return;
    const isWin = result.stars >= 1; 
    setLevelUpData(null);
    setLevelUnlocked(null);
    setNewlyUnlockedAchievements([]);
    setChallengeCompleted(false);
    setShowQR(false);

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
    
    // New Achievements Logic for Phase 8
    checkForAchievement('code_master', result.levelId === 18 && result.stars >= 1);
    checkForAchievement('altgr_pro', result.levelId === 19 && result.stars >= 1);
    checkForAchievement('terminal_wizard', result.levelId === 20 && result.stars >= 1);

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
            setChallengeCompleted(true);
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

    // Ghost Persistence Logic
    let newGhosts = { ...(currentUser.ghosts || {}) };
    if (ghostData && (result.mode === GameMode.Campaign || result.mode === GameMode.Custom)) {
        const levelKey = result.levelId.toString();
        const existingGhost = newGhosts[levelKey];
        // Only save ghost if it's faster/better than previous
        if (!existingGhost || ghostData.wpm > existingGhost.wpm) {
            newGhosts[levelKey] = ghostData;
        }
    }

    updateUser(currentUser.id, {
        history: newHistory,
        unlockedLevels: newUnlocked,
        errorStats: newErrorStats,
        achievements: newAchievements,
        xp: currentXp,
        playerLevel: currentLevel,
        currentTitle: newTitle,
        dailyChallenge: daily,
        ghosts: newGhosts
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

    // Child-friendly feedback logic
    let feedbackSuggestion = "";
    if (isCampaign) {
        if (!isWin) {
            if (lastResult.wpm < wpmGoal && lastResult.accuracy < accuracyGoal) {
                feedbackSuggestion = "Precisas de ser mais rápido e ter mais atenção às teclas.";
            } else if (lastResult.wpm < wpmGoal) {
                feedbackSuggestion = "Acertaste bem, mas tenta escrever um pouco mais depressa!";
            } else if (lastResult.accuracy < accuracyGoal) {
                feedbackSuggestion = "Estás a ir depressa demais! Abranda para não falhares.";
            } else {
                feedbackSuggestion = "Estiveste quase, quase lá! Tenta outra vez.";
            }
        } else {
            const nextId = lastResult.levelId + 1;
            const nextLevel = LEVELS.find(l => l.id === nextId);
            if (nextLevel && currentUser.unlockedLevels.includes(nextId)) {
                feedbackSuggestion = "Excelente! Estás pronto para o próximo nível.";
            } else {
                feedbackSuggestion = "Já dominas este nível! Tenta bater o teu recorde.";
            }
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

    const levelDisplay = lastResult.mode === GameMode.Campaign ? `Nível ${lastResult.levelId}` : 
                         lastResult.mode === GameMode.Timed ? 'Desafio de Tempo' :
                         lastResult.mode === GameMode.ErrorDrill ? 'Treino de Erros' :
                         lastResult.mode === GameMode.Story ? 'Modo História' :
                         lastResult.mode === GameMode.Dictation ? 'Ditado Mágico' : 'Lição Personalizada';

    // QR Code Data Packet - Formatted for human readability
    const qrData = `RELATÓRIO TECLADO MÁGICO\n` +
        `--------------------------\n` +
        `Aluno: ${currentUser.name}\n` +
        `Exercício: ${levelDisplay}\n` +
        `Velocidade: ${lastResult.wpm} PPM\n` +
        `Precisão: ${lastResult.accuracy}%\n` +
        `Data: ${new Date().toLocaleDateString('pt-PT')}`;

    // Common styling for relative card content within the overlay
    const overlayContentClass = "bg-white/10 rounded-2xl p-6 backdrop-blur-sm w-full max-h-[60vh] overflow-y-auto custom-scrollbar flex flex-col items-center";

    // Determine active splash state
    const isLevelUp = !!levelUpData;
    const isUnlock = !isLevelUp && !!levelUnlocked;
    const isChallenge = !isLevelUp && !isUnlock && challengeCompleted;
    const isAchievement = !isLevelUp && !isUnlock && !isChallenge && newlyUnlockedAchievements.length > 0;
    const isQR = showQR;

    const hasActiveSplash = isLevelUp || isUnlock || isChallenge || isAchievement || isQR;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`bg-white rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden border-4 border-white flex flex-col ${hasActiveSplash ? 'min-h-[400px]' : ''}`}
            >
                
                {/* 1. LEVEL UP SPLASH */}
                {isLevelUp && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex-1 flex flex-col items-center justify-center ${colors.bg} rounded-[2rem] p-6 text-white`}>
                         <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce shadow-lg">
                            <Star size={48} className="fill-white" />
                         </div>
                         <h2 className="text-4xl font-bold mb-4 font-fredoka drop-shadow-sm">NÍVEL DE JOGADOR {levelUpData.new}!</h2>
                         <div className="mt-auto">
                            <ClayButton onClick={() => setLevelUpData(null)} variant="white" className={`${colors.text} px-8 py-3 text-lg w-full`}>Uau!</ClayButton>
                         </div>
                    </motion.div>
                )}

                {/* 2. UNLOCK SPLASH */}
                {isUnlock && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center bg-emerald-500 rounded-[2rem] p-6 text-white">
                         <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce shadow-lg">
                            <Unlock size={48} className="fill-white" />
                         </div>
                         <h2 className="text-4xl font-bold mb-4 font-fredoka drop-shadow-sm">NOVO DESAFIO!</h2>
                         <p className="text-xl mb-8 font-medium">Desbloqueaste o Nível {levelUnlocked}</p>
                         <div className="mt-auto w-full">
                            <ClayButton onClick={() => setLevelUnlocked(null)} variant="white" className="text-emerald-500 px-8 py-3 text-lg w-full">Vamos lá!</ClayButton>
                         </div>
                    </motion.div>
                )}
                
                {/* 3. DAILY CHALLENGE SPLASH */}
                {isChallenge && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center bg-orange-400 rounded-[2rem] p-6 text-white">
                         <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce shadow-lg">
                            <Crown size={48} className="fill-white" />
                         </div>
                         <h2 className="text-3xl font-bold mb-2 font-fredoka drop-shadow-sm">DESAFIO DIÁRIO!</h2>
                         <div className={overlayContentClass + " mb-6"}>
                             <p className="text-xl mb-4 font-medium">{currentUser.dailyChallenge?.description}</p>
                             <div className="bg-white text-orange-500 px-6 py-3 rounded-xl font-bold text-2xl shadow-sm">
                                +{currentUser.dailyChallenge?.rewardXp} XP
                             </div>
                         </div>
                         <div className="mt-auto w-full">
                            <ClayButton onClick={() => setChallengeCompleted(false)} variant="white" className="text-orange-500 px-8 py-3 text-lg w-full">Fantástico!</ClayButton>
                         </div>
                    </motion.div>
                )}

                {/* 4. ACHIEVEMENT SPLASH */}
                {isAchievement && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center bg-yellow-400 rounded-[2rem] p-6 text-white h-full">
                         <div className="bg-white/20 p-4 rounded-full mb-4 animate-bounce shadow-lg shrink-0">
                            <Medal size={48} className="fill-white" />
                         </div>
                         <h2 className="text-3xl font-bold mb-6 font-fredoka drop-shadow-sm shrink-0">CONQUISTA!</h2>
                         
                         <div className={`${overlayContentClass} mb-6`}>
                             {newlyUnlockedAchievements.map(achId => {
                                 const ach = ACHIEVEMENTS.find(a => a.id === achId);
                                 if (!ach) return null;
                                 const Icon = IconMap[ach.icon] || Star;
                                 return (
                                     <div key={achId} className="flex flex-col items-center mb-6 last:mb-0 w-full">
                                         <div className="bg-white/20 px-4 py-2 rounded-xl mb-2 flex items-center gap-2 backdrop-blur-md w-full justify-center shadow-sm">
                                             <Icon size={20} />
                                             <span className="font-bold">{ach.title}</span>
                                         </div>
                                         <p className="text-lg font-medium leading-tight">{ach.description}</p>
                                     </div>
                                 )
                             })}
                         </div>

                         <div className="mt-auto w-full">
                            <ClayButton onClick={() => setNewlyUnlockedAchievements([])} variant="white" className="text-yellow-600 px-8 py-3 text-lg w-full shadow-lg">Espetacular!</ClayButton>
                         </div>
                    </motion.div>
                )}

                {/* 5. QR CODE SPLASH */}
                {isQR && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center bg-white z-40 p-2">
                        <h3 className="text-xl font-bold text-slate-700 mb-4 fun-font">Magic QR Report</h3>
                        <div className="bg-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-100 mb-6 w-full max-w-[240px] flex items-center justify-center">
                            <div style={{ height: "auto", margin: "0 auto", maxWidth: 100 + "%", width: "100%" }}>
                                <QRCode
                                    size={256}
                                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                    value={qrData}
                                    viewBox={`0 0 256 256`}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mb-6 max-w-[200px]">
                            O professor pode ler este código para guardar a tua nota.
                        </p>
                        <ClayButton onClick={() => setShowQR(false)} variant="secondary" theme={currentUser.theme}>
                            Fechar
                        </ClayButton>
                    </motion.div>
                )}

                {/* 6. STANDARD RESULT SCREEN (Shown only if no splash is active) */}
                {!hasActiveSplash && (
                    <>
                        <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 self-center ${isWin ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {goalStatus}
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2 fun-font">{message}</h2>
                        
                        {/* Star Display */}
                        <div className="flex justify-center gap-2 my-4">
                            {[1, 2, 3].map((star) => (
                                <Star key={star} size={40} fill={star <= lastResult.stars ? "#FBBF24" : "#E2E8F0"} className={star <= lastResult.stars ? "text-yellow-400" : "text-slate-200"} />
                            ))}
                        </div>

                        {/* Feedback Suggestion */}
                        {feedbackSuggestion && (
                            <div className={`text-sm font-bold mb-6 px-4 ${isWin ? 'text-emerald-600' : 'text-slate-500'}`}>
                                {feedbackSuggestion}
                            </div>
                        )}

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
                                        <span className="text-sm font-bold text-slate-600">Acertos</span>
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

                        <div className="flex flex-col gap-3 mt-auto w-full">
                            <div className="flex gap-3">
                                <ClayButton variant="secondary" onClick={() => setShowQR(true)} className="flex-1">
                                    <QrCode size={18} className="mr-2" /> QR Pro
                                </ClayButton>
                                <ClayButton variant="secondary" onClick={() => setCurrentScreen(AppScreen.Dashboard)} className="flex-1">
                                    Menu
                                </ClayButton>
                            </div>

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
                        </div>
                    </>
                )}
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
                onUpdateUser={updateUser}
             />
          )
      }
      return (
        <UserSelectScreen users={Object.values(appState.users)} onSelectUser={handleSelectUser} onCreateUser={handleCreateUser} onOpenParentDashboard={handleOpenParentDashboard} />
      );
  }

  // Get active ghost if available
  const currentGhost = currentUser.ghosts ? currentUser.ghosts[activeLevel.id.toString()] : undefined;

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
                 {/* HIDE THEME SELECTOR IF IN KIOSK MODE */}
                 {!currentUser.kioskMode && (
                     <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full flex items-center gap-1 shadow-sm border border-white">
                         <button onClick={() => handleSetTheme('rose')} className={`w-6 h-6 rounded-full bg-rose-400 border-2 transition-transform ${currentUser.theme === 'rose' ? 'border-rose-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Rosa" />
                         <button onClick={() => handleSetTheme('blue')} className={`w-6 h-6 rounded-full bg-blue-400 border-2 transition-transform ${currentUser.theme === 'blue' ? 'border-blue-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Azul" />
                         <button onClick={() => handleSetTheme('amber')} className={`w-6 h-6 rounded-full bg-amber-400 border-2 transition-transform ${currentUser.theme === 'amber' ? 'border-amber-600 scale-110' : 'border-transparent hover:scale-105'}`} aria-label="Tema Amarelo" />
                     </div>
                 )}
                 
                 {/* Kiosk Mode Logout Protection */}
                 {currentUser.kioskMode ? (
                     <button onClick={handleLogout} className="bg-slate-200 text-slate-500 hover:bg-slate-300 p-2 rounded-full transition" title="Acesso Professor (Bloqueado)">
                        <Lock size={20} />
                     </button>
                 ) : (
                     <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition" title="Sair">
                        <LogOut size={20} />
                     </button>
                 )}
             </div>
        </header>
        <div className="flex-grow">
            {currentScreen === AppScreen.Dashboard && (
            <LevelSelector levels={LEVELS} unlockedLevels={currentUser.unlockedLevels} customLessons={appState.customLessons} gameState={currentUser as any} onSelectLevel={handleStartLevel} onSelectTimedMode={handleStartTimedMode} onSelectErrorMode={handleStartErrorMode} onSelectStoryMode={handleStartStoryMode} onSelectDictationMode={handleStartDictationMode} onSelectCustomLesson={handleStartCustomLesson} onViewStats={() => setCurrentScreen(AppScreen.Stats)} onChangeAvatar={handleChangeAvatar} onShowHandGuide={() => setShowHandGuide(true)} onToggleBlindMode={setBlindMode} onToggleSound={handleToggleSound} isBlindMode={blindMode} />
            )}
            {currentScreen === AppScreen.Exercise && (
            <TypingArea level={activeLevel} mode={activeMode} theme={currentUser.theme} layout={currentUser.layout} errorStats={currentUser.errorStats} timeLimit={timeLimit} difficultyModifier={difficultyModifier} blindMode={blindMode} soundEnabled={currentUser.soundEnabled} existingGhost={currentGhost} onComplete={handleLevelComplete} onExit={() => setCurrentScreen(AppScreen.Dashboard)} />
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
                    <span className="text-xs opacity-50">© 2026 Cláudio Roberto Gonçalves. v2.0.0 (2026) | MIT License</span>
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
