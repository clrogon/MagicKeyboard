
import React, { useState } from 'react';
import { AppState, UserProfile, CustomLesson } from '../types';
import { ClayButton } from './ClayButton';
import { ArrowLeft, Trash2, Clock, Trophy, Target, Calendar, Download, Upload, Plus, Pencil, BookOpen, Users, Save, GraduationCap, Lock, LayoutGrid, Type } from 'lucide-react';
import { THEME_COLORS } from '../constants';

interface ParentDashboardProps {
  users: UserProfile[];
  appState: AppState;
  onBack: () => void;
  onDeleteUser: (userId: string) => void;
  onAddCustomLesson: (lesson: CustomLesson) => void;
  onDeleteCustomLesson: (lessonId: string) => void;
  onImportData: (data: AppState) => void;
  onUpdateUser?: (userId: string, updates: Partial<UserProfile>) => void;
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ 
    users, appState, onBack, onDeleteUser, onAddCustomLesson, onDeleteCustomLesson, onImportData, onUpdateUser 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'classroom' | 'lessons' | 'data'>('users');
  
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

  const handleExport = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "teclado_magico_backup.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

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
                          alert("Ficheiro inválido. Certifique-se que é um backup do Teclado Mágico.");
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

  const handleToggleKiosk = (userId: string, currentStatus: boolean) => {
      if (onUpdateUser) {
          onUpdateUser(userId, { kioskMode: !currentStatus });
      }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-10">
            <ClayButton variant="secondary" onClick={onBack} className="w-14 h-14 !rounded-2xl !p-0 flex items-center justify-center shadow-lg">
                <ArrowLeft size={24} />
            </ClayButton>
            <div>
                <h1 className="text-3xl font-bold text-slate-700 fun-font">Área de Pais e Professores</h1>
                <p className="text-slate-500 font-medium">Gestão de perfis e acompanhamento</p>
            </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 hover:scale-[1.02] transition-transform">
                 <div className="bg-indigo-100 p-4 rounded-2xl text-indigo-500 shadow-inner">
                     <Clock size={32} />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-700">{totalPlayTimeHours}h</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Tempo Jogado</div>
                 </div>
             </div>
             
             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 hover:scale-[1.02] transition-transform">
                 <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-500 shadow-inner">
                     <Target size={32} />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-700">{totalSessions}</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sessões Completas</div>
                 </div>
             </div>

             <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-white flex items-center gap-4 hover:scale-[1.02] transition-transform">
                 <div className="bg-rose-100 p-4 rounded-2xl text-rose-500 shadow-inner">
                     <Trophy size={32} />
                 </div>
                 <div>
                     <div className="text-3xl font-bold text-slate-700">{users.length}</div>
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">Alunos Ativos</div>
                 </div>
             </div>
        </div>

        {/* Clay Tab Navigation */}
        <div className="bg-white/50 backdrop-blur-md p-2 rounded-[2rem] flex gap-2 mb-8 overflow-x-auto border border-white shadow-sm">
            {[
                { id: 'users', label: 'Alunos', icon: Users },
                { id: 'classroom', label: 'Sala de Aula', icon: GraduationCap },
                { id: 'lessons', label: 'Lições', icon: BookOpen },
                { id: 'data', label: 'Dados', icon: Save },
            ].map((tab) => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        flex-1 py-4 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden min-w-[140px]
                        ${activeTab === tab.id 
                            ? 'bg-indigo-500 text-white shadow-[0_8px_16px_rgba(99,102,241,0.3)] transform scale-[1.02]' 
                            : 'bg-white/60 text-slate-500 hover:bg-white hover:text-slate-700'}
                    `}
                >
                    {activeTab === tab.id && <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>}
                    <tab.icon size={20} className={activeTab === tab.id ? 'text-indigo-100' : 'text-slate-400'} /> 
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Tab Content Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border-4 border-white p-8 min-h-[400px]">
            
            {activeTab === 'users' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6 px-2">
                        <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
                            <LayoutGrid size={24} className="text-indigo-400" />
                            Lista de Alunos
                        </h3>
                    </div>
                    {users.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            Nenhum aluno registado.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {users.map((user) => {
                                const lastPlayed = user.history.length > 0 ? user.history[user.history.length - 1].date : '';
                                const colors = THEME_COLORS[user.theme];
                                return (
                                    <div key={user.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-all">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br ${colors.gradient} text-white shadow-inner shrink-0`}>
                                            {user.currentAvatar}
                                        </div>
                                        
                                        <div className="flex-1 text-center md:text-left">
                                            <div className="font-bold text-xl text-slate-700 mb-1">{user.name}</div>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wide">Nível {user.playerLevel}</span>
                                                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wide">{user.currentTitle}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center md:items-end gap-1 text-sm text-slate-500 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" /> 
                                                {lastPlayed ? `Último: ${formatDate(lastPlayed)}` : 'Nunca jogou'}
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => onDeleteUser(user.id)}
                                            className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-lg transition-all"
                                            title="Apagar Utilizador"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'classroom' && (
                <div>
                    <div className="mb-6 bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 text-indigo-800 text-sm flex items-start gap-4">
                        <div className="bg-white p-3 rounded-full shadow-sm text-indigo-500"><Lock size={24} /></div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">Modo Kiosk (Foco na Aula)</h4>
                            <p className="opacity-80 leading-relaxed">
                                Quando ativado, bloqueia a mudança de Avatar e Tema, e impede que o aluno saia do perfil sem resolver um desafio matemático. Ideal para salas de aula.
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {users.map((user) => {
                            const maxWpm = user.history.reduce((max, h) => Math.max(max, h.wpm), 0);
                            
                            return (
                                <div key={user.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl bg-slate-100 border-2 border-white shadow-sm">
                                            {user.currentAvatar}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700">{user.name}</div>
                                            <div className="text-xs text-slate-400 font-bold uppercase">Nível {user.currentLevelId} • {maxWpm} PPM</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 bg-slate-50 p-2 pl-4 rounded-xl">
                                        <span className={`text-xs font-bold uppercase tracking-wider ${user.kioskMode ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {user.kioskMode ? 'Bloqueado' : 'Livre'}
                                        </span>
                                        <button 
                                            onClick={() => handleToggleKiosk(user.id, !!user.kioskMode)}
                                            className={`
                                                relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none shadow-inner
                                                ${user.kioskMode ? 'bg-indigo-500' : 'bg-slate-300'}
                                            `}
                                        >
                                            <span className={`
                                                inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm
                                                ${user.kioskMode ? 'translate-x-7' : 'translate-x-1'}
                                            `}/>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {activeTab === 'lessons' && (
                <div>
                     {!showLessonForm ? (
                         <>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-slate-700">As Minhas Lições</h3>
                                <ClayButton variant="primary" theme="amber" onClick={() => setShowLessonForm(true)} className="px-6 py-3 shadow-lg">
                                    <Plus size={20} className="mr-2" /> Criar Lição
                                </ClayButton>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {appState.customLessons.length === 0 && (
                                    <div className="col-span-2 text-center py-16 text-slate-400 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50">
                                        <Pencil size={48} className="mx-auto mb-4 opacity-30" />
                                        <p className="text-lg font-bold">Ainda não criaste nenhuma lição.</p>
                                        <p className="text-sm opacity-70">Cria listas de palavras para TPC!</p>
                                    </div>
                                )}
                                {appState.customLessons.map(lesson => (
                                    <div key={lesson.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-lg transition-all group relative overflow-hidden">
                                         <div className="absolute top-0 left-0 w-2 h-full bg-amber-400"></div>
                                         <h4 className="font-bold text-lg text-slate-700 mb-1 ml-2">{lesson.title}</h4>
                                         <p className="text-xs text-slate-400 font-bold uppercase mb-4 ml-2 tracking-wider">{lesson.description}</p>
                                         <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-2 font-mono text-sm text-slate-600 line-clamp-2 shadow-inner">
                                             {lesson.content}
                                         </div>
                                         <button 
                                            onClick={() => onDeleteCustomLesson(lesson.id)}
                                            className="absolute top-6 right-6 text-slate-300 hover:text-red-500 transition-colors bg-white p-2 rounded-full shadow-sm hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                         </>
                     ) : (
                         <form onSubmit={handleSaveLesson} className="max-w-2xl mx-auto bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                             <div className="flex items-center gap-4 mb-8">
                                <button type="button" onClick={() => setShowLessonForm(false)} className="bg-slate-100 p-3 rounded-full hover:bg-slate-200 transition"><ArrowLeft size={20}/></button>
                                <h3 className="text-2xl font-bold text-slate-700">Nova Lição</h3>
                             </div>
                             
                             <div className="space-y-6">
                                 <div>
                                     <label className="block text-slate-400 font-bold text-xs uppercase mb-2 ml-2">Título</label>
                                     <input 
                                        className="w-full bg-slate-50 rounded-2xl p-4 font-bold text-slate-700 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-4 ring-amber-100"
                                        placeholder="Ex: Palavras com CH"
                                        value={lessonTitle}
                                        onChange={e => setLessonTitle(e.target.value)}
                                        required
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-slate-400 font-bold text-xs uppercase mb-2 ml-2">Descrição (Opcional)</label>
                                     <input 
                                        className="w-full bg-slate-50 rounded-2xl p-4 text-slate-600 shadow-[inset_0px_2px_4px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-4 ring-amber-100"
                                        placeholder="Para o TPC de Sexta-feira"
                                        value={lessonDesc}
                                        onChange={e => setLessonDesc(e.target.value)}
                                     />
                                 </div>
                                 <div>
                                     <label className="block text-slate-400 font-bold text-xs uppercase mb-2 ml-2">Texto da Lição</label>
                                     <textarea 
                                        className="w-full bg-slate-50 rounded-2xl p-4 text-slate-600 h-40 font-mono shadow-[inset_0px_2px_4px_rgba(0,0,0,0.06)] focus:outline-none focus:ring-4 ring-amber-100 resize-none"
                                        placeholder="Escreve aqui as palavras ou frases..."
                                        value={lessonContent}
                                        onChange={e => setLessonContent(e.target.value)}
                                        required
                                     />
                                     <p className="text-xs text-slate-400 mt-2 ml-2 flex items-center gap-1"><Type size={12} /> Dica: Separa palavras com espaços.</p>
                                 </div>
                                 <ClayButton variant="primary" theme="amber" type="submit" className="w-full py-4 text-lg shadow-lg">Guardar Lição</ClayButton>
                             </div>
                         </form>
                     )}
                </div>
            )}

            {activeTab === 'data' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-blue-50 p-8 rounded-[3rem] border border-blue-100 text-center hover:bg-blue-100/50 transition-colors">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-blue-500 shadow-lg mb-6 mx-auto">
                            <Download size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Backup (Exportar)</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed px-4">
                            Guarda todo o progresso num ficheiro seguro no teu computador.
                        </p>
                        <ClayButton variant="primary" theme="blue" onClick={handleExport} className="w-full py-4 text-lg shadow-xl">
                            Descarregar Ficheiro
                        </ClayButton>
                    </div>

                    <div className="bg-emerald-50 p-8 rounded-[3rem] border border-emerald-100 text-center hover:bg-emerald-100/50 transition-colors">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center text-emerald-500 shadow-lg mb-6 mx-auto">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">Restaurar (Importar)</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed px-4">
                            Carrega um ficheiro de backup anterior. <br/><span className="text-red-400 font-bold text-xs">⚠️ Substitui os dados atuais!</span>
                        </p>
                        <label className="cursor-pointer block w-full">
                            <div className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-4 rounded-2xl text-center shadow-[0_10px_20px_rgba(16,185,129,0.3)] transition-all active:scale-95 text-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
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
