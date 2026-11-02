import { tanyaAI } from "../lib/ai.js";
import { SKENARIO } from "../lib/scenarios.js";

const MAKS_GILIRAN = 10; // batas giliran siswa, untuk menghemat biaya API

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan metode POST." });
  }

  // 1. Periksa data yang dikirim browser
  const { skenarioId, riwayat } = req.body || {};
  const s = SKENARIO[skenarioId];
  if (!s) return res.status(400).json({ error: "Skenario tidak ditemukan." });
  if (!Array.isArray(riwayat) || riwayat.length === 0 || riwayat.length > 30) {
    return res.status(400).json({ error: "Riwayat percakapan tidak valid." });
  }

  // 2. Ubah riwayat ke format Claude: tamu = assistant, siswa = user
  const messages = [{ role: "user", content: "(The staff member approaches you. Start the conversation.)" }];
  for (const p of riwayat) {
    if (typeof p.teks !== "string" || !["tamu", "siswa"].includes(p.peran)) {
      return res.status(400).json({ error: "Format pesan tidak valid." });
    }
    messages.push({
      role: p.peran === "tamu" ? "assistant" : "user",
      content: p.teks.slice(0, 500) // batasi panjang tiap pesan
    });
  }
  if (messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Pesan terakhir harus dari siswa." });
  }

  const giliranSiswa = riwayat.filter((p) => p.peran === "siswa").length;
  const harusSelesai = giliranSiswa >= MAKS_GILIRAN;

  // 3. Panggil AI, dan tangani kalau gagal
  try {
    let balasan = await tanyaAI({ system: buatPromptTamu(s, harusSelesai), messages });
    const selesai = balasan.includes("[END]") || harusSelesai;
    balasan = balasan.replace("[END]", "").trim();
    return res.status(200).json({ balasan, selesai });
  } catch (err) {
    console.error("Gagal memanggil AI:", err.message);
    return res.status(502).json({ error: "AI sedang tidak dapat dihubungi. Coba lagi sebentar lagi." });
  }
}

function buatPromptTamu(s, harusSelesai) {
  return `You are role-playing a guest in Bali for an English speaking practice app used by Indonesian high school and vocational students who are training for tourism jobs.

Character: ${s.persona}
Situation: ${s.situasi}
Your goal: ${s.tujuan}

Rules:
- Stay in character as the guest at all times. Never act as a teacher, never correct the student's English, and never mention that you are an AI.
- Use natural but simple English (around CEFR B1). Keep each reply to 1-3 short sentences.
- React realistically: become friendlier if the student is polite and helpful; ask for clarification if their answer is unclear.
- If the student says something inappropriate or off-topic, politely bring the conversation back to the situation.
- When your goal is achieved or the conversation reaches a natural end, say a short goodbye and add the tag [END] at the very end.
- Reply with plain text only: no stage directions, no emojis.${harusSelesai ? "\n- The practice time is over: politely wrap up in this reply and add [END]." : ""}`;
}