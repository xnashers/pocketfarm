import { gameState } from '../state.js';
import { WEATHER_CHANGE_INTERVAL } from '../data/weather.js';

export function createWeatherDisplay() {
  const container = document.createElement('div');
  container.className = 'flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-white/5 mb-3';

  let timerInterval = null;

  function formatCountdown(ms) {
    const secs = Math.ceil(ms / 1000);
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  }

  function update() {
    const weather = gameState.currentWeather;
    if (!weather) {
      container.innerHTML = '<span class="text-sm text-slate-500">☀️ Checking weather...</span>';
      return;
    }

    const remaining = gameState.getWeatherTimeRemaining();

    container.innerHTML = `
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-2xl flex-shrink-0">${weather.emoji}</span>
        <div class="min-w-0">
          <div class="font-semibold text-white text-sm">${weather.name}</div>
          <div class="text-xs text-purple-400">${weather.mutationEmoji} ${weather.mutation} · x${weather.multiplier}</div>
        </div>
      </div>
      <div class="text-xs text-slate-500 tabular-nums flex-shrink-0">⏱ ${formatCountdown(remaining)}</div>
    `;
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(update, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  gameState.on('weatherChange', update);
  update();
  startTimer();

  return { element: container, update, startTimer, stopTimer };
}
