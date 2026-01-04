
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SessionResult, Level, Theme, UserProfile } from '../types';
import { Star, Trophy, Target, Zap, Medal, ArrowRight, RotateCcw, FileBadge } from 'lucide-react';
import { ACHIEVEMENTS, THEME_COLORS } from '../constants';
import { ClayButton } from './ClayButton';
import { motion } from 'framer-motion';
// @ts-ignore - Importing from CDN defined in index.html importmap
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

  /**
   * GENERATE PDF CERTIFICATE (Client-Side)
   * Premium Design Implementation
   */
  const handleDownloadDiploma = () => {
      const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
      });

      const width = 297;
      const height = 210;
      const centerX = width / 2;

      // --- 1. Background Paper Texture (Cream) ---
      doc.setFillColor(252, 250, 242); 
      doc.rect(0, 0, width, height, 'F');

      // --- 2. Ornate Border Simulation ---
      // We simulate a guilloche pattern/complex frame using multiple nested strokes
      
      // Outer dark grey line
      doc.setDrawColor(80, 80, 80);
      doc.setLineWidth(0.5);
      doc.rect(8, 8, width - 16, height - 16);

      // Thick patterned frame (simulated with light grey fill and stroke)
      doc.setFillColor(230, 230, 230); // Light grey background for border
      doc.setDrawColor(160, 160, 160); // Darker grey for edge
      doc.setLineWidth(0.2);
      
      // Draw a "thick" frame by filling the space between two rectangles
      // Note: jsPDF doesn't support even-odd fill easily, so we just draw the thick band
      // Top Band
      doc.rect(10, 10, width - 20, 15, 'F'); // Top
      doc.rect(10, height - 25, width - 20, 15, 'F'); // Bottom
      doc.rect(10, 10, 15, height - 20, 'F'); // Left
      doc.rect(width - 25, 10, 15, height - 20, 'F'); // Right
      
      // Detailed inner lines to create "texture" in the border
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.5);
      doc.rect(12, 12, width - 24, height - 24);
      doc.rect(14, 14, width - 28, height - 28);
      
      // Inner thin gold accent line
      doc.setDrawColor(218, 165, 32); // Goldenrod
      doc.setLineWidth(1);
      doc.rect(20, 20, width - 40, height - 40);

      // --- 3. Header Typography ---
      
      // "DIPLOMA DE EXCELÊNCIA"
      doc.setFont("times", "bold");
      doc.setFontSize(36);
      doc.setTextColor(40, 40, 40); // Dark Charcoal
      doc.text("DIPLOMA DE MÉRITO", centerX, 55, { align: "center" });

      // "Teclado Mágico" (Institution Name)
      doc.setFont("times", "italic");
      doc.setFontSize(20);
      doc.setTextColor(80, 80, 80);
      doc.text("Teclado Mágico", centerX, 68, { align: "center" });

      // --- 4. Body Text ---
      doc.setFont("times", "normal");
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100); // Slate Grey
      doc.text("Certifica-se que", centerX, 85, { align: "center" });

      // "has successfully completed..." text localized
      doc.text("concluiu com sucesso e demonstrou excelente desempenho em", centerX, 92, { align: "center" });
      doc.setFont("times", "italic");
      doc.text("Digitação e Literacia Digital", centerX, 99, { align: "center" });

      // --- 5. Student Name (Centerpiece) ---
      // Simulating a script/handwritten font using Bold Italic Times
      doc.setFont("times", "bold italic"); 
      doc.setFontSize(48);
      doc.setTextColor(20, 20, 20); // Almost Black
      const name = user.name;
      doc.text(name, centerX, 120, { align: "center" });

      // Underline for name
      doc.setLineWidth(0.5);
      doc.setDrawColor(50, 50, 50);
      const nameWidth = doc.getTextWidth(name);
      // Make line at least 100mm wide, or name width + padding
      const lineWidth = Math.max(100, nameWidth + 20);
      doc.line(centerX - (lineWidth / 2), 123, centerX + (lineWidth / 2), 123);

      // --- 6. Stats & Details ---
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      const levelTitle = levels.find(l => l.id === user.currentLevelId)?.title || "Nível Avançado";
      const statsText = `Nível ${user.currentLevelId}: ${levelTitle}  •  Velocidade Máx: ${maxWpm} PPM  •  Precisão: ${avgAccuracy}%`;
      doc.text(statsText, centerX, 135, { align: "center" });

      // --- 7. Gold Seal (Bottom Left) ---
      const sealX = 60;
      const sealY = 165;
      
      // Ribbons (Triangles)
      doc.setFillColor(184, 134, 11); // Dark Goldenrod
      // Left ribbon tail
      doc.triangle(sealX - 10, sealY + 10, sealX - 20, sealY + 35, sealX, sealY + 25, 'F');
      // Right ribbon tail
      doc.triangle(sealX + 10, sealY + 10, sealX + 20, sealY + 35, sealX, sealY + 25, 'F');

      // Seal Starburst Edge
      doc.setFillColor(218, 165, 32); // Gold
      const outerRadius = 22;
      const innerRadius = 18;
      
      // Draw jagged circle manually
      // We can approximate visually with a filled circle for simplicity if path is too complex, 
      // but let's try a simple circle with a border for robustness in client-side generation
      doc.circle(sealX, sealY, outerRadius, 'F');
      
      // Inner Circle (Embossed look)
      doc.setDrawColor(255, 255, 210); // Light Gold
      doc.setLineWidth(0.5);
      doc.circle(sealX, sealY, innerRadius, 'S');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("TECLADO", sealX, sealY - 5, { align: "center" });
      doc.text("MÁGICO", sealX, sealY, { align: "center" });
      doc.setFontSize(6);
      doc.text("CERTIFICADO", sealX, sealY + 6, { align: "center" });

      // --- 8. Signatures & Date (Bottom Right & Center) ---
      const today = new Date().toLocaleDateString('pt-PT');
      const sigY = 175;
      
      // Date (Left-Center)
      const dateX = centerX - 40;
      doc.setDrawColor(50, 50, 50);
      doc.setLineWidth(0.3);
      doc.line(dateX - 25, sigY, dateX + 25, sigY);
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50);
      doc.text(today, dateX, sigY - 2, { align: "center" });
      doc.setFontSize(10);
      doc.text("Data", dateX, sigY + 5, { align: "center" });

      // Signature (Right)
      const sigX = width - 70;
      doc.line(sigX - 40, sigY, sigX + 40, sigY);
      
      // Simulated Signature using a different font style if possible, or just Italic
      doc.setFont("times", "italic");
      doc.setFontSize(16);
      doc.setTextColor(20, 20, 80); // Dark Blue ink color
      doc.text("Prof. Cláudio Gonçalves", sigX, sigY - 2, { align: "center" });
      
      doc.setFont("times", "normal");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text("Assinatura Autorizada", sigX, sigY + 5, { align: "center" });

      // Save
      doc.save(`Diploma_${user.name.replace(/ /g, '_')}_Premium.pdf`);
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
