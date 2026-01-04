
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SessionResult, Level, Theme, UserProfile } from '../types';
import { Star, Trophy, Target, Zap, Medal, ArrowRight, RotateCcw, FileBadge } from 'lucide-react';
import { ACHIEVEMENTS, THEME_COLORS } from '../constants';
import { ClayButton } from './ClayButton';
import { motion } from 'framer-motion';
// @ts-ignore - Importing from CDN
import { jsPDF } from 'jspdf';

interface StatsBoardProps {
  user: UserProfile;
  history: SessionResult[];
  unlockedLevels: number[];
  levels: Level[];
  achievements: string[];
  theme: Theme;
  onBack: () => void;
  onViewAchievements: () => void;
}

/**
 * StatsBoard Component
 * 
 * Displays the user's progress using Charts and KPI cards.
 * Uses 'recharts' for data visualization.
 */
const StatsBoard: React.FC<StatsBoardProps> = ({ user, history, unlockedLevels, levels, achievements, theme, onBack, onViewAchievements }) => {
  const colors = THEME_COLORS[theme];

  // Transform history data for the Line Chart
  // Limits to last 15 sessions to prevent overcrowding
  const data = history.map((h, idx) => ({
    name: `Sessão ${idx + 1}`,
    wpm: h.wpm,
    accuracy: h.accuracy,
    // Add compatibility for old sessions where consistency might be undefined
    consistency: h.consistency || 100 
  })).slice(-15);

  // Aggregate Stats
  const totalStars = history.reduce((acc, curr) => acc + curr.stars, 0);
  const maxWpm = history.reduce((acc, curr) => Math.max(acc, curr.wpm), 0);
  const avgAccuracy = Math.round(history.reduce((acc, curr) => acc + curr.accuracy, 0) / (history.length || 1));
  const unlockedAchievementsCount = achievements.length;
  const totalAchievementsCount = ACHIEVEMENTS.length;

  const cardStyle = "bg-white/80 backdrop-blur-sm rounded-[2rem] p-6 shadow-[0px_10px_20px_rgba(0,0,0,0.05)] border border-white flex flex-col items-center justify-center transition-transform hover:scale-105";

  // Chart line color depends on theme
  const mainLineColor = theme === 'blue' ? '#3b82f6' : theme === 'amber' ? '#f59e0b' : '#f43f5e';

  // GENERATE PDF CERTIFICATE (Client-Side)
  const handleDownloadDiploma = () => {
      const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
      });

      // Background Border
      doc.setLineWidth(3);
      doc.setDrawColor(244, 63, 94); // Rose-500
      doc.rect(10, 10, 277, 190);
      
      doc.setLineWidth(1);
      doc.setDrawColor(253, 164, 175); // Rose-300
      doc.rect(15, 15, 267, 180);

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.setTextColor(51, 65, 85); // Slate-700
      doc.text("DIPLOMA", 148.5, 50, { align: "center" });

      doc.setFontSize(20);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Certificamos que", 148.5, 70, { align: "center" });

      // Name
      doc.setFontSize(50);
      doc.setTextColor(244, 63, 94); // Rose-500
      doc.text(user.name, 148.5, 95, { align: "center" });

      // Achievement
      doc.setFontSize(16);
      doc.setTextColor(51, 65, 85);
      doc.text(`Completou o Nivel ${user.currentLevelId}`, 148.5, 120, { align: "center" });
      doc.text(`Titulo: ${user.currentTitle}`, 148.5, 130, { align: "center" });
      
      // Stats
      doc.setFontSize(12);
      doc.setTextColor(148, 163, 184);
      doc.text(`Total de Estrelas: ${totalStars} | Melhor Rapidez: ${maxWpm} PPM`, 148.5, 145, { align: "center" });

      // Footer
      const today = new Date().toLocaleDateString('pt-PT');
      doc.setFontSize(12);
      doc.setTextColor(51, 65, 85);
      doc.text(`Data: ${today}`, 50, 170, { align: "center" });
      doc.text("Teclado Magico", 240, 170, { align: "center" });

      // Save
      doc.save(`Diploma_${user.name}.pdf`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 bg-white/60 backdrop-blur-md p-4 rounded-[2rem] border border-white">
            <h1 className="text-2xl md:text-4xl font-bold text-slate-700 fun-font px-4">O Teu Progresso</h1>
            <ClayButton variant="secondary" onClick={onBack} className="px-6 py-2">
                <RotateCcw size={18} className="mr-2" /> Voltar
            </ClayButton>
        </div>

        {/* Hero Stats KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className={cardStyle}
            >
                <div className="bg-yellow-100 p-3 rounded-full mb-2 shadow-inner">
                    <Star size={32} className="text-yellow-500 fill-yellow-500" />
                </div>
                <span className="text-4xl font-bold text-slate-700">{totalStars}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estrelas</span>
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className={cardStyle}
            >
                <div className="bg-purple-100 p-3 rounded-full mb-2 shadow-inner">
                    <Trophy size={32} className="text-purple-500 fill-purple-500" />
                </div>
                <span className="text-4xl font-bold text-slate-700">{unlockedLevels.length} <span className="text-xl text-slate-400">/ {levels.length}</span></span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Níveis</span>
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className={cardStyle}
            >
                <div className={`${colors.iconBg} p-3 rounded-full mb-2 shadow-inner`}>
                    <Zap size={32} className={`${colors.text} fill-current`} />
                </div>
                <span className="text-4xl font-bold text-slate-700">{maxWpm}</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Máxima Rapidez</span>
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className={cardStyle}
            >
                <div className="bg-emerald-100 p-3 rounded-full mb-2 shadow-inner">
                    <Target size={32} className="text-emerald-500 fill-emerald-500" />
                </div>
                <span className="text-4xl font-bold text-slate-700">{avgAccuracy}%</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Acertos</span>
            </motion.div>
        </div>

        {/* Achievements Summary Banner */}
        <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className={`bg-gradient-to-r ${theme === 'blue' ? 'from-sky-500 to-blue-600' : theme === 'amber' ? 'from-amber-400 to-orange-500' : 'from-violet-500 to-fuchsia-500'} rounded-[2.5rem] p-8 text-white shadow-[0px_10px_20px_rgba(0,0,0,0.1)] mb-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden`}
        >
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-center gap-6 relative z-10">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
                    <Medal size={40} className="text-yellow-300" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-1 fun-font">As Tuas Conquistas</h2>
                    <p className="text-white/80 text-lg">
                        Já desbloqueaste <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-lg">{unlockedAchievementsCount}</span> de <span className="font-bold text-white">{totalAchievementsCount}</span> medalhas!
                    </p>
                </div>
            </div>
            
            <div className="flex gap-4 shrink-0 relative z-10">
                <ClayButton variant="secondary" onClick={handleDownloadDiploma} className="px-6 py-4 shadow-lg">
                    <FileBadge size={20} className="mr-2" /> Diploma
                </ClayButton>
                <ClayButton variant="secondary" onClick={onViewAchievements} className="px-6 py-4 shadow-lg">
                    Ver Coleção <ArrowRight size={20} className="ml-2" />
                </ClayButton>
            </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* WPM Chart */}
            <motion.div 
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-sm border border-white"
            >
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${colors.bg}`}></div>
                    Velocidade (PPM)
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" hide />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="wpm" 
                                stroke={mainLineColor}
                                strokeWidth={4} 
                                dot={{r: 4, fill: mainLineColor, strokeWidth: 2, stroke: '#fff'}}
                                activeDot={{ r: 6, fill: mainLineColor }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
            
            {/* Accuracy Chart */}
             <motion.div 
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] shadow-sm border border-white"
            >
                <h3 className="text-lg font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     Precisão (%)
                </h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" hide />
                            <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 2 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="accuracy" 
                                stroke="#10b981" 
                                strokeWidth={4} 
                                dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}}
                                activeDot={{ r: 6, fill: '#10b981' }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;
