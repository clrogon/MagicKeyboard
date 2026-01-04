
import React from 'react';
import { UserProfile } from '../types';
import { ClayButton } from './ClayButton';
import { ArrowLeft, Trash2, Clock, Trophy, Target, Calendar } from 'lucide-react';
import { THEME_COLORS } from '../constants';

interface ParentDashboardProps {
  users: UserProfile[];
  onBack: () => void;
  onDeleteUser: (userId: string) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ users, onBack, onDeleteUser }) => {
  
  // Calculate Aggregated Stats
  const totalPlayTimeSeconds = users.reduce((acc, user) => {
      const userSeconds = user.history.reduce((hAcc, session) => hAcc + (session.duration || 0), 0) * 60;
      return acc + userSeconds;
  }, 0);
  const totalPlayTimeHours = (totalPlayTimeSeconds / 3600).toFixed(1);

  const totalSessions = users.reduce((acc, user) => acc + user.history.length, 0);

  const formatDate = (dateStr: string) => {
      if (!dateStr) return 'Nunca';
      return new Date(dateStr).toLocaleDateString('pt-PT');
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <ClayButton variant="secondary" onClick={onBack} className="w-12 h-12 !rounded-full !p-0 flex items-center justify-center">
                <ArrowLeft size={24} />
            </ClayButton>
            <div>
                <h1 className="text-3xl font-bold text-slate-700 fun-font">Área de Pais e Professores</h1>
                <p className="text-slate-500">Gestão de perfis e acompanhamento de progresso</p>
            </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-500">
                     <Clock size={32} />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-700">{totalPlayTimeHours}h</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tempo Total Jogado</div>
                 </div>
             </div>
             
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-500">
                     <Target size={32} />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-700">{totalSessions}</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sessões Completas</div>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
                 <div className="bg-rose-100 p-4 rounded-2xl text-rose-500">
                     <Trophy size={32} />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-700">{users.length}</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Alunos Ativos</div>
                 </div>
             </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-6 font-bold text-slate-400 text-sm uppercase tracking-wider">Aluno</th>
                            <th className="p-6 font-bold text-slate-400 text-sm uppercase tracking-wider">Nível</th>
                            <th className="p-6 font-bold text-slate-400 text-sm uppercase tracking-wider">Melhor PPM</th>
                            <th className="p-6 font-bold text-slate-400 text-sm uppercase tracking-wider">Último Treino</th>
                            <th className="p-6 font-bold text-slate-400 text-sm uppercase tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((user) => {
                            const maxWpm = user.history.reduce((max, h) => Math.max(max, h.wpm), 0);
                            const lastPlayed = user.history.length > 0 ? user.history[user.history.length - 1].date : '';
                            const colors = THEME_COLORS[user.theme];

                            return (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${colors.gradient} text-white shadow-sm`}>
                                                {user.currentAvatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-700 text-lg">{user.name}</div>
                                                <div className="text-xs text-slate-400 font-bold">{user.currentTitle}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-sm">Lvl {user.playerLevel}</span>
                                    </td>
                                    <td className="p-6 font-bold text-slate-600">
                                        {maxWpm > 0 ? `${maxWpm} PPM` : '-'}
                                    </td>
                                    <td className="p-6 text-slate-500 font-medium">
                                        {lastPlayed ? (
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} /> {formatDate(lastPlayed)}
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">Nunca</span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button 
                                            onClick={() => onDeleteUser(user.id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                            title="Apagar Utilizador"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-slate-400 font-medium">
                                    Ainda não existem jogadores registados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
