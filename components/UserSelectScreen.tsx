
import React, { useState, useEffect } from 'react';
import { UserProfile, Theme, KeyboardLayout } from '../types';
import { ClayButton } from './ClayButton';
import { Plus, Settings, Keyboard as KeyboardIcon, Wand2, User, Type } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AVATARS, THEME_COLORS } from '../constants';

interface UserSelectScreenProps {
  users: UserProfile[];
  onSelectUser: (userId: string) => void;
  onCreateUser: (name: string, avatar: string, theme: Theme, layout: KeyboardLayout) => void;
  onOpenParentDashboard: () => void;
}

const UserSelectScreen: React.FC<UserSelectScreenProps> = ({ users, onSelectUser, onCreateUser, onOpenParentDashboard }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState(AVATARS[0]);
  const [newTheme, setNewTheme] = useState<Theme>('rose');
  const [newLayout, setNewLayout] = useState<KeyboardLayout>('qwerty');
  const [detectedLayout, setDetectedLayout] = useState<boolean>(false);

  // Auto-detect keyboard layout when entering creation mode
  useEffect(() => {
    if (isCreating) {
        const detectLayout = async () => {
            if ('keyboard' in navigator && (navigator as any).keyboard) {
                try {
                    const layoutMap = await (navigator as any).keyboard.getLayoutMap();
                    const qValue = layoutMap.get('KeyQ');
                    
                    if (qValue === 'a') {
                        setNewLayout('azerty');
                        setDetectedLayout(true);
                    } else if (qValue === 'q') {
                        setNewLayout('qwerty');
                        setDetectedLayout(true);
                    }
                } catch (e) {
                    console.log("Keyboard layout detection not supported or denied.");
                }
            }
        };
        detectLayout();
    } else {
        setDetectedLayout(false);
    }
  }, [isCreating]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onCreateUser(newName.trim(), newAvatar, newTheme, newLayout);
      setIsCreating(false);
      setNewName("");
      setNewAvatar(AVATARS[0]);
      setNewLayout('qwerty');
      setDetectedLayout(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/2 w-32 h-32 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-12">
           <div className="inline-block p-4 rounded-full bg-white shadow-lg mb-4">
                <User size={40} className="text-slate-700" />
           </div>
           <h1 className="text-4xl md:text-6xl font-bold text-slate-700 fun-font mb-4">Quem vai jogar?</h1>
           <p className="text-slate-500 text-lg font-medium">Escolhe o teu perfil ou cria um novo!</p>
        </div>

        {isCreating ? (
          <motion.form 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] max-w-2xl mx-auto border-4 border-white"
            onSubmit={handleSubmit}
          >
             <h2 className="text-3xl font-bold text-slate-700 mb-8 text-center fun-font">Novo Jogador</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                 <div className="space-y-6">
                     <div>
                        <label className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 ml-2">Nome</label>
                        <div className="relative">
                            <input 
                              type="text" 
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              className="w-full bg-slate-100 rounded-2xl p-4 pl-12 text-lg font-bold text-slate-700 focus:outline-none focus:ring-4 ring-rose-100 transition-all shadow-[inset_0px_2px_4px_rgba(0,0,0,0.06)]"
                              placeholder="O teu nome..."
                              autoFocus
                              maxLength={12}
                            />
                            <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        </div>
                     </div>

                     <div>
                        <label className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 ml-2">Tema</label>
                        <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                            {(['rose', 'blue', 'amber'] as Theme[]).map(t => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() => setNewTheme(t)}
                                  className={`flex-1 h-12 rounded-xl transition-all shadow-sm ${newTheme === t ? 'ring-4 ring-offset-2 ring-slate-200 scale-105' : 'opacity-40 hover:opacity-100 scale-95'}`}
                                  style={{ background: t === 'rose' ? '#f43f5e' : t === 'blue' ? '#3b82f6' : '#f59e0b' }}
                                />
                            ))}
                        </div>
                     </div>
                 </div>

                 <div>
                     <label className="block text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 ml-2">Avatar</label>
                     <div className="grid grid-cols-4 gap-2 bg-slate-50 p-4 rounded-3xl border border-slate-100 h-full content-start">
                        {AVATARS.slice(0, 12).map((avatar: string) => (
                            <button 
                              key={avatar}
                              type="button"
                              onClick={() => setNewAvatar(avatar)}
                              className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all ${newAvatar === avatar ? 'bg-white shadow-md scale-110 ring-2 ring-indigo-100' : 'hover:bg-white/50 hover:scale-105'}`}
                            >
                              {avatar}
                            </button>
                        ))}
                     </div>
                 </div>
             </div>

             <div className="mb-10">
                <div className="flex justify-between items-end mb-2 ml-2">
                    <label className="block text-slate-400 font-bold text-xs uppercase tracking-wider">Teclado</label>
                    {detectedLayout && (
                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 animate-pulse bg-emerald-50 px-2 py-1 rounded-lg">
                            <Wand2 size={12} /> Detetado
                        </span>
                    )}
                </div>
                <div className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                    <button
                        type="button"
                        onClick={() => setNewLayout('qwerty')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${newLayout === 'qwerty' ? 'bg-white text-slate-700 shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                        <KeyboardIcon size={16} /> QWERTY
                    </button>
                    <button
                        type="button"
                        onClick={() => setNewLayout('azerty')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${newLayout === 'azerty' ? 'bg-white text-slate-700 shadow-md' : 'text-slate-400 hover:bg-slate-100'}`}
                    >
                        <KeyboardIcon size={16} /> AZERTY
                    </button>
                </div>
             </div>

             <div className="flex gap-4">
                 <ClayButton type="button" variant="secondary" onClick={() => setIsCreating(false)} className="flex-1 py-4 text-lg">Cancelar</ClayButton>
                 <ClayButton type="submit" variant="primary" theme={newTheme} className="flex-1 py-4 text-lg shadow-xl" disabled={!newName.trim()}>
                    <Plus size={20} className="mr-2" /> Criar Perfil
                 </ClayButton>
             </div>
          </motion.form>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
               <AnimatePresence>
                  {users.map((user) => (
                    <motion.div
                      key={user.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ y: -5 }}
                      className="group"
                    >
                       <button 
                          onClick={() => onSelectUser(user.id)}
                          className={`w-full bg-white rounded-[2.5rem] p-6 shadow-sm border-4 border-white group-hover:border-${THEME_COLORS[user.theme].base}-200 group-hover:shadow-xl transition-all flex flex-col items-center gap-4 relative overflow-hidden`}
                       >
                          <div className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${THEME_COLORS[user.theme].bgSoft} to-transparent opacity-50`}></div>
                          
                          <div className={`relative z-10 w-28 h-28 rounded-full bg-gradient-to-br ${THEME_COLORS[user.theme].gradient} flex items-center justify-center text-6xl shadow-inner border-4 border-white`}>
                             {user.currentAvatar}
                          </div>
                          
                          <div className="text-center relative z-10">
                             <h3 className="text-xl font-bold text-slate-700 mb-1">{user.name}</h3>
                             <p className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg bg-slate-100 text-slate-500 inline-block`}>{user.currentTitle}</p>
                          </div>
                          
                          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mt-2 shadow-inner">
                              <div className={`h-full bg-${THEME_COLORS[user.theme].base}-400 transition-all duration-1000`} style={{width: `${(user.xp % 100)}%`}}></div>
                          </div>
                       </button>
                    </motion.div>
                  ))}
                  
                  {/* Add User Button */}
                  <motion.button 
                     layout
                     onClick={() => setIsCreating(true)}
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     className="bg-white/40 border-4 border-dashed border-white rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all min-h-[260px] backdrop-blur-sm"
                  >
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Plus size={32} className="text-slate-300" />
                     </div>
                     <span className="font-bold text-lg">Novo Jogador</span>
                  </motion.button>
               </AnimatePresence>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={onOpenParentDashboard}
                    className="flex items-center gap-3 text-slate-400 hover:text-indigo-500 transition-all px-8 py-4 rounded-2xl hover:bg-white/80 hover:shadow-lg border border-transparent hover:border-white"
                >
                    <Settings size={20} />
                    <span className="font-bold text-sm uppercase tracking-wide">Área de Pais e Professores</span>
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSelectScreen;
