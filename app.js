// ===== 1. Daftar skenario (sementara, nanti dilengkapi) =====
const SKENARIO = [
  {
    id: "checkin",
    judul: "Check-in di homestay Ubud",
    deskripsi: "Tamu datang, tapi reservasinya tidak ditemukan.",
    sapaan: "Hi there! I'd like to check in, please. The name is Sarah Miller."
  },
  {
    id: "komplain",
    judul: "Tamu komplain AC mati",
    deskripsi: "Tamu kesal karena kamarnya panas.",
    sapaan: "Excuse me, the air conditioner in my room isn't working. It's really hot in there!"
  },
  {
    id: "pura",
    judul: "Menjelaskan etika masuk pura",
    deskripsi: "Turis ingin masuk pura memakai celana pendek.",
    sapaan: "Hello! Can I go inside the temple now? I'm wearing shorts, is that okay?"
  }
];

// ===== 2. Ambil elemen-elemen dari halaman =====
const daftarSkenario = document.getElementById("daftar-skenario");
const bagianPercakapan = document.getElementById("percakapan");
const judulSkenario = document.getElementById("judul-skenario");
const chat = document.getElementById("chat");
const tombolRekam = document.getElementById("tombol-rekam");
const formKetik = document.getElementById("form-ketik");
const inputKetik = document.getElementById("input-ketik");
const statusEl = document.getElementById("status");

let skenarioAktif = null;
let riwayat = []; // menyimpan isi percakapan

// ===== 3. Tampilkan kartu pilihan skenario =====
SKENARIO.forEach((s) => {
  const kartu = document.createElement("button");
  kartu.className = "kartu-skenario";
  kartu.innerHTML = `<strong>${s.judul}</strong><span>${s.deskripsi}</span>`;
  kartu.addEventListener("click", () => mulaiSkenario(s));
  daftarSkenario.appendChild(kartu);
});

function mulaiSkenario(s) {
  skenarioAktif = s;
  riwayat = [];
  chat.innerHTML = "";
  judulSkenario.textContent = s.judul;
  bagianPercakapan.hidden = false;
  tambahPesan("tamu", s.sapaan);
  bicara(s.sapaan);
}

// ===== 4. Tampilkan pesan di layar chat =====
function tambahPesan(peran, teks) {
  riwayat.push({ peran, teks });
  const div = document.createElement("div");
  div.className = "pesan " + peran;
  div.textContent = teks;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// ===== 5. Suara tamu (text-to-speech bawaan browser) =====
function bicara(teks) {
  if (!("speechSynthesis" in window)) return;
  const ucapan = new SpeechSynthesisUtterance(teks);
  ucapan.lang = "en-US";
  ucapan.rate = 0.95; // sedikit lebih pelan agar mudah dipahami
  speechSynthesis.cancel();
  speechSynthesis.speak(ucapan);
}

// ===== 6. Rekam suara siswa (speech-to-text bawaan browser) =====
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let pengenal = null;

if (SpeechRecognition) {
  pengenal = new SpeechRecognition();
  pengenal.lang = "en-US";
  pengenal.interimResults = false;

  pengenal.onresult = (event) => {
    const teks = event.results[0][0].transcript;
    kirimJawaban(teks);
  };
  pengenal.onerror = (event) => {
    tampilStatus("Mikrofon bermasalah (" + event.error + "). Silakan ketik jawabanmu.");
  };
  pengenal.onend = () => {
    tombolRekam.disabled = false;
    tombolRekam.textContent = "🎤 Tekan untuk bicara";
  };
} else {
  tombolRekam.disabled = true;
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

// ===== 7. Mode ketik (cadangan kalau mikrofon gagal) =====
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

// ===== 8. Proses jawaban (sementara belum ke AI) =====
function kirimJawaban(teks) {
  tambahPesan("siswa", teks);
  // Di langkah 4, bagian ini akan memanggil Claude sebagai tamu
  tampilStatus("Jawaban tercatat. AI tamu akan disambungkan di langkah 4.");
}

function tampilStatus(teks) {
  statusEl.textContent = teks;
}