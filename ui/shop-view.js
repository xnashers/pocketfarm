import { gameState } from '../state.js';
import { CROPS, CROP_CATEGORIES } from '../data/crops.js';
import { GEAR_ITEMS, SPRINKLERS } from '../data/gear.js';
import { showToast } from './toast.js';
import { playSound } from './sounds.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function createShopView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const toggle = document.createElement('div');
  toggle.className = 'flex gap-2 mb-4';
  toggle.innerHTML = `
    <button class="shop-tab flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-98 bg-green-600 text-white" data-section="seeds">🌱 Seeds</button>
    <button class="shop-tab flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-98 bg-slate-700 text-slate-300" data-section="gear">⚙️ Gear</button>
  `;
  container.appendChild(toggle);

  const content = document.createElement('div');
  container.appendChild(content);

  let currentSection = 'seeds';

  function switchSection(section) {
    currentSection = section;
    toggle.querySelectorAll('.shop-tab').forEach(btn => {
      const active = btn.dataset.section === section;
      btn.className = `shop-tab flex-1 py-2.5 rounded-xl text-sm font-bold transition active:scale-98 ${
        active ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
      }`;
    });
    renderSection();
  }

  toggle.querySelectorAll('.shop-tab').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });

  function formatGrowTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    return `${secs}s`;
  }

  function formatTime(ms) {
    const totalSecs = Math.ceil(ms / 1000);
    if (totalSecs <= 0) return '0s';
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    return `${secs}s`;
  }

  function renderSeeds() {
    content.innerHTML = '';

    const remaining = gameState.getAvailabilityTimeRemaining();
    const timerBar = document.createElement('div');
    timerBar.className = 'flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5';
    timerBar.innerHTML = `
      <span class="text-xs text-slate-400">🔄 Stock refreshes in</span>
      <span class="text-xs font-bold text-amber-400 shop-timer">${formatTime(remaining)}</span>
    `;
    content.appendChild(timerBar);

    for (const cat of CROP_CATEGORIES) {
      const catCrops = CROPS.filter(c => c.category === cat.id);
      const availableCount = catCrops.filter(c => gameState.isCropAvailable(c.id)).length;

      const section = document.createElement('div');
      section.className = 'mb-5';

      const header = document.createElement('h3');
      header.className = 'text-sm font-bold text-slate-300 mb-2';
      header.textContent = `${cat.name} (${availableCount}/${catCrops.length} in stock)`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'space-y-2';

      for (const crop of catCrops) {
        const available = gameState.isCropAvailable(crop.id);
        const ownedSeeds = gameState.seeds[crop.id] || 0;
        const minSell = crop.seedCost * 5;

        const card = document.createElement('div');
        card.className = `flex items-center gap-3 p-3 rounded-xl border transition ${
          available ? 'bg-slate-800/60 border-white/5 hover:border-white/10' : 'bg-slate-900/40 border-white/5 opacity-40'
        }`;

        card.innerHTML = `
          <span class="text-2xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm">${crop.name}</div>
            <div class="text-xs text-slate-400">
              ⏱ ${formatGrowTime(crop.growTime)} · Min ₱${minSell}
              ${ownedSeeds > 0 ? ` · <span class="text-green-400">🌱${ownedSeeds}</span>` : ''}
            </div>
            ${!available ? '<div class="text-xs text-slate-500 mt-0.5">⏳ Out of stock — rotates soon</div>' : ''}
          </div>
          ${available ? `
            <div class="flex gap-1 flex-shrink-0">
              <button class="buy-1 px-2.5 py-1.5 bg-green-600/80 hover:bg-green-500 text-white rounded-lg text-xs font-semibold transition active:scale-95" data-crop="${crop.id}">₱${crop.seedCost}</button>
              <button class="buy-5 px-2.5 py-1.5 bg-green-700/80 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition active:scale-95" data-crop="${crop.id}">x5</button>
            </div>
          ` : ''}
        `;

        if (available) {
          card.querySelector('.buy-1').addEventListener('click', () => {
            if (gameState.buySeed(crop.id, 1)) {
              playSound('buy');
              showToast(`🌱 Bought 1 ${crop.name} seed!`, 'success');
            } else {
              playSound('error');
              showToast('Not enough Peso!', 'error');
            }
          });
          card.querySelector('.buy-5').addEventListener('click', () => {
            if (gameState.buySeed(crop.id, 5)) {
              playSound('buy');
              showToast(`🌱 Bought 5 ${crop.name} seeds!`, 'success');
            } else {
              playSound('error');
              showToast('Not enough Peso!', 'error');
            }
          });
        }

        grid.appendChild(card);
      }

      section.appendChild(grid);
      content.appendChild(section);
    }
  }

  function renderGear() {
    content.innerHTML = '';

    // Sprinkler rotation timer
    const spRemaining = gameState.getSprinklerAvailabilityTimeRemaining();
    const spTimerBar = document.createElement('div');
    spTimerBar.className = 'flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5';
    spTimerBar.innerHTML = `
      <span class="text-xs text-slate-400">🔄 Sprinkler stock refreshes in</span>
      <span class="text-xs font-bold text-blue-400 sprinkler-timer">${formatTime(spRemaining)}</span>
    `;
    content.appendChild(spTimerBar);

    // Sprinklers
    const spSection = document.createElement('div');
    spSection.className = 'mb-5';
    spSection.innerHTML = '<h3 class="text-sm font-bold text-slate-300 mb-2">💦 Sprinklers</h3>';
    const spGrid = document.createElement('div');
    spGrid.className = 'space-y-2';

    for (const sp of SPRINKLERS) {
      const currentLevel = gameState.gear.sprinklerLevel;
      const owned = currentLevel >= sp.tier;
      const isNext = currentLevel === sp.tier - 1;
      const available = gameState.isSprinklerAvailable(sp.tier);
      const canBuy = isNext && available && gameState.player.peso >= sp.cost;
      const locked = currentLevel < sp.tier - 1;

      const card = document.createElement('div');
      card.className = `flex items-center gap-3 p-3 rounded-xl border ${
        owned ? 'bg-green-900/20 border-green-500/30' :
        canBuy ? 'bg-slate-800/60 border-white/10' :
        isNext && !available ? 'bg-slate-900/40 border-white/5 opacity-60' :
        'bg-slate-900/40 border-white/5 opacity-50'
      }`;

      card.innerHTML = `
        <span class="text-2xl flex-shrink-0">${sp.emoji}</span>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-white text-sm">${sp.name}</div>
          <div class="text-xs text-slate-400">${sp.description}</div>
          ${isNext && !available ? '<div class="text-xs text-slate-500 mt-0.5">⏳ Out of stock — rotates soon</div>' : ''}
        </div>
        <div class="flex-shrink-0">
          ${owned ? '<span class="text-xs text-green-400 font-semibold">✅ Owned</span>' :
            locked ? `<span class="text-xs text-slate-500">🔒 Tier ${sp.tier - 1}</span>` :
            !isNext ? '<span class="text-xs text-slate-500">🔒 Next tier</span>' :
            !available ? '<span class="text-xs text-slate-500">⏳ Out of stock</span>' :
            `<button class="buy-sp px-3 py-1.5 bg-blue-600/80 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition active:scale-95">₱${sp.cost}</button>`
          }
        </div>
      `;

      if (canBuy) {
        card.querySelector('.buy-sp').addEventListener('click', () => {
          if (gameState.buySprinkler(sp.tier)) {
            playSound('buy');
            showToast(`💦 ${sp.name} installed!`, 'success');
          } else {
            playSound('error');
            showToast('Not enough Peso!', 'error');
          }
        });
      }

      spGrid.appendChild(card);
    }

    spSection.appendChild(spGrid);
    content.appendChild(spSection);

    // Tools
    const toolsSection = document.createElement('div');
    toolsSection.innerHTML = '<h3 class="text-sm font-bold text-slate-300 mb-2">🔨 Tools</h3>';
    const toolsGrid = document.createElement('div');
    toolsGrid.className = 'space-y-2';

    // Shovel (free)
    const shovel = GEAR_ITEMS.shovel;
    const hasShovel = gameState.gear.hasShovel;
    const shovelCard = document.createElement('div');
    shovelCard.className = `flex items-center gap-3 p-3 rounded-xl border ${hasShovel ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/5'}`;
    shovelCard.innerHTML = `
      <span class="text-2xl flex-shrink-0">${shovel.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-white text-sm">${shovel.name}</div>
        <div class="text-xs text-slate-400">${shovel.description}</div>
      </div>
      <div class="flex-shrink-0">
        ${hasShovel ? '<span class="text-xs text-green-400 font-semibold">✅ Owned</span>' :
          '<button class="buy-shovel px-3 py-1.5 bg-green-600/80 hover:bg-green-500 text-white rounded-lg text-xs font-semibold transition active:scale-95">FREE</button>'
        }
      </div>
    `;
    if (!hasShovel) {
      shovelCard.querySelector('.buy-shovel').addEventListener('click', () => {
        if (gameState.buyShovel()) {
          playSound('buy');
          showToast('🔨 Shovel claimed!', 'success');
        }
      });
    }
    toolsGrid.appendChild(shovelCard);

    // Fertilizer
    const fert = GEAR_ITEMS.fertilizer;
    const fertCard = document.createElement('div');
    fertCard.className = 'flex items-center gap-3 p-3 rounded-xl border bg-slate-800/60 border-white/5';
    fertCard.innerHTML = `
      <span class="text-2xl flex-shrink-0">${fert.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-white text-sm">${fert.name}</div>
        <div class="text-xs text-slate-400">${fert.description}</div>
        <div class="text-xs text-amber-400 mt-0.5">Owned: ${gameState.gear.fertilizerCount}</div>
      </div>
      <div class="flex flex-col gap-1 flex-shrink-0">
        <button class="buy-fert-1 px-2.5 py-1.5 bg-amber-600/80 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition active:scale-95">x1 ₱${fert.cost}</button>
        <button class="buy-fert-5 px-2.5 py-1.5 bg-amber-700/80 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition active:scale-95">x5 ₱${fert.cost * 5}</button>
      </div>
    `;
    fertCard.querySelector('.buy-fert-1').addEventListener('click', () => {
      if (gameState.buyFertilizer(1)) {
        playSound('buy');
        showToast('💩 Bought 1 Fertilizer!', 'success');
      } else {
        playSound('error');
        showToast('Not enough Peso!', 'error');
      }
    });
    fertCard.querySelector('.buy-fert-5').addEventListener('click', () => {
      if (gameState.buyFertilizer(5)) {
        playSound('buy');
        showToast('💩 Bought 5 Fertilizer!', 'success');
      } else {
        playSound('error');
        showToast('Not enough Peso!', 'error');
      }
    });
    toolsGrid.appendChild(fertCard);

    toolsSection.appendChild(toolsGrid);
    content.appendChild(toolsSection);
  }

  function renderSection() {
    if (currentSection === 'seeds') renderSeeds();
    else renderGear();
  }

  let timerInterval = null;
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const seedTimer = content.querySelector('.shop-timer');
      if (seedTimer) {
        const remaining = gameState.getAvailabilityTimeRemaining();
        seedTimer.textContent = formatTime(remaining);
        if (remaining <= 0) renderSection();
      }
      const spTimer = content.querySelector('.sprinkler-timer');
      if (spTimer) {
        const remaining = gameState.getSprinklerAvailabilityTimeRemaining();
        spTimer.textContent = formatTime(remaining);
        if (remaining <= 0 && currentSection === 'gear') renderSection();
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  gameState.subscribe(renderSection);
  renderSection();
  startTimer();

  return { element: container, render: renderSection, activate: startTimer, deactivate: stopTimer };
}
