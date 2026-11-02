// Data profesi dan kasus latihan.
// Sumber: "Pemetaan Profesi Pariwisata yang Berkomunikasi Langsung dengan Tamu"
// (disusun sebagai bahan pembelajaran; referensi umum: BNSP, JDIH Kemnaker, Portal Kurikulum Kemendikdasmen).
// Untuk menambah profesi atau kasus, cukup ubah data di bawah ini. Kode lain tidak perlu diubah.

export const TANTANGAN = "Identifikasi masalah, tentukan informasi yang perlu dikumpulkan, susun langkah penyelesaian sesuai SOP, komunikasikan solusi kepada pihak terkait, dan jelaskan alasan pemilihan solusi.";

export const KELOMPOK = [
  {
    "id": "perhotelan",
    "nama": "Perhotelan",
    "profesi": [
      {
        "id": "front-office-agent",
        "nama": "Front Office Agent",
        "program": "Perhotelan",
        "kompetensi": "Check-in, check-out, reservasi, komunikasi tamu, sistem hotel",
        "skenario": [
          {
            "id": "front-office-agent-1",
            "masalah": "Nama tamu tidak ditemukan dalam sistem meskipun tamu menunjukkan bukti pemesanan."
          },
          {
            "id": "front-office-agent-2",
            "masalah": "Tamu datang sebelum waktu check-in dan kamar belum siap. Bagaimana menjelaskan kondisi dan menawarkan solusi?"
          }
        ]
      },
      {
        "id": "receptionist",
        "nama": "Receptionist",
        "program": "Perhotelan",
        "kompetensi": "Menerima tamu, mengelola informasi, komunikasi",
        "skenario": [
          {
            "id": "receptionist-1",
            "masalah": "Tamu asing tidak memahami informasi fasilitas hotel. Bagaimana menjelaskannya dengan bahasa Inggris sederhana?"
          },
          {
            "id": "receptionist-2",
            "masalah": "Seorang tamu meminta informasi arah ke rumah sakit dan transportasi terdekat. Informasi apa yang perlu diberikan?"
          }
        ]
      },
      {
        "id": "reservation-agent",
        "nama": "Reservation Agent",
        "program": "Perhotelan",
        "kompetensi": "Pemesanan kamar, email, telepon, sistem reservasi",
        "skenario": [
          {
            "id": "reservation-agent-1",
            "masalah": "Terjadi pemesanan ganda untuk kamar yang sama pada tanggal yang sama."
          },
          {
            "id": "reservation-agent-2",
            "masalah": "Tamu meminta perubahan tanggal menginap, tetapi tipe kamar yang sama sudah penuh."
          }
        ]
      },
      {
        "id": "guest-relation-officer-gro",
        "nama": "Guest Relation Officer (GRO)",
        "program": "Perhotelan",
        "kompetensi": "Hubungan pelanggan, penanganan keluhan, pelayanan VIP",
        "skenario": [
          {
            "id": "guest-relation-officer-gro-1",
            "masalah": "Tamu mengeluhkan pelayanan hotel yang tidak sesuai harapan. Bagaimana memulihkan kepuasannya?"
          },
          {
            "id": "guest-relation-officer-gro-2",
            "masalah": "Tamu VIP menyampaikan permintaan khusus yang belum tercatat pada catatan reservasi."
          }
        ]
      },
      {
        "id": "concierge",
        "nama": "Concierge",
        "program": "Perhotelan",
        "kompetensi": "Informasi wisata, pemesanan transportasi, rekomendasi destinasi",
        "skenario": [
          {
            "id": "concierge-1",
            "masalah": "Tamu meminta rekomendasi tempat wisata di Ubud dengan waktu kunjungan terbatas."
          },
          {
            "id": "concierge-2",
            "masalah": "Tamu meminta kendaraan untuk perjalanan pagi, tetapi kendaraan langganan hotel tidak tersedia."
          }
        ]
      },
      {
        "id": "bellboy-bell-attendant",
        "nama": "Bellboy/Bell Attendant",
        "program": "Perhotelan",
        "kompetensi": "Penanganan barang bawaan, pengantaran tamu, pelayanan",
        "skenario": [
          {
            "id": "bellboy-bell-attendant-1",
            "masalah": "Barang bawaan dua tamu tertukar setelah proses pengantaran ke kamar."
          },
          {
            "id": "bellboy-bell-attendant-2",
            "masalah": "Tamu mengaku ada barang bawaan yang belum tiba di kamar setelah check-in."
          }
        ]
      },
      {
        "id": "telephone-operator",
        "nama": "Telephone Operator",
        "program": "Perhotelan",
        "kompetensi": "Komunikasi telepon, pengalihan panggilan, pencatatan pesan",
        "skenario": [
          {
            "id": "telephone-operator-1",
            "masalah": "Tamu menelepon meminta bantuan, tetapi petugas tidak memahami bahasa yang digunakan."
          },
          {
            "id": "telephone-operator-2",
            "masalah": "Panggilan penting untuk manajer masuk ketika saluran telepon sedang sibuk."
          }
        ]
      },
      {
        "id": "housekeeping-attendant-room-attendant",
        "nama": "Housekeeping Attendant/Room Attendant",
        "program": "Perhotelan",
        "kompetensi": "Membersihkan kamar, menata perlengkapan, standar kebersihan",
        "skenario": [
          {
            "id": "housekeeping-attendant-room-attendant-1",
            "masalah": "Tamu akan check-in dalam 15 menit, tetapi kamar belum selesai dibersihkan."
          },
          {
            "id": "housekeeping-attendant-room-attendant-2",
            "masalah": "Petugas menemukan barang milik tamu tertinggal setelah kamar check-out dibersihkan."
          }
        ]
      },
      {
        "id": "public-area-attendant",
        "nama": "Public Area Attendant",
        "program": "Perhotelan",
        "kompetensi": "Membersihkan lobi, koridor, toilet umum dan area publik",
        "skenario": [
          {
            "id": "public-area-attendant-1",
            "masalah": "Toilet umum hotel mendapat keluhan karena kebersihannya tidak terjaga."
          },
          {
            "id": "public-area-attendant-2",
            "masalah": "Lantai lobi basah saat banyak tamu berlalu-lalang. Bagaimana mengamankan area dan membersihkannya?"
          }
        ]
      },
      {
        "id": "laundry-attendant",
        "nama": "Laundry Attendant",
        "program": "Perhotelan",
        "kompetensi": "Pencucian, penyetrikaan, pemilahan linen dan pakaian",
        "skenario": [
          {
            "id": "laundry-attendant-1",
            "masalah": "Pakaian tamu tertukar dengan pakaian tamu lain."
          },
          {
            "id": "laundry-attendant-2",
            "masalah": "Tamu mengeluhkan pakaian yang dikembalikan masih memiliki noda."
          }
        ]
      },
      {
        "id": "hotel-sales-executive",
        "nama": "Hotel Sales Executive",
        "program": "Perhotelan",
        "kompetensi": "Penjualan kamar, promosi, negosiasi kerja sama",
        "skenario": [
          {
            "id": "hotel-sales-executive-1",
            "masalah": "Tingkat pemesanan kamar menurun ketika memasuki musim sepi wisatawan."
          },
          {
            "id": "hotel-sales-executive-2",
            "masalah": "Sebuah perusahaan meminta penawaran harga kamar untuk rombongan dengan anggaran terbatas."
          }
        ]
      },
      {
        "id": "hotel-marketing-staff",
        "nama": "Hotel Marketing Staff",
        "program": "Perhotelan",
        "kompetensi": "Pemasaran digital, promosi, media sosial",
        "skenario": [
          {
            "id": "hotel-marketing-staff-1",
            "masalah": "Promosi hotel di media sosial mendapat sedikit pertanyaan dan pemesanan."
          },
          {
            "id": "hotel-marketing-staff-2",
            "masalah": "Hotel akan meluncurkan paket menginap baru tetapi belum memiliki materi promosi."
          }
        ]
      }
    ]
  },
  {
    "id": "kuliner",
    "nama": "Kuliner",
    "profesi": [
      {
        "id": "cook-commis-chef",
        "nama": "Cook/Commis Chef",
        "program": "Kuliner",
        "kompetensi": "Persiapan bahan, memasak, sanitasi dapur",
        "skenario": [
          {
            "id": "cook-commis-chef-1",
            "masalah": "Pesanan makanan datang bersamaan dan beberapa hidangan belum selesai."
          },
          {
            "id": "cook-commis-chef-2",
            "masalah": "Bahan utama untuk menu yang dipesan tamu ternyata habis. Tentukan alternatif yang sesuai dan komunikasikan kepada waiter."
          }
        ]
      },
      {
        "id": "barista",
        "nama": "Barista",
        "program": "Kuliner",
        "kompetensi": "Membuat kopi, mengoperasikan mesin kopi, pelayanan",
        "skenario": [
          {
            "id": "barista-1",
            "masalah": "Pelanggan mengeluhkan rasa kopi yang berbeda dari kunjungan sebelumnya."
          },
          {
            "id": "barista-2",
            "masalah": "Antrean minuman panjang karena beberapa pesanan khusus masuk bersamaan."
          }
        ]
      },
      {
        "id": "bartender",
        "nama": "Bartender",
        "program": "Kuliner",
        "kompetensi": "Menyiapkan minuman, pelayanan bar, pengelolaan bahan",
        "skenario": [
          {
            "id": "bartender-1",
            "masalah": "Pesanan minuman tertukar karena banyak pelanggan memesan bersamaan."
          },
          {
            "id": "bartender-2",
            "masalah": "Bahan untuk minuman yang tercantum pada menu habis saat jam ramai."
          }
        ]
      },
      {
        "id": "waiter-waitress",
        "nama": "Waiter/Waitress",
        "program": "Kuliner",
        "kompetensi": "Menerima pesanan, menyajikan makanan, pelayanan",
        "skenario": [
          {
            "id": "waiter-waitress-1",
            "masalah": "Pesanan tamu salah dicatat sehingga hidangan tidak sesuai."
          },
          {
            "id": "waiter-waitress-2",
            "masalah": "Tamu menyampaikan alergi terhadap bahan tertentu setelah pesanan dicatat. Bagaimana memastikan informasi diteruskan ke dapur?"
          }
        ]
      },
      {
        "id": "food-and-beverage-attendant",
        "nama": "Food and Beverage Attendant",
        "program": "Kuliner",
        "kompetensi": "Pelayanan makanan dan minuman",
        "skenario": [
          {
            "id": "food-and-beverage-attendant-1",
            "masalah": "Tamu restoran mengeluhkan keterlambatan penyajian makanan."
          },
          {
            "id": "food-and-beverage-attendant-2",
            "masalah": "Meja belum tertata ketika rombongan tamu datang sesuai reservasi."
          }
        ]
      },
      {
        "id": "restaurant-cashier",
        "nama": "Restaurant Cashier",
        "program": "Kuliner",
        "kompetensi": "Transaksi pembayaran dan administrasi kasir",
        "skenario": [
          {
            "id": "restaurant-cashier-1",
            "masalah": "Total pembayaran pada sistem berbeda dengan jumlah tagihan pelanggan."
          },
          {
            "id": "restaurant-cashier-2",
            "masalah": "Pelanggan menyatakan sudah membayar secara digital, tetapi status transaksi belum muncul."
          }
        ]
      },
      {
        "id": "restaurant-supervisor",
        "nama": "Restaurant Supervisor",
        "program": "Kuliner",
        "kompetensi": "Mengawasi pelayanan restoran dan staf",
        "skenario": [
          {
            "id": "restaurant-supervisor-1",
            "masalah": "Jumlah staf tidak sebanding dengan jumlah tamu saat restoran ramai."
          },
          {
            "id": "restaurant-supervisor-2",
            "masalah": "Tamu meminta meja tambahan untuk rombongan, sementara kapasitas restoran hampir penuh."
          }
        ]
      },
      {
        "id": "catering-staff",
        "nama": "Catering Staff",
        "program": "Kuliner",
        "kompetensi": "Persiapan makanan untuk acara dan pelayanan katering",
        "skenario": [
          {
            "id": "catering-staff-1",
            "masalah": "Jumlah makanan yang disiapkan tidak sesuai jumlah peserta acara."
          },
          {
            "id": "catering-staff-2",
            "masalah": "Pengiriman makanan ke lokasi acara terlambat akibat perubahan akses jalan."
          }
        ]
      }
    ]
  },
  {
    "id": "usaha-layanan-pariwisata",
    "nama": "Usaha Layanan Pariwisata",
    "profesi": [
      {
        "id": "travel-consultant",
        "nama": "Travel Consultant",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Konsultasi perjalanan dan penjualan paket wisata",
        "skenario": [
          {
            "id": "travel-consultant-1",
            "masalah": "Wisatawan ingin berlibur di Bali selama tiga hari dengan anggaran terbatas."
          },
          {
            "id": "travel-consultant-2",
            "masalah": "Keluarga dengan anak kecil meminta paket wisata yang tidak terlalu padat dan memiliki fasilitas ramah keluarga."
          }
        ]
      },
      {
        "id": "travel-agent-staff",
        "nama": "Travel Agent Staff",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Reservasi tiket, hotel, dan paket perjalanan",
        "skenario": [
          {
            "id": "travel-agent-staff-1",
            "masalah": "Tiket perjalanan pelanggan mengalami perubahan jadwal."
          },
          {
            "id": "travel-agent-staff-2",
            "masalah": "Pelanggan membatalkan perjalanan dan menanyakan ketentuan perubahan atau pengembalian dana."
          }
        ]
      },
      {
        "id": "tour-planner",
        "nama": "Tour Planner",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Menyusun itinerary dan paket wisata",
        "skenario": [
          {
            "id": "tour-planner-1",
            "masalah": "Jadwal kunjungan terlalu padat sehingga beberapa destinasi tidak sempat dikunjungi."
          },
          {
            "id": "tour-planner-2",
            "masalah": "Wisatawan meminta itinerary alternatif saat hujan mengganggu rencana wisata alam."
          }
        ]
      },
      {
        "id": "tour-operator",
        "nama": "Tour Operator",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Mengelola dan menjalankan paket perjalanan",
        "skenario": [
          {
            "id": "tour-operator-1",
            "masalah": "Hotel yang telah dipesan tidak dapat menerima rombongan sesuai jadwal."
          },
          {
            "id": "tour-operator-2",
            "masalah": "Penyedia aktivitas wisata membatalkan layanan sehari sebelum perjalanan."
          }
        ]
      },
      {
        "id": "tour-guide-pramuwisata",
        "nama": "Tour Guide/Pramuwisata",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Memandu wisata, komunikasi, interpretasi budaya",
        "skenario": [
          {
            "id": "tour-guide-pramuwisata-1",
            "masalah": "Wisatawan bertanya tentang makna upacara adat Bali, tetapi pemandu belum memiliki informasi memadai."
          },
          {
            "id": "tour-guide-pramuwisata-2",
            "masalah": "Anggota rombongan tertinggal ketika kelompok berpindah lokasi. Bagaimana melakukan koordinasi sesuai prosedur?"
          }
        ]
      },
      {
        "id": "tour-leader-tour-manager",
        "nama": "Tour Leader/Tour Manager",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Mengkoordinasikan rombongan wisatawan",
        "skenario": [
          {
            "id": "tour-leader-tour-manager-1",
            "masalah": "Seorang peserta rombongan terlambat kembali ke titik kumpul."
          },
          {
            "id": "tour-leader-tour-manager-2",
            "masalah": "Jumlah peserta saat keberangkatan tidak sesuai daftar kehadiran."
          }
        ]
      },
      {
        "id": "reservation-officer",
        "nama": "Reservation Officer",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Pemesanan hotel, tiket dan aktivitas wisata",
        "skenario": [
          {
            "id": "reservation-officer-1",
            "masalah": "Data tanggal pemesanan pelanggan salah dimasukkan."
          },
          {
            "id": "reservation-officer-2",
            "masalah": "Dua pelanggan meminta slot aktivitas yang sama, tetapi kapasitas penyedia terbatas."
          }
        ]
      },
      {
        "id": "ticketing-officer",
        "nama": "Ticketing Officer",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Pengelolaan tiket dan administrasi perjalanan",
        "skenario": [
          {
            "id": "ticketing-officer-1",
            "masalah": "Nama penumpang pada tiket tidak sesuai dokumen identitas."
          },
          {
            "id": "ticketing-officer-2",
            "masalah": "Sistem penerbitan tiket mengalami gangguan ketika pelanggan menunggu."
          }
        ]
      },
      {
        "id": "mice-planner",
        "nama": "MICE Planner",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Perencanaan meeting, incentive, convention, exhibition",
        "skenario": [
          {
            "id": "mice-planner-1",
            "masalah": "Jumlah peserta seminar bertambah mendadak sehingga kapasitas ruangan perlu dievaluasi."
          },
          {
            "id": "mice-planner-2",
            "masalah": "Klien meminta perubahan susunan acara dan kebutuhan fasilitas menjelang hari pelaksanaan."
          }
        ]
      },
      {
        "id": "mice-event-coordinator",
        "nama": "MICE/Event Coordinator",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Koordinasi pelaksanaan acara",
        "skenario": [
          {
            "id": "mice-event-coordinator-1",
            "masalah": "Pembicara utama terlambat datang ketika acara akan dimulai."
          },
          {
            "id": "mice-event-coordinator-2",
            "masalah": "Peralatan presentasi tidak berfungsi saat sesi pertama akan berlangsung."
          }
        ]
      },
      {
        "id": "tourism-information-officer",
        "nama": "Tourism Information Officer",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Memberikan informasi destinasi dan fasilitas wisata",
        "skenario": [
          {
            "id": "tourism-information-officer-1",
            "masalah": "Wisatawan meminta informasi aksesibilitas, jam kunjungan, dan aturan masuk objek wisata."
          },
          {
            "id": "tourism-information-officer-2",
            "masalah": "Informasi jam operasional pada brosur berbeda dengan pengumuman terbaru pengelola."
          }
        ]
      },
      {
        "id": "ecotourism-guide",
        "nama": "Ecotourism Guide",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Interpretasi lingkungan dan edukasi konservasi",
        "skenario": [
          {
            "id": "ecotourism-guide-1",
            "masalah": "Wisatawan membuang sampah di kawasan ekowisata."
          },
          {
            "id": "ecotourism-guide-2",
            "masalah": "Pengunjung mendekati area konservasi yang dibatasi. Bagaimana memberikan arahan yang edukatif?"
          }
        ]
      },
      {
        "id": "geotourism-guide",
        "nama": "Geotourism Guide",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Interpretasi fenomena geologi dan warisan alam",
        "skenario": [
          {
            "id": "geotourism-guide-1",
            "masalah": "Wisatawan bertanya tentang proses terbentuknya bentang alam di Bali."
          },
          {
            "id": "geotourism-guide-2",
            "masalah": "Pemandu diminta menjelaskan fenomena geologi dengan bahasa sederhana kepada anak-anak."
          }
        ]
      },
      {
        "id": "tourism-product-development-assistant",
        "nama": "Tourism Product Development Assistant",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Mengembangkan produk dan paket wisata",
        "skenario": [
          {
            "id": "tourism-product-development-assistant-1",
            "masalah": "Paket wisata yang ditawarkan kurang diminati karena tidak sesuai kebutuhan pasar."
          },
          {
            "id": "tourism-product-development-assistant-2",
            "masalah": "Pelaku wisata lokal ingin memasukkan aktivitas budaya ke paket baru, tetapi jadwal dan kapasitas belum terpetakan."
          }
        ]
      }
    ]
  },
  {
    "id": "kecantikan-dan-spa",
    "nama": "Kecantikan dan Spa",
    "profesi": [
      {
        "id": "spa-therapist",
        "nama": "Spa Therapist",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Pelayanan perawatan spa sesuai kompetensi dan SOP",
        "skenario": [
          {
            "id": "spa-therapist-1",
            "masalah": "Tamu memiliki preferensi perawatan tertentu yang perlu dikonsultasikan sebelum pelayanan."
          },
          {
            "id": "spa-therapist-2",
            "masalah": "Tamu menyampaikan rasa tidak nyaman selama layanan. Bagaimana menghentikan atau menyesuaikan layanan sesuai SOP?"
          }
        ]
      },
      {
        "id": "beauty-therapist",
        "nama": "Beauty Therapist",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Perawatan kecantikan dan pelayanan pelanggan",
        "skenario": [
          {
            "id": "beauty-therapist-1",
            "masalah": "Pelanggan mengeluhkan hasil perawatan yang tidak sesuai harapan."
          },
          {
            "id": "beauty-therapist-2",
            "masalah": "Pelanggan meminta layanan yang tidak termasuk kompetensi atau fasilitas tempat kerja."
          }
        ]
      },
      {
        "id": "facial-therapist",
        "nama": "Facial Therapist",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Perawatan wajah sesuai kompetensi",
        "skenario": [
          {
            "id": "facial-therapist-1",
            "masalah": "Pelanggan memiliki sensitivitas kulit sehingga perlu konsultasi dan penyesuaian layanan."
          },
          {
            "id": "facial-therapist-2",
            "masalah": "Pelanggan mengalami rasa tidak nyaman saat konsultasi atau proses perawatan. Bagaimana menindaklanjuti sesuai SOP?"
          }
        ]
      },
      {
        "id": "body-treatment-therapist",
        "nama": "Body Treatment Therapist",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Perawatan tubuh sesuai prosedur",
        "skenario": [
          {
            "id": "body-treatment-therapist-1",
            "masalah": "Pelanggan merasa kurang nyaman terhadap jenis layanan yang dipilih."
          },
          {
            "id": "body-treatment-therapist-2",
            "masalah": "Pelanggan meminta perubahan tekanan atau tahapan layanan di tengah perawatan."
          }
        ]
      },
      {
        "id": "salon-hair-stylist",
        "nama": "Salon Hair Stylist",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Penataan dan perawatan rambut",
        "skenario": [
          {
            "id": "salon-hair-stylist-1",
            "masalah": "Hasil penataan rambut pelanggan tidak sesuai model yang diminta."
          },
          {
            "id": "salon-hair-stylist-2",
            "masalah": "Pelanggan mengubah model rambut setelah proses pengerjaan dimulai."
          }
        ]
      },
      {
        "id": "hair-treatment-assistant",
        "nama": "Hair Treatment Assistant",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Pelayanan perawatan rambut",
        "skenario": [
          {
            "id": "hair-treatment-assistant-1",
            "masalah": "Pelanggan meminta layanan yang tidak sesuai kondisi rambutnya."
          },
          {
            "id": "hair-treatment-assistant-2",
            "masalah": "Produk perawatan yang biasa digunakan pelanggan sedang tidak tersedia."
          }
        ]
      },
      {
        "id": "nail-technician",
        "nama": "Nail Technician",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Perawatan dan dekorasi kuku",
        "skenario": [
          {
            "id": "nail-technician-1",
            "masalah": "Hasil dekorasi kuku tidak sesuai contoh yang diberikan pelanggan."
          },
          {
            "id": "nail-technician-2",
            "masalah": "Pelanggan meminta desain tambahan yang membutuhkan waktu lebih lama dari jadwal."
          }
        ]
      },
      {
        "id": "spa-receptionist",
        "nama": "Spa Receptionist",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Reservasi, informasi layanan, administrasi spa",
        "skenario": [
          {
            "id": "spa-receptionist-1",
            "masalah": "Dua pelanggan mendapatkan jadwal perawatan pada waktu dan ruang yang sama."
          },
          {
            "id": "spa-receptionist-2",
            "masalah": "Tamu datang terlambat dan meminta seluruh layanan tetap dilakukan sesuai durasi awal."
          }
        ]
      },
      {
        "id": "spa-product-sales-consultant",
        "nama": "Spa Product Sales Consultant",
        "program": "Kecantikan dan Spa",
        "kompetensi": "Pengetahuan produk dan penjualan produk spa",
        "skenario": [
          {
            "id": "spa-product-sales-consultant-1",
            "masalah": "Pelanggan bingung memilih produk perawatan yang sesuai kebutuhannya."
          },
          {
            "id": "spa-product-sales-consultant-2",
            "masalah": "Pelanggan mempertanyakan informasi penggunaan dan kandungan produk yang tercantum pada kemasan."
          }
        ]
      }
    ]
  },
  {
    "id": "transportasi-wisata",
    "nama": "Transportasi wisata",
    "profesi": [
      {
        "id": "airport-representative",
        "nama": "Airport Representative",
        "program": "Usaha Layanan Pariwisata / Perhotelan",
        "kompetensi": "Penjemputan dan pelayanan wisatawan di bandara",
        "skenario": [
          {
            "id": "airport-representative-1",
            "masalah": "Wisatawan tidak menemukan petugas penjemputan di bandara."
          },
          {
            "id": "airport-representative-2",
            "masalah": "Pesawat tamu mengalami keterlambatan sehingga jadwal penjemputan perlu diperbarui."
          }
        ]
      },
      {
        "id": "guest-transport-coordinator",
        "nama": "Guest Transport Coordinator",
        "program": "Usaha Layanan Pariwisata / Perhotelan",
        "kompetensi": "Mengatur transportasi tamu hotel",
        "skenario": [
          {
            "id": "guest-transport-coordinator-1",
            "masalah": "Kendaraan yang dipesan tamu belum tiba sesuai jadwal."
          },
          {
            "id": "guest-transport-coordinator-2",
            "masalah": "Dua tamu memesan kendaraan pada waktu yang sama, sementara armada terbatas."
          }
        ]
      },
      {
        "id": "tour-driver",
        "nama": "Tour Driver",
        "program": "Usaha Layanan Pariwisata / Perhotelan",
        "kompetensi": "Pelayanan transportasi wisata dan komunikasi",
        "skenario": [
          {
            "id": "tour-driver-1",
            "masalah": "Wisatawan meminta perubahan tujuan perjalanan secara mendadak."
          },
          {
            "id": "tour-driver-2",
            "masalah": "Rute menuju destinasi mengalami kemacetan dan tamu memiliki jadwal lanjutan."
          }
        ]
      },
      {
        "id": "transport-reservation-staff",
        "nama": "Transport Reservation Staff",
        "program": "Usaha Layanan Pariwisata / Perhotelan",
        "kompetensi": "Reservasi kendaraan dan administrasi",
        "skenario": [
          {
            "id": "transport-reservation-staff-1",
            "masalah": "Terjadi dua pemesanan kendaraan pada waktu yang sama."
          },
          {
            "id": "transport-reservation-staff-2",
            "masalah": "Data titik penjemputan pada voucher berbeda dengan informasi yang diberikan pelanggan."
          }
        ]
      },
      {
        "id": "cruise-guest-service-staff",
        "nama": "Cruise Guest Service Staff",
        "program": "Usaha Layanan Pariwisata / Perhotelan",
        "kompetensi": "Pelayanan penumpang kapal pesiar",
        "skenario": [
          {
            "id": "cruise-guest-service-staff-1",
            "masalah": "Penumpang membutuhkan informasi mengenai jadwal dan layanan perjalanan."
          },
          {
            "id": "cruise-guest-service-staff-2",
            "masalah": "Penumpang terlambat kembali ke titik kumpul sebelum keberangkatan kapal."
          }
        ]
      },
      {
        "id": "marina-harbor-guest-service-staff",
        "nama": "Marina/Harbor Guest Service Staff",
        "program": "Usaha Layanan Pariwisata / Perhotelan",
        "kompetensi": "Pelayanan pengunjung pelabuhan wisata",
        "skenario": [
          {
            "id": "marina-harbor-guest-service-staff-1",
            "masalah": "Wisatawan kebingungan mencari lokasi keberangkatan."
          },
          {
            "id": "marina-harbor-guest-service-staff-2",
            "masalah": "Jadwal keberangkatan kapal berubah karena kondisi operasional."
          }
        ]
      }
    ]
  },
  {
    "id": "objek-wisata-dan-rekreasi",
    "nama": "Objek wisata dan rekreasi",
    "profesi": [
      {
        "id": "visitor-service-officer",
        "nama": "Visitor Service Officer",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Pelayanan dan informasi pengunjung",
        "skenario": [
          {
            "id": "visitor-service-officer-1",
            "masalah": "Wisatawan mengeluhkan kurangnya informasi fasilitas objek wisata."
          },
          {
            "id": "visitor-service-officer-2",
            "masalah": "Pengunjung meminta bantuan menemukan fasilitas untuk lansia atau penyandang disabilitas."
          }
        ]
      },
      {
        "id": "attraction-operations-staff",
        "nama": "Attraction Operations Staff",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Operasional atraksi wisata",
        "skenario": [
          {
            "id": "attraction-operations-staff-1",
            "masalah": "Jadwal pertunjukan budaya mengalami perubahan."
          },
          {
            "id": "attraction-operations-staff-2",
            "masalah": "Atraksi harus ditunda karena persiapan teknis belum selesai."
          }
        ]
      },
      {
        "id": "cultural-tourism-assistant",
        "nama": "Cultural Tourism Assistant",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Informasi budaya dan pelayanan wisatawan",
        "skenario": [
          {
            "id": "cultural-tourism-assistant-1",
            "masalah": "Wisatawan tidak memahami aturan berpakaian ketika memasuki tempat suci."
          },
          {
            "id": "cultural-tourism-assistant-2",
            "masalah": "Wisatawan mengambil foto di area yang memiliki aturan khusus. Bagaimana menjelaskan etika kunjungan?"
          }
        ]
      },
      {
        "id": "museum-guide",
        "nama": "Museum Guide",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Interpretasi koleksi dan sejarah",
        "skenario": [
          {
            "id": "museum-guide-1",
            "masalah": "Pengunjung meminta penjelasan tentang koleksi sejarah yang tidak tercantum pada papan informasi."
          },
          {
            "id": "museum-guide-2",
            "masalah": "Rombongan pelajar memiliki tingkat pengetahuan berbeda sehingga penjelasan perlu disesuaikan."
          }
        ]
      },
      {
        "id": "recreation-facility-attendant",
        "nama": "Recreation Facility Attendant",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Pelayanan fasilitas rekreasi",
        "skenario": [
          {
            "id": "recreation-facility-attendant-1",
            "masalah": "Pengunjung melaporkan fasilitas rekreasi yang tidak berfungsi."
          },
          {
            "id": "recreation-facility-attendant-2",
            "masalah": "Antrean fasilitas meningkat dan pengunjung mempertanyakan waktu tunggu."
          }
        ]
      },
      {
        "id": "event-attraction-staff",
        "nama": "Event Attraction Staff",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Pelayanan pengunjung pada acara wisata",
        "skenario": [
          {
            "id": "event-attraction-staff-1",
            "masalah": "Jumlah pengunjung melebihi perkiraan penyelenggara."
          },
          {
            "id": "event-attraction-staff-2",
            "masalah": "Pengunjung kesulitan menemukan pintu masuk atau area kegiatan yang tepat."
          }
        ]
      },
      {
        "id": "eco-tourism-operations-assistant",
        "nama": "Eco-Tourism Operations Assistant",
        "program": "Usaha Layanan Pariwisata",
        "kompetensi": "Pelayanan dan edukasi wisata berkelanjutan",
        "skenario": [
          {
            "id": "eco-tourism-operations-assistant-1",
            "masalah": "Pengunjung tidak mengikuti aturan kebersihan kawasan wisata."
          },
          {
            "id": "eco-tourism-operations-assistant-2",
            "masalah": "Tempat sampah penuh saat jumlah pengunjung meningkat."
          }
        ]
      }
    ]
  },
  {
    "id": "pemasaran-digital-pariwisata",
    "nama": "Pemasaran digital pariwisata",
    "profesi": [
      {
        "id": "social-media-admin",
        "nama": "Social Media Admin",
        "program": "Usaha Layanan Pariwisata / DKV / Multimedia",
        "kompetensi": "Mengelola akun media sosial bisnis wisata",
        "skenario": [
          {
            "id": "social-media-admin-1",
            "masalah": "Banyak pertanyaan wisatawan di Instagram tetapi tidak segera mendapatkan balasan."
          },
          {
            "id": "social-media-admin-2",
            "masalah": "Akun bisnis menerima komentar negatif terkait layanan. Bagaimana merespons secara profesional?"
          }
        ]
      },
      {
        "id": "tourism-content-creator",
        "nama": "Tourism Content Creator",
        "program": "Usaha Layanan Pariwisata / DKV / Multimedia",
        "kompetensi": "Membuat konten foto, video, dan informasi wisata",
        "skenario": [
          {
            "id": "tourism-content-creator-1",
            "masalah": "Konten promosi hotel memiliki banyak penonton tetapi sedikit menghasilkan pemesanan."
          },
          {
            "id": "tourism-content-creator-2",
            "masalah": "Pengelola meminta konten tentang budaya lokal, tetapi materi belum diverifikasi kebenarannya."
          }
        ]
      },
      {
        "id": "online-customer-service",
        "nama": "Online Customer Service",
        "program": "Usaha Layanan Pariwisata / DKV / Multimedia",
        "kompetensi": "Menangani pertanyaan pelanggan melalui kanal digital",
        "skenario": [
          {
            "id": "online-customer-service-1",
            "masalah": "Pelanggan mengirimkan keluhan melalui WhatsApp tetapi belum memperoleh solusi."
          },
          {
            "id": "online-customer-service-2",
            "masalah": "Pelanggan meminta data pribadi pemesan lain untuk membuktikan kesalahan reservasi. Bagaimana menjaga privasi?"
          }
        ]
      }
    ]
  },
  {
    "id": "pendukung-pariwisata",
    "nama": "Pendukung pariwisata",
    "profesi": [
      {
        "id": "wedding-event-assistant",
        "nama": "Wedding Event Assistant",
        "program": "DKV / Busana / kompetensi pendukung terkait",
        "kompetensi": "Koordinasi acara dan pelayanan tamu",
        "skenario": [
          {
            "id": "wedding-event-assistant-1",
            "masalah": "Susunan acara pernikahan mengalami perubahan mendadak."
          },
          {
            "id": "wedding-event-assistant-2",
            "masalah": "Vendor utama terlambat datang sehingga urutan persiapan perlu disesuaikan."
          }
        ]
      }
    ]
  }
];

// Indeks agar kasus bisa dicari dengan cepat berdasarkan id-nya
const INDEKS = new Map();
for (const kelompok of KELOMPOK) {
  for (const profesi of kelompok.profesi) {
    for (const skenario of profesi.skenario) {
      INDEKS.set(skenario.id, { kelompok, profesi, skenario });
    }
  }
}

export function cariSkenario(id) {
  return INDEKS.get(id) || null;
}
