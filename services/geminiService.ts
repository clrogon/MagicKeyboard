
/// <reference types="node" />

import { GoogleGenAI } from "@google/genai";
import { Level, GameMode, ErrorStats } from '../types';

// Defensive declaration for process.env to avoid TS errors in some environments
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY?: string;
    }
  }
}

/**
 * PRIVACY & GDPR COMPLIANCE NOTICE:
 * 
 * This service implements a "Privacy by Design" architecture.
 * 
 * 1. No PII Transmission: The prompts sent to Google Gemini DO NOT contain 
 *    user names, IDs, email addresses, or history. Only the *level configuration* 
 *    (letters to practice) is sent.
 * 
 * 2. Stateless: This service does not retain state about the user between calls.
 * 
 * 3. Children's Data: By ensuring anonymity in the prompt, we prevent 
 *    the AI model from processing data belonging to a specific child.
 * 
 * 4. Bicultural Strategy: The prompts below are engineered to generate valid
 *    European Portuguese (PT-PT) while explicitly including Angolan cultural
 *    references (PT-AO) to serve the full CPLP scope of the project.
 */

let genAI: GoogleGenAI | null = null;

// Initialize Gemini Client safely
try {
  if (process.env.API_KEY) {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
} catch (e) {
  console.warn("Gemini API Key not found or invalid.");
}

/**
 * Generates dynamic typing exercises using Google's Gemini AI.
 * 
 * @param level - The current level configuration (provides available keys).
 * @param mode - The game mode (determines text length and structure).
 * @param errorStats - Optional map of user's weak keys for targeted drills.
 * @param difficultyModifier - 'hard' requests longer sentences/words.
 * @returns A promise resolving to the generated text string, or a fallback string on error.
 */
export const generateSmartExercise = async (
    level: Level, 
    mode: GameMode = GameMode.Campaign,
    errorStats?: ErrorStats,
    difficultyModifier: 'normal' | 'hard' = 'normal'
): Promise<string> => {
  // Helper to get a random fallback from the hardcoded constant lists
  const getFallback = () => {
      if (level.textSamples && level.textSamples.length > 0) {
          return level.textSamples[Math.floor(Math.random() * level.textSamples.length)];
      }
      return "a a a"; // Absolute last resort to prevent crashes
  };

  // 1. Fallback Logic: If no API key or client, return hardcoded samples.
  if (!genAI) {
    if (mode === GameMode.Timed) {
        // Concatenate random samples to make it long enough for a timer
        const samples = level.textSamples && level.textSamples.length > 0 ? level.textSamples : ["o rato roeu", "a garrafa do rei", "tres pratos de trigo"];
        return Array(5).fill(null).map(() => samples[Math.floor(Math.random() * samples.length)]).join(' ');
    }
    return getFallback();
  }

  try {
    // using gemini-3-flash-preview for low latency and cost effectiveness
    const model = "gemini-3-flash-preview";
    
    // Clean keys for prompt (remove pseudo keys like Shift to avoid confusion in prompt)
    const availableKeys = level.allKeys
        .filter(k => !k.startsWith('Shift'))
        .join(', ')
        .toUpperCase();
    
    // Base Instruction: Ensure strict European Portuguese context with Angolan inclusiveness.
    let systemInstruction = `
      You are a typing tutor for a child learning European Portuguese (pt-PT). 
      
      CRITICAL VOCABULARY RULES:
      1. STRICTLY AVOID Brazilian Portuguese terms (e.g., use 'a fazer' instead of 'fazendo', 'autocarro' instead of 'ônibus', 'ecrã' instead of 'tela'). 
      2. Address the child as 'Tu' (2nd person singular informal).
      3. Include cultural names, places, and context from both:
         - PORTUGAL: Lisboa, Tejo, Serra da Estrela, Galo de Barcelos, Sardinha, Azulejo, Elétrico.
         - ANGOLA: Luanda, Rio Kwanza, Muxima, Imbondeiro (Baobab), Palanca Negra, Benguela, Huambo, Semba (Music), Ginguba (Peanut), Soba (Chief), Fenda da Tundavala (Lubango), Welwitschia Mirabilis, Cabinda, Malanje.
    `;
    
    let prompt = "";

    // 2. Mode-Specific Prompt Engineering
    if (mode === GameMode.ErrorDrill && errorStats) {
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
            Make it fun and varied, mixing words from Portugal and Angola.
        `;
    } else if (mode === GameMode.Story) {
        prompt = `
            ${systemInstruction}
            Generate a creative, coherent SHORT STORY (3-4 sentences, about 30-40 words).
            It must be a complete narrative with a beginning, middle, and end.
            Use mostly the provided keys, but you can occasionally use simple words outside the list if strictly necessary for flow (but prioritize the list).
            Available keys: [${availableKeys}].
            Themes: Animals (e.g., a Palanca Negra, o Lince Ibérico), Friends (e.g., Ana e Zola), Travel (e.g., de Lisboa a Luanda), Food (e.g. Cachupa, Muamba, Pastel de Nata, Ginguba).
            Tone: Whimsical and encouraging.
        `;
    } else {
        // Campaign Mode (Standard)
        const lengthInstruction = difficultyModifier === 'hard' 
            ? "Generate a longer sentence (8-10 words) or a list of harder/longer words." 
            : "Generate a single line of text (about 4-6 words).";
        
        const hasNumbers = level.newKeys.some(k => '0123456789'.includes(k));
        const numberInstruction = hasNumbers ? "Include numbers in the generated text (e.g., dates, quantities, years)." : "";

        prompt = `
            ${systemInstruction}
            ${lengthInstruction}
            ${numberInstruction}
            Use ONLY these letters: [${availableKeys}].
            ${level.newKeys.includes('ShiftLeft') ? "Include capitalized proper nouns (Names of people or cities like Rui, Ana, Luanda, Zola)." : "Keep it mostly lowercase."}
            Do NOT use any punctuation unless it is in the list above.
            The text should be simple, real European Portuguese words.
            Keep it positive and kid-friendly.
            ${difficultyModifier === 'hard' ? "Challenge the user with slightly more complex word combinations." : ""}
        `;
    }

    // 3. Call API
    const response = await genAI.models.generateContent({
      model,
      contents: prompt,
    });

    const text = response.text?.trim();
    
    // 4. Output validation and cleanup
    if (text) {
       // Remove markdown code blocks or quotes if the model adds them by mistake
       let cleanText = text.replace(/`/g, '').replace(/"/g, '');
       return cleanText;
    }
    
    return getFallback();

  } catch (error) {
    console.error("Gemini generation failed", error);
    return getFallback();
  }
};
