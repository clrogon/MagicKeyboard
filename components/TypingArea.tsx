import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level, SessionResult, GameMode, ErrorStats, Finger } from '../types';
import { KEYBOARD_LAYOUT, FINGER_NAMES } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, Timer } from 'lucide-react';
import { generateSmartExercise } from '../services/geminiService';

interface TypingAreaProps {
  level: Level;
  mode: GameMode;
  errorStats?: ErrorStats;
  timeLimit?: number; // seconds
  difficultyModifier?: 'normal' | 'hard';
  onComplete: (result: SessionResult, errors: ErrorStats, corrects: ErrorStats) => void;
  onExit: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ level, mode, errorStats, timeLimit, difficultyModifier = 'normal', onComplete, onExit }) => {
  const [text, setText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [sessionErrors, setSessionErrors] = useState(0);
  const [sessionErrorMap, setSessionErrorMap] = useState<ErrorStats>({});
  const [sessionCorrectMap, setSessionCorrectMap] = useState<ErrorStats>({}); // Track correct keystrokes
  const [typedChars, setTypedChars] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit || null);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);

  // Initialize Level
  const initLevel = useCallback(async () => {
    setLoading(true);
    const newText = await generateSmartExercise(level, mode, errorStats, difficultyModifier as 'normal' | 'hard');
    setText(newText);
    setCurrentIndex(0);
    setSessionErrors(0);
    setSessionErrorMap({});
    setSessionCorrectMap({});
    setTypedChars("");
    setStartTime(null);
    setLoading(false);
    
    if (timeLimit) {
        setTimeLeft(timeLimit);
    }
    
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [level, mode, errorStats, timeLimit, difficultyModifier]);

  useEffect(() => {
    initLevel();
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [initLevel]);

  // Keep focus
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading) inputRef.current?.focus();
    }, 1000);
    return () => clearInterval(interval);
  }, [loading]);

  // Timer Logic
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

  useEffect(() => {
      if (timeLeft === 0 && startTime) {
          finishLevel();
      }
  }, [timeLeft]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Controlled input placeholder
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        return;
    }
    
    if (loading || (timeLeft === 0)) return;

    const char = e.key;
    const targetChar = text[currentIndex];

    if (char.length > 1 && char !== 'Backspace' && !['Shift'].includes(char)) return; 
    if (char === 'Shift' || char === 'Alt' || char === 'Control' || char === 'CapsLock') return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (char === 'Backspace') {
       return;
    }

    if (char === targetChar) { // Case sensitive match
      // Correct
      setTypedChars(prev => prev + char);
      
      // Track correct stats for decay
      setSessionCorrectMap(prev => ({
          ...prev,
          [targetChar]: (prev[targetChar] || 0) + 1
      }));

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= text.length) {
        if (mode === GameMode.Timed) {
            // In timed mode, append text to loop
            setText(prev => prev + " " + prev);
        } else {
            finishLevel();
        }
      }
    } else {
      // Error
      setSessionErrors(prev => prev + 1);
      
      // Track specific error
      setSessionErrorMap(prev => ({
          ...prev,
          [targetChar]: (prev[targetChar] || 0) + 1
      }));
    }
  };

  const finishLevel = () => {
    const endTime = Date.now();
    let durationMin = 0;
    
    if (mode === GameMode.Timed && timeLimit) {
        durationMin = timeLimit / 60;
    } else {
        durationMin = (endTime - (startTime || endTime)) / 60000;
    }
    
    // Stats
    const totalTyped = currentIndex;
    const grossWpm = Math.round((totalTyped / 5) / (durationMin || 0.001)); 
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - sessionErrors) / totalTyped) * 100) : 0;
    
    let stars: 1 | 2 | 3 = 1;
    if (grossWpm >= level.minWpm && accuracy >= level.minAccuracy) stars = 3;
    else if (accuracy >= level.minAccuracy) stars = 2;

    onComplete({
      levelId: level.id,
      mode: mode,
      wpm: grossWpm,
      accuracy: Math.max(0, accuracy),
      date: new Date().toISOString(),
      stars,
      duration: durationMin * 60,
      correctStats: sessionCorrectMap
    }, sessionErrorMap, sessionCorrectMap);
  };

  const renderText = () => {
    // Sliding window logic optimized for focus
    const visibleStart = Math.max(0, currentIndex - 12); 
    const visibleEnd = visibleStart + 25;
    const displayText = text.slice(visibleStart, visibleEnd);

    return (
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 text-4xl md:text-5xl font-bold font-mono leading-relaxed min-h-[140px] content-center py-8 px-4">
        {displayText.split('').map((char, idx) => {
          const actualIdx = visibleStart + idx;
          const isCurrent = actualIdx === currentIndex;
          const isNext = actualIdx === currentIndex + 1;
          const isPast = actualIdx < currentIndex;
          const dist = Math.abs(currentIndex - actualIdx);
          
          // Dynamic styling based on position relative to cursor
          let className = "relative flex items-center justify-center rounded-xl transition-all duration-300 ease-out ";
          let style: React.CSSProperties = {};

          if (isCurrent) {
             // PROMINENT ACTIVE CHARACTER - Enhanced
             className += "w-16 h-22 md:w-20 md:h-28 bg-white shadow-2xl shadow-blue-500/30 z-20 text-blue-600 border-b-4 border-blue-500 transform -translate-y-2 md:-translate-y-4 ring-4 ring-blue-100 scale-105";
             style.textShadow = "0px 2px 0px rgba(0,0,0,0.1)";
          } else {
             // Default size for non-active
             className += "w-10 h-16 md:w-12 md:h-20 ";
             
             if (isPast) {
                // GRADUAL FADE FOR HISTORY - More gradual
                className += "text-emerald-600 border-b-2 border-transparent ";
                // Opacity drops off slower (factor 0.1 instead of 0.15)
                style.opacity = Math.max(0.25, 1 - (dist * 0.10));
                style.filter = `blur(${Math.min(1.5, dist * 0.15)}px)`;
             } else if (isNext) {
                // NEXT CHARACTER HIGHLIGHT
                className += "text-slate-600 bg-white/60 border-b-2 border-slate-300 shadow-sm ";
                style.opacity = 0.9;
             } else {
                // FUTURE CHARACTERS
                className += "text-slate-400 border-b-2 border-slate-200/50 ";
                // Slight fade for further future chars
                style.opacity = Math.max(0.4, 0.9 - (dist * 0.03));
             }
          }

          return (
            <motion.span 
                key={actualIdx} // Key must be actual index to preserve identity during slide
                layout
                initial={false}
                style={style}
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
     return <div className="flex items-center justify-center h-screen text-2xl font-bold text-blue-500 animate-pulse">A preparar Desafio...</div>
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-6 px-4 bg-transparent">
        {/* Header / HUD */}
        <div className="w-full max-w-5xl flex justify-between items-center mb-6">
            <button onClick={onExit} className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-bold bg-white/80 backdrop-blur px-5 py-2 rounded-2xl shadow-sm hover:shadow transition">
                <RotateCcw size={20} /> Sair
            </button>
            <div className="flex gap-4">
                 {mode === GameMode.Timed && (
                    <div className={`flex flex-col items-center px-4 py-2 rounded-2xl shadow-sm ${timeLeft && timeLeft < 10 ? 'bg-red-100 animate-pulse' : 'bg-white/80 backdrop-blur'}`}>
                        <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Tempo</span>
                        <div className="flex items-center gap-1 text-xl font-bold text-orange-600">
                             <Timer size={20} />
                             {timeLeft}s
                        </div>
                    </div>
                 )}
                <div className="flex flex-col items-center bg-white/80 backdrop-blur px-5 py-2 rounded-2xl shadow-sm">
                   <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                       {mode === GameMode.ErrorDrill ? 'Foco no Erro' : 'Nível'}
                   </span>
                   <span className="text-xl font-bold text-blue-600">{mode === GameMode.Campaign ? level.id : 'Treino'}</span>
                </div>
                 {difficultyModifier === 'hard' && (
                    <div className="flex flex-col items-center bg-orange-100/90 backdrop-blur px-5 py-2 rounded-2xl shadow-sm border border-orange-200">
                        <span className="text-xs text-orange-600 uppercase font-bold tracking-wider">Modo</span>
                        <span className="text-xl font-bold text-orange-700">Difícil 🌶️</span>
                    </div>
                 )}
                <div className="flex flex-col items-center bg-white/80 backdrop-blur px-5 py-2 rounded-2xl shadow-sm">
                   <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Erros</span>
                   <span className={`text-xl font-bold ${sessionErrors > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>{sessionErrors}</span>
                </div>
            </div>
        </div>

        {/* Main Text Area Stage */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl">
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 p-2 md:p-8 relative overflow-hidden"
            >
                {/* Decorative top gloss */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                
                {mode === GameMode.Timed && (
                    <div className="text-center text-slate-400 text-sm mb-2 font-bold uppercase tracking-widest">
                        Corre contra o tempo!
                    </div>
                )}
                
                {renderText()}
            </motion.div>
            
            <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute top-0"
                value={typedChars}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onBlur={() => setTimeout(() => inputRef.current?.focus(), 10)}
                autoFocus
            />
        </div>

        {/* Visual Keyboard */}
        <div className="w-full mb-4 mt-8">
            <VirtualKeyboard 
                activeKey={text[currentIndex]} 
                nextKey={text[currentIndex + 1]} 
            />
        </div>
        
        <div className="text-center text-slate-500 text-sm font-semibold bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm mt-4">
           {mode === GameMode.Campaign && level.id >= 6 
                ? "Usa o SHIFT para as maiúsculas (dedo mindinho oposto!)" 
                : "Mantém as mãos na posição base! (F e J têm tracinhos)"}
        </div>
    </div>
  );
};

export default TypingArea;