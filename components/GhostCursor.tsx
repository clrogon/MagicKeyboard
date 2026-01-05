
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Ghost } from 'lucide-react';

interface GhostCursorProps {
  startTime: number | null; // The real-time timestamp when the user started typing
  events: number[]; // The array of relative timestamps (ms) for the ghost's progress
  currentIndex: number; // The user's current index (to calculate race position)
  totalLength: number; // Total length of text
}

export const GhostCursor: React.FC<GhostCursorProps> = ({ startTime, events, currentIndex, totalLength }) => {
  const [ghostIndex, setGhostIndex] = useState(0);

  useEffect(() => {
    if (!startTime) {
        setGhostIndex(0);
        return;
    }

    const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;

        // Find the furthest index the ghost has reached based on elapsed time
        // We look through events array. events[i] is the time it took to type char i.
        let newIndex = 0;
        for (let i = 0; i < events.length; i++) {
            if (elapsed >= events[i]) {
                newIndex = i + 1; // Completed char i
            } else {
                break;
            }
        }
        setGhostIndex(newIndex);
    }, 100); // Update 10 times a second

    return () => clearInterval(interval);
  }, [startTime, events]);

  // Calculate progress %
  const ghostProgress = (ghostIndex / totalLength) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 h-1 bg-transparent z-10 pointer-events-none">
        {/* Ghost Progress Indicator (Only visible if race has started) */}
        {startTime && (
            <motion.div 
                className="absolute top-[-35px] transition-all duration-300 ease-linear flex flex-col items-center"
                style={{ left: `${Math.min(100, ghostProgress)}%` }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
            >
                <Ghost size={24} className="text-slate-300 fill-slate-100" />
                <span className="text-[10px] font-bold text-slate-300 bg-white/80 px-1 rounded shadow-sm">Fantasma</span>
            </motion.div>
        )}
    </div>
  );
};
