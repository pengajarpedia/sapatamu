import { SKENARIO } from "../lib/scenarios.js";

export default function handler(req, res) {
  // Hanya kirim data yang dibutuhkan browser, bukan instruksi untuk AI
  const daftar = Object.entries(SKENARIO).map(([id, s]) => ({
    id,
    judul: s.judul,
    deskripsi: s.deskripsi,
    sapaan: s.sapaan
  }));
  res.status(200).json(daftar);
}