// ===== 1. Ambil elemen-elemen dari halaman =====
const bagianPilih = document.getElementById("pilih");
const judulPilih = document.getElementById("judul-pilih");
const tombolKembali = document.getElementById("tombol-kembali");
const daftarPilihan = document.getElementById("daftar-pilihan");
const bagianPercakapan = document.getElementById("percakapan");
const judulSkenario = document.getElementById("judul-skenario");
const kartuTugas = document.getElementById("kartu-tugas");
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
  penyelesaianTugas: "Penyelesaian masalah",
  kejelasan: "Kejelasan"
};

const IKON_BIDANG = {
  "perhotelan": "🏨",
  "kuliner": "🍽️",
  "usaha-layanan-pariwisata": "🧭",
  "kecantikan-dan-spa": "💆",
  "transportasi-wisata": "🚐",
  "objek-wisata-dan-rekreasi": "🏛️",
  "pemasaran-digital-pariwisata": "📱",
  "pendukung-pariwisata": "💐"
};

// ===== 2. Keadaan (state) aplikasi =====
let DATA = { tantangan: "", kelompok: [] };
let pilihanBidang = null;     // bidang yang sedang dibuka
let pilihanProfesi = null;    // profesi yang sedang dibuka
let skenarioAktif = null;     // kasus yang sedang dilatih
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

// ===== 6. Muat data bidang, profesi, dan kasus dari server =====
async function muatData() {
  try {
    const res = await fetch("/api/scenarios");
    if (!res.ok) throw new Error();
    DATA = await res.json();
    tampilPilihan();
  } catch {
    daftarPilihan.textContent = "Gagal memuat daftar profesi. Silakan muat ulang halaman.";
  }
}

// ===== 7. Pilih bidang → profesi → kasus =====
function tampilPilihan() {
  daftarPilihan.innerHTML = "";

  if (!pilihanBidang) {
    judulPilih.textContent = "1. Pilih bidang";
    tombolKembali.hidden = true;
    DATA.kelompok.forEach((b) => {
      const ikon = IKON_BIDANG[b.id] || "📌";
      daftarPilihan.append(kartu(ikon + " " + b.nama, b.profesi.length + " profesi", () => {
        pilihanBidang = b;
        tampilPilihan();
      }));
    });
  } else if (!pilihanProfesi) {
    judulPilih.textContent = "2. Pilih profesi · " + pilihanBidang.nama;
    tombolKembali.hidden = false;
    pilihanBidang.profesi.forEach((p) => {
      daftarPilihan.append(kartu(p.nama, p.kompetensi, () => {
        pilihanProfesi = p;
        tampilPilihan();
      }));
    });
  } else {
    judulPilih.textContent = "3. Pilih kasus · " + pilihanProfesi.nama;
    tombolKembali.hidden = false;
    pilihanProfesi.skenario.forEach((s, i) => {
      daftarPilihan.append(kartu("Kasus " + (i + 1), s.masalah, () => {
        mulaiSkenario({ ...s, profesi: pilihanProfesi, bidang: pilihanBidang });
      }));
    });
  }
}

tombolKembali.addEventListener("click", () => {
  if (pilihanProfesi) pilihanProfesi = null;
  else pilihanBidang = null;
  tampilPilihan();
});

function kartu(judul, keterangan, saatDiklik) {
  const tombol = el("button", "kartu-skenario");
  tombol.type = "button";
  tombol.append(el("strong", "", judul), el("span", "", keterangan));
  tombol.addEventListener("click", saatDiklik);
  return tombol;
}

// ===== 8. Mulai kasus =====
function mulaiSkenario(s) {
  speechSynthesis.cancel();
  skenarioAktif = s;
  riwayat = [];
  sedangMenunggu = false;
  percakapanSelesai = false;
  chat.innerHTML = "";
  bagianLaporan.hidden = true;
  bagianLaporan.innerHTML = "";

  judulSkenario.textContent = "Kamu sebagai: " + s.profesi.nama;
  kartuTugas.innerHTML = "";
  kartuTugas.append(
    el("p", "label-tugas", "Situasi"),
    el("p", "", s.masalah),
    el("p", "label-tugas", "Tugasmu (bicara dalam bahasa Inggris)"),
    el("p", "", DATA.tantangan)
  );

  bagianPercakapan.hidden = false;
  bagianPercakapan.scrollIntoView({ behavior: "smooth" });
  mintaPembuka();
}

// AI membuka percakapan sesuai kasus (memperkenalkan diri dan masalahnya)
async function mintaPembuka() {
  sedangMenunggu = true;
  perbaruiTombol();
  tampilStatus("Menyiapkan situasi...");
  try {
    const data = await panggilAPI("/api/guest", { skenarioId: skenarioAktif.id, riwayat: [] });
    tambahPesan("tamu", data.balasan);
    bicara(data.balasan);
    tampilStatus("");
  } catch (err) {
    tampilStatus(err.message + " ");
    const ulang = el("button", "tombol-kecil", "Coba lagi");
    ulang.type = "button";
    ulang.addEventListener("click", mintaPembuka);
    statusEl.append(ulang);
  } finally {
    sedangMenunggu = false;
    perbaruiTombol();
  }
}

// ===== 9. Kirim jawaban siswa ke AI lawan bicara =====
async function kirimJawaban(teks) {
  if (sedangMenunggu || percakapanSelesai || !skenarioAktif || riwayat.length === 0) return;

  tambahPesan("siswa", teks);
  sedangMenunggu = true;
  perbaruiTombol();
  tampilStatus("Lawan bicara sedang berpikir...");

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

// ===== 10. Penilaian oleh AI =====
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
      const kartuPerbaikan = el("div", "kartu-perbaikan");
      const dengar = el("button", "tombol-kecil", "🔊 Dengarkan");
      dengar.addEventListener("click", () => bicara(p.lebihBaik));
      kartuPerbaikan.append(
        el("p", "asli", "Kamu: " + p.asli),
        el("p", "lebih-baik", "Lebih baik: " + p.lebihBaik),
        el("p", "alasan", p.alasan),
        dengar
      );
      bagianLaporan.append(kartuPerbaikan);
    });
  }

  bagianLaporan.append(el("p", "disclaimer",
    "Nilai ini dibuat oleh AI sebagai umpan balik latihan, bukan nilai resmi. Guru tetap dapat meninjau hasilnya."));

  const ulang = el("button", "tombol-sekunder", "Latihan lagi (kasus yang sama)");
  ulang.addEventListener("click", () => mulaiSkenario(skenarioAktif));
  const lain = el("button", "tombol-sekunder", "Pilih kasus lain");
  lain.addEventListener("click", () => bagianPilih.scrollIntoView({ behavior: "smooth" }));
  bagianLaporan.append(ulang, lain);
}

// ===== 11. Fungsi-fungsi bantu =====
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
  chat.appendChild(el("div", "pesan " + peran, teks));
  chat.scrollTop = chat.scrollHeight;
}

function bicara(teks) {
  // Kalau fitur suara browser bermasalah, percakapan tetap jalan lewat teks
  try {
    if (!("speechSynthesis" in window)) return;
    const ucapan = new SpeechSynthesisUtterance(teks);
    ucapan.lang = "en-US";
    ucapan.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(ucapan);
  } catch (err) {
    console.warn("Suara tidak dapat diputar:", err.message);
  }
}

function perbaruiTombol() {
  // Terkunci saat menunggu AI, setelah selesai, atau sebelum lawan bicara membuka percakapan
  const terkunci = sedangMenunggu || percakapanSelesai || riwayat.length === 0;
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

// ===== 12. Jalankan saat halaman dibuka =====
perbaruiTombol();
muatData();
