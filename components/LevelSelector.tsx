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

const LevelSelector: React.FC<LevelSelectorProps> = ({ 
    levels, unlockedLevels, onSelectLevel, onSelectTimedMode, onSelectErrorMode, onViewStats 
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-blue-200 py-10 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold text-blue-900 mb-2 fun-font text-shadow-sm"
        >
            Teclado Mágico
        </motion.h1>
        <p className="text-xl text-blue-700 mb-12 font-medium">A tua aventura de digitação começa aqui!</p>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Sidebar Actions */}
            <div className="w-full lg:w-1/4 flex flex-col gap-4">
                 <div className="bg-white/80 p-6 rounded-2xl shadow-lg backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 fun-font">Modos Especiais</h3>
                    
                    <button 
                        onClick={() => onSelectTimedMode(60)}
                        className="w-full mb-3 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                        <Clock size={20} /> Desafio 60s
                    </button>
                    
                     <button 
                        onClick={() => onSelectTimedMode(30)}
                        className="w-full mb-3 bg-orange-400 hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl shadow flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                        <Clock size={20} /> Desafio 30s
                    </button>

                    <button 
                        onClick={onSelectErrorMode}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow flex items-center justify-center gap-2 transition-transform hover:scale-105"
                    >
                        <AlertCircle size={20} /> Treinar Erros
                    </button>
                 </div>

                 <button 
                    onClick={onViewStats}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white text-lg font-bold py-4 px-8 rounded-2xl shadow-lg transform transition hover:-translate-y-1"
                >
                    Ver o Meu Progresso
                </button>
            </div>

            {/* Main Campaign Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {levels.map((level, index) => {
                    const isUnlocked = unlockedLevels.includes(level.id);
                    
                    return (
                        <motion.button
                            key={level.id}
                            whileHover={isUnlocked ? { scale: 1.05, rotate: 1 } : {}}
                            whileTap={isUnlocked ? { scale: 0.95 } : {}}
                            onClick={() => isUnlocked ? onSelectLevel(level) : null}
                            className={`
                                relative p-6 rounded-3xl text-left border-b-8 transition-all duration-200 h-full flex flex-col justify-between min-h-[200px]
                                ${isUnlocked 
                                    ? 'bg-white border-blue-200 shadow-xl cursor-pointer hover:border-blue-300' 
                                    : 'bg-gray-200 border-gray-300 opacity-70 cursor-not-allowed grayscale'}
                            `}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`
                                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                                        ${isUnlocked ? 'bg-blue-100 text-blue-600' : 'bg-gray-300 text-gray-500'}
                                    `}>
                                        {level.id}
                                    </span>
                                    {isUnlocked ? (
                                        <PlayCircle className="text-green-500" size={32} />
                                    ) : (
                                        <Lock className="text-gray-400" size={24} />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">{level.title}</h3>
                                <p className="text-sm text-gray-500">{level.description}</p>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex gap-1 flex-wrap">
                                    {level.newKeys.map(k => (
                                        <span key={k} className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase text-gray-600 border border-gray-200">
                                            {k === ' ' ? 'espaço' : k.replace('Shift', '⇧')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector;
