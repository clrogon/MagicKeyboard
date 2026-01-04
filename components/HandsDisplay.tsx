import React from 'react';
import { Finger, Theme } from '../types';

interface HandsDisplayProps {
  activeFinger?: Finger | null;
  mode?: 'guide' | 'active'; // 'guide' shows all colors, 'active' highlights only the active finger
  className?: string;
  scale?: number;
  theme?: Theme;
}

const FINGER_COLORS: Record<Finger, string> = {
  [Finger.LeftPinky]: '#f472b6', // pink-400
  [Finger.LeftRing]: '#60a5fa', // blue-400
  [Finger.LeftMiddle]: '#4ade80', // green-400
  [Finger.LeftIndex]: '#facc15', // yellow-400
  [Finger.Thumb]: '#cbd5e1', // slate-300
  [Finger.RightIndex]: '#fb923c', // orange-400
  [Finger.RightMiddle]: '#a78bfa', // purple-400
  [Finger.RightRing]: '#2dd4bf', // teal-400
  [Finger.RightPinky]: '#f43f5e', // rose-500
};

const THEME_TINTS: Record<Theme, string> = {
  rose: '#ffe4e6', // rose-100
  blue: '#dbeafe', // blue-100
  amber: '#fef3c7', // amber-100
};

export const HandsDisplay: React.FC<HandsDisplayProps> = ({ 
    activeFinger, 
    mode = 'active', 
    className = '',
    scale = 1,
    theme = 'rose'
}) => {

  const tintColor = THEME_TINTS[theme];

  const getFingerColor = (finger: Finger) => {
      if (mode === 'guide') {
          return FINGER_COLORS[finger];
      }
      return activeFinger === finger ? FINGER_COLORS[finger] : 'transparent';
  };

  const getStrokeColor = (finger: Finger) => {
      if (mode === 'guide') return '#fff';
      return activeFinger === finger ? '#fff' : '#cbd5e1';
  };

  // Left Hand
  const LeftPinky = "M20,80 C15,75 10,50 15,40 C18,35 25,35 28,40 L28,85";
  const LeftRing = "M32,85 L32,30 C32,22 42,22 42,30 L42,85";
  const LeftMiddle = "M46,85 L46,20 C46,12 56,12 56,20 L56,85";
  const LeftIndex = "M60,85 L60,30 C60,22 70,22 70,30 L70,88";
  const LeftThumb = "M75,90 L95,70 C100,65 110,75 100,85 L80,105";
  const LeftPalm = "M20,80 L80,105 L80,140 C80,150 30,150 20,130 Z";

  // Right Hand
  const RightPinky = "M180,80 C185,75 190,50 185,40 C182,35 175,35 172,40 L172,85";
  const RightRing = "M168,85 L168,30 C168,22 158,22 158,30 L158,85";
  const RightMiddle = "M154,85 L154,20 C154,12 144,12 144,20 L144,85";
  const RightIndex = "M140,85 L140,30 C140,22 130,22 130,30 L130,88";
  const RightThumb = "M125,90 L105,70 C100,65 90,75 100,85 L120,105";
  const RightPalm = "M180,80 L120,105 L120,140 C120,150 170,150 180,130 Z";

  const renderFinger = (path: string, finger: Finger) => (
      <path 
        d={path} 
        fill={getFingerColor(finger)} 
        stroke={getStrokeColor(finger)}
        strokeWidth="3"
        opacity={1}
        className="transition-all duration-200"
      />
  );

  const renderBackgroundLayer = () => (
      <g className="opacity-80">
        <path d={LeftPalm} fill={tintColor} stroke="none" />
        <path d={LeftPinky} fill={tintColor} stroke="none" />
        <path d={LeftRing} fill={tintColor} stroke="none" />
        <path d={LeftMiddle} fill={tintColor} stroke="none" />
        <path d={LeftIndex} fill={tintColor} stroke="none" />
        <path d={LeftThumb} fill={tintColor} stroke="none" />

        <path d={RightPalm} fill={tintColor} stroke="none" />
        <path d={RightPinky} fill={tintColor} stroke="none" />
        <path d={RightRing} fill={tintColor} stroke="none" />
        <path d={RightMiddle} fill={tintColor} stroke="none" />
        <path d={RightIndex} fill={tintColor} stroke="none" />
        <path d={RightThumb} fill={tintColor} stroke="none" />
      </g>
  );

  return (
    <div className={`flex justify-center items-center ${className}`}>
        <svg 
            width={200 * scale} 
            height={160 * scale} 
            viewBox="0 0 200 160" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {renderBackgroundLayer()}
            <g className="filter drop-shadow-sm">
                <path d={LeftPalm} fill="transparent" stroke="#e2e8f0" strokeWidth="2" />
                {renderFinger(LeftPinky, Finger.LeftPinky)}
                {renderFinger(LeftRing, Finger.LeftRing)}
                {renderFinger(LeftMiddle, Finger.LeftMiddle)}
                {renderFinger(LeftIndex, Finger.LeftIndex)}
                {renderFinger(LeftThumb, Finger.Thumb)}

                <path d={RightPalm} fill="transparent" stroke="#e2e8f0" strokeWidth="2" />
                {renderFinger(RightPinky, Finger.RightPinky)}
                {renderFinger(RightRing, Finger.RightRing)}
                {renderFinger(RightMiddle, Finger.RightMiddle)}
                {renderFinger(RightIndex, Finger.RightIndex)}
                {renderFinger(RightThumb, Finger.Thumb)}
            </g>
        </svg>
    </div>
  );
};