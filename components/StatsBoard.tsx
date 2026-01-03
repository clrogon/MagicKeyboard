import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionResult, Level } from '../types';
import { Star, Trophy, Target, Zap, Medal, ArrowRight } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';

interface StatsBoardProps {
  history: SessionResult[];
  unlockedLevels: number[];
  levels: Level[];
  achievements: string[];
  onBack: () => void;
  onViewAchievements: () => void;
}

const StatsBoard: React.FC<StatsBoardProps> = ({ history, unlockedLevels, levels, achievements, onBack, onViewAchievements }) => {
  // Process data for charts
  const data = history.map((h, idx) => ({
    name: `Sessão ${idx + 1}`,
    wpm: h.wpm,
    accuracy: h.accuracy
  })).slice(-15); // Last 15 sessions

  const totalStars = history.reduce((acc, curr) => acc + curr.stars, 0);
  const maxWpm = history.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);
  const avgAccuracy = Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / (history.length || 1));
  const unlockedAchievementsCount = achievements.length;
  const totalAchievementsCount = ACHIEVEMENTS.length;

  return (
    <div className="min-h-screen bg-indigo-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 fun-font">O Teu Progresso</h1>
            <button onClick={onBack} className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow hover:bg-indigo-50 transition">
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

        {/* Achievements Summary Banner */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
                <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                    <Medal size={48} className="text-yellow-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-1">As Tuas Conquistas</h2>
                    <p className="text-purple-100 text-lg">
                        Já desbloqueaste <span className="font-bold text-white">{unlockedAchievementsCount}</span> de <span className="font-bold text-white">{totalAchievementsCount}</span> medalhas!
                    </p>
                </div>
            </div>
            <button 
                onClick={onViewAchievements}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold shadow-md hover:bg-gray-100 hover:scale-105 transition flex items-center gap-2 whitespace-nowrap"
            >
                Ver Coleção <ArrowRight size={20} />
            </button>
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