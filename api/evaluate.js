import { tanyaAI } from "../lib/ai.js";
import { SKENARIO } from "../lib/scenarios.js";

const KRITERIA = ["tataBahasa", "bahasaLayanan", "penyelesaianTugas", "kejelasan"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan metode POST." });
  }

  // 1. Periksa data
  const { skenarioId, riwayat } = req.body || {};
  const s = SKENARIO[skenarioId];
  if (!s) return res.status(400).json({ error: "Skenario tidak ditemukan." });
  if (!Array.isArray(riwayat) || riwayat.length > 40) {
    return res.status(400).json({ error: "Riwayat percakapan tidak valid." });
  }
  const jumlahJawaban = riwayat.filter((p) => p.peran === "siswa").length;
  if (jumlahJawaban < 2) {
    return res.status(400).json({ error: "Jawab minimal 2 kali sebelum dinilai." });
  }

  // 2. Susun transkrip percakapan untuk dinilai
  const transkrip = riwayat
    .filter((p) => typeof p.teks === "string" && ["tamu", "siswa"].includes(p.peran))
    .map((p) => `${p.peran === "tamu" ? "GUEST" : "STUDENT"}: ${p.teks.slice(0, 500)}`)
    .join("\n");

  try {
    const jawaban = await tanyaAI({
      system: PROMPT_PENILAI,
      messages: [{
        role: "user",
        content: `Scenario: ${s.situasi}\nGuest's goal: ${s.tujuan}\n\nTranscript:\n${transkrip}`
      }],
      maxTokens: 1500,
      formatJSON: true
    });
    const hasil = bacaJSON(jawaban);

    // 3. Rapikan skor (1-4) dan hitung total di server, bukan oleh AI
    const skor = {};
    for (const k of KRITERIA) {
      const n = Math.round(Number(hasil.skor?.[k]));
      skor[k] = Math.min(4, Math.max(1, Number.isFinite(n) ? n : 1));
    }
    const jumlah = Object.values(skor).reduce((a, b) => a + b, 0);
    const total = Math.round((jumlah / (KRITERIA.length * 4)) * 100);

    return res.status(200).json({
      skor,
      total,
      ringkasan: String(hasil.ringkasan || ""),
      kelebihan: Array.isArray(hasil.kelebihan) ? hasil.kelebihan.slice(0, 3).map(String) : [],
      perbaikan: Array.isArray(hasil.perbaikan)
        ? hasil.perbaikan.slice(0, 3).map((p) => ({
            asli: String(p.asli || ""),
            lebihBaik: String(p.lebihBaik || ""),
            alasan: String(p.alasan || "")
          }))
        : []
    });
  } catch (err) {
    console.error("Gagal menilai:", err.message);
    return res.status(502).json({ error: "Penilaian gagal dibuat. Silakan coba lagi." });
  }
}

// Ambil bagian JSON dari jawaban AI
function bacaJSON(teks) {
  const awal = teks.indexOf("{");
  const akhir = teks.lastIndexOf("}");
  if (awal === -1 || akhir === -1) throw new Error("AI tidak mengembalikan JSON");
  return JSON.parse(teks.slice(awal, akhir + 1));
}

const PROMPT_PENILAI = `You are an experienced English teacher for Indonesian vocational (SMK) and high school students training for tourism and hospitality jobs in Bali. Evaluate only the STUDENT's turns. The student plays the hotel or tourism staff member.

The transcript comes from speech recognition, so it may contain recognition errors and missing punctuation. Do not penalize obvious transcription mistakes.

Score each criterion from 1 to 4:
- tataBahasa (grammar and vocabulary): 4 = accurate and varied; 3 = minor errors that do not affect meaning; 2 = frequent errors, meaning still clear; 1 = errors make the meaning unclear.
- bahasaLayanan (hospitality language): 4 = consistently polite and uses service expressions (greeting, apologizing, offering help, thanking); 3 = mostly polite with some service expressions; 2 = basic politeness only; 1 = abrupt or impolite.
- penyelesaianTugas (task completion): 4 = fully handled the guest's need with a clear solution; 3 = mostly handled; 2 = partly handled; 1 = did not address the guest's need.
- kejelasan (clarity): 4 = clear, complete and relevant answers; 3 = mostly clear; 2 = often too short or vague; 1 = hard to understand or off-topic.

Respond with JSON only, in exactly this shape:
{
  "skor": { "tataBahasa": 1, "bahasaLayanan": 1, "penyelesaianTugas": 1, "kejelasan": 1 },
  "ringkasan": "2-3 encouraging sentences in Bahasa Indonesia summarizing the performance",
  "kelebihan": ["up to 2 strengths, in Bahasa Indonesia"],
  "perbaikan": [
    { "asli": "the student's original sentence", "lebihBaik": "a better English version a hotel professional would say", "alasan": "a short reason in Bahasa Indonesia" }
  ]
}
Give at most 3 items in "perbaikan", choosing the most useful corrections. Be honest but supportive.`;