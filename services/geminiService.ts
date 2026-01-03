import { GoogleGenAI } from "@google/genai";
import { Level, GameMode, ErrorStats } from '../types';

let genAI: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key not found or invalid.");
}

export const generateSmartExercise = async (
    level: Level, 
    mode: GameMode = GameMode.Campaign,
    errorStats?: ErrorStats,
    difficultyModifier: 'normal' | 'hard' = 'normal'
): Promise<string> => {
  if (!genAI) {
    // Fallback logic
    if (mode === GameMode.Timed) {
        // Concatenate random samples to make it long
        return Array(5).fill(null).map(() => level.textSamples[Math.floor(Math.random() * level.textSamples.length)]).join(' ');
    }
    return level.textSamples[Math.floor(Math.random() * level.textSamples.length)];
  }

  try {
    const model = "gemini-3-flash-preview";
    
    // Clean keys for prompt (remove pseudo keys like Shift)
    const availableKeys = level.allKeys
        .filter(k => !k.startsWith('Shift'))
        .join(', ')
        .toUpperCase();
    
    // Strict European Portuguese instruction
    let systemInstruction = "You are a typing tutor for a child learning European Portuguese (pt-PT). STRICTLY AVOID Brazilian Portuguese terms, phrasing, or gerunds (e.g., use 'a fazer' instead of 'fazendo'). Address the child as 'Tu'.";
    
    let prompt = "";

    if (mode === GameMode.ErrorDrill && errorStats) {
        // Find top 3 error keys
        const weakKeys = Object.entries(errorStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([k]) => k)
            .join(', ');
        
        if (weakKeys) {
             prompt = `
                ${systemInstruction}
                Generate a typing exercise focused on correcting errors for these specific keys: [${weakKeys}].
                Use ONLY the available keys: [${availableKeys}].
                Create 6-8 simple words or a short sentence that heavily uses the weak keys.
                Keep it lower case unless Shift is in available keys.
            `;
        } else {
            prompt = `Generate a standard typing exercise using: [${availableKeys}].`;
        }

    } else if (mode === GameMode.Timed) {
        prompt = `
            ${systemInstruction}
            Generate a LONG typing text (approx 30-40 words) for a 60-second challenge.
            Use ONLY these letters/symbols: [${availableKeys}].
            It can be a list of words or simple sentences.
            Do NOT use any punctuation/symbols unless listed above.
            Make it fun and varied.
        `;
    } else {
        // Campaign Mode
        const lengthInstruction = difficultyModifier === 'hard' 
            ? "Generate a longer sentence (8-10 words) or a list of harder/longer words." 
            : "Generate a single line of text (about 4-6 words).";

        prompt = `
            ${systemInstruction}
            ${lengthInstruction}
            Use ONLY these letters: [${availableKeys}].
            ${level.newKeys.includes('ShiftLeft') ? "Include capitalized proper nouns." : "Keep it mostly lowercase."}
            Do NOT use any punctuation unless it is in the list above.
            The text should be simple, real European Portuguese words.
            Keep it positive and kid-friendly.
            ${difficultyModifier === 'hard' ? "Challenge the user with slightly more complex word combinations." : ""}
        `;
    }

    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text?.trim();
    
    if (text) {
        // Basic cleanup of quotes or markdown that might sneak in
       let cleanText = text.replace(/`/g, '').replace(/"/g, '');
       return cleanText;
    }
    
    return level.textSamples[0];

  } catch (error) {
    console.error("Gemini generation failed", error);
    return level.textSamples[Math.floor(Math.random() * level.textSamples.length)];
  }
};