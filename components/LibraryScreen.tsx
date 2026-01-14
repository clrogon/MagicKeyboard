
import React from 'react';
import { motion } from 'framer-motion';
import { Book, ArrowLeft, Library, ChevronRight, Globe } from 'lucide-react';
import { LIBRARY_TEXTS, THEME_COLORS } from '../constants';
import { ClayButton } from './ClayButton';
import { Theme } from '../types';

interface LibraryScreenProps {
  theme: Theme;
  onSelectText: (text: typeof LIBRARY_TEXTS[0]) => void;
  onBack: () => void;
}

const LibraryScreen: React.FC<LibraryScreenProps> = ({ theme, onSelectText, onBack }) => {
  const colors = THEME_COLORS[theme];

  return (
    <div className="min-h-screen p-4 md:p-8 relative z-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-6 mb-10 bg-white/60 backdrop-blur-md p-4 rounded-[2.5rem] border border-white">
            <ClayButton variant="secondary" onClick={onBack} className="w-14 h-14 !rounded-2xl !p-0 flex items-center justify-center shadow-lg">
                <ArrowLeft size={24} />
            </ClayButton>
            <div>
                <h1 className="text-3xl font-bold text-slate-700 fun-font flex items-center gap-3">
                    <Library className="text-amber-500" size={32} />
                    Biblioteca das Vozes
                </h1>
                <p className="text-slate-500 font-medium">Pratica a tua fluidez com grandes obras lusófonas.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LIBRARY_TEXTS.map((text, index) => (
                <motion.div
                    key={text.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <button
                        onClick={() => onSelectText(text)}
                        className="w-full bg-white rounded-[2.5rem] p-8 text-left transition-all duration-300 border-4 border-white shadow-sm hover:shadow-xl hover:-translate-y-2 group relative overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${text.origin === 'Angola' ? 'bg-red-50' : text.origin === 'Portugal' ? 'bg-blue-50' : 'bg-green-50'} rounded-full -mr-10 -mt-10 opacity-60`}></div>
                        
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-2xl ${text.origin === 'Angola' ? 'bg-red-100 text-red-500' : text.origin === 'Portugal' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'} shadow-inner`}>
                                <Book size={32} />
                            </div>
                            <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Globe size={12} /> {text.origin}
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-700 mb-2 fun-font line-clamp-1 group-hover:text-amber-600 transition-colors">{text.title}</h3>
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-tighter mb-4">{text.author}</p>
                        
                        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 shadow-inner h-24 overflow-hidden relative">
                             <p className="text-xs text-slate-500 italic leading-relaxed">"{text.content.substring(0, 150)}..."</p>
                             <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 to-transparent"></div>
                        </div>

                        <ClayButton variant="primary" theme="amber" className="w-full py-3 text-sm">
                            Começar Leitura <ChevronRight size={18} className="ml-2" />
                        </ClayButton>
                    </button>
                </motion.div>
            ))}
        </div>

        <div className="mt-16 text-center bg-white/40 p-8 rounded-[3rem] border-2 border-dashed border-white">
             <p className="text-slate-400 font-medium italic">
                "A leitura de todos os bons livros é como uma conversa com as melhores pessoas dos séculos passados."
                <br/>
                <span className="text-xs font-bold uppercase mt-2 block">— René Descartes</span>
             </p>
        </div>
      </div>
    </div>
  );
};

export default LibraryScreen;
