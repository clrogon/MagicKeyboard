
import React from 'react';
import { Level, UserProfile, CustomLesson } from '../types';
import { ClayButton } from './ClayButton';
import { Lock, Play, Clock, AlertCircle, RefreshCw, Trophy, Shield, Crown, Eye, EyeOff, BookOpen, Volume2, VolumeX, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getXpForNextLevel, THEME_COLORS } from '../constants';

interface LevelSelectorProps {
  levels: Level[];
  unlockedLevels: number[];
  customLessons: CustomLesson[];
  gameState: UserProfile;
  onSelectLevel: (level: Level) => void;
  onSelectTimedMode: (duration: number) => void;
  onSelectErrorMode: () => void;
  onSelectStoryMode: () => void;
  onSelectCustomLesson: (lesson: CustomLesson) => void;
  onViewStats: () => void;
  onChangeAvatar: () => void;
  onShowHandGuide: () => void;
  onToggleBlindMode: (enabled: boolean) => void;
  onToggleSound: (enabled: boolean) => void; 
  isBlindMode: boolean;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ 
    levels, unlockedLevels, customLessons, gameState, onSelectLevel, onSelectTimedMode, onSelectErrorMode, onSelectStoryMode, onSelectCustomLesson, onViewStats, onChangeAvatar, onShowHandGuide, onToggleBlindMode, onToggleSound, isBlindMode
}) => {
  const { xp, playerLevel, currentTitle, currentAvatar, dailyChallenge, theme, soundEnabled } = gameState;
  
  const xpNeeded = getXpForNextLevel(playerLevel);
  const xpProgress = Math.min(100, (xp / xpNeeded) * 100);
  
  const colors = THEME_COLORS[theme];

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-sm border border-white mb-8 flex flex-col md:flex-row items-center justify-between gap-8"
        >
            <div className="flex items-center gap-6 w-full md:w-auto">
                <button onClick={onChangeAvatar} className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center text-5xl shadow-inner group-hover:scale-105 transition-transform">
                        {currentAvatar}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-sm text-indigo-500">
                        <RefreshCw size={14} />
                    </div>
                </button>
                
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`${colors.bgSoft} ${colors.text} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider`}>Lvl {playerLevel}</span>
                        <h2 className="text-2xl font-bold text-slate-800 fun-font">{currentTitle}</h2>
                    </div>
                    
                    <div className="w-full md:w-64 h-4 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 font-bold mt-1.5">
                        <span>{xp} XP</span>
                        <span>{xpNeeded} XP</span>
                    </div>
                </div>
            </div>

            {dailyChallenge && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl p-5 w-full md:w-80 relative overflow-hidden group border border-orange-200/50">
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-wide">
                            <Crown size={14} /> Desafio Diário
                        </div>
                        <span className="bg-white/80 text-orange-500 text-xs font-bold px-2 py-1 rounded-lg shadow-sm">
                            +{dailyChallenge.rewardXp} XP
                        </span>
                     </div>
                     <p className="text-slate-700 font-bold text-sm leading-tight mb-3">
                         {dailyChallenge.description}
                     </p>
                     <div className="w-full bg-orange-200/50 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="h-full bg-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (dailyChallenge.currentValue / dailyChallenge.targetValue) * 100)}%` }}
                        />
                     </div>
                </div>
            )}
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
            <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-80 flex flex-col gap-4 shrink-0"
            >
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50">
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 ml-2">Ajudas</h3>
                    
                    <ClayButton variant="secondary" onClick={onShowHandGuide} className="w-full py-4 mb-3 text-left justify-start px-6">
                        <div className="bg-indigo-100 p-2 rounded-xl text-indigo-500 mr-3"><Shield size={20} /></div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">Tutorial</div>
                            <div className="text-slate-700 font-bold">Como Pôr as Mãos?</div>
                        </div>
                    </ClayButton>

                    <ClayButton variant="secondary" onClick={onViewStats} className="w-full py-4 text-left justify-start px-6">
                        <div className="bg-yellow-100 p-2 rounded-xl text-yellow-500 mr-3"><Trophy size={20} /></div>
                        <div>
                            <div className="text-xs text-slate-400 font-bold uppercase">O Meu Diário</div>
                            <div className="text-slate-700 font-bold">O Meu Progresso</div>
                        </div>
                    </ClayButton>
                </div>
                
                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50">
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 ml-2">Desafios Especiais</h3>
                    
                    <ClayButton 
                        variant={isBlindMode ? "primary" : "secondary"} 
                        theme="rose"
                        onClick={() => onToggleBlindMode(!isBlindMode)} 
                        className="w-full py-4 mb-3 text-left justify-start px-6"
                    >
                        <div className={`p-2 rounded-xl mr-3 ${isBlindMode ? 'bg-rose-200 text-rose-600' : 'bg-slate-200 text-slate-500'}`}>
                            {isBlindMode ? <EyeOff size={20} /> : <Eye size={20} />}
                        </div>
                        <div>
                            <div className={`text-xs font-bold uppercase ${isBlindMode ? 'text-rose-200' : 'text-slate-400'}`}>Magia</div>
                            <div className={isBlindMode ? 'text-white' : 'text-slate-700'}>Teclas Invisíveis</div>
                        </div>
                    </ClayButton>

                     <ClayButton 
                        variant="secondary"
                        onClick={() => onToggleSound(!soundEnabled)} 
                        className="w-full py-4 text-left justify-start px-6"
                    >
                        <div className={`p-2 rounded-xl mr-3 ${soundEnabled ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-200 text-slate-500'}`}>
                            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase">Barulhos</div>
                            <div className="text-slate-700 font-bold">{soundEnabled ? 'Sons Ligados' : 'Sons Desligados'}</div>
                        </div>
                    </ClayButton>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50">
                    <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 ml-2">Mais Aventuras</h3>
                    <div className="space-y-3">
                        <ClayButton variant="primary" theme="amber" onClick={() => onSelectTimedMode(60)} className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 shadow-orange-200">
                            <Clock size={18} className="mr-2" /> Contra-Relógio
                        </ClayButton>
                        <ClayButton variant="primary" theme="rose" onClick={onSelectErrorMode} className="w-full py-3 bg-gradient-to-r from-red-400 to-red-500 shadow-red-200">
                            <AlertCircle size={18} className="mr-2" /> Treinar Dificuldades
                        </ClayButton>
                        <ClayButton variant="primary" theme="blue" onClick={onSelectStoryMode} className="w-full py-3 bg-gradient-to-r from-blue-400 to-indigo-500 shadow-blue-200">
                            <BookOpen size={18} className="mr-2" /> Contar Histórias
                        </ClayButton>
                    </div>
                </div>

                 {customLessons.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-md p-6 rounded-[2rem] border border-white/50">
                        <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-4 ml-2">Lições Personalizadas</h3>
                        <div className="space-y-3">
                            {customLessons.map(lesson => (
                                <ClayButton 
                                    key={lesson.id}
                                    variant="secondary" 
                                    onClick={() => onSelectCustomLesson(lesson)} 
                                    className="w-full py-3 text-left justify-start px-4"
                                >
                                    <Edit3 size={16} className="mr-2 text-indigo-500" />
                                    <span className="truncate">{lesson.title}</span>
                                </ClayButton>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            >
                {levels.map((level) => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    return (
                        <motion.button
                            key={level.id}
                            variants={itemVariants}
                            disabled={!isUnlocked}
                            onClick={() => onSelectLevel(level)}
                            className={`
                                relative p-6 rounded-[2rem] text-left transition-all duration-200 flex flex-col justify-between h-48 group
                                ${isUnlocked 
                                    ? 'bg-white hover:shadow-xl hover:-translate-y-1 cursor-pointer border-b-4 border-slate-100' 
                                    : 'bg-slate-100 opacity-60 cursor-not-allowed shadow-none'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm
                                    ${isUnlocked ? `${colors.bgSoft} ${colors.text}` : 'bg-slate-200 text-slate-400'}
                                `}>
                                    {level.id}
                                </div>
                                {isUnlocked ? (
                                    <div className="bg-emerald-100 text-emerald-500 p-2 rounded-full transform group-hover:scale-110 transition">
                                        <Play size={24} fill="currentColor" />
                                    </div>
                                ) : (
                                    <Lock className="text-slate-300" size={24} />
                                )}
                            </div>
                            
                            <div>
                                <h3 className="text-xl font-bold text-slate-700 mb-1 fun-font">{level.title}</h3>
                                <p className="text-sm text-slate-400 font-bold">{level.description}</p>
                            </div>

                            <div className="absolute top-6 left-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {level.newKeys.slice(0, 5).map(k => (
                                    <span key={k} className="bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">
                                        {k === ' ' ? '␣' : k.replace('Shift', '⇧')}
                                    </span>
                                ))}
                                {level.newKeys.length > 5 && <span className="text-[10px] text-slate-400 font-bold">...</span>}
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
