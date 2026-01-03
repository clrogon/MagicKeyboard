
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
        className="bg-[#FDF6F0] rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 font-sans border-4 border-white"
      >
        <div className={`p-6 ${colors.bg} text-white flex justify-between items-center relative overflow-hidden`}>
             {/* Header Shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-[2.5rem] pointer-events-none"></div>
            
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 fun-font relative z-10">
                <Hand className="fill-yellow-300 text-yellow-300" size={32} /> 
                A Posição Mágica
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition relative z-10"><X size={28}/></button>
        </div>
        
        <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
            
            {/* Step 1: The Bumps */}
            <section className="mb-10 text-center">
                <div className="bg-yellow-100 inline-block px-6 py-2 rounded-xl text-yellow-700 font-bold mb-4 border border-yellow-200 shadow-sm uppercase tracking-wide text-sm">
                    Passo 1: O Segredo
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-700 mb-2">Sentes os tracinhos?</h3>
                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-xl mx-auto font-medium">
                    Procura as teclas <strong className={`${colors.text} ${colors.bgSoft} px-2 rounded`}>F</strong> e <strong className={`${colors.text} ${colors.bgSoft} px-2 rounded`}>J</strong>. Elas têm um relevo especial para os teus dedos indicadores descansarem sem olhar!
                </p>
            </section>

            {/* Step 2: The Hands Visual */}
            <section className="mb-10 relative">
                <div className="text-center mb-6">
                    <div className="bg-blue-100 inline-block px-6 py-2 rounded-xl text-blue-700 font-bold mb-2 border border-blue-200 shadow-sm uppercase tracking-wide text-sm">
                        Passo 2: Cada dedo tem a sua cor
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-8 shadow-[inset_0px_4px_20px_rgba(0,0,0,0.02)] border border-white flex flex-col items-center">
                    {/* The Hands Component */}
                    <div className="scale-125 md:scale-150 mb-10 mt-4">
                        <HandsDisplay mode="guide" />
                    </div>

                    {/* Legend Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        {mapping.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <div className={`w-8 h-2 ${item.color} rounded-full mb-2`}></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</span>
                                <span className="text-slate-700 font-bold text-center">{item.keys}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl">
                        <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                        <span className="text-slate-500 font-bold text-sm">Polegares = Espaço</span>
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
