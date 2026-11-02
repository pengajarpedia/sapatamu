import { KELOMPOK, TANTANGAN } from "../lib/scenarios.js";

// Mengirim daftar bidang, profesi, dan kasus ke browser.
// Data ini tidak rahasia; instruksi untuk AI tetap dibuat di server (api/guest.js).
export default function handler(req, res) {
  res.status(200).json({ tantangan: TANTANGAN, kelompok: KELOMPOK });
}
