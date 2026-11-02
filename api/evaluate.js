import { tanyaAI } from "../lib/ai.js";
import { cariSkenario, TANTANGAN } from "../lib/scenarios.js";

const KRITERIA = ["tataBahasa", "bahasaLayanan", "penyelesaianTugas", "kejelasan"];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan metode POST." });
  }

  // 1. Periksa data
  const { skenarioId, riwayat } = req.body || {};
  const data = cariSkenario(skenarioId);
  if (!data) return res.status(400).json({ error: "Kasus tidak ditemukan." });
  if (!Array.isArray(riwayat) || riwayat.length > 40) {
    return res.status(400).json({ error: "Riwayat percakapan tidak valid." });
  }
  const jumlahJawaban = riwayat.filter((p) => p && p.peran === "siswa").length;
  if (jumlahJawaban < 1) {
    return res.status(400).json({ error: "Belum ada jawaban untuk dinilai." });
  }

  // 2. Susun transkrip percakapan untuk dinilai
  const transkrip = riwayat
    .filter((p) => p && typeof p.teks === "string" && ["tamu", "siswa"].includes(p.peran))
    .map((p) => `${p.peran === "tamu" ? "OTHER PERSON" : "STUDENT"}: ${p.teks.slice(0, 500)}`)
    .join("\n");

  const konteks = `Student's role: ${data.profesi.nama} (main skills: ${data.profesi.kompetensi})
Problem situation (in Indonesian): ${data.skenario.masalah}
What the student is expected to do (in Indonesian): ${TANTANGAN}

Transcript:
${transkrip}`;

  try {
    const jawaban = await tanyaAI({
      system: PROMPT_PENILAI,
      messages: [{ role: "user", content: konteks }],
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
            asli: String(p?.asli || ""),
            lebihBaik: String(p?.lebihBaik || ""),
            alasan: String(p?.alasan || "")
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

const PROMPT_PENILAI = `You are an experienced English teacher for Indonesian vocational (SMK) and high school students training for tourism jobs in Bali. Evaluate only the STUDENT's turns. The student plays a tourism staff member; the OTHER PERSON may be a guest, customer, colleague or client.

The transcript comes from speech recognition, so it may contain recognition errors and missing punctuation. Do not penalize obvious transcription mistakes.

Score each criterion from 1 to 4:
- tataBahasa (grammar and vocabulary): 4 = accurate and varied; 3 = minor errors that do not affect meaning; 2 = frequent errors, meaning still clear; 1 = errors make the meaning unclear.
- bahasaLayanan (professional service language): 4 = consistently polite and uses service expressions (greeting, apologizing, offering help, thanking); 3 = mostly polite with some service expressions; 2 = basic politeness only; 1 = abrupt or impolite.
- penyelesaianTugas (problem solving): 4 = identified the problem, asked for the information needed, offered clear steps that follow standard procedure, and explained the reason for the solution; 3 = did most of these; 2 = did some of these; 1 = did not address the problem.
- kejelasan (clarity): 4 = clear, complete and relevant answers; 3 = mostly clear; 2 = often too short or vague; 1 = hard to understand or off-topic.

Respond with JSON only, in exactly this shape:
{
  "skor": { "tataBahasa": 1, "bahasaLayanan": 1, "penyelesaianTugas": 1, "kejelasan": 1 },
  "ringkasan": "2-3 encouraging sentences in Bahasa Indonesia summarizing the performance",
  "kelebihan": ["up to 2 strengths, in Bahasa Indonesia"],
  "perbaikan": [
    { "asli": "the student's original sentence", "lebihBaik": "a better English version a tourism professional would say", "alasan": "a short reason in Bahasa Indonesia" }
  ]
}
Give at most 3 items in "perbaikan", choosing the most useful corrections. Be honest but supportive. Write all Indonesian text in a friendly tone, addressing the student as "kamu", not "Anda".`;
