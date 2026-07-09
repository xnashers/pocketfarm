// Background music player — plays data/music.mp3
let audio = null;
let isPlaying = false;

function getAudio() {
  if (!audio) {
    audio = new Audio('data/music.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
  }
  return audio;
}

export function startMusic() {
  if (isPlaying) return;
  const a = getAudio();
  a.play().then(() => {
    isPlaying = true;
  }).catch(() => {
    // Autoplay blocked — user must click the music button
    isPlaying = false;
  });
}

export function stopMusic() {
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  isPlaying = false;
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
