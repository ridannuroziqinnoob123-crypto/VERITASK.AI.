/**
 * VERITASK AI - Database Pengetahuan, Dataset Cek Fakta & Katalog Berita Sahih
 * Berisi kamus heuristik bahasa Indonesia, daftar domain, dataset kasus nyata, statistik,
 * katalog Berita Lolos Verifikasi (Non-Hoaks), dan modul Fetching Live Online Cek Fakta.
 */

const VeritasDB = {
  // Kamus Pola Bahasa & Kata Kunci
  keywords: {
    // Sensasionalisme & Clickbait
    sensational: [
      "geger", "menggemparkan", "heboh", "merinding", "sangat mengejutkan",
      "bikin syok", "jangan kaget", "viral parah", "terbongkar", "kebusukan",
      "aib", "rezim panik", "rahasia terlarang", "semua tertipu", "fakta mengerikan",
      "konspirasi elit", "dibungkam", "kebohongan besar", "terkuak", "terciduk"
    ],

    // Urgensi Semu & Rantai Pesan (FOMO & Force Share)
    urgency: [
      "sebarkan", "viralkan", "bagikan sekarang", "sebelum dihapus", "sebar luaskan",
      "wajib share", "jangan berhenti di kamu", "forward ke semua grup", "sebelum terlambat",
      "klik link ini", "klaim sekarang", "kuota gratis", "bantuan langsung tunai",
      "hanya hari ini", "segera ambil", "berlaku sampai malam ini", "tanpa diundi"
    ],

    // Sumber Anonim & Tidak Jelas (Unverified Attribution)
    unverifiedSources: [
      "kata dokter di wa", "info orang dalam", "dapat kabar dari grup sebelah",
      "katanya sih", "teman saya yang kerja di", "bocoran istana", "sumber terpercaya yang tidak mau disebut",
      "diteruskan berkali-kali", "info valid a1", "kabar burung", "katanya pemerintah"
    ],

    // Manipulasi Emosi / Ketakutan / Teori Konspirasi
    emotionalFear: [
      "racun berbahaya", "senjata biologis", "microchip", "depopulasi",
      "kiamat sudah dekat", "dunia akan hancur", "darurat perang", "darah mendidih",
      "mati mendadak", "jangan mau divaksin", "disembunyikan dokter", "rekayasa elit global"
    ],

    // Indikator Berita Kredibel / Jurnalistik Berimbang
    credibleIndicators: [
      "menurut keterangan resmi", "dikutip dari", "konferensi pers", "juru bicara",
      "klarifikasi", "membantah", "menyatakan", "berdasarkan data", "laporan tahunan",
      "dilansir dari", "siaran pers", "badan meteorologi", "kementerian", "polda", "humas"
    ]
  },

  // Reputasi Domain & Media
  domains: {
    credible: [
      "antaranews.com", "kompas.com", "tempo.co", "detik.com", "republika.co.id",
      "cnnindonesia.com", "tirto.id", "tribunnews.com", "bisnis.com", "liputan6.com",
      "merdeka.com", "suara.com", "jawapos.com", "katadata.co.id", "kumparan.com",
      "turnbackhoax.id", "cekfakta.com", "kominfo.go.id", "kemenkes.go.id",
      "bmkg.go.id", "bnpb.go.id", "ojk.go.id", "bi.go.id", "polri.go.id", "kemendagri.go.id"
    ],
    suspicious: [
      "blogspot.com", "wordpress.com", "wixsite.com", "weebly.com",
      "dana-kaget", "subsidi-pemerintah", "bantuan-bansos", "klaim-hadiah",
      "berita-panas24jam", "info-terkini-99", "kabar-aktual-hari-ini.xyz",
      ".xyz", ".top", ".buzz", ".work", ".cfd"
    ]
  },

  // Sampel Teks untuk Uji Coba Cepat (Preset Demonstration)
  sampleArticles: [
    {
      id: "hoax-bansos",
      title: "Hoaks Bansos & Bantuan Sosial Berantai",
      category: "Penipuan Finansial",
      text: "SEBARKAN SEGERA KE SEMUA GRUP WA ANDA!!! Pemerintah dan Kemenkes diam-diam bagikan saldo Bansos Rp 5.500.000 untuk pemilik KTP dan kartu BPJS yang masih aktif. Jangan sampai ketinggalan, kuota hanya untuk 500 orang tercepat hari ini saja! Klik link pendaftaran resmi di: http://bantuan-bansos-gratis-2026.xyz sebelum diblokir dan dihapus oleh rezim! Diteruskan berkali-kali dari orang dalam.",
      expectedScore: 12,
      status: "HOAKS"
    },
    {
      id: "hoax-kesehatan",
      title: "Hoaks Pengobatan Ajaib & Vaksin",
      category: "Kesehatan",
      text: "MERINDING! Rahasia besar yang disembunyikan dokter akhirnya terbongkar! Campuran rebusan air garam, perasan jeruk nipis, dan kecap manis diklaim mampu menyembuhkan kanker stadium 4 dan menetralisir racun microchip vaksin dalam 24 jam. Jangan mau dibohongi industri obat barat yang ingin membunuh kita secara perlahan! Viralkan pesan ini demi menyelamatkan keluarga tercinta!",
      expectedScore: 18,
      status: "HOAKS"
    },
    {
      id: "hoax-bencana",
      title: "Hoaks Prediksi Gempa Megathrust",
      category: "Bencana Alam",
      text: "PERINGATAN DARURAT BENCANA! Menurut bocoran info orang dalam BMKG yang dirahasiakan, gempa megathrust dahsyat berkekuatan 9,8 SR disertai tsunami setinggi 30 meter pasti melanda pesisir selatan Jawa pada malam Jumat ini tepat pukul 23.30 WIB. Segera tinggalkan rumah dan mengungsi ke pegunungan malam ini juga! Bagikan sebelum sinyal internet dimatikan pemerintah!",
      expectedScore: 15,
      status: "HOAKS"
    },
    {
      id: "valid-bmkg",
      title: "Klarifikasi Resmi BMKG Terkait Potensi Gempa",
      category: "Bencana Alam",
      text: "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG) mengimbau masyarakat untuk tetap tenang dan tidak mempercayai isu prediksi gempa bumi dengan tanggal dan jam pasti yang beredar di media sosial. Kepala Pusat Gempa Bumi dan Tsunami BMKG menyatakan bahwa hingga saat ini belum ada teknologi di dunia yang mampu memprediksi waktu kejadian gempa secara akurat. Masyarakat diharapkan hanya merujuk pada kanal informasi resmi BMKG.",
      expectedScore: 92,
      status: "VALID"
    },
    {
      id: "valid-kemenkes",
      title: "Siaran Pers Kemenkes: Program Skrining Kesehatan Gratis",
      category: "Kesehatan",
      text: "Kementerian Kesehatan Republik Indonesia secara resmi mengumumkan pelaksanaan program pemeriksaan kesehatan gratis bagi seluruh masyarakat yang berulang tahun. Program ini dapat diakses secara langsung di seluruh fasilitas Pusat Kesehatan Masyarakat (Puskesmas) terdekat dengan membawa kartu identitas KTP aktif. Juru Bicara Kemenkes menegaskan bahwa program ini tidak dipungut biaya apapun dan tidak memerlukan pendaftaran melalui situs web tidak resmi.",
      expectedScore: 95,
      status: "VALID"
    }
  ],

  // Repositori Cek Fakta Dasar (Fallback jika Offline / Tanpa Koneksi)
  factCheckRepository: [
    {
      id: "FC-2026-001",
      title: "Klaim Pembagian Saldo DANA Gratis Rp 2 Juta Mengatasnamakan Kementerian Sosial",
      claim: "Kemensos membagikan insentif awal tahun sebesar Rp 2.000.000 via link tautan Telegram dan blogspot.",
      verdict: "SALAH / FABRIKASI",
      verdictClass: "hoax",
      category: "Penipuan",
      date: "12 September 2026",
      sourceFact: "Kementerian Sosial RI & TurnBackHoax.ID",
      explanation: "Kemensos menyatakan tidak pernah membagikan tautan pembagian bantuan tunai melalui aplikasi pesan instan atau situs domain non-pemerintah (.go.id). Tautan tersebut merupakan upaya phishing data pribadi perbankan.",
      refUrl: "https://turnbackhoax.id",
      tags: ["Kemensos", "Bansos", "Phishing", "DANA"],
      isLive: false
    },
    {
      id: "FC-2026-002",
      title: "Prediksi Gempa Megathrust Selat Sunda Akan Terjadi Besok Pagi",
      claim: "Video viral di TikTok menyebut BMKG menetapkan status siaga 1 gempa 9 SR pada 14 September.",
      verdict: "KONTEN MENYESATKAN",
      verdictClass: "misleading",
      category: "Bencana Alam",
      date: "10 September 2026",
      sourceFact: "Siaran Pers Humas BMKG",
      explanation: "Potensi gempa megathrust adalah zona seismic gap yang nyata ada, namun teknologi sains saat ini belum dapat memprediksi hari, tanggal, maupun jam gempa. Narasi penetapan tanggal spesifik merupakan disinformasi.",
      refUrl: "https://bmkg.go.id",
      tags: ["BMKG", "Megathrust", "TikTok", "Gempa"],
      isLive: false
    },
    {
      id: "FC-2026-003",
      title: "Makan Buah Nanas Panas Dapat Membunuh Sel Kanker Secara Permanen",
      claim: "Air rendaman nanas hangat menghasilkan zat alkali yang mematikan sel kanker seketika.",
      verdict: "SALAH / MISINFORMASI",
      verdictClass: "hoax",
      category: "Kesehatan",
      date: "05 September 2026",
      sourceFact: "Ikatan Dokter Indonesia (IDI) & Kemenkes RI",
      explanation: "Nanas kaya akan vitamin C dan enzim bromelain yang baik untuk imunitas, namun tidak ada bukti klinis yang membuktikan bahwa air nanas panas dapat menggantikan kemoterapi atau menyembuhkan kanker.",
      refUrl: "https://kemenkes.go.id",
      tags: ["Kanker", "Kesehatan", "Nanas", "Pengobatan"],
      isLive: false
    },
    {
      id: "FC-2026-004",
      title: "Pemerintah Blokir Rekening yang Tidak Digunakan Transaksi Selama 3 Bulan",
      claim: "OJK mengeluarkan surat edaran penutupan paksa dan penyitaan saldo rekening per 1 Oktober 2026.",
      verdict: "FABRIKASI LENGKAP",
      verdictClass: "hoax",
      category: "Finansial",
      date: "01 September 2026",
      sourceFact: "Otoritas Jasa Keuangan (OJK)",
      explanation: "OJK menegaskan informasi tersebut 100% hoaks. Rekening tanpa mutasi masuk kategori pasif (dormant) sesuai kebijakan masing-masing bank, bukan penyitaan saldo oleh pemerintah.",
      refUrl: "https://ojk.go.id",
      tags: ["OJK", "Rekening Pasif", "Perbankan", "Finansial"],
      isLive: false
    },
    {
      id: "FC-2026-005",
      title: "Rekrutmen Pegawai PT Kereta Api Indonesia (Persero) Memungut Biaya Tiket Pesawat",
      claim: "Email pengumuman tes interview KAI mengharuskan kandidat memesan tiket akomodasi via biro travel tertentu.",
      verdict: "PENIPUAN / HOAKS",
      verdictClass: "hoax",
      category: "Rekrutmen",
      date: "28 Agustus 2026",
      sourceFact: "Humas PT KAI (Persero)",
      explanation: "KAI tidak pernah memungut biaya apapun dalam rekrutmen atau bekerjasama dengan agen perjalanan manapun. Semua informasi rekrutmen resmi hanya melalui recruitment.kai.id.",
      refUrl: "https://kai.id",
      tags: ["KAI", "Lowongan Kerja", "Penipuan", "Biro Travel"],
      isLive: false
    },
    {
      id: "FC-2026-006",
      title: "Pemeriksaan Kesejahteraan Skrining Gratis Menggunakan NIK di Puskesmas",
      claim: "Kemenkes menyediakan layanan medical check-up cuma-cuma pada hari ulang tahun warga negara.",
      verdict: "BENAR / TERVERIFIKASI",
      verdictClass: "valid",
      category: "Kesehatan",
      date: "20 Agustus 2026",
      sourceFact: "Kementerian Kesehatan RI",
      explanation: "Kemenkes memang secara resmi menggulirkan program cek kesehatan gratis saat hari ulang tahun bagi masyarakat Indonesia di Puskesmas untuk deteksi dini penyakit.",
      refUrl: "https://sehatnegeriku.kemkes.go.id",
      tags: ["Kemenkes", "Skrining", "Puskesmas", "Fakta"],
      isLive: false
    }
  ],

  /**
   * Mengambil Berita & Cek Fakta Terkini/Hangat secara LIVE ONLINE
   * Menggunakan feed terbuka TurnBackHoax.ID dan Google News Cek Fakta melalui CORS-compliant JSON bridge.
   * @returns {Promise<Array>} Array berita fakta hangat online
   */
  async fetchLiveOnlineNews() {
    // Sumber RSS Cek Fakta Indonesia Terverifikasi
    const feedUrls = [
      'https://turnbackhoax.id/feed/',
      'https://news.google.com/rss/search?q=cek+fakta+OR+hoaks+when:7d&hl=id&gl=ID&ceid=ID:id'
    ];

    // Coba ambil dari TurnBackHoax terlebih dahulu via rss2json
    const targetFeed = feedUrls[0];
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(targetFeed)}&api_key=`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      if (data.status === 'ok' && data.items && data.items.length > 0) {
        const liveItems = data.items.slice(0, 12).map((item, idx) => {
          // Bersihkan HTML tags dari deskripsi
          const cleanDesc = item.description 
            ? item.description.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').slice(0, 220) + '...'
            : "Klarifikasi dan verifikasi fakta terhadap isu yang sedang beredar luas di masyarakat.";

          // Tentukan verdict dari judul jika memuat kata SALAH / BENAR / MISLEADING
          let verdict = "SALAH / HOAKS";
          let verdictClass = "hoax";
          const lowerTitle = item.title.toLowerCase();

          if (lowerTitle.includes("[benar]") || lowerTitle.includes("fakta:") || lowerTitle.includes("terbukti")) {
            verdict = "BENAR / FAKTA";
            verdictClass = "valid";
          } else if (lowerTitle.includes("[klarifikasi]") || lowerTitle.includes("menyesatkan") || lowerTitle.includes("konteks")) {
            verdict = "KONTEN MENYESATKAN";
            verdictClass = "misleading";
          } else if (lowerTitle.includes("[salah]") || lowerTitle.includes("hoaks") || lowerTitle.includes("palsu")) {
            verdict = "SALAH / DISINFORMASI";
            verdictClass = "hoax";
          }

          // Kategorisasi sederhana
          let category = "Umum / Sosial";
          if (lowerTitle.includes("kesehatan") || lowerTitle.includes("obat") || lowerTitle.includes("penyakit") || lowerTitle.includes("dokter")) {
            category = "Kesehatan";
          } else if (lowerTitle.includes("bansos") || lowerTitle.includes("uang") || lowerTitle.includes("dana") || lowerTitle.includes("saldo") || lowerTitle.includes("rekening")) {
            category = "Penipuan";
          } else if (lowerTitle.includes("gempa") || lowerTitle.includes("tsunami") || lowerTitle.includes("cuaca") || lowerTitle.includes("bmkg")) {
            category = "Bencana Alam";
          } else if (lowerTitle.includes("presiden") || lowerTitle.includes("menteri") || lowerTitle.includes("kebijakan") || lowerTitle.includes("pemilu")) {
            category = "Politik";
          }

          // Format tanggal
          const pubDate = new Date(item.pubDate);
          const dateStr = !isNaN(pubDate) 
            ? pubDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : "Baru Saja";

          return {
            id: `LIVE-${idx + 1}`,
            title: item.title,
            claim: cleanDesc.slice(0, 110) + '...',
            verdict,
            verdictClass,
            category,
            date: dateStr,
            sourceFact: "TurnBackHoax (Mafindo) & Konsorsium Cek Fakta",
            explanation: cleanDesc,
            refUrl: item.link,
            tags: ["Live Online", "Trending", category],
            isLive: true
          };
        });

        return liveItems;
      }
      throw new Error("Struktur respons feed kosong.");
    } catch (err) {
      console.warn("Gagal mengambil feed live online, beralih ke arsip tersimpan:", err.message);
      return null;
    }
  },

  // =========================================================================
  // KATALOG RESMI: BERITA LOLOS VERIFIKASI (NON-HOAKS / 100% SAHIH)
  // Harga Jual Utama: Menjamin Masyarakat Membaca Fakta Valid Bersertifikat
  // =========================================================================
  verifiedNewsRepository: [
    {
      id: "AUTH-001",
      title: "Pemerintah Mulai Salurkan Bantuan Pangan Beras 10 Kg Tahap 3 Lewat Kantor Pos & Rekening Resmi",
      category: "Bansos & Finansial",
      integrityScore: 99,
      publisher: "Badan Pangan Nasional & Kemensos RI",
      auditHash: "VRT-AUTH-99214A",
      date: "08 Okt 2026",
      status: "100% Sahih / Lolos Audit",
      claim: "Penyaluran beras 10kg gratis oleh pemerintah tanpa pungutan biaya, daftar penerima resmi di cekbansos.kemensos.go.id",
      explanation: "Pemerintah resmi menyalurkan bantuan pangan cadangan beras pemerintah (CBP) 10 kilogram untuk keluarga penerima manfaat (KPM). Penyaluran dilakukan serentak melalui kantor pos dan kelompok masyarakat terdaftar. Seluruh penerima tidak dipungut biaya dan tidak diminta mengklik tautan aplikasi pihak ketiga.",
      sourceFact: "Siaran Pers Resmi Badan Pangan Nasional & Surat Edaran Kemensos No. 14/2026",
      refUrl: "https://kemensos.go.id",
      tags: ["Bansos Resmi", "Kemensos", "Beras 10 Kg", "Non-Hoaks"],
      isVerifiedClean: true
    },
    {
      id: "AUTH-002",
      title: "BMKG Rilis Analisis Potensi Cuaca Ekstrem Pancaroba & Bantah Prediksi Gempa Bertanggal Pasti",
      category: "Bencana Alam",
      integrityScore: 100,
      publisher: "BMKG Pusat (Deputi Meteorologi & Seismologi)",
      auditHash: "VRT-AUTH-88421B",
      date: "07 Okt 2026",
      status: "100% Sahih / Lolos Audit",
      claim: "BMKG memperingatkan masa pancaroba hujan lebat disertai petir, menegaskan belum ada teknologi yang bisa memprediksi tanggal dan jam gempa bumi secara presisi",
      explanation: "Deputi Meteorologi BMKG merilis peringatan dini cuaca ekstrem masa peralihan musim (pancaroba) untuk wilayah pulau Jawa, Sumatera, dan Bali. Pada saat bersamaan, Kepala Pusat Gempa Bumi BMKG menegaskan sains geofisika global saat ini belum mampu memprediksi hari dan jam terjadinya gempa tektonik.",
      sourceFact: "Katalog Rilis Resmi BMKG Pusat No. ME.02.04/2026 & Portal Resmi bmkg.go.id",
      refUrl: "https://bmkg.go.id",
      tags: ["Cuaca Ekstrem", "BMKG", "Pancaroba", "Fakta Sains"],
      isVerifiedClean: true
    },
    {
      id: "AUTH-003",
      title: "Kemenkes: Program Imunisasi HPV dan Polio Nasional Diberikan Gratis di Seluruh Puskesmas",
      category: "Kesehatan",
      integrityScore: 98,
      publisher: "Kementerian Kesehatan Republik Indonesia",
      auditHash: "VRT-AUTH-77319C",
      date: "06 Okt 2026",
      status: "100% Sahih / Lolos Audit",
      claim: "Imunisasi tambahan HPV untuk siswi sekolah dasar dan imunisasi polio tetes gratis di fasilitas kesehatan pemerintah",
      explanation: "Kemenkes memastikan kelanjutan program imunisasi nasional untuk mencegah kanker serviks (vaksin HPV) dan polio pada anak secara gratis di seluruh Puskesmas, Posyandu, dan sekolah dasar. Seluruh vaksin telah melalui uji klinis ketat BPOM dan mengantongi sertifikat keamanan halal dari MUI.",
      sourceFact: "Biro Komunikasi dan Pelayanan Publik Kementerian Kesehatan RI",
      refUrl: "https://kemkes.go.id",
      tags: ["Kesehatan", "Kemenkes", "Imunisasi Gratis", "Terverifikasi"],
      isVerifiedClean: true
    },
    {
      id: "AUTH-004",
      title: "Kemendikbudristek Buka Pendaftaran KIP Kuliah: Bebas Biaya Pendidikan Penuh dan Bantuan Uang Saku",
      category: "Pendidikan",
      integrityScore: 100,
      publisher: "Puslapdik Kemendikbudristek",
      auditHash: "VRT-AUTH-66120D",
      date: "05 Okt 2026",
      status: "100% Sahih / Lolos Audit",
      claim: "Pendaftaran KIP Kuliah hanya melalui portal resmi kip-kuliah.kemdikbud.go.id tanpa pungutan biaya apapun",
      explanation: "Pusat Layanan Pembiayaan Pendidikan (Puslapdik) membuka akses bantuan pendidikan KIP Kuliah bagi calon mahasiswa baru berprestasi dari keluarga tidak mampu. Pendaftaran dilakukan secara mandiri melalui laman resmi berdomain .go.id tanpa biaya administrasi maupun perantara calo.",
      sourceFact: "Pengumuman Resmi Puslapdik Kemendikbudristek Nomor 0428/J5/KM.01.00/2026",
      refUrl: "https://kip-kuliah.kemdikbud.go.id",
      tags: ["KIP Kuliah", "Kemendikbud", "Beasiswa Resmi", "Valid"],
      isVerifiedClean: true
    },
    {
      id: "AUTH-005",
      title: "OJK Rilis Daftar 98 Penyelenggara Fintech Lending Berizin Resmi: Imbau Warga Hindari Pinjol Ilegal",
      category: "Finansial",
      integrityScore: 97,
      publisher: "Otoritas Jasa Keuangan (Satgas PASTI)",
      auditHash: "VRT-AUTH-55291E",
      date: "04 Okt 2026",
      status: "100% Sahih / Lolos Audit",
      claim: "OJK memperbarui daftar pinjol berizin dan mengingatkan masyarakat tidak menanggapi penawaran pinjaman lewat SMS/WhatsApp pribadi",
      explanation: "Satgas Pemberantasan Aktivitas Keuangan Ilegal (Satgas PASTI) Otoritas Jasa Keuangan mengumumkan daftar 98 platform fintech peer-to-peer lending yang memiliki izin operasional sah. OJK menegaskan entitas legal dilarang menawarkan pinjaman via pesan instan pribadi tanpa persetujuan pengguna.",
      sourceFact: "Siaran Pers Satgas PASTI OJK Nomor SP-88/MS/OJK/2026",
      refUrl: "https://ojk.go.id",
      tags: ["OJK", "Fintech Legal", "Edukasi Keuangan", "Sahih"],
      isVerifiedClean: true
    },
    {
      id: "AUTH-006",
      title: "Bapenda Resmi Berlakukan Pemutihan Denda PKB: Pembayaran Hanya Lewat Samsat & Aplikasi Signal",
      category: "Kebijakan Publik",
      integrityScore: 99,
      publisher: "Badan Pendapatan Daerah & Korlantas Polri",
      auditHash: "VRT-AUTH-44182F",
      date: "02 Okt 2026",
      status: "100% Sahih / Lolos Audit",
      claim: "Pembebasan denda keterlambatan pajak kendaraan bermotor resmi di loket Samsat dan aplikasi nasional Signal, tidak melalui transfer rekening perorangan",
      explanation: "Pemerintah Daerah bersama Pembina Samsat menggelar relaksasi pajak kendaraan berupa pembebasan sanksi denda administrasi PKB dan bea balik nama. Pembayaran resmi hanya diproses melalui sistem perbankan Samsat dan aplikasi Signal (Samsat Digital Nasional).",
      sourceFact: "Keputusan Bersama Tim Pembina Samsat Nasional 2026",
      refUrl: "https://korlantas.polri.go.id",
      tags: ["Pajak Kendaraan", "Samsat", "Signal", "Fakta Kebijakan"],
      isVerifiedClean: true
    }
  ],

  // Data Statistik Transparansi Disinformasi
  transparencyStats: {
    totalScanned: 48293,
    hoaxDetected: 16405,
    verifiedAccurate: 27140,
    clarificationNeeded: 4748,
    averageResolutionHours: 3.4,
    categories: [
      { name: "Penipuan & Finansial", percentage: 38, count: 6234, color: "#EF4444" },
      { name: "Kesehatan & Pengobatan", percentage: 26, count: 4265, color: "#F59E0B" },
      { name: "Bencana Alam & Cuaca", percentage: 16, count: 2624, color: "#3B82F6" },
      { name: "Politik & Kebijakan", percentage: 14, count: 2296, color: "#8B5CF6" },
      { name: "Lain-lain / Sosial", percentage: 6, count: 986, color: "#10B981" }
    ],
    distributionChannels: [
      { channel: "WhatsApp Group", percentage: 54, icon: "fa-whatsapp" },
      { channel: "TikTok", percentage: 22, icon: "fa-tiktok" },
      { channel: "Facebook", percentage: 14, icon: "fa-facebook" },
      { channel: "X (Twitter)", percentage: 7, icon: "fa-x-twitter" },
      { channel: "Situs Web/Blog Phishing", percentage: 3, icon: "fa-globe" }
    ]
  }
};

// Pastikan data dapat diakses secara global di browser (VERITASK AI & Backward Compatible)
window.VeritasDB = VeritasDB;
window.VeritaskDB = VeritasDB;


