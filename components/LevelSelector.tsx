import React from 'react';
import { Level } from '../types';
import { Lock, Star, PlayCircle, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelSelectorProps {
  levels: Level[];
  unlockedLevels: number[];
  onSelectLevel: (level: Level) => void;
  onSelectTimedMode: (duration: number) => void;
  onSelectErrorMode: () => void;
  onViewStats: () => void;
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
    levels, unlockedLevels, onSelectLevel, onSelectTimedMode, onSelectErrorMode, onViewStats 
}) => {
  return (
    <div className="min-h-screen py-10 px-4">
      {/* Semi-transparent gradient overlay to blend with body pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50/80 via-white/50 to-purple-50/80 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto text-center">
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mb-2"
        >
            <h1 className="text-6xl md:text-7xl font-bold mb-2 fun-font tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-sm">
                    Teclado Mágico
                </span>
            </h1>
        </motion.div>
        
        <p className="text-xl text-slate-600 mb-12 font-medium">A tua aventura de digitação começa aqui!</p>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Actions */}
            <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-full lg:w-1/4 flex flex-col gap-4"
            >
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