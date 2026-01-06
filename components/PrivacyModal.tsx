
import React from 'react';
import { X, Shield, Lock, Database, Eraser } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClayButton } from './ClayButton';
import { Theme } from '../types';
import { THEME_COLORS } from '../constants';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
  theme?: Theme;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onClearData, theme = 'rose' }) => {
  if (!isOpen) return null;

  const colors = THEME_COLORS[theme];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] w-full max-w-2xl overflow-hidden relative z-10 font-sans border-4 border-white"
      >
        <div className="p-8 flex justify-between items-center bg-white relative z-20">
            <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3`}>
                    <Shield size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 fun-font">Privacidade</h2>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Os teus dados são teus</p>
                </div>
            </div>
            <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
            </button>
        </div>
        
        <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto space-y-6 text-slate-700 custom-scrollbar">
            <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-lg hover:border-white transition-all">
                <div className={`absolute top-0 left-0 w-1 h-full ${colors.bg}`}></div>
                <h3 className={`text-lg font-bold text-slate-700 flex items-center gap-2 mb-3`}>
                    <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm"><Database size={20} /></div>
                    Armazenamento Local
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 pl-2">
                    O <strong>Teclado Mágico</strong> guarda o teu progresso apenas no teu dispositivo (LocalStorage).
                    <br/>
                    <strong>Segurança:</strong> Não temos base de dados. Não recolhemos o teu nome, email ou localização.
                </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative overflow-hidden group hover:bg-white hover:shadow-lg hover:border-white transition-all">
                <div className={`absolute top-0 left-0 w-1 h-full bg-indigo-400`}></div>
                <h3 className={`text-lg font-bold text-slate-700 flex items-center gap-2 mb-3`}>
                    <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm"><Lock size={20} /></div>
                    Inteligência Artificial
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 pl-2">
                    A IA (Gemini) gera frases criativas mas apenas recebe pedidos anónimos (ex: "frase com a letra A"). 
                    Nenhum dado pessoal é enviado para a Google.
                </p>
            </section>

            <section className="bg-red-50 p-6 rounded-[2rem] border border-red-100">
                <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-3">
                    <div className="bg-white p-2 rounded-xl text-red-300 shadow-sm"><Eraser size={20} /></div>
                    Zona de Perigo
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-red-400 pl-2">
                    Como os dados são teus, podes apagá-los quando quiseres. Esta ação é irreversível.
                </p>
                
                <div className="flex justify-end">
                    <ClayButton 
                        variant="secondary"
                        onClick={() => {
                            if(window.confirm('ATENÇÃO: Tens a certeza? Todo o teu progresso, estrelas e conquistas serão apagados para sempre.')) {
                                onClearData();
                            }
                        }}
                        className="!bg-white !text-red-500 hover:!bg-red-50 !shadow-sm border border-red-100 px-6"
                    >
                        <Eraser size={16} className="mr-2" />
                        Apagar Tudo
                    </ClayButton>
                </div>
            </section>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end rounded-b-[2rem]">
            <ClayButton variant="primary" onClick={onClose} theme={theme} className="px-10 py-3 shadow-xl">
                Entendi
            </ClayButton>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;
