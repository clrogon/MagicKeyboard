
import React from 'react';
import { X, Hand } from 'lucide-react';
import { motion } from 'framer-motion';

interface HandGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HandGuideModal: React.FC<HandGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const leftHand = [
    { char: 'A', finger: 'Mindinho', color: 'bg-pink-500' },
    { char: 'S', finger: 'Anelar', color: 'bg-blue-500' },
    { char: 'D', finger: 'Médio', color: 'bg-green-500' },
    { char: 'F', finger: 'Indicador', color: 'bg-yellow-500', bump: true },
  ];

  const rightHand = [
    { char: 'J', finger: 'Indicador', color: 'bg-orange-500', bump: true },
    { char: 'K', finger: 'Médio', color: 'bg-purple-500' },
    { char: 'L', finger: 'Anelar', color: 'bg-teal-500' },
    { char: 'Ç', finger: 'Mindinho', color: 'bg-red-500' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 font-sans border-4 border-indigo-100"
      >
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 fun-font">
                <Hand className="fill-yellow-400 text-yellow-400" size={32} /> 
                A Posição Mágica
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X size={28}/></button>
        </div>
        
        <div className="p-6 md:p-10 overflow-y-auto max-h-[80vh]">
            
            {/* Step 1: The Bumps */}
            <section className="mb-10 text-center">
                <div className="bg-yellow-50 inline-block px-6 py-2 rounded-full text-yellow-800 font-bold mb-4 border border-yellow-200 shadow-sm">
                    Passo 1: O Segredo
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">Encontra os Tracinhos</h3>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                    Olha para o teu teclado. As teclas <strong className="text-indigo-600 text-xl mx-1">F</strong> e <strong className="text-indigo-600 text-xl mx-1">J</strong> têm um pequeno relevo (um tracinho ou bolinha).
                    <br/>
                    É aqui que os teus <strong>Indicadores</strong> descansam sem precisares de olhar!
                </p>
            </section>

            {/* Step 2: The Hands Visual */}
            <section className="mb-10">
                <div className="text-center mb-6">
                    <div className="bg-blue-50 inline-block px-6 py-2 rounded-full text-blue-800 font-bold mb-4 border border-blue-200 shadow-sm">
                        Passo 2: A Linha de Base (Home Row)
                    </div>
                    <p className="text-slate-600">Coloca os teus dedos nestas teclas:</p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                    {/* Left Hand */}
                    <div className="flex flex-col items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest mb-4">Mão Esquerda</span>
                        <div className="flex gap-2">
                            {leftHand.map((key) => (
                                <div key={key.char} className="flex flex-col items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${key.color}`}></div>
                                    <div className={`
                                        w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-b-4 relative
                                        ${key.bump ? 'bg-white border-yellow-400 ring-2 ring-yellow-200 z-10' : 'bg-slate-50 border-slate-200 text-slate-500'}
                                    `}>
                                        {key.char}
                                        {key.bump && <div className="absolute bottom-2 w-4 h-1 bg-slate-300 rounded-full"></div>}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 rotate-45 origin-left mt-2 hidden md:block">{key.finger}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Hand */}
                    <div className="flex flex-col items-center">
                        <span className="text-slate-400 font-bold uppercase tracking-widest mb-4">Mão Direita</span>
                        <div className="flex gap-2">
                            {rightHand.map((key) => (
                                <div key={key.char} className="flex flex-col items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${key.color}`}></div>
                                    <div className={`
                                        w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl text-2xl font-bold shadow-lg border-b-4 relative
                                        ${key.bump ? 'bg-white border-orange-400 ring-2 ring-orange-200 z-10' : 'bg-slate-50 border-slate-200 text-slate-500'}
                                    `}>
                                        {key.char}
                                        {key.bump && <div className="absolute bottom-2 w-4 h-1 bg-slate-300 rounded-full"></div>}
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 -rotate-45 origin-right mt-2 hidden md:block">{key.finger}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

             {/* Step 3: Thumbs */}
             <section className="text-center bg-slate-50 rounded-2xl p-6 border border-slate-200">
                 <h3 className="text-lg font-bold text-slate-700 mb-2">E os Polegares? 👍</h3>
                 <p className="text-slate-600">
                     Os dois polegares descansam suavemente na <strong>Barra de Espaço</strong>. 
                     Podes usar qualquer um deles para dar espaços!
                 </p>
            </section>

        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-center">
            <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-200 text-lg">
                Vamos treinar!
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default HandGuideModal;
