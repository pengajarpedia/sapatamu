import { GoogleGenAI } from "@google/genai";
process.loadEnvFile(".env.local");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 15000 } // maksimal 15 detik per model
});

// Kumpulkan model teks "flash", lewati model khusus suara, gambar, dan lainnya
const kandidat = [];
for await (const m of await ai.models.list()) {
  const nama = m.name.replace("models/", "");
  const bisaChat = m.supportedActions?.includes("generateContent");
  const khusus = /tts|image|live|audio|embedding|robotics|computer/.test(nama);
  if (bisaChat && nama.includes("flash") && !khusus) kandidat.push(nama);
}
console.log("Model yang akan diuji:", kandidat, "\n");

// Uji tiap model dengan pertanyaan sederhana
for (const model of kandidat) {
  const mulai = Date.now();
  try {
    const r = await ai.models.generateContent({
      model,
      contents: "Say hello in one short sentence."
    });
    console.log("OK   ", model, "-", Date.now() - mulai, "ms -", r.text.trim());
  } catch (err) {
    console.log("GAGAL", model, "-", Date.now() - mulai, "ms -", err.message.slice(0, 80));
  }
}