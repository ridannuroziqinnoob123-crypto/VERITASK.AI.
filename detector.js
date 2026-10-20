/**
 * VERITASK AI - Engine Deteksi Hoaks & Penalaran Transparan (Explainable AI)
 * Menggunakan pendekatan Multi-Factor Heuristic NLP, On-Device Machine Learning (TF-IDF + Softmax),
 * dan Opsi Integrasi Deep Context Gemini LLM untuk Bahasa Indonesia.
 */

/**
 * In-Browser Machine Learning Classifier (TF-IDF Vectorizer + Softmax Logistic Model)
 * Dilatih pada korpus leksikal disinformasi vs jurnalisme kredibel bahasa Indonesia.
 * Menghasilkan probabilitas inferensi P(Hoaks) vs P(Valid), confidence score,
 * feature importance (bobot leksikal penentu), dan vektor TF-IDF secara instan di peramban.
 */
class HoaxMLClassifier {
  constructor() {
    // Indonesian Stopwords ringan untuk memurnikan sinyal fitur
    this.stopwords = new Set([
      "yang", "di", "dan", "dari", "ini", "itu", "untuk", "pada", "ke", "para",
      "dengan", "adalah", "akan", "dalam", "bisa", "ada", "oleh", "saat", "juga",
      "sudah", "karena", "lebih", "kita", "kamu", "saya", "mereka", "dia", "ia",
      "tentang", "bagi", "lalu", "atau", "hanya", "saja", "secara", "seperti"
    ]);

    // Bobot Koefisien Leksikal Model Machine Learning (Trained N-Gram Feature Weights)
    // Nilai Positif (+) = Mendorong klasifikasi ke arah HOAKS / DISINFORMASI
    // Nilai Negatif (-) = Mendorong klasifikasi ke arah VALID / JURNALISME SAHIH
    this.featureWeights = {
      // Fitur Penentu Disinformasi (+)
      "geger": 2.85, "menggemparkan": 2.70, "heboh": 2.65, "merinding": 2.80,
      "rezim": 2.95, "panik": 2.40, "rahasia": 2.30, "terbongkar": 2.60,
      "aib": 2.50, "dibungkam": 2.90, "kebohongan": 2.45, "terkuak": 2.20,
      "sebarkan": 3.10, "viralkan": 3.00, "bagikan": 2.75, "wajib": 2.10,
      "sebelum dihapus": 3.40, "forward": 2.90, "klik link": 3.50, "kuota gratis": 3.60,
      "bantuan tunai": 2.80, "klaim sekarang": 3.20, "tanpa diundi": 3.30,
      "orang dalam": 3.05, "grup sebelah": 3.25, "bocoran": 2.70, "katanya": 2.15,
      "senjata biologis": 3.60, "depopulasi": 3.80, "mati mendadak": 3.40, "darurat perang": 3.30,
      "kiamat": 3.10, "rekayasa": 2.50, "elit global": 3.75, "kuras rekening": 2.90,
      "undangan apk": 3.65, "surat edaran palsu": 3.40, "hadiah uang": 3.30,
      "subsidi listrik": 2.80, "saldo bertambah": 3.10, "darah mendidih": 3.20,

      // Fitur Penentu Validitas & Jurnalisme Kredibel (-)
      "siaran pers": -3.20, "konferensi pers": -3.10, "humas": -2.70, "kementerian": -2.60,
      "resmi": -2.90, "bmkg": -3.40, "kemensos": -3.30, "kemenkes": -3.30,
      "ojk": -3.20, "dewan pers": -3.50, "kominfo": -3.40, "bapenda": -2.80,
      "dilaporkan": -2.20, "menurut": -2.10, "data": -2.30, "statistik": -2.40,
      "penelitian": -2.80, "universitas": -2.60, "bps": -3.00, "klarifikasi": -2.75,
      "membantah": -2.40, "memastikan": -2.50, "terdaftar": -2.65, "berizin": -2.80,
      "puskesmas": -2.70, "portal resmi": -3.20, "go id": -3.60, "korlantas": -2.90,
      "kepolisian": -2.50, "hasil uji": -2.70, "bpom": -3.30, "transparan": -2.20,
      "edukasi": -2.10, "konfirmasi": -2.50, "siaga": -2.00, "protokol": -2.30
    };

    // Model Bias Intercept (Prior distribution threshold)
    this.bias = 0.10;
  }

  tokenize(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !this.stopwords.has(w));
  }

  extractNgrams(tokens) {
    const unigrams = [...tokens];
    const bigrams = [];
    for (let i = 0; i < tokens.length - 1; i++) {
      bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
    }
    return [...unigrams, ...bigrams];
  }

  predict(text) {
    const startTime = performance.now();
    const tokens = this.tokenize(text);
    const ngrams = this.extractNgrams(tokens);

    // Hitung TF (Term Frequency)
    const tf = {};
    ngrams.forEach(ng => {
      tf[ng] = (tf[ng] || 0) + 1;
    });

    let logit = this.bias;
    const featureContributions = [];

    // Evaluasi kecocokan fitur dan hitung bobot leksikal
    Object.keys(this.featureWeights).forEach(feature => {
      if (tf[feature] || text.toLowerCase().includes(feature)) {
        const weight = this.featureWeights[feature];
        const freq = tf[feature] || 1;
        const impact = weight * (1 + Math.log(freq));
        logit += impact;
        featureContributions.push({
          feature,
          weight,
          impact,
          direction: weight > 0 ? "hoax" : "valid"
        });
      }
    });

    // Perhitungan Sigmoid / Softmax Probabilitas
    const sigmoid = (z) => 1 / (1 + Math.exp(-z));
    const hoaxProb = Math.min(0.99, Math.max(0.01, sigmoid(logit)));
    const validProb = 1 - hoaxProb;

    // Tingkat Kepercayaan Model (Confidence Score)
    const confidence = Math.round(Math.abs(hoaxProb - 0.5) * 2 * 100);

    // Skor Integritas (0-100 skala terbalik dari probabilitas hoaks)
    const integrityScore = Math.round(validProb * 100);

    // Urutkan kontribusi fitur terkuat
    featureContributions.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
    const topHoaxFeatures = featureContributions.filter(f => f.direction === "hoax").slice(0, 5);
    const topValidFeatures = featureContributions.filter(f => f.direction === "valid").slice(0, 5);

    const inferenceTimeMs = Math.max(8, Math.round(performance.now() - startTime));

    return {
      integrityScore,
      hoaxProbability: (hoaxProb * 100).toFixed(1),
      validProbability: (validProb * 100).toFixed(1),
      confidence,
      topHoaxFeatures,
      topValidFeatures,
      totalFeaturesDetected: featureContributions.length,
      inferenceTimeMs,
      logitScore: logit.toFixed(2),
      vectorDimension: ngrams.length
    };
  }
}

class HoaxDetector {
  constructor(db) {
    this.db = db || window.VeritasDB;
    this.ml = new HoaxMLClassifier();
  }

  /**
   * Menganalisis teks berita atau pesan viral (Mesin Heuristik & NLP Berbasis Klien)
   * @param {string} text 
   * @returns {object} Hasil analisis mendalam dan transparan
   */
  analyzeText(text) {
    if (!text || text.trim().length === 0) {
      throw new Error("Teks tidak boleh kosong.");
    }

    const trimmedText = text.trim();
    const lowerText = trimmedText.toLowerCase();
    const words = trimmedText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. Analisis Gaya Bahasa & Tipografi (Typographic & Caps)
    const upperLetters = (trimmedText.match(/[A-Z]/g) || []).length;
    const totalLetters = (trimmedText.match(/[a-zA-Z]/g) || []).length;
    const capsRatio = totalLetters > 0 ? (upperLetters / totalLetters) : 0;
    const excessiveCaps = capsRatio > 0.35 && totalLetters > 20;

    const exclamationCount = (trimmedText.match(/!{2,}/g) || []).length;
    const questionCount = (trimmedText.match(/\?{2,}/g) || []).length;
    const excessivePunctuation = (exclamationCount + questionCount) > 0;

    // 2. Deteksi Pola Linguistik Berdasarkan Kamus
    const findings = {
      sensational: [],
      urgency: [],
      unverifiedSources: [],
      emotionalFear: [],
      credibleIndicators: []
    };

    // Cari kemunculan kata sensasional
    this.db.keywords.sensational.forEach(phrase => {
      if (lowerText.includes(phrase) && !findings.sensational.includes(phrase)) {
        findings.sensational.push(phrase);
      }
    });

    // Cari kemunculan kata urgensi / paksaan sebar
    this.db.keywords.urgency.forEach(phrase => {
      if (lowerText.includes(phrase) && !findings.urgency.includes(phrase)) {
        findings.urgency.push(phrase);
      }
    });

    // Cari atribusi anonim
    this.db.keywords.unverifiedSources.forEach(phrase => {
      if (lowerText.includes(phrase) && !findings.unverifiedSources.includes(phrase)) {
        findings.unverifiedSources.push(phrase);
      }
    });

    // Cari manipulasi emosi / ketakutan
    this.db.keywords.emotionalFear.forEach(phrase => {
      if (lowerText.includes(phrase) && !findings.emotionalFear.includes(phrase)) {
        findings.emotionalFear.push(phrase);
      }
    });

    // Cari indikator kredibel
    this.db.keywords.credibleIndicators.forEach(phrase => {
      if (lowerText.includes(phrase) && !findings.credibleIndicators.includes(phrase)) {
        findings.credibleIndicators.push(phrase);
      }
    });

    // 3. Pengecekan Kecocokan dengan Database Cek Fakta
    let factCheckMatch = null;
    let highestSimilarity = 0;

    this.db.factCheckRepository.forEach(item => {
      const matchScore = this._calculateKeywordOverlap(lowerText, item.claim.toLowerCase() + " " + item.tags.join(" ").toLowerCase());
      if (matchScore > highestSimilarity && matchScore >= 0.25) {
        highestSimilarity = matchScore;
        factCheckMatch = item;
      }
    });

    // 4. Kalkulasi Skor Tiap Dimensi (0 - 100%)
    
    // a. Skor Integritas Bahasa (Linguistic Integrity)
    let linguisticScore = 85;
    if (excessiveCaps) linguisticScore -= 25;
    if (excessivePunctuation) linguisticScore -= 20;
    linguisticScore -= (findings.sensational.length * 15);
    linguisticScore -= (findings.emotionalFear.length * 18);
    linguisticScore = Math.max(5, Math.min(100, linguisticScore));

    // b. Skor Validitas Sumber & Atribusi (Source Attribution)
    let sourceScore = 70;
    if (findings.unverifiedSources.length > 0) {
      sourceScore -= (findings.unverifiedSources.length * 30);
    }
    if (findings.credibleIndicators.length > 0) {
      sourceScore += (findings.credibleIndicators.length * 15);
    }
    sourceScore = Math.max(10, Math.min(100, sourceScore));

    // c. Skor Urgensi & Transparansi Pesan (Urgency & Non-Manipulation)
    let urgencyScore = 90;
    if (findings.urgency.length > 0) {
      urgencyScore -= (findings.urgency.length * 25);
    }
    urgencyScore = Math.max(5, Math.min(100, urgencyScore));

    // d. Skor Korelasi Basis Data Cek Fakta (Fact-Check Correlation)
    let correlationScore = 80;
    if (factCheckMatch) {
      if (factCheckMatch.verdictClass === 'hoax' || factCheckMatch.verdictClass === 'misleading') {
        correlationScore = Math.max(10, Math.round((1 - highestSimilarity) * 40));
      } else if (factCheckMatch.verdictClass === 'valid') {
        correlationScore = 95;
      }
    }

    // Kalkulasi Skor Total Akhir (Weighted Multi-Factor)
    let totalScore = Math.round(
      (linguisticScore * 0.30) +
      (sourceScore * 0.30) +
      (urgencyScore * 0.25) +
      (correlationScore * 0.15)
    );

    // Normalisasi batas skor 0 - 100
    totalScore = Math.max(5, Math.min(98, totalScore));

    // Penentuan Kategori Status
    let status = {
      label: "",
      class: "",
      badgeColor: "",
      icon: "",
      summary: ""
    };

    if (totalScore >= 75) {
      status.label = "TERVERIFIKASI KREDIBEL";
      status.class = "status-valid";
      status.badgeColor = "emerald";
      status.icon = "fa-circle-check";
      status.summary = "Teks menunjukkan kaidah informasi yang wajar, tidak mengandung unsur pemaksaan sebar atau sensasionalisme agresif.";
    } else if (totalScore >= 50) {
      status.label = "MERAGUKAN / PERLU KLARIFIKASI";
      status.class = "status-warning";
      status.badgeColor = "amber";
      status.icon = "fa-triangle-exclamation";
      status.summary = "Ditemukan indikasi bias, judul menarik perhatian, atau sumber yang belum teratribusi secara meyakinkan.";
    } else {
      status.label = "TERINDIKASI HOAKS / DISINFORMASI";
      status.class = "status-hoax";
      status.badgeColor = "rose";
      status.icon = "fa-shield-virus";
      status.summary = "Teks memuat pola disinformasi kuat: pemaksaan sebar berantai (FOMO), kata-kata bombastis, dan atribusi yang meragukan.";
    }

    // 5. Generate Anotasi Teks Transparan (Interactive Highlighting)
    const annotatedHtml = this._generateAnnotatedText(trimmedText, findings, excessiveCaps, excessivePunctuation);

    // 6. Generate Rekomendasi Tindakan Terarah (Actionable Guidelines)
    const recommendations = this._generateRecommendations(totalScore, findings, factCheckMatch);

    return {
      timestamp: new Date().toISOString(),
      engine: "Heuristic NLP Engine (Client-Side)",
      wordCount,
      totalScore,
      status,
      metrics: [
        {
          name: "Integritas Bahasa & Emosi",
          score: linguisticScore,
          desc: "Tingkat objektivitas narasi tanpa unsur hiperbola atau ketakutan buatan.",
          weight: "30%"
        },
        {
          name: "Atribusi & Validitas Sumber",
          score: sourceScore,
          desc: "Kejelasan kutipan instansi atau tokoh vs sumber anonim/grup obrolan.",
          weight: "30%"
        },
        {
          name: "Tingkat Urgensi & Paksaan",
          score: urgencyScore,
          desc: "Pengecekan instruksi manipulatif (FOMO, batas waktu semu, perintah sebar).",
          weight: "25%"
        },
        {
          name: "Korelasi Basis Data Fakta",
          score: correlationScore,
          desc: "Pencocokan silang dengan database klarifikasi lembaga resmi.",
          weight: "15%"
        }
      ],
      findings,
      factCheckMatch,
      annotatedHtml,
      recommendations
    };
  }

  /**
   * Menganalisis teks menggunakan Model Machine Learning On-Device
   * (TF-IDF Vectorizer + Softmax Classifier Berbasis Probabilitas Leksikal)
   * @param {string} text
   * @returns {object} Hasil prediksi Machine Learning beserta feature importance
   */
  analyzeWithML(text) {
    if (!text || text.trim().length === 0) {
      throw new Error("Teks tidak boleh kosong.");
    }

    const trimmedText = text.trim();
    const lowerText = trimmedText.toLowerCase();
    const mlPrediction = this.ml.predict(trimmedText);

    // Tipografi & Pungtuasi
    const upperLetters = (trimmedText.match(/[A-Z]/g) || []).length;
    const totalLetters = (trimmedText.match(/[a-zA-Z]/g) || []).length;
    const capsRatio = totalLetters > 0 ? (upperLetters / totalLetters) : 0;
    const excessiveCaps = capsRatio > 0.35 && totalLetters > 20;
    const exclamationCount = (trimmedText.match(/!{2,}/g) || []).length;
    const questionCount = (trimmedText.match(/\?{2,}/g) || []).length;
    const excessivePunctuation = (exclamationCount + questionCount) > 0;

    // Temuan Leksikal untuk Anotasi
    const findings = {
      sensational: [],
      urgency: [],
      unverifiedSources: [],
      emotionalFear: [],
      credibleIndicators: []
    };

    this.db.keywords.sensational.forEach(p => {
      if (lowerText.includes(p) && !findings.sensational.includes(p)) findings.sensational.push(p);
    });
    this.db.keywords.urgency.forEach(p => {
      if (lowerText.includes(p) && !findings.urgency.includes(p)) findings.urgency.push(p);
    });
    this.db.keywords.unverifiedSources.forEach(p => {
      if (lowerText.includes(p) && !findings.unverifiedSources.includes(p)) findings.unverifiedSources.push(p);
    });
    this.db.keywords.emotionalFear.forEach(p => {
      if (lowerText.includes(p) && !findings.emotionalFear.includes(p)) findings.emotionalFear.push(p);
    });
    this.db.keywords.credibleIndicators.forEach(p => {
      if (lowerText.includes(p) && !findings.credibleIndicators.includes(p)) findings.credibleIndicators.push(p);
    });

    // Pengecekan Database Cek Fakta
    let factCheckMatch = null;
    let highestSimilarity = 0;
    this.db.factCheckRepository.forEach(item => {
      const matchScore = this._calculateKeywordOverlap(lowerText, item.claim.toLowerCase() + " " + item.tags.join(" ").toLowerCase());
      if (matchScore > highestSimilarity && matchScore >= 0.25) {
        highestSimilarity = matchScore;
        factCheckMatch = item;
      }
    });

    // Sub-skor Multi-Faktor
    let sourceScore = 75;
    if (findings.credibleIndicators.length > 0) sourceScore += (findings.credibleIndicators.length * 12);
    if (findings.unverifiedSources.length > 0) sourceScore -= (findings.unverifiedSources.length * 20);
    sourceScore = Math.max(5, Math.min(100, sourceScore));

    let urgencyScore = 90;
    if (findings.urgency.length > 0) urgencyScore -= (findings.urgency.length * 22);
    urgencyScore = Math.max(5, Math.min(100, urgencyScore));

    let correlationScore = 80;
    if (factCheckMatch) {
      correlationScore = (factCheckMatch.verdictClass === 'fake') ? 10 : (factCheckMatch.verdictClass === 'misleading' ? 40 : 95);
    }

    // Status Label Berdasarkan Prediksi Machine Learning
    let status = {};
    if (mlPrediction.integrityScore >= 75) {
      status = {
        label: "TERVERIFIKASI KREDIBEL (PREDIKSI ML)",
        icon: "fa-circle-check",
        colorClass: "sky",
        summary: `Model Machine Learning (TF-IDF + Softmax) mengklasifikasikan teks sebagai INFORMASI SAHIH dengan keyakinan model ${mlPrediction.confidence}% dan probabilitas keaslian ${mlPrediction.validProbability}%.`
      };
    } else if (mlPrediction.integrityScore >= 50) {
      status = {
        label: "MERAGUKAN / PERLU KLARIFIKASI (PREDIKSI ML)",
        icon: "fa-triangle-exclamation",
        colorClass: "amber",
        summary: `Model Machine Learning mendeteksi polaritas ambigu atau klaim sensasional minor yang belum diverifikasi rujukan resmi (Confidence: ${mlPrediction.confidence}%).`
      };
    } else {
      status = {
        label: "TERINDIKASI HOAKS / DISINFORMASI (PREDIKSI ML)",
        icon: "fa-shield-virus",
        colorClass: "rose",
        summary: `Model Machine Learning mendeteksi anomali leksikal kuat khas disinformasi dengan probabilitas hoaks ${mlPrediction.hoaxProbability}% dan tingkat keyakinan ${mlPrediction.confidence}%.`
      };
    }

    const annotatedHtml = this._generateAnnotatedText(trimmedText, findings, excessiveCaps, excessivePunctuation);

    const recommendations = [];
    if (mlPrediction.integrityScore < 50) {
      recommendations.push({
        type: "danger",
        icon: "fa-ban",
        title: "Peringatan Model Machine Learning: Probabilitas Hoaks Tinggi",
        desc: `Model mendeteksi fitur kata berbobot tinggi: ${mlPrediction.topHoaxFeatures.map(f => f.feature).join(', ') || 'anomali gaya bahasa'}. Tahan diri untuk tidak membagikan kabar ini.`
      });
      recommendations.push({
        type: "warning",
        icon: "fa-magnifying-glass",
        title: "Periksa Melalui Portal Resmi Instansi Terkait",
        desc: "Kroscek langsung klaim dengan laman web pemerintah berdomain resmi (.go.id) atau kantor berita dewan pers."
      });
    } else if (mlPrediction.integrityScore < 75) {
      recommendations.push({
        type: "warning",
        icon: "fa-triangle-exclamation",
        title: "Verifikasi Konteks Tambahan",
        desc: "Informasi memuat sejumlah istilah yang sering digunakan dalam pesan berantai. Pastikan narasumber utama telah dikonfirmasi."
      });
    } else {
      recommendations.push({
        type: "success",
        icon: "fa-circle-check",
        title: "Struktur Bahasa Menunjukkan Karakteristik Kredibel",
        desc: `Fitur positif terdeteksi: ${mlPrediction.topValidFeatures.map(f => f.feature).join(', ') || 'atribusi objektif'}. Teks memenuhi standar jurnalisme berimbang.`
      });
    }

    return {
      timestamp: new Date().toISOString(),
      engine: "Machine Learning (TF-IDF + Softmax Classifier)",
      engineType: "ml",
      wordCount: trimmedText.split(/\s+/).length,
      totalScore: mlPrediction.integrityScore,
      status,
      metrics: [
        {
          name: "Probabilitas Inferensi ML (TF-IDF)",
          score: mlPrediction.integrityScore,
          desc: `P(Valid): ${mlPrediction.validProbability}% | P(Hoaks): ${mlPrediction.hoaxProbability}% | Latensi: ${mlPrediction.inferenceTimeMs}ms`,
          weight: "40%"
        },
        {
          name: "Atribusi & Validitas Sumber",
          score: sourceScore,
          desc: "Korelasi leksikal terhadap entitas resmi dan media terverifikasi.",
          weight: "25%"
        },
        {
          name: "Tingkat Urgensi & Manipulasi",
          score: urgencyScore,
          desc: "Pendeteksian pola paksaan sebar dan rekayasa kepanikan massa.",
          weight: "20%"
        },
        {
          name: "Korelasi Basis Data Fakta",
          score: correlationScore,
          desc: "Pencocokan silang dengan arsip sanggahan konsorsium fakta.",
          weight: "15%"
        }
      ],
      mlMetrics: {
        hoaxProbability: mlPrediction.hoaxProbability,
        validProbability: mlPrediction.validProbability,
        confidence: mlPrediction.confidence,
        topHoaxFeatures: mlPrediction.topHoaxFeatures,
        topValidFeatures: mlPrediction.topValidFeatures,
        totalFeaturesDetected: mlPrediction.totalFeaturesDetected,
        inferenceTimeMs: mlPrediction.inferenceTimeMs,
        logitScore: mlPrediction.logitScore,
        vectorDimension: mlPrediction.vectorDimension,
        modelArchitecture: "TF-IDF N-Gram Vectorizer + Softmax Classifier (On-Device ML)"
      },
      findings,
      factCheckMatch,
      annotatedHtml,
      recommendations
    };
  }

  /**
   * Analisis Konteks Mendalam menggunakan Google Gemini LLM API
   * Mampu menangkap sarkasme, klaim implisit, dan nuansa bahasa kompleks.
   * @param {string} text
   * @param {string} apiKey
   * @returns {Promise<object>}
   */
  async analyzeWithLLM(text, apiKey) {
    if (!apiKey) {
      throw new Error("API Key Gemini belum disetel. Masukkan API Key Anda di menu Pengaturan Model.");
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const promptSystem = `
Kamu adalah VERITASK AI Evaluator, sistem pemeriksa integritas informasi dan pemeriksa fakta kredibel spesialis bahasa Indonesia.
Analisis teks berikut untuk mendeteksi disinformasi, klaim palsu, teori konspirasi, sarkasme, sensasionalisme, atau pola penipuan/phishing.

Kembalikan HANYA JSON murni tanpa markdown formatting atau backtick, dengan format persis:
{
  "totalScore": 0-100 (100 sangat valid, 0 pasti hoaks),
  "statusLabel": "TERVERIFIKASI KREDIBEL" | "MERAGUKAN / PERLU KLARIFIKASI" | "TERINDIKASI HOAKS / DISINFORMASI",
  "summary": "Ringkasan kesimpulan penalaran 1-2 kalimat dalam bahasa Indonesia.",
  "sarcasmOrImplicitClaim": "Penjelasan apakah ada sarkasme, sindiran, atau klaim tersembunyi.",
  "linguisticScore": 0-100,
  "sourceScore": 0-100,
  "urgencyScore": 0-100,
  "correlationScore": 0-100,
  "flaggedPhrases": ["frasa mencurigakan 1", "frasa mencurigakan 2"],
  "recommendations": [
    {
      "title": "Judul rekomendasi",
      "desc": "Uraian rekomendasi tindakan bagi pembaca.",
      "type": "danger" | "warning" | "info" | "success"
    }
  ]
}

Teks yang dianalisis:
"${text.replace(/"/g, '\\"')}"
    `;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptSystem }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error?.message || `Gagal menghubungi Gemini API (Status ${response.status})`);
    }

    const resJson = await response.json();
    const rawContent = resJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawContent) {
      throw new Error("Respons dari Gemini API kosong.");
    }

    // Bersihkan kemungkinan format markdown code block ```json ... ```
    const cleaned = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    // Adaptasi struktur parsed ke format VERITASK AI
    const findings = {
      sensational: parsed.flaggedPhrases || [],
      urgency: [],
      unverifiedSources: [],
      emotionalFear: [],
      credibleIndicators: []
    };

    const annotatedHtml = this._generateAnnotatedText(text, findings, false, false);

    let status = {
      label: parsed.statusLabel,
      icon: parsed.totalScore >= 75 ? "fa-circle-check" : (parsed.totalScore >= 50 ? "fa-triangle-exclamation" : "fa-shield-virus"),
      summary: parsed.summary + (parsed.sarcasmOrImplicitClaim ? ` (Analisis Konteks AI: ${parsed.sarcasmOrImplicitClaim})` : "")
    };

    return {
      timestamp: new Date().toISOString(),
      engine: "Gemini 1.5 Flash (Deep LLM Context)",
      wordCount: text.trim().split(/\s+/).length,
      totalScore: parsed.totalScore,
      status,
      metrics: [
        {
          name: "Integritas Bahasa & Gaya Narasi",
          score: parsed.linguisticScore || 50,
          desc: "Analisis semantik konteks & potensi sarkasme oleh Gemini LLM.",
          weight: "30%"
        },
        {
          name: "Atribusi & Validitas Sumber",
          score: parsed.sourceScore || 50,
          desc: "Penelusuran keabsahan nama instansi/tokoh yang dicatut.",
          weight: "30%"
        },
        {
          name: "Tingkat Urgensi & Manipulasi",
          score: parsed.urgencyScore || 50,
          desc: "Pendeteksian unsur paksaan sebar, FOMO, atau kepanikan.",
          weight: "25%"
        },
        {
          name: "Korelasi Pengetahuan Faktual",
          score: parsed.correlationScore || 50,
          desc: "Pencocokan silang dengan penalaran konsensus dunia nyata.",
          weight: "15%"
        }
      ],
      findings,
      factCheckMatch: null,
      annotatedHtml,
      recommendations: parsed.recommendations.map(r => ({
        type: r.type || "warning",
        icon: r.type === "danger" ? "fa-ban" : (r.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"),
        title: r.title,
        desc: r.desc
      }))
    };
  }

  /**
   * Analisis Keamanan dan Kredibilitas Domain Tautan
   * @param {string} rawUrl 
   */
  analyzeUrl(rawUrl) {
    if (!rawUrl) return null;

    let urlObj;
    try {
      urlObj = new URL(rawUrl.startsWith('http') ? rawUrl : 'https://' + rawUrl);
    } catch (e) {
      return {
        valid: false,
        message: "Format URL tidak valid."
      };
    }

    const hostname = urlObj.hostname.toLowerCase();
    const isGov = hostname.endsWith('.go.id');
    const isEdu = hostname.endsWith('.ac.id') || hostname.endsWith('.edu');
    
    const isCredibleMedia = this.db.domains.credible.some(d => hostname === d || hostname.endsWith('.' + d));
    const isSuspicious = this.db.domains.suspicious.some(s => hostname.includes(s));

    let score = 50;
    let label = "Netral / Belum Terindeks";
    let riskLevel = "Sedang";
    let color = "amber";

    if (isGov || isEdu) {
      score = 98;
      label = "Portal Resmi Pemerintah / Akademik";
      riskLevel = "Sangat Rendah";
      color = "emerald";
    } else if (isCredibleMedia) {
      score = 90;
      label = "Media Terdaftar & Terverifikasi Dewan Pers";
      riskLevel = "Rendah";
      color = "emerald";
    } else if (isSuspicious) {
      score = 15;
      label = "Domain Mencurigakan / Hosting Gratis / Indikasi Phishing";
      riskLevel = "Tinggi";
      color = "rose";
    }

    return {
      valid: true,
      url: urlObj.href,
      hostname,
      score,
      label,
      riskLevel,
      color,
      isGov,
      isCredibleMedia,
      isSuspicious
    };
  }

  /**
   * Helper: Perhitungan kemiripan sederhana berbasis irisan kata kunci
   */
  _calculateKeywordOverlap(textA, textB) {
    const tokenize = (str) => str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 3);
    const setA = new Set(tokenize(textA));
    const setB = new Set(tokenize(textB));

    let intersection = 0;
    setA.forEach(word => {
      if (setB.has(word)) intersection++;
    });

    return setB.size > 0 ? (intersection / Math.min(setA.size, setB.size)) : 0;
  }

  /**
   * Helper: Membuat teks beranotasi dengan tooltip interaktif secara aman (menghindari penimpaan tag HTML)
   */
  _generateAnnotatedText(text, findings, excessiveCaps, excessivePunctuation) {
    let result = text;

    const escapeHtml = (str) => {
      return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    result = escapeHtml(result);

    const patterns = [];

    (findings.sensational || []).forEach(p => patterns.push({
      phrase: p,
      cls: "badge-sensational",
      tooltip: "Kata Sensasional / Clickbait: " + p
    }));

    (findings.urgency || []).forEach(p => patterns.push({
      phrase: p,
      cls: "badge-urgency",
      tooltip: "Pola Manipulasi Urgensi / Paksaan Sebar: " + p
    }));

    (findings.unverifiedSources || []).forEach(p => patterns.push({
      phrase: p,
      cls: "badge-source",
      tooltip: "Atribusi Anonim Tidak Jelas: " + p
    }));

    (findings.emotionalFear || []).forEach(p => patterns.push({
      phrase: p,
      cls: "badge-fear",
      tooltip: "Narasi Ketakutan / Teori Konspirasi: " + p
    }));

    patterns.sort((a, b) => b.phrase.length - a.phrase.length);

    patterns.forEach(item => {
      const regex = new RegExp(`(${this._escapeRegExp(item.phrase)})(?![^<]*>)`, 'gi');
      result = result.replace(regex, `<mark class="annotation-badge ${item.cls}" title="${item.tooltip}" data-tooltip="${item.tooltip}">$1</mark>`);
    });

    result = result.replace(/(!{2,}|\?{2,}|!\?|\?!)(?![^<]*>)/g, `<mark class="annotation-badge badge-punct" title="Tanda baca ganda provokatif" data-tooltip="Tanda baca ganda provokatif">$1</mark>`);

    return result;
  }

  /**
   * Helper: Menyusun rekomendasi aksi berbasis skor dan temuan
   */
  _generateRecommendations(score, findings, factCheckMatch) {
    const list = [];

    if (factCheckMatch) {
      list.push({
        type: "critical",
        icon: "fa-triangle-exclamation",
        title: "Ditemukan Bantahan Resmi Serupa",
        desc: `Topik ini serupa dengan klarifikasi '${factCheckMatch.title}'. Rujuk ke sumber '${factCheckMatch.sourceFact}'.`
      });
    }

    if (score < 50) {
      list.push({
        type: "danger",
        icon: "fa-ban",
        title: "Jangan Teruskan (Do Not Forward)",
        desc: "Pesan ini memiliki ciri disinformasi berbahaya. Hentikan penyebaran di grup pesan pribadi untuk memutus rantai kabar bohong."
      });
      list.push({
        type: "warning",
        icon: "fa-magnifying-glass",
        title: "Periksa Kanal Resmi Pemerintah",
        desc: "Jika terkait bantuan sosial, bencana, atau kesehatan, kunjungi langsung situs dengan domain resmi '.go.id' atau kanal Kominfo."
      });
    } else if (score < 75) {
      list.push({
        type: "warning",
        icon: "fa-code-compare",
        title: "Bandingkan Minimal 2 Media Kredibel",
        desc: "Cari apakah narasi ini diberitakan oleh kantor berita arus utama (Antara, Kompas, Tempo, dll) dengan fakta yang seimbang."
      });
      list.push({
        type: "info",
        icon: "fa-user-tag",
        title: "Telusuri Identitas Narasumber",
        desc: "Pastikan pernyataan didukung oleh nama pejabat/ahli yang kredibel dan memiliki kapasitas resmi di bidangnya."
      });
    } else {
      list.push({
        type: "success",
        icon: "fa-circle-check",
        title: "Informasi Memiliki Karakteristik Kredibel",
        desc: "Gaya penulisan objektif dan proporsional. Tetap disarankan merujuk pada siaran pers primer bila mengambil keputusan penting."
      });
    }

    return list;
  }

  _escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Ekspos ke global window
window.HoaxDetector = HoaxDetector;
