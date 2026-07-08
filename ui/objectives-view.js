import { gameState } from '../state.js';
import { showToast } from './toast.js';
import { playSound } from './sounds.js';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES, TITLE_DISPLAY } from '../data/achievements.js';
import { TOKEN_SHOP_ITEMS } from '../data/token-shop.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function createObjectivesView() {
  const el = document.createElement('div');
  el.className = 'p-3 pb-24 space-y-4';

  let activeTab = 'objectives';

  function render() {
    el.innerHTML = '';

    // Tab selector
    const tabRow = document.createElement('div');
    tabRow.className = 'flex gap-1 mb-3';
    const tabs = [
      { id: 'objectives', label: '📋 Objectives', },
      { id: 'achievements', label: '🏆 Achievements' },
      { id: 'tokens', label: '🪙 Token Shop' },
      { id: 'titles', label: '👑 Titles' },
    ];
    for (const tab of tabs) {
      const btn = document.createElement('button');
      btn.className = `flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
        activeTab === tab.id
          ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`;
      btn.textContent = tab.label;
      btn.onclick = () => { activeTab = tab.id; render(); };
      tabRow.appendChild(btn);
    }
    el.appendChild(tabRow);

    if (activeTab === 'objectives') renderObjectives(el);
    else if (activeTab === 'achievements') renderAchievements(el);
    else if (activeTab === 'tokens') renderTokenShop(el);
    else if (activeTab === 'titles') renderTitles(el);
  }

  function renderObjectives(container) {
    const progress = gameState.getDailyProgress();
    const objs = progress.objectives;

    // Daily Objectives section
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-2';
    header.innerHTML = `
      <h2 class="text-sm font-bold text-slate-200">📋 Daily Objectives</h2>
      <span class="text-xs text-slate-500">Resets at midnight</span>
    `;
    container.appendChild(header);

    if (objs.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-center py-8 text-slate-500';
      empty.textContent = 'No objectives today';
      container.appendChild(empty);
      return;
    }

    const allClaimed = objs.every(o => o.completed && o.claimed);

    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i];
      const card = document.createElement('div');
      const isComplete = obj.completed;
      const isClaimed = obj.claimed;
      const pct = Math.min(100, Math.round((obj.current / obj.target) * 100));

      card.className = `rounded-xl p-3 border transition-all ${
        isClaimed ? 'bg-slate-900/50 border-slate-800 opacity-60' :
        isComplete ? 'bg-emerald-900/20 border-emerald-700/50' :
        'bg-slate-900 border-slate-800'
      }`;

      card.innerHTML = `
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <p class="text-sm font-semibold ${isClaimed ? 'text-slate-500 line-through' : 'text-slate-200'}">${obj.label}</p>
            <p class="text-xs text-slate-500 mt-0.5">${obj.current.toLocaleString()} / ${obj.target.toLocaleString()}</p>
          </div>
          <div class="text-right ml-2">
            <p class="text-xs text-amber-400 font-bold">₱${obj.reward.toLocaleString()}</p>
            <p class="text-xs text-purple-400">🪙 ${obj.tokens}</p>
          </div>
        </div>
        <div class="h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
          <div class="h-full rounded-full transition-all duration-500 ${isClaimed ? 'bg-slate-700' : isComplete ? 'bg-emerald-500' : 'bg-amber-500'}" style="width: ${isClaimed ? 100 : pct}%"></div>
        </div>
      `;

      if (isComplete && !isClaimed) {
        const btn = document.createElement('button');
        btn.className = 'w-full mt-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all active:scale-95';
        btn.textContent = '✨ Claim Reward';
        btn.onclick = () => {
          const res = gameState.claimObjective(i);
          if (res.success) {
            playSound('buy');
            showToast(`+₱${res.reward.toLocaleString()} +🪙${res.tokens}`, 'success');
            render();
          }
        };
        card.appendChild(btn);
      }

      container.appendChild(card);
    }

    // Daily Chest
    const chestCard = document.createElement('div');
    const chestReady = allClaimed && !progress.chestClaimed;
    chestCard.className = `rounded-xl p-4 border-2 mt-3 text-center transition-all ${
      progress.chestClaimed ? 'bg-slate-900/50 border-slate-800 opacity-60' :
      chestReady ? 'bg-amber-900/20 border-amber-500/50 animate-pulse' :
      'bg-slate-900 border-slate-700'
    }`;

    const claimedCount = objs.filter(o => o.completed && o.claimed).length;
    chestCard.innerHTML = `
      <div class="text-3xl mb-2">${progress.chestClaimed ? '📦' : chestReady ? '🎁' : '🔒'}</div>
      <p class="text-sm font-bold ${progress.chestClaimed ? 'text-slate-500' : 'text-slate-200'}">
        ${progress.chestClaimed ? 'Chest Opened!' : 'Daily Bonus Chest'}
      </p>
      <p class="text-xs text-slate-500 mt-1">${progress.chestClaimed ? 'Come back tomorrow' : `Claim all 3 rewards (${claimedCount}/3)`}</p>
    `;

    if (chestReady) {
      const btn = document.createElement('button');
      btn.className = 'w-full mt-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-white text-sm font-bold transition-all active:scale-95';
      btn.textContent = '🎁 Open Daily Chest';
      btn.onclick = () => {
        const res = gameState.claimDailyChest();
        if (res.success) {
          playSound('levelup');
          showToast(`${res.reward.emoji} ${res.reward.label}!`, 'gold');
          render();
        }
      };
      chestCard.appendChild(btn);
    }
    container.appendChild(chestCard);
  }

  function renderAchievements(container) {
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-2';
    header.innerHTML = `
      <h2 class="text-sm font-bold text-slate-200">🏆 Achievements</h2>
      <span class="text-xs text-slate-500">${Object.keys(gameState.achievements).length}/${ACHIEVEMENTS.length}</span>
    `;
    container.appendChild(header);

    for (const cat of ACHIEVEMENT_CATEGORIES) {
      const catAchs = ACHIEVEMENTS.filter(a => a.cat === cat.id);
      if (catAchs.length === 0) continue;

      const catHeader = document.createElement('h3');
      catHeader.className = 'text-xs font-bold text-slate-400 uppercase tracking-wider mt-4 mb-2';
      catHeader.textContent = cat.name;
      container.appendChild(catHeader);

      for (const ach of catAchs) {
        const entry = gameState.achievements[ach.id];
        const isUnlocked = !!entry;
        const isClaimed = entry?.claimed;

        const card = document.createElement('div');
        card.className = `rounded-xl p-3 border flex items-center gap-3 ${
          isClaimed ? 'bg-slate-900/50 border-slate-800 opacity-60' :
          isUnlocked ? 'bg-amber-900/20 border-amber-700/50' :
          'bg-slate-900 border-slate-800'
        }`;

        const emoji = document.createElement('div');
        emoji.className = `text-2xl ${isUnlocked ? '' : 'grayscale opacity-40'}`;
        emoji.textContent = ach.emoji;
        card.appendChild(emoji);

        const info = document.createElement('div');
        info.className = 'flex-1 min-w-0';
        info.innerHTML = `
          <p class="text-sm font-semibold ${isClaimed ? 'text-slate-500' : isUnlocked ? 'text-amber-300' : 'text-slate-400'}">${ach.name}</p>
          <p class="text-xs text-slate-500">${ach.desc}</p>
          <p class="text-xs text-slate-600 mt-0.5">Reward: ${ach.reward.type === 'peso' ? '₱' + ach.reward.amount.toLocaleString() : ach.reward.type === 'tokens' ? '🪙' + ach.reward.amount : ach.reward.amount + ' ' + ach.reward.type}</p>
        `;
        card.appendChild(info);

        if (isUnlocked && !isClaimed) {
          const btn = document.createElement('button');
          btn.className = 'px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold whitespace-nowrap active:scale-95';
          btn.textContent = 'Claim';
          btn.onclick = () => {
            const res = gameState.claimAchievement(ach.id);
            if (res.success) {
              playSound('buy');
              showToast(`🏆 ${ach.name} claimed!`, 'gold');
              render();
            }
          };
          card.appendChild(btn);
        } else if (isClaimed) {
          const badge = document.createElement('span');
          badge.className = 'text-xs text-emerald-500 font-bold';
          badge.textContent = '✓';
          card.appendChild(badge);
        }

        container.appendChild(card);
      }
    }
  }

  function renderTokenShop(container) {
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-3';
    header.innerHTML = `
      <h2 class="text-sm font-bold text-slate-200">🪙 Token Shop</h2>
      <div class="flex items-center gap-1 bg-purple-900/30 px-3 py-1 rounded-full border border-purple-700/30">
        <span class="text-sm">🪙</span>
        <span class="text-sm font-bold text-purple-300">${gameState.farmerTokens}</span>
      </div>
    `;
    container.appendChild(header);

    const desc = document.createElement('p');
    desc.className = 'text-xs text-slate-500 mb-3';
    desc.textContent = 'Earn tokens from objectives, achievements, and login rewards.';
    container.appendChild(desc);

    for (const item of TOKEN_SHOP_ITEMS) {
      const canBuy = gameState.farmerTokens >= item.cost;
      const card = document.createElement('div');
      card.className = `rounded-xl p-3 border flex items-center gap-3 ${canBuy ? 'bg-slate-900 border-slate-700' : 'bg-slate-900/50 border-slate-800 opacity-60'}`;

      card.innerHTML = `
        <div class="text-2xl">${item.emoji}</div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-slate-200">${item.name}</p>
          <p class="text-xs text-slate-500">${item.desc}</p>
        </div>
      `;

      const btn = document.createElement('button');
      btn.className = `px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 ${
        canBuy ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-slate-800 text-slate-600 cursor-not-allowed'
      }`;
      btn.textContent = `🪙 ${item.cost}`;
      btn.disabled = !canBuy;
      btn.onclick = () => {
        const res = gameState.buyTokenShopItem(item);
        if (res.success) {
          playSound('buy');
          showToast(`${item.emoji} ${item.name} purchased!`, 'success');
          render();
        }
      };
      card.appendChild(btn);
      container.appendChild(card);
    }
  }

  function renderTitles(container) {
    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-3';
    header.innerHTML = `
      <h2 class="text-sm font-bold text-slate-200">👑 Titles</h2>
      <span class="text-xs text-slate-500">Display on your profile</span>
    `;
    container.appendChild(header);

    const owned = gameState.titles.owned;
    const active = gameState.titles.active;

    if (owned.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-center py-8 text-slate-500';
      empty.innerHTML = '<div class="text-3xl mb-2">🔒</div><p class="text-sm">No titles unlocked yet</p><p class="text-xs text-slate-600 mt-1">Complete achievements to earn titles</p>';
      container.appendChild(empty);
      return;
    }

    for (const titleId of owned) {
      const info = TITLE_DISPLAY[titleId];
      if (!info) continue;
      const isActive = active === titleId;

      const card = document.createElement('div');
      card.className = `rounded-xl p-3 border flex items-center gap-3 cursor-pointer transition-all ${
        isActive ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-900 border-slate-800 hover:border-slate-600'
      }`;

      card.innerHTML = `
        <div class="text-2xl">${info.emoji}</div>
        <div class="flex-1">
          <p class="text-sm font-semibold ${isActive ? 'text-amber-300' : 'text-slate-300'}">${info.name}</p>
        </div>
        ${isActive ? '<span class="text-xs text-amber-400 font-bold">✓ Active</span>' : ''}
      `;

      card.onclick = () => {
        if (isActive) {
          gameState.setActiveTitle(null);
          showToast('Title removed', 'info');
        } else {
          gameState.setActiveTitle(titleId);
          showToast(`${info.emoji} Title set: ${info.name}`, 'gold');
        }
        render();
      };

      container.appendChild(card);
    }
  }

  render();

  return {
    element: el,
    activate: () => render(),
    deactivate: () => {},
  };
}
