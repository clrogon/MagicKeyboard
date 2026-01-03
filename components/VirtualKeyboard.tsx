import React from 'react';
import { motion } from 'framer-motion';
import { KEYBOARD_LAYOUT } from '../constants';
import { KeyConfig, Finger } from '../types';

interface VirtualKeyboardProps {
  activeKey: string | null;
  nextKey: string | null;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ activeKey, nextKey }) => {
  
  // Helper to determine if a key requires Shift and which hand
  // Standard Typing: 
  // Left Hand Keys (Q,W,E,R,T, A,S,D,F,G, Z,X,C,V,B) -> Right Shift
  // Right Hand Keys (Y,U,I,O,P, H,J,K,L,Ç, N,M,Comma,Dot) -> Left Shift
  const getShiftRequirement = (char: string | null): 'ShiftLeft' | 'ShiftRight' | null => {
     if (!char) return null;
     if (char === char.toLowerCase() && !'!@#$%&*()_+{}|:"<>?'.includes(char)) return null; // Logic for symbols needed, simplified for now
     
     // Check if it's a known char that needs shift
     // Simple heuristic: Uppercase needs shift
     if (char !== char.toLowerCase()) {
         const leftHandChars = "qwertasdfgzxcvbQWERTASDFGZXCVB";
         return leftHandChars.includes(char) ? 'ShiftRight' : 'ShiftLeft';
     }
     return null;
  };

  const reqShift = getShiftRequirement(activeKey);

  const getKeyColor = (finger: Finger, isActive: boolean, isNext: boolean) => {
    // Tailwind color mapping
    const baseColors: Record<Finger, string> = {
        [Finger.LeftPinky]: 'bg-pink-500',
        [Finger.LeftRing]: 'bg-blue-500',
        [Finger.LeftMiddle]: 'bg-green-500',
        [Finger.LeftIndex]: 'bg-yellow-500',
        [Finger.RightIndex]: 'bg-orange-500',
        [Finger.RightMiddle]: 'bg-purple-500',
        [Finger.RightRing]: 'bg-teal-500',
        [Finger.RightPinky]: 'bg-red-500',
        [Finger.Thumb]: 'bg-gray-400'
    };
    
    // Lighter pastel versions for inactive state
    const inactiveColors: Record<Finger, string> = {
        [Finger.LeftPinky]: 'bg-pink-100 border-pink-200 text-pink-400',
        [Finger.LeftRing]: 'bg-blue-100 border-blue-200 text-blue-400',
        [Finger.LeftMiddle]: 'bg-green-100 border-green-200 text-green-400',
        [Finger.LeftIndex]: 'bg-yellow-100 border-yellow-200 text-yellow-600',
        [Finger.RightIndex]: 'bg-orange-100 border-orange-200 text-orange-400',
        [Finger.RightMiddle]: 'bg-purple-100 border-purple-200 text-purple-400',
        [Finger.RightRing]: 'bg-teal-100 border-teal-200 text-teal-400',
        [Finger.RightPinky]: 'bg-red-100 border-red-200 text-red-400',
        [Finger.Thumb]: 'bg-gray-100 border-gray-200 text-gray-400'
    };

    if (isActive) return `${baseColors[finger]} text-white shadow-lg scale-110 ring-4 ring-white`;
    if (isNext) return `${inactiveColors[finger]} ring-2 ring-${finger.split('-')[0]}-300`;
    return inactiveColors[finger];
  };

  const renderKey = (config: KeyConfig) => {
    // Is this key the specific character to type?
    let isActive = activeKey?.toLowerCase() === config.char.toLowerCase();
    
    // Handle Special logic for Shift Visualization
    if (config.char === 'ShiftLeft' && reqShift === 'ShiftLeft') isActive = true;
    if (config.char === 'ShiftRight' && reqShift === 'ShiftRight') isActive = true;

    // Handle symbols matching (e.g. if active is '.', config char is '.')
    if (activeKey === config.char) isActive = true;

    const isNext = nextKey?.toLowerCase() === config.char.toLowerCase();
    
    const widthClass = config.width ? `w-${Math.floor(config.width * 10)} md:w-${Math.floor(config.width * 14)}` : 'w-10 md:w-14 lg:w-16';
    const styleWidth = config.width ? { width: `${config.width * 3.5}rem` } : {}; // Fallback for custom widths if tailwind classes missing

    return (
      <motion.div
        key={config.char}
        animate={isActive ? { scale: 1.1, y: -2 } : { scale: 1, y: 0 }}
        style={config.width ? styleWidth : undefined}
        className={`
          relative flex items-center justify-center rounded-lg m-1
          h-10 md:h-14 lg:h-16
          ${!config.width && 'w-10 md:w-14 lg:w-16'}
          border-b-4 font-bold text-xl uppercase transition-colors duration-100
          ${getKeyColor(config.finger, isActive, isNext)}
          ${(config.char === 'f' || config.char === 'j') ? 'underline decoration-2 underline-offset-4' : ''}
        `}
      >
        {config.label || config.char}
      </motion.div>
    );
  };

  const renderSpaceBar = () => {
     const isActive = activeKey === ' ';
     return (
        <motion.div
            animate={isActive ? { scale: 1.02, y: -2 } : { scale: 1, y: 0 }}
            className={`
                h-10 md:h-14 lg:h-16 rounded-lg m-1 mt-2 border-b-4 w-1/2 mx-auto flex items-center justify-center
                transition-colors duration-100
                ${isActive ? 'bg-gray-500 text-white' : 'bg-gray-100 border-gray-200 text-gray-300'}
            `}
        >
            SPACE
        </motion.div>
     )
  }

  return (
    <div className="flex flex-col items-center select-none p-4 bg-white rounded-2xl shadow-xl max-w-4xl mx-auto">
      {KEYBOARD_LAYOUT.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center w-full">
          {row.map(keyConfig => renderKey(keyConfig))}
        </div>
      ))}
      <div className="flex justify-center w-full">
        {renderSpaceBar()}
      </div>
      
      {/* Hand/Finger Guide Text */}
      <div className="mt-6 flex gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span> Esq
         </div>
         <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span> Dir
         </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
