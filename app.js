// ===== 1. Ambil elemen-elemen dari halaman =====
const daftarSkenario = document.getElementById("daftar-skenario");
const bagianPercakapan = document.getElementById("percakapan");
const judulSkenario = document.getElementById("judul-skenario");
const chat = document.getElementById("chat");
const tombolRekam = document.getElementById("tombol-rekam");
const formKetik = document.getElementById("form-ketik");
const inputKetik = document.getElementById("input-ketik");
const tombolKirim = formKetik.querySelector("button");
const statusEl = document.getElementById("status");

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
  speechSynthesis.cancel(); // hentikan suara tamu dulu
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

// ===== 5. Muat daftar skenario dari server =====
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

// ===== 6. Mulai skenario =====
function mulaiSkenario(s) {
  skenarioAktif = s;
  riwayat = [];
  sedangMenunggu = false;
  percakapanSelesai = false;
  chat.innerHTML = "";
  judulSkenario.textContent = s.judul;
  bagianPercakapan.hidden = false;
  tampilStatus("");
  perbaruiTombol();
  tambahPesan("tamu", s.sapaan);
  bicara(s.sapaan);
  bagianPercakapan.scrollIntoView({ behavior: "smooth" });
}

// ===== 7. Kirim jawaban siswa ke AI tamu =====
async function kirimJawaban(teks) {
  if (sedangMenunggu || percakapanSelesai || !skenarioAktif) return;

  tambahPesan("siswa", teks);
  sedangMenunggu = true;
  perbaruiTombol();
  tampilStatus("Tamu sedang berpikir...");

  // Batasi waktu tunggu 30 detik agar aplikasi tidak menggantung
  const pengendali = new AbortController();
  const batasWaktu = setTimeout(() => pengendali.abort(), 40000);

  try {
    const res = await fetch("/api/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skenarioId: skenarioAktif.id, riwayat }),
      signal: pengendali.signal
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Terjadi kesalahan.");

    tambahPesan("tamu", data.balasan);
    bicara(data.balasan);
    tampilStatus("");
    if (data.selesai) selesaiPercakapan();
  } catch (err) {
    // Batalkan jawaban terakhir dan kembalikan ke kolom ketik agar bisa dikirim ulang
    riwayat.pop();
    chat.lastChild.remove();
    inputKetik.value = teks;
    const pesan = err.name === "AbortError" ? "Tamu terlalu lama menjawab." : err.message;
    tampilStatus(pesan + " Jawabanmu belum terkirim, silakan kirim ulang.");
  } finally {
    clearTimeout(batasWaktu);
    sedangMenunggu = false;
    perbaruiTombol();
  }
}

// ===== 8. Fungsi-fungsi bantu =====
function tambahPesan(peran, teks) {
  riwayat.push({ peran, teks });
  const div = document.createElement("div");
  div.className = "pesan " + peran;
  div.textContent = teks;
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

function selesaiPercakapan() {
  percakapanSelesai = true;
  perbaruiTombol();
  tampilStatus("Percakapan selesai! Penilaian akan ditambahkan di langkah 5.");
}

function perbaruiTombol() {
  const terkunci = sedangMenunggu || percakapanSelesai;
  tombolRekam.disabled = terkunci || !pengenal;
  inputKetik.disabled = terkunci;
  tombolKirim.disabled = terkunci;
}

function tampilStatus(teks) {
  statusEl.textContent = teks;
}

// ===== 9. Jalankan saat halaman dibuka =====
perbaruiTombol();
muatSkenario();