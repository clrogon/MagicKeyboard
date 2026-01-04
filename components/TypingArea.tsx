
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level, SessionResult, GameMode, ErrorStats, Theme } from '../types';
import { ClayButton } from './ClayButton';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, Timer, X, Check, EyeOff } from 'lucide-react';
import { generateSmartExercise } from '../services/geminiService';
import { THEME_COLORS } from '../constants';

interface TypingAreaProps {
  level: Level;
  mode: GameMode;
  errorStats?: ErrorStats;
  timeLimit?: number; // seconds (for Timed mode)
  difficultyModifier?: 'normal' | 'hard';
  blindMode?: boolean; // New Phase 4 Feature: Hide key labels
  theme: Theme;
  onComplete: (result: SessionResult, errors: ErrorStats, corrects: ErrorStats) => void;
  onExit: () => void;
}

/**
 * TypingArea Component
 * 
 * The core game loop component. Handles:
 * 1. AI Text Generation via 'initLevel'
 * 2. Input capture (using a hidden input field for mobile compatibility)
 * 3. Real-time validation (Hit/Miss)
 * 4. WPM, Accuracy AND Consistency calculation (Phase 4)
 * 5. Timer logic (for Timed mode)
 */
const TypingArea: React.FC<TypingAreaProps> = ({ 
    level, mode, errorStats, timeLimit, difficultyModifier = 'normal', blindMode = false, theme, onComplete, onExit 
}) => {
  const [text, setText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Session Stats
  const [sessionErrors, setSessionErrors] = useState(0); 
  const [sessionErrorMap, setSessionErrorMap] = useState<ErrorStats>({}); 
  const [sessionCorrectMap, setSessionCorrectMap] = useState<ErrorStats>({}); 
  
  // Rhythm/Consistency Tracking (Phase 4)
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const [keystrokeIntervals, setKeystrokeIntervals] = useState<number[]>([]);

  const [typedChars, setTypedChars] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit || null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  const colors = THEME_COLORS[theme];

  // Initialize Level: Calls AI service
  const initLevel = useCallback(async () => {
    setLoading(true);
    const newText = await generateSmartExercise(level, mode, errorStats, difficultyModifier as 'normal' | 'hard');
    setText(newText);
    setCurrentIndex(0);
    setSessionErrors(0);
    setSessionErrorMap({});
    setSessionCorrectMap({});
    setKeystrokeIntervals([]);
    setLastKeystrokeTime(null);
    setTypedChars("");
    setStartTime(null);
    setLoading(false);
    
    if (timeLimit) {
        setTimeLeft(timeLimit);
    }
    
    // Focus hack to ensure keyboard is ready
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [level, mode, errorStats, timeLimit, difficultyModifier]);

  useEffect(() => {
    initLevel();
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [initLevel]);

  // Maintain focus on hidden input to capture keystrokes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) inputRef.current?.focus();
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  // Timer Countdown Logic
  useEffect(() => {
    if (startTime && timeLimit && timeLeft !== null) {
        timerRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev === null || prev <= 0) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, timeLimit]);

  // Auto-finish when time runs out
  useEffect(() => {
      if (timeLeft === 0 && startTime) {
          finishLevel();
      }
  }, [timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Controlled input handler is empty because we use onKeyDown for granular control 
  };

  /**
   * Main Input Handler
   * Compares key press against target char.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        return;
    }
    
    if (loading || (timeLeft === 0)) return;

    const char = e.key;
    const targetChar = text[currentIndex];

    // Ignore modifier keys or multi-char events (except Backspace if we supported it)
    if (char.length > 1 && char !== 'Backspace' && !['Shift'].includes(char)) return; 
    if (char === 'Shift' || char === 'Alt' || char === 'Control' || char === 'CapsLock') return;

    const now = Date.now();

    // Start timer on first keypress
    if (!startTime) {
      setStartTime(now);
      setLastKeystrokeTime(now);
    }

    // Disable Backspace (Pedagogical choice: forces forward momentum)
    if (char === 'Backspace') {
       return;
    }

    if (char === targetChar) { // Case sensitive match
      // -- CORRECT HIT --
      setTypedChars(prev => prev + char);
      
      // Phase 4: Rhythm Tracking
      if (lastKeystrokeTime) {
          const interval = now - lastKeystrokeTime;
          // Filter out unnaturally long pauses (e.g., getting water) for calculating pure rhythm
          if (interval < 2000) { 
              setKeystrokeIntervals(prev => [...prev, interval]);
          }
      }
      setLastKeystrokeTime(now);

      // Track correct stats (Used to heal/decay the error history)
      setSessionCorrectMap(prev => ({
          ...prev,
          [targetChar]: (prev[targetChar] || 0) + 1
      }));

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check Completion
      if (nextIndex >= text.length) {
        if (mode === GameMode.Timed) {
            // In timed mode, append text to loop infinitely until time runs out
            setText(prev => prev + " " + prev);
        } else {
            finishLevel();
        }
      }
    } else {
      // -- ERROR --
      setSessionErrors(prev => prev + 1);
      
      // Track specific error for the "Error Drill" mode generation
      setSessionErrorMap(prev => ({
          ...prev,
          [targetChar]: (prev[targetChar] || 0) + 1
      }));
    }
  };

  /**
   * Calculates final stats and triggers parent callback.
   */
  const finishLevel = () => {
    const endTime = Date.now();
    let durationMin = 0;
    
    if (mode === GameMode.Timed && timeLimit) {
        durationMin = timeLimit / 60;
    } else {
        durationMin = (endTime - (startTime || endTime)) / 60000;
    }
    
    // Stats Calculation
    const totalTyped = currentIndex;
    const grossWpm = Math.round((totalTyped / 5) / (durationMin || 0.001)); 
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - sessionErrors) / totalTyped) * 100) : 0;
    
    // Phase 4: Consistency Calculation (CV based)
    let consistency = 100;
    if (keystrokeIntervals.length > 2) {
        const mean = keystrokeIntervals.reduce((a, b) => a + b, 0) / keystrokeIntervals.length;
        const variance = keystrokeIntervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / keystrokeIntervals.length;
        const stdDev = Math.sqrt(variance);
        // CV = Coefficient of Variation. Lower is better.
        // CV of 0.1 is amazing. CV of 0.5 is choppy.
        const cv = stdDev / (mean || 1); 
        // Map CV to 0-100 score. 
        // Logic: 0 CV = 100 score. 0.5 CV = 50 score. >1 CV = 0 score.
        consistency = Math.max(0, Math.round(100 - (cv * 100)));
    }

    // Star Rating Logic
    let stars: 1 | 2 | 3 = 1;
    if (grossWpm >= level.minWpm && accuracy >= level.minAccuracy) stars = 3;
    else if (accuracy >= level.minAccuracy) stars = 2;

    onComplete({
      levelId: level.id,
      mode: mode,
      wpm: grossWpm,
      accuracy: Math.max(0, accuracy),
      consistency: consistency,
      date: new Date().toISOString(),
      stars,
      duration: durationMin * 60,
      correctStats: sessionCorrectMap
    }, sessionErrorMap, sessionCorrectMap);
  };

  // Renders the scrolling text area
  const renderText = () => {
    const visibleStart = Math.max(0, currentIndex - 8); 
    const visibleEnd = visibleStart + 16;
    const displayText = text.slice(visibleStart, visibleEnd);

    return (
      <div className="flex flex-wrap justify-center gap-2 text-4xl md:text-5xl font-bold font-mono leading-relaxed min-h-[160px] content-center py-8 px-4">
        {displayText.split('').map((char, idx) => {
          const actualIdx = visibleStart + idx;
          const isCurrent = actualIdx === currentIndex;
          const isNext = actualIdx === currentIndex + 1;
          const isPast = actualIdx < currentIndex;
          
          let className = "relative flex items-center justify-center rounded-2xl transition-all duration-200 ";
          
          if (isCurrent) {
             // Active Cursor Card (Scale up + Theme Color)
             className += `w-16 h-20 md:w-20 md:h-24 ${colors.bg} text-white shadow-xl ${colors.shadow} z-10 scale-110`;
          } else {
             className += "w-12 h-16 md:w-14 md:h-20 ";
             
             if (isPast) {
                className += "text-emerald-400 opacity-50"; // Completed chars
             } else if (isNext) {
                className += "text-slate-600 bg-white border-2 border-slate-100"; // Upcoming chars
             } else {
                className += "text-slate-300"; // Distant future chars
             }
          }

          return (
            <motion.span 
                key={actualIdx}
                layout
                initial={false}
                className={className}
            >
              {char === ' ' ? '␣' : char}
            </motion.span>
          );
        })}
      </div>
    );
  };

  if (loading) {
     return <div className={`flex items-center justify-center h-[50vh] text-2xl font-bold ${colors.textSoft} animate-pulse`}>A preparar o palco...</div>
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen pb-10 px-4">
        {/* Header / HUD */}
        <div className="w-full max-w-5xl flex justify-between items-center py-6">
            <ClayButton variant="secondary" onClick={onExit} className="px-4 py-2 text-sm">
                <RotateCcw size={16} className="mr-2" /> Sair
            </ClayButton>
            
            <div className="flex gap-4">
                 {/* Blind Mode Indicator */}
                 {blindMode && (
                    <div className="bg-slate-800 text-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm animate-pulse">
                        <EyeOff size={18} />
                        <span className="font-bold text-sm uppercase">Modo Cego</span>
                    </div>
                 )}

                 {mode === GameMode.Timed && (
                    <div className={`bg-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm ${colors.text}`}>
                        <Timer size={20} />
                        <span className="font-bold text-xl">{timeLeft}s</span>
                    </div>
                 )}
                
                <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-white">
                   <div className="flex items-center gap-2 px-3">
                       <div className={`${colors.bgSoft} p-1.5 rounded-full ${colors.text}`}><X size={14} strokeWidth={3} /></div>
                       <span className={`text-lg font-bold ${colors.text}`}>{sessionErrors}</span>
                   </div>
                   <div className="w-px h-6 bg-slate-200"></div>
                   <div className="flex items-center gap-2 px-3">
                       <span className="text-xs font-bold text-slate-400 uppercase">Nível</span>
                       <span className="text-lg font-bold text-slate-600">{mode === GameMode.Campaign ? level.id : 'Treino'}</span>
                   </div>
                </div>
            </div>
        </div>

        {/* Typing Stage */}
        <div className="flex-1 w-full max-w-4xl flex flex-col justify-center items-center">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-white rounded-[3rem] shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.05)] border border-white p-4 md:p-8 relative overflow-hidden"
            >
                {/* Stage Light Effect */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 ${colors.bg} opacity-5 blur-3xl rounded-full pointer-events-none`}></div>
                
                {mode === GameMode.Timed && (
                    <div className={`text-center ${colors.textSoft} text-sm mb-4 font-bold uppercase tracking-widest`}>
                        Modo Rápido
                    </div>
                )}
                
                {renderText()}
            </motion.div>
            
            {/* Hidden input sink to capture keyboard events on mobile/desktop */}
            <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute top-0 pointer-events-none"
                value={typedChars}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => inputRef.current?.focus(), 10)}
                autoFocus
            />
        </div>

        {/* 3D Keyboard */}
        <div className="w-full">
            <VirtualKeyboard 
                activeKey={text[currentIndex]} 
                nextKey={text[currentIndex + 1]} 
                theme={theme}
                showLabels={!blindMode} // Pass Blind Mode toggle
            />
        </div>
        
    </div>
  );
};

export default TypingArea;
