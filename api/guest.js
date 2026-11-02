import { tanyaAI } from "../lib/ai.js";
import { cariSkenario } from "../lib/scenarios.js";

const MAKS_GILIRAN = 10; // batas giliran siswa, untuk menghemat kuota AI

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan metode POST." });
  }

  // 1. Periksa data yang dikirim browser
  const { skenarioId, riwayat } = req.body || {};
  const data = cariSkenario(skenarioId);
  if (!data) return res.status(400).json({ error: "Kasus tidak ditemukan." });
  if (!Array.isArray(riwayat) || riwayat.length > 30) {
    return res.status(400).json({ error: "Riwayat percakapan tidak valid." });
  }

  // Riwayat kosong = AI membuka percakapan (memperkenalkan diri dan masalahnya)
  const pembuka = riwayat.length === 0;
  if (!pembuka && riwayat[0].peran !== "tamu") {
    return res.status(400).json({ error: "Percakapan harus dibuka oleh lawan bicara." });
  }

  // 2. Ubah riwayat ke format AI: lawan bicara = assistant, siswa = user
  const messages = [{ role: "user", content: "(The practice starts now. Begin the conversation as your character.)" }];
  for (const p of riwayat) {
    if (!p || typeof p.teks !== "string" || !["tamu", "siswa"].includes(p.peran)) {
      return res.status(400).json({ error: "Format pesan tidak valid." });
    }
    messages.push({
      role: p.peran === "tamu" ? "assistant" : "user",
      content: p.teks.slice(0, 500) // batasi panjang tiap pesan
    });
  }
  if (!pembuka && messages[messages.length - 1].role !== "user") {
    return res.status(400).json({ error: "Pesan terakhir harus dari siswa." });
  }

  const giliranSiswa = riwayat.filter((p) => p.peran === "siswa").length;
  const harusSelesai = giliranSiswa >= MAKS_GILIRAN;

  // 3. Panggil AI, dan tangani kalau gagal
  try {
    let balasan = await tanyaAI({ system: buatPrompt(data, harusSelesai), messages });
    const selesai = !pembuka && (balasan.includes("[END]") || harusSelesai);
    balasan = balasan.replaceAll("[END]", "").trim();
    if (!balasan) throw new Error("balasan kosong");
    return res.status(200).json({ balasan, selesai });
  } catch (err) {
    console.error("Gagal memanggil AI:", err.message);
    return res.status(502).json({ error: "AI sedang tidak dapat dihubungi. Coba lagi sebentar lagi." });
  }
}

// Instruksi peran untuk AI, dibuat dari data profesi dan kasus
function buatPrompt({ profesi, skenario }, harusSelesai) {
  return `You are role-playing inside an English speaking practice app for Indonesian high school and vocational (SMK) students in Bali who are training for jobs in tourism.

The student plays the staff member: ${profesi.nama} (main skills: ${profesi.kompetensi}).
Setting: a tourism business in Bali.
The problem in this practice (written in Indonesian): "${skenario.masalah}"

Who you are:
- Play the most realistic person the staff member would speak with in this situation. Usually this is a guest, customer or visitor. If the problem is mainly internal (for example coordinating with a colleague, supervisor, client or vendor), play that person instead.
- Invent realistic details that fit Bali (a name, nationality, booking details, times, places) and keep them consistent for the whole conversation.

How to behave:
- In your first message, introduce yourself briefly and bring up the problem naturally, as that person would. Do not explain everything at once.
- Let the staff member lead. Do not solve the problem for them. Give extra details only when they ask relevant questions, so they practise gathering information.
- React realistically: become friendlier when the staff member is polite, clear and helpful; ask for clarification when an answer is unclear; stay a little worried or annoyed if your problem is ignored.
- Stay in character at all times. Never act as a teacher, never correct their English, and never mention that you are an AI.
- Use natural but simple English (around CEFR B1). Keep each reply to 1-3 short sentences.
- If the staff member says something inappropriate or off-topic, politely bring the conversation back to the situation.
- Keep everything appropriate for high school students.
- When the problem is solved or the conversation reaches a natural end, say a short goodbye and add the tag [END] at the very end.
- Reply with plain text only: no stage directions, no emojis.${harusSelesai ? "\n- The practice time is over: politely wrap up in this reply and add [END]." : ""}`;
}
