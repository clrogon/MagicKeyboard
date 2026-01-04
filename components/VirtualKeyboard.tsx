import React from 'react';
import { motion } from 'framer-motion';
import { KEYBOARD_LAYOUTS, FINGER_NAMES, THEME_COLORS } from '../constants';
import { KeyConfig, Finger, Theme, KeyboardLayout } from '../types';
import { HandsDisplay } from './HandsDisplay';

interface VirtualKeyboardProps {
  activeKey: string | null;
  nextKey: string | null;
  theme?: Theme;
  showLabels?: boolean;
  layout?: KeyboardLayout;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, nextKey, theme = 'rose', showLabels = true, layout = 'qwerty' }) => {
  
  const colors = THEME_COLORS[theme];
  const currentLayout = KEYBOARD_LAYOUTS[layout] || KEYBOARD_LAYOUTS['qwerty'];

  const decomposeAccent = (char: string | null): [string | null, string | null, boolean] => {
      if (!char) return [null, null, false];
      
      const map: Record<string, [string, string, boolean]> = {
          'á': ['´', 'a', false], 'é': ['´', 'e', false], 'í': ['´', 'i', false], 'ó': ['´', 'o', false], 'ú': ['´', 'u', false],
          'Á': ['´', 'a', false], 'É': ['´', 'e', false], 'Í': ['´', 'i', false], 'Ó': ['´', 'o', false], 'Ú': ['´', 'u', false],
          'à': ['´', 'a', true], 'À': ['´', 'a', true],
          'ã': ['~', 'a', false], 'õ': ['~', 'o', false],
          'Ã': ['~', 'a', false], 'Õ': ['~', 'o', false],
          'â': ['~', 'a', true], 'ê': ['~', 'e', true], 'ô': ['~', 'o', true],
          'Â': ['~', 'a', true], 'Ê': ['~', 'e', true], 'Ô': ['~', 'o', true]
      };

      if (map[char]) return map[char];
      return [null, null, false];
  };

  const [requiredAccentKey, requiredBaseKey, accentNeedsShift] = decomposeAccent(activeKey);

  const getShiftRequirement = (char: string | null): 'ShiftLeft' | 'ShiftRight' | null => {
     if (!char) return null;

     if (accentNeedsShift) {
         return 'ShiftLeft';
     }
     
     if (layout === 'azerty' && /[0-9]/.test(char)) {
         return 'ShiftLeft'; 
     }
     
     if ("!\"#$%&/()=?*".includes(char)) {
         return 'ShiftRight'; 
     }
     
     if (char === char.toLowerCase() && !'!@#$%&*()_+{}|:"<>?`^'.includes(char)) return null; 
     
     if (char !== char.toLowerCase()) {
         const leftHandChars = layout === 'qwerty' ? "qwertasdfgzxcvbQWERTASDFGZXCVB" : "azertqsdfgwxcvbAZERTQSDFGWXCVB";
         return leftHandChars.includes(char) ? 'ShiftRight' : 'ShiftLeft';
     }
     return null;
  };

  const reqShift = getShiftRequirement(activeKey);

  const getFinger = (key: string | null): Finger | null => {
      if (!key) return null;
      if (key === ' ') return Finger.Thumb;

      const flat = currentLayout.flat();

      if (requiredAccentKey) {
          const accentKeyConfig = flat.find(k => k.char === requiredAccentKey);
          return accentKeyConfig ? accentKeyConfig.finger : null;
      }
      
      let found = flat.find(k => k.char === key.toLowerCase());
      
      if (!found) {
          found = flat.find(k => k.subLabel === key);
      }
      if (!found && layout === 'azerty') {
           found = flat.find(k => k.subLabel === key);
      }
      
      return found ? found.finger : null;
  }

  const activeFinger = getFinger(activeKey);

  const renderKey = (config: KeyConfig) => {
    let isActive = false;
    let isSemiActive = false;

    if (activeKey) {
        if (requiredAccentKey) {
            if (config.char === requiredAccentKey) isActive = true;
            if (config.char === requiredBaseKey) isSemiActive = true;

        } else {
            if (activeKey.toLowerCase() === config.char.toLowerCase()) isActive = true;
            if (config.subLabel === activeKey) isActive = true;
        }
    }
    
    if (config.char === 'ShiftLeft' && reqShift === 'ShiftLeft') isActive = true;
    if (config.char === 'ShiftRight' && reqShift === 'ShiftRight') isActive = true;

    const isNext = nextKey?.toLowerCase() === config.char.toLowerCase() || nextKey === config.subLabel;
    
    const styleWidth = config.width ? { width: `${config.width * 3.5}rem` } : {}; 

    const baseClasses = `
        relative flex flex-col items-center justify-center rounded-xl m-1
        h-12 md:h-14 lg:h-16
        ${!config.width && 'w-10 md:w-14 lg:w-16'}
        font-bold text-xl uppercase
        transition-all duration-150
        shadow-[0px_4px_0px_rgba(0,0,0,0.1),0px_6px_6px_rgba(0,0,0,0.05)]
    `;

    let visualClasses = "";
    let animateProps = {};
    
    if (isActive) {
        visualClasses = `
            ${colors.bg} text-white 
            shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2)] 
            translate-y-1 
            border ${colors.border}
        `;
        animateProps = { 
            scale: 0.98,
        };
    } else if (isSemiActive) {
        visualClasses = `
            ${colors.bgSoft} ${colors.text} 
            border-2 ${colors.border}
        `;
        animateProps = { scale: 1 };
    } else if (isNext) {
        visualClasses = `
            ${colors.bgSoft} ${colors.textSoft} 
            border-b-4 border-slate-100
        `;
        animateProps = { scale: 1, y: 0 };
    } else {
        visualClasses = `
            bg-white text-slate-400 
            shadow-[0px_4px_0px_#cbd5e1,0px_6px_6px_rgba(0,0,0,0.05)]
            hover:translate-y-[1px] hover:shadow-[0px_3px_0px_#cbd5e1,0px_5px_5px_rgba(0,0,0,0.05)]
        `;
        animateProps = { scale: 1, y: 0 };
    }
    
    const shouldShowLabel = showLabels || config.label === 'Shift';

    return (
      <motion.div
        key={config.char}
        style={config.width ? styleWidth : undefined}
        className={`${baseClasses} ${visualClasses}`}
        animate={animateProps}
        layout
      >
        {!isActive && <div className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none" />}
        
        {shouldShowLabel && (
            <>
                {config.subLabel && (
                    <span className={`absolute top-1 right-2 text-[10px] md:text-xs opacity-70 ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {config.subLabel}
                    </span>
                )}
                
                <span className={isActive ? 'drop-shadow-sm' : ''}>
                    {config.label || config.char}
                </span>
            </>
        )}
        
        {(config.char === 'f' || config.char === 'j') && (
            <div className={`absolute bottom-2 w-4 h-1 rounded-full ${isActive ? 'bg-black/20' : 'bg-slate-200'}`}></div>
        )}
      </motion.div>
    );
  };

  const renderSpaceBar = () => {
     const isActive = activeKey === ' ';
     const isNext = nextKey === ' ';
     
     let visualClasses = "";
     let animateProps = {};

     if (isActive) {
         visualClasses = `${colors.bg} text-white shadow-[inset_0px_2px_4px_rgba(0,0,0,0.2)] translate-y-1`;
         animateProps = { scale: 0.98 };
     } else if (isNext) {
         visualClasses = `${colors.bgSoft} ${colors.textSoft} border-b-4 border-slate-100`;
         animateProps = { scale: 1 };
     } else {
         visualClasses = `bg-white text-slate-400 shadow-[0px_4px_0px_#cbd5e1,0px_6px_6px_rgba(0,0,0,0.05)]`;
         animateProps = { scale: 1 };
     }

     return (
        <motion.div
            className={`
                h-12 md:h-14 lg:h-16 rounded-xl m-1 mt-2 w-1/2 mx-auto flex items-center justify-center
                font-bold tracking-widest text-sm md:text-base transition-all duration-150 relative
                ${visualClasses}
            `}
            animate={animateProps}
        >
             {!isActive && <div className="absolute top-1 left-4 right-4 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none" />}
            ESPAÇO
        </motion.div>
     )
  }

  return (
    <div className="perspective-1000 w-full max-w-4xl mx-auto mt-4">
        
        <div className="flex justify-center mb-4">
             <div className="bg-white/50 backdrop-blur-sm rounded-3xl px-8 py-2 flex items-center gap-6 shadow-sm border border-white/50">
                <div className="text-right hidden md:block">
                     <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Dedo Atual</div>
                     <div className={`text-sm font-bold ${colors.text} uppercase`}>{activeFinger ? FINGER_NAMES[activeFinger] : '...'}</div>
                </div>
                <div className="scale-75 md:scale-100 origin-center -my-4">
                    <HandsDisplay activeFinger={activeFinger} mode="active" theme={theme} />
                </div>
             </div>
        </div>

        <div 
            className="flex flex-col items-center select-none p-4 md:p-8 transform-style-3d rotate-x-12 origin-bottom transition-transform duration-500"
            style={{ transform: "rotateX(20deg)" }}
        >
            {currentLayout.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center w-full">
                {row.map(keyConfig => renderKey(keyConfig))}
                </div>
            ))}
            <div className="flex justify-center w-full">
                {renderSpaceBar()}
            </div>
            
            <div className="w-[90%] h-4 bg-black/10 blur-xl rounded-[50%] mt-4"></div>
        </div>
    </div>
  );
};

export default VirtualKeyboard;