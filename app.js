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
let sesi = 0;                 // nomor sesi latihan; jawaban AI dari sesi lama diabaikan

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
  hentikanSuara();
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
  hentikanSuara();
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
const jejak = document.getElementById("jejak");
const bannerBidang = document.getElementById("banner-bidang");
const gambarBanner = document.getElementById("gambar-banner");

// Kalau file ilustrasi bidang belum ada, banner disembunyikan
gambarBanner.addEventListener("error", () => { bannerBidang.hidden = true; });

// Tampilkan ilustrasi bidang (img/<id-bidang>.jpg) di langkah pilih profesi dan kasus
function tampilBanner(bidang) {
  if (!bidang) {
    bannerBidang.hidden = true;
    return;
  }
  const src = "img/" + bidang.id + ".jpg";
  if (gambarBanner.getAttribute("src") !== src) gambarBanner.src = src;
  gambarBanner.alt = "Ilustrasi profesi di bidang " + bidang.nama;
  bannerBidang.hidden = false;
}

function tampilPilihan() {
  daftarPilihan.innerHTML = "";
  tampilBanner(pilihanBidang);

  if (!pilihanBidang) {
    judulPilih.textContent = "Pilih bidang";
    jejak.textContent = "Langkah 1 dari 3";
    tombolKembali.hidden = true;
    daftarPilihan.className = "daftar-pilihan daftar-bidang";
    DATA.kelompok.forEach((b) => daftarPilihan.append(kartuBidang(b)));
  } else if (!pilihanProfesi) {
    judulPilih.textContent = "Pilih profesi";
    jejak.textContent = "Langkah 2 dari 3 › " + pilihanBidang.nama;
    tombolKembali.hidden = false;
    daftarPilihan.className = "daftar-pilihan daftar-profesi";
    pilihanBidang.profesi.forEach((p) => {
      daftarPilihan.append(tombolPilihan("baris-profesi", p.nama, p.kompetensi, () => {
        pilihanProfesi = p;
        tampilPilihan();
      }));
    });
  } else {
    judulPilih.textContent = "Pilih kasus";
    jejak.textContent = "Langkah 3 dari 3 › " + pilihanBidang.nama + " › " + pilihanProfesi.nama;
    tombolKembali.hidden = false;
    daftarPilihan.className = "daftar-pilihan daftar-kasus";
    pilihanProfesi.skenario.forEach((s, i) => {
      daftarPilihan.append(tombolPilihan("kartu-kasus", "Kasus " + (i + 1), s.masalah, () => {
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

// Kartu bidang bergambar. Kalau gambar belum ada, ikon cadangan yang tampil.
function kartuBidang(b) {
  const tombol = el("button", "kartu-bidang");
  tombol.type = "button";

  const gambar = el("div", "gambar-bidang");
  const ikon = el("span", "ikon-cadangan", IKON_BIDANG[b.id] || "📌");
  ikon.setAttribute("aria-hidden", "true");
  const img = document.createElement("img");
  img.src = "img/bidang/" + b.id + ".jpg";
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => img.remove());
  gambar.append(ikon, img);

  tombol.append(gambar, el("strong", "nama", b.nama), el("span", "jumlah", b.profesi.length + " profesi"));
  tombol.addEventListener("click", () => {
    pilihanBidang = b;
    tampilPilihan();
  });
  return tombol;
}

function tombolPilihan(kelas, judul, keterangan, saatDiklik) {
  const tombol = el("button", kelas);
  tombol.type = "button";
  tombol.append(el("strong", "", judul), el("span", "", keterangan));
  tombol.addEventListener("click", saatDiklik);
  return tombol;
}

// ===== 8. Mulai kasus =====
function mulaiSkenario(s) {
  hentikanSuara();
  sesi++;
  skenarioAktif = s;
  riwayat = [];
  sedangMenunggu = false;
  percakapanSelesai = false;
  chat.innerHTML = "";
  bagianLaporan.hidden = true;
  bagianLaporan.innerHTML = "";

  judulSkenario.textContent = "Kamu sebagai " + s.profesi.nama;
  kartuTugas.innerHTML = "";
  kartuTugas.append(
    el("p", "label-tugas", "Situasi"),
    el("p", "", s.masalah),
    el("p", "label-tugas", "Tugasmu (bicara dalam bahasa Inggris)"),
    el("p", "", DATA.tantangan)
  );

  bagianPilih.hidden = true; // daftar pilihan disembunyikan selama latihan
  bagianPercakapan.hidden = false;
  bagianPercakapan.scrollIntoView({ behavior: "smooth" });
  mintaPembuka();
}

// AI membuka percakapan sesuai kasus (memperkenalkan diri dan masalahnya)
async function mintaPembuka() {
  const sesiIni = sesi;
  sedangMenunggu = true;
  perbaruiTombol();
  tampilStatus("Menyiapkan situasi...");
  try {
    const data = await panggilAPI("/api/guest", { skenarioId: skenarioAktif.id, riwayat: [] });
    if (sesiIni !== sesi) return; // siswa sudah pindah kasus
    tambahPesan("tamu", data.balasan);
    bicara(data.balasan);
    tampilStatus("");
  } catch (err) {
    if (sesiIni !== sesi) return;
    tampilStatus(err.message + " ");
    const ulang = el("button", "tombol-kecil", "Coba lagi");
    ulang.type = "button";
    ulang.addEventListener("click", mintaPembuka);
    statusEl.append(ulang);
  } finally {
    if (sesiIni === sesi) {
      sedangMenunggu = false;
      perbaruiTombol();
    }
  }
}

// ===== 9. Kirim jawaban siswa ke AI lawan bicara =====
async function kirimJawaban(teks) {
  if (sedangMenunggu || percakapanSelesai || !skenarioAktif || riwayat.length === 0) return;

  const sesiIni = sesi;
  tambahPesan("siswa", teks);
  sedangMenunggu = true;
  perbaruiTombol();
  tampilStatus("Lawan bicara sedang berpikir...");

  try {
    const data = await panggilAPI("/api/guest", { skenarioId: skenarioAktif.id, riwayat });
    if (sesiIni !== sesi) return; // siswa sudah pindah kasus
    tambahPesan("tamu", data.balasan);
    bicara(data.balasan);
    tampilStatus("");
    if (data.selesai) selesaiPercakapan();
  } catch (err) {
    if (sesiIni !== sesi) return;
    // Batalkan jawaban terakhir dan kembalikan ke kolom ketik agar bisa dikirim ulang
    riwayat.pop();
    chat.lastChild.remove();
    inputKetik.value = teks;
    tampilStatus(err.message + " Jawabanmu belum terkirim, silakan kirim ulang.");
  } finally {
    if (sesiIni === sesi) {
      sedangMenunggu = false;
      perbaruiTombol();
    }
  }
}

// ===== 10. Penilaian oleh AI =====
async function selesaiPercakapan() {
  const sesiIni = sesi;
  percakapanSelesai = true;
  perbaruiTombol();
  tampilStatus("");
  bagianLaporan.hidden = false;
  bagianLaporan.innerHTML = "";
  bagianLaporan.append(el("p", "", "Sedang menilai jawabanmu..."));
  bagianLaporan.scrollIntoView({ behavior: "smooth" });

  try {
    const data = await panggilAPI("/api/evaluate", { skenarioId: skenarioAktif.id, riwayat });
    if (sesiIni !== sesi) return;
    tampilLaporan(data);
  } catch (err) {
    if (sesiIni !== sesi) return;
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
  lain.addEventListener("click", kembaliKePilihan);
  bagianLaporan.append(ulang, lain);
}

// ===== 11. Ganti kasus atau profesi =====
const tombolGanti = document.getElementById("tombol-ganti");
const dialogKeluar = document.getElementById("dialog-keluar");
const dialogNilai = document.getElementById("dialog-nilai");
const dialogKeluarTanpaNilai = document.getElementById("dialog-keluar-tanpa-nilai");
const dialogLanjut = document.getElementById("dialog-lanjut");

function jumlahJawaban() {
  return riwayat.filter((p) => p.peran === "siswa").length;
}

// Siswa sudah menjawab tapi latihan belum dinilai
function latihanBelumSelesai() {
  return !bagianPercakapan.hidden && !percakapanSelesai && jumlahJawaban() > 0;
}

// Dipanggil saat siswa ingin pindah kasus atau profesi
function mintaGantiKasus() {
  if (bagianPercakapan.hidden) {
    bagianPilih.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (!latihanBelumSelesai()) {
    kembaliKePilihan();
    return;
  }
  dialogNilai.hidden = jumlahJawaban() < 2;
  dialogKeluar.showModal();
}

function kembaliKePilihan() {
  sesi++; // jawaban AI yang masih dalam perjalanan akan diabaikan
  hentikanSuara();
  skenarioAktif = null;
  riwayat = [];
  sedangMenunggu = false;
  percakapanSelesai = false;
  chat.innerHTML = "";
  tampilStatus("");
  bagianPercakapan.hidden = true;
  bagianLaporan.hidden = true;
  bagianLaporan.innerHTML = "";
  bagianPilih.hidden = false;
  tampilPilihan();
  bagianPilih.scrollIntoView({ behavior: "smooth" });
}

tombolGanti.addEventListener("click", mintaGantiKasus);
dialogLanjut.addEventListener("click", () => dialogKeluar.close());
dialogKeluarTanpaNilai.addEventListener("click", () => {
  dialogKeluar.close();
  kembaliKePilihan();
});
dialogNilai.addEventListener("click", () => {
  dialogKeluar.close();
  hentikanSuara();
  selesaiPercakapan();
});

// Tombol "Mulai latihan" di bagian pembuka
document.querySelector(".tombol-utama").addEventListener("click", (e) => {
  e.preventDefault();
  mintaGantiKasus();
});

// ===== 12. Fungsi-fungsi bantu =====
// Hentikan suara tamu dan mikrofon yang sedang aktif
function hentikanSuara() {
  try { speechSynthesis.cancel(); } catch {}
  try { if (pengenal) pengenal.abort(); } catch {}
}

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

// ===== 13. Jalankan saat halaman dibuka =====
perbaruiTombol();
muatData();
