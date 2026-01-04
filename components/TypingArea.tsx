
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level, SessionResult, GameMode, ErrorStats, Theme } from '../types';
import { ClayButton } from './ClayButton';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, Timer, X, Play, Info, EyeOff } from 'lucide-react';
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
 * 2. Pre-Game Briefing (Explanation of goals)
 * 3. Input capture (using a hidden input field for mobile compatibility)
 * 4. Real-time validation (Hit/Miss)
 * 5. WPM, Accuracy AND Consistency calculation
 * 6. Timer logic (for Timed mode)
 */
const TypingArea: React.FC<TypingAreaProps> = ({ 
    level, mode, errorStats, timeLimit, difficultyModifier = 'normal', blindMode = false, theme, onComplete, onExit 
}) => {
  // Game State
  const [isBriefing, setIsBriefing] = useState(true); // Start in Briefing mode
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
    
    // Safety Timeout: If AI takes too long (>8s), force enable the button with fallback
    const safetyTimeout = setTimeout(() => {
        setLoading((currentLoading) => {
            if (currentLoading) {
                console.warn("AI generation timed out, using fallback.");
                setText(level.textSamples[0]);
                return false;
            }
            return currentLoading;
        });
    }, 8000);

    try {
        const newText = await generateSmartExercise(level, mode, errorStats, difficultyModifier as 'normal' | 'hard');
        clearTimeout(safetyTimeout);
        setText(newText);
        setLoading(false);
    } catch (e) {
        clearTimeout(safetyTimeout);
        console.error("Level init error:", e);
        setText(level.textSamples[0]);
        setLoading(false);
    }

    // Reset Game State
    setCurrentIndex(0);
    setSessionErrors(0);
    setSessionErrorMap({});
    setSessionCorrectMap({});
    setKeystrokeIntervals([]);
    setLastKeystrokeTime(null);
    setTypedChars("");
    setStartTime(null);
    
    if (timeLimit) {
        setTimeLeft(timeLimit);
    }
  }, [level, mode, errorStats, timeLimit, difficultyModifier]);

  useEffect(() => {
    initLevel();
    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [initLevel]);

  // Maintain focus on hidden input to capture keystrokes (Only when NOT in briefing)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !isBriefing) inputRef.current?.focus();
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, isBriefing]);

  // Timer Countdown Logic
  useEffect(() => {
    if (startTime && timeLimit && timeLeft !== null && !isBriefing) {
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
  }, [startTime, timeLimit, isBriefing]);

  // Auto-finish when time runs out
  useEffect(() => {
      if (timeLeft === 0 && startTime) {
          finishLevel();
      }
  }, [timeLeft]);

  const handleStartGame = () => {
      setIsBriefing(false);
      // Slight delay to ensure DOM update before focus
      setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
     // Controlled input handler is empty because we use onKeyDown for granular control 
  };

  /**
   * Main Input Handler
   * Compares key press against target char.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore if briefing or loading
    if (loading || isBriefing || (timeLeft === 0)) return;

    // Ignore navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        return;
    }

    const char = e.key;
    const targetChar = text[currentIndex];

    // Ignore modifier keys or multi-char events
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
          if (interval < 2000) { 
              setKeystrokeIntervals(prev => [...prev, interval]);
          }
      }
      setLastKeystrokeTime(now);

      // Track correct stats
      setSessionCorrectMap(prev => ({
          ...prev,
          [targetChar]: (prev[targetChar] || 0) + 1
      }));

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Check Completion
      if (nextIndex >= text.length) {
        if (mode === GameMode.Timed) {
            setText(prev => prev + " " + prev);
        } else {
            finishLevel();
        }
      }
    } else {
      // -- ERROR --
      setSessionErrors(prev => prev + 1);
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
    
    // Phase 4: Consistency Calculation
    let consistency = 100;
    if (keystrokeIntervals.length > 2) {
        const mean = keystrokeIntervals.reduce((a, b) => a + b, 0) / keystrokeIntervals.length;
        const variance = keystrokeIntervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / keystrokeIntervals.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / (mean || 1); 
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

  // Render the Briefing Overlay (Now a Fixed Modal)
  const renderBriefing = () => {
      // Determine what to show based on mode
      let title = level.title;
      let description = level.description;
      let goal = "Chega ao fim do exercício para passares de nível!";
      let keys = level.newKeys;

      if (mode === GameMode.Timed) {
          title = "Desafio de Tempo";
          description = "Escreve o máximo que conseguires antes que o tempo acabe!";
          goal = "Mantém a velocidade e não pares!";
          keys = [];
      } else if (mode === GameMode.ErrorDrill) {
          title = "Treino de Erros";
          description = "Vamos focar nas teclas onde tens mais dificuldade.";
          goal = "Atenção redobrada para eliminar erros!";
          keys = [];
      } else if (mode === GameMode.Story) {
          title = "Hora do Conto";
          description = "Escreve uma pequena história completa.";
          goal = "Lê e escreve ao mesmo tempo. Diverte-te!";
          // Story mode implicitly uses almost all keys, so no specific 'newKeys' needed in briefing
          keys = []; 
      }

      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-white/80 backdrop-blur-md transition-all"></div>
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white relative z-30 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white max-w-lg w-full text-center"
             >
                 <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                     <Info size={40} />
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-700 fun-font mb-4">{title}</h2>
                 <p className="text-lg text-slate-500 font-medium mb-8 leading-relaxed">{description}</p>
                 
                 {keys.length > 0 && (
                     <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                         <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Novas Teclas</p>
                         <div className="flex justify-center gap-3 flex-wrap">
                             {keys.map(k => (
                                 <span key={k} className="bg-white text-slate-700 font-mono font-bold text-2xl px-4 py-3 rounded-xl shadow-sm border-b-4 border-slate-200 min-w-[3rem]">
                                     {k === ' ' ? 'Espaço' : k.replace('Shift', '⇧')}
                                 </span>
                             ))}
                         </div>
                     </div>
                 )}

                 <div className={`${colors.bgSoft} p-4 rounded-xl mb-8 border ${colors.border}`}>
                     <p className={`${colors.text} font-bold text-sm`}>🎯 Objetivo: {goal}</p>
                 </div>

                 <ClayButton 
                    variant="primary" 
                    theme={theme} 
                    onClick={handleStartGame}
                    disabled={loading}
                    className="w-full py-4 text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-transform"
                 >
                     {loading ? 'A preparar...' : 'Começar!'}
                 </ClayButton>
             </motion.div>
        </div>
      );
  };

  // Renders the scrolling text area
  const renderText = () => {
    const visibleStart = Math.max(0, currentIndex - 8); 
    const visibleEnd = visibleStart + 16;
    const displayText = text.slice(visibleStart, visibleEnd);

    return (
      <div className="flex flex-wrap justify-center gap-2 text-4xl md:text-5xl font-bold font-mono leading-relaxed min-h-[160px] content-center py-8 px-4 select-none">
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

  return (
    <div className="flex flex-col items-center justify-between min-h-screen pb-10 px-4 relative">
        
        {/* Render Briefing as a Modal Overlay */}
        <AnimatePresence>
            {isBriefing && renderBriefing()}
        </AnimatePresence>

        {/* Header / HUD */}
        <div className={`w-full max-w-5xl flex justify-between items-center py-6 transition-all duration-500 ${isBriefing ? 'blur-sm opacity-50' : ''}`}>
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
        <div className={`flex-1 w-full max-w-4xl flex flex-col justify-center items-center transition-all duration-500 ${isBriefing ? 'blur-sm opacity-50' : ''}`}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-white rounded-[3rem] shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.05)] border border-white p-4 md:p-8 relative overflow-hidden min-h-[250px] flex items-center justify-center"
            >
                {/* Stage Light Effect */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 ${colors.bg} opacity-5 blur-3xl rounded-full pointer-events-none`}></div>
                
                {mode === GameMode.Timed && !isBriefing && (
                    <div className={`absolute top-4 left-0 right-0 text-center ${colors.textSoft} text-sm font-bold uppercase tracking-widest`}>
                        Modo Rápido
                    </div>
                )}
                
                {/* Always render text, but Briefing overlay covers it if active */}
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
                onBlur={() => setTimeout(() => !isBriefing && inputRef.current?.focus(), 10)}
            />
        </div>

        {/* 3D Keyboard */}
        <div className={`w-full transition-all duration-500 ${isBriefing ? 'blur-sm opacity-50' : ''}`}>
            <VirtualKeyboard 
                activeKey={isBriefing ? null : text[currentIndex]} 
                nextKey={isBriefing ? null : text[currentIndex + 1]} 
                theme={theme}
                showLabels={!blindMode} // Pass Blind Mode toggle
            />
        </div>
        
    </div>
  );
};

export default TypingArea;
