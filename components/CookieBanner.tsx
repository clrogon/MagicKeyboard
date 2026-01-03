
import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClayButton } from './ClayButton';
import { Theme } from '../types';

interface CookieBannerProps {
  onOpenPolicy: () => void;
  theme?: Theme;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPolicy, theme = 'rose' }) => {
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
        <div className="bg-white/80 backdrop-blur-xl border border-white shadow-[0px_10px_30px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 max-w-4xl w-full flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto ring-1 ring-black/5">
            <div className="flex items-start gap-5">
                <div className="bg-orange-100 p-4 rounded-2xl text-orange-500 shadow-inner shrink-0">
                    <Cookie size={32} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-1 fun-font">Usamos bolachas (cookies)! 🍪</h4>
                    <p className="text-sm text-slate-500 max-w-xl leading-relaxed font-medium">
                        Utilizamos o armazenamento local para guardar o teu progresso e conquistas. 
                        É seguro, privado e não recolhemos dados pessoais.
                    </p>
                </div>
            </div>
            <div className="flex gap-3 shrink-0 w-full md:w-auto">
                <ClayButton 
                    variant="secondary"
                    onClick={onOpenPolicy}
                    theme={theme}
                    className="flex-1 md:flex-none px-6 py-3"
                >
                    Saber Mais
                </ClayButton>
                <ClayButton 
                    variant="primary"
                    onClick={handleAccept}
                    theme={theme}
                    className="flex-1 md:flex-none px-8 py-3"
                >
                    Aceitar e Jogar!
                </ClayButton>
            </div>
        </div>
    </motion.div>
  );
};

export default CookieBanner;
