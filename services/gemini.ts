
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";

// Initialize with process.env.API_KEY directly as required by guidelines
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSticker = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `A high quality die-cut sticker design of: ${prompt}. White border, vector art style, vibrant colors, isolated on plain white background.` }]
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating sticker:", error);
    return null;
  }
};

export const editSticker = async (base64Image: string, editPrompt: string): Promise<string | null> => {
  const ai = getAI();
  const base64Data = base64Image.split(',')[1];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'image/png' } },
          { text: `Edit this sticker according to these instructions: ${editPrompt}. Maintain the die-cut sticker look.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing sticker:", error);
    return null;
  }
};

export const chatWithGemini = async (message: string, history: any[] = []): Promise<string> => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'Είσαι ο βοηθός του StickerGenius. Απαντάς στα Ελληνικά με φιλικό και δημιουργικό τρόπο για θέματα σχετικά με stickers, σχεδιασμό και την πλατφόρμα μας.'
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text || "Συγγνώμη, υπήρξε ένα πρόβλημα.";
};

export const generatePromoVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string | null> => {
  const ai = getAI();
  try {
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Cinematic commercial for a sticker company: ${prompt}`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
      const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (error) {
    console.error("Video generation failed:", error);
    return null;
  }
};

export const transcribeVoice = async (audioBase64: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
        { text: "Transcribe this audio message. Output only the text." }
      ]
    }
  });
  return response.text || "";
};

export const analyzeStickerIdea = async (idea: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this sticker idea and give creative feedback to improve it: ${idea}`,
    config: {
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return response.text || "";
};

export const generateTTS = async (text: string): Promise<Uint8Array | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say with enthusiasm: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    return null;
  } catch (err) {
    console.error("TTS failed:", err);
    return null;
  }
};
