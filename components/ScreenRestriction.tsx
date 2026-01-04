
import React from 'react';
import { Monitor, Keyboard, Smartphone, X } from 'lucide-react';

/**
 * ScreenRestriction Component
 * 
 * This component acts as a "Gatekeeper" for the application.
 * Pedagogically, Touch Typing cannot be learned on a handheld mobile phone screen
 * because it requires 10 fingers and a physical keyboard.
 * 
 * Logic:
 * - Visible by default (Mobile First).
 * - Hidden on 'md' screens (Tablets/Desktops > 768px width).
 * - Also visible on Landscape Mobile screens (Height < 500px) via custom CSS class.
 * 
 * DeX/Monitor Support:
 * - If a phone is connected to a monitor, the viewport resizes to desktop standards,
 *   automatically hiding this component.
 */
const ScreenRestriction: React.FC = () => {
  // We use a state to allow teachers/parents to temporarily bypass this 
  // if they just want to check stats on their phone.
  const [bypassed, setBypassed] = React.useState(false);

  if (bypassed) return null;

  return (
    <>
      <style>
        {`
          /* Default: Hidden on large screens */
          .screen-warning { display: flex; }
          
          /* Hide on Tablets and Desktops (Width > 768px) */
          @media (min-width: 768px) {
            .screen-warning { display: none; }
          }

          /* BUT: Show again if the screen is too short (Mobile Landscape) */
          /* Even if width is > 768px (like a Max phone), height is usually < 500px */
          @media (max-height: 500px) {
            .screen-warning { display: flex !important; }
          }
        `}
      </style>

      <div className="screen-warning fixed inset-0 z-[100] bg-rose-500 text-white flex-col items-center justify-center p-8 text-center overflow-y-auto">
        <div className="max-w-md w-full flex flex-col items-center gap-6">
            
            {/* Icons Animation */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                    <Smartphone size={64} className="text-rose-200" strokeWidth={1.5} />
                    <div className="absolute -top-2 -right-2 bg-white text-rose-500 rounded-full p-1">
                        <X size={20} strokeWidth={3} />
                    </div>
                </div>
                <div className="w-16 h-1 bg-white/30 rounded-full"></div>
                <Monitor size={64} className="text-white animate-pulse" strokeWidth={1.5} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold fun-font leading-tight">
                O Teclado Mágico precisa de espaço!
            </h1>

            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <p className="text-lg font-medium leading-relaxed mb-4">
                    Para aprenderes a teclar como um profissional, precisas de um <strong className="text-yellow-300">teclado físico</strong> e de ver bem as tuas mãos no ecrã.
                </p>
                
                <div className="flex flex-col gap-3 text-sm text-rose-100 text-left bg-rose-900/20 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                        <Keyboard className="shrink-0 mt-0.5" size={18} />
                        <span>Não é possível aprender "Touch Typing" num telemóvel (ecrã tátil).</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <Monitor className="shrink-0 mt-0.5" size={18} />
                        <span>Se estás a usar um telemóvel, experimenta ligá-lo a um <strong>Monitor Externo</strong> ou usa um Computador/Tablet.</span>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <button 
                    onClick={() => setBypassed(true)}
                    className="text-xs text-rose-200 hover:text-white underline decoration-rose-300/50 hover:decoration-white transition-all"
                >
                    Sou um Professor/Pai e quero apenas ver as definições
                </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default ScreenRestriction;
