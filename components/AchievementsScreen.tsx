import React from 'react';
import { ACHIEVEMENTS } from '../constants';
import { Star, Zap, Target, Calendar, Crown, Lock, ArrowLeft, Medal } from 'lucide-react';

// Map string names from constants to Lucide components
const IconMap: Record<string, React.ElementType> = {
    Star, Zap, Target, Calendar, Crown
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
        <div className="min-h-screen bg-indigo-50 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={onBack} 
                        className="p-3 rounded-full bg-white text-indigo-600 hover:bg-indigo-100 shadow-sm transition-transform hover:scale-105"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 fun-font flex items-center gap-3">
                        <Medal className="text-yellow-500" size={36} />
                        Galeria de Conquistas
                    </h1>
                </div>

                {/* Progress Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-gray-600 font-bold uppercase text-sm tracking-wider">O Teu Progresso</span>
                        <span className="text-indigo-600 font-bold text-xl">{unlockedCount}/{totalCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = unlockedIds.includes(ach.id);
                        const IconComponent = IconMap[ach.icon] || Star;
                        
                        return (
                             <div 
                                key={ach.id} 
                                className={`
                                    relative p-6 rounded-2xl flex flex-col items-center text-center border-4 transition-all duration-300
                                    ${isUnlocked 
                                        ? `bg-white border-yellow-400 shadow-lg scale-100` 
                                        : 'bg-gray-100 border-gray-200 opacity-60 grayscale scale-95'}
                                `}
                            >
                                <div className={`
                                    w-20 h-20 rounded-full flex items-center justify-center mb-4 text-white shadow-inner
                                    ${isUnlocked ? ach.color : 'bg-gray-400'}
                                `}>
                                    {isUnlocked ? <IconComponent size={40} /> : <Lock size={32} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{ach.title}</h3>
                                <p className="text-sm text-gray-500 font-medium leading-snug">{ach.description}</p>
                                
                                {isUnlocked && (
                                    <div className="mt-4 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase tracking-wide animate-pulse">
                                        Desbloqueado
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AchievementsScreen;