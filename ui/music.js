// Ambient farm background music using Web Audio API
// Gentle pentatonic melody + warm pad chords

let audioCtx = null;
let masterGain = null;
let isPlaying = false;
let melodyTimeout = null;
let padOscillators = [];

// Pentatonic scale notes (C major pentatonic, octave 4 & 5) — peaceful farm feel
const MELODY_NOTES = [
  261.63, 293.66, 329.63, 392.00, 440.00, // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.00, // C5 D5 E5 G5 A5
];

// Chord progressions (I - vi - IV - V in C major, gentle farm vibes)
const CHORDS = [
  [261.63, 329.63, 392.00], // C major
  [220.00, 261.63, 329.63], // Am
  [174.61, 261.63, 329.63], // F major
  [196.00, 246.94, 293.66], // G major
];

let chordIndex = 0;
let chordTimer = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.15;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

function ensureReady() {
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();
}

// Play a warm pad chord
function playPad(chord) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  // Fade out old pads
  for (const osc of padOscillators) {
    try {
      osc.gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.osc.stop(now + 1.6);
    } catch (_) {}
  }
  padOscillators = [];

  // Create new pad voices
  for (const freq of chord) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = freq * 0.5; // One octave lower for warmth

    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);
    osc.start(now);

    padOscillators.push({ osc, gain });
  }
}

// Play a single gentle melody note
function playMelodyNote(freq, duration = 0.8) {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.frequency.value = 1200;

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.03, now + duration * 0.5);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.1);
}

// Random gentle melody pattern
function playMelody() {
  if (!isPlaying) return;

  const noteCount = 2 + Math.floor(Math.random() * 3); // 2-4 notes per phrase
  let delay = 0;

  for (let i = 0; i < noteCount; i++) {
    const noteIdx = Math.floor(Math.random() * MELODY_NOTES.length);
    const duration = 0.5 + Math.random() * 0.8;
    const spacing = 0.3 + Math.random() * 0.5;

    setTimeout(() => {
      if (isPlaying) playMelodyNote(MELODY_NOTES[noteIdx], duration);
    }, delay * 1000);

    delay += spacing;
  }

  // Schedule next phrase with a pause
  const nextDelay = delay + 1.5 + Math.random() * 3; // 1.5-4.5s pause between phrases
  melodyTimeout = setTimeout(playMelody, nextDelay * 1000);
}

// Cycle chords every 4 beats
function startChords() {
  playPad(CHORDS[chordIndex]);
  chordTimer = setInterval(() => {
    if (!isPlaying) return;
    chordIndex = (chordIndex + 1) % CHORDS.length;
    playPad(CHORDS[chordIndex]);
  }, 4000); // 4 seconds per chord (slow, gentle)
}

export function startMusic() {
  if (isPlaying) return;
  ensureReady();
  isPlaying = true;

  chordIndex = 0;
  startChords();

  // Start melody after a short intro
  melodyTimeout = setTimeout(playMelody, 2000);
}

export function stopMusic() {
  isPlaying = false;

  if (melodyTimeout) {
    clearTimeout(melodyTimeout);
    melodyTimeout = null;
  }

  if (chordTimer) {
    clearInterval(chordTimer);
    chordTimer = null;
  }

  const ctx = getCtx();
  const now = ctx.currentTime;

  // Fade out pads
  for (const osc of padOscillators) {
    try {
      osc.gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.osc.stop(now + 0.6);
    } catch (_) {}
  }
  padOscillators = [];
}

export function toggleMusic() {
  if (isPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
  return isPlaying;
}

export function isMusicPlaying() {
  return isPlaying;
}

// Create a floating music toggle button
export function createMusicButton() {
  const btn = document.createElement('button');
  btn.className = 'fixed bottom-20 right-3 z-40 w-10 h-10 rounded-full bg-slate-800/90 border border-white/10 flex items-center justify-center text-lg shadow-lg transition active:scale-90 hover:bg-slate-700/90';
  btn.setAttribute('aria-label', 'Toggle music');
  btn.textContent = '🔇';

  btn.addEventListener('click', () => {
    const playing = toggleMusic();
    btn.textContent = playing ? '🎵' : '🔇';
    btn.className = btn.className.replace(
      playing ? 'bg-slate-800/90' : 'bg-green-800/90',
      playing ? 'bg-green-800/90' : 'bg-slate-800/90'
    );
    if (playing) {
      btn.classList.add('music-pulse');
    } else {
      btn.classList.remove('music-pulse');
    }
  });

  return btn;
}
