import { gameState } from '../state.js';
import { LOGIN_CYCLE, MONTHLY_MILESTONES } from '../data/game-data.js';
import { playSound } from './audio-ui.js';
import { showToast } from './audio-ui.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

// ═══════════════════════════════════════════
// SPLASH SCREEN
// ═══════════════════════════════════════════

export function createSplashScreen(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[60] flex flex-col items-center justify-center select-none gap-2';
  overlay.style.backgroundColor = '#DC2626';

  const text = document.createElement('h1');
  text.textContent = 'DylVen Corp';
  text.style.fontFamily = "'Bebas Neue', sans-serif";
  text.style.fontSize = 'clamp(2.5rem, 12vw, 5rem)';
  text.style.color = '#000000';
  text.style.letterSpacing = '0.08em';
  text.style.margin = '0';
  text.style.opacity = '0';
  text.style.transform = 'scale(0.9)';
  text.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Developed with Passion by Jonas Sison';
  subtitle.style.fontStyle = 'italic';
  subtitle.style.fontSize = 'clamp(0.75rem, 3vw, 1rem)';
  subtitle.style.color = '#000000';
  subtitle.style.margin = '0';
  subtitle.style.opacity = '0';
  subtitle.style.transition = 'opacity 0.6s ease 0.2s';

  overlay.appendChild(text);
  overlay.appendChild(subtitle);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      text.style.opacity = '1';
      text.style.transform = 'scale(1)';
      subtitle.style.opacity = '1';
    });
  });

  setTimeout(() => {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); onComplete(); }, 500);
  }, 2500);
}

// ═══════════════════════════════════════════
// WELCOME SCREEN (Farm Naming)
// ═══════════════════════════════════════════

export function createWelcomeScreen(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4';

  overlay.innerHTML = `
    <div class="w-full max-w-sm text-center animate-fade-in">
      <div class="text-7xl mb-4">🌱</div>
      <h1 class="text-2xl text-slate-400 mb-1">${t('app.welcome.title')}</h1>
      <h2 class="text-4xl font-bold text-green-400 mb-8">${t('app.welcome.subtitle')}</h2>
      <div class="mb-6">
        <label for="farm-name-input" class="block text-sm text-slate-400 mb-3">${t('app.welcome.name_label')}</label>
        <input type="text" id="farm-name-input" maxlength="10" minlength="2" placeholder="${t('app.welcome.name_placeholder')}" autocomplete="off" class="w-full px-4 py-3.5 bg-slate-800 border border-slate-600 rounded-2xl text-white text-center text-xl font-semibold focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition">
        <p class="mt-2 text-sm h-5" id="name-preview"></p>
        <p class="mt-1 text-xs text-slate-600" id="name-hint">Minimum 2 characters</p>
      </div>
      <button id="start-btn" class="w-full py-4 bg-green-600 hover:bg-green-500 active:bg-green-400 text-white rounded-2xl text-lg font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed" disabled>🌾 Start Farming</button>
    </div>
  `;

  const input = overlay.querySelector('#farm-name-input');
  const preview = overlay.querySelector('#name-preview');
  const hint = overlay.querySelector('#name-hint');
  const startBtn = overlay.querySelector('#start-btn');

  function updatePreview() {
    const name = input.value.trim();
    if (name.length === 0) {
      preview.textContent = ''; preview.className = 'mt-2 text-sm h-5';
      hint.textContent = 'Minimum 2 characters'; hint.className = 'mt-1 text-xs text-slate-600';
      startBtn.disabled = true;
    } else if (name.length < 2) {
      preview.textContent = `"${name} Farm"`; preview.className = 'mt-2 text-sm h-5 text-slate-500';
      hint.textContent = `${2 - name.length} more character${2 - name.length > 1 ? 's' : ''} needed`; hint.className = 'mt-1 text-xs text-amber-500';
      startBtn.disabled = true;
    } else {
      preview.textContent = `"${name} Farm"`; preview.className = 'mt-2 text-sm h-5 text-green-400';
      hint.textContent = '✓ Looks good!'; hint.className = 'mt-1 text-xs text-green-500';
      startBtn.disabled = false;
    }
  }

  input.addEventListener('input', updatePreview);
  startBtn.addEventListener('click', () => {
    const name = input.value.trim().slice(0, 10);
    if (name.length >= 2) { onComplete(name); overlay.remove(); }
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !startBtn.disabled) startBtn.click(); });
  setTimeout(() => input.focus(), 300);
  return overlay;
}

// ═══════════════════════════════════════════
// TUTORIAL OVERLAY
// ═══════════════════════════════════════════

const TUTORIAL_STEPS = [
  { emoji: '🌱', title: 'Welcome to Pocket Farm!', desc: "Grow Filipino crops, harvest mutations, and build your dream farm. Let's learn the basics!", bg: 'from-green-900/40 to-emerald-900/20' },
  { emoji: '🪴', title: 'Plant Seeds', desc: 'Tap an empty plot to plant seeds. Buy seeds from the Shop tab. Different crops have different grow times and sell prices.', bg: 'from-green-900/40 to-lime-900/20' },
  { emoji: '✨', title: 'Harvest Crops', desc: 'When crops are ready (glowing green), tap to harvest! Harvested crops go to your Inventory. Mutated crops are worth more!', bg: 'from-amber-900/40 to-yellow-900/20' },
  { emoji: '💰', title: 'Sell at Market', desc: 'Sell your harvested crops at the Market for Pesos. Mutated crops have their own premium section with higher prices!', bg: 'from-yellow-900/40 to-orange-900/20' },
  { emoji: '🌧️', title: 'Weather System', desc: 'Weather changes every 2 minutes! Certain weather boosts mutation chances. Some weather blocks planting certain crops.', bg: 'from-blue-900/40 to-cyan-900/20' },
  { emoji: '🧬', title: 'Mutations', desc: 'Ready crops can get mutations during weather changes! Mutated crops sell for much more. Stack rare mutations for huge multipliers!', bg: 'from-purple-900/40 to-pink-900/20' },
  { emoji: '⭐', title: 'Level Up & Research', desc: 'Earn XP from harvesting to unlock new plots and crops. Spend Pesos in Research Lab for permanent upgrades. Happy farming!', bg: 'from-amber-900/40 to-red-900/20' },
];

export function createTutorialOverlay(onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4';
  let currentStep = 0;

  function render() {
    const step = TUTORIAL_STEPS[currentStep];
    const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;
    const isLast = currentStep === TUTORIAL_STEPS.length - 1;
    const isFirst = currentStep === 0;

    overlay.innerHTML = `
      <div class="w-full max-w-sm animate-fade-in">
        <div class="h-1 bg-slate-800 rounded-full mb-6 overflow-hidden"><div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" style="width: ${progress}%"></div></div>
        <div class="text-center p-6 rounded-2xl bg-gradient-to-br ${step.bg} border border-white/10">
          <div class="text-6xl mb-4">${step.emoji}</div>
          <h2 class="text-xl font-bold text-white mb-3">${step.title}</h2>
          <p class="text-sm text-slate-300 leading-relaxed">${step.desc}</p>
        </div>
        <div class="flex justify-center gap-2 mt-5 mb-6">${TUTORIAL_STEPS.map((_, i) => `<div class="w-2 h-2 rounded-full transition-all ${i === currentStep ? 'bg-green-400 w-6' : i < currentStep ? 'bg-green-600' : 'bg-slate-700'}"></div>`).join('')}</div>
        <div class="flex gap-3">
          ${!isFirst ? `<button class="tutorial-prev flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition active:scale-95">← Back</button>` : ''}
          <button class="tutorial-next flex-1 py-3 rounded-xl ${isLast ? 'bg-green-600 hover:bg-green-500' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold transition active:scale-95">${isLast ? '🌾 Start Farming!' : 'Next →'}</button>
        </div>
        ${!isLast ? `<button class="tutorial-skip w-full mt-3 py-2 text-xs text-slate-600 hover:text-slate-400 transition">Skip Tutorial</button>` : ''}
      </div>
    `;

    const prevBtn = overlay.querySelector('.tutorial-prev');
    const nextBtn = overlay.querySelector('.tutorial-next');
    const skipBtn = overlay.querySelector('.tutorial-skip');
    if (prevBtn) prevBtn.onclick = () => { currentStep--; render(); };
    if (nextBtn) nextBtn.onclick = () => { if (isLast) close(); else { currentStep++; render(); } };
    if (skipBtn) skipBtn.onclick = () => close();
  }

  function close() {
    overlay.classList.add('animate-fade-out');
    setTimeout(() => { overlay.remove(); if (onClose) onClose(); }, 300);
  }

  render();
  return overlay;
}

// ═══════════════════════════════════════════
// UPDATE NOTES OVERLAY — "We Are Online!"
// ═══════════════════════════════════════════

const UPDATE_VERSION = 'v3.0';

const UPDATE_ITEMS = [
  {
    emoji: '🌐',
    title: 'We Are Online!',
    desc: 'Pocket Farm is now a fully connected experience! Your farm lives in the cloud — play from any device and pick up right where you left off.',
    bg: 'from-green-900/50 to-emerald-900/30',
    accent: 'green',
  },
  {
    emoji: '☁️',
    title: 'Cloud Save',
    desc: 'Your progress is automatically saved online every 30 seconds. Never lose your crops, mutations, or hard-earned Pesos again!',
    bg: 'from-blue-900/40 to-cyan-900/20',
    accent: 'blue',
  },
  {
    emoji: '🏆',
    title: 'Global Leaderboard',
    desc: 'Compete with farmers worldwide! See who has the highest level, most XP, and biggest fortune. Climb the ranks and prove you\'re the best!',
    bg: 'from-amber-900/40 to-yellow-900/20',
    accent: 'amber',
  },
  {
    emoji: '🔒',
    title: 'Your Account',
    desc: 'Create an account to secure your farm. Login from any phone or browser — your farm follows you everywhere!',
    bg: 'from-purple-900/40 to-pink-900/20',
    accent: 'purple',
  },
  {
    emoji: '🚀',
    title: 'What\'s Next',
    desc: 'This is just the beginning! More crops, events, and features are coming soon. Thank you for being part of the Pocket Farm community!',
    bg: 'from-rose-900/40 to-red-900/20',
    accent: 'rose',
  },
];

export function createUpdateNotesOverlay(onClose) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4';
  let currentStep = 0;

  // Floating particles
  const particleContainer = document.createElement('div');
  particleContainer.className = 'absolute inset-0 overflow-hidden pointer-events-none';
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    const size = 2 + Math.random() * 4;
    const x = Math.random() * 100;
    const delay = Math.random() * 6;
    const dur = 4 + Math.random() * 6;
    p.className = 'absolute rounded-full bg-green-400/20';
    p.style.cssText = `width:${size}px;height:${size}px;left:${x}%;bottom:-10px;animation:particleRise ${dur}s ${delay}s linear infinite;`;
    particleContainer.appendChild(p);
  }
  overlay.appendChild(particleContainer);

  // Add particle animation style
  if (!document.getElementById('update-particles-style')) {
    const style = document.createElement('style');
    style.id = 'update-particles-style';
    style.textContent = `
      @keyframes particleRise {
        0% { transform: translateY(0) scale(1); opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.4; }
        100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
      }
      @keyframes glowPulse {
        0%, 100% { box-shadow: 0 0 20px rgba(74, 222, 128, 0.1); }
        50% { box-shadow: 0 0 40px rgba(74, 222, 128, 0.25); }
      }
      @keyframes onlineBadgePop {
        0% { transform: scale(0) rotate(-20deg); opacity: 0; }
        60% { transform: scale(1.15) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  function render() {
    const item = UPDATE_ITEMS[currentStep];
    const progress = ((currentStep + 1) / UPDATE_ITEMS.length) * 100;
    const isLast = currentStep === UPDATE_ITEMS.length - 1;
    const isFirst = currentStep === 0;

    // First step gets the hero treatment
    const heroClass = isFirst ? 'ring-2 ring-green-500/30' : '';
    const heroGlow = isFirst ? 'animation: glowPulse 3s ease-in-out infinite;' : '';

    overlay.querySelector('.update-content')?.remove();

    const content = document.createElement('div');
    content.className = 'update-content w-full max-w-sm animate-fade-in relative z-10';
    content.innerHTML = `
      <div class="text-center mb-4">
        <div class="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-3" style="animation: onlineBadgePop 0.5s ease-out">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span class="text-xs font-bold text-green-300 tracking-wider">ONLINE</span>
          <span class="text-xs text-green-500">${UPDATE_VERSION}</span>
        </div>
      </div>

      <div class="h-1 bg-slate-800 rounded-full mb-5 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500" style="width: ${progress}%"></div>
      </div>

      <div class="text-center p-6 rounded-2xl bg-gradient-to-br ${item.bg} border border-white/10 ${heroClass}" style="${heroGlow}">
        <div class="text-6xl mb-4" style="${isFirst ? 'animation: onlineBadgePop 0.6s ease-out 0.2s both' : ''}">${item.emoji}</div>
        <h2 class="text-xl font-bold text-white mb-3">${item.title}</h2>
        <p class="text-sm text-slate-300 leading-relaxed">${item.desc}</p>
        ${isFirst ? `
          <div class="mt-5 flex items-center justify-center gap-4">
            <div class="flex flex-col items-center gap-1">
              <span class="text-2xl">☁️</span>
              <span class="text-[10px] text-green-400 font-bold">Cloud Save</span>
            </div>
            <div class="w-px h-8 bg-white/10"></div>
            <div class="flex flex-col items-center gap-1">
              <span class="text-2xl">🏆</span>
              <span class="text-[10px] text-amber-400 font-bold">Leaderboard</span>
            </div>
            <div class="w-px h-8 bg-white/10"></div>
            <div class="flex flex-col items-center gap-1">
              <span class="text-2xl">🔄</span>
              <span class="text-[10px] text-blue-400 font-bold">Auto-Sync</span>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="flex justify-center gap-2 mt-5 mb-6">
        ${UPDATE_ITEMS.map((_, i) => `<div class="w-2 h-2 rounded-full transition-all ${i === currentStep ? 'bg-green-400 w-6' : i < currentStep ? 'bg-green-600' : 'bg-slate-700'}"></div>`).join('')}
      </div>

      <p class="text-center text-xs text-slate-600 mb-4">${currentStep + 1} of ${UPDATE_ITEMS.length}</p>

      <div class="flex gap-3">
        ${!isFirst ? `<button class="update-prev flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition active:scale-95">← Back</button>` : ''}
        <button class="update-next flex-1 py-3 rounded-xl ${isLast ? 'bg-green-600 hover:bg-green-500 shadow-lg shadow-green-600/20' : 'bg-slate-700 hover:bg-slate-600'} text-white font-bold transition active:scale-95">${isLast ? '🌾 Let\'s Farm!' : 'Next →'}</button>
      </div>
      ${!isLast ? `<button class="update-skip w-full mt-3 py-2 text-xs text-slate-600 hover:text-slate-400 transition">Skip</button>` : ''}
    `;

    overlay.appendChild(content);

    const prevBtn = content.querySelector('.update-prev');
    const nextBtn = content.querySelector('.update-next');
    const skipBtn = content.querySelector('.update-skip');
    if (prevBtn) prevBtn.onclick = () => { currentStep--; render(); };
    if (nextBtn) nextBtn.onclick = () => { if (isLast) close(); else { currentStep++; render(); } };
    if (skipBtn) skipBtn.onclick = () => close();
  }

  function close() {
    overlay.classList.add('animate-fade-out');
    setTimeout(() => { overlay.remove(); if (onClose) onClose(); }, 300);
  }

  render();
  return overlay;
}

export async function hasSeenUpdateNotes() {
  try {
    const seen = await window.miniappsAI?.storage?.getItem('seenUpdateNotes');
    return seen === UPDATE_VERSION;
  } catch { return localStorage.getItem('seenUpdateNotes') === UPDATE_VERSION; }
}

export async function markUpdateNotesSeen() {
  try {
    await window.miniappsAI?.storage?.setItem('seenUpdateNotes', UPDATE_VERSION);
  } catch { localStorage.setItem('seenUpdateNotes', UPDATE_VERSION); }
}

// ═══════════════════════════════════════════
// LOGIN REWARD POPUP
// ═══════════════════════════════════════════

export function showLoginRewardPopup() {
  const reward = gameState.pendingLoginReward;
  if (!reward) return;

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4';

  const card = document.createElement('div');
  card.className = 'bg-slate-900 rounded-3xl border border-slate-700 w-full max-w-md shadow-2xl animate-fade-in overflow-hidden';

  const { daily, monthly } = reward;
  const streak = gameState.loginRewards.streak;

  const headerHTML = `
    <div class="bg-gradient-to-br from-amber-600/30 to-yellow-600/10 p-5 text-center border-b border-slate-700">
      <div class="text-5xl mb-2">🎁</div>
      <h2 class="text-xl font-bold text-amber-300">Daily Rewards</h2>
      <p class="text-xs text-slate-400 mt-1">Day ${streak} Login Streak 🔥</p>
    </div>
  `;

  let rewardsGrid = '<div class="grid grid-cols-7 gap-1.5 px-4 pt-4">';
  for (let d = 1; d <= 7; d++) {
    const cycle = LOGIN_CYCLE.find(l => l.day === d);
    if (!cycle) continue;
    const isPast = d < streak, isCurrent = d === streak;
    rewardsGrid += `
      <div class="flex flex-col items-center rounded-xl py-2 px-1 text-center transition-all ${isCurrent ? 'bg-amber-600/40 border-2 border-amber-400 shadow-lg shadow-amber-600/20' : isPast ? 'bg-slate-800/60 border border-slate-700 opacity-60' : 'bg-slate-800/40 border border-slate-700'}">
        <span class="text-[10px] font-bold ${isCurrent ? 'text-amber-300' : isPast ? 'text-slate-600' : 'text-slate-500'}">Day ${d}</span>
        <span class="text-lg my-1 ${isPast ? 'grayscale' : ''}">${cycle.emoji}</span>
        <span class="text-[9px] ${isCurrent ? 'text-amber-200 font-bold' : isPast ? 'text-slate-600' : 'text-slate-500'} leading-tight">${cycle.label.replace(/[₱×]/g, '').trim().slice(0, 8)}</span>
        ${isPast ? '<span class="text-[8px] text-emerald-500 mt-0.5">✓</span>' : ''}
        ${isCurrent ? '<span class="text-[8px] text-amber-400 mt-0.5 animate-pulse">▲</span>' : ''}
      </div>`;
  }
  rewardsGrid += '</div>';

  const todayReward = `
    <div class="mx-4 mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-900/30 to-yellow-900/20 border border-amber-600/30">
      <div class="flex items-center gap-4">
        <div class="text-4xl">${daily.emoji}</div>
        <div class="flex-1"><p class="text-xs text-amber-500 font-semibold uppercase tracking-wider">Today's Reward</p><p class="text-lg font-bold text-amber-200">${daily.label}</p></div>
      </div>
    </div>`;

  let monthlyHTML = '';
  if (monthly) {
    monthlyHTML = `
      <div class="mx-4 mt-3 p-3 rounded-2xl bg-purple-900/20 border border-purple-600/30">
        <div class="flex items-center gap-3">
          <div class="text-3xl">${monthly.emoji}</div>
          <div class="flex-1"><p class="text-xs text-purple-400 font-semibold">🌟 Monthly Milestone!</p><p class="text-sm font-bold text-purple-200">${monthly.label}</p></div>
        </div>
      </div>`;
  }

  let milestonesHTML = '<div class="mx-4 mt-3 flex gap-2">';
  for (const ms of MONTHLY_MILESTONES) {
    const claimed = gameState.loginRewards.monthlyClaimed[ms.days];
    const reached = gameState.loginRewards.totalLoginDays >= ms.days;
    milestonesHTML += `
      <div class="flex-1 text-center py-2 rounded-lg text-[9px] ${claimed ? 'bg-emerald-900/30 border border-emerald-700/30 text-emerald-400' : reached ? 'bg-amber-900/20 border border-amber-700/30 text-amber-400' : 'bg-slate-800/40 border border-slate-700 text-slate-600'}">
        <span class="block text-base">${ms.emoji}</span><span class="block">${ms.days}d</span>
        ${claimed ? '<span class="block text-emerald-500">✓</span>' : ''}
      </div>`;
  }
  milestonesHTML += '</div>';

  card.innerHTML = headerHTML + rewardsGrid + todayReward + monthlyHTML + milestonesHTML;

  const btnWrap = document.createElement('div');
  btnWrap.className = 'p-4';
  const claimBtn = document.createElement('button');
  claimBtn.className = 'w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white font-bold text-sm transition-all active:scale-95 shadow-lg shadow-amber-600/20';
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
  btnWrap.appendChild(claimBtn);
  card.appendChild(btnWrap);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
}
