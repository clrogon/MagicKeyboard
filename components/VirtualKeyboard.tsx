
import React from 'react';
import { motion } from 'framer-motion';
import { KEYBOARD_LAYOUT, FINGER_NAMES, THEME_COLORS } from '../constants';
import { KeyConfig, Finger, Theme } from '../types';
import { HandsDisplay } from './HandsDisplay';

interface VirtualKeyboardProps {
  activeKey: string | null; // The character the user needs to type next
  nextKey: string | null;   // The character after the active key (for preview)
  theme?: Theme;
  showLabels?: boolean;     // If false, hides the character labels (Blind Mode)
}

/**
 * VirtualKeyboard Component
 * 
 * Renders a 3D-style keyboard that visualizes:
 * 1. The key to be pressed (Active state)
 * 2. The next key in queue (Next state)
 * 3. The correct finger to use via the <HandsDisplay /> integration.
 * 4. Shift key logic.
 * 5. Accent/Dead Key logic (Highlights accent key if user needs to type 'á', 'ã', etc).
 */
const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, nextKey, theme = 'rose', showLabels = true }) => {
  
  const colors = THEME_COLORS[theme];

  // Helper: Decompose an accented character into its Accent Key and Base Key components
  // Returns [AccentChar, BaseChar, ShiftRequiredForAccent]
  const decomposeAccent = (char: string | null): [string | null, string | null, boolean] => {
      if (!char) return [null, null, false];
      
      const map: Record<string, [string, string, boolean]> = {
          // Acute (´) - No Shift on standard PT
          'á': ['´', 'a', false], 'é': ['´', 'e', false], 'í': ['´', 'i', false], 'ó': ['´', 'o', false], 'ú': ['´', 'u', false],
          'Á': ['´', 'a', false], 'É': ['´', 'e', false], 'Í': ['´', 'i', false], 'Ó': ['´', 'o', false], 'Ú': ['´', 'u', false],
          
          // Grave (`) - Shift + Acute Key
          'à': ['´', 'a', true], 'À': ['´', 'a', true],
          
          // Tilde (~) - No Shift on standard PT (Key right of Ç)
          'ã': ['~', 'a', false], 'õ': ['~', 'o', false],
          'Ã': ['~', 'a', false], 'Õ': ['~', 'o', false],
          
          // Circumflex (^) - Shift + Tilde Key
          'â': ['~', 'a', true], 'ê': ['~', 'e', true], 'ô': ['~', 'o', true],
          'Â': ['~', 'a', true], 'Ê': ['~', 'e', true], 'Ô': ['~', 'o', true]
      };

      if (map[char]) return map[char];
      return [null, null, false];
  };

  const [requiredAccentKey, requiredBaseKey, accentNeedsShift] = decomposeAccent(activeKey);

  // Logic: Determine if 'activeKey' is an uppercase letter or special symbol requiring Shift.
  // Returns 'ShiftLeft' or 'ShiftRight' based on standard typing ergonomics (cross-hand shift).
  const getShiftRequirement = (char: string | null): 'ShiftLeft' | 'ShiftRight' | null => {
     if (!char) return null;

     // Special Case: Accents that require shift (Grave ` and Circumflex ^)
     if (accentNeedsShift) {
         // Both accent keys are on the Right side (Pinky), so use Left Shift
         return 'ShiftLeft';
     }
     
     // Symbol Handling (Manual Map based on PT-PT standard/constants)
     if ("!\"#$%&/()=?*".includes(char)) {
         return 'ShiftRight'; 
     }
     
     // Uppercase Check
     if (char === char.toLowerCase() && !'!@#$%&*()_+{}|:"<>?`^'.includes(char)) return null; 
     
     if (char !== char.toLowerCase()) {
         // Standard typing rule: Use opposite hand for Shift
         // If key is on left side (QWERT...), use Right Shift.
         const leftHandChars = "qwertasdfgzxcvbQWERTASDFGZXCVB";
         return leftHandChars.includes(char) ? 'ShiftRight' : 'ShiftLeft';
     }
     return null;
  };

  const reqShift = getShiftRequirement(activeKey);

  // Map the active char to the correct Finger enum
  const getFinger = (key: string | null): Finger | null => {
      if (!key) return null;
      if (key === ' ') return Finger.Thumb;

      // If it's an accented char, return the finger for the ACCENT key first (teaching the order)
      if (requiredAccentKey) {
          const flat = KEYBOARD_LAYOUT.flat();
          const accentKeyConfig = flat.find(k => k.char === requiredAccentKey);
          return accentKeyConfig ? accentKeyConfig.finger : null;
      }
      
      const flat = KEYBOARD_LAYOUT.flat();
      
      // Try direct char match (case insensitive)
      let found = flat.find(k => k.char === key.toLowerCase());
      
      // If not found, try subLabel match (for ! " # etc)
      if (!found) {
          found = flat.find(k => k.subLabel === key);
      }
      
      return found ? found.finger : null;
  }

  const activeFinger = getFinger(activeKey);

  const renderKey = (config: KeyConfig) => {
    let isActive = false;
    let isSemiActive = false; // Used for the base key when an accent is active

    if (activeKey) {
        if (requiredAccentKey) {
            // -- Diacritic Mode --
            // 1. Highlight the Accent Key (e.g., ´ or ~)
            if (config.char === requiredAccentKey) isActive = true;
            
            // 2. Semi-Highlight the Base Key (e.g., 'a') to show connection
            if (config.char === requiredBaseKey) isSemiActive = true;

        } else {
            // -- Standard Mode --
            if (activeKey.toLowerCase() === config.char.toLowerCase()) isActive = true;
            if (config.subLabel === activeKey) isActive = true;
        }
    }
    
    // Handle Special logic for Shift Visualization
    if (config.char === 'ShiftLeft' && reqShift === 'ShiftLeft') isActive = true;
    if (config.char === 'ShiftRight' && reqShift === 'ShiftRight') isActive = true;

    const isNext = nextKey?.toLowerCase() === config.char.toLowerCase() || nextKey === config.subLabel;
    
    const styleWidth = config.width ? { width: `${config.width * 3.5}rem` } : {}; 

    // Base styling for 3D Key look (Plastic/Clay style)
    const baseClasses = `
        relative flex flex-col items-center justify-center rounded-xl m-1
        h-12 md:h-14 lg:h-16
        ${!config.width && 'w-10 md:w-14 lg:w-16'}
        font-bold text-xl uppercase
        transition-all duration-150
        shadow-[0px_4px_0px_rgba(0,0,0,0.1),0px_6px_6px_rgba(0,0,0,0.05)]
    `;

    // Visual states: Active vs Next vs Inactive
    let visualClasses = "";
    let animateProps = {};
    
    if (isActive) {
        // Active: Theme Color, Pressed down (translate-y)
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
        // Semi-Active: Showing the base letter for an accent combo
        visualClasses = `
            ${colors.bgSoft} ${colors.text} 
            border-2 ${colors.border}
        `;
        animateProps = { scale: 1 };
    } else if (isNext) {
        // Next: Slight highlight (Hint)
        visualClasses = `
            ${colors.bgSoft} ${colors.textSoft} 
            border-b-4 border-slate-100
        `;
        animateProps = { scale: 1, y: 0 };
    } else {
        // Inactive: White "Plastic"
        visualClasses = `
            bg-white text-slate-400 
            shadow-[0px_4px_0px_#cbd5e1,0px_6px_6px_rgba(0,0,0,0.05)]
            hover:translate-y-[1px] hover:shadow-[0px_3px_0px_#cbd5e1,0px_5px_5px_rgba(0,0,0,0.05)]
        `;
        animateProps = { scale: 1, y: 0 };
    }
    
    // Always show label for Shift, or if showLabels is true (Blind Mode logic)
    const shouldShowLabel = showLabels || config.label === 'Shift';

    return (
      <motion.div
        key={config.char}
        style={config.width ? styleWidth : undefined}
        className={`${baseClasses} ${visualClasses}`}
        animate={animateProps}
        layout
      >
        {/* Specular highlight for plastic feel */}
        {!isActive && <div className="absolute top-1 left-2 right-2 h-1/3 bg-gradient-to-b from-white/60 to-transparent rounded-t-lg pointer-events-none" />}
        
        {shouldShowLabel && (
            <>
                {/* SubLabel (Shift Character) - shown smaller at top right */}
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
        
        {/* Tactile Bumps on F and J */}
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
        
        {/* Active Finger Display integrated into the HUD area above the keyboard */}
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

        {/* 3D Keyboard Container with Perspective Transform */}
        <div 
            className="flex flex-col items-center select-none p-4 md:p-8 transform-style-3d rotate-x-12 origin-bottom transition-transform duration-500"
            style={{ transform: "rotateX(20deg)" }}
        >
            {KEYBOARD_LAYOUT.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center w-full">
                {row.map(keyConfig => renderKey(keyConfig))}
                </div>
            ))}
            <div className="flex justify-center w-full">
                {renderSpaceBar()}
            </div>
            
            {/* Floor Shadow for 3D effect */}
            <div className="w-[90%] h-4 bg-black/10 blur-xl rounded-[50%] mt-4"></div>
        </div>
    </div>
  );
};

export default VirtualKeyboard;
