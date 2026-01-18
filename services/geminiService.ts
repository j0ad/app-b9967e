
import { GoogleGenAI, Type } from "@google/genai";
import { AppConfig, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProject = async (config: AppConfig): Promise<AnalysisResult> => {
  const sourceContext = config.fileContent ? `Project Files Context: ${config.fileContent}` : `URL: ${config.url}`;
  
  const prompt = `Analyze this React project for conversion to an Android application:
  App Name: ${config.name}
  Bundle ID: ${config.bundleId}
  ${sourceContext}
  
  Provide a professional analysis in Arabic, specifically for Android conversion:
  1. Readiness score (0-100).
  2. 3-5 suggestions for optimizing the UI for Android (Material Design, safe areas).
  3. Suggested native Android features (Push notifications, Deep linking, Splash screen).
  4. A configuration code snippet for 'capacitor.config.ts'.
  5. List of specific Android requirements (SDK versions, Gradle configurations).
  
  Return the response in valid JSON format.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          readinessScore: { type: Type.NUMBER },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
          codeSnippet: { type: Type.STRING },
          androidRequirements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["readinessScore", "suggestions", "suggestedFeatures", "codeSnippet", "androidRequirements"]
      }
    }
  });

  return JSON.parse(response.text.trim());
};

export const generateNativeBridge = async (features: string[]): Promise<string> => {
  const prompt = `Generate a TypeScript React Hook that provides access to these native Android features using Capacitor: ${features.join(', ')}. Include comments in Arabic explaining how to use it.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt
  });

  return response.text;
};
