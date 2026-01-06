
import React from 'react';
import { X, Hand } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClayButton } from './ClayButton';
import { HandsDisplay } from './HandsDisplay';
import { Theme } from '../types';
import { THEME_COLORS } from '../constants';

interface HandGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: Theme;
}

const HandGuideModal: React.FC<HandGuideModalProps> = ({ isOpen, onClose, theme = 'rose' }) => {
  if (!isOpen) return null;

  const colors = THEME_COLORS[theme];

  const mapping = [
      { color: 'bg-pink-400', label: 'Mindinho', keys: 'A Q Z' },
      { color: 'bg-blue-400', label: 'Anelar', keys: 'S W X' },
      { color: 'bg-green-400', label: 'Médio', keys: 'D E C' },
      { color: 'bg-yellow-400', label: 'Indicador', keys: 'F R V G T B' },
      { color: 'bg-orange-400', label: 'Indicador', keys: 'J U M H Y N' },
      { color: 'bg-purple-400', label: 'Médio', keys: 'K I ,' },
      { color: 'bg-teal-400', label: 'Anelar', keys: 'L O .' },
      { color: 'bg-rose-500', label: 'Mindinho', keys: 'Ç P ;' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#FDF6F0] rounded-[3rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-4xl overflow-hidden relative z-10 font-sans border-8 border-white"
      >
        <div className="p-8 flex justify-between items-center bg-white border-b border-slate-100">
             <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center text-white shadow-lg -rotate-3`}>
                    <Hand size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-700 fun-font">Mãos no Teclado</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">A Posição Mágica</p>
                </div>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24}/>
            </button>
        </div>
        
        <div className="p-6 md:p-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
            
            {/* Step 1: The Bumps */}
            <section className="mb-12 text-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                <div className="bg-yellow-100 inline-block px-4 py-1.5 rounded-lg text-yellow-700 font-bold mb-4 uppercase tracking-wide text-xs">
                    Passo 1: O Segredo
                </div>
                <h3 className="text-2xl font-bold text-slate-700 mb-2 fun-font">Sentes os tracinhos?</h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto font-medium">
                    Procura as teclas <strong className={`${colors.text} ${colors.bgSoft} px-2 py-0.5 rounded-lg border border-current`}>F</strong> e <strong className={`${colors.text} ${colors.bgSoft} px-2 py-0.5 rounded-lg border border-current`}>J</strong>. <br/>
                    Elas têm um relevo especial para os teus dedos descansarem sem olhar!
                </p>
            </section>

            {/* Step 2: The Hands Visual */}
            <section className="relative">
                <div className="text-center mb-6">
                    <div className="bg-blue-100 inline-block px-4 py-1.5 rounded-lg text-blue-700 font-bold mb-2 uppercase tracking-wide text-xs">
                        Passo 2: Cada dedo tem a sua cor
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 shadow-[inset_0px_4px_20px_rgba(0,0,0,0.02)] border-2 border-slate-100 flex flex-col items-center">
                    {/* The Hands Component */}
                    <div className="scale-110 md:scale-125 mb-10 mt-6">
                        <HandsDisplay mode="guide" theme={theme} />
                    </div>

                    {/* Legend Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {mapping.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className={`w-10 h-3 ${item.color} rounded-full mb-2 shadow-sm`}></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</span>
                                <span className="text-slate-700 font-bold text-center bg-white px-2 rounded-md w-full">{item.keys}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-2xl border border-slate-200">
                        <div className="w-4 h-4 rounded-full bg-slate-400"></div>
                        <span className="text-slate-500 font-bold">Polegares = Espaço</span>
                    </div>
                </div>
            </section>
        </div>
        
        <div className="p-6 bg-white border-t border-slate-100 flex justify-center">
            <ClayButton variant="primary" theme={theme} onClick={onClose} className={`px-12 py-4 text-xl w-full md:w-auto shadow-xl ${colors.shadow}`}>
                Vamos treinar!
            </ClayButton>
        </div>
      </motion.div>
    </div>
  );
};

export default HandGuideModal;
