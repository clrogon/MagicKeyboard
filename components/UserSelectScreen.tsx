import React, { useState, useEffect } from 'react';
import { UserProfile, Theme, KeyboardLayout } from '../types';
import { ClayButton } from './ClayButton';
import { Plus, Settings, Keyboard as KeyboardIcon, Wand2 } from 'lucide-react';
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
                    // Check what the physical 'KeyQ' maps to.
                    // On QWERTY, KeyQ -> 'q'
                    // On AZERTY, KeyQ -> 'a'
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
           <h1 className="text-4xl md:text-6xl font-bold text-slate-700 fun-font mb-4">Quem vai jogar?</h1>
           <p className="text-slate-500 text-lg">Escolhe o teu perfil ou cria um novo!</p>
        </div>

        {isCreating ? (
          <motion.form 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] p-8 shadow-xl max-w-lg mx-auto border-4 border-white"
            onSubmit={handleSubmit}
          >
             <h2 className="text-2xl font-bold text-slate-700 mb-6 text-center">Novo Jogador</h2>
             
             <div className="mb-6">
                <label className="block text-slate-400 font-bold text-sm uppercase tracking-wide mb-2">Nome</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-100 rounded-2xl p-4 text-lg font-bold text-slate-700 focus:outline-none focus:ring-4 ring-rose-200"
                  placeholder="O teu nome..."
                  autoFocus
                  maxLength={12}
                />
             </div>

             <div className="mb-6">
                 <label className="block text-slate-400 font-bold text-sm uppercase tracking-wide mb-2">Avatar</label>
                 <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    {AVATARS.slice(0, 8).map((avatar: string) => (
                        <button 
                          key={avatar}
                          type="button"
                          onClick={() => setNewAvatar(avatar)}
                          className={`w-12 h-12 flex-shrink-0 rounded-full text-2xl flex items-center justify-center transition-transform ${newAvatar === avatar ? 'bg-indigo-100 scale-110 ring-2 ring-indigo-400' : 'bg-slate-50 hover:bg-slate-100'}`}
                        >
                          {avatar}
                        </button>
                    ))}
                 </div>
             </div>

             <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-slate-400 font-bold text-sm uppercase tracking-wide">Teclado</label>
                    {detectedLayout && (
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 animate-pulse">
                            <Wand2 size={12} /> Detetado Automaticamente
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setNewLayout('qwerty')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${newLayout === 'qwerty' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        <KeyboardIcon size={16} /> QWERTY (PT)
                    </button>
                    <button
                        type="button"
                        onClick={() => setNewLayout('azerty')}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${newLayout === 'azerty' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        <KeyboardIcon size={16} /> AZERTY (FR)
                    </button>
                </div>
             </div>

             <div className="mb-8">
                <label className="block text-slate-400 font-bold text-sm uppercase tracking-wide mb-2">Tema</label>
                <div className="flex gap-3">
                    {(['rose', 'blue', 'amber'] as Theme[]).map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewTheme(t)}
                          className={`flex-1 h-12 rounded-xl transition-all ${newTheme === t ? 'ring-4 ring-offset-2 ring-slate-200 scale-105' : 'opacity-60 hover:opacity-100'}`}
                          style={{ background: t === 'rose' ? '#f43f5e' : t === 'blue' ? '#3b82f6' : '#f59e0b' }}
                        />
                    ))}
                </div>
             </div>

             <div className="flex gap-4">
                 <ClayButton type="button" variant="secondary" onClick={() => setIsCreating(false)} className="flex-1 py-3">Cancelar</ClayButton>
                 <ClayButton type="submit" variant="primary" theme={newTheme} className="flex-1 py-3" disabled={!newName.trim()}>Criar</ClayButton>
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
                      className="group relative"
                    >
                       <button 
                          onClick={() => onSelectUser(user.id)}
                          className={`w-full bg-white rounded-[2.5rem] p-6 shadow-sm border-4 border-white hover:border-${THEME_COLORS[user.theme].base}-200 hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center gap-4`}
                       >
                          <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${THEME_COLORS[user.theme].gradient} flex items-center justify-center text-5xl shadow-inner`}>
                             {user.currentAvatar}
                          </div>
                          <div className="text-center">
                             <h3 className="text-xl font-bold text-slate-700">{user.name}</h3>
                             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{user.currentTitle}</p>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-2">
                              <div className={`h-full bg-${THEME_COLORS[user.theme].base}-400 w-1/2`} style={{width: `${(user.xp % 100)}%`}}></div>
                          </div>
                       </button>
                    </motion.div>
                  ))}
                  
                  {/* Add User Button */}
                  <motion.button 
                     layout
                     onClick={() => setIsCreating(true)}
                     className="bg-white/50 border-4 border-dashed border-white/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-slate-600 hover:border-slate-300 hover:bg-white/80 transition-all min-h-[220px]"
                  >
                     <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                        <Plus size={32} />
                     </div>
                     <span className="font-bold">Novo Jogador</span>
                  </motion.button>
               </AnimatePresence>
            </div>

            <div className="flex justify-center">
                <button 
                    onClick={onOpenParentDashboard}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors px-6 py-3 rounded-xl hover:bg-white/50"
                >
                    <Settings size={18} />
                    <span className="font-bold text-sm">Área de Pais e Professores</span>
                </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserSelectScreen;