/**
 * VERITASK AI - Data Spasial & Kontroler Peta Interaktif Sebaran Hoaks Indonesia
 * Menyajikan Peta Titik Spasial (Google Maps Mode dengan Leaflet.js) tingkat Kecamatan, Kabupaten, Provinsi,
 * serta Peta Choropleth Nasional dengan kategori isu: Semua, Politik/Pilkada, Bencana Alam, Penipuan Finansial, dan Kesehatan.
 */

const IndonesiaDisinfoMap = {
  // Dataset Titik Spasial Nyata Tingkat Kecamatan, Kabupaten/Kota, dan Provinsi di Seluruh Indonesia
  spatialPoints: [
    // --- JAWA BARAT ---
    {
      id: "pt-jbr-01",
      provinsi: "Jawa Barat",
      kabupaten: "Kota Bandung",
      kecamatan: "Kec. Coblong",
      lat: -6.8878,
      lng: 107.6152,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Sangat Tinggi",
      colorClass: "red",
      score: 93,
      laporanCount: 1840,
      topRumor: "Penyebaran file APK tagihan pajak kendaraan dan denda tilang ETLE palsu lewat WhatsApp",
      mitigasi: "Bapenda Jabar & Korlantas Polri menegaskan pemberitahuan tilang hanya melalui surat fisik dan portal etle-korlantas.info.",
      tanggalAudit: "08 Okt 2026"
    },
    {
      id: "pt-jbr-02",
      provinsi: "Jawa Barat",
      kabupaten: "Kab. Bogor",
      kecamatan: "Kec. Cibinong",
      lat: -6.4797,
      lng: 106.8536,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 87,
      laporanCount: 1520,
      topRumor: "Tautan pendaftaran subsidi sembako gratis 500 ribu mengatasnamakan Pemkab Bogor",
      mitigasi: "Dinsos Kab. Bogor mengonfirmasi seluruh bantuan disalurkan resmi lewat e-Warong dan pos tanpa link website .xyz.",
      tanggalAudit: "07 Okt 2026"
    },
    {
      id: "pt-jbr-03",
      provinsi: "Jawa Barat",
      kabupaten: "Kab. Sukabumi",
      kecamatan: "Kec. Palabuhanratu",
      lat: -6.9875,
      lng: 106.5414,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Waspada Sangat Tinggi",
      colorClass: "red",
      score: 91,
      laporanCount: 1930,
      topRumor: "Pesan berantai prediksi gempa megathrust beruntun dengan tanggal dan jam pasti di pesisir selatan",
      mitigasi: "BMKG menegaskan tidak ada satu pun teknologi di dunia yang dapat memprediksi hari dan jam terjadinya gempa tektonik.",
      tanggalAudit: "07 Okt 2026"
    },
    {
      id: "pt-jbr-04",
      provinsi: "Jawa Barat",
      kabupaten: "Kab. Garut",
      kecamatan: "Kec. Tarogong Kidul",
      lat: -7.2185,
      lng: 107.8967,
      kategori: "politik",
      kategoriLabel: "Pilkada & Politik",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 68,
      laporanCount: 790,
      topRumor: "Rekayasa formulir daring survei elektabilitas pilkada dengan iming-iming pulsa ratusan ribu",
      mitigasi: "Bawaslu menghimbau warga tidak memberikan NIK pada tautan survei yang tidak terdaftar di KPU.",
      tanggalAudit: "06 Okt 2026"
    },

    // --- DKI JAKARTA ---
    {
      id: "pt-dki-01",
      provinsi: "DKI Jakarta",
      kabupaten: "Kota Jakarta Pusat",
      kecamatan: "Kec. Gambir",
      lat: -6.1754,
      lng: 106.8272,
      kategori: "politik",
      kategoriLabel: "Pilkada & Politik",
      status: "Waspada Sangat Tinggi",
      colorClass: "red",
      score: 95,
      laporanCount: 2480,
      topRumor: "Surat edaran palsu bertanda tangan gubernur terkait pembagian dana hibah ormas dan pemutihan pajak",
      mitigasi: "Diskominfotik DKI Jakarta memastikan seluruh surat resmi diunggah pada portal resmi jakarta.go.id dengan tanda tangan elektronik BSrE.",
      tanggalAudit: "08 Okt 2026"
    },
    {
      id: "pt-dki-02",
      provinsi: "DKI Jakarta",
      kabupaten: "Kota Jakarta Selatan",
      kecamatan: "Kec. Kebayoran Baru",
      lat: -6.2443,
      lng: 106.8005,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 86,
      laporanCount: 1390,
      topRumor: "Modus penipuan investasi kripto dan robot trading mencatut gedung bursa efek di Senayan",
      mitigasi: "Satgas PASTI OJK mengumumkan entitas tersebut ilegal dan tidak memiliki izin Bappebti.",
      tanggalAudit: "05 Okt 2026"
    },
    {
      id: "pt-dki-03",
      provinsi: "DKI Jakarta",
      kabupaten: "Kota Jakarta Utara",
      kecamatan: "Kec. Tanjung Priok",
      lat: -6.1321,
      lng: 106.8827,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 71,
      laporanCount: 880,
      topRumor: "Video manipulatif tanggul laut jebol dan isu evakuasi darurat banjir rob malam hari",
      mitigasi: "BPBD DKI Jakarta mengonfirmasi video tersebut merupakan rekaman kejadian tahun 2020 yang didaur ulang.",
      tanggalAudit: "04 Okt 2026"
    },
    {
      id: "pt-dki-04",
      provinsi: "DKI Jakarta",
      kabupaten: "Kota Jakarta Timur",
      kecamatan: "Kec. Jatinegara",
      lat: -6.2297,
      lng: 106.8667,
      kategori: "kesehatan",
      kategoriLabel: "Kesehatan",
      status: "Terkendali",
      colorClass: "blue",
      score: 48,
      laporanCount: 520,
      topRumor: "Beredar pesan suara klaim obat tetes mata herbal mampu sembuhkan katarak total dalam 3 hari",
      mitigasi: "BPOM menegaskan produk tersebut belum teruji klinis dan berisiko infeksi kornea berat.",
      tanggalAudit: "03 Okt 2026"
    },

    // --- JAWA TIMUR ---
    {
      id: "pt-jtm-01",
      provinsi: "Jawa Timur",
      kabupaten: "Kota Surabaya",
      kecamatan: "Kec. Gubeng",
      lat: -7.2756,
      lng: 112.7538,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Sangat Tinggi",
      colorClass: "red",
      score: 92,
      laporanCount: 1740,
      topRumor: "Link phishing verifikasi bansos subsidi minyak goreng dan BBM berhadiah motor",
      mitigasi: "Pemkot Surabaya menegaskan pengajuan bantuan hanya melalui aplikasi Wargaku resmi.",
      tanggalAudit: "08 Okt 2026"
    },
    {
      id: "pt-jtm-02",
      provinsi: "Jawa Timur",
      kabupaten: "Kota Malang",
      kecamatan: "Kec. Klojen",
      lat: -7.9785,
      lng: 112.6318,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 84,
      laporanCount: 1210,
      topRumor: "Penipuan berkedok file undangan pernikahan digital format .APK kuras m-Banking",
      mitigasi: "Polresta Malang Kota dan OJK mengimbau warga tidak mengklik file instalasi APK dari nomor tak dikenal.",
      tanggalAudit: "06 Okt 2026"
    },
    {
      id: "pt-jtm-03",
      provinsi: "Jawa Timur",
      kabupaten: "Kab. Banyuwangi",
      kecamatan: "Kec. Banyuwangi",
      lat: -8.2192,
      lng: 114.3691,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 69,
      laporanCount: 840,
      topRumor: "Hoaks penutupan pelabuhan Ketapang-Gilimanuk akibat erupsi gunung berapi bawah laut fiktif",
      mitigasi: "ASDP Indonesia Ferry memastikan operasional penyeberangan Selat Bali normal dan aman.",
      tanggalAudit: "05 Okt 2026"
    },

    // --- JAWA TENGAH & DIY ---
    {
      id: "pt-jtg-01",
      provinsi: "Jawa Tengah",
      kabupaten: "Kota Semarang",
      kecamatan: "Kec. Semarang Tengah",
      lat: -6.9826,
      lng: 110.4203,
      kategori: "politik",
      kategoriLabel: "Pilkada & Politik",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 82,
      laporanCount: 1330,
      topRumor: "Pemberitahuan rekrutmen pegawai honorer pemprov jalur khusus dengan pungutan biaya administrasi",
      mitigasi: "BKD Jateng menegaskan seleksi ASN/PPPK 100% menggunakan sistem CAT BKN tanpa biaya.",
      tanggalAudit: "07 Okt 2026"
    },
    {
      id: "pt-diy-01",
      provinsi: "DI Yogyakarta",
      kabupaten: "Kab. Sleman",
      kecamatan: "Kec. Depok",
      lat: -7.7667,
      lng: 110.3958,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 85,
      laporanCount: 1470,
      topRumor: "Video lama letusan Gunung Merapi dipotong dan disebarkan seolah terjadi letusan dahsyat siang tadi",
      mitigasi: "BPPTKG Yogyakarta mengonfirmasi aktivitas Merapi sesuai laporan berkala di portal magma.esdm.go.id.",
      tanggalAudit: "06 Okt 2026"
    },
    {
      id: "pt-jtg-02",
      provinsi: "Jawa Tengah",
      kabupaten: "Kota Surakarta",
      kecamatan: "Kec. Banjarsari",
      lat: -7.5561,
      lng: 110.8214,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Terkendali",
      colorClass: "blue",
      score: 46,
      laporanCount: 490,
      topRumor: "Voucher belanja gratis HUT BUMN via situs web blogspot berantai",
      mitigasi: "Kementerian BUMN menyatakan program tersebut palsu dan bertujuan mencuri data pribadi (phishing).",
      tanggalAudit: "03 Okt 2026"
    },

    // --- BANTEN ---
    {
      id: "pt-btn-01",
      provinsi: "Banten",
      kabupaten: "Kota Tangerang Selatan",
      kecamatan: "Kec. Ciputat",
      lat: -6.3117,
      lng: 106.7467,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 81,
      laporanCount: 1150,
      topRumor: "Program pinjaman modal UMKM tanpa bunga dari koperasi fiktif mencatut foto walikota",
      mitigasi: "Disperindag Tangsel mengimbau warga melapor jika ada penawaran pinjaman via nomor WhatsApp perorangan.",
      tanggalAudit: "06 Okt 2026"
    },

    // --- SUMATERA UTARA & ACEH ---
    {
      id: "pt-smu-01",
      provinsi: "Sumatera Utara",
      kabupaten: "Kota Medan",
      kecamatan: "Kec. Medan Baru",
      lat: 3.5852,
      lng: 98.6657,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 88,
      laporanCount: 1610,
      topRumor: "Pesan berantai lowongan kerja BUMN di Pelabuhan Belawan meminta uang transfer seragam kerja",
      mitigasi: "PT Pelindo mengonfirmasi rekrutmen resmi hanya melalui rekrutmenbersama.fhcibumn.id bebas biaya.",
      tanggalAudit: "07 Okt 2026"
    },
    {
      id: "pt-ach-01",
      provinsi: "Aceh",
      kabupaten: "Kota Banda Aceh",
      kecamatan: "Kec. Kuta Alam",
      lat: 5.5612,
      lng: 95.3341,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 65,
      laporanCount: 710,
      topRumor: "Klaim ramalan gempa tsunami susulan oleh tokoh spiritual di grup pesan suara",
      mitigasi: "Stasiun Geofisika BMKG Mata Ie menegaskan sains belum bisa memprediksi waktu gempa secara tanggal.",
      tanggalAudit: "04 Okt 2026"
    },

    // --- SUMATERA BARAT & SUMSEL ---
    {
      id: "pt-smb-01",
      provinsi: "Sumatera Barat",
      kabupaten: "Kota Padang",
      kecamatan: "Kec. Padang Barat",
      lat: -0.9471,
      lng: 100.3543,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 83,
      laporanCount: 1280,
      topRumor: "Beredar foto rekayasa erupsi Gunung Marapi menutupi seluruh atap rumah di Kota Padang",
      mitigasi: "PGA Marapi dan BPBD Sumbar memastikan sebaran abu vulkanik tidak mencapai Kota Padang.",
      tanggalAudit: "06 Okt 2026"
    },
    {
      id: "pt-sms-01",
      provinsi: "Sumatera Selatan",
      kabupaten: "Kota Palembang",
      kecamatan: "Kec. Ilir Barat I",
      lat: -2.9909,
      lng: 104.7292,
      kategori: "kesehatan",
      kategoriLabel: "Kesehatan",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 64,
      laporanCount: 680,
      topRumor: "Narasi hoaks air rebusan daun tertentu dapat mematikan sel kanker seketika tanpa kemoterapi",
      mitigasi: "Dinkes Sumsel menegaskan pengobatan medis harus berdasarkan rekomendasi dokter spesialis onkologi.",
      tanggalAudit: "03 Okt 2026"
    },

    // --- KALIMANTAN (IKN & SEKITARNYA) ---
    {
      id: "pt-klt-01",
      provinsi: "Kalimantan Timur",
      kabupaten: "Kab. Penajam Paser Utara",
      kecamatan: "Kec. Sepaku (Kawasan IKN)",
      lat: -0.9167,
      lng: 116.7500,
      kategori: "politik",
      kategoriLabel: "Pilkada & Politik",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 86,
      laporanCount: 1430,
      topRumor: "Penipuan berkedok pendaftaran ganti rugi pembebasan lahan IKN lewat calo daring",
      mitigasi: "Otorita Ibu Kota Nusantara (OIKN) menegaskan proses pembebasan lahan dilakukan secara resmi dan terbuka oleh ATR/BPN.",
      tanggalAudit: "08 Okt 2026"
    },
    {
      id: "pt-klb-01",
      provinsi: "Kalimantan Barat",
      kabupaten: "Kota Pontianak",
      kecamatan: "Kec. Pontianak Kota",
      lat: -0.0263,
      lng: 109.3425,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Terkendali",
      colorClass: "blue",
      score: 44,
      laporanCount: 450,
      topRumor: "Isu karhutla buatan yang menutup jarak pandang bandara Supadio total",
      mitigasi: "BMKG Supadio memastikan Indeks Standar Pencemar Udara (ISPU) dalam kategori Sedang hingga Baik.",
      tanggalAudit: "02 Okt 2026"
    },

    // --- SULAWESI ---
    {
      id: "pt-sls-01",
      provinsi: "Sulawesi Selatan",
      kabupaten: "Kota Makassar",
      kecamatan: "Kec. Ujung Pandang",
      lat: -5.1354,
      lng: 119.4124,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 82,
      laporanCount: 1360,
      topRumor: "Bantuan kapal nelayan dan modal melaut gratis mencatut Kementerian Kelautan dan Perikanan",
      mitigasi: "Dinas Perikanan Sulsel memastikan bantuan kapal disalurkan lewat kelompok usaha bersama (KUB) terdaftar resmi.",
      tanggalAudit: "06 Okt 2026"
    },
    {
      id: "pt-slu-01",
      provinsi: "Sulawesi Utara",
      kabupaten: "Kota Manado",
      kecamatan: "Kec. Wanea",
      lat: 1.4644,
      lng: 124.8465,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 67,
      laporanCount: 780,
      topRumor: "Klaim gelombang tsunami akibat letusan Gunung Ruang merambat hingga ke teluk Manado",
      mitigasi: "PVMBG dan BMKG memastikan peringatan waspada tsunami dicabut setelah aktivitas vulkanik mereda.",
      tanggalAudit: "04 Okt 2026"
    },

    // --- BALI & NUSA TENGGARA ---
    {
      id: "pt-bli-01",
      provinsi: "Bali",
      kabupaten: "Kab. Badung",
      kecamatan: "Kec. Kuta",
      lat: -8.7231,
      lng: 115.1768,
      kategori: "penipuan",
      kategoriLabel: "Penipuan Finansial",
      status: "Waspada Tinggi",
      colorClass: "red",
      score: 79,
      laporanCount: 1120,
      topRumor: "Situs web agen visa turis palsu mencatut logo Ditjen Imigrasi RI dengan tarif berlipat ganda",
      mitigasi: "Ditjen Imigrasi menegaskan pengurusan visa resmi hanya melalui evisa.imigrasi.go.id.",
      tanggalAudit: "05 Okt 2026"
    },
    {
      id: "pt-ntb-01",
      provinsi: "Nusa Tenggara Barat",
      kabupaten: "Kota Mataram",
      kecamatan: "Kec. Mataram",
      lat: -8.5833,
      lng: 116.1167,
      kategori: "kesehatan",
      kategoriLabel: "Kesehatan",
      status: "Terkendali",
      colorClass: "blue",
      score: 49,
      laporanCount: 510,
      topRumor: "Kabar hoaks KLB penyakit misterius dari wisatawan asing di kawasan Senggigi",
      mitigasi: "Dinkes NTB memastikan surveilans penyakit berjalan normal dan kabar tersebut tidak benar.",
      tanggalAudit: "03 Okt 2026"
    },

    // --- PAPUA & MALUKU ---
    {
      id: "pt-pap-01",
      provinsi: "Papua",
      kabupaten: "Kota Jayapura",
      kecamatan: "Kec. Jayapura Utara",
      lat: -2.5337,
      lng: 140.7181,
      kategori: "politik",
      kategoriLabel: "Pilkada & Politik",
      status: "Waspada Sangat Tinggi",
      colorClass: "red",
      score: 89,
      laporanCount: 1540,
      topRumor: "Video provokatif rekayasa bentrokan antarpendukung pilkada yang disunting dari peristiwa luar daerah",
      mitigasi: "Polda Papua dan Kominfo mengimbau warga menjaga persaudaraan dan tidak menyebarkan video unverified.",
      tanggalAudit: "07 Okt 2026"
    },
    {
      id: "pt-mlk-01",
      provinsi: "Maluku",
      kabupaten: "Kota Ambon",
      kecamatan: "Kec. Sirimau",
      lat: -3.6954,
      lng: 128.1814,
      kategori: "bencana",
      kategoriLabel: "Bencana Alam",
      status: "Rawan Sedang",
      colorClass: "amber",
      score: 66,
      laporanCount: 690,
      topRumor: "Isu kenaikan muka air laut mendadak dan retakan patahan bumi di perbukitan",
      mitigasi: "BPBD Kota Ambon memastikan stabilitas tanah aman berdasarkan pantauan tim geologi.",
      tanggalAudit: "04 Okt 2026"
    }
  ],

  // Database Kerawanan Disinformasi Nusantara 38 Provinsi / Wilayah (Choropleth Polygon Geografis Indonesia)
  provinces: [
    {
      id: "aceh",
      name: "Aceh",
      island: "Sumatera",
      path: "M 65 72 C 72 65, 82 66, 92 78 C 100 88, 96 98, 86 96 C 76 94, 66 84, 65 72 Z",
      center: [80, 80],
      scores: { all: 67, politik: 76, bencana: 68, penipuan: 64, kesehatan: 58 },
      reports: 1820,
      topRumor: "Klaim prediksi ramalan tsunami susulan tokoh spiritual di grup suara WhatsApp",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "sumatera-utara",
      name: "Sumatera Utara",
      island: "Sumatera",
      path: "M 92 78 C 105 88, 120 102, 132 118 C 122 128, 108 126, 98 114 C 92 102, 94 88, 92 78 Z",
      center: [112, 106],
      scores: { all: 78, politik: 82, bencana: 65, penipuan: 88, kesehatan: 62 },
      reports: 3480,
      topRumor: "Lowongan kerja palsu BUMN Pelabuhan Belawan meminta transfer uang seragam",
      riskLevel: "Waspada Tinggi"
    },
    {
      id: "sumatera-barat",
      name: "Sumatera Barat",
      island: "Sumatera",
      path: "M 118 132 C 130 144, 142 164, 154 182 C 142 188, 130 178, 120 162 C 114 150, 114 138, 118 132 Z M 114 168 C 118 174, 124 186, 120 190 C 116 186, 112 178, 112 172 Z",
      center: [136, 160],
      scores: { all: 74, politik: 72, bencana: 83, penipuan: 68, kesehatan: 60 },
      reports: 2280,
      topRumor: "Beredar foto manipulasi erupsi Gunung Marapi menutupi seluruh atap Kota Padang",
      riskLevel: "Waspada Tinggi"
    },
    {
      id: "riau-kepri",
      name: "Riau & Kepri",
      island: "Sumatera",
      path: "M 132 118 C 146 128, 164 136, 178 152 C 166 160, 150 156, 138 142 C 128 132, 130 122, 132 118 Z M 172 130 A 3.5 3.5 0 1 1 172 137 Z M 184 136 A 3 3 0 1 1 184 142 Z",
      center: [154, 142],
      scores: { all: 68, politik: 70, bencana: 64, penipuan: 74, kesehatan: 55 },
      reports: 2340,
      topRumor: "Pungutan liar biaya izin tambang pasir laut dan pelayaran Batam-Singapura fiktif",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "jambi-sumsel",
      name: "Jambi & Sumsel",
      island: "Sumatera",
      path: "M 166 156 C 188 170, 212 192, 226 218 C 210 228, 192 216, 174 192 C 162 178, 162 166, 166 156 Z M 224 178 C 232 176, 238 186, 234 194 C 228 194, 224 184, 224 178 Z",
      center: [194, 192],
      scores: { all: 71, politik: 68, bencana: 62, penipuan: 77, kesehatan: 64 },
      reports: 2890,
      topRumor: "Klaim herbal rebusan daun tertentu mampu mematikan sel kanker seketika tanpa kemo",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "lampung-bengkulu",
      name: "Lampung & Bengkulu",
      island: "Sumatera",
      path: "M 172 202 C 190 216, 214 242, 238 270 C 230 276, 218 274, 204 254 C 190 236, 178 218, 172 202 Z",
      center: [208, 244],
      scores: { all: 69, politik: 69, bencana: 67, penipuan: 75, kesehatan: 58 },
      reports: 2420,
      topRumor: "Pesan berantai kuota internet pendidikan gratis dan pendaftaran PKH link .xyz",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "banten",
      name: "Banten",
      island: "Jawa",
      path: "M 242 278 C 252 274, 268 276, 276 282 C 274 290, 264 294, 252 294 C 244 292, 240 286, 242 278 Z",
      center: [258, 286],
      scores: { all: 76, politik: 75, bencana: 82, penipuan: 81, kesehatan: 64 },
      reports: 2650,
      topRumor: "Isu erupsi anak krakatau memicu tsunami tengah malam & pinjaman UMKM palsu",
      riskLevel: "Waspada Tinggi"
    },
    {
      id: "dki-jakarta",
      name: "DKI Jakarta",
      island: "Jawa",
      path: "M 282 278 C 290 277, 298 277, 302 280 C 300 285, 292 286, 284 285 C 282 283, 280 280, 282 278 Z",
      center: [292, 281],
      scores: { all: 92, politik: 95, bencana: 65, penipuan: 91, kesehatan: 74 },
      reports: 5840,
      topRumor: "Surat edaran hibah ormas & pemutihan pajak palsu bertanda tangan gubernur",
      riskLevel: "Waspada Sangat Tinggi"
    },
    {
      id: "jawa-barat",
      name: "Jawa Barat",
      island: "Jawa",
      path: "M 276 282 C 292 280, 318 280, 336 284 C 338 296, 326 306, 302 306 C 282 305, 274 296, 276 282 Z",
      center: [308, 296],
      scores: { all: 91, politik: 89, bencana: 91, penipuan: 93, kesehatan: 79 },
      reports: 6230,
      topRumor: "File APK tagihan pajak ETLE & ramalan tanggal pasti gempa megathrust beruntun",
      riskLevel: "Waspada Sangat Tinggi"
    },
    {
      id: "jawa-tengah-diy",
      name: "Jawa Tengah & DIY",
      island: "Jawa",
      path: "M 336 284 C 356 282, 376 276, 390 282 C 398 284, 408 283, 412 285 C 410 302, 392 310, 370 310 C 348 309, 338 300, 336 284 Z",
      center: [372, 298],
      scores: { all: 83, politik: 86, bencana: 85, penipuan: 76, kesehatan: 69 },
      reports: 4410,
      topRumor: "Video letusan lama Merapi disebarkan hari ini & rekrutmen pegawai pemprov pungli",
      riskLevel: "Waspada Sangat Tinggi"
    },
    {
      id: "jawa-timur",
      name: "Jawa Timur",
      island: "Jawa",
      path: "M 412 285 C 432 285, 458 286, 478 292 C 480 304, 468 316, 442 316 C 422 314, 412 302, 412 285 Z M 438 276 C 452 274, 468 276, 472 281 C 464 285, 446 285, 438 282 Z",
      center: [448, 298],
      scores: { all: 88, politik: 87, bencana: 84, penipuan: 92, kesehatan: 75 },
      reports: 5120,
      topRumor: "Phising verifikasi bansos berhadiah motor & APK undangan hajatan kuras tabungan",
      riskLevel: "Waspada Sangat Tinggi"
    },
    {
      id: "bali",
      name: "Bali",
      island: "Nusa Tenggara",
      path: "M 490 308 C 498 305, 506 308, 508 312 C 502 318, 492 316, 490 308 Z",
      center: [498, 312],
      scores: { all: 72, politik: 58, bencana: 60, penipuan: 79, kesehatan: 55 },
      reports: 1650,
      topRumor: "Situs agen visa turis palsu mencatut Ditjen Imigrasi dengan tarif berlipat ganda",
      riskLevel: "Waspada Tinggi"
    },
    {
      id: "ntb",
      name: "Nusa Tenggara Barat",
      island: "Nusa Tenggara",
      path: "M 514 310 C 528 309, 548 313, 558 316 C 550 323, 528 323, 516 317 Z",
      center: [536, 316],
      scores: { all: 64, politik: 62, bencana: 68, penipuan: 65, kesehatan: 49 },
      reports: 1420,
      topRumor: "Hoaks KLB penyakit misterius wisatawan asing di kawasan wisata Senggigi",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "ntt",
      name: "Nusa Tenggara Timur",
      island: "Nusa Tenggara",
      path: "M 562 315 C 588 313, 622 319, 638 329 C 628 339, 598 335, 572 325 Z",
      center: [598, 325],
      scores: { all: 66, politik: 60, bencana: 76, penipuan: 64, kesehatan: 56 },
      reports: 1580,
      topRumor: "Kabar bohong penutupan perbatasan laut dan gelombang panas ekstrem fiktif",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "kalimantan-barat",
      name: "Kalimantan Barat",
      island: "Kalimantan",
      path: "M 284 148 C 304 134, 330 136, 344 152 C 338 182, 324 210, 300 214 C 286 204, 278 180, 284 148 Z",
      center: [312, 178],
      scores: { all: 59, politik: 62, bencana: 55, penipuan: 61, kesehatan: 44 },
      reports: 1720,
      topRumor: "Isu karhutla buatan yang menutup jarak pandang bandara Supadio secara total",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "kalimantan-tengah",
      name: "Kalimantan Tengah",
      island: "Kalimantan",
      path: "M 330 164 C 352 156, 374 168, 382 192 C 376 220, 352 234, 332 230 C 322 212, 324 186, 330 164 Z",
      center: [356, 202],
      scores: { all: 58, politik: 60, bencana: 66, penipuan: 54, kesehatan: 48 },
      reports: 1390,
      topRumor: "Kabar palsu pencemaran merkuri sungai pedalaman memicu kematian massal ikan",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "kalimantan-selatan",
      name: "Kalimantan Selatan",
      island: "Kalimantan",
      path: "M 376 200 C 392 194, 408 202, 414 218 C 408 234, 392 244, 380 242 C 372 232, 372 214, 376 200 Z",
      center: [394, 222],
      scores: { all: 56, politik: 58, bencana: 62, penipuan: 56, kesehatan: 46 },
      reports: 1450,
      topRumor: "Hoaks pencabutan subsidi bahan bakar perahu nelayan sungai Martapura",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "kalimantan-timur",
      name: "Kaltim & Kaltara (IKN)",
      island: "Kalimantan",
      path: "M 354 104 C 382 94, 416 110, 432 138 C 436 166, 424 192, 404 196 C 390 178, 382 152, 368 132 C 358 120, 354 110, 354 104 Z",
      center: [398, 148],
      scores: { all: 82, politik: 86, bencana: 45, penipuan: 86, kesehatan: 52 },
      reports: 3120,
      topRumor: "Penipuan pendaftaran calo ganti rugi pembebasan lahan IKN Nusantara via link",
      riskLevel: "Waspada Sangat Tinggi"
    },
    {
      id: "sulawesi-utara",
      name: "Sulut & Gorontalo",
      island: "Sulawesi",
      path: "M 490 132 C 512 124, 542 118, 570 120 C 572 126, 556 132, 536 132 C 512 134, 494 140, 490 132 Z",
      center: [534, 126],
      scores: { all: 65, politik: 65, bencana: 72, penipuan: 61, kesehatan: 52 },
      reports: 1890,
      topRumor: "Peringatan tsunami letusan Gunung Ruang merambat hingga ke teluk Manado",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "sulawesi-tengah",
      name: "Sulteng & Sulbar",
      island: "Sulawesi",
      path: "M 484 138 C 502 140, 522 152, 548 164 C 550 172, 534 180, 514 176 C 498 174, 484 164, 484 138 Z",
      center: [512, 160],
      scores: { all: 66, politik: 64, bencana: 74, penipuan: 59, kesehatan: 50 },
      reports: 1980,
      topRumor: "Peringatan palsu pergeseran lempeng patahan Palu-Koro memicu likuefaksi baru",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "sulawesi-selatan",
      name: "Sulsel & Sultra",
      island: "Sulawesi",
      path: "M 488 178 C 504 182, 524 194, 532 222 C 524 240, 510 238, 502 222 C 496 244, 482 260, 476 256 C 472 240, 478 210, 488 178 Z",
      center: [506, 224],
      scores: { all: 78, politik: 76, bencana: 71, penipuan: 82, kesehatan: 58 },
      reports: 2980,
      topRumor: "Bantuan kapal motor & modal melaut nelayan gratis mencatut Kementerian KKP",
      riskLevel: "Waspada Tinggi"
    },
    {
      id: "maluku-utara",
      name: "Maluku Utara",
      island: "Maluku",
      path: "M 614 128 C 628 122, 642 130, 648 144 C 642 158, 630 164, 620 152 C 618 140, 612 134, 614 128 Z",
      center: [632, 142],
      scores: { all: 59, politik: 62, bencana: 66, penipuan: 52, kesehatan: 44 },
      reports: 1120,
      topRumor: "Hoaks kenaikan tarif tiket kapal cepat Ternate-Tidore hingga tiga kali lipat",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "maluku",
      name: "Kepulauan Maluku",
      island: "Maluku",
      path: "M 614 194 C 638 190, 662 196, 670 208 C 658 218, 632 216, 616 204 Z M 674 238 C 684 234, 692 244, 688 254 C 680 256, 674 248, 674 238 Z",
      center: [642, 206],
      scores: { all: 61, politik: 54, bencana: 68, penipuan: 48, kesehatan: 42 },
      reports: 1250,
      topRumor: "Isu kenaikan muka air laut mendadak dan retakan patahan bumi di perbukitan Ambon",
      riskLevel: "Rawan Sedang"
    },
    {
      id: "papua-barat",
      name: "Papua Barat & BD",
      island: "Papua",
      path: "M 660 172 C 680 162, 704 164, 714 180 C 708 194, 690 202, 674 198 C 662 194, 656 182, 660 172 Z M 650 162 A 3 3 0 1 1 650 168 Z",
      center: [684, 184],
      scores: { all: 75, politik: 79, bencana: 50, penipuan: 64, kesehatan: 58 },
      reports: 1940,
      topRumor: "Beredar formulir palsu pendaftaran bantuan afirmasi pemuda Raja Ampat",
      riskLevel: "Waspada Tinggi"
    },
    {
      id: "papua",
      name: "Papua Raya",
      island: "Papua",
      path: "M 714 180 C 734 176, 774 176, 830 182 C 828 238, 812 274, 770 274 C 744 272, 726 244, 718 214 C 712 198, 712 186, 714 180 Z",
      center: [772, 226],
      scores: { all: 84, politik: 89, bencana: 54, penipuan: 73, kesehatan: 64 },
      reports: 3560,
      topRumor: "Video manipulasi rekaman bentrokan masa lalu disebarkan sebagai insiden baru",
      riskLevel: "Waspada Sangat Tinggi"
    }
  ],

  activeCategory: "all",
  activeProvinceId: "jawa-barat",

  /**
   * Mengambil warna hex berdasarkan skor kerawanan (Cyber Red & Blue spectrum)
   * @param {number} score 0 - 100
   */
  getColorForScore(score) {
    if (score >= 80) return { fill: "rgba(239, 68, 68, 0.65)", stroke: "#ef4444", text: "text-rose-400", label: "Waspada Sangat Tinggi" };
    if (score >= 65) return { fill: "rgba(244, 63, 94, 0.45)", stroke: "#f43f5e", text: "text-rose-300", label: "Waspada Tinggi" };
    if (score >= 50) return { fill: "rgba(245, 158, 11, 0.45)", stroke: "#f59e0b", text: "text-amber-400", label: "Rawan Sedang" };
    return { fill: "rgba(14, 165, 233, 0.40)", stroke: "#0ea5e9", text: "text-sky-400", label: "Terkendali / Rendah" };
  },

  /**
   * Render SVG Peta ke dalam kontainer
   * @param {string} containerId ID elemen pembungkus
   */
  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    this.renderMap(container);
    this.setupCategoryFilters();
    this.selectProvince(this.activeProvinceId);
  },

  renderMap(container) {
    const activeCat = this.activeCategory;

    let svgHtml = `
      <div class="relative w-full overflow-hidden">
        <svg viewBox="50 50 820 320" class="w-full h-auto max-h-[380px] select-none filter drop-shadow-[0_0_15px_rgba(14,165,233,0.1)]">
          <!-- Grid background subtle radar rings -->
          <circle cx="450" cy="200" r="160" fill="none" stroke="rgba(14, 165, 233, 0.05)" stroke-width="1" stroke-dasharray="4 6" />
          <circle cx="450" cy="200" r="280" fill="none" stroke="rgba(14, 165, 233, 0.04)" stroke-width="1" stroke-dasharray="4 6" />
          <line x1="50" y1="200" x2="870" y2="200" stroke="rgba(14, 165, 233, 0.05)" stroke-width="1" stroke-dasharray="2 4" />
          <line x1="450" y1="50" x2="450" y2="370" stroke="rgba(14, 165, 233, 0.05)" stroke-width="1" stroke-dasharray="2 4" />

          <!-- Region Polygons / Paths (Tingkat Provinsi) -->
          <g id="map-provinces-group">
    `;

    this.provinces.forEach(p => {
      const score = p.scores[activeCat] || p.scores.all;
      const col = this.getColorForScore(score);
      const isSelected = p.id === this.activeProvinceId;

      svgHtml += `
        <g class="map-province-path cursor-pointer transition-all duration-300" data-province-id="${p.id}">
          <path d="${p.path}" 
                fill="${col.fill}" 
                stroke="${isSelected ? '#ffffff' : col.stroke}" 
                stroke-width="${isSelected ? '2.5' : '1.2'}" 
                class="hover:opacity-100 hover:stroke-sky-300 transition-all filter hover:drop-shadow-[0_0_10px_${col.stroke}]"
          />
          <!-- Pin Label Node -->
          <circle cx="${p.center[0]}" cy="${p.center[1]}" r="${isSelected ? '5' : '3.5'}" fill="${col.stroke}" stroke="#030712" stroke-width="1.5" />
          <text x="${p.center[0]}" y="${p.center[1] + 13}" 
                font-family="'JetBrains Mono', monospace" 
                font-size="7.5" 
                font-weight="bold" 
                fill="${isSelected ? '#ffffff' : '#cbd5e1'}" 
                text-anchor="middle" 
                pointer-events="none">
            ${p.name.split(' ')[0]} (${score})
          </text>
        </g>
      `;
    });

    svgHtml += `</g>`;

    // --- Overlay Titik Spasial Nyata Tingkat Kecamatan (100% Interaktif & Bekerja Offline) ---
    svgHtml += `<g id="map-spatial-nodes-group">`;
    const filteredPoints = (activeCat === 'all')
      ? this.spatialPoints
      : this.spatialPoints.filter(p => p.kategori === activeCat);

    filteredPoints.forEach(pt => {
      // Proyeksi koordinat GPS (WGS84) ke viewBox SVG (50 50 820 320)
      const sx = Math.round(95 + ((pt.lng - 95.0) / 46.0) * 685);
      const sy = Math.round(80 + ((5.6 - pt.lat) / 16.5) * 230);
      const color = pt.colorClass === 'red' ? '#ef4444' : (pt.colorClass === 'amber' ? '#f59e0b' : '#0ea5e9');

      svgHtml += `
        <g class="map-svg-spatial-pin cursor-pointer group" data-spatial-id="${pt.id}">
          <circle cx="${sx}" cy="${sy}" r="9" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.6">
            <animate attributeName="r" values="3.5;13;3.5" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.05;0.8" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx="${sx}" cy="${sy}" r="3.5" fill="${color}" stroke="#030712" stroke-width="1.2" class="transition-transform group-hover:scale-150" />
          <title>${pt.kecamatan}, ${pt.kabupaten} (${pt.kategoriLabel}) - Skor: ${pt.score}</title>
        </g>
      `;
    });
    svgHtml += `</g>`;

    svgHtml += `
        </svg>
      </div>
    `;

    container.innerHTML = svgHtml;

    // Pasang event listener hover & click pada provinsi
    container.querySelectorAll('.map-province-path').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-province-id');
        this.selectProvince(id);
      });

      el.addEventListener('mouseenter', () => {
        const id = el.getAttribute('data-province-id');
        this.selectProvince(id, false);
      });
    });

    // Pasang event listener click pada titik spasial kecamatan di SVG
    container.querySelectorAll('.map-svg-spatial-pin').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.SoundFX) window.SoundFX.click();
        const ptId = el.getAttribute('data-spatial-id');
        const pt = this.spatialPoints.find(p => p.id === ptId);
        if (pt) this.selectSpatialPoint(pt);
      });
    });
  },

  /**
   * Render Mini Peta Vektor Indonesia untuk Widget Scanner Tab 1
   * Menyorot provinsi/wilayah spesifik yang terdeteksi dalam berita
   */
  renderMiniMap(containerId, highlightedRegionId = null) {
    const container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!container) return;

    let svgHtml = `
      <svg viewBox="50 50 820 310" class="w-full h-auto max-h-[160px] select-none filter drop-shadow-[0_0_10px_rgba(14,165,233,0.2)]">
        <!-- Background subtle radar grid -->
        <circle cx="450" cy="190" r="140" fill="none" stroke="rgba(14, 165, 233, 0.06)" stroke-width="1" stroke-dasharray="3 5" />
        <line x1="50" y1="190" x2="870" y2="190" stroke="rgba(14, 165, 233, 0.05)" stroke-width="1" stroke-dasharray="2 4" />
        <g id="mini-map-provinces">
    `;

    this.provinces.forEach(p => {
      const isTarget = highlightedRegionId && (p.id === highlightedRegionId || p.id.includes(highlightedRegionId));
      const fill = isTarget ? "rgba(239, 68, 68, 0.75)" : "rgba(14, 165, 233, 0.22)";
      const stroke = isTarget ? "#ef4444" : "#0ea5e9";
      const strokeWidth = isTarget ? "2.2" : "0.9";

      svgHtml += `
        <path d="${p.path}" 
              fill="${fill}" 
              stroke="${stroke}" 
              stroke-width="${strokeWidth}" 
              class="${isTarget ? 'drop-shadow-[0_0_12px_#ef4444]' : 'opacity-80'} transition-all"
        />
      `;
    });

    // Render titik spasial pada mini map
    this.spatialPoints.forEach(pt => {
      const sx = Math.round(95 + ((pt.lng - 95.0) / 46.0) * 685);
      const sy = Math.round(75 + ((5.6 - pt.lat) / 16.5) * 230);
      const isPtTarget = highlightedRegionId && pt.provinsi.toLowerCase().includes(highlightedRegionId.toLowerCase());
      const col = isPtTarget ? '#ef4444' : (pt.colorClass === 'red' ? '#ef4444' : '#0ea5e9');

      svgHtml += `
        <circle cx="${sx}" cy="${sy}" r="${isPtTarget ? '4.5' : '2.5'}" fill="${col}" stroke="#02050e" stroke-width="1" />
      `;
    });

    svgHtml += `
        </g>
      </svg>
    `;

    container.innerHTML = svgHtml;
  },

  selectProvince(id, updatePersistent = true) {
    if (updatePersistent) this.activeProvinceId = id;

    const prov = this.provinces.find(p => p.id === id);
    if (!prov) return;

    const score = prov.scores[this.activeCategory] || prov.scores.all;
    const col = this.getColorForScore(score);

    // Update kartu detail inspeksi
    const cardEl = document.getElementById('map-province-detail-card') || document.getElementById('map-province-detail-box');
    if (cardEl) {
      cardEl.innerHTML = `
        <div class="space-y-3.5 animate-fade-in font-sans">
          <div class="flex items-start justify-between gap-3 border-b border-sky-500/10 pb-3">
            <div>
              <span class="text-[10px] font-mono uppercase text-slate-400">${prov.island} &bull; INDONESIA</span>
              <h4 class="text-base font-black text-white font-mono flex items-center gap-2">
                <i class="fa-solid fa-location-dot ${col.text}"></i> ${prov.name}
              </h4>
            </div>
            <div class="text-right">
              <span class="text-2xl font-black font-mono ${col.text}">${score}</span>
              <span class="text-[10px] text-slate-400 block font-mono">/ 100</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="p-2.5 rounded-xl bg-[#040814] border border-sky-500/15">
              <span class="text-[10px] text-slate-400 block">STATUS KERAWANAN</span>
              <span class="font-bold ${col.text}">${col.label}</span>
            </div>
            <div class="p-2.5 rounded-xl bg-[#040814] border border-sky-500/15">
              <span class="text-[10px] text-slate-400 block">TOTAL LAPORAN PUBLIK</span>
              <span class="font-bold text-slate-200">${prov.reports.toLocaleString('id-ID')} kasus</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-rose-950/20 border border-rose-500/25 text-xs space-y-1">
            <span class="text-[10px] font-bold text-rose-400 font-mono flex items-center gap-1.5">
              <i class="fa-solid fa-triangle-exclamation"></i> TREN HOAKS PALING VIRAL DI DAERAH INI:
            </span>
            <p class="text-slate-300 text-[11px] leading-relaxed">"${prov.topRumor}"</p>
          </div>

          <!-- Mini Breakdown Bar per Kategori -->
          <div class="space-y-1.5 pt-1 text-[11px] font-mono">
            <div class="flex justify-between text-slate-400 text-[10px]">
              <span>Pilkada & Politik: <strong class="text-slate-200">${prov.scores.politik}</strong></span>
              <span>Penipuan Bansos: <strong class="text-slate-200">${prov.scores.penipuan}</strong></span>
              <span>Bencana: <strong class="text-slate-200">${prov.scores.bencana}</strong></span>
            </div>
            <div class="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
              <div style="width: ${prov.scores.politik / 3}%" class="bg-rose-500"></div>
              <div style="width: ${prov.scores.penipuan / 3}%" class="bg-amber-500"></div>
              <div style="width: ${prov.scores.bencana / 3}%" class="bg-sky-500"></div>
            </div>
          </div>
        </div>
      `;
    }

    // Sorot elemen path SVG yang aktif
    const container = document.getElementById('indonesia-map-container');
    if (container) {
      container.querySelectorAll('.map-province-path path').forEach(pathEl => {
        const parentId = pathEl.parentElement.getAttribute('data-province-id');
        if (parentId === id) {
          pathEl.setAttribute('stroke', '#ffffff');
          pathEl.setAttribute('stroke-width', '2.5');
        } else {
          const provObj = this.provinces.find(p => p.id === parentId);
          const s = provObj ? (provObj.scores[this.activeCategory] || provObj.scores.all) : 50;
          const c = this.getColorForScore(s);
          pathEl.setAttribute('stroke', c.stroke);
          pathEl.setAttribute('stroke-width', '1.2');
        }
      });
    }
  },

  setupCategoryFilters() {
    const filterPills = document.querySelectorAll('.map-category-pill');
    filterPills.forEach(pill => {
      if (pill._bound) return;
      pill._bound = true;
      pill.addEventListener('click', () => {
        if (window.SoundFX) window.SoundFX.click();
        const cat = pill.getAttribute('data-map-category');
        this.filterCategory(cat);
      });
    });
  },

  filterCategory(cat) {
    this.activeCategory = cat || 'all';

    const filterPills = document.querySelectorAll('.map-category-pill');
    filterPills.forEach(p => {
      if (p.getAttribute('data-map-category') === this.activeCategory) {
        p.className = "map-category-pill px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_12px_rgba(14,165,233,0.3)] font-mono";
      } else {
        p.className = "map-category-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-slate-900 text-slate-400 hover:text-slate-200 border border-sky-500/20 font-mono";
      }
    });

    const container = document.getElementById('indonesia-map-container');
    if (container) {
      this.renderMap(container);
      this.selectProvince(this.activeProvinceId);
    }

    // Sinkronkan juga ke Leaflet jika aktif
    if (window.SpatialLeafletManager) {
      window.SpatialLeafletManager.filterCategory(this.activeCategory);
    }
  },

  filterByCategory(cat) {
    this.filterCategory(cat);
  },

  /**
   * Menampilkan Data Spesifik Titik Spasial Kecamatan/Kabupaten/Provinsi pada Panel Inspektur HUD
   */
  selectSpatialPoint(pt) {
    if (!pt) return;
    const detailBox = document.getElementById('map-province-detail-card') || document.getElementById('map-province-detail-box');
    if (!detailBox) return;

    detailBox.innerHTML = `
      <div class="space-y-4 animate-fade-in font-sans">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px] font-mono font-bold border border-sky-500/30 uppercase">[TITIK SPASIAL LIVE RADAR]</span>
            <span class="text-xs text-slate-400 font-mono">${pt.provinsi}</span>
          </div>
          <h4 class="text-lg font-black text-white font-mono tracking-tight text-glow-blue">${pt.kecamatan}, ${pt.kabupaten}</h4>
          <p class="text-[11px] text-slate-400 font-mono mt-0.5">Koordinat GPS: ${pt.lat.toFixed(4)}, ${pt.lng.toFixed(4)} &bull; ${pt.provinsi}</p>
        </div>

        <div class="grid grid-cols-2 gap-3 font-mono">
          <div class="p-3 rounded-2xl bg-[#02050e] border border-sky-500/20">
            <span class="text-[10px] text-slate-400 block mb-0.5">INDEKS KERAWANAN</span>
            <div class="text-2xl font-black ${pt.score >= 75 ? 'text-rose-400' : (pt.score >= 50 ? 'text-amber-400' : 'text-sky-400')}">
              ${pt.score}<span class="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span class="text-[9px] text-slate-500 uppercase tracking-wider block mt-0.5">${pt.status}</span>
          </div>
          <div class="p-3 rounded-2xl bg-[#02050e] border border-sky-500/20">
            <span class="text-[10px] text-slate-400 block mb-0.5">TOTAL LAPORAN</span>
            <div class="text-2xl font-black text-slate-100">
              ${pt.laporanCount.toLocaleString('id-ID')}
            </div>
            <span class="text-[9px] text-slate-400 font-medium block mt-0.5">Kasus Diverifikasi</span>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-rose-950/25 border border-rose-500/30 space-y-1.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-rose-400 font-mono flex items-center gap-1.5">
              <i class="fa-solid fa-triangle-exclamation"></i> KASUS VIRAL DI KECAMATAN INI:
            </span>
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-rose-300 border border-rose-500/30">${pt.kategoriLabel}</span>
          </div>
          <p class="text-slate-200 text-xs font-semibold leading-relaxed">"${pt.topRumor}"</p>
          <div class="pt-1.5 border-t border-rose-500/15 text-[11px] text-slate-400 leading-relaxed">
            <strong class="text-slate-300 font-mono">Arahan Mitigasi:</strong> ${pt.mitigasi}
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
          <span>Audit Terakhir: <strong class="text-slate-400">${pt.tanggalAudit}</strong></span>
          <span class="text-sky-400 font-bold flex items-center gap-1"><i class="fa-solid fa-satellite text-rose-400"></i> Sentinel Spatial Node</span>
        </div>
      </div>
    `;
  }
};

/**
 * Kontroler Peta Titik Spasial Interaktif Google Maps Style (Leaflet.js)
 * Dilengkapi Anti-Gray Box Staggered Invalidation, ResizeObserver,
 * Tile Auto-Fallback (Esri Satellite / Dark Canvas -> OSM Standar), dan Fallback Peta SVG Offline.
 */
const SpatialLeafletManager = {
  map: null,
  markers: [],
  activeCategory: 'all',
  currentTileType: 'satellite',
  tileLayer: null,
  resizeObserver: null,

  init(containerId = 'spatial-leaflet-map') {
    const el = document.getElementById(containerId);
    if (!el) return;

    // 1. Resilience Check: Jika Leaflet CDN tidak terjangkau (Offline / script blocked)
    if (!window.L) {
      console.warn("[VERITASK AI] Leaflet library (window.L) not available. Activating fallback SVG vector map.");
      this.activateFallbackMode("Pustaka Leaflet CDN tidak terjangkau (Mode Offline). Sistem otomatis mengaktifkan Peta Vektor Sentinel SVG Bawaan.");
      return;
    }

    // 2. Jika peta sudah pernah diinisialisasi, lakukan staggered size invalidation
    if (this.map) {
      this.staggeredInvalidate();
      return;
    }

    try {
      // 3. Inisialisasi Peta Leaflet berpusat di Kepulauan Indonesia
      this.map = L.map(containerId, {
        center: [-2.5489, 118.0149],
        zoom: 5,
        minZoom: 4,
        maxZoom: 16,
        zoomControl: true
      });

      // 4. Pasang Tile Layer (Default: Citra Satelit Esri Asli Bebas API Key & Watermark)
      this.switchTileLayer('satellite');

      // 5. Render Marker Titik Spasial
      this.renderMarkers();

      // 6. Pasang Event Listeners (Pencarian, Recenter, Presets, Tile switch)
      this.setupListeners();

      // 7. Cegah Gray Box / Peta Terpotong dengan ResizeObserver & staggered invalidate
      this.setupResizeObserver(el);
      this.staggeredInvalidate();

      // 8. Default inspeksi titik spasial pertama jika ada
      if (IndonesiaDisinfoMap.spatialPoints && IndonesiaDisinfoMap.spatialPoints.length > 0) {
        IndonesiaDisinfoMap.selectSpatialPoint(IndonesiaDisinfoMap.spatialPoints[0]);
      }
    } catch (err) {
      console.error("[VERITASK AI] Gagal inisialisasi Leaflet:", err);
      this.activateFallbackMode("Gagal memuat canvas Leaflet. Sistem mengalihkan ke Peta Vektor SVG.");
    }
  },

  staggeredInvalidate() {
    if (!this.map) return;
    [50, 150, 300, 600].forEach(delay => {
      setTimeout(() => {
        if (this.map) this.map.invalidateSize();
      }, delay);
    });
  },

  setupResizeObserver(el) {
    if (window.ResizeObserver && el && !this.resizeObserver) {
      try {
        this.resizeObserver = new ResizeObserver(() => {
          if (this.map) this.map.invalidateSize();
        });
        this.resizeObserver.observe(el);
      } catch (e) {}
    }
  },

  switchTileLayer(type) {
    if (!this.map || !window.L) return;
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }

    const tileOptions = ['satellite', 'dark', 'osm'];
    if (!type) {
      const idx = tileOptions.indexOf(this.currentTileType);
      this.currentTileType = tileOptions[(idx + 1) % tileOptions.length];
    } else {
      this.currentTileType = type;
    }

    const btnTileLabel = document.getElementById('btn-tile-label');

    if (this.currentTileType === 'satellite') {
      if (btnTileLabel) btnTileLabel.innerHTML = 'Gaya: 🛰️ Satelit Asli';
      this.tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &bull; Earthstar Geographics &bull; NASA',
        maxZoom: 18
      });
    } else if (this.currentTileType === 'dark') {
      if (btnTileLabel) btnTileLabel.innerHTML = 'Gaya: 🌑 Cyber Dark';
      this.tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri &bull; DeLorme &bull; NAVTEQ',
        maxZoom: 16
      });
    } else {
      if (btnTileLabel) btnTileLabel.innerHTML = 'Gaya: 🗺️ OSM Standar';
      this.tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      });
    }

    // Auto-fallback jika koneksi satelit/dark terhambat
    this.tileLayer.on('tileerror', () => {
      console.warn("[VERITASK AI] Tile layer bermasalah koneksi. Beralih ke OpenStreetMap.");
      if (this.currentTileType !== 'osm') {
        this.switchTileLayer('osm');
      }
    });

    this.tileLayer.addTo(this.map);
  },

  recenterMap() {
    if (!this.map) return;
    if (window.SoundFX) window.SoundFX.click();
    this.map.setView([-2.5489, 118.0149], 5, { animate: true });
    this.staggeredInvalidate();
  },

  flyToLocation(pointId) {
    const pt = IndonesiaDisinfoMap.spatialPoints.find(p => p.id === pointId);
    if (!pt) return false;

    if (this.map) {
      this.map.flyTo([pt.lat, pt.lng], 13, { duration: 1.2 });
      setTimeout(() => {
        const marker = this.markers.find(m => {
          const ll = m.getLatLng();
          return Math.abs(ll.lat - pt.lat) < 0.001 && Math.abs(ll.lng - pt.lng) < 0.001;
        });
        if (marker) marker.openPopup();
      }, 1200);
    }
    IndonesiaDisinfoMap.selectSpatialPoint(pt);
    return true;
  },

  activateFallbackMode(msg) {
    const banner = document.getElementById('leaflet-fallback-banner');
    const bannerText = document.getElementById('leaflet-fallback-text');
    if (banner) {
      banner.classList.remove('hidden');
      if (bannerText && msg) bannerText.textContent = msg;
    }

    const spatialView = document.getElementById('spatial-leaflet-view');
    const choroplethView = document.getElementById('choropleth-svg-view');
    const btnSpatial = document.getElementById('btn-toggle-spatial-map');
    const btnChoropleth = document.getElementById('btn-toggle-choropleth-map');

    if (spatialView) spatialView.classList.add('hidden');
    if (choroplethView) choroplethView.classList.remove('hidden');

    if (btnSpatial && btnChoropleth) {
      btnSpatial.className = "px-3.5 py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200 border border-transparent transition-all flex items-center gap-1.5";
      btnChoropleth.className = "px-3.5 py-2 rounded-xl font-bold bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all flex items-center gap-1.5";
    }

    if (window.IndonesiaDisinfoMap) {
      window.IndonesiaDisinfoMap.init('indonesia-map-container');
    }
  },

  renderMarkers() {
    if (!this.map || !window.L) return;

    // Bersihkan marker lama
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    const points = IndonesiaDisinfoMap.spatialPoints;
    const filtered = (this.activeCategory === 'all')
      ? points
      : points.filter(p => p.kategori === this.activeCategory);

    filtered.forEach(pt => {
      // Custom Cyber HTML Marker Pin
      const iconHtml = `
        <div class="cyber-spatial-marker marker-${pt.colorClass}">
          <span class="marker-pulse pulse-${pt.colorClass}"></span>
          <div class="marker-dot">
            <i class="fa-solid fa-location-dot"></i>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'cyber-leaflet-div-icon',
        html: iconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 26],
        popupAnchor: [0, -26]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon });

      // Popup Google Maps Style
      const popupContent = `
        <div class="spatial-popup-card font-sans">
          <div class="flex items-center justify-between gap-2 mb-1.5">
            <span class="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 uppercase">[KECAMATAN]</span>
            <span class="text-[10px] font-mono text-slate-400">${pt.provinsi}</span>
          </div>
          <h4 class="text-xs font-black text-slate-100 font-mono mb-1 leading-snug">${pt.kecamatan}, ${pt.kabupaten}</h4>
          <div class="text-[10px] text-slate-300 mb-2 leading-relaxed">
            <strong class="text-rose-400 font-mono">Isu:</strong> "${pt.topRumor.slice(0, 80)}..."
          </div>
          <div class="flex items-center justify-between pt-1.5 border-t border-slate-700/60 text-[10px] font-mono">
            <span class="font-bold ${pt.score >= 75 ? 'text-rose-400' : (pt.score >= 50 ? 'text-amber-400' : 'text-sky-400')}">Indeks: ${pt.score}/100</span>
            <button class="btn-inspect-pt px-2.5 py-1 rounded bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-colors" data-pt-id="${pt.id}">Inspeksi Detail</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'cyber-leaflet-popup'
      });

      marker.on('click', () => {
        if (window.SoundFX) window.SoundFX.click();
        IndonesiaDisinfoMap.selectSpatialPoint(pt);
      });

      marker.addTo(this.map);
      this.markers.push(marker);
    });

    // Event listener untuk tombol di popup
    this.map.on('popupopen', () => {
      document.querySelectorAll('.btn-inspect-pt').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const ptId = btn.getAttribute('data-pt-id');
          const matched = points.find(p => p.id === ptId);
          if (matched) {
            IndonesiaDisinfoMap.selectSpatialPoint(matched);
            this.map.setView([matched.lat, matched.lng], 12, { animate: true });
          }
        });
      });
    });
  },

  filterCategory(cat) {
    this.activeCategory = cat || 'all';
    this.renderMarkers();
  },

  filterByCategory(cat) {
    this.filterCategory(cat);
  },

  searchLocation(query) {
    if (!query || !query.trim()) return false;
    const q = query.toLowerCase().trim();
    const match = IndonesiaDisinfoMap.spatialPoints.find(p => 
      p.kecamatan.toLowerCase().includes(q) ||
      p.kabupaten.toLowerCase().includes(q) ||
      p.provinsi.toLowerCase().includes(q) ||
      p.topRumor.toLowerCase().includes(q)
    );

    if (match) {
      if (this.map) {
        this.map.flyTo([match.lat, match.lng], 13, { duration: 1.5 });
      }
      IndonesiaDisinfoMap.selectSpatialPoint(match);
      return match;
    }
    return null;
  },

  setupListeners() {
    const searchInput = document.getElementById('spatial-search-input');
    const searchBtn = document.getElementById('btn-spatial-search');
    const recenterBtn = document.getElementById('btn-recenter-map');
    const switchTileBtn = document.getElementById('btn-switch-tile');
    const quickJumpBtns = document.querySelectorAll('.btn-quick-spatial-jump');

    if (searchBtn && !searchBtn._bound) {
      searchBtn._bound = true;
      searchBtn.addEventListener('click', () => {
        const query = searchInput ? searchInput.value : '';
        const res = this.searchLocation(query);
        if (!res) alert(`Titik spasial "${query}" tidak ditemukan. Coba ketik "Coblong", "Bandung", "Gambir", "Sleman", atau "Surabaya".`);
      });
    }

    if (searchInput && !searchInput._bound) {
      searchInput._bound = true;
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const res = this.searchLocation(searchInput.value);
          if (!res) alert(`Titik spasial "${searchInput.value}" tidak ditemukan. Coba ketik "Coblong", "Bandung", "Gambir", "Sleman", atau "Surabaya".`);
        }
      });
    }

    if (recenterBtn && !recenterBtn._bound) {
      recenterBtn._bound = true;
      recenterBtn.addEventListener('click', () => this.recenterMap());
    }

    if (switchTileBtn && !switchTileBtn._bound) {
      switchTileBtn._bound = true;
      switchTileBtn.addEventListener('click', () => {
        if (window.SoundFX) window.SoundFX.click();
        this.switchTileLayer();
      });
    }

    quickJumpBtns.forEach(btn => {
      if (!btn._bound) {
        btn._bound = true;
        btn.addEventListener('click', () => {
          if (window.SoundFX) window.SoundFX.click();
          const ptId = btn.getAttribute('data-pt-id');
          this.flyToLocation(ptId);
        });
      }
    });

    const forceSvgBtn = document.getElementById('btn-force-svg-mode');
    if (forceSvgBtn && !forceSvgBtn._bound) {
      forceSvgBtn._bound = true;
      forceSvgBtn.addEventListener('click', () => {
        const btnChoropleth = document.getElementById('btn-toggle-choropleth-map');
        if (btnChoropleth) btnChoropleth.click();
      });
    }
  }
};

window.IndonesiaDisinfoMap = IndonesiaDisinfoMap;
window.SpatialLeafletManager = SpatialLeafletManager;
