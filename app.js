// ===== 1. Ambil elemen-elemen dari halaman =====
const daftarSkenario = document.getElementById("daftar-skenario");
const bagianPercakapan = document.getElementById("percakapan");
const judulSkenario = document.getElementById("judul-skenario");
const chat = document.getElementById("chat");
const tombolRekam = document.getElementById("tombol-rekam");
const formKetik = document.getElementById("form-ketik");
const inputKetik = document.getElementById("input-ketik");
const tombolKirim = formKetik.querySelector("button");
const tombolAkhiri = document.getElementById("tombol-akhiri");
const bagianLaporan = document.getElementById("laporan");
const statusEl = document.getElementById("status");

const NAMA_KRITERIA = {
  tataBahasa: "Tata bahasa & kosakata",
  bahasaLayanan: "Bahasa layanan",
  penyelesaianTugas: "Penyelesaian tugas",
  kejelasan: "Kejelasan"
};

// ===== 2. Keadaan (state) aplikasi =====
let skenarioAktif = null;
let riwayat = [];             // isi percakapan: [{ peran, teks }]
let sedangMenunggu = false;   // true saat menunggu balasan AI
let percakapanSelesai = false;

// ===== 3. Pengenal suara (speech-to-text bawaan browser) =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let pengenal = null;

if (SpeechRecognition) {
  pengenal = new SpeechRecognition();
  pengenal.lang = "en-US";
  pengenal.interimResults = false;
  pengenal.onresult = (event) => kirimJawaban(event.results[0][0].transcript);
  pengenal.onerror = (event) => {
    tampilStatus("Mikrofon bermasalah (" + event.error + "). Silakan ketik jawabanmu.");
  };
  pengenal.onend = () => {
    tombolRekam.textContent = "🎤 Tekan untuk bicara";
    perbaruiTombol();
  };
} else {
  tampilStatus("Browser ini belum mendukung input suara. Gunakan Chrome, atau ketik jawabanmu.");
}

tombolRekam.addEventListener("click", () => {
  if (!pengenal) return;
  speechSynthesis.cancel();
  tombolRekam.disabled = true;
  tombolRekam.textContent = "Mendengarkan...";
  tampilStatus("");
  pengenal.start();
});

// ===== 4. Mode ketik (cadangan kalau mikrofon gagal) =====
formKetik.addEventListener("submit", (e) => {
  e.preventDefault();
  const teks = inputKetik.value.trim();
  if (!teks) {
    tampilStatus("Tulis jawabanmu dulu.");
    return;
  }
  inputKetik.value = "";
  kirimJawaban(teks);
});

// ===== 5. Tombol akhiri percakapan =====
tombolAkhiri.addEventListener("click", () => {
  const jumlahJawaban = riwayat.filter((p) => p.peran === "siswa").length;
  if (jumlahJawaban < 2) {
    tampilStatus("Jawab minimal 2 kali sebelum melihat nilai.");
    return;
  }
  speechSynthesis.cancel();
  selesaiPercakapan();
});

// ===== 6. Muat daftar skenario dari server =====
async function muatSkenario() {
  try {
    const res = await fetch("/api/scenarios");
    const daftar = await res.json();
    daftar.forEach((s) => {
      const kartu = document.createElement("button");
      kartu.className = "kartu-skenario";
      kartu.innerHTML = `<strong>${s.judul}</strong><span>${s.deskripsi}</span>`;
      kartu.addEventListener("click", () => mulaiSkenario(s));
      daftarSkenario.appendChild(kartu);
    });
  } catch {
    daftarSkenario.textContent = "Gagal memuat skenario. Silakan muat ulang halaman.";
  }
}

// ===== 7. Mulai skenario =====
function mulaiSkenario(s) {
  skenarioAktif = s;
  riwayat = [];
  sedangMenunggu = false;
  percakapanSelesai = false;
  chat.innerHTML = "";
  bagianLaporan.hidden = true;
  bagianLaporan.innerHTML = "";
  judulSkenario.textContent = s.judul;
  bagianPercakapan.hidden = false;
  tampilStatus("");
  perbaruiTombol();
  tambahPesan("tamu", s.sapaan);
  bicara(s.sapaan);
  bagianPercakapan.scrollIntoView({ behavior: "smooth" });
}

// ===== 8. Kirim jawaban siswa ke AI tamu =====
async function kirimJawaban(teks) {
  if (sedangMenunggu || percakapanSelesai || !skenarioAktif) return;

  tambahPesan("siswa", teks);
  sedangMenunggu = true;
  perbaruiTombol();
  tampilStatus("Tamu sedang berpikir...");

  try {
    const data = await panggilAPI("/api/guest", { skenarioId: skenarioAktif.id, riwayat });
    tambahPesan("tamu", data.balasan);
    bicara(data.balasan);
    tampilStatus("");
    if (data.selesai) selesaiPercakapan();
  } catch (err) {
    // Batalkan jawaban terakhir dan kembalikan ke kolom ketik agar bisa dikirim ulang
    riwayat.pop();
    chat.lastChild.remove();
    inputKetik.value = teks;
    tampilStatus(err.message + " Jawabanmu belum terkirim, silakan kirim ulang.");
  } finally {
    sedangMenunggu = false;
    perbaruiTombol();
  }
}

// ===== 9. Penilaian oleh AI =====
async function selesaiPercakapan() {
  percakapanSelesai = true;
  perbaruiTombol();
  tampilStatus("");
  bagianLaporan.hidden = false;
  bagianLaporan.innerHTML = "";
  bagianLaporan.append(el("p", "", "Sedang menilai jawabanmu..."));
  bagianLaporan.scrollIntoView({ behavior: "smooth" });

  try {
    const data = await panggilAPI("/api/evaluate", { skenarioId: skenarioAktif.id, riwayat });
    tampilLaporan(data);
  } catch (err) {
    bagianLaporan.innerHTML = "";
    const ulang = el("button", "tombol-sekunder", "Coba nilai lagi");
    ulang.addEventListener("click", selesaiPercakapan);
    bagianLaporan.append(el("p", "", err.message), ulang);
  }
}

function tampilLaporan(data) {
  bagianLaporan.innerHTML = "";
  bagianLaporan.append(
    el("h2", "", "Hasil latihanmu"),
    el("p", "skor-total", data.total + "/100"),
    el("p", "", data.ringkasan)
  );

  // Nilai per kriteria dalam bentuk batang
  for (const [kunci, nama] of Object.entries(NAMA_KRITERIA)) {
    const nilai = data.skor[kunci];
    const baris = el("div", "baris-skor");
    baris.append(el("span", "", nama), el("span", "", nilai + "/4"));
    const bar = el("div", "bar");
    const isi = el("div", "isi-bar");
    isi.style.width = (nilai / 4) * 100 + "%";
    bar.append(isi);
    bagianLaporan.append(baris, bar);
  }

  if (data.kelebihan.length) {
    bagianLaporan.append(el("h3", "", "Yang sudah bagus"));
    const daftar = el("ul");
    data.kelebihan.forEach((k) => daftar.append(el("li", "", k)));
    bagianLaporan.append(daftar);
  }

  if (data.perbaikan.length) {
    bagianLaporan.append(el("h3", "", "Coba katakan seperti ini"));
    data.perbaikan.forEach((p) => {
      const kartu = el("div", "kartu-perbaikan");
      const dengar = el("button", "tombol-kecil", "🔊 Dengarkan");
      dengar.addEventListener("click", () => bicara(p.lebihBaik));
      kartu.append(
        el("p", "asli", "Kamu: " + p.asli),
        el("p", "lebih-baik", "Lebih baik: " + p.lebihBaik),
        el("p", "alasan", p.alasan),
        dengar
      );
      bagianLaporan.append(kartu);
    });
  }

  bagianLaporan.append(el("p", "disclaimer",
    "Nilai ini dibuat oleh AI sebagai umpan balik latihan, bukan nilai resmi. Guru tetap dapat meninjau hasilnya."));
  const ulang = el("button", "tombol-sekunder", "Latihan lagi");
  ulang.addEventListener("click", () => mulaiSkenario(skenarioAktif));
  bagianLaporan.append(ulang);
}

// ===== 10. Fungsi-fungsi bantu =====
// Kirim data ke server, dengan batas waktu 40 detik
async function panggilAPI(url, body) {
  const pengendali = new AbortController();
  const batasWaktu = setTimeout(() => pengendali.abort(), 40000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: pengendali.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Server terlalu lama menjawab.");
    throw err;
  } finally {
    clearTimeout(batasWaktu);
  }
}

function tambahPesan(peran, teks) {
  riwayat.push({ peran, teks });
  const div = el("div", "pesan " + peran, teks);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function bicara(teks) {
  if (!("speechSynthesis" in window)) return;
  const ucapan = new SpeechSynthesisUtterance(teks);
  ucapan.lang = "en-US";
  ucapan.rate = 0.95;
  speechSynthesis.cancel();
  speechSynthesis.speak(ucapan);
}

function perbaruiTombol() {
  const terkunci = sedangMenunggu || percakapanSelesai;
  tombolRekam.disabled = terkunci || !pengenal;
  inputKetik.disabled = terkunci;
  tombolKirim.disabled = terkunci;
  tombolAkhiri.disabled = terkunci;
}

function tampilStatus(teks) {
  statusEl.textContent = teks;
}

// Membuat elemen HTML dengan aman (teks dari AI tidak dijalankan sebagai kode)
function el(tag, className = "", teks = "") {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (teks) e.textContent = teks;
  return e;
}

// ===== 11. Jalankan saat halaman dibuka =====
perbaruiTombol();
muatSkenario();