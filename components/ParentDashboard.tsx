
import React, { useState } from 'react';
import { AppState, UserProfile, CustomLesson } from '../types';
import { ClayButton } from './ClayButton';
import { ArrowLeft, Trash2, Clock, Trophy, Target, Calendar, Download, Upload, Plus, Edit3, BookOpen, Users, Save } from 'lucide-react';
import { THEME_COLORS } from '../constants';

interface ParentDashboardProps {
  users: UserProfile[];
  appState: AppState;
  onBack: () => void;
  onDeleteUser: (userId: string) => void;
  onAddCustomLesson: (lesson: CustomLesson) => void;
  onDeleteCustomLesson: (lessonId: string) => void;
  onImportData: (data: AppState) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ 
    users, appState, onBack, onDeleteUser, onAddCustomLesson, onDeleteCustomLesson, onImportData 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'lessons' | 'data'>('users');
  
  // Custom Lesson Form State
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(false);

  // Stats Logic
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

  // Export Data Logic (JSON)
  const handleExport = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "teclado_magico_backup.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  // Import Data Logic
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileReader = new FileReader();
      if (event.target.files && event.target.files.length > 0) {
          fileReader.readAsText(event.target.files[0], "UTF-8");
          fileReader.onload = (e) => {
              if (e.target?.result) {
                  try {
                      const parsed = JSON.parse(e.target.result as string);
                      if (parsed.users) {
                          onImportData(parsed);
                      } else {
                          alert("Ficheiro inválido.");
                      }
                  } catch (err) {
                      alert("Erro ao ler ficheiro.");
                  }
              }
          };
      }
  };

  const handleSaveLesson = (e: React.FormEvent) => {
      e.preventDefault();
      if (!lessonTitle || !lessonContent) return;
      
      const newLesson: CustomLesson = {
          id: Date.now().toString(),
          title: lessonTitle,
          description: lessonDesc || "Lição personalizada",
          content: lessonContent,
          createdAt: new Date().toISOString()
      };
      
      onAddCustomLesson(newLesson);
      setLessonTitle("");
      setLessonDesc("");
      setLessonContent("");
      setShowLessonForm(false);
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

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <button 
                onClick={() => setActiveTab('users')}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'users' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
                <Users size={18} /> Alunos
            </button>
            <button 
                onClick={() => setActiveTab('lessons')}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'lessons' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
                <BookOpen size={18} /> As Minhas Lições
            </button>
            <button 
                onClick={() => setActiveTab('data')}
                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${activeTab === 'data' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
            >
                <Save size={18} /> Dados & Backup
            </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden min-h-[400px] p-6">
            
            {activeTab === 'users' && (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="p-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Aluno</th>
                                <th className="p-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Nível</th>
                                <th className="p-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Melhor PPM</th>
                                <th className="p-4 font-bold text-slate-400 text-sm uppercase tracking-wider">Último Treino</th>
                                <th className="p-4 font-bold text-slate-400 text-sm uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => {
                                const maxWpm = user.history.reduce((max, h) => Math.max(max, h.wpm), 0);
                                const lastPlayed = user.history.length > 0 ? user.history[user.history.length - 1].date : '';
                                const colors = THEME_COLORS[user.theme];

                                return (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br ${colors.gradient} text-white shadow-sm`}>
                                                    {user.currentAvatar}
                                                </div>
                                                <div className="font-bold text-slate-700">{user.name}</div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold text-xs">Lvl {user.playerLevel}</span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-600">
                                            {maxWpm > 0 ? `${maxWpm} PPM` : '-'}
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm font-medium">
                                            {lastPlayed ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} /> {formatDate(lastPlayed)}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">Nunca</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => onDeleteUser(user.id)}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Apagar Utilizador"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'lessons' && (
                <div>
                     {!showLessonForm ? (
                         <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-slate-700">Lições Personalizadas</h3>
                                <ClayButton variant="primary" theme="amber" onClick={() => setShowLessonForm(true)} className="px-4 py-2">
                                    <Plus size={18} className="mr-2" /> Criar Lição
                                </ClayButton>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {appState.customLessons.length === 0 && (
                                    <div className="col-span-2 text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                                        <Edit3 size={40} className="mx-auto mb-2 opacity-50" />
                                        <p>Ainda não criaste nenhuma lição.</p>
                                        <p className="text-sm">Cria listas de palavras para trabalhos de casa!</p>
                                    </div>
                                )}
                                {appState.customLessons.map(lesson => (
                                    <div key={lesson.id} className="border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow relative group bg-stone-50">
                                         <h4 className="font-bold text-slate-700 mb-1">{lesson.title}</h4>
                                         <p className="text-xs text-slate-400 font-bold uppercase mb-2">{lesson.description}</p>
                                         <p className="text-sm text-slate-500 line-clamp-2 bg-white p-2 rounded-lg border border-slate-100 mb-2 font-mono">
                                             {lesson.content}
                                         </p>
                                         <button 
                                            onClick={() => onDeleteCustomLesson(lesson.id)}
                                            className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                         </>
                     ) : (
                         <form onSubmit={handleSaveLesson} className="max-w-xl mx-auto">
                             <div className="flex items-center gap-2 mb-6">
                                <button type="button" onClick={() => setShowLessonForm(false)} className="bg-slate-100 p-2 rounded-full"><ArrowLeft size={16}/></button>
                                <h3 className="text-xl font-bold text-slate-700">Nova Lição</h3>
                             </div>
                             
                             <div className="space-y-4">
                                 <div>
                                     <label className="block text-slate-400 font-bold text-xs uppercase mb-1">Título</label>
                                     <input 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-700"
                                        placeholder="Ex: Palavras com CH"
                                        value={lessonTitle}
                                        onChange={e => setLessonTitle(e.target.value)}
                                        required
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-slate-400 font-bold text-xs uppercase mb-1">Descrição (Opcional)</label>
                                     <input 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600"
                                        placeholder="Para o TPC de Sexta-feira"
                                        value={lessonDesc}
                                        onChange={e => setLessonDesc(e.target.value)}
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-slate-400 font-bold text-xs uppercase mb-1">Texto da Lição</label>
                                     <textarea 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-600 h-32 font-mono"
                                        placeholder="Escreve aqui as palavras ou frases..."
                                        value={lessonContent}
                                        onChange={e => setLessonContent(e.target.value)}
                                        required
                                     />
                                     <p className="text-xs text-slate-400 mt-1">Dica: Separa palavras com espaços ou frases com pontuação.</p>
                                 </div>
                                 <ClayButton variant="primary" theme="amber" type="submit" className="w-full py-3">Guardar Lição</ClayButton>
                             </div>
                         </form>
                     )}
                </div>
            )}

            {activeTab === 'data' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-blue-500 shadow-sm mb-4">
                            <Download size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Exportar Dados (Backup)</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Transfere um ficheiro seguro com todo o progresso dos alunos e lições personalizadas. 
                            Guarda-o no teu computador ou pen drive.
                        </p>
                        <ClayButton variant="primary" theme="blue" onClick={handleExport} className="w-full">
                            Descarregar Ficheiro
                        </ClayButton>
                    </div>

                    <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-emerald-500 shadow-sm mb-4">
                            <Upload size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Importar Dados</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Restaura um backup anterior ou transfere dados de outro computador. 
                            <span className="text-red-500 font-bold"> Atenção: Isto irá substituir os dados atuais!</span>
                        </p>
                        <label className="cursor-pointer">
                            <div className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-2xl text-center shadow-lg shadow-emerald-200 transition-all active:scale-95">
                                Selecionar Ficheiro
                            </div>
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
