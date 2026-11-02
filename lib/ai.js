import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

// Di laptop: baca API key dari .env.local / .env.
// Di Vercel (online), file ini tidak ada, jadi bagian ini dilewati dengan aman.
for (const file of [".env.local", ".env"]) {
  try { process.loadEnvFile(file); } catch {}
}

const PROVIDER = process.env.AI_PROVIDER || "gemini";

// Fungsi tunggal untuk semua pemanggilan AI di aplikasi.
// system: instruksi peran untuk AI
// messages: [{ role: "user" | "assistant", content: "..." }]
export async function tanyaAI({ system, messages, maxTokens = 300 }) {
  if (PROVIDER === "gemini") return tanyaGemini({ system, messages, maxTokens });
  if (PROVIDER === "claude") return tanyaClaude({ system, messages, maxTokens });
  throw new Error("AI_PROVIDER tidak dikenal: " + PROVIDER);
}

// ===== Gemini (Google) =====
let klienGemini = null;

// Daftar model berurutan. Yang pertama dicoba lebih dulu;
// kalau sibuk atau gagal, otomatis pindah ke model berikutnya.
const MODEL_GEMINI = (process.env.GEMINI_MODELS ||
  "gemini-3.5-flash-lite,gemini-flash-lite-latest,gemini-3.6-flash")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);

async function tanyaGemini({ system, messages, maxTokens }) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY belum diisi di file .env");
  if (!klienGemini) klienGemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { timeout: 10000 } // maksimal 8 detik per model
  });

  // Format Gemini: "assistant" disebut "model", dan teks dibungkus di dalam "parts"
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }]
  }));

  let errorTerakhir = null;
  for (const model of MODEL_GEMINI) {
    const mulai = Date.now();
    try {
      const respons = await klienGemini.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: system,
          maxOutputTokens: Math.max(maxTokens, 1024)
        }
      });
      const teks = (respons.text || "").trim();
      if (!teks) throw new Error("jawaban kosong atau diblokir");
      console.log(`Gemini (${model}) menjawab dalam ${Date.now() - mulai} ms`);
      return teks;
    } catch (err) {
      console.log(`Gemini (${model}) gagal setelah ${Date.now() - mulai} ms: ${err.message.slice(0, 100)}`);
      errorTerakhir = err;
    }
  }
  throw new Error("Semua model Gemini gagal. Terakhir: " + (errorTerakhir?.message || "tidak diketahui"));
}

// ===== Claude (Anthropic), siap dipakai nanti =====
let klienClaude = null;

async function tanyaClaude({ system, messages, maxTokens }) {
  if (!klienClaude) klienClaude = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    authToken: null
  });
  const respons = await klienClaude.messages.create({
    model: process.env.CLAUDE_MODEL || "claude-haiku-5-5",
    max_tokens: maxTokens,
    system,
    messages
  });
  return respons.content
    .filter((bagian) => bagian.type === "text")
    .map((bagian) => bagian.text)
    .join("")
    .trim();
}