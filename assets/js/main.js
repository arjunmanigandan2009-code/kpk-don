/**
 * PRAVEEN KUMAR K ("KPK DON") - OFFICIAL PORTFOLIO JAVASCRIPT
 * Features:
 * - Dynamic Ambient Particle Canvas
 * - Web Audio API Synthesizer & Audio Lounge
 * - Realtime Audio Waveform Visualizer
 * - Interactive Pencil Shading Studio Canvas
 * - Gallery Filtering & Lightbox Modal
 * - Animated Number Counters & Dynamic Text
 * - WhatsApp Quick Booking Generator
 */

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  initDynamicRole();
  initAudioStudio();
  initPencilPlayground();
  initGalleryAndLightbox();
  initCounterAnimations();
  initNavigation();
  initContactForm();
});

/* ==========================================================================
   1. AMBIENT BACKGROUND PARTICLES
   ========================================================================== */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.2, // float upwards like gold dust & graphite specks
      color: Math.random() > 0.6 ? 'rgba(245, 158, 11, ' : 'rgba(203, 213, 225, ',
      alpha: Math.random() * 0.4 + 0.1,
      fadeSpeed: Math.random() * 0.005 + 0.002
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   2. DYNAMIC ROLE CYCLER
   ========================================================================== */
function initDynamicRole() {
  const target = document.querySelector('.dynamic-role');
  if (!target) return;

  const roles = [
    "Playback Singer & Vocal Artist",
    "Master Pencil Shading Artist",
    "Academic Topper & Gold Medalist",
    "The Polymath 'KPK DON'"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 100;

  function typeEffect() {
    const current = roles[roleIdx];
    if (isDeleting) {
      target.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 40;
    } else {
      target.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 90;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(typeEffect, delay);
  }

  typeEffect();
}

/* ==========================================================================
   3. WEB AUDIO API SYNTHESIZER & AUDIO LOUNGE
   Produces soothing, melodic acoustic-like arpeggios natively in browser!
   ========================================================================== */
let audioCtx = null;
let isAudioPlaying = false;
let synthTimer = null;
let currentTrackIdx = 0;
let masterGain = null;
let analyserNode = null;

const trackList = [
  {
    title: "Symphony of the Soul",
    genre: "Playback Style • Cinematic Melody",
    scale: [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33], // C Major Pentatonic / Melodic
    tempo: 480,
    duration: "3:45"
  },
  {
    title: "Graphite & Strings",
    genre: "Acoustic Serenade • Soulful Guitar Tone",
    scale: [220.00, 261.63, 293.66, 329.63, 392.00, 440.00], // A Minor Soul
    tempo: 520,
    duration: "4:12"
  },
  {
    title: "Golden Horizons",
    genre: "Semi-Classical Fusion • Emotional Resonance",
    scale: [293.66, 329.63, 369.99, 440.00, 493.88, 587.33], // D Major Lydian warmth
    tempo: 420,
    duration: "3:58"
  },
  {
    title: "Midnight Studio Reflections",
    genre: "Unplugged Nocturne • Deep Intonation",
    scale: [196.00, 246.94, 293.66, 329.63, 392.00, 440.00], // G Melodic Deep
    tempo: 600,
    duration: "4:30"
  }
];

function initAudioStudio() {
  const playPauseBtn = document.getElementById('playPauseBtn');
  const navAudioToggle = document.getElementById('navAudioToggle');
  const volumeSlider = document.getElementById('volumeSlider');
  const trackItems = document.querySelectorAll('.track-item');
  const nowPlayingTitle = document.getElementById('nowPlayingTitle');
  const nowPlayingGenre = document.getElementById('nowPlayingGenre');

  function setupAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 64;

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

      masterGain.connect(analyserNode);
      analyserNode.connect(audioCtx.destination);

      startVisualizer();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playNote(freq, dur = 1.2) {
    if (!audioCtx || !isAudioPlaying) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Warm acoustic harmonics
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now); // Second harmonic shimmer

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + dur);

      // Emulate acoustic pluck & vocal sustain envelope
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(0.25, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now);
      osc2.start(now);
      osc.stop(now + dur);
      osc2.stop(now + dur);
    } catch (e) {
      console.warn("Audio note play exception:", e);
    }
  }

  function playArpeggio() {
    if (!isAudioPlaying) return;
    const track = trackList[currentTrackIdx];
    const scale = track.scale;
    const randomNote = scale[Math.floor(Math.random() * scale.length)];
    playNote(randomNote, 1.4);

    synthTimer = setTimeout(playArpeggio, track.tempo);
  }

  let trackElapsedSec = 0;
  let trackTimer = null;
  const trackTimeCurrentEl = document.getElementById('trackTimeCurrent');
  const trackTimeTotalEl = document.getElementById('trackTimeTotal');

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function startPlayback() {
    setupAudioContext();
    isAudioPlaying = true;
    updateUIPlayState(true);
    playArpeggio();

    if (trackTimer) clearInterval(trackTimer);
    trackTimer = setInterval(() => {
      if (isAudioPlaying) {
        trackElapsedSec++;
        if (trackTimeCurrentEl) {
          trackTimeCurrentEl.textContent = formatTime(trackElapsedSec);
        }
      }
    }, 1000);
  }

  function pausePlayback() {
    isAudioPlaying = false;
    clearTimeout(synthTimer);
    if (trackTimer) clearInterval(trackTimer);
    updateUIPlayState(false);
  }

  function togglePlay() {
    if (isAudioPlaying) {
      pausePlayback();
    } else {
      startPlayback();
    }
  }

  function updateUIPlayState(playing) {
    if (playPauseBtn) {
      playPauseBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
      if (playing) {
        playPauseBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
          </svg>`;
      } else {
        playPauseBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>`;
      }
    }

    if (navAudioToggle) {
      if (playing) {
        navAudioToggle.classList.add('playing');
        navAudioToggle.querySelector('.btn-label').textContent = 'Live Studio Audio';
      } else {
        navAudioToggle.classList.remove('playing');
        navAudioToggle.querySelector('.btn-label').textContent = 'Studio Audio';
      }
    }
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  if (navAudioToggle) {
    navAudioToggle.addEventListener('click', togglePlay);
  }

  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
      }
    });
  }

  trackItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
      trackItems.forEach(t => t.classList.remove('active'));
      item.classList.add('active');
      currentTrackIdx = idx;
      trackElapsedSec = 0;
      if (trackTimeCurrentEl) trackTimeCurrentEl.textContent = '00:00';
      const track = trackList[idx];
      if (nowPlayingTitle) nowPlayingTitle.textContent = track.title;
      if (nowPlayingGenre) nowPlayingGenre.textContent = track.genre;
      if (trackTimeTotalEl) trackTimeTotalEl.textContent = track.duration;

      if (isAudioPlaying) {
        clearTimeout(synthTimer);
        playArpeggio();
      } else {
        startPlayback();
      }
    });
  });

  // Visualizer renderer
  function startVisualizer() {
    const canvas = document.getElementById('audioVisualizerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function drawVisualizer() {
      requestAnimationFrame(drawVisualizer);

      const width = canvas.width = canvas.clientWidth;
      const height = canvas.height = canvas.clientHeight;

      if (!isAudioPlaying) {
        ctx.clearRect(0, 0, width, height);
        // Draw calm baseline wave
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x += 10) {
          ctx.lineTo(x, height / 2 + Math.sin(x * 0.04 + Date.now() * 0.002) * 3);
        }
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }

      analyserNode.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.9;

        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#f97316');
        gradient.addColorStop(0.6, '#f59e0b');
        gradient.addColorStop(1, '#fef08a');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);

        x += barWidth;
      }
    }

    drawVisualizer();
  }
}

/* ==========================================================================
   4. INTERACTIVE PENCIL SHADING CANVAS (PLAYGROUND)
   ========================================================================== */
function initPencilPlayground() {
  const canvas = document.getElementById('pencilCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    clearPaper();
  }

  function clearPaper() {
    const rect = canvas.getBoundingClientRect();
    // Warm creamy art paper tone
    ctx.fillStyle = '#fdfbf7';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle paper grain texture
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1, 1);
    }
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);

  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Tools & pencil grades
  const pencilGrades = {
    '2H': { color: 'rgba(75, 85, 99, 0.18)', width: 2, blend: 'source-over' },
    'HB': { color: 'rgba(51, 65, 85, 0.35)', width: 3, blend: 'source-over' },
    '2B': { color: 'rgba(30, 41, 59, 0.55)', width: 4, blend: 'source-over' },
    '6B': { color: 'rgba(15, 23, 42, 0.8)', width: 6, blend: 'source-over' },
    'CHARCOAL': { color: 'rgba(5, 5, 5, 0.95)', width: 8, blend: 'source-over' },
    'SMUDGE': { color: 'rgba(253, 251, 247, 0.15)', width: 14, blend: 'destination-out' },
    'ERASER': { color: '#fdfbf7', width: 16, blend: 'source-over' }
  };

  let activeGrade = '2B';

  const gradeButtons = document.querySelectorAll('.pencil-grade-btn');
  gradeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      gradeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeGrade = btn.getAttribute('data-grade');
    });
  });

  const clearBtn = document.getElementById('clearCanvasBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearPaper);
  }

  const downloadBtn = document.getElementById('downloadCanvasBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = `kpk-pencil-sketch-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function startDraw(e) {
    isDrawing = true;
    const pos = getPos(e);
    lastX = pos.x;
    lastY = pos.y;
    drawPoint(pos.x, pos.y);
  }

  function drawPoint(x, y) {
    const grade = pencilGrades[activeGrade] || pencilGrades['2B'];
    ctx.save();
    ctx.globalCompositeOperation = grade.blend;
    ctx.fillStyle = grade.color;
    ctx.beginPath();
    ctx.arc(x, y, grade.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const pos = getPos(e);
    const grade = pencilGrades[activeGrade] || pencilGrades['2B'];

    ctx.save();
    ctx.globalCompositeOperation = grade.blend;
    ctx.strokeStyle = grade.color;
    ctx.lineWidth = grade.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    // Subtle graphite dusting texture around strokes
    if (activeGrade === '6B' || activeGrade === 'CHARCOAL') {
      for (let i = 0; i < 3; i++) {
        const scatterX = pos.x + (Math.random() - 0.5) * grade.width * 2;
        const scatterY = pos.y + (Math.random() - 0.5) * grade.width * 2;
        ctx.fillStyle = grade.color;
        ctx.fillRect(scatterX, scatterY, 1, 1);
      }
    }

    ctx.restore();

    lastX = pos.x;
    lastY = pos.y;
  }

  function stopDraw() {
    isDrawing = false;
  }

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  window.addEventListener('mouseup', stopDraw);

  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  window.addEventListener('touchend', stopDraw);
}

/* ==========================================================================
   5. GALLERY FILTER & LIGHTBOX MODAL
   ========================================================================== */
function initGalleryAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const artCards = document.querySelectorAll('.art-card');
  const modal = document.getElementById('lightboxModal');
  const modalClose = document.getElementById('lightboxCloseBtn');
  const modalImg = document.getElementById('lightboxImg');
  const modalTitle = document.getElementById('lightboxTitle');
  const modalMedium = document.getElementById('lightboxMedium');
  const modalDesc = document.getElementById('lightboxDesc');
  const modalPencilGrade = document.getElementById('lightboxPencilGrade');

  // Filter gallery
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      artCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Open Lightbox
  artCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.getAttribute('data-title') || 'Masterpiece Artwork';
      const medium = card.getAttribute('data-medium') || 'Graphite & Charcoal on Paper';
      const desc = card.getAttribute('data-desc') || 'Created with precision shading layers.';
      const grade = card.getAttribute('data-grade') || '2H, 2B, 6B, 8B & Blending Stumps';

      if (modalImg) modalImg.src = img.src;
      if (modalTitle) modalTitle.textContent = title;
      if (modalMedium) modalMedium.textContent = medium;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalPencilGrade) modalPencilGrade.textContent = grade;

      if (modal) modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. ANIMATED COUNTERS
   ========================================================================== */
function initCounterAnimations() {
  const counterElements = document.querySelectorAll('.stat-count');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counterElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let count = 0;
          const duration = 1600;
          const step = Math.ceil(target / (duration / 25));

          const interval = setInterval(() => {
            count += step;
            if (count >= target) {
              count = target;
              clearInterval(interval);
            }
            el.textContent = count + suffix;
          }, 25);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.hero-stats-row');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   7. NAVIGATION & HEADER CONTROLS
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.getElementById('mobileMenuToggle');
  const navLinks = document.querySelector('.nav-links');
  const backToTop = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* ==========================================================================
   8. CONTACT FORM & WHATSAPP GENERATOR
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('bookingForm');
  const feedbackMsg = document.getElementById('formFeedback');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const service = document.getElementById('serviceType').value;
    const phone = document.getElementById('clientPhone').value.trim();
    const details = document.getElementById('projectDetails').value.trim();

    if (!name || !details) {
      alert('Please fill out your name and project details.');
      return;
    }

    // Format WhatsApp message
    const message = `Hello Praveen Kumar (KPK DON)!\n\n` +
      `My Name: ${name}\n` +
      `Interest: ${service}\n` +
      `Phone/Contact: ${phone}\n` +
      `Project Details: ${details}\n\n` +
      `Looking forward to collaborating with you!`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encoded}`;

    if (feedbackMsg) {
      feedbackMsg.style.display = 'block';
      feedbackMsg.innerHTML = `
        <div style="background: rgba(34, 197, 94, 0.15); border: 1px solid #4ade80; color: #4ade80; padding: 14px; border-radius: 8px; margin-top: 15px;">
          ✓ Inquiry prepared! Launching WhatsApp to send your message directly to KPK DON...
        </div>
      `;
    }

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      form.reset();
    }, 1000);
  });
}
