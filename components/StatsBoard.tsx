import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionResult, Level } from '../types';
import { Star, Trophy, Target, Zap, Medal, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';

interface StatsBoardProps {
  history: SessionResult[];
  unlockedLevels: number[];
  levels: Level[];
  achievements: string[];
  onBack: () => void;
}

const StatsBoard: React.FC<StatsBoardProps> = ({ history, unlockedLevels, levels, achievements, onBack }) => {
  // Process data for charts
  const data = history.map((h, idx) => ({
    name: `Sessão ${idx + 1}`,
    wpm: h.wpm,
    accuracy: h.accuracy
  })).slice(-15); // Last 15 sessions

  const totalStars = history.reduce((acc, curr) => acc + curr.stars, 0);
  const maxWpm = history.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);
  const avgAccuracy = Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / (history.length || 1));

  return (
    <div className="min-h-screen bg-indigo-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 fun-font">O Teu Progresso</h1>
            <button onClick={onBack} className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow hover:bg-indigo-50">
                Voltar
            </button>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-400 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center transform hover:scale-105 transition">
                <Star size={40} className="mb-2" fill="white" />
                <span className="text-3xl font-bold">{totalStars}</span>
                <span className="opacity-90 font-semibold">Estrelas</span>
            </div>
             <div className="bg-purple-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center transform hover:scale-105 transition">
                <Trophy size={40} className="mb-2" />
                <span className="text-3xl font-bold">{unlockedLevels.length} / {levels.length}</span>
                <span className="opacity-90 font-semibold">Níveis</span>
            </div>
             <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center transform hover:scale-105 transition">
                <Zap size={40} className="mb-2" />
                <span className="text-3xl font-bold">{maxWpm}</span>
                <span className="opacity-90 font-semibold">Velocidade Máx.</span>
            </div>
             <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center transform hover:scale-105 transition">
                <Target size={40} className="mb-2" />
                <span className="text-3xl font-bold">{avgAccuracy}%</span>
                <span className="opacity-90 font-semibold">Precisão Média</span>
            </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-indigo-900 mb-4 fun-font flex items-center gap-2">
                <Medal className="text-yellow-500" /> Conquistas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {ACHIEVEMENTS.map(ach => {
                    const isUnlocked = achievements.includes(ach.id);
                    return (
                        <div 
                            key={ach.id} 
                            className={`
                                relative p-4 rounded-xl flex flex-col items-center text-center border-2 transition-all
                                ${isUnlocked 
                                    ? `bg-white border-yellow-400 shadow-md` 
                                    : 'bg-gray-100 border-gray-200 opacity-60 grayscale'}
                            `}
                        >
                            <div className={`
                                w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white
                                ${isUnlocked ? ach.color : 'bg-gray-400'}
                            `}>
                                {isUnlocked ? <Medal size={24} /> : <Lock size={20} />}
                            </div>
                            <div className="font-bold text-gray-800 text-sm">{ach.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{ach.description}</div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Velocidade (Palavras por minuto)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" hide />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-4">Precisão (%)</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;