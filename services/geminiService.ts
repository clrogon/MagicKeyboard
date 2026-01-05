
import { GoogleGenAI } from "@google/genai";
import { Level, GameMode, ErrorStats } from '../types';

let genAI: GoogleGenAI | null = null;

try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch {
  console.warn("Gemini API Key not found or invalid.");
}

export const generateSmartExercise = async (
    level: Level, 
    mode: GameMode = GameMode.Campaign,
    errorStats?: ErrorStats,
    difficultyModifier: 'normal' | 'hard' = 'normal'
): Promise<string> => {
  const getFallback = () => {
      if (level.textSamples && level.textSamples.length > 0) {
          return level.textSamples[Math.floor(Math.random() * level.textSamples.length)];
      }
      return "a a a";
  };

  if (!genAI) {
    if (mode === GameMode.Timed) {
        const samples = level.textSamples && level.textSamples.length > 0 ? level.textSamples : ["o rato roeu", "a garrafa do rei", "tres pratos de trigo"];
        return Array(5).fill(null).map(() => samples[Math.floor(Math.random() * samples.length)]).join(' ');
    }
    return getFallback();
  }

  try {
    const model = "gemini-3-flash-preview";
    const availableKeys = level.allKeys
        .filter(k => !k.startsWith('Shift'))
        .join(', ')
        .toUpperCase();
    
    let systemInstruction = `
      You are a typing tutor for a child learning European Portuguese (pt-PT). 
      CRITICAL VOCABULARY RULES:
      1. STRICTLY AVOID Brazilian Portuguese terms (e.g., use 'a fazer' instead of 'fazendo', 'autocarro' instead of 'ônibus', 'ecrã' instead of 'tela'). 
      2. Address the child as 'Tu' (2nd person singular informal).
      3. Include cultural names, places, and context from both Portugal and Angola.
      4. Use a friendly and encouraging tone.
    `;
    
    let prompt = "";

    if (mode === GameMode.ErrorDrill && errorStats) {
        const weakKeys = Object.entries(errorStats)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([k]) => k)
            .join(', ');
        
        if (weakKeys) {
             prompt = `
                ${systemInstruction}
                Generate a typing exercise focused on correcting errors for: [${weakKeys}].
                Use ONLY the available keys: [${availableKeys}].
                Create 6-8 simple words or a short sentence in European Portuguese.
            `;
        } else {
            prompt = `Generate a standard typing exercise in pt-PT using: [${availableKeys}].`;
        }
    } else if (mode === GameMode.Timed) {
        prompt = `${systemInstruction} Generate a LONG text in European Portuguese (30-40 words). Use ONLY: [${availableKeys}].`;
    } else if (mode === GameMode.Story) {
        prompt = `${systemInstruction} Generate a SHORT STORY in European Portuguese (3-4 sentences). Available keys: [${availableKeys}].`;
    } else {
        const lengthInstruction = difficultyModifier === 'hard' 
            ? "Generate a longer sentence (8-10 words)." 
            : "Generate a single line of text (about 4-6 words).";
        
        const hasNumbers = level.newKeys.some(k => '0123456789'.includes(k));
        const numberInstruction = hasNumbers ? "Include numbers." : "";

        prompt = `
            ${systemInstruction}
            ${lengthInstruction}
            ${numberInstruction}
            Use ONLY these letters: [${availableKeys}].
            Keep it mostly lowercase, proper European Portuguese.
        `;
    }

    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text?.trim();
    if (text) {
       // Sanitize the response to remove any markdown quotes or accidental code block markers
       return text.replace(/[`"]/g, '');
    }
    return getFallback();
  } catch (error) {
    console.error("Gemini generation failed", error);
    return getFallback();
  }
};
