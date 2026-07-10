// ═══════════════════════════════════════════
// SOUND EFFECTS (Web Audio API)
// ═══════════════════════════════════════════

let audioCtx = null;

function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function ensureReady() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
}

['touchstart', 'click', 'keydown'].forEach(ev => {
  document.addEventListener(ev, ensureReady, { once: true });
});

function tone(freq, dur, type = 'sine', vol = 0.10, delay = 0) {
  try {
    const ctx = getCtx();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur);
  } catch (_) { /* silent */ }
}

export function playSound(type) {
  try {
    ensureReady();
    switch (type) {
      case 'plant':
        tone(520, 0.12, 'sine', 0.10);
        tone(680, 0.15, 'sine', 0.08, 0.06);
        break;
      case 'harvest':
        tone(523, 0.12, 'sine', 0.10);
        tone(659, 0.12, 'sine', 0.10, 0.06);
        tone(784, 0.15, 'sine', 0.10, 0.12);
        tone(1047, 0.25, 'sine', 0.08, 0.18);
        tone(1319, 0.20, 'sine', 0.05, 0.25);
        break;
      case 'buy':
        tone(1200, 0.08, 'square', 0.05);
        tone(1600, 0.08, 'square', 0.04, 0.05);
        tone(2000, 0.15, 'sine', 0.07, 0.10);
        break;
      case 'sell':
        tone(800, 0.08, 'triangle', 0.06);
        tone(1000, 0.08, 'triangle', 0.05, 0.06);
        tone(1200, 0.08, 'triangle', 0.05, 0.12);
        tone(1600, 0.20, 'sine', 0.08, 0.18);
        break;
      case 'click':
        tone(400, 0.06, 'sine', 0.05);
        break;
      case 'error':
        tone(200, 0.15, 'sawtooth', 0.05);
        tone(180, 0.20, 'sawtooth', 0.04, 0.10);
        break;
      case 'levelup':
        tone(523, 0.15, 'sine', 0.08);
        tone(659, 0.15, 'sine', 0.08, 0.10);
        tone(784, 0.15, 'sine', 0.08, 0.20);
        tone(1047, 0.30, 'sine', 0.10, 0.30);
        break;
      case 'weather':
        tone(300, 0.30, 'sine', 0.05);
        tone(450, 0.30, 'sine', 0.04, 0.10);
        tone(600, 0.20, 'sine', 0.03, 0.20);
        break;
      case 'peso':
        tone(880, 0.08, 'sine', 0.06);
        tone(1100, 0.08, 'sine', 0.05, 0.05);
        tone(1320, 0.15, 'sine', 0.07, 0.10);
        break;
      case 'buzzer':
        tone(180, 0.25, 'sawtooth', 0.08);
        tone(140, 0.30, 'sawtooth', 0.06, 0.12);
        tone(100, 0.20, 'square', 0.04, 0.25);
        break;
    }
  } catch (_) { /* silent */ }
}

// ═══════════════════════════════════════════
// BACKGROUND MUSIC
// ═══════════════════════════════════════════

let audio = null;
let isPlaying = false;
let muteBtnRef = null;

function getAudio() {
  if (!audio) {
    audio = new Audio('data/music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
  }
  return audio;
}

function updateBtn() {
  const btn = muteBtnRef;
  if (!btn) return;
  btn.textContent = isPlaying ? '🎵' : '🔇';
  btn.classList.toggle('bg-green-800/90', isPlaying);
  btn.classList.toggle('bg-slate-800/90', !isPlaying);
  btn.classList.toggle('music-pulse', isPlaying);
}

export function startMusic() {
  if (isPlaying) return;
  const a = getAudio();
  a.play().then(() => { isPlaying = true; updateBtn(); }).catch(() => { isPlaying = false; updateBtn(); });
}

export function stopMusic() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
  updateBtn();
}

export function toggleMusic() {
  if (isPlaying) stopMusic(); else startMusic();
  return isPlaying;
}

export function isMusicPlaying() { return isPlaying; }

function tryAutoplay() {
  const a = getAudio();
  a.play().then(() => { isPlaying = true; updateBtn(); }).catch(() => {
    const onInteract = () => {
      document.removeEventListener('pointerdown', onInteract);
      document.removeEventListener('keydown', onInteract);
      startMusic();
    };
    document.addEventListener('pointerdown', onInteract, { once: true });
    document.addEventListener('keydown', onInteract, { once: true });
  });
}

export function createMusicButton() {
  const btn = document.createElement('button');
  btn.className = 'fixed bottom-20 right-3 z-40 w-10 h-10 rounded-full bg-slate-800/90 border border-white/10 flex items-center justify-center text-lg shadow-lg transition active:scale-90 hover:bg-slate-700/90';
  btn.setAttribute('aria-label', 'Toggle music');
  btn.textContent = '🔇';
  muteBtnRef = btn;
  btn.addEventListener('click', () => { toggleMusic(); });
  tryAutoplay();
  return btn;
}

// ═══════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════

let container = null;

export function initToast() {
  container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none';
  document.body.appendChild(container);
}

export function showToast(message, type = 'success') {
  if (!container) initToast();
  const el = document.createElement('div');
  const colors = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    gold: 'bg-yellow-500 text-slate-900',
    warning: 'bg-amber-600 text-white',
  };
  el.className = `${colors[type] || colors.success} px-4 py-2 rounded-xl text-sm font-semibold shadow-lg pointer-events-auto animate-fade-in`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('animate-fade-out');
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

export function showBigToast(message, type = 'gold') {
  if (!container) initToast();
  const el = document.createElement('div');
  const colors = {
    success: 'bg-green-600 text-white border-green-400',
    error: 'bg-red-600 text-white border-red-400',
    info: 'bg-blue-600 text-white border-blue-400',
    gold: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-900 border-yellow-300',
    warning: 'bg-amber-600 text-white border-amber-400',
  };
  el.className = `${colors[type] || colors.gold} px-5 py-3 rounded-2xl text-base font-bold shadow-2xl border-2 pointer-events-auto animate-fade-in flex items-center gap-2`;
  el.innerHTML = `<span class="text-xl">${message}</span>`;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('animate-fade-out');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}
