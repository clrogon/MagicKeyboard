
/**
 * AudioService
 * 
 * A lightweight, generative sound engine using the Web Audio API.
 * Creates synthetic sounds (Oscillators) to avoid loading external MP3 assets,
 * ensuring the app remains offline-capable and fast.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

const initAudio = () => {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
            masterGain = audioCtx.createGain();
            masterGain.connect(audioCtx.destination);
            masterGain.gain.value = 0.3; // Master volume
        }
    }
    // Resume context if suspended (browser policy)
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0, volume: number = 1) => {
    if (!audioCtx || !masterGain) initAudio();
    if (!audioCtx || !masterGain) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime + startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(audioCtx.currentTime + startTime);
    osc.stop(audioCtx.currentTime + startTime + duration);
};

export const audioService = {
    init: initAudio,

    // Mechanical Key Click: Short, high pitch sine/triangle burst
    playClick: () => {
        // Randomize pitch slightly for organic feel
        const pitch = 600 + Math.random() * 200;
        playTone(pitch, 'triangle', 0.05, 0, 0.5);
        playTone(100, 'sine', 0.05, 0, 0.3); // "Thock" body
    },

    // Error: Low discordant saw wave
    playError: () => {
        playTone(150, 'sawtooth', 0.15, 0, 0.4);
        playTone(140, 'sawtooth', 0.15, 0.05, 0.4);
    },

    // Success/Level Up: A happy major arpeggio
    playWin: () => {
        const now = 0;
        const speed = 0.1;
        // C Major Arpeggio (C5, E5, G5, C6)
        playTone(523.25, 'sine', 0.3, now, 0.4);
        playTone(659.25, 'sine', 0.3, now + speed, 0.4);
        playTone(783.99, 'sine', 0.3, now + speed * 2, 0.4);
        playTone(1046.50, 'sine', 0.6, now + speed * 3, 0.4);
        
        // Sparkle
        playTone(1046.50, 'triangle', 0.1, now + speed * 3, 0.2);
    },
    
    // Level Start: Brief ready sound
    playStart: () => {
        playTone(440, 'sine', 0.1, 0, 0.3);
        playTone(880, 'sine', 0.3, 0.1, 0.3);
    }
};
