import React from 'react';
import { X, Shield, Lock, Database, Eraser } from 'lucide-react';
import { motion } from 'framer-motion';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearData: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onClearData }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 font-sans"
      >
        <div className="p-6 bg-indigo-600 text-white flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="text-yellow-400 fill-yellow-400" /> Política de Privacidade
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X /></button>
        </div>
        
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-8 text-slate-700">
            <section>
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-2">
                    <Database size={20} className="text-indigo-500" /> Armazenamento de Dados
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                    O <strong>Teclado Mágico</strong> utiliza o <strong>Armazenamento Local (LocalStorage)</strong> do teu navegador para guardar o teu progresso, estrelas, conquistas e estatísticas.
                    <br/><br/>
                    <strong>Segurança:</strong> Estes dados permanecem estritamente no teu dispositivo. Nós não temos servidores, base de dados, nem recolhemos o teu email, nome ou qualquer informação pessoal.
                </p>
            </section>

            <section>
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-2">
                    <Lock size={20} className="text-indigo-500" /> Inteligência Artificial (Gemini)
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                    Utilizamos a tecnologia Google Gemini para gerar frases criativas para os exercícios. 
                    Quando pedimos um exercício novo, enviamos apenas um pedido anónimo com as letras que estás a aprender (ex: "exercício com F e J"). 
                    Nenhum dado pessoal é partilhado com a Google durante este processo.
                </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-3">
                    <Eraser size={20} className="text-indigo-500" /> Controlo dos Teus Dados
                </h3>
                <p className="text-sm leading-relaxed mb-4 text-slate-600">
                    Respeitamos o RGPD (Regulamento Geral de Proteção de Dados). Como os dados estão no teu dispositivo, tu tens o controlo total.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="text-sm text-slate-500">
                        Se desejares reiniciar o jogo ou limpar os teus dados deste navegador:
                    </div>
                    <button 
                        onClick={() => {
                            if(window.confirm('ATENÇÃO: Tens a certeza? Todo o teu progresso, estrelas e conquistas serão apagados para sempre.')) {
                                onClearData();
                            }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition flex items-center gap-2"
                    >
                        <Eraser size={16} />
                        Apagar Tudo
                    </button>
                </div>
            </section>
        </div>
        
        <div className="p-4 bg-gray-50 border-t flex justify-end">
            <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-indigo-200">
                Entendi
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyModal;