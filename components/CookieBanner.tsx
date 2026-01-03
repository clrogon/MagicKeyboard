import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { motion } from 'framer-motion';

interface CookieBannerProps {
  onOpenPolicy: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPolicy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center pointer-events-none"
    >
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-5 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto ring-1 ring-black/5">
            <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-500 shadow-inner">
                    <Cookie size={28} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1">Usamos bolachas (cookies)! 🍪</h4>
                    <p className="text-xs md:text-sm text-slate-500 max-w-xl leading-relaxed">
                        Utilizamos o armazenamento local para guardar o teu progresso e conquistas. 
                        É seguro, privado e não recolhemos dados pessoais.
                    </p>
                </div>
            </div>
            <div className="flex gap-3 shrink-0 w-full md:w-auto">
                <button 
                    onClick={onOpenPolicy}
                    className="flex-1 md:flex-none px-4 py-3 text-xs md:text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
                >
                    Saber Mais
                </button>
                <button 
                    onClick={handleAccept}
                    className="flex-1 md:flex-none px-6 py-3 text-xs md:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200 transition transform active:scale-95"
                >
                    Aceitar e Jogar!
                </button>
            </div>
        </div>
    </motion.div>
  );
};

export default CookieBanner;