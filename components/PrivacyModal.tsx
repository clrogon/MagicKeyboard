
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
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 font-sans border border-white"
      >
        <div className={`p-6 ${colors.bg} text-white flex justify-between items-center relative overflow-hidden`}>
             {/* Header Shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 rounded-t-[2.5rem] pointer-events-none"></div>

            <h2 className="text-2xl font-bold flex items-center gap-2 relative z-10">
                <Shield className="text-yellow-300 fill-yellow-300" /> Política de Privacidade
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition relative z-10"><X /></button>
        </div>
        
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 text-slate-700 bg-stone-50">
            <section className="bg-white p-6 rounded-[2rem] shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-slate-100">
                <h3 className={`text-lg font-bold ${colors.text} flex items-center gap-2 mb-3`}>
                    <Database size={20} /> Armazenamento de Dados
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                    O <strong>Teclado Mágico</strong> utiliza o <strong>Armazenamento Local (LocalStorage)</strong> do teu navegador para guardar o teu progresso, estrelas, conquistas e estatísticas.
                    <br/><br/>
                    <strong>Segurança:</strong> Estes dados permanecem estritamente no teu dispositivo. Nós não temos servidores, base de dados, nem recolhemos o teu email, nome ou qualquer informação pessoal.
                </p>
            </section>

            <section className="bg-white p-6 rounded-[2rem] shadow-[0px_4px_10px_rgba(0,0,0,0.03)] border border-slate-100">
                <h3 className={`text-lg font-bold ${colors.text} flex items-center gap-2 mb-3`}>
                    <Lock size={20} /> Inteligência Artificial (Gemini)
                </h3>
                <p className="text-sm leading-relaxed text-slate-500">
                    Utilizamos a tecnologia Google Gemini para gerar frases criativas para os exercícios. 
                    Quando pedimos um exercício novo, enviamos apenas um pedido anónimo com as letras que estás a aprender (ex: "exercício com F e J"). 
                    Nenhum dado pessoal é partilhado com a Google durante este processo.
                </p>
            </section>

            <section className={`${colors.bgSoft} p-6 rounded-[2rem] border ${colors.border}`}>
                <h3 className={`text-lg font-bold ${colors.text} flex items-center gap-2 mb-3`}>
                    <Eraser size={20} /> Controlo dos Teus Dados
                </h3>
                <p className="text-sm leading-relaxed mb-6 text-slate-600">
                    Respeitamos o RGPD. Como os dados estão no teu dispositivo, tu tens o controlo total.
                </p>
                
                <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border ${colors.border} shadow-sm`}>
                    <div className="text-sm text-slate-400 font-medium">
                        Desejas reiniciar o jogo ou limpar dados?
                    </div>
                    <ClayButton 
                        variant="secondary"
                        onClick={() => {
                            if(window.confirm('ATENÇÃO: Tens a certeza? Todo o teu progresso, estrelas e conquistas serão apagados para sempre.')) {
                                onClearData();
                            }
                        }}
                        className="!bg-red-50 !text-red-500 hover:!bg-red-100 !shadow-none border border-red-100"
                    >
                        <Eraser size={16} className="mr-2" />
                        Apagar Tudo
                    </ClayButton>
                </div>
            </section>
        </div>
        
        <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
            <ClayButton variant="primary" onClick={onClose} theme={theme} className="px-8 py-3">
                Entendi
            </ClayButton>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;
