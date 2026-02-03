
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { HealthAnalysis, CarePlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Enhanced chat messaging with search and maps grounding
 */
export async function sendMessage(
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  userLocation?: { lat: number, lng: number }
) {
  try {
    const config: any = {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [{ googleMaps: {} }, { googleSearch: {} }],
    };

    if (userLocation) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLocation.lat,
            longitude: userLocation.lng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: config,
    });

    const text = response.text || "I'm sorry, I couldn't generate a response. Please try again.";
    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, groundingSources };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "Sorry, I'm having trouble connecting right now. Please check your internet or try again later. In an emergency, call 117.",
      groundingSources: [] 
    };
  }
}

/**
 * Text-to-Speech specifically for health advice delivery
 */
export async function generateSpeech(text: string, voiceName: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr' = 'Kore') {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this health advice clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data generated");
    
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
}

export async function fetchHealthReportData(language: string, district?: string) {
  try {
    const districtContext = district && district !== 'all' ? `specifically for ${district} district` : "at a national level";
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the latest official Sierra Leone National Public Health Agency (NPHA) epidemiological reports. Identify cases and trends ${districtContext} for Malaria and Lassa Fever. Respond in ${language}.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  disease: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  trend: { type: Type.STRING },
                  status: { type: Type.STRING }
                },
                required: ["disease", "value", "trend", "status"]
              }
            }
          },
          required: ["summary", "metrics", "highlights"]
        }
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return {
      ...parsedData,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Health Report Error:", error);
    throw error;
  }
}

export async function analyzeHealthTopic(topic: string, language: string): Promise<HealthAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following health concern for a user in Sierra Leone. Provide conditions. Respond in ${language}. Topic: ${topic}`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conditions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                treatment: { type: Type.STRING },
                prevention: { type: Type.STRING },
                emergencySigns: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["name", "description", "symptoms", "treatment", "prevention", "emergencySigns"]
            }
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["conditions", "generalAdvice"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateCarePlan(condition: string, language: string): Promise<CarePlan> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a care plan for: ${condition}. Respond in ${language}.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          lifestyle: { type: Type.ARRAY, items: { type: Type.STRING } },
          homeMonitoring: { type: Type.ARRAY, items: { type: Type.STRING } },
          whenToSeeDoctor: { type: Type.STRING },
          healthTip: { type: Type.STRING }
        },
        required: ["lifestyle", "homeMonitoring", "whenToSeeDoctor", "healthTip"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
