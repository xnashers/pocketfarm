import { gameState } from '../state.js';
import { playSound } from './sounds.js';
import { showToast } from './toast.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function showLoginRewardPopup() {
  const reward = gameState.pendingLoginReward;
  if (!reward) return;

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4';

  const card = document.createElement('div');
  card.className = 'bg-slate-900 rounded-2xl border border-slate-700 p-5 w-full max-w-sm shadow-2xl animate-fade-in text-center';

  const { daily, monthly } = reward;

  card.innerHTML = `
    <div class="text-4xl mb-3">📅</div>
    <h2 class="text-lg font-bold text-slate-100 mb-1">Welcome Back!</h2>
    <p class="text-xs text-slate-400 mb-4">Day ${gameState.loginRewards.streak} Login Streak</p>

    <div class="bg-slate-800/50 rounded-xl p-3 border border-slate-700 mb-3">
      <div class="text-3xl mb-1">${daily.emoji}</div>
      <p class="text-sm font-bold text-amber-300">${daily.label}</p>
      <p class="text-xs text-slate-500 mt-0.5">Daily Reward</p>
    </div>

    ${monthly ? `
    <div class="bg-amber-900/20 rounded-xl p-3 border border-amber-700/50 mb-3">
      <div class="text-3xl mb-1">${monthly.emoji}</div>
      <p class="text-sm font-bold text-amber-200">${monthly.label}</p>
      <p class="text-xs text-amber-500 mt-0.5">🌟 Monthly Milestone!</p>
    </div>
    ` : ''}

    <div class="flex gap-2 mb-2">
      ${[1,2,3,4,5,6,7].map(d => {
        const isPast = d < gameState.loginRewards.streak;
        const isCurrent = d === gameState.loginRewards.streak;
        return `<div class="flex-1 text-center py-1 rounded-lg text-xs ${
          isCurrent ? 'bg-amber-600 text-white font-bold' :
          isPast ? 'bg-slate-700 text-slate-500' :
          'bg-slate-800 text-slate-600'
        }">${d === 7 ? '🎁' : d}</div>`;
      }).join('')}
    </div>

    <p class="text-xs text-slate-600 mb-3">7-day cycle resets weekly</p>
  `;

  const claimBtn = document.createElement('button');
  claimBtn.className = 'w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-bold text-sm transition-all active:scale-95';
  claimBtn.textContent = '✨ Claim Rewards';
  claimBtn.onclick = () => {
    const res = gameState.claimLoginReward();
    if (res.success) {
      playSound('levelup');
      const msgs = [`${daily.emoji} ${daily.label}`];
      if (monthly) msgs.push(`${monthly.emoji} ${monthly.label}`);
      showToast(msgs.join(' + '), 'gold');
    }
    overlay.classList.add('animate-fade-out');
    setTimeout(() => overlay.remove(), 300);
  };
  card.appendChild(claimBtn);

  overlay.appendChild(card);
  document.body.appendChild(overlay);
}
