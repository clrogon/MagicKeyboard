
import React from 'react';
import { ACHIEVEMENTS } from '../constants';
import { Star, Zap, Target, Calendar, Crown, Lock, ArrowLeft, Medal, Hash, CalendarCheck, ShieldCheck, Clock } from 'lucide-react';
import { ClayButton } from './ClayButton';
import { motion } from 'framer-motion';

// Map string names from constants to Lucide components
const IconMap: Record<string, React.ElementType> = {
    Star, Zap, Target, Calendar, Crown, Hash, CalendarCheck, ShieldCheck, Clock
};

interface AchievementsScreenProps {
    unlockedIds: string[];
    onBack: () => void;
}

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ unlockedIds, onBack }) => {
    // Calculate progress
    const unlockedCount = unlockedIds.length;
    const totalCount = ACHIEVEMENTS.length;
    const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

    return (
        <div className="min-h-screen p-4 md:p-8 relative z-10 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-6 mb-8 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-white">
                    <ClayButton variant="secondary" onClick={onBack} className="w-12 h-12 !rounded-full !p-0 flex items-center justify-center">
                        <ArrowLeft size={24} />
                    </ClayButton>
                    <h1 className="text-2xl md:text-4xl font-bold text-slate-700 fun-font flex items-center gap-3">
                        <Medal className="text-yellow-500 fill-yellow-400 drop-shadow-sm" size={36} />
                        Galeria de Conquistas
                    </h1>
                </div>

                {/* Progress Bar */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] shadow-sm border border-white mb-8"
                >
                    <div className="flex justify-between items-end mb-3">
                        <span className="text-slate-500 font-bold uppercase text-sm tracking-widest">O Teu Progresso</span>
                        <span className="text-rose-500 font-bold text-2xl">{unlockedCount} <span className="text-slate-300 text-lg">/ {totalCount}</span></span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden shadow-inner">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="bg-gradient-to-r from-rose-400 to-rose-500 h-full rounded-full shadow-[0_2px_4px_rgba(244,63,94,0.3)] relative"
                        >
                            <div className="absolute top-0 left-0 right-0 h-[40%] bg-white/30 rounded-t-full"></div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ACHIEVEMENTS.map((ach, index) => {
                        const isUnlocked = unlockedIds.includes(ach.id);
                        const IconComponent = IconMap[ach.icon] || Star;
                        
                        return (
                             <motion.div 
                                key={ach.id} 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`
                                    relative p-6 rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 border
                                    ${isUnlocked 
                                        ? `bg-white border-white shadow-[0px_10px_20px_rgba(0,0,0,0.05)] scale-100` 
                                        : 'bg-slate-50 border-transparent shadow-inner opacity-70 grayscale scale-95'}
                                `}
                            >
                                <div className={`
                                    w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-inner relative overflow-hidden
                                    ${isUnlocked ? ach.color : 'bg-slate-200'}
                                `}>
                                    {isUnlocked && <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 rounded-t-full pointer-events-none" />}
                                    <IconComponent size={40} className={`text-white ${isUnlocked ? 'drop-shadow-md' : ''}`} />
                                    {!isUnlocked && <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50"><Lock size={24} className="text-slate-400" /></div>}
                                </div>
                                
                                <h3 className={`text-xl font-bold mb-2 leading-tight ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>{ach.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{ach.description}</p>
                                
                                {isUnlocked && (
                                    <div className="mt-4 px-4 py-1.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-wide shadow-sm border border-yellow-200">
                                        Desbloqueado
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementsScreen;
