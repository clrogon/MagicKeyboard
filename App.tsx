
import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { AppState, UserProfile, AppScreen, Level, SessionResult, GameMode, ErrorStats, Theme, KeyboardLayout, GhostRecord } from './types';
import { LEVELS, PLAYER_TITLES, AVATARS, LIBRARY_TEXTS } from './constants';
import LevelSelector from './components/LevelSelector';
import TypingArea from './components/TypingArea';
import StatsBoard from './components/StatsBoard';
import AchievementsScreen from './components/AchievementsScreen';
import UserSelectScreen from './components/UserSelectScreen';
import ParentDashboard from './components/ParentDashboard';
import LibraryScreen from './components/LibraryScreen';
import PrivacyModal from './components/PrivacyModal';
import CookieBanner from './components/CookieBanner';
import HandGuideModal from './components/HandGuideModal';
import ScreenRestriction from './components/ScreenRestriction';
import { Heart, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { audioService } from './services/audioService';
import { ClayButton } from './components/ClayButton';
import QRCode from 'react-qr-code';

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
                xp: 0, playerLevel: 1, currentTitle: PLAYER_TITLES[1], currentAvatar: AVATARS[0], theme: 'rose', unlockedLevels: [1], history: [], errorStats: {}, achievements: [], soundEnabled: true, layout: 'qwerty', currentLevelId: 1, ghosts: {}, kioskMode: false, dailyChallenge: null
            };
            return { users: { 'legacy': legacyUser }, activeUserId: null, customLessons: [] };
        }
        return { ...parsed, customLessons: parsed.customLessons || [] };
      } catch (e) { console.error("Save migration failed", e); }
    }
    return { users: {}, activeUserId: null, customLessons: [] };
  });

  const currentUser = appState.activeUserId ? appState.users[appState.activeUserId] : null;
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(currentUser ? AppScreen.Dashboard : AppScreen.UserSelect);
  const [activeLevel, setActiveLevel] = useState<Level>(LEVELS[0]);
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.Campaign);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHandGuide, setShowHandGuide] = useState(false);

  useEffect(() => {
    localStorage.setItem('keyboardHeroState', JSON.stringify(appState));
  }, [appState]);

  const updateUser = useCallback((userId: string, updates: Partial<UserProfile>) => {
      setAppState(prev => ({
          ...prev,
          users: { ...prev.users, [userId]: { ...prev.users[userId], ...updates } }
      }));
  }, []);

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
          soundEnabled: true,
          ghosts: {},
          kioskMode: false,
          dailyChallenge: null
      };
      setAppState(prev => ({
          ...prev,
          users: { ...prev.users, [newUser.id]: newUser },
          activeUserId: newUser.id
      }));
      setCurrentScreen(AppScreen.Dashboard);
  };

  const handleSelectUser = (id: string) => {
      setAppState(p => ({...p, activeUserId: id}));
      setCurrentScreen(AppScreen.Dashboard);
  };

  const handleDeleteUser = (id: string) => {
      setAppState(prev => {
          const newUsers = { ...prev.users };
          delete newUsers[id];
          return { ...prev, users: newUsers, activeUserId: prev.activeUserId === id ? null : prev.activeUserId };
      });
  };

  const handleClearData = () => {
      localStorage.removeItem('keyboardHeroState');
      localStorage.removeItem('cookieConsent');
      window.location.reload();
  };

  const handleStartLevel = (level: Level) => {
    setActiveLevel(level);
    setActiveMode(GameMode.Campaign);
    setCurrentScreen(AppScreen.Exercise);
  };

  const handleStartLibraryText = (libText: typeof LIBRARY_TEXTS[0]) => {
      const libLevel: Level = {
          id: -50, title: libText.title, description: `Obra de ${libText.author} (${libText.origin})`,
          newKeys: [], allKeys: [], textSamples: [libText.content],
          difficulty: 'hard', minWpm: 15, minAccuracy: 95
      };
      setActiveLevel(libLevel);
      setActiveMode(GameMode.Library);
      setCurrentScreen(AppScreen.Exercise);
  };

  const handleLevelComplete = (result: SessionResult, _sessionErrors: ErrorStats, _sessionCorrects: ErrorStats, _ghostData?: GhostRecord) => {
    if (!currentUser) return;
    const minAcc = result.mode === GameMode.Library ? 95 : (activeLevel.minAccuracy || 1);
    const isWin = result.accuracy >= minAcc && result.stars >= 1; 

    if (isWin) {
       audioService.playWin();
       confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    setLastResult(result);
    const newHistory = [...currentUser.history, result];
    let newUnlocked = [...currentUser.unlockedLevels];
    
    if (result.mode === GameMode.Campaign && isWin && result.levelId === Math.max(...currentUser.unlockedLevels)) {
        const nextId = result.levelId + 1;
        if (LEVELS.find(l => l.id === nextId) && !newUnlocked.includes(nextId)) newUnlocked.push(nextId);
    }

    updateUser(currentUser.id, {
        history: newHistory,
        unlockedLevels: newUnlocked,
        xp: currentUser.xp + (isWin ? 100 : 20),
    });
    setCurrentScreen(AppScreen.Result);
  };

  const renderResultScreen = () => {
    if (!lastResult || !currentUser) return null;
    const isWin = lastResult.accuracy >= (lastResult.mode === GameMode.Library ? 95 : activeLevel.minAccuracy);
    const qrData = `RELATÓRIO: ${currentUser.name}\nMODO: ${lastResult.mode}\nVELO: ${lastResult.wpm} PPM\nPREC: ${lastResult.accuracy}%`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] p-8 max-w-md w-full text-center shadow-2xl relative border-4 border-white flex flex-col gap-4">
                {showQR ? (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-slate-700 mb-4 fun-font">Relatório do Aluno</h3>
                        <div className="bg-white p-4 rounded-2xl shadow-inner border mb-6">
                            <QRCode size={200} value={qrData} />
                        </div>
                        <ClayButton onClick={() => setShowQR(false)} variant="secondary" className="w-full">Voltar</ClayButton>
                    </div>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-slate-800 fun-font">{isWin ? 'Incrível!' : 'Quase lá!'}</h2>
                        <div className="flex justify-center gap-2 my-4">
                            {[1, 2, 3].map(s => <Star key={s} size={40} fill={s <= lastResult.stars ? "#FBBF24" : "#E2E8F0"} className={s <= lastResult.stars ? "text-yellow-400" : "text-slate-200"} />)}
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-4">
                            <div><p className="text-xs font-bold text-slate-400">PPM</p><p className="text-2xl font-bold">{lastResult.wpm}</p></div>
                            <div><p className="text-xs font-bold text-slate-400">PRECISÃO</p><p className="text-2xl font-bold">{lastResult.accuracy}%</p></div>
                        </div>
                        <div className="flex flex-col gap-2">
                             <ClayButton variant="primary" theme={currentUser.theme} onClick={() => setCurrentScreen(AppScreen.Dashboard)}>Sair</ClayButton>
                             <button onClick={() => setShowQR(true)} className="text-indigo-500 font-bold text-sm">Gerar QR Pro</button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
  };

  if (!currentUser) {
      if (currentScreen === AppScreen.ParentDashboard) {
          return <ParentDashboard users={Object.values(appState.users)} appState={appState} onBack={() => setCurrentScreen(AppScreen.UserSelect)} onDeleteUser={handleDeleteUser} onAddCustomLesson={(l) => setAppState(prev => ({...prev, customLessons: [...prev.customLessons, l]}))} onDeleteCustomLesson={(id) => setAppState(prev => ({...prev, customLessons: prev.customLessons.filter(l => l.id !== id)}))} onImportData={(d) => setAppState(d)} onUpdateUser={updateUser} />;
      }
      return <UserSelectScreen users={Object.values(appState.users)} onSelectUser={handleSelectUser} onCreateUser={handleCreateUser} onOpenParentDashboard={() => setCurrentScreen(AppScreen.ParentDashboard)} />;
  }

  return (
    <div className="font-sans text-slate-800 min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <ScreenRestriction />
      <div className="flex-grow">
          {currentScreen === AppScreen.Dashboard && (
              <LevelSelector 
                levels={LEVELS} unlockedLevels={currentUser.unlockedLevels} customLessons={appState.customLessons} gameState={currentUser} 
                onSelectLevel={handleStartLevel} onSelectTimedMode={() => {}} onSelectErrorMode={() => {}} onSelectStoryMode={() => {}} onSelectDictationMode={() => {}} onSelectCustomLesson={() => {}} 
                onOpenLibrary={() => setCurrentScreen(AppScreen.Library)} onViewStats={() => setCurrentScreen(AppScreen.Stats)} onChangeAvatar={() => {}} onShowHandGuide={() => setShowHandGuide(true)} onToggleBlindMode={() => {}} onToggleSound={(val) => updateUser(currentUser.id, {soundEnabled: val})} isBlindMode={false}
              />
          )}
          {currentScreen === AppScreen.Library && <LibraryScreen theme={currentUser.theme} onSelectText={handleStartLibraryText} onBack={() => setCurrentScreen(AppScreen.Dashboard)} />}
          {currentScreen === AppScreen.Exercise && <TypingArea level={activeLevel} mode={activeMode} theme={currentUser.theme} layout={currentUser.layout} soundEnabled={currentUser.soundEnabled} onComplete={handleLevelComplete} onExit={() => setCurrentScreen(AppScreen.Dashboard)} />}
          {currentScreen === AppScreen.Result && renderResultScreen()}
          {currentScreen === AppScreen.Stats && <StatsBoard user={currentUser} history={currentUser.history} unlockedLevels={currentUser.unlockedLevels} levels={LEVELS} achievements={currentUser.achievements} theme={currentUser.theme} onBack={() => setCurrentScreen(AppScreen.Dashboard)} onViewAchievements={() => setCurrentScreen(AppScreen.Achievements)} />}
          {currentScreen === AppScreen.Achievements && <AchievementsScreen unlockedIds={currentUser.achievements} onBack={() => setCurrentScreen(AppScreen.Stats)} />}
      </div>
      <footer className="p-6 text-center text-slate-400 text-xs font-bold">
          Feito com <Heart size={12} className="inline text-red-400" /> para Portugal e Angola.
      </footer>
      <HandGuideModal isOpen={showHandGuide} onClose={() => setShowHandGuide(false)} theme={currentUser.theme} />
      <PrivacyModal 
          isOpen={showPrivacyModal} 
          onClose={() => setShowPrivacyModal(false)} 
          onClearData={handleClearData} 
          theme={currentUser.theme} 
      />
      <CookieBanner 
          onOpenPolicy={() => setShowPrivacyModal(true)} 
          theme={currentUser.theme} 
      />
    </div>
  );
};

export default App;
