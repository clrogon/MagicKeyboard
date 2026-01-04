
import React from 'react';
import { Theme } from '../types';

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean; // If true, renders in "pressed" state
  variant?: 'primary' | 'secondary' | 'neutral' | 'success'; // Visual style style
  theme?: Theme; // Color theme (rose, blue, amber) used for primary variants
}

/**
 * ClayButton Component
 * 
 * A reusable button component with a "claymorphism" (soft 3D plastic) aesthetic.
 * It supports dynamic theming and deep shadow states.
 */
export const ClayButton: React.FC<ClayButtonProps> = ({ 
    children, 
    active, 
    variant = 'primary', 
    theme = 'rose',
    className = '', 
    ...props 
}) => {
  const baseStyles = "relative transition-all duration-200 ease-in-out rounded-2xl font-bold flex items-center justify-center transform active:scale-95 overflow-hidden";
  
  // Dynamic shadows based on theme
  const getThemeStyles = () => {
    switch (theme) {
        case 'blue':
            return {
                primary: `bg-blue-400 text-white shadow-[inset_-4px_-4px_8px_rgba(30,60,180,0.2),inset_4px_4px_8px_rgba(255,255,255,0.4),0px_6px_12px_rgba(63,94,244,0.3)] hover:bg-blue-500 active:shadow-[inset_4px_4px_8px_rgba(20,40,150,0.3)]`,
                activeRing: `ring-blue-200`
            };
        case 'amber':
            return {
                primary: `bg-amber-400 text-white shadow-[inset_-4px_-4px_8px_rgba(180,100,30,0.2),inset_4px_4px_8px_rgba(255,255,255,0.4),0px_6px_12px_rgba(244,180,63,0.3)] hover:bg-amber-500 active:shadow-[inset_4px_4px_8px_rgba(150,80,20,0.3)]`,
                activeRing: `ring-amber-200`
            };
        case 'rose':
        default:
            return {
                primary: `bg-rose-400 text-white shadow-[inset_-4px_-4px_8px_rgba(180,30,60,0.2),inset_4px_4px_8px_rgba(255,255,255,0.4),0px_6px_12px_rgba(244,63,94,0.3)] hover:bg-rose-500 active:shadow-[inset_4px_4px_8px_rgba(150,20,40,0.3)]`,
                activeRing: `ring-rose-200`
            };
    }
  };

  const themeStyles = getThemeStyles();

  const variants = {
    primary: themeStyles.primary,
    secondary: `
        bg-white text-slate-600 
        shadow-[inset_-4px_-4px_10px_rgba(0,0,0,0.05),inset_4px_4px_10px_rgba(255,255,255,1),0px_4px_8px_rgba(0,0,0,0.05)]
        hover:bg-slate-50
        active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1)]
    `,
    neutral: `
        bg-slate-100 text-slate-400
        shadow-inner
    `,
    success: `
        bg-emerald-400 text-white
        shadow-[inset_-4px_-4px_8px_rgba(0,100,50,0.2),inset_4px_4px_8px_rgba(255,255,255,0.4),0px_6px_12px_rgba(16,185,129,0.3)]
        hover:bg-emerald-500
    `
  };

  const activeStyles = active 
    ? `ring-4 ${themeStyles.activeRing} ring-offset-2 scale-95 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.2)]` 
    : "";

  return (
    <button 
        className={`${baseStyles} ${variants[variant]} ${activeStyles} ${className}`} 
        {...props}
    >
       {/* Specular Highlight for Plastic Look */}
       <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-2xl pointer-events-none" />
       <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};
