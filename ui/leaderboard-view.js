// ═══════════════════════════════════════════
// LEADERBOARD VIEW
// ═══════════════════════════════════════════

import { fetchLeaderboard, isAuthenticated, getStoredUsername } from '../api-client.js';

const t = (key) => window.miniappI18n?.t(key) ?? key;

export function createLeaderboardView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const header = document.createElement('div');
  header.className = 'mb-4';
  header.innerHTML = `
    <h2 class="text-xl font-bold text-white mb-1">${t('app.leaderboard.title')}</h2>
    <p class="text-xs text-slate-400">${t('app.leaderboard.subtitle')}</p>`;

  const content = document.createElement('div');
  container.appendChild(header);
  container.appendChild(content);

  let data = null;
  let loading = false;
  let error = null;

  async function load() {
    if (!isAuthenticated()) {
      renderLoginRequired();
      return;
    }

    loading = true;
    renderLoading();

    const result = await fetchLeaderboard();
    loading = false;

    if (result.ok) {
      data = result;
      error = null;
      renderLeaderboard();
    } else {
      error = result.error;
      renderError();
    }
  }

  function renderLoading() {
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16">
        <div class="text-4xl mb-3 animate-pulse">🏆</div>
        <p class="text-slate-400 text-sm">${t('app.leaderboard.loading')}</p>
      </div>`;
  }

  function renderError() {
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16">
        <div class="text-4xl mb-3">😅</div>
        <p class="text-slate-400 text-sm mb-4">${error === 'offline' ? t('app.leaderboard.offline') : t('app.leaderboard.error')}</p>
        <button id="lb-retry" class="px-6 py-2 bg-green-600 text-white rounded-xl text-sm font-bold active:scale-95 transition">
          ${t('app.leaderboard.retry')}
        </button>
      </div>`;
    content.querySelector('#lb-retry')?.addEventListener('click', load);
  }

  function renderLoginRequired() {
    content.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16">
        <div class="text-4xl mb-3">🔒</div>
        <p class="text-slate-400 text-sm text-center">${t('app.leaderboard.login_required')}</p>
      </div>`;
  }

  function renderLeaderboard() {
    const { leaderboard, myRank } = data;
    const myUsername = getStoredUsername().toLowerCase();

    if (leaderboard.length === 0) {
      content.innerHTML = `
        <div class="flex flex-col items-center justify-center py-16">
          <div class="text-4xl mb-3">🌱</div>
          <p class="text-slate-400 text-sm">${t('app.leaderboard.empty')}</p>
        </div>`;
      return;
    }

    const medals = ['🥇', '🥈', '🥉'];
    let html = '';

    if (myRank) {
      html += `
        <div class="mb-4 p-3 bg-green-900/20 border border-green-700/30 rounded-xl flex items-center justify-between">
          <span class="text-sm text-green-300">${t('app.leaderboard.your_rank')}</span>
          <span class="text-lg font-bold text-green-400">#${myRank}</span>
        </div>`;
    }

    html += '<div class="space-y-2">';
    for (let i = 0; i < leaderboard.length; i++) {
      const entry = leaderboard[i];
      const rank = i + 1;
      const isMe = entry.username === myUsername;
      const medal = rank <= 3 ? medals[rank - 1] : `<span class="text-sm text-slate-500 w-7 text-center inline-block">#${rank}</span>`;

      html += `
        <div class="flex items-center gap-3 p-3 rounded-xl transition ${isMe ? 'bg-green-900/20 border border-green-700/30' : 'bg-slate-800/50 border border-white/5'}">
          <div class="w-8 text-center flex-shrink-0">${medal}</div>
          <div class="flex-1 min-w-0">
            <div class="font-bold text-sm ${isMe ? 'text-green-300' : 'text-white'} truncate">${entry.farm_name || entry.username + "'s Farm"}</div>
            <div class="text-xs text-slate-400 truncate">@${entry.username}</div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-sm font-bold text-purple-300">⭐ Lv.${entry.level}</div>
            <div class="text-xs text-blue-300">${(entry.xp || 0).toLocaleString()} XP</div>
            <div class="text-xs text-yellow-400/70">₱${(entry.peso || 0).toLocaleString()}</div>
          </div>
        </div>`;
    }
    html += '</div>';

    content.innerHTML = html;
  }

  return {
    element: container,
    activate() { load(); },
    deactivate() {},
  };
}
