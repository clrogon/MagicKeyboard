import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KEYBOARD_LAYOUT, FINGER_NAMES } from '../constants';
import { KeyConfig, Finger } from '../types';
import { Hand } from 'lucide-react';

interface VirtualKeyboardProps {
  activeKey: string | null;
  nextKey: string | null;
}

// Robust color mapping for Tailwind to ensure classes are picked up
// Added separate 'glow' colors for the active state gradient
const FINGER_STYLES: Record<Finger, { active: string; inactive: string; ring: string; text: string; badge: string; shadow: string; bgLight: string; border: string }> = {
    [Finger.LeftPinky]: { 
        active: 'from-pink-400 to-pink-600', 
        inactive: 'bg-slate-50 border-pink-200 text-pink-400', 
        ring: 'ring-pink-300',
        text: 'text-pink-600',
        badge: 'bg-pink-500',
        shadow: 'shadow-pink-200',
        bgLight: 'bg-pink-50',
        border: 'border-pink-300'
    },
    [Finger.LeftRing]: { 
        active: 'from-blue-400 to-blue-600', 
        inactive: 'bg-slate-50 border-blue-200 text-blue-400', 
        ring: 'ring-blue-300',
        text: 'text-blue-600',
        badge: 'bg-blue-500',
        shadow: 'shadow-blue-200',
        bgLight: 'bg-blue-50',
        border: 'border-blue-300'
    },
    [Finger.LeftMiddle]: { 
        active: 'from-emerald-400 to-emerald-600', 
        inactive: 'bg-slate-50 border-green-200 text-green-400', 
        ring: 'ring-green-300',
        text: 'text-green-600',
        badge: 'bg-green-500',
        shadow: 'shadow-green-200',
        bgLight: 'bg-green-50',
        border: 'border-green-300'
    },
    [Finger.LeftIndex]: { 
        active: 'from-yellow-400 to-yellow-600', 
        inactive: 'bg-slate-50 border-yellow-200 text-yellow-600', 
        ring: 'ring-yellow-300',
        text: 'text-yellow-600',
        badge: 'bg-yellow-500',
        shadow: 'shadow-yellow-200',
        bgLight: 'bg-yellow-50',
        border: 'border-yellow-300'
    },
    [Finger.RightIndex]: { 
        active: 'from-orange-400 to-orange-600', 
        inactive: 'bg-slate-50 border-orange-200 text-orange-400', 
        ring: 'ring-orange-300',
        text: 'text-orange-600',
        badge: 'bg-orange-500',
        shadow: 'shadow-orange-200',
        bgLight: 'bg-orange-50',
        border: 'border-orange-300'
    },
    [Finger.RightMiddle]: { 
        active: 'from-purple-400 to-purple-600', 
        inactive: 'bg-slate-50 border-purple-200 text-purple-400', 
        ring: 'ring-purple-300',
        text: 'text-purple-600',
        badge: 'bg-purple-500',
        shadow: 'shadow-purple-200',
        bgLight: 'bg-purple-50',
        border: 'border-purple-300'
    },
    [Finger.RightRing]: { 
        active: 'from-teal-400 to-teal-600', 
        inactive: 'bg-slate-50 border-teal-200 text-teal-400', 
        ring: 'ring-teal-300',
        text: 'text-teal-600',
        badge: 'bg-teal-500',
        shadow: 'shadow-teal-200',
        bgLight: 'bg-teal-50',
        border: 'border-teal-300'
    },
    [Finger.RightPinky]: { 
        active: 'from-red-400 to-red-600', 
        inactive: 'bg-slate-50 border-red-200 text-red-400', 
        ring: 'ring-red-300',
        text: 'text-red-600',
        badge: 'bg-red-500',
        shadow: 'shadow-red-200',
        bgLight: 'bg-red-50',
        border: 'border-red-300'
    },
    [Finger.Thumb]: { 
        active: 'from-slate-400 to-slate-600', 
        inactive: 'bg-slate-50 border-slate-200 text-slate-400', 
        ring: 'ring-slate-300',
        text: 'text-slate-500',
        badge: 'bg-slate-400',
        shadow: 'shadow-slate-200',
        bgLight: 'bg-slate-50',
        border: 'border-slate-300'
    }
};

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, nextKey }) => {
  
  // Helper to determine if a key requires Shift and which hand
  const getShiftRequirement = (char: string | null): 'ShiftLeft' | 'ShiftRight' | null => {
     if (!char) return null;
     if (char === char.toLowerCase() && !'!@#$%&*()_+{}|:"<>?'.includes(char)) return null; 
     
     if (char !== char.toLowerCase()) {
         const leftHandChars = "qwertasdfgzxcvbQWERTASDFGZXCVB";
         return leftHandChars.includes(char) ? 'ShiftRight' : 'ShiftLeft';
     }
     return null;
  };

  const reqShift = getShiftRequirement(activeKey);

  const getFinger = (key: string | null): Finger | null => {
      if (!key) return null;
      if (key === ' ') return Finger.Thumb;
      const flat = KEYBOARD_LAYOUT.flat();
      const found = flat.find(k => k.char === key.toLowerCase());
      return found ? found.finger : null;
  }

  const activeFinger = getFinger(activeKey);
  const nextFinger = getFinger(nextKey);

  const renderKey = (config: KeyConfig) => {
    let isActive = activeKey?.toLowerCase() === config.char.toLowerCase();
    
    // Handle Special logic for Shift Visualization
    if (config.char === 'ShiftLeft' && reqShift === 'ShiftLeft') isActive = true;
    if (config.char === 'ShiftRight' && reqShift === 'ShiftRight') isActive = true;
    if (activeKey === config.char) isActive = true; // For symbols

    const isNext = nextKey?.toLowerCase() === config.char.toLowerCase();
    const fingerStyle = FINGER_STYLES[config.finger];
    
    const styleWidth = config.width ? { width: `${config.width * 3.5}rem` } : {}; 

    // Base styling for 3D Key look
    const baseClasses = `
        relative flex items-center justify-center rounded-xl m-1
        h-10 md:h-14 lg:h-16
        ${!config.width && 'w-10 md:w-14 lg:w-16'}
        font-bold text-xl uppercase transition-all duration-150
        shadow-sm
    `;

    // Visual states: Active vs Next vs Inactive
    let visualClasses = "";
    
    if (isActive) {
        visualClasses = `bg-gradient-to-b ${fingerStyle.active} text-white shadow-lg shadow-${config.finger.split('-')[0]}-200/50 scale-110 -translate-y-2 z-20 border-t border-white/40 border-b-4 border-black/20`;
    } else if (isNext) {
        // NEXT Key: Subtle highlight using finger color
        visualClasses = `${fingerStyle.bgLight} ${fingerStyle.text} border-b-4 ${fingerStyle.border} ring-2 ring-offset-2 ${fingerStyle.ring} scale-100 z-10`;
    } else {
        // Inactive: Standard white key
        visualClasses = `bg-white text-slate-400 border-b-4 border-slate-200 hover:border-b-2 hover:translate-y-[2px]`;
    }
        
    return (
      <motion.div
        key={config.char}
        style={config.width ? styleWidth : undefined}
        className={`${baseClasses} ${visualClasses}`}
      >
        {/* Subtle inner highlight for active keys */}
        {isActive && <div className="absolute inset-x-2 top-0 h-[2px] bg-white/40 rounded-full"></div>}
        
        <span className={isActive ? 'drop-shadow-sm' : ''}>
             {config.label || config.char}
        </span>
        
        {/* Home Row bumps */}
        {(config.char === 'f' || config.char === 'j') && (
            <div className={`absolute bottom-2 w-4 h-1 rounded-full ${isActive ? 'bg-black/20' : 'bg-slate-300'}`}></div>
        )}
      </motion.div>
    );
  };

  const renderSpaceBar = () => {
     const isActive = activeKey === ' ';
     const isNext = nextKey === ' ';
     
     const styles = FINGER_STYLES[Finger.Thumb];
     
     let visualClasses = "";
     if (isActive) {
         visualClasses = `bg-gradient-to-b ${styles.active} text-white shadow-lg scale-102 -translate-y-1 border-t border-white/40 border-b-4 border-black/20`;
     } else if (isNext) {
         visualClasses = `${styles.bgLight} border-b-4 ${styles.border} ring-2 ring-offset-2 ${styles.ring}`;
     } else {
         visualClasses = `bg-white text-slate-400 border-b-4 border-slate-200`;
     }

     return (
        <motion.div
            className={`
                h-10 md:h-14 lg:h-16 rounded-xl m-1 mt-2 w-1/2 mx-auto flex items-center justify-center
                transition-all duration-150 font-bold tracking-widest text-sm md:text-base
                ${visualClasses}
            `}
        >
             {isActive && <div className="absolute inset-x-4 top-0 h-[2px] bg-white/40 rounded-full"></div>}
            ESPAÇO
        </motion.div>
     )
  }

  return (
    <div className="flex flex-col items-center select-none p-6 bg-white/60 backdrop-blur-xl rounded-[2rem] shadow-2xl max-w-4xl mx-auto border border-white/50">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center w-full">
          {row.map(keyConfig => renderKey(keyConfig))}
        </div>
      ))}
      <div className="flex justify-center w-full">
        {renderSpaceBar()}
      </div>
      
      {/* Dynamic Hand/Finger Guide Text */}
      <div className="mt-6 flex items-center justify-center gap-6 md:gap-12 min-h-[40px]">
         <AnimatePresence mode="wait">
            {activeFinger && (
                <motion.div 
                    key="active"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-white px-5 py-2 rounded-full border border-slate-200 shadow-sm"
                >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agora:</span>
                    <div className={`flex items-center gap-2 text-sm font-extrabold uppercase ${FINGER_STYLES[activeFinger].text}`}>
                        <Hand className="w-5 h-5 fill-current opacity-20" />
                        <span className={`w-3 h-3 rounded-full ${FINGER_STYLES[activeFinger].badge} ring-2 ring-white shadow-sm`}></span>
                        {FINGER_NAMES[activeFinger]}
                    </div>
                </motion.div>
            )}
         </AnimatePresence>

         {nextFinger && activeFinger !== nextFinger && (
             <motion.div 
                key="next"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="flex items-center gap-2 hidden md:flex"
             >
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">A seguir:</span>
                 <div className={`flex items-center gap-1 text-xs font-bold uppercase ${FINGER_STYLES[nextFinger].text}`}>
                    <span className={`w-2 h-2 rounded-full ${FINGER_STYLES[nextFinger].badge}`}></span>
                    {FINGER_NAMES[nextFinger].split(' ')[0]}
                </div>
             </motion.div>
         )}
      </div>
    </div>
  );
};

export default VirtualKeyboard;