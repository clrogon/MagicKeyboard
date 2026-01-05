
import React from 'react';
import { Finger, Theme } from '../types';

interface HandsDisplayProps {
  activeFinger?: Finger | null;
  mode?: 'guide' | 'active'; // 'guide' shows all colors, 'active' highlights only the active finger
  className?: string;
  scale?: number;
  theme?: Theme;
}

// Cores mais vibrantes e distintas para as crianças
const FINGER_COLORS: Record<Finger, string> = {
  [Finger.LeftPinky]: '#ec4899',   // Pink-500
  [Finger.LeftRing]: '#3b82f6',    // Blue-500
  [Finger.LeftMiddle]: '#22c55e',  // Green-500
  [Finger.LeftIndex]: '#eab308',   // Yellow-500
  [Finger.Thumb]: '#94a3b8',       // Slate-400 (Polegares neutros)
  [Finger.RightIndex]: '#f97316',  // Orange-500
  [Finger.RightMiddle]: '#a855f7', // Purple-500
  [Finger.RightRing]: '#14b8a6',   // Teal-500
  [Finger.RightPinky]: '#f43f5e',  // Rose-500
};

const THEME_SKIN_TONES: Record<Theme, { fill: string; stroke: string; shadow: string }> = {
  rose: { fill: '#ffe4e6', stroke: '#fda4af', shadow: '#fecdd3' }, // Rose base
  blue: { fill: '#e0f2fe', stroke: '#bae6fd', shadow: '#bfdbfe' }, // Blue base
  amber: { fill: '#fef3c7', stroke: '#fde68a', shadow: '#fde68a' }, // Amber base
};

export const HandsDisplay: React.FC<HandsDisplayProps> = ({ 
    activeFinger, 
    mode = 'active', 
    className = '',
    scale = 1,
    theme = 'rose'
}) => {

  const skin = THEME_SKIN_TONES[theme];

  const LeftHandPaths = {
      wrist: "M45,180 Q45,140 50,125 L150,125 Q155,140 155,180", 
      pinky: "M30,125 C20,125 15,65 35,65 C55,65 50,125 45,125",
      ring: "M60,120 C50,120 45,40 70,40 C95,40 90,120 85,120",
      middle: "M95,115 C85,115 80,30 110,30 C140,30 135,115 125,115",
      index: "M135,120 C125,120 125,45 150,45 C175,45 170,120 165,120",
      thumb: "M160,135 C160,125 205,135 195,160 C185,175 160,165 160,160"
  };

  const LeftNails = {
      pinky: "M28,75 Q35,70 42,75 Q35,82 28,75",
      ring: "M58,50 Q70,45 82,50 Q70,58 58,50",
      middle: "M95,40 Q110,35 125,40 Q110,48 95,40",
      index: "M138,55 Q150,50 162,55 Q150,63 138,55",
      thumb: "M180,142 Q188,146 184,154 Q176,150 180,142"
  };

  const RightHandPaths = {
      wrist: "M355,180 Q355,140 350,125 L250,125 Q245,140 245,180",
      pinky: "M370,125 C380,125 385,65 365,65 C345,65 350,125 355,125",
      ring: "M340,120 C350,120 355,40 330,40 C305,40 310,120 315,120",
      middle: "M305,115 C315,115 320,30 290,30 C260,30 265,115 275,115",
      index: "M265,120 C275,120 275,45 250,45 C225,45 230,120 235,120",
      thumb: "M240,135 C240,125 195,135 205,160 C215,175 240,165 240,160"
  };

  const RightNails = {
      pinky: "M372,75 Q365,70 358,75 Q365,82 372,75",
      ring: "M342,50 Q330,45 318,50 Q330,58 342,50",
      middle: "M305,40 Q290,35 275,40 Q290,48 305,40",
      index: "M262,55 Q250,50 238,55 Q250,63 262,55",
      thumb: "M220,142 Q212,146 216,154 Q224,150 220,142"
  };

  const renderFinger = (path: string, nailPath: string, finger: Finger) => {
    const isActive = mode === 'guide' || activeFinger === finger;
    const color = isActive ? FINGER_COLORS[finger] : skin.fill;
    const stroke = isActive ? 'none' : skin.stroke;
    
    return (
        <g key={finger} className="transition-all duration-300">
            <path 
                d={path} 
                fill={color} 
                stroke={stroke}
                strokeWidth="2"
                className={`transition-all duration-300 ${isActive ? 'filter drop-shadow-md brightness-105' : ''}`}
            />
            <path 
                d={nailPath} 
                fill={isActive ? 'rgba(255,255,255,0.7)' : skin.shadow} 
                className="transition-colors duration-300"
            />
            {activeFinger === finger && mode === 'active' && (
                <>
                    <path 
                        d={path} 
                        fill="none" 
                        stroke={color} 
                        strokeWidth="3" 
                        strokeOpacity="0.5"
                        className="animate-ping"
                        style={{ animationDuration: '1.5s' }}
                    />
                     <path 
                        d={nailPath}
                        fill="white"
                        fillOpacity="0.4"
                        className="animate-pulse"
                    />
                </>
            )}
        </g>
    );
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
        <svg 
            width={400 * scale} 
            height={200 * scale} 
            viewBox="0 0 400 200" 
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
        >
            <g transform="translate(0, 10)">
                <path d={LeftHandPaths.wrist} fill={skin.fill} stroke={skin.stroke} strokeWidth="2" />
                {renderFinger(LeftHandPaths.pinky, LeftNails.pinky, Finger.LeftPinky)}
                {renderFinger(LeftHandPaths.ring, LeftNails.ring, Finger.LeftRing)}
                {renderFinger(LeftHandPaths.middle, LeftNails.middle, Finger.LeftMiddle)}
                {renderFinger(LeftHandPaths.index, LeftNails.index, Finger.LeftIndex)}
                {renderFinger(LeftHandPaths.thumb, LeftNails.thumb, Finger.Thumb)}
            </g>
            <g transform="translate(0, 10)">
                <path d={RightHandPaths.wrist} fill={skin.fill} stroke={skin.stroke} strokeWidth="2" />
                {renderFinger(RightHandPaths.pinky, RightNails.pinky, Finger.RightPinky)}
                {renderFinger(RightHandPaths.ring, RightNails.ring, Finger.RightRing)}
                {renderFinger(RightHandPaths.middle, RightNails.middle, Finger.RightMiddle)}
                {renderFinger(RightHandPaths.index, RightNails.index, Finger.RightIndex)}
                {renderFinger(RightHandPaths.thumb, RightNails.thumb, Finger.Thumb)}
            </g>
            {mode === 'active' && !activeFinger && (
                <text x="200" y="190" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold" fontFamily="Nunito" className="uppercase tracking-widest opacity-50">
                    Mãos em repouso
                </text>
            )}
        </svg>
    </div>
  );
};
