
import React from 'react';
import { Level, GameState, DailyChallenge } from '../types';
import { Lock, Star, PlayCircle, Clock, AlertCircle, Calendar, RefreshCw, Trophy, ChevronRight, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { getXpForNextLevel, PLAYER_TITLES, AVATARS } from '../constants';

interface LevelSelectorProps {
  levels: Level[];
  unlockedLevels: number[];
  gameState: GameState;
  onSelectLevel: (level: Level) => void;
  onSelectTimedMode: (duration: number) => void;
  onSelectErrorMode: () => void;
  onViewStats: () => void;
  onChangeAvatar: () => void;
  onShowHandGuide: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const LevelSelector: React.FC<LevelSelectorProps> = ({ 
    levels, unlockedLevels, gameState, onSelectLevel, onSelectTimedMode, onSelectErrorMode, onViewStats, onChangeAvatar, onShowHandGuide
}) => {
  const { xp, playerLevel, currentTitle, currentAvatar, dailyChallenge } = gameState;
  const xpNeeded = getXpForNextLevel(playerLevel);
  const xpProgress = Math.min(100, (xp / xpNeeded) * 100);

  return (
    <div className="min-h-screen py-10 px-4">
      {/* Semi-transparent gradient overlay to blend with body pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/80 via-white/50 to-purple-50/80 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/70 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white/50"
        >
            {/* Player Profile Section */}
            <div className="flex items-center gap-6 w-full md:w-auto">
                <button 
                    onClick={onChangeAvatar}
                    className="relative group"
                >
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-indigo-100 rounded-full flex items-center justify-center text-4xl md:text-5xl shadow-inner border-4 border-white group-hover:scale-105 transition-transform">
                        {currentAvatar}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-slate-100 group-hover:bg-indigo-50">
                        <RefreshCw size={14} className="text-indigo-600" />
                    </div>
                </button>
                
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Nível {playerLevel}</span>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 fun-font">{currentTitle}</h2>
                    </div>
                    
                    {/* XP Bar */}
                    <div className="w-full md:w-64 h-3 bg-slate-200 rounded-full overflow-hidden relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${xpProgress}%` }}
                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-bold mt-1">
                        <span>{xp} XP</span>
                        <span>{xpNeeded} XP</span>
                    </div>
                </div>
            </div>

            {/* Daily Challenge Card */}
            {dailyChallenge && (
                <div className="flex-1 w-full md:max-w-sm bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-4 border border-orange-100 relative overflow-hidden group">
                     {dailyChallenge.completed && (
                        <div className="absolute inset-0 bg-green-50/90 flex items-center justify-center z-10 backdrop-blur-[1px]">
                             <div className="flex items-center gap-2 text-green-600 font-bold text-lg animate-pulse">
                                 <Trophy size={24} className="fill-current" /> Desafio Concluído!
                             </div>
                        </div>
                     )}
                     
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-wide">
                            <Calendar size={16} /> Desafio Diário
                        </div>
                        <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-1 rounded-lg">
                            +{dailyChallenge.rewardXp} XP
                        </span>
                     </div>
                     <p className="text-slate-700 font-bold leading-tight mb-3">
                         {dailyChallenge.description}
                     </p>
                     
                     <div className="w-full bg-orange-200/50 rounded-full h-2 overflow-hidden">
                        <div 
                            className="h-full bg-orange-500 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, (dailyChallenge.currentValue / dailyChallenge.targetValue) * 100)}%` }}
                        />
                     </div>
                     <div className="text-right text-xs font-bold text-orange-400 mt-1">
                         {dailyChallenge.currentValue} / {dailyChallenge.targetValue}
                     </div>
                </div>
            )}
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Actions */}
            <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-1/4 flex flex-col gap-4"
            >
                {/* Hand Guide Button */}
                <button 
                    onClick={onShowHandGuide}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-3xl shadow-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 group mb-2"
                >
                    <Hand size={24} className="text-yellow-400 fill-current animate-bounce" />
                    <div className="text-left">
                        <div className="text-xs text-indigo-200 uppercase tracking-wider">Aprende Agora</div>
                        <div className="text-lg leading-none">Posição das Mãos</div>
                    </div>
                </button>

                 <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/50">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 fun-font uppercase tracking-wider">Modos Especiais</h3>
                    
                    <button 
                        onClick={() => onSelectTimedMode(60)}
                        className="w-full mb-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md border-b-4 border-orange-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Clock size={20} /> Desafio 60s
                    </button>
                    
                     <button 
                        onClick={() => onSelectTimedMode(30)}
                        className="w-full mb-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Clock size={20} /> Desafio 30s
                    </button>

                    <button 
                        onClick={onSelectErrorMode}
                        className="w-full bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-bold py-3 px-4 rounded-2xl shadow-md border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <AlertCircle size={20} /> Treinar Erros
                    </button>
                 </div>

                 <button 
                    onClick={onViewStats}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-lg font-bold py-4 px-8 rounded-3xl shadow-xl border-b-4 border-purple-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 group"
                >
                    <Star className="fill-current text-yellow-300 group-hover:rotate-45 transition-transform" />
                    O Meu Progresso
                </button>
            </motion.div>

            {/* Main Campaign Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full"
            >
                {levels.map((level, index) => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    
                    return (
                        <motion.button
                            key={level.id}
                            variants={itemVariants}
                            whileHover={isUnlocked ? { scale: 1.03, y: -5 } : {}}
                            whileTap={isUnlocked ? { scale: 0.98 } : {}}
                            onClick={() => isUnlocked ? onSelectLevel(level) : null}
                            className={`
                                relative p-6 rounded-3xl text-left border-b-8 transition-all duration-200 h-full flex flex-col justify-between min-h-[220px] backdrop-blur-sm
                                ${isUnlocked 
                                    ? 'bg-white/80 border-blue-200 shadow-xl cursor-pointer hover:border-blue-300 hover:shadow-2xl hover:bg-white' 
                                    : 'bg-slate-100/50 border-slate-200 opacity-60 cursor-not-allowed grayscale'}
                            `}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`
                                        w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner
                                        ${isUnlocked ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' : 'bg-gray-200 text-gray-400'}
                                    `}>
                                        {level.id}
                                    </div>
                                    {isUnlocked ? (
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <PlayCircle className="text-green-500" size={28} />
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 p-2 rounded-full">
                                            <Lock className="text-gray-400" size={20} />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight fun-font">{level.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{level.description}</p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
                                <div className="flex gap-1 flex-wrap">
                                    {level.newKeys.map(k => (
                                        <span key={k} className="px-2 py-1 bg-white rounded-lg text-xs font-bold uppercase text-slate-600 border border-slate-200 shadow-sm">
                                            {k === ' ' ? 'espaço' : k.replace('Shift', '⇧')}
                                        </span>
                                    ))}
                                </div>
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
