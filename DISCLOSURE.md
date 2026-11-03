# AI & Technology Disclosure

Produk: **SapaTamu**
Peserta: **I Kadek Aditya Pirnanda** (individu, kategori Mahasiswa/Umum)

| Komponen | Isi Peserta |
|---|---|
| **Nama Produk** | SapaTamu: latihan berbicara bahasa Inggris untuk profesi pariwisata di Bali |
| **Framework / Frontend** | HTML, CSS, dan JavaScript tanpa framework (folder `public/`). Huruf Plus Jakarta Sans dari Google Fonts |
| **Backend / Runtime** | Vercel Serverless Functions, Node.js (folder `api/` dan `lib/`) |
| **Database / Storage** | Tidak memakai database. Percakapan hanya disimpan sementara di memori browser dan hilang saat halaman dimuat ulang. Rekaman suara tidak disimpan |
| **Hosting / Deployment** | Vercel (paket Hobby): https://sapatamu-green.vercel.app |
| **AI Model / API / Method** | 1) Google Gemini API melalui `@google/genai`, dengan urutan model `gemini-3.5-flash-lite`, `gemini-flash-lite-latest`, `gemini-3.6-flash` (cadangan otomatis bila model gagal). 2) Prompting berbasis peran dan rubrik, dengan output JSON untuk penilaian. 3) Web Speech API bawaan browser untuk speech-to-text dan text-to-speech. 4) Claude API (`@anthropic-ai/sdk`) tersedia sebagai penyedia alternatif melalui `AI_PROVIDER`, tetapi tidak aktif di versi deploy |
| **Peran AI dalam Produk** | 1) Lawan bicara: memerankan tamu, pelanggan, rekan kerja, atau klien sesuai kasus, dan bereaksi terhadap jawaban siswa. 2) Penilai: menilai jawaban siswa dengan rubrik 4 kriteria (skala 1-4), membuat ringkasan, kelebihan, dan contoh kalimat perbaikan. Skor total dihitung di server, bukan oleh AI. 3) Suara: mengubah ucapan siswa menjadi teks dan membacakan balasan |
| **Dataset / Data Source** | Dokumen "Pemetaan Profesi Pariwisata yang Berkomunikasi Langsung dengan Tamu" (8 bidang, 60 profesi, 120 kasus), disimpan di `lib/scenarios.js`. Disusun dengan bantuan ChatGPT, lalu diperiksa dan disesuaikan oleh peserta sebagai guru. Riwayat penyusunan: https://chatgpt.com/share/6ae93332-8d98-83ec-8862-77286512e76d. Referensi umum: BNSP, JDIH Kemnaker, Portal Kurikulum Kemendikdasmen. Tidak memakai data pribadi siswa |
| **Open-source Libraries** | `@google/genai` (Google Gen AI SDK), `@anthropic-ai/sdk` (Anthropic SDK). Vercel CLI dipakai untuk pengembangan dan deploy |
| **Template / Boilerplate** | Tidak memakai template atau boilerplate. Struktur proyek dibuat dari awal |
| **AI Coding Assistant** | Claude (Anthropic) melalui claude.ai: membantu menulis dan memperbaiki kode, merancang tampilan, membuat logo SVG, mengubah dokumen pemetaan profesi menjadi data aplikasi, dan menyusun draf dokumentasi. Seluruh kode diuji, dipahami, dan dipertanggungjawabkan oleh peserta. ChatGPT (OpenAI): membantu menyusun dokumen pemetaan profesi dan membuat gambar |
| **Pre-existing Components** | Tidak ada. Seluruh kode, data, dan aset dibuat selama periode kompetisi (mulai 2 November 2026) |
| **Third-party Assets / Credits** | Gambar ilustrasi bidang (`public/img/*.jpg`), gambar pembuka (`public/img/hero.jpg`), dan ikon bidang (`public/img/bidang/*.jpg`) dibuat dengan ChatGPT (OpenAI). Logo `public/logo.svg` dibuat dengan bantuan Claude. Ikon cadangan memakai emoji bawaan sistem. Huruf Plus Jakarta Sans (SIL Open Font License) |

## Catatan Data dan Privasi

- Data yang dikirim ke Gemini hanya teks percakapan latihan dan data kasus. Aplikasi tidak meminta nama, akun, atau data pribadi.
- Suara diubah menjadi teks oleh browser. Di Chrome, proses ini dilakukan oleh layanan pengenalan suara Google. Aplikasi hanya menerima teks hasilnya dan tidak menyimpan rekaman.
- Pada tier gratis Gemini, data permintaan dapat digunakan Google untuk meningkatkan produknya. Karena itu antarmuka mengingatkan siswa untuk tidak menyebut data pribadi asli.
- API key disimpan sebagai environment variable di Vercel dan file `.env.local` lokal. API key tidak ada di repository, dan `.env.example` hanya berisi nama variabel.
- Laporan nilai menampilkan disclaimer bahwa nilai dibuat oleh AI sebagai umpan balik latihan, bukan nilai resmi.

## Pernyataan

Saya menyatakan bahwa informasi di atas benar dan lengkap. Saya bertanggung jawab atas penggunaan teknologi, source code, data, library, API, model AI, dan aset yang digunakan pada produk.

I Kadek Aditya Pirnanda
