
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Level, SessionResult, GameMode, ErrorStats, Theme, KeyboardLayout } from '../types';
import { ClayButton } from './ClayButton';
import VirtualKeyboard from './VirtualKeyboard';
import { RotateCcw, Timer, X, Info, EyeOff, Sparkles, Flag, Play, Pencil, Star, Trophy, Target, Volume2, Mic, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { generateSmartExercise } from '../services/geminiService';
import { THEME_COLORS } from '../constants';
import { audioService } from '../services/audioService';

interface TypingAreaProps {
  level: Level;
  mode: GameMode;
  errorStats?: ErrorStats;
  timeLimit?: number; // seconds (for Timed mode)
  difficultyModifier?: 'normal' | 'hard';
  blindMode?: boolean; // Hides key labels
  soundEnabled: boolean;
  theme: Theme;
  layout?: KeyboardLayout;
  onComplete: (result: SessionResult, errors: ErrorStats, corrects: ErrorStats) => void;
  onExit: () => void;
}

const TypingArea: React.FC<TypingAreaProps> = ({ 
    level, mode, errorStats, timeLimit, difficultyModifier = 'normal', blindMode = false, soundEnabled = true, theme, layout = 'qwerty', onComplete, onExit 
}) => {
  // Game State
  const [isBriefing, setIsBriefing] = useState(true);
  const [text, setText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Session Stats
  const [sessionErrors, setSessionErrors] = useState(0); 
  const [sessionErrorMap, setSessionErrorMap] = useState<ErrorStats>({}); 
  const [sessionCorrectMap, setSessionCorrectMap] = useState<ErrorStats>({}); 
  const [consecutiveErrors, setConsecutiveErrors] = useState(0); // Track errors on current char for help
  
  // Motivational Feedback System
  const [motivationalMessage, setMotivationalMessage] = useState<string>("Prepara-te...");
  
  // Rhythm/Consistency Tracking
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number | null>(null);
  const [keystrokeIntervals, setKeystrokeIntervals] = useState<number[]>([]);

  // Input Management
  const [typedChars, setTypedChars] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(timeLimit || null);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const isComposing = useRef(false); // Track IME composition state (macOS accents)

  const colors = THEME_COLORS[theme];

  const speakText = useCallback((textToSpeak: string) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-PT';
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.includes('pt-PT')) || voices.find(v => v.lang.includes('pt'));
      if (ptVoice) utterance.voice = ptVoice;

      window.speechSynthesis.speak(utterance);
  }, []);

  // Initialize Level
  const initLevel = useCallback(async () => {
    setLoading(true);
    setMotivationalMessage("A preparar magia...");
    
    // IF CUSTOM MODE: Bypass AI generation
    if (mode === GameMode.Custom) {
        setText(level.textSamples[0]);
        setLoading(false);
        setMotivationalMessage("Vamos começar!");
        return;
    }

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
        setMotivationalMessage("Vamos começar!");
    } catch (e) {
        clearTimeout(safetyTimeout);
        console.error("Level init error:", e);
        setText(level.textSamples[0]);
        setLoading(false);
    }

    setCurrentIndex(0);
    setSessionErrors(0);
    setSessionErrorMap({});
    setSessionCorrectMap({});
    setConsecutiveErrors(0);
    setKeystrokeIntervals([]);
    setLastKeystrokeTime(null);
    setTypedChars("");
    setStartTime(null);
    isComposing.current = false;
    
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

  // Focus Management
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !isBriefing) inputRef.current?.focus();
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, isBriefing]);

  // Timer Countdown
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
  }, [startTime, timeLimit, isBriefing, timeLeft]);

  // Finish Level logic
  const finishLevel = useCallback(() => {
    const endTime = Date.now();
    let durationMin = 0;
    
    if (mode === GameMode.Timed && timeLimit) {
        durationMin = timeLimit / 60;
    } else {
        durationMin = (endTime - (startTime || endTime)) / 60000;
    }
    
    const totalTyped = currentIndex;
    const grossWpm = Math.round((totalTyped / 5) / (durationMin || 0.001)); 
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - sessionErrors) / totalTyped) * 100) : 0;
    
    let consistency = 100;
    if (keystrokeIntervals.length > 2) {
        const mean = keystrokeIntervals.reduce((a, b) => a + b, 0) / keystrokeIntervals.length;
        const variance = keystrokeIntervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / keystrokeIntervals.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / (mean || 1); 
        consistency = Math.max(0, Math.round(100 - (cv * 100)));
    }

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
  }, [currentIndex, level, mode, onComplete, sessionCorrectMap, sessionErrorMap, sessionErrors, startTime, timeLimit, keystrokeIntervals]);

  // Auto-finish
  useEffect(() => {
      if (timeLeft === 0 && startTime) {
          finishLevel();
      }
  }, [timeLeft, startTime, finishLevel]);

  // Dictation: Speak text when level starts (after briefing)
  useEffect(() => {
      if (!isBriefing && mode === GameMode.Dictation && text) {
          speakText(text);
      }
  }, [isBriefing, mode, text, speakText]);

  const handleStartGame = () => {
      setIsBriefing(false);
      setMotivationalMessage("Começa a escrever!");
      if(soundEnabled) audioService.init();
      if(soundEnabled) audioService.playStart();
      setTimeout(() => inputRef.current?.focus(), 100);
  };

  const validateInput = (char: string) => {
      if (loading || isBriefing || (timeLeft === 0)) return;
      
      const targetChar = text[currentIndex];
      const now = Date.now();
  
      if (!startTime) {
        setStartTime(now);
        setLastKeystrokeTime(now);
      }
  
      if (char === targetChar) {
        setTypedChars(prev => prev + char);
        setConsecutiveErrors(0);
        
        if(soundEnabled) audioService.playClick();
        
        if (lastKeystrokeTime) {
            const interval = now - lastKeystrokeTime;
            if (interval < 2000) { 
                setKeystrokeIntervals(prev => [...prev, interval]);
            }
        }
        setLastKeystrokeTime(now);
  
        setSessionCorrectMap(prev => ({
            ...prev,
            [targetChar]: (prev[targetChar] || 0) + 1
        }));
  
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
  
        const progress = nextIndex / text.length;
        if (progress === 1) setMotivationalMessage("Conseguiste! 🎉");
        else if (progress >= 0.9) setMotivationalMessage("Só mais um bocadinho! 🏁");
        else if (progress >= 0.75) setMotivationalMessage("Quase lá! Força! 💪");
        else if (progress >= 0.5) setMotivationalMessage("Já passaste o meio! 🏃");
        else if (progress >= 0.25) setMotivationalMessage("Bom começo! 👍");
        else setMotivationalMessage("Continua assim...");
  
        if (nextIndex >= text.length) {
          if (mode === GameMode.Timed) {
              setText(prev => prev + " " + prev);
          } else {
              finishLevel();
          }
        }
      } else {
        if(soundEnabled) audioService.playError();
        setSessionErrors(prev => prev + 1);
        setConsecutiveErrors(prev => prev + 1);
        
        setMotivationalMessage("Ups! Tenta outra vez. 🛡️"); 
        setSessionErrorMap(prev => ({
            ...prev,
            [targetChar]: (prev[targetChar] || 0) + 1
        }));
      }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        return;
    }
    if (e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'CapsLock') return;
    if (e.key === 'Backspace') return; 

    if (e.nativeEvent.isComposing || isComposing.current) {
        return;
    }

    if (e.key === 'Dead') return;

    if (e.key.length === 1) {
        validateInput(e.key);
    }
  };

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    if (e.data) {
        const chars = e.data.split('');
        chars.forEach(char => validateInput(char));
    }
  };

  const renderBriefing = () => {
      let title = "";
      let description = "";
      let goalTitle = "O Teu Objetivo";
      let goalText = "";
      let keys = level.newKeys;
      let GoalIcon = Star;

      switch(mode) {
          case GameMode.Timed:
              title = "Desafio do Relógio";
              description = "O relógio vai contar! Escreve o máximo que conseguires sem parar.";
              goalText = "Escreve o máximo de palavras corretas possível em 60 segundos.";
              GoalIcon = Timer;
              keys = [];
              break;
          case GameMode.ErrorDrill:
              title = "Limpar Erros";
              description = "O teu treinador pessoal preparou um treino especial com as letras que achas difíceis.";
              goalText = "Treinar as letras difíceis e atingir 100% de precisão.";
              GoalIcon = Target;
              keys = [];
              break;
          case GameMode.Story:
              title = "Hora da História";
              description = "Vais escrever uma pequena aventura criada só para ti.";
              goalText = "Escreve a história completa até ao fim.";
              GoalIcon = Trophy;
              keys = [];
              break;
          case GameMode.Custom:
              title = "A Minha Lição";
              description = level.description || "Uma lição especial criada pelo teu professor ou pais.";
              goalText = "Completa todo o texto sem desistir!";
              GoalIcon = Flag;
              keys = [];
              break;
          case GameMode.Dictation:
              title = "Ditado Mágico";
              description = "Ouve com atenção! O computador vai falar e tu tens de escrever. As letras estão escondidas!";
              goalText = "Ouve e escreve corretamente as palavras.";
              GoalIcon = Mic;
              keys = [];
              break;
          default: 
              title = `Nível ${level.id}: ${level.title}`;
              description = level.description;
              goalText = `Atinge ${level.minWpm} Palavras por Minuto com ${level.minAccuracy}% de Precisão.`;
              break;
      }

      return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-white/80 backdrop-blur-md transition-all"></div>
             <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-white relative z-30 p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white max-w-lg w-full text-center"
             >
                 <button onClick={onExit} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-100 rounded-full">
                     <ArrowLeft size={20} />
                 </button>

                 <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                     {mode === GameMode.Custom ? <Pencil size={40} /> : mode === GameMode.Dictation ? <Mic size={40} /> : <Info size={40} />}
                 </div>
                 
                 <h2 className="text-3xl md:text-4xl font-bold text-slate-700 fun-font mb-4">{title}</h2>
                 <p className="text-lg text-slate-500 font-medium mb-6 leading-relaxed px-4">{description}</p>
                 
                 {keys.length > 0 && (
                     <div className="mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                         <div className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`}></div>
                         <p className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Novas Teclas a Aprender</p>
                         <div className="flex justify-center gap-3 flex-wrap">
                             {keys.map(k => (
                                 <motion.div 
                                    key={k}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="bg-white text-slate-700 font-mono font-bold text-2xl px-4 py-3 rounded-xl shadow-sm border-b-4 border-slate-200 min-w-[3rem]"
                                 >
                                     {k === ' ' ? 'Espaço' : k.replace('Shift', '⇧')}
                                 </motion.div>
                             ))}
                         </div>
                     </div>
                 )}

                 <div className={`${colors.bgSoft} p-4 rounded-2xl mb-8 border ${colors.border} flex items-center gap-4 text-left shadow-sm`}>
                     <div className={`bg-white p-3 rounded-full ${colors.text} shrink-0`}>
                        <GoalIcon size={28} />
                     </div>
                     <div>
                        <p className={`${colors.text} font-bold text-xs uppercase mb-1 tracking-wider`}>{goalTitle}</p>
                        <p className="text-slate-600 font-bold text-md leading-tight">{goalText}</p>
                     </div>
                 </div>

                 <ClayButton 
                    variant="primary" 
                    theme={theme} 
                    onClick={handleStartGame}
                    disabled={loading}
                    className="w-full py-4 text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-transform"
                 >
                     <Play size={24} className="mr-2 fill-white" />
                     {loading ? 'A preparar magia...' : 'Começar Missão!'}
                 </ClayButton>
             </motion.div>
        </div>
      );
  };

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
          
          let className = "relative flex items-center justify-center rounded-2xl transition-all duration-300 ";
          let content = char === ' ' ? '␣' : char;

          // Inline style for gradual fade effect on past characters
          let style: React.CSSProperties = {};

          if (mode === GameMode.Dictation && !isPast && !isCurrent) {
              if (char === ' ') {
                  className += "w-12 h-16 md:w-14 md:h-20 text-slate-200 bg-transparent border-b-4 border-slate-100 ";
                  content = '';
              } else {
                  className += "w-12 h-16 md:w-14 md:h-20 text-slate-300 ";
                  content = '•'; 
              }
          } else {
              if (isCurrent) {
                 // Enhanced active character styling: Larger, brighter, prominent ring/shadow
                 className += `w-16 h-20 md:w-20 md:h-24 ${colors.text} bg-white shadow-2xl ring-4 ${colors.border} z-20 scale-110 -translate-y-2`;
              } else {
                 className += "w-12 h-16 md:w-14 md:h-20 ";
                 if (isPast) {
                    className += "text-emerald-500 scale-95 "; 
                    // Calculate opacity based on distance from current index
                    const distance = currentIndex - actualIdx;
                    style.opacity = Math.max(0.3, 1 - (distance * 0.15));
                 } else if (isNext) {
                    // Subtle highlight for the immediate next character
                    className += "text-slate-500 bg-slate-50 border-b-4 border-slate-200 scale-100";
                 } else {
                    className += "text-slate-300 scale-90";
                 }
              }
          }

          return (
            <motion.span 
                key={actualIdx}
                layout
                initial={false}
                className={className}
                style={style}
            >
              {content}
            </motion.span>
          );
        })}
      </div>
    );
  };

  const keyboardActiveKey = mode === GameMode.Dictation 
      ? (consecutiveErrors >= 3 ? text[currentIndex] : null) 
      : (isBriefing ? null : text[currentIndex]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen pb-10 px-4 relative">
        <AnimatePresence>
            {isBriefing && renderBriefing()}
        </AnimatePresence>

        <div className={`w-full max-w-5xl flex justify-between items-center py-6 transition-all duration-500 ${isBriefing ? 'blur-sm opacity-50' : ''}`}>
            <div className="flex items-center gap-2">
                <ClayButton variant="secondary" onClick={onExit} className="px-4 py-2 text-sm">
                    <RotateCcw size={16} className="mr-2" /> Sair
                </ClayButton>
                
                {mode === GameMode.Dictation && (
                    <ClayButton variant="primary" theme={theme} onClick={() => speakText(text)} className="px-4 py-2 text-sm">
                        <Volume2 size={18} className="mr-2" /> Ouvir de Novo
                    </ClayButton>
                )}
            </div>
            
            {!isBriefing && (
                <div className={`hidden md:flex bg-white/80 backdrop-blur-sm px-6 py-2 rounded-2xl border-2 ${colors.border} shadow-sm items-center gap-2 animate-bounce-slow`}>
                    <Sparkles size={16} className={colors.text} />
                    <span className={`font-bold ${colors.text}`}>{motivationalMessage}</span>
                </div>
            )}

            <div className="flex gap-4">
                 {blindMode && (
                    <div className="bg-slate-800 text-white rounded-2xl px-4 py-2 flex items-center gap-2 shadow-sm animate-pulse">
                        <EyeOff size={18} />
                        <span className="font-bold text-sm uppercase hidden sm:inline">Invisível</span>
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
                       <span className="text-lg font-bold text-slate-600">
                           {mode === GameMode.Campaign ? level.id : mode === GameMode.Dictation ? 'Ditado' : 'Treino'}
                       </span>
                   </div>
                </div>
            </div>
        </div>

        <div className={`flex-1 w-full max-w-4xl flex flex-col justify-center items-center transition-all duration-500 ${isBriefing ? 'blur-sm opacity-50' : ''}`}>
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full bg-white rounded-[3rem] shadow-[0px_20px_40px_-10px_rgba(0,0,0,0.05)] border border-white p-4 md:p-8 relative overflow-hidden min-h-[250px] flex items-center justify-center"
            >
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 ${colors.bg} opacity-5 blur-3xl rounded-full pointer-events-none`}></div>
                
                {text.length > 0 && mode !== GameMode.Timed && (
                    <div className="absolute top-0 left-0 right-0 h-4 bg-slate-100 rounded-t-[2rem] overflow-hidden">
                        <motion.div 
                            className={`h-full ${colors.bg} relative`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentIndex / text.length) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                                <Flag size={10} className={colors.text} fill="currentColor" />
                            </div>
                        </motion.div>
                    </div>
                )}
                
                {renderText()}

                <div className="md:hidden absolute bottom-4 text-center w-full px-4">
                     <span className={`text-sm font-bold ${colors.textSoft}`}>{motivationalMessage}</span>
                </div>

            </motion.div>
            
            <input
                ref={inputRef}
                type="text"
                className="opacity-0 absolute top-0 pointer-events-none"
                value={typedChars}
                onChange={() => {}}
                onKeyDown={handleKeyDown}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
                onBlur={() => setTimeout(() => !isBriefing && inputRef.current?.focus(), 10)}
            />
        </div>

        <div className={`w-full transition-all duration-500 ${isBriefing ? 'blur-sm opacity-50' : ''}`}>
            <VirtualKeyboard 
                activeKey={keyboardActiveKey} 
                nextKey={mode === GameMode.Dictation ? null : (isBriefing ? null : text[currentIndex + 1])} 
                theme={theme}
                showLabels={!blindMode}
                layout={layout}
            />
        </div>
        
    </div>
  );
};

export default TypingArea;
