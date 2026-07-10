import { gameState } from '../state.js';
import { ACHIEVEMENTS, TITLE_DISPLAY } from '../data/game-data.js';
import { getStoredUsername, logout } from '../api-client.js';
import { showToast } from './audio-ui.js';

const t = (key) => window.miniappI18n?.t(key) ?? key;

// ═══════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════

export function createStatsBar() {
  const bar = document.createElement('header');
  bar.className = 'sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-white/10 px-4 py-3';
  bar.innerHTML = `
    <div class="flex items-center justify-between max-w-lg mx-auto">
      <button type="button" id="profile-btn" class="flex items-center gap-2 min-w-0 text-left hover:opacity-80 transition active:scale-[0.97]">
        <span class="text-2xl flex-shrink-0">🌱</span>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <span id="farm-name-display" class="font-bold text-lg text-white truncate">Pocket Farm</span>
            <span id="title-badge" class="hidden text-xs bg-amber-600/30 text-amber-300 px-1.5 py-0.5 rounded-full font-bold truncate max-w-[80px]"></span>
          </div>
          <span class="flex items-center gap-1.5">
            <span id="level-title" class="text-xs text-purple-400 truncate">Newbie</span>
            <span id="cloud-badge" class="text-[9px] font-bold bg-green-900/40 text-green-400 px-1.5 py-0.5 rounded-full tracking-wider">🟢 ONLINE</span>
          </span>
        </div>
      </button>
      <div class="flex items-center gap-2 text-sm flex-shrink-0">
        <div class="flex items-center gap-1" title="Farmer Tokens"><span class="text-purple-400">🪙</span><span id="stat-tokens" class="font-semibold text-purple-300">0</span></div>
        <div class="flex items-center gap-1" title="Peso"><span class="text-yellow-400 font-bold">₱</span><span id="stat-peso" class="font-semibold text-yellow-300">100</span></div>
      </div>
    </div>
    <div class="flex items-center justify-between max-w-lg mx-auto mt-1">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1" title="${t('app.stats.level')}"><span class="text-purple-400">⭐</span><span id="stat-level" class="font-semibold text-purple-300">1</span></div>
        <div class="flex items-center gap-1" title="${t('app.stats.xp')}"><span class="text-blue-400">✨</span><span id="stat-xp" class="font-semibold text-blue-300">0</span></div>
      </div>
      <div class="flex items-center gap-2">
        <div id="crate-badge" class="hidden items-center gap-1 text-xs bg-orange-900/30 text-orange-300 px-2 py-0.5 rounded-full border border-orange-700/30"><span>🎁</span><span id="stat-crates">0</span></div>
        <div id="ticket-badge" class="hidden items-center gap-1 text-xs bg-cyan-900/30 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-700/30"><span>🎫</span><span id="stat-tickets">0</span></div>
      </div>
    </div>
    <div id="xp-bar-container" class="max-w-lg mx-auto mt-1.5">
      <div class="h-1.5 bg-slate-700 rounded-full overflow-hidden"><div id="xp-bar" class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500" style="width: 0%"></div></div>
      <div class="flex justify-between text-[10px] text-slate-500 mt-0.5"><span id="xp-current">0 XP</span><span id="xp-next">50 XP</span></div>
    </div>`;

  // Profile popup on click
  bar.querySelector('#profile-btn').addEventListener('click', () => {
    showProfilePopup();
  });

  function update() {
    const level = gameState.player.level || 1;
    const xp = gameState.player.xp || 0;
    const peso = gameState.player.peso || 0;
    bar.querySelector('#stat-level').textContent = level;
    bar.querySelector('#stat-peso').textContent = Number(peso).toLocaleString();
    bar.querySelector('#stat-xp').textContent = Number(xp).toLocaleString();
    bar.querySelector('#farm-name-display').textContent = gameState.getDisplayName();
    bar.querySelector('#level-title').textContent = gameState.getLevelTitle();
    bar.querySelector('#stat-tokens').textContent = gameState.farmerTokens;

    const titleBadge = bar.querySelector('#title-badge');
    const activeTitle = gameState.getActiveTitle();
    if (activeTitle && TITLE_DISPLAY[activeTitle]) {
      titleBadge.textContent = `${TITLE_DISPLAY[activeTitle].emoji} ${TITLE_DISPLAY[activeTitle].name}`;
      titleBadge.classList.remove('hidden');
    } else { titleBadge.classList.add('hidden'); }

    const cloudBadge = bar.querySelector('#cloud-badge');
    cloudBadge.classList.remove('hidden');

    const crateBadge = bar.querySelector('#crate-badge');
    const ticketBadge = bar.querySelector('#ticket-badge');
    if (gameState.giftCrates > 0) { crateBadge.classList.remove('hidden'); crateBadge.classList.add('flex'); bar.querySelector('#stat-crates').textContent = gameState.giftCrates; }
    else { crateBadge.classList.add('hidden'); crateBadge.classList.remove('flex'); }
    if (gameState.weatherTickets > 0) { ticketBadge.classList.remove('hidden'); ticketBadge.classList.add('flex'); bar.querySelector('#stat-tickets').textContent = gameState.weatherTickets; }
    else { ticketBadge.classList.add('hidden'); ticketBadge.classList.remove('flex'); }

    const current = gameState.getCurrentLevelXP();
    const next = gameState.getNextLevelXP();
    const xpBar = bar.querySelector('#xp-bar');
    const xpCurrent = bar.querySelector('#xp-current');
    const xpNext = bar.querySelector('#xp-next');
    if (next !== null) {
      const pct = Math.min(100, ((xp - current) / (next - current)) * 100);
      xpBar.style.width = `${pct}%`;
      xpCurrent.textContent = `${xp.toLocaleString()} XP`;
      xpNext.textContent = `${next.toLocaleString()} XP`;
    } else { xpBar.style.width = '100%'; xpCurrent.textContent = 'MAX'; xpNext.textContent = 'MAX'; }
  }

  gameState.subscribe(update);
  update();
  return { element: bar, update };
}

// ═══════════════════════════════════════════
// PROFILE POPUP
// ═══════════════════════════════════════════

function showProfilePopup() {
  const username = getStoredUsername();
  const farmName = gameState.getDisplayName();
  const { level } = gameState.player;
  const title = gameState.getLevelTitle();
  const activeTitle = gameState.getActiveTitle();
  const titleInfo = activeTitle ? TITLE_DISPLAY[activeTitle] : null;

  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center';
  overlay.innerHTML = `
    <div class="w-full max-w-sm animate-fade-in">
      <div class="bg-slate-900 rounded-t-2xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden safe-bottom">
        <!-- Header -->
        <div class="px-5 pt-5 pb-4 text-center border-b border-white/10">
          <div class="text-5xl mb-2">🌱</div>
          <h2 class="text-xl font-bold text-white">${farmName}</h2>
          ${titleInfo ? `<span class="inline-block mt-1 text-xs bg-amber-600/30 text-amber-300 px-2 py-0.5 rounded-full font-bold">${titleInfo.emoji} ${titleInfo.name}</span>` : ''}
          <div class="flex items-center justify-center gap-3 mt-2 text-sm text-slate-400">
            <span>⭐ Level ${level}</span>
            <span class="text-slate-600">·</span>
            <span>${title}</span>
          </div>
        </div>

        <!-- Account Info -->
        <div class="px-5 py-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">${t('app.profile.account')}</span>
            <span class="text-sm text-white font-medium">${username}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">${t('app.profile.save')}</span>
            <span class="text-xs font-bold bg-green-900/40 text-green-400 px-2 py-0.5 rounded-full">🟢 Online</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-5 pb-5 space-y-2">
          <button type="button" id="logout-btn"
            class="w-full py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 text-red-400 rounded-xl font-bold text-sm transition active:scale-[0.98]">
            ${t('app.profile.logout')}
          </button>
          <button type="button" id="close-profile"
            class="w-full py-2.5 text-slate-500 hover:text-slate-300 text-xs transition rounded-xl hover:bg-slate-800/50">
            ${t('app.profile.close')}
          </button>
        </div>
      </div>
    </div>`;

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector('#close-profile').addEventListener('click', () => overlay.remove());

  // Logout button
  const logoutBtn = overlay.querySelector('#logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      logout();
      overlay.remove();
      window.location.reload();
    });
  }

  document.body.appendChild(overlay);
}

// ═══════════════════════════════════════════
// BOTTOM TAB NAVIGATION
// ═══════════════════════════════════════════

function getNotificationCount() {
  let count = 0;

  // Unclaimed daily objectives (completed but not claimed)
  const progress = gameState.getDailyProgress();
  for (const obj of progress.objectives) {
    if (obj.completed && !obj.claimed) count++;
  }
  // Daily chest ready
  const allClaimed = progress.objectives.every(o => o.completed && o.claimed);
  if (allClaimed && !progress.chestClaimed) count++;

  // Unclaimed achievements
  for (const ach of ACHIEVEMENTS) {
    const entry = gameState.achievements[ach.id];
    if (entry && !entry.claimed) count++;
  }

  // Unclaimed level rewards
  count += gameState.getUnclaimedLevelCount();

  return count;
}

const TABS = [
  { id: 'farm', icon: '🌾', labelKey: 'app.tabs.farm' },
  { id: 'shop', icon: '🏪', labelKey: 'app.tabs.shop' },
  { id: 'market', icon: '💰', labelKey: 'app.tabs.market' },
  { id: 'research', icon: '🔬', labelKey: 'app.tabs.research' },
  { id: 'inventory', icon: '🎒', labelKey: 'app.tabs.inventory' },
  { id: 'objectives', icon: '📋', labelKey: 'app.tabs.progress' },
  { id: 'leaderboard', icon: '🏆', labelKey: 'app.tabs.leaderboard' },
];

export function createTabs(onChange) {
  const nav = document.createElement('nav');
  nav.className = 'fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-white/10 flex justify-around py-2 px-1 z-40 safe-bottom';
  nav.setAttribute('role', 'tablist');
  let active = 'farm';

  for (const tab of TABS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', tab.id === active ? 'true' : 'false');
    btn.className = 'flex flex-col items-center gap-0.5 px-1 py-1 rounded-lg transition text-[9px] min-w-[36px]';
    btn.innerHTML = `<span class="text-lg leading-none">${tab.icon}</span><span class="leading-tight whitespace-nowrap">${t(tab.labelKey)}</span>`;

    // Add notification badge placeholder for objectives tab
    if (tab.id === 'objectives') {
      btn.innerHTML += '<span id="progress-badge" class="hidden absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 shadow-lg shadow-red-500/40"></span>';
      btn.classList.add('relative');
    }

    btn.addEventListener('click', () => {
      active = tab.id;
      nav.querySelectorAll('button').forEach(b => { b.setAttribute('aria-selected', 'false'); b.classList.remove('text-green-400'); b.classList.add('text-slate-400'); });
      btn.setAttribute('aria-selected', 'true');
      btn.classList.remove('text-slate-400');
      btn.classList.add('text-green-400');
      onChange(tab.id);
    });

    if (tab.id === active) btn.classList.add('text-green-400');
    else btn.classList.add('text-slate-400');
    nav.appendChild(btn);
  }

  // Update notification badge
  function updateBadge() {
    const badge = nav.querySelector('#progress-badge');
    if (!badge) return;
    const count = getNotificationCount();
    if (count > 0) {
      badge.textContent = count > 9 ? '9+' : count;
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  }

  // Subscribe to game state changes
  gameState.subscribe(updateBadge);
  updateBadge();

  return nav;
}
