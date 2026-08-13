import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI Client lazily or safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", geminiAvailable: !!process.env.GEMINI_API_KEY });
});

// Gemini TTS endpoint
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = 'Kore', emotion = 'Friendly', speed = 1.0, pitch = 1.0 } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: "Text prompt is required" });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.json({
        fallback: true,
        message: "Gemini API key not configured, using Web Speech synthesis."
      });
      return;
    }

    // Standard prebuilt voice mappings for gemini-3.1-flash-tts-preview
    // Allowed values: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
    const voiceMapping: Record<string, string> = {
      Kore: 'Kore',
      Puck: 'Puck',
      Zephyr: 'Zephyr',
      Charon: 'Charon',
      Fenrir: 'Fenrir',
      Nova: 'Kore',
    };

    const targetVoice = voiceMapping[voice] || 'Kore';
    const styledPrompt = `Say with ${emotion} emotion and tone: ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: styledPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: targetVoice }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({
        audioBase64: base64Audio,
        mimeType: "audio/pcm",
        sampleRate: 24000,
        voice: targetVoice,
        emotion
      });
    } else {
      res.json({ fallback: true, message: "No audio generated from model" });
    }
  } catch (err: any) {
    console.error("Gemini TTS Error:", err?.message || err);
    res.json({ fallback: true, error: err?.message || "TTS Generation Error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Synthetic Voice Studio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
