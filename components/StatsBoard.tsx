import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionResult, Level } from '../types';
import { Star, Trophy, Target, Zap } from 'lucide-react';

interface StatsBoardProps {
  history: SessionResult[];
  unlockedLevels: number[];
  levels: Level[];
  onBack: () => void;
}

const StatsBoard: React.FC<StatsBoardProps> = ({ history, unlockedLevels, levels, onBack }) => {
  // Process data for charts
  const data = history.map((h, idx) => ({
    name: `Sessão ${idx + 1}`,
    wpm: h.wpm,
    accuracy: h.accuracy
  })).slice(-10); // Last 10 sessions

  const totalStars = history.reduce((acc, curr) => acc + curr.stars, 0);
  const maxWpm = history.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);
  const avgAccuracy = Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / (history.length || 1));

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-indigo-900 fun-font">O Teu Progresso</h1>
            <button onClick={onBack} className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold shadow hover:bg-indigo-50">
                Voltar
            </button>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-400 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center">
                <Star size={40} className="mb-2" fill="white" />
                <span className="text-3xl font-bold">{totalStars}</span>
                <span className="opacity-90 font-semibold">Estrelas</span>
            </div>
             <div className="bg-purple-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center">
                <Trophy size={40} className="mb-2" />
                <span className="text-3xl font-bold">{unlockedLevels.length} / {levels.length}</span>
                <span className="opacity-90 font-semibold">Níveis</span>
            </div>
             <div className="bg-blue-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center">
                <Zap size={40} className="mb-2" />
                <span className="text-3xl font-bold">{maxWpm}</span>
                <span className="opacity-90 font-semibold">Velocidade Máxima</span>
            </div>
             <div className="bg-emerald-500 rounded-2xl p-6 text-white shadow-lg flex flex-col items-center">
                <Target size={40} className="mb-2" />
                <span className="text-3xl font-bold">{avgAccuracy}%</span>
                <span className="opacity-90 font-semibold">Precisão Média</span>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
