/**
 * VERITASK AI - Controller Utama Aplikasi Web (Full-Featured & Interactive)
 * Mengatur UI, Machine Learning Classifier, Peta Spasial (Leaflet GIS Multi-Level),
 * Portal Berita Lolos Verifikasi, SoundFX (Web Audio API), Hero Particle Mesh,
 * Text-to-Speech (TTS), OCR Tesseract.js, dan WhatsApp Verification Bot Simulator.
 */

// =========================================================================
// 0. WEB AUDIO API SYNTHESIZER (Cyber UI Sound Effects - Zero External Files)
// =========================================================================
const SoundFX = {
  ctx: null,
  enabled: true,

  _init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playTone(freq, type, duration, gainVal = 0.04) {
    if (!this.enabled) return;
    try {
      this._init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Abaikan jika browser memblokir audio autoplay
    }
  },

  click() {
    this.playTone(800, 'sine', 0.05, 0.03);
  },

  scan() {
    if (!this.enabled) return;
    try {
      this._init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  },

  success() {
    this.playTone(523.25, 'triangle', 0.12, 0.04);
    setTimeout(() => this.playTone(659.25, 'triangle', 0.18, 0.04), 100);
    setTimeout(() => this.playTone(783.99, 'triangle', 0.28, 0.04), 200);
  },

  alert() {
    this.playTone(380, 'square', 0.12, 0.05);
    setTimeout(() => this.playTone(290, 'square', 0.22, 0.05), 130);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Inisialisasi Objek & State
  const db = window.VeritasDB || window.VeritaskDB;
  const detector = new window.HoaxDetector(db);
  let currentAnalysis = null;
  let activeTab = 'scanner';
  let currentEngineMode = 'ml'; // Default: Machine Learning on-device!
  let isLlmMode = false;
  let feedMode = 'verified'; // Default: Berita Lolos Verifikasi (Selling Proposition Utama)
  
  // Menggabungkan repositori berita terverifikasi sahih dengan arsip sanggahan fakta
  const initialCombinedData = [
    ...(db.verifiedNewsRepository || []),
    ...(db.factCheckRepository || [])
  ];
  let activeFactCheckData = [...initialCombinedData];
  let isSpeaking = false;

  // Referensi DOM Elemen Scanner
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const tabContents = document.querySelectorAll('.tab-content-panel');
  const scanTextInput = document.getElementById('scan-text-input');
  const btnScanText = document.getElementById('btn-scan-text');
  const btnClearText = document.getElementById('btn-clear-text');
  const textWordCount = document.getElementById('text-word-count');
  const scanPresetBtns = document.querySelectorAll('.preset-btn');
  const resultsCard = document.getElementById('scan-results-container');
  const scanPlaceholder = document.getElementById('scan-placeholder');
  const scanningLoader = document.getElementById('scanning-loader');
  const activeEngineBadge = document.getElementById('active-engine-badge');

  // Gauge Elements
  const gaugeCircle = document.getElementById('gauge-progress-circle');
  const scoreValueText = document.getElementById('score-value-text');
  const statusBadge = document.getElementById('status-badge');
  const statusSummary = document.getElementById('status-summary');
  const annotatedTextEl = document.getElementById('annotated-text-output');
  const metricsContainer = document.getElementById('metrics-bars-container');
  const recommendationsContainer = document.getElementById('recommendations-container');
  const factMatchAlert = document.getElementById('fact-match-alert');
  const btnTtsSpeak = document.getElementById('btn-tts-speak');

  // URL Scanner Elements
  const scanUrlInput = document.getElementById('scan-url-input');
  const btnScanUrl = document.getElementById('btn-scan-url');
  const urlScanResult = document.getElementById('url-scan-result');

  // Database Search, Filter & Live Feed Elements
  const dbSearchInput = document.getElementById('db-search-input');
  const dbCategoryFilters = document.querySelectorAll('.db-category-pill');
  const factCardsGrid = document.getElementById('fact-cards-grid');
  const liveStatusBadge = document.getElementById('live-feed-status-badge');
  const btnRefreshLive = document.getElementById('btn-refresh-live-feed');
  const trendingChipsContainer = document.getElementById('scanner-trending-chips');
  const btnToggleSound = document.getElementById('btn-toggle-sound');

  // =========================================================================
  // 1a. Theme Toggle (Mode Gelap / Terang)
  // =========================================================================
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      if (themeToggleIcon) {
        themeToggleIcon.className = "fa-solid fa-moon text-sky-400 text-sm";
      }
      if (btnToggleTheme) {
        btnToggleTheme.title = "Ganti ke Mode Gelap (Dark Mode)";
      }
      localStorage.setItem('veritas_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      if (themeToggleIcon) {
        themeToggleIcon.className = "fa-solid fa-sun text-amber-400 text-sm";
      }
      if (btnToggleTheme) {
        btnToggleTheme.title = "Ganti ke Mode Terang (Light Mode)";
      }
      localStorage.setItem('veritas_theme', 'dark');
    }
  }

  const savedTheme = localStorage.getItem('veritas_theme') || 'dark';
  applyTheme(savedTheme);

  if (btnToggleTheme) {
    btnToggleTheme.addEventListener('click', () => {
      SoundFX.click();
      const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // =========================================================================
  // 1b. Audio Toggle & Interaktivitas Suara
  // =========================================================================
  if (btnToggleSound) {
    btnToggleSound.addEventListener('click', () => {
      SoundFX.enabled = !SoundFX.enabled;
      if (SoundFX.enabled) {
        btnToggleSound.innerHTML = `<i class="fa-solid fa-volume-high text-emerald-400"></i>`;
        btnToggleSound.title = "Suara UI Aktif";
        SoundFX.click();
      } else {
        btnToggleSound.innerHTML = `<i class="fa-solid fa-volume-xmark text-slate-500"></i>`;
        btnToggleSound.title = "Suara UI Nonaktif";
      }
    });
  }

  // =========================================================================
  // 2. Hero Interactive Cyber Particle Canvas
  // =========================================================================
  function initHeroParticles() {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = canvas.clientWidth || 800;
    let height = canvas.height = canvas.clientHeight || 300;

    const particles = [];
    const particleCount = 48;
    const bluePalette = [
      { hex: '#38bdf8', rgba: 'rgba(56, 189, 248,' },
      { hex: '#0ea5e9', rgba: 'rgba(14, 165, 233,' },
      { hex: '#06b6d4', rgba: 'rgba(6, 182, 212,' },
      { hex: '#60a5fa', rgba: 'rgba(96, 165, 250,' },
      { hex: '#818cf8', rgba: 'rgba(129, 140, 248,' },
      { hex: '#67e8f9', rgba: 'rgba(103, 232, 249,' }
    ];

    for (let i = 0; i < particleCount; i++) {
      const pColor = bluePalette[Math.floor(Math.random() * bluePalette.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.2 + 1.2,
        color: pColor.hex,
        rgba: pColor.rgba
      });
    }

    let mouse = { x: -1000, y: -1000 };
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      if (!canvas) return;
      width = canvas.width = canvas.clientWidth;
      height = canvas.height = canvas.clientHeight;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Gambar koneksi laser antar titik (Aesthetic Blue & Cyan dynamic strokes)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);

            const alpha = 0.28 * (1 - dist / 115);
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            grad.addColorStop(0, `${particles[i].rgba} ${alpha})`);
            grad.addColorStop(1, `${particles[j].rgba} ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }
        }
      }

      // Update & render partikel
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Reaksi interaktif terhadap kursor mouse
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 90) {
          p.x -= (mdx / mdist) * 1.8;
          p.y -= (mdy / mdist) * 1.8;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(draw);
    }
    draw();
  }
  initHeroParticles();

  // =========================================================================
  // 3. Animated KPI Number Counter (Odometer Effect)
  // =========================================================================
  function animateNumberCounters() {
    const counterEls = document.querySelectorAll('[data-counter-target]');
    counterEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-counter-target'), 10);
      const duration = 1800;
      const startTime = performance.now();

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        el.textContent = current.toLocaleString('id-ID');

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.textContent = target.toLocaleString('id-ID');
        }
      }
      requestAnimationFrame(updateNumber);
    });
  }

  // =========================================================================
  // 4. Navigasi Antar Tab
  // =========================================================================
  function switchTab(targetTabId) {
    SoundFX.click();
    activeTab = targetTabId;
    navTabs.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === targetTabId;
      if (isTarget) {
        btn.classList.add('bg-sky-500/20', 'text-sky-400', 'border-sky-500/50');
        btn.classList.remove('text-slate-400', 'border-transparent');
      } else {
        btn.classList.remove('bg-sky-500/20', 'text-sky-400', 'border-sky-500/50');
        btn.classList.add('text-slate-400', 'border-transparent');
      }
    });

    tabContents.forEach(panel => {
      if (panel.id === `tab-${targetTabId}`) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    });

    if (targetTabId === 'transparency') {
      setTimeout(animateNumberCounters, 150);
      setTimeout(() => {
        if (window.SpatialLeafletManager && document.getElementById('spatial-leaflet-map')) {
          window.SpatialLeafletManager.init('spatial-leaflet-map');
          if (typeof window.SpatialLeafletManager.staggeredInvalidate === 'function') {
            window.SpatialLeafletManager.staggeredInvalidate();
          }
        }
        if (window.IndonesiaDisinfoMap && document.getElementById('indonesia-map-container')) {
          window.IndonesiaDisinfoMap.init('indonesia-map-container');
        }
      }, 80);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  document.querySelectorAll('[data-switch-tab]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = el.getAttribute('data-switch-tab');
      switchTab(tab);
    });
  });

  // =========================================================================
  // 5. Input Teks & Hitung Kata
  // =========================================================================
  if (scanTextInput) {
    scanTextInput.addEventListener('input', () => {
      const text = scanTextInput.value.trim();
      const words = text ? text.split(/\s+/).length : 0;
      textWordCount.textContent = `${words} kata | ${text.length} karakter`;
    });
  }

  if (btnClearText) {
    btnClearText.addEventListener('click', () => {
      SoundFX.click();
      scanTextInput.value = '';
      textWordCount.textContent = '0 kata | 0 karakter';
      resultsCard.classList.add('hidden');
      scanPlaceholder.classList.remove('hidden');
      currentAnalysis = null;
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    });
  }

  // =========================================================================
  // 5b. Input Suara Mikrofon (Speech-to-Text Bahasa Indonesia)
  // =========================================================================
  const btnMicInput = document.getElementById('btn-mic-input');
  const micBtnLabel = document.getElementById('mic-btn-label');
  const micStatusBanner = document.getElementById('mic-status-banner');
  const btnStopMic = document.getElementById('btn-stop-mic');
  let recognition = null;
  let isRecordingMic = false;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition && btnMicInput) {
    recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecordingMic = true;
      btnMicInput.classList.add('mic-recording-pulse');
      if (micBtnLabel) micBtnLabel.textContent = "Merekam...";
      if (micStatusBanner) micStatusBanner.classList.remove('hidden');
      SoundFX.scan();
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text && scanTextInput) {
        scanTextInput.value = text;
        const words = text.trim().split(/\s+/).length;
        textWordCount.textContent = `${words} kata | ${text.length} karakter (Input Suara)`;
      }
    };

    recognition.onerror = (event) => {
      console.warn("Speech Recognition error:", event.error);
      stopRecording();
      if (event.error === 'not-allowed') {
        alert("Izin akses mikrofon ditolak. Mohon izinkan mikrofon pada browser Anda.");
      }
    };

    recognition.onend = () => {
      stopRecording();
      const text = scanTextInput ? scanTextInput.value.trim() : '';
      if (text.length > 5) {
        SoundFX.success();
        executeScanText();
      }
    };

    function stopRecording() {
      isRecordingMic = false;
      if (recognition) {
        try { recognition.stop(); } catch (e) {}
      }
      btnMicInput.classList.remove('mic-recording-pulse');
      if (micBtnLabel) micBtnLabel.textContent = "Bicara (STT)";
      if (micStatusBanner) micStatusBanner.classList.add('hidden');
    }

    btnMicInput.addEventListener('click', () => {
      if (isRecordingMic) {
        stopRecording();
      } else {
        try {
          recognition.start();
        } catch (e) {
          recognition.stop();
          setTimeout(() => recognition.start(), 200);
        }
      }
    });

    if (btnStopMic) {
      btnStopMic.addEventListener('click', stopRecording);
    }
  } else if (btnMicInput) {
    btnMicInput.addEventListener('click', () => {
      alert("Browser Anda belum mendukung Web Speech Recognition API. Silakan gunakan Google Chrome atau Microsoft Edge untuk fitur input suara.");
    });
  }

  scanPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      SoundFX.click();
      const presetId = btn.getAttribute('data-preset');
      const article = db.sampleArticles.find(a => a.id === presetId);
      if (article && scanTextInput) {
        scanTextInput.value = article.text;
        const words = article.text.trim().split(/\s+/).length;
        textWordCount.textContent = `${words} kata | ${article.text.length} karakter`;
        executeScanText();
      }
    });
  });

  // =========================================================================
  // 6. Konfigurasi Mode Mesin (Machine Learning vs Heuristik vs Gemini LLM)
  // =========================================================================
  const toggleLlmBtn = document.getElementById('btn-toggle-llm-modal');
  const llmModal = document.getElementById('llm-config-modal');
  const btnCloseLlmModal = document.getElementById('btn-close-llm-modal');
  const btnSaveApiKey = document.getElementById('btn-save-api-key');
  const inputApiKey = document.getElementById('gemini-api-key-input');
  const engineSelector = document.getElementById('engine-mode-select');

  const savedApiKey = localStorage.getItem('veritas_gemini_api_key') || '';
  if (inputApiKey) inputApiKey.value = savedApiKey;

  // Set default engine mode ke Machine Learning On-Device
  if (activeEngineBadge) {
    activeEngineBadge.innerHTML = `<i class="fa-solid fa-microchip text-sky-400"></i> [AI CORE: MACHINE LEARNING ON-DEVICE]`;
  }
  if (engineSelector) {
    engineSelector.value = 'ml';
  }

  if (toggleLlmBtn && llmModal) {
    toggleLlmBtn.addEventListener('click', () => {
      SoundFX.click();
      llmModal.classList.remove('hidden');
      llmModal.classList.add('flex');
    });
  }

  if (btnCloseLlmModal && llmModal) {
    btnCloseLlmModal.addEventListener('click', () => {
      SoundFX.click();
      llmModal.classList.add('hidden');
      llmModal.classList.remove('flex');
    });
  }

  if (btnSaveApiKey) {
    btnSaveApiKey.addEventListener('click', () => {
      const selectedMode = engineSelector ? engineSelector.value : 'ml';
      const key = inputApiKey.value.trim();

      if (selectedMode === 'llm') {
        if (key) {
          localStorage.setItem('veritas_gemini_api_key', key);
          isLlmMode = true;
          currentEngineMode = 'llm';
          if (activeEngineBadge) {
            activeEngineBadge.innerHTML = `<i class="fa-solid fa-sparkles text-amber-400"></i> [AI CORE: GEMINI 1.5 FLASH]`;
          }
          SoundFX.success();
          alert("API Key Gemini berhasil disimpan! Sistem akan menggunakan Deep Context LLM untuk pemindaian.");
        } else {
          alert("Silakan masukkan Google AI Studio API Key untuk menggunakan model Gemini.");
          return;
        }
      } else if (selectedMode === 'ml') {
        currentEngineMode = 'ml';
        isLlmMode = false;
        if (activeEngineBadge) {
          activeEngineBadge.innerHTML = `<i class="fa-solid fa-microchip text-sky-400"></i> [AI CORE: MACHINE LEARNING ON-DEVICE]`;
        }
        SoundFX.success();
        alert("Mode pemindaian dialihkan ke Machine Learning on-device (TF-IDF + Softmax).");
      } else {
        currentEngineMode = 'heuristic';
        isLlmMode = false;
        if (activeEngineBadge) {
          activeEngineBadge.innerHTML = `<i class="fa-solid fa-brain text-sky-400"></i> [AI CORE: HEURISTIC KLIEN]`;
        }
        SoundFX.click();
        alert("Mode pemindaian dialihkan ke Heuristic NLP lokal.");
      }

      llmModal.classList.add('hidden');
      llmModal.classList.remove('flex');
    });
  }

  if (engineSelector) {
    engineSelector.addEventListener('change', (e) => {
      const mode = e.target.value;
      if (mode === 'llm') {
        const key = localStorage.getItem('veritas_gemini_api_key');
        if (!key) {
          alert("Silakan masukkan API Key Gemini Anda terlebih dahulu.");
          llmModal.classList.remove('hidden');
          llmModal.classList.add('flex');
          e.target.value = currentEngineMode;
        } else {
          isLlmMode = true;
          currentEngineMode = 'llm';
          if (activeEngineBadge) {
            activeEngineBadge.innerHTML = `<i class="fa-solid fa-sparkles text-amber-400"></i> [AI CORE: GEMINI 1.5 FLASH]`;
          }
        }
      } else if (mode === 'ml') {
        isLlmMode = false;
        currentEngineMode = 'ml';
        if (activeEngineBadge) {
          activeEngineBadge.innerHTML = `<i class="fa-solid fa-microchip text-sky-400"></i> [AI CORE: MACHINE LEARNING ON-DEVICE]`;
        }
      } else {
        isLlmMode = false;
        currentEngineMode = 'heuristic';
        if (activeEngineBadge) {
          activeEngineBadge.innerHTML = `<i class="fa-solid fa-brain text-sky-400"></i> [AI CORE: HEURISTIC KLIEN]`;
        }
      }
    });
  }

  // =========================================================================
  // 7. Eksekusi Analisis Deteksi Hoaks Teks (Hybrid: Machine Learning / Heuristic / LLM)
  // =========================================================================
  async function executeScanText() {
    const rawText = scanTextInput.value.trim();
    if (!rawText) {
      alert("Silakan masukkan teks berita atau narasi yang ingin Anda periksa terlebih dahulu.");
      return;
    }

    SoundFX.scan();
    scanPlaceholder.classList.add('hidden');
    resultsCard.classList.add('hidden');
    scanningLoader.classList.remove('hidden');

    try {
      let result;
      const apiKey = localStorage.getItem('veritas_gemini_api_key');
      const mlMetrics = detector.analyzeWithML ? detector.analyzeWithML(rawText) : null;

      if (currentEngineMode === 'llm' && isLlmMode && apiKey) {
        document.getElementById('scanning-status-title').textContent = "Menganalisis Konteks & Sarkasme via Gemini LLM...";
        result = await detector.analyzeWithLLM(rawText, apiKey);
      } else if (currentEngineMode === 'ml') {
        document.getElementById('scanning-status-title').textContent = "Mengevaluasi Fitur Leksikal via Machine Learning On-Device (TF-IDF)...";
        await new Promise(r => setTimeout(r, 400));
        result = detector.analyzeText(rawText);
      } else {
        document.getElementById('scanning-status-title').textContent = "Menganalisis Pola Linguistik & Basis Data Cek Fakta...";
        await new Promise(r => setTimeout(r, 450));
        result = detector.analyzeText(rawText);
      }

      result.mlMetrics = mlMetrics;
      currentAnalysis = result;
      renderAnalysisResults(result, rawText);

      if (result.totalScore >= 75) {
        SoundFX.success();
      } else if (result.totalScore < 50) {
        SoundFX.alert();
      }
    } catch (err) {
      console.warn("Detection error fallback to heuristic + ML:", err);
      if (currentEngineMode === 'llm') {
        alert("Gagal menggunakan Gemini API (" + err.message + "). Mengalihkan otomatis ke Machine Learning on-device lokal.");
        const fallbackResult = detector.analyzeText(rawText);
        fallbackResult.mlMetrics = detector.analyzeWithML ? detector.analyzeWithML(rawText) : null;
        currentAnalysis = fallbackResult;
        renderAnalysisResults(fallbackResult, rawText);
      } else {
        alert("Terjadi kesalahan: " + err.message);
      }
    } finally {
      scanningLoader.classList.add('hidden');
      resultsCard.classList.remove('hidden');
      resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (btnScanText) {
    btnScanText.addEventListener('click', executeScanText);
  }

  // =========================================================================
  // 8. Text-To-Speech (Suara Narasi Audio Bahasa Indonesia)
  // =========================================================================
  if (btnTtsSpeak) {
    btnTtsSpeak.addEventListener('click', () => {
      if (!currentAnalysis) return;
      if (!('speechSynthesis' in window)) {
        alert("Fitur Text-to-Speech tidak didukung di peramban ini.");
        return;
      }

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btnTtsSpeak.innerHTML = `<i class="fa-solid fa-volume-high"></i> Dengarkan Suara`;
        btnTtsSpeak.classList.remove('bg-rose-500/20', 'text-rose-400');
        return;
      }

      const verdictText = currentAnalysis.status.label;
      const score = currentAnalysis.totalScore;
      const summary = currentAnalysis.status.summary;
      const speechContent = `Hasil audit sistem VERITAS. Skor kredibilitas: ${score} persen. Status: ${verdictText}. ${summary}`;

      const utterance = new SpeechSynthesisUtterance(speechContent);
      utterance.lang = 'id-ID';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        isSpeaking = true;
        btnTtsSpeak.innerHTML = `<i class="fa-solid fa-stop text-rose-400"></i> Hentikan Suara`;
        btnTtsSpeak.classList.add('bg-rose-500/20', 'text-rose-400');
      };

      utterance.onend = () => {
        isSpeaking = false;
        btnTtsSpeak.innerHTML = `<i class="fa-solid fa-volume-high"></i> Dengarkan Suara`;
        btnTtsSpeak.classList.remove('bg-rose-500/20', 'text-rose-400');
      };

      utterance.onerror = () => {
        isSpeaking = false;
        btnTtsSpeak.innerHTML = `<i class="fa-solid fa-volume-high"></i> Dengarkan Suara`;
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // =========================================================================
  // 9. Ekstraksi Teks Screenshot (OCR via Tesseract.js)
  // =========================================================================
  const ocrFileInput = document.getElementById('ocr-file-input');
  const ocrDropzone = document.getElementById('ocr-dropzone');
  const ocrProgressContainer = document.getElementById('ocr-progress-container');
  const ocrProgressBar = document.getElementById('ocr-progress-bar');
  const ocrStatusText = document.getElementById('ocr-status-text');

  if (ocrDropzone && ocrFileInput) {
    ocrDropzone.addEventListener('click', () => {
      SoundFX.click();
      ocrFileInput.click();
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      ocrDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        ocrDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      ocrDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        ocrDropzone.classList.remove('drag-over');
      });
    });

    ocrDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        processOcrFile(files[0]);
      }
    });

    ocrFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        processOcrFile(e.target.files[0]);
      }
    });
  }

  // =========================================================================
  // 9b. Forensik Citra Digital (ELA & EXIF Inspector)
  // =========================================================================
  const forensicsContainer = document.getElementById('forensics-results-container');
  const forensicsOrigPreview = document.getElementById('forensics-orig-preview');
  const forensicsElaCanvas = document.getElementById('forensics-ela-canvas');
  const forensicsStatusAlert = document.getElementById('forensics-status-alert');
  const forensicsExifTbody = document.getElementById('forensics-exif-tbody');
  const forensicsSoftwareAlert = document.getElementById('forensics-software-alert');
  const forensicsSoftwareAlertText = document.getElementById('forensics-software-alert-text');
  const btnForensicsTabEla = document.getElementById('btn-forensics-tab-ela');
  const btnForensicsTabExif = document.getElementById('btn-forensics-tab-exif');
  const forensicsViewEla = document.getElementById('forensics-view-ela');
  const forensicsViewExif = document.getElementById('forensics-view-exif');
  const elaScaleSlider = document.getElementById('ela-scale-slider');
  const elaScaleVal = document.getElementById('ela-scale-val');
  let currentForensicFile = null;

  if (btnForensicsTabEla && btnForensicsTabExif) {
    btnForensicsTabEla.addEventListener('click', () => {
      SoundFX.click();
      btnForensicsTabEla.className = "px-3 py-1 rounded-lg bg-sky-500/20 text-sky-400 font-bold transition-all";
      btnForensicsTabExif.className = "px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition-all";
      if (forensicsViewEla) forensicsViewEla.classList.remove('hidden');
      if (forensicsViewExif) forensicsViewExif.classList.add('hidden');
    });

    btnForensicsTabExif.addEventListener('click', () => {
      SoundFX.click();
      btnForensicsTabExif.className = "px-3 py-1 rounded-lg bg-sky-500/20 text-sky-400 font-bold transition-all";
      btnForensicsTabEla.className = "px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 transition-all";
      if (forensicsViewExif) forensicsViewExif.classList.remove('hidden');
      if (forensicsViewEla) forensicsViewEla.classList.add('hidden');
    });
  }

  if (elaScaleSlider && elaScaleVal) {
    elaScaleSlider.addEventListener('input', () => {
      const scale = parseInt(elaScaleSlider.value, 10);
      elaScaleVal.textContent = scale + 'x';
      if (currentForensicFile && window.ImageForensics && forensicsElaCanvas) {
        window.ImageForensics.runELA(currentForensicFile, forensicsElaCanvas, 0.90, scale).catch(() => {});
      }
    });
  }

  async function runImageForensics(file) {
    if (!window.ImageForensics || !forensicsContainer) return;
    currentForensicFile = file;
    forensicsContainer.classList.remove('hidden');

    if (forensicsOrigPreview) {
      forensicsOrigPreview.src = URL.createObjectURL(file);
    }

    // 1. Ekstraksi Metadata EXIF & Software
    try {
      const meta = await window.ImageForensics.extractMetadata(file);
      if (forensicsExifTbody) {
        forensicsExifTbody.innerHTML = `
          <tr class="border-b border-slate-800/60"><td class="py-1.5 text-slate-400 font-medium w-36">Nama Berkas</td><td class="py-1.5 text-slate-200 font-bold truncate max-w-xs">${meta.fileName}</td></tr>
          <tr class="border-b border-slate-800/60"><td class="py-1.5 text-slate-400 font-medium">Ukuran & Format</td><td class="py-1.5 text-slate-200">${meta.fileSize} &bull; ${meta.fileType}</td></tr>
          <tr class="border-b border-slate-800/60"><td class="py-1.5 text-slate-400 font-medium">Perangkat Kamera</td><td class="py-1.5 ${meta.make ? 'text-sky-400 font-bold' : 'text-slate-400'}">${meta.make ? `${meta.make} ${meta.model || ''}` : 'Tidak Tersemat (Tangkapan Layar / Web)'}</td></tr>
          <tr class="border-b border-slate-800/60"><td class="py-1.5 text-slate-400 font-medium">Software Penyunting</td><td class="py-1.5 ${meta.software ? 'text-rose-400 font-bold' : 'text-slate-400'}">${meta.software || 'Nihil / Bersih'}</td></tr>
          <tr class="border-b border-slate-800/60"><td class="py-1.5 text-slate-400 font-medium">Tanggal Asli EXIF</td><td class="py-1.5 text-slate-200">${meta.dateTimeOriginal || meta.dateTime || 'Tidak Tercantum'}</td></tr>
          <tr><td class="py-1.5 text-slate-400 font-medium">Indikasi Rekayasa</td><td class="py-1.5 font-bold ${meta.isEdited ? 'text-rose-400' : 'text-sky-400'}">${meta.isEdited ? '⚠️ Terindikasi Suntingan Perangkat Lunak' : '✅ Tidak Terdeteksi Jejak Editor Grafis'}</td></tr>
        `;
      }

      if (meta.isEdited || meta.photoshopMarker) {
        if (forensicsSoftwareAlert) {
          forensicsSoftwareAlert.classList.remove('hidden');
          if (forensicsSoftwareAlertText) {
            forensicsSoftwareAlertText.textContent = `Peringatan: Berkas terdeteksi memuat jejak biner software "${meta.software || 'Adobe Photoshop / Editor Grafis'}". Kemungkinan gambar bukan tangkapan mentah kamera asli.`;
          }
        }
      } else if (forensicsSoftwareAlert) {
        forensicsSoftwareAlert.classList.add('hidden');
      }
    } catch (e) {
      console.warn("Forensics EXIF error:", e);
    }

    // 2. Analisis ELA (Error Level Analysis)
    try {
      const scale = elaScaleSlider ? parseInt(elaScaleSlider.value, 10) : 20;
      const elaRes = await window.ImageForensics.runELA(file, forensicsElaCanvas, 0.90, scale);
      
      if (forensicsStatusAlert) {
        forensicsStatusAlert.innerHTML = `
          <div class="flex items-center justify-between font-mono">
            <span class="font-bold ${elaRes.isSuspicious ? 'text-rose-400' : 'text-sky-400'} flex items-center gap-1.5">
              <i class="fa-solid ${elaRes.isSuspicious ? 'fa-triangle-exclamation text-rose-400' : 'fa-circle-check text-sky-400'}"></i>
              STATUS ELA: ${elaRes.status.label}
            </span>
            <span class="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-sky-500/20">Rasio Anomali: <strong class="text-white">${elaRes.anomalyRatio}%</strong></span>
          </div>
          <p class="text-slate-300 text-[11px] leading-relaxed mt-1">${elaRes.status.desc}</p>
        `;
      }
    } catch (e) {
      console.warn("Forensics ELA error:", e);
    }
  }

  async function processOcrFile(file) {
    if (!file.type.startsWith('image/')) {
      alert("Harap pilih file gambar (PNG, JPG, JPEG, WEBP).");
      return;
    }

    // Jalankan modul forensik citra paralel
    runImageForensics(file);

    if (!window.Tesseract) {
      alert("Pustaka Tesseract.js sedang dimuat, silakan coba sesaat lagi.");
      return;
    }

    SoundFX.scan();
    ocrProgressContainer.classList.remove('hidden');
    ocrStatusText.textContent = "Menginisialisasi mesin pembaca gambar (OCR)...";
    ocrProgressBar.style.width = '10%';

    try {
      const result = await window.Tesseract.recognize(
        file,
        'ind+eng',
        {
          logger: m => {
            if (m.status === 'recognizing text') {
              const pct = Math.round(m.progress * 100);
              ocrProgressBar.style.width = `${pct}%`;
              ocrStatusText.textContent = `Membaca teks dari gambar: ${pct}%`;
            }
          }
        }
      );

      const extractedText = result.data.text.trim();
      if (!extractedText) {
        alert("Tidak ada teks yang berhasil dibaca dari gambar. Pastikan gambar cukup jernih.");
        return;
      }

      scanTextInput.value = extractedText;
      const words = extractedText.split(/\s+/).length;
      textWordCount.textContent = `${words} kata | ${extractedText.length} karakter (Hasil OCR)`;

      ocrStatusText.textContent = "✅ Teks berhasil diekstrak! Memulai audit...";
      SoundFX.success();

      setTimeout(() => {
        ocrProgressContainer.classList.add('hidden');
        executeScanText();
      }, 600);

    } catch (err) {
      alert("Gagal membaca gambar OCR: " + err.message);
      ocrProgressContainer.classList.add('hidden');
    }
  }

  // =========================================================================
  // 10. Render Hasil Analisis (Visual Gauge, Explainable Highlight, dsb.)
  // =========================================================================
  function renderAnalysisResults(result, rawText) {
    const circumference = 282.74;
    const offset = circumference - (result.totalScore / 100) * circumference;
    
    gaugeCircle.style.strokeDashoffset = offset;
    scoreValueText.textContent = result.totalScore;

    gaugeCircle.classList.remove('stroke-sky-400', 'stroke-cyan-400', 'stroke-rose-500');
    scoreValueText.classList.remove('text-sky-400', 'text-cyan-400', 'text-rose-500');

    if (result.totalScore >= 75) {
      gaugeCircle.classList.add('stroke-sky-400');
      scoreValueText.classList.add('text-sky-400');
      statusBadge.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/40 shadow-[0_0_12px_rgba(14,165,233,0.3)] font-mono";
      statusBadge.innerHTML = `<i class="fa-solid ${result.status.icon}"></i> ${result.status.label}`;
    } else if (result.totalScore >= 50) {
      gaugeCircle.classList.add('stroke-cyan-400');
      scoreValueText.classList.add('text-cyan-400');
      statusBadge.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-mono";
      statusBadge.innerHTML = `<i class="fa-solid ${result.status.icon}"></i> ${result.status.label}`;
    } else {
      gaugeCircle.classList.add('stroke-rose-500');
      scoreValueText.classList.add('text-rose-500');
      statusBadge.className = "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)] font-mono";
      statusBadge.innerHTML = `<i class="fa-solid ${result.status.icon}"></i> ${result.status.label}`;
    }

    statusSummary.textContent = result.status.summary;
    annotatedTextEl.innerHTML = result.annotatedHtml;

    metricsContainer.innerHTML = result.metrics.map(m => {
      let colorClass = 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]';
      if (m.score >= 75) colorClass = 'bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.5)]';
      else if (m.score >= 50) colorClass = 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]';

      return `
        <div>
          <div class="flex items-center justify-between text-xs mb-1.5">
            <span class="font-medium text-slate-200 font-mono">${m.name} <span class="text-slate-500">(${m.weight})</span></span>
            <span class="font-bold text-slate-100 font-mono">${m.score}%</span>
          </div>
          <div class="h-2 w-full bg-[#030610] rounded-full overflow-hidden border border-sky-500/20">
            <div class="progress-fill h-full ${colorClass} rounded-full" style="width: ${m.score}%"></div>
          </div>
          <p class="text-[11px] text-slate-400 mt-1">${m.desc}</p>
        </div>
      `;
    }).join('');

    if (result.factCheckMatch) {
      factMatchAlert.classList.remove('hidden');
      document.getElementById('fact-match-title').textContent = result.factCheckMatch.title;
      document.getElementById('fact-match-verdict').textContent = result.factCheckMatch.verdict;
      document.getElementById('fact-match-source').textContent = result.factCheckMatch.sourceFact;
      document.getElementById('fact-match-desc').textContent = result.factCheckMatch.explanation;
    } else {
      factMatchAlert.classList.add('hidden');
    }

    recommendationsContainer.innerHTML = result.recommendations.map(r => {
      let borderClass = 'border-sky-500/20 bg-[#040814] text-slate-300';
      let iconColor = 'text-sky-400';
      if (r.type === 'critical' || r.type === 'danger') {
        borderClass = 'border-rose-500/40 bg-rose-950/25 text-rose-200';
        iconColor = 'text-rose-400';
      } else if (r.type === 'warning') {
        borderClass = 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200';
        iconColor = 'text-cyan-400';
      } else if (r.type === 'success') {
        borderClass = 'border-sky-500/40 bg-sky-950/25 text-sky-200';
        iconColor = 'text-sky-400';
      }

      return `
        <div class="p-3.5 rounded-2xl border ${borderClass} flex items-start gap-3 text-xs">
          <div class="mt-0.5"><i class="fa-solid ${r.icon} ${iconColor} text-sm"></i></div>
          <div>
            <div class="font-bold mb-0.5 font-mono">${r.title}</div>
            <div class="text-slate-400 leading-relaxed">${r.desc}</div>
          </div>
        </div>
      `;
    }).join('');

    // Render Panel Machine Learning (On-Device TF-IDF + Softmax)
    const ml = result.mlMetrics;
    const mlPanel = document.getElementById('ml-metrics-panel');
    if (mlPanel && ml) {
      mlPanel.classList.remove('hidden');
      const confBadge = document.getElementById('ml-confidence-badge');
      if (confBadge) confBadge.textContent = `Confidence: ${ml.confidence}%`;

      const probHoaxVal = document.getElementById('ml-prob-hoax-val');
      const probHoaxBar = document.getElementById('ml-prob-hoax-bar');
      if (probHoaxVal) probHoaxVal.textContent = `${ml.probability.hoax}%`;
      if (probHoaxBar) probHoaxBar.style.width = `${ml.probability.hoax}%`;

      const probValidVal = document.getElementById('ml-prob-valid-val');
      const probValidBar = document.getElementById('ml-prob-valid-bar');
      if (probValidVal) probValidVal.textContent = `${ml.probability.valid}%`;
      if (probValidBar) probValidBar.style.width = `${ml.probability.valid}%`;

      const featContainer = document.getElementById('ml-features-container');
      if (featContainer) {
        if (ml.topFeatures && ml.topFeatures.length > 0) {
          featContainer.innerHTML = ml.topFeatures.map(f => `
            <span class="px-2.5 py-1 rounded-lg bg-[#02050e] border ${f.hoaxAssociation ? 'border-rose-500/40 text-rose-300' : 'border-sky-500/40 text-sky-300'} text-[10px] font-mono flex items-center gap-1.5 shadow-sm">
              <span class="font-bold">${f.ngram}</span>
              <span class="text-[9px] ${f.hoaxAssociation ? 'text-rose-400' : 'text-sky-400'}">(${f.weight})</span>
            </span>
          `).join('');
        } else {
          featContainer.innerHTML = '<span class="text-[10px] text-slate-500 font-mono">Pola leksikal seimbang tanpa anomali manipulasi tinggi</span>';
        }
      }
    }

    // Pembaruan Mini Peta Indonesia & Radar Sebaran Wilayah Terdampak
    updateScannerSpatialImpact(rawText, result);
  }

  function updateScannerSpatialImpact(rawText, result) {
    const impactCard = document.getElementById('scanner-spatial-impact-card');
    const badgeEl = document.getElementById('scanner-detected-region-badge');
    const regionNameVal = document.getElementById('scanner-region-name-val');
    const scoreVal = document.getElementById('scanner-region-score-val');
    const miniMapBox = document.getElementById('scanner-mini-map-box');

    if (!impactCard) return;

    const detected = detectRegionFromText(rawText);

    if (badgeEl) badgeEl.textContent = detected.badge;
    if (regionNameVal) regionNameVal.textContent = detected.name;
    if (scoreVal) {
      scoreVal.textContent = `${detected.score} / 100 (${detected.status})`;
      scoreVal.className = detected.score >= 75 ? "text-rose-400 font-bold" : "text-amber-400 font-bold";
    }

    if (window.IndonesiaDisinfoMap && typeof window.IndonesiaDisinfoMap.renderMiniMap === 'function') {
      window.IndonesiaDisinfoMap.renderMiniMap(miniMapBox, detected.provinceId);
    }
  }

  function detectRegionFromText(text) {
    const t = (text || '').toLowerCase();
    if (t.includes('jabar') || t.includes('jawa barat') || t.includes('bandung') || t.includes('bogor') || t.includes('sukabumi') || t.includes('coblong') || t.includes('cibinong') || t.includes('garut')) {
      return { provinceId: 'jawa-barat', name: 'Jawa Barat (Bandung, Bogor, Sukabumi)', badge: 'JAWA BARAT', score: 91, status: 'Waspada Sangat Tinggi' };
    }
    if (t.includes('jakarta') || t.includes('dki') || t.includes('gambir') || t.includes('pemprov dki') || t.includes('kebayoran') || t.includes('senayan')) {
      return { provinceId: 'dki-jakarta', name: 'DKI Jakarta (Pusat Pemerintahan & Finansial)', badge: 'DKI JAKARTA', score: 92, status: 'Waspada Sangat Tinggi' };
    }
    if (t.includes('jatim') || t.includes('jawa timur') || t.includes('surabaya') || t.includes('malang') || t.includes('gubeng') || t.includes('banyuwangi') || t.includes('klojen')) {
      return { provinceId: 'jawa-timur', name: 'Jawa Timur (Surabaya, Malang, Banyuwangi)', badge: 'JAWA TIMUR', score: 88, status: 'Waspada Sangat Tinggi' };
    }
    if (t.includes('jateng') || t.includes('jawa tengah') || t.includes('semarang') || t.includes('jogja') || t.includes('yogyakarta') || t.includes('sleman') || t.includes('merapi') || t.includes('surakarta') || t.includes('solo')) {
      return { provinceId: 'jawa-tengah-diy', name: 'Jawa Tengah & DI Yogyakarta (Sleman & Merapi)', badge: 'JATENG & DIY', score: 83, status: 'Waspada Sangat Tinggi' };
    }
    if (t.includes('banten') || t.includes('tangsel') || t.includes('ciputat') || t.includes('krakatau')) {
      return { provinceId: 'banten', name: 'Banten (Tangerang Selatan & Selat Sunda)', badge: 'BANTEN', score: 76, status: 'Waspada Tinggi' };
    }
    if (t.includes('ikn') || t.includes('kaltim') || t.includes('kalimantan timur') || t.includes('sepaku') || t.includes('nusantara') || t.includes('penajam')) {
      return { provinceId: 'kalimantan-timur', name: 'Kaltim & Kawasan Inti IKN Nusantara (Sepaku)', badge: 'IKN NUSANTARA', score: 82, status: 'Waspada Sangat Tinggi' };
    }
    if (t.includes('papua') || t.includes('jayapura') || t.includes('merauke') || t.includes('wamena')) {
      return { provinceId: 'papua', name: 'Papua Raya (Kota Jayapura & Sekitarnya)', badge: 'PAPUA RAYA', score: 84, status: 'Waspada Sangat Tinggi' };
    }
    if (t.includes('medan') || t.includes('sumut') || t.includes('sumatera utara') || t.includes('aceh')) {
      return { provinceId: 'sumatera-utara', name: 'Sumatera Utara & Aceh (Medan & Banda Aceh)', badge: 'SUMUT & ACEH', score: 78, status: 'Waspada Tinggi' };
    }
    if (t.includes('padang') || t.includes('sumbar') || t.includes('marapi')) {
      return { provinceId: 'sumatera-barat', name: 'Sumatera Barat (Padang & Gunung Marapi)', badge: 'SUMATERA BARAT', score: 74, status: 'Waspada Tinggi' };
    }
    if (t.includes('bali') || t.includes('kuta') || t.includes('denpasar') || t.includes('badung')) {
      return { provinceId: 'bali', name: 'Bali (Kawasan Wisata Badung & Kuta)', badge: 'BALI', score: 72, status: 'Waspada Tinggi' };
    }
    if (t.includes('makassar') || t.includes('sulsel') || t.includes('sulawesi selatan')) {
      return { provinceId: 'sulawesi-selatan', name: 'Sulawesi Selatan (Kota Makassar)', badge: 'SULAWESI SELATAN', score: 78, status: 'Waspada Tinggi' };
    }
    return { provinceId: null, name: 'Sirkulasi Nasional (Lintas Kepulauan Indonesia)', badge: 'NASIONAL', score: 82, status: 'Waspada Tinggi' };
  }

  // =========================================================================
  // 11. Analisis Domain / URL
  // =========================================================================
  if (btnScanUrl) {
    btnScanUrl.addEventListener('click', () => {
      SoundFX.click();
      const urlText = scanUrlInput.value.trim();
      if (!urlText) {
        alert("Silakan masukkan URL atau alamat situs web.");
        return;
      }

      const urlAnalysis = detector.analyzeUrl(urlText);
      urlScanResult.classList.remove('hidden');

      if (!urlAnalysis.valid) {
        urlScanResult.innerHTML = `
          <div class="p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-300 text-xs">
            <i class="fa-solid fa-circle-exclamation mr-1.5"></i> ${urlAnalysis.message}
          </div>
        `;
        return;
      }

      let badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      let icon = 'fa-circle-check';
      if (urlAnalysis.color === 'rose') {
        badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
        icon = 'fa-triangle-exclamation';
        SoundFX.alert();
      } else if (urlAnalysis.color === 'amber') {
        badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        icon = 'fa-shield-halved';
        SoundFX.click();
      } else {
        SoundFX.success();
      }

      urlScanResult.innerHTML = `
        <div class="p-4 rounded-2xl border border-slate-700 bg-slate-900/80 space-y-3">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span class="text-xs text-slate-400">Domain Terdeteksi:</span>
              <div class="font-mono font-bold text-sky-400 text-sm">${urlAnalysis.hostname}</div>
            </div>
            <span class="px-3.5 py-1.5 rounded-full text-xs font-semibold border ${badgeBg}">
              <i class="fa-solid ${icon} mr-1"></i> Skor Kredibilitas: ${urlAnalysis.score}%
            </span>
          </div>
          <div class="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div class="font-semibold text-slate-200 mb-1">${urlAnalysis.label}</div>
            <p class="text-slate-400">Tingkat Risiko: <strong class="text-${urlAnalysis.color}-400">${urlAnalysis.riskLevel}</strong></p>
          </div>
        </div>
      `;
    });
  }

  // =========================================================================
  // 12. Manajemen Laporan Audit Transparansi (Print / PDF Modal)
  // =========================================================================
  const ReportManager = {
    openPrintReport(analysisResult, rawText) {
      const reportModal = document.getElementById('report-modal');
      if (!reportModal) return;

      const reportCode = 'VRT-' + Math.floor(100000 + Math.random() * 900000);
      const dateFormatted = new Date().toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'medium'
      });

      const idEl = document.getElementById('report-id');
      if (idEl) idEl.textContent = reportCode;
      const dateEl = document.getElementById('report-date');
      if (dateEl) dateEl.textContent = dateFormatted;
      const scoreEl = document.getElementById('report-score');
      if (scoreEl) scoreEl.textContent = analysisResult.totalScore + '/100';
      const statusEl = document.getElementById('report-status');
      if (statusEl) statusEl.textContent = analysisResult.status.label;

      const reportRawContent = document.getElementById('report-raw-text');
      if (reportRawContent) {
        reportRawContent.textContent = rawText;
      }

      const reportAnnotated = document.getElementById('report-annotated-text');
      if (reportAnnotated) {
        reportAnnotated.innerHTML = analysisResult.annotatedHtml;
      }

      const metricsBody = document.getElementById('report-metrics-body');
      if (metricsBody) {
        metricsBody.innerHTML = analysisResult.metrics.map(m => `
          <tr class="border-b border-sky-500/15 font-mono text-xs">
            <td class="py-2.5 font-medium text-slate-200">${m.name}</td>
            <td class="py-2.5 text-center font-bold ${m.score >= 75 ? 'text-sky-400' : (m.score >= 50 ? 'text-cyan-400' : 'text-rose-400')}">${m.score}%</td>
            <td class="py-2.5 text-slate-400 text-[11px] font-sans">${m.desc} (Bobot: ${m.weight})</td>
          </tr>
        `).join('');
      }

      reportModal.classList.remove('hidden');
      reportModal.classList.add('flex');
    },

    closePrintReport() {
      const reportModal = document.getElementById('report-modal');
      if (reportModal) {
        reportModal.classList.add('hidden');
        reportModal.classList.remove('flex');
      }
    },

    printDocument() {
      window.print();
    }
  };

  const btnOpenReportModal = document.getElementById('btn-open-report-modal');
  const btnCloseReportModal = document.getElementById('btn-close-report-modal');
  const btnPrintReport = document.getElementById('btn-print-report');

  if (btnOpenReportModal) {
    btnOpenReportModal.addEventListener('click', () => {
      SoundFX.click();
      if (!currentAnalysis) {
        alert("Silakan lakukan pemindaian teks terlebih dahulu.");
        return;
      }
      ReportManager.openPrintReport(currentAnalysis, scanTextInput.value);
    });
  }

  if (btnCloseReportModal) {
    btnCloseReportModal.addEventListener('click', () => {
      SoundFX.click();
      ReportManager.closePrintReport();
    });
  }

  if (btnPrintReport) {
    btnPrintReport.addEventListener('click', () => {
      SoundFX.click();
      ReportManager.printDocument();
    });
  }

  // =========================================================================
  // 13. LIVE ONLINE NEWS FEED & REPOSITORI CEK FAKTA
  // =========================================================================
  async function loadLiveFactNews() {
    if (liveStatusBadge) {
      liveStatusBadge.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-sky-400"></i> Menghubungkan ke Feed Online...`;
    }

    const liveData = await db.fetchLiveOnlineNews();
    const baseVerified = db.verifiedNewsRepository || [];
    const baseFacts = db.factCheckRepository || [];

    if (liveData && liveData.length > 0) {
      activeFactCheckData = [...baseVerified, ...liveData, ...baseFacts];

      if (liveStatusBadge) {
        liveStatusBadge.innerHTML = `
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500 live-pulse-dot"></span>
          <span class="font-bold text-rose-400">LIVE ONLINE:</span> ${liveData.length} Berita Cek Fakta Hangat Terkini Terhubung
        `;
      }

      renderScannerTrendingChips(liveData.slice(0, 4));
      updateLiveTickerMarquee(liveData.slice(0, 8));
    } else {
      activeFactCheckData = [...baseVerified, ...baseFacts];
      if (liveStatusBadge) {
        liveStatusBadge.innerHTML = `
          <i class="fa-solid fa-shield-halved text-emerald-400 mr-1.5"></i>
          <span>Repositori VERITASK: Menampilkan Arsip Terverifikasi & Klarifikasi Resmi</span>
        `;
      }
    }

    applyFactFilters();
  }

  function updateLiveTickerMarquee(items) {
    const marqueeContainer = document.getElementById('live-ticker-marquee-content');
    if (!marqueeContainer) return;

    marqueeContainer.innerHTML = items.map(item => `
      <span class="inline-flex items-center gap-2 mx-6 text-xs text-slate-300 cursor-pointer hover:text-sky-400 transition-colors" onclick="document.querySelector('[data-tab=\\'database\\']').click()">
        <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px] font-bold uppercase border border-rose-500/30">KLARIFIKASI</span>
        <strong>${item.title}</strong>
        <span class="text-slate-500 font-mono text-[10px]">(${item.date})</span>
        <span class="text-slate-600">&bull;</span>
      </span>
    `).join('');
  }

  function renderScannerTrendingChips(items) {
    if (!trendingChipsContainer) return;
    trendingChipsContainer.innerHTML = `
      <div class="text-xs font-semibold text-rose-400 flex items-center gap-1.5 mb-2.5">
        <span class="w-2 h-2 rounded-full bg-rose-500 live-pulse-dot"></span>
        <span>Kabar Hangat Viral Hari Ini (Live Online):</span>
      </div>
      <div class="flex flex-wrap gap-2">
        ${items.map(it => `
          <button class="live-chip-btn px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-white/[0.08] transition-all hover:scale-[1.02] flex items-center gap-2 truncate max-w-xs shadow-sm" data-title="${it.title.replace(/"/g, '&quot;')}" data-desc="${it.explanation.replace(/"/g, '&quot;')}">
            <i class="fa-solid fa-fire text-rose-400 text-[11px]"></i>
            <span class="truncate">${it.title}</span>
          </button>
        `).join('')}
      </div>
    `;

    trendingChipsContainer.querySelectorAll('.live-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.click();
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        scanTextInput.value = `${title}\n\n${desc}`;
        const words = scanTextInput.value.trim().split(/\s+/).length;
        textWordCount.textContent = `${words} kata | ${scanTextInput.value.length} karakter (Live Feed)`;
        executeScanText();
      });
    });
  }

  function renderFactDatabase(items) {
    if (!factCardsGrid) return;
    if (items.length === 0) {
      factCardsGrid.innerHTML = `
        <div class="col-span-full text-center py-12 text-slate-400 space-y-3">
          <i class="fa-solid fa-shield-halved text-4xl text-slate-600 block"></i>
          <p class="text-sm">Tidak ada artikel yang cocok dengan filter atau kata kunci pencarian Anda.</p>
          <button class="px-4 py-2 rounded-xl bg-slate-900 text-xs font-bold text-sky-400 border border-sky-500/30 hover:bg-slate-800" onclick="document.getElementById('db-search-input').value=''; setFeedMode('all');">
            Reset Filter Pencarian
          </button>
        </div>
      `;
      return;
    }

    factCardsGrid.innerHTML = items.map(item => {
      const isVerified = item.verdictClass === 'valid' || item.isVerifiedNews === true || (item.verdict && item.verdict.toLowerCase().includes('sahih'));
      
      let cardBorderClass = isVerified
        ? 'border-emerald-500/40 bg-gradient-to-br from-[#021817] via-[#04121d] to-[#040814] verified-card-glow'
        : 'border-sky-500/20 bg-gradient-to-br from-[#040816] via-[#070e20] to-[#12050e]';

      let verdictBadge = isVerified
        ? `<span class="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full stamp-verified font-mono">
             <i class="fa-solid fa-stamp mr-1.5 text-emerald-400"></i> ${item.verdict}
           </span>`
        : `<span class="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full font-mono bg-rose-500/15 text-rose-400 border border-rose-500/40 shadow-[0_0_8px_rgba(239,68,68,0.25)]">
             <i class="fa-solid fa-triangle-exclamation mr-1.5 text-rose-500"></i> ${item.verdict}
           </span>`;

      let categoryBadge = isVerified
        ? `<span class="text-[11px] font-bold text-emerald-300 px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 font-mono flex items-center gap-1.5">
             <i class="fa-solid fa-building-columns text-emerald-400 text-[10px]"></i> ${item.sourceFact || item.category}
           </span>`
        : `<span class="text-[11px] font-semibold text-sky-400 px-3 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 font-mono">
             ${item.category}
           </span>`;

      let actionBtn = isVerified
        ? `<button class="btn-audit-from-db w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 hover:scale-[1.02]" data-title="${item.title.replace(/"/g, '&quot;')}" data-desc="${item.explanation.replace(/"/g, '&quot;')}">
             <i class="fa-solid fa-shield-check text-xs text-emerald-400"></i> Uji Keabsahan Berita Ini di Scanner
           </button>`
        : `<button class="btn-audit-from-db w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500/15 to-blue-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 hover:scale-[1.02]" data-title="${item.title.replace(/"/g, '&quot;')}" data-desc="${item.explanation.replace(/"/g, '&quot;')}">
             <i class="fa-solid fa-radar text-xs text-rose-400"></i> Uji Berita Ini di Scanner
           </button>`;

      return `
        <div class="glass-panel p-6 rounded-3xl ${cardBorderClass} glass-card-hover flex flex-col justify-between relative overflow-hidden shadow-xl hud-frame">
          ${item.isLive ? '<div class="absolute top-0 right-0 bg-gradient-to-r from-rose-600 to-red-600 text-white text-[9px] font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-md font-mono"><span class="w-1.5 h-1.5 rounded-full bg-white live-pulse-dot"></span> Live Feed</div>' : ''}
          ${isVerified ? '<div class="absolute top-0 right-0 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1 shadow-md font-mono"><i class="fa-solid fa-circle-check text-white"></i> 100% NON-HOAKS</div>' : ''}
          <div>
            <div class="flex items-center justify-between gap-2 mb-3.5 pt-1">
              ${categoryBadge}
              <span class="text-xs font-mono bg-slate-950 px-2.5 py-0.5 rounded border border-white/10 ${isVerified ? 'text-emerald-300' : 'text-sky-300'}">${item.date}</span>
            </div>
            <h3 class="text-sm font-bold text-slate-100 mb-2 leading-snug font-sans">${item.title}</h3>
            
            <div class="mb-3.5 p-3 rounded-xl bg-[#02050e] border ${isVerified ? 'border-emerald-500/20 text-slate-200' : 'border-sky-500/15 text-slate-300'} text-xs">
              <span class="${isVerified ? 'text-emerald-400' : 'text-sky-400'} text-[10px] block font-semibold uppercase tracking-wider mb-0.5 font-mono">
                ${isVerified ? 'Intisari Siaran Resmi Otoritas:' : 'Klaim / Narasi Isu:'}
              </span>
              "${item.claim}"
            </div>

            <div class="mb-3.5">
              ${verdictBadge}
            </div>

            <p class="text-xs text-slate-300 leading-relaxed mb-4">${item.explanation}</p>
          </div>
          
          <div class="space-y-3 pt-3.5 border-t border-sky-500/10">
            ${actionBtn}

            <div class="flex items-center justify-between text-xs text-slate-400">
              <span class="truncate max-w-[170px]">Rujukan: <strong class="${isVerified ? 'text-emerald-300' : 'text-slate-300'}">${item.sourceFact}</strong></span>
              <a href="${item.refUrl}" target="_blank" rel="noopener noreferrer" class="${isVerified ? 'text-emerald-400' : 'text-sky-400'} hover:underline flex items-center gap-1 font-medium shrink-0">
                Dokumen Resmi <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    factCardsGrid.querySelectorAll('.btn-audit-from-db').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.click();
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        scanTextInput.value = `${title}\n\n${desc}`;
        const words = scanTextInput.value.trim().split(/\s+/).length;
        textWordCount.textContent = `${words} kata | ${scanTextInput.value.length} karakter`;
        switchTab('scanner');
        executeScanText();
      });
    });
  }

  let selectedCategory = 'Semua';
  function applyFactFilters() {
    const query = dbSearchInput ? dbSearchInput.value.toLowerCase().trim() : '';
    const filtered = activeFactCheckData.filter(item => {
      // 1. Filter Sub-Mode: Berita Lolos Verifikasi vs Hoaks vs Semua
      let matchMode = true;
      const isItemVerified = item.verdictClass === 'valid' || item.isVerifiedNews === true || (item.verdict && item.verdict.toLowerCase().includes('sahih'));
      if (feedMode === 'verified') {
        matchMode = isItemVerified;
      } else if (feedMode === 'hoax') {
        matchMode = !isItemVerified;
      }

      // 2. Filter Kategori
      let matchCat = true;
      if (selectedCategory !== 'Semua') {
        const catL = selectedCategory.toLowerCase();
        matchCat = (item.category && item.category.toLowerCase().includes(catL)) ||
                   (item.tags && item.tags.some(t => t.toLowerCase().includes(catL))) ||
                   (item.sourceFact && item.sourceFact.toLowerCase().includes(catL));
      }

      // 3. Filter Query Pencarian
      let matchQuery = true;
      if (query) {
        matchQuery = (item.title && item.title.toLowerCase().includes(query)) ||
                     (item.claim && item.claim.toLowerCase().includes(query)) ||
                     (item.explanation && item.explanation.toLowerCase().includes(query)) ||
                     (item.sourceFact && item.sourceFact.toLowerCase().includes(query)) ||
                     (item.tags && item.tags.some(t => t.toLowerCase().includes(query)));
      }

      return matchMode && matchCat && matchQuery;
    });

    renderFactDatabase(filtered);
  }

  // Sub-navigasi Tab 3 (Mode Berita Lolos Verifikasi / Hoax / All)
  const btnModeVerified = document.getElementById('feed-mode-verified');
  const btnModeHoax = document.getElementById('feed-mode-hoax');
  const btnModeAll = document.getElementById('feed-mode-all');
  const feedModeBtns = [btnModeVerified, btnModeHoax, btnModeAll];

  function setFeedMode(mode) {
    SoundFX.click();
    feedMode = mode;
    feedModeBtns.forEach(btn => {
      if (!btn) return;
      btn.className = "feed-mode-btn px-4 py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200 border border-transparent transition-all flex items-center gap-2";
    });

    if (mode === 'verified' && btnModeVerified) {
      btnModeVerified.className = "feed-mode-btn px-4 py-2 rounded-xl font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2";
    } else if (mode === 'hoax' && btnModeHoax) {
      btnModeHoax.className = "feed-mode-btn px-4 py-2 rounded-xl font-bold bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-[0_0_12px_rgba(239,68,68,0.3)] transition-all flex items-center gap-2";
    } else if (mode === 'all' && btnModeAll) {
      btnModeAll.className = "feed-mode-btn px-4 py-2 rounded-xl font-bold bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all flex items-center gap-2";
    }

    applyFactFilters();
  }

  if (btnModeVerified) btnModeVerified.addEventListener('click', () => setFeedMode('verified'));
  if (btnModeHoax) btnModeHoax.addEventListener('click', () => setFeedMode('hoax'));
  if (btnModeAll) btnModeAll.addEventListener('click', () => setFeedMode('all'));

  if (dbSearchInput) {
    dbSearchInput.addEventListener('input', applyFactFilters);
  }

  if (btnRefreshLive) {
    btnRefreshLive.addEventListener('click', () => {
      SoundFX.scan();
      loadLiveFactNews();
    });
  }

  dbCategoryFilters.forEach(pill => {
    pill.addEventListener('click', () => {
      SoundFX.click();
      dbCategoryFilters.forEach(p => p.classList.remove('bg-sky-500', 'text-slate-950', 'font-bold'));
      pill.classList.add('bg-sky-500', 'text-slate-950', 'font-bold');
      selectedCategory = pill.getAttribute('data-category');
      applyFactFilters();
    });
  });

  loadLiveFactNews();

  // =========================================================================
  // 13b. Spatial Map Intelligence Controls (Google Maps Style & Search)
  // =========================================================================
  const btnToggleSpatialMap = document.getElementById('btn-toggle-spatial-map');
  const btnToggleChoroplethMap = document.getElementById('btn-toggle-choropleth-map');
  const spatialLeafletView = document.getElementById('spatial-leaflet-view');
  const choroplethSvgView = document.getElementById('choropleth-svg-view');
  const spatialSearchInput = document.getElementById('spatial-search-input');
  const btnSpatialSearch = document.getElementById('btn-spatial-search');
  const mapCategoryPills = document.querySelectorAll('.map-category-pill');
  const btnRecenterMap = document.getElementById('btn-recenter-map');
  const btnSwitchTile = document.getElementById('btn-switch-tile');
  const quickJumpSpatialBtns = document.querySelectorAll('.btn-quick-spatial-jump');

  if (btnToggleSpatialMap && btnToggleChoroplethMap) {
    btnToggleSpatialMap.addEventListener('click', () => {
      SoundFX.click();
      btnToggleSpatialMap.className = "px-3.5 py-2 rounded-xl font-bold bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all flex items-center gap-1.5";
      btnToggleChoroplethMap.className = "px-3.5 py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200 border border-transparent transition-all flex items-center gap-1.5";
      if (spatialLeafletView) spatialLeafletView.classList.remove('hidden');
      if (choroplethSvgView) choroplethSvgView.classList.add('hidden');
      if (window.SpatialLeafletManager) {
        window.SpatialLeafletManager.init('spatial-leaflet-map');
        if (typeof window.SpatialLeafletManager.staggeredInvalidate === 'function') {
          window.SpatialLeafletManager.staggeredInvalidate();
        }
      }
    });

    btnToggleChoroplethMap.addEventListener('click', () => {
      SoundFX.click();
      btnToggleChoroplethMap.className = "px-3.5 py-2 rounded-xl font-bold bg-sky-500/20 text-sky-400 border border-sky-500/50 shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all flex items-center gap-1.5";
      btnToggleSpatialMap.className = "px-3.5 py-2 rounded-xl font-semibold text-slate-400 hover:text-slate-200 border border-transparent transition-all flex items-center gap-1.5";
      if (choroplethSvgView) choroplethSvgView.classList.remove('hidden');
      if (spatialLeafletView) spatialLeafletView.classList.add('hidden');
      if (window.IndonesiaDisinfoMap) {
        window.IndonesiaDisinfoMap.init('indonesia-map-container');
      }
    });
  }

  // Tombol Pusatkan Peta Nusantara
  if (btnRecenterMap) {
    btnRecenterMap.addEventListener('click', () => {
      if (window.SpatialLeafletManager && typeof window.SpatialLeafletManager.recenterMap === 'function') {
        window.SpatialLeafletManager.recenterMap();
      }
    });
  }

  // Tombol Ganti Lapisan Tile (Satelit <-> Cyber Dark <-> OSM)
  if (btnSwitchTile && !btnSwitchTile._boundInApp) {
    btnSwitchTile._boundInApp = true;
    btnSwitchTile.addEventListener('click', () => {
      // Setup listener handled in map-data.js setupListeners to prevent double cycling
    });
  }

  // Quick Jump Presets (Bandung, Jakarta, Surabaya, Sleman, IKN, Jayapura)
  quickJumpSpatialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ptId = btn.getAttribute('data-pt-id');
      SoundFX.click();
      if (window.SpatialLeafletManager && typeof window.SpatialLeafletManager.flyToLocation === 'function') {
        window.SpatialLeafletManager.flyToLocation(ptId);
      }
      if (window.IndonesiaDisinfoMap) {
        const pt = window.IndonesiaDisinfoMap.spatialPoints.find(p => p.id === ptId);
        if (pt) window.IndonesiaDisinfoMap.selectSpatialPoint(pt);
      }
    });
  });

  function executeSpatialSearch() {
    const query = spatialSearchInput ? spatialSearchInput.value.trim() : '';
    if (!query) return;
    SoundFX.scan();
    
    // Cari di dataset titik spasial kecamatan / kabupaten
    if (window.IndonesiaDisinfoMap) {
      const q = query.toLowerCase();
      const ptMatch = window.IndonesiaDisinfoMap.spatialPoints.find(p =>
        p.kecamatan.toLowerCase().includes(q) ||
        p.kabupaten.toLowerCase().includes(q) ||
        p.provinsi.toLowerCase().includes(q) ||
        p.topRumor.toLowerCase().includes(q)
      );

      if (ptMatch) {
        window.IndonesiaDisinfoMap.selectSpatialPoint(ptMatch);
        if (window.SpatialLeafletManager && typeof window.SpatialLeafletManager.flyToLocation === 'function') {
          window.SpatialLeafletManager.flyToLocation(ptMatch.id);
        }
        return;
      }

      // Cari di dataset provinsi
      const provMatch = window.IndonesiaDisinfoMap.provinces.find(p =>
        p.name.toLowerCase().includes(q) ||
        p.island.toLowerCase().includes(q)
      );

      if (provMatch) {
        window.IndonesiaDisinfoMap.selectProvince(provMatch.id);
        return;
      }
    }

    if (window.SpatialLeafletManager) {
      const found = window.SpatialLeafletManager.searchLocation(query);
      if (found) return;
    }

    alert(`Titik "${query}" tidak ditemukan dalam radar spasial. Silakan coba cari kata kunci lain seperti: Coblong, Cibinong, Gambir, Sleman, IKN, Jayapura, atau Surabaya.`);
  }

  if (btnSpatialSearch) {
    btnSpatialSearch.addEventListener('click', executeSpatialSearch);
  }
  if (spatialSearchInput) {
    spatialSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') executeSpatialSearch();
    });
  }

  mapCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      SoundFX.click();
      mapCategoryPills.forEach(p => {
        p.className = "map-category-pill px-3.5 py-1.5 rounded-full text-xs font-medium transition-all bg-slate-900 text-slate-400 hover:text-slate-200 border border-sky-500/20 font-mono";
      });
      pill.className = "map-category-pill px-3.5 py-1.5 rounded-full text-xs font-bold transition-all bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_12px_rgba(14,165,233,0.3)] font-mono";
      const cat = pill.getAttribute('data-map-category');
      if (window.SpatialLeafletManager) {
        window.SpatialLeafletManager.filterByCategory(cat);
      }
      if (window.IndonesiaDisinfoMap) {
        window.IndonesiaDisinfoMap.filterByCategory(cat);
      }
    });
  });

  loadLiveFactNews();

  // =========================================================================
  // 14. Dashboard Statistik Transparansi
  // =========================================================================
  function renderTransparencyDashboard() {
    const stats = db.transparencyStats;
    const catContainer = document.getElementById('stats-categories-container');
    const channelContainer = document.getElementById('stats-channels-container');

    if (catContainer) {
      catContainer.innerHTML = stats.categories.map(c => `
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-300 font-medium">${c.name}</span>
            <span class="font-bold text-slate-100">${c.percentage}% <span class="text-slate-500 font-normal">(${c.count.toLocaleString('id-ID')} kasus)</span></span>
          </div>
          <div class="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div class="h-full rounded-full transition-all duration-1000" style="width: ${c.percentage}%; background-color: ${c.color}"></div>
          </div>
        </div>
      `).join('');
    }

    if (channelContainer) {
      channelContainer.innerHTML = stats.distributionChannels.map(ch => `
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/60 border border-white/[0.06] hover:border-slate-700 transition-colors">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
              <i class="fa-brands ${ch.icon} text-base"></i>
            </div>
            <span class="text-xs font-semibold text-slate-200">${ch.channel}</span>
          </div>
          <span class="text-xs font-bold text-slate-100 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">${ch.percentage}%</span>
        </div>
      `).join('');
    }
  }
  renderTransparencyDashboard();

  // =========================================================================
  // 15. Mockup Interaktif WhatsApp Bot Simulator
  // =========================================================================
  const waToggleBtn = document.getElementById('wa-toggle-btn');
  const waChatWindow = document.getElementById('wa-chat-window');
  const waCloseBtn = document.getElementById('wa-close-btn');
  const waChatBody = document.getElementById('wa-chat-body');
  const waInputMsg = document.getElementById('wa-input-msg');
  const waSendBtn = document.getElementById('wa-send-btn');
  const waTypingIndicator = document.getElementById('wa-typing-indicator');
  const waQuickChips = document.querySelectorAll('.wa-quick-chip');

  if (waToggleBtn && waChatWindow) {
    waToggleBtn.addEventListener('click', () => {
      SoundFX.click();
      waChatWindow.classList.toggle('hidden');
    });
  }

  if (waCloseBtn && waChatWindow) {
    waCloseBtn.addEventListener('click', () => {
      SoundFX.click();
      waChatWindow.classList.add('hidden');
    });
  }

  function appendWaMessage(text, isUser = false) {
    const bubble = document.createElement('div');
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    bubble.className = isUser 
      ? "wa-bubble-user p-3 text-xs max-w-[85%] mb-2.5 shadow-sm relative leading-relaxed"
      : "wa-bubble-bot p-3 text-xs max-w-[85%] mb-2.5 shadow-sm relative leading-relaxed";

    bubble.innerHTML = `
      <div>${text}</div>
      <div class="text-[9px] text-slate-400 text-right mt-1 font-mono">${timeStr} ${isUser ? '<i class="fa-solid fa-check-double text-sky-400 ml-0.5"></i>' : ''}</div>
    `;

    waChatBody.appendChild(bubble);
    waChatBody.scrollTop = waChatBody.scrollHeight;
  }

  async function handleWaSend(text) {
    if (!text || !text.trim()) return;
    SoundFX.click();
    appendWaMessage(text.trim(), true);
    if (waInputMsg) waInputMsg.value = '';

    if (waTypingIndicator) {
      waTypingIndicator.classList.remove('hidden');
      waChatBody.scrollTop = waChatBody.scrollHeight;
    }

    setTimeout(() => {
      if (waTypingIndicator) waTypingIndicator.classList.add('hidden');
      
      const analysis = detector.analyzeText(text);
      if (analysis.totalScore >= 75) SoundFX.success();
      else if (analysis.totalScore < 50) SoundFX.alert();

      const ml = detector.analyzeWithML ? detector.analyzeWithML(text) : null;
      let replyHtml = `
        <strong>🔍 HASIL VERIFIKASI VERITASK AI:</strong><br>
        Skor Kredibilitas: <strong>${analysis.totalScore}/100</strong><br>
        Status: <strong>${analysis.status.label}</strong><br>
        ${ml ? `<span style="font-size:10px; color:#38bdf8; font-family:monospace;">[ML Core: P(Hoaks)=${ml.probability.hoax}%, P(Valid)=${ml.probability.valid}%]</span><br>` : ''}<br>
        ${analysis.status.summary}<br><br>
      `;

      if (analysis.totalScore < 50) {
        replyHtml += `⚠️ <em>Peringatan: Hindari meneruskan pesan ini ke grup WA lain untuk mencegah kepanikan / penipuan.</em>`;
      } else {
        replyHtml += `✅ <em>Informasi menunjukkan karakteristik yang wajar. Tetap verifikasi rujukan primer.</em>`;
      }

      appendWaMessage(replyHtml, false);
    }, 750);
  }

  if (waSendBtn && waInputMsg) {
    waSendBtn.addEventListener('click', () => handleWaSend(waInputMsg.value));
    waInputMsg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleWaSend(waInputMsg.value);
    });
  }

  waQuickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const msg = chip.getAttribute('data-msg');
      handleWaSend(msg);
    });
  });

  const initialArticle = db.sampleArticles[0];
  const initialAnalysis = detector.analyzeText(initialArticle.text);

  // Pre-render peta sebaran Indonesia & Spatial GIS
  if (window.SpatialLeafletManager && document.getElementById('spatial-leaflet-map')) {
    window.SpatialLeafletManager.init('spatial-leaflet-map');
  }
  if (window.IndonesiaDisinfoMap && document.getElementById('indonesia-map-container')) {
    window.IndonesiaDisinfoMap.init('indonesia-map-container');
  }
});
