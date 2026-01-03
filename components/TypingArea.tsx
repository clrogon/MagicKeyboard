import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level, SessionResult, GameMode, ErrorStats } from '../types';
import VirtualKeyboard from './VirtualKeyboard';
import { Play, RotateCcw, Star, Timer } from 'lucide-react';
import { generateSmartExercise } from '../services/geminiService';

interface TypingAreaProps {
  level: Level;
  mode: GameMode;
  errorStats?: ErrorStats;
  timeLimit?: number; // seconds
  onComplete: (result: SessionResult, errors: ErrorStats, corrects: ErrorStats) => void;
  onExit: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ level, mode, errorStats, timeLimit, onComplete, onExit }) => {
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
    const newText = await generateSmartExercise(level, mode, errorStats);
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
  }, [level, mode, errorStats, timeLimit]);

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
    // Sliding window logic
    const visibleStart = Math.max(0, currentIndex - 20);
    const visibleEnd = visibleStart + 40;
    const displayText = text.slice(visibleStart, visibleEnd);

    return (
      <div className="flex flex-wrap justify-center gap-1 text-4xl md:text-5xl font-bold mb-8 font-mono leading-relaxed min-h-[100px] content-center">
        {displayText.split('').map((char, idx) => {
          let statusColor = "text-gray-300";
          let statusBg = "bg-transparent";
          let actualIdx = visibleStart + idx;
          
          if (actualIdx < currentIndex) {
             statusColor = "text-green-500";
          } else if (actualIdx === currentIndex) {
             statusColor = "text-blue-600";
             statusBg = "bg-blue-100 border-b-4 border-blue-400 rounded";
          }

          return (
            <span key={idx} className={`${statusColor} ${statusBg} w-10 h-14 md:w-12 md:h-16 flex items-center justify-center transition-colors duration-75`}>
              {char === ' ' ? '␣' : char}
            </span>
          );
        })}
      </div>
    );
  };

  if (loading) {
     return <div className="flex items-center justify-center h-full text-2xl font-bold text-blue-500 animate-pulse">A preparar Desafio...</div>
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-6 px-4 bg-sky-50">
        {/* Header / HUD */}
        <div className="w-full max-w-4xl flex justify-between items-center mb-8">
            <button onClick={onExit} className="flex items-center gap-2 text-gray-500 hover:text-red-500 font-bold bg-white px-4 py-2 rounded-full shadow-sm">
                <RotateCcw size={20} /> Sair
            </button>
            <div className="flex gap-4">
                 {mode === GameMode.Timed && (
                    <div className={`flex flex-col items-center px-4 py-2 rounded-xl shadow-sm ${timeLeft && timeLeft < 10 ? 'bg-red-100 animate-pulse' : 'bg-white'}`}>
                        <span className="text-xs text-gray-400 uppercase font-bold">Tempo</span>
                        <div className="flex items-center gap-1 text-xl font-bold text-orange-600">
                             <Timer size={20} />
                             {timeLeft}s
                        </div>
                    </div>
                 )}
                <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm">
                   <span className="text-xs text-gray-400 uppercase font-bold">
                       {mode === GameMode.ErrorDrill ? 'Foco no Erro' : 'Nível'}
                   </span>
                   <span className="text-xl font-bold text-blue-600">{mode === GameMode.Campaign ? level.id : 'Treino'}</span>
                </div>
                <div className="flex flex-col items-center bg-white px-4 py-2 rounded-xl shadow-sm">
                   <span className="text-xs text-gray-400 uppercase font-bold">Erros</span>
                   <span className={`text-xl font-bold ${sessionErrors > 0 ? 'text-red-500' : 'text-green-500'}`}>{sessionErrors}</span>
                </div>
            </div>
        </div>

        {/* Main Text Area */}
        <div className="flex-1 flex flex-col justify-center items-center w-full max-w-5xl">
            {mode === GameMode.Timed && (
                <div className="text-gray-400 text-sm mb-4 font-semibold uppercase tracking-widest">
                    Corre contra o tempo!
                </div>
            )}
            {renderText()}
            
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
        <div className="w-full mb-8">
            <VirtualKeyboard 
                activeKey={text[currentIndex]} 
                nextKey={text[currentIndex + 1]} 
            />
        </div>
        
        <div className="text-center text-gray-400 text-sm font-semibold">
           {mode === GameMode.Campaign && level.id >= 6 
                ? "Usa o SHIFT para as maiúsculas (dedo mindinho oposto!)" 
                : "Mantém as mãos na posição base! (F e J têm tracinhos)"}
        </div>
    </div>
  );
};

export default TypingArea;