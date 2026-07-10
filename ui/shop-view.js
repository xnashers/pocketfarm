import { gameState } from '../state.js';
import { CROPS, CROP_CATEGORIES, GEAR_ITEMS, SPRINKLERS, PETS, getPetLevelXP } from '../data/game-data.js';
import { showToast, showBigToast, playSound } from './audio-ui.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function createShopView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const toggle = document.createElement('div');
  toggle.className = 'flex gap-2 mb-4';
  toggle.innerHTML = `
    <button class="shop-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 bg-green-600 text-white" data-section="seeds">🌱 Seeds</button>
    <button class="shop-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 bg-slate-700 text-slate-300" data-section="gear">⚙️ Gear</button>
    <button class="shop-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 bg-slate-700 text-slate-300" data-section="pets">🐾 Pets</button>
  `;
  container.appendChild(toggle);

  const content = document.createElement('div');
  container.appendChild(content);

  let currentSection = 'seeds';

  function switchSection(section) {
    currentSection = section;
    toggle.querySelectorAll('.shop-tab').forEach(btn => {
      const active = btn.dataset.section === section;
      btn.className = `shop-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 ${
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

  const STOCK_MAX = { starter: 5, intermediate: 3, advanced: 1, premium: 1 };
  const RARE_CATS = new Set(['advanced', 'premium']);

  function renderTimerBar() {
    const remaining = gameState.getAvailabilityTimeRemaining();
    const timerBar = document.createElement('div');
    timerBar.className = 'flex items-center justify-between mb-4 px-3 py-2 rounded-xl bg-slate-800/60 border border-white/5';
    timerBar.innerHTML = `
      <span class="text-xs text-slate-400">🔄 Restocks in</span>
      <span class="text-xs font-bold text-amber-400 stock-timer">${formatTime(remaining)}</span>
    `;
    return timerBar;
  }

  function renderSeeds() {
    content.innerHTML = '';

    content.appendChild(renderTimerBar());

    for (const cat of CROP_CATEGORIES) {
      const catCrops = CROPS.filter(c => c.category === cat.id);
      const maxStock = STOCK_MAX[cat.id] || 3;
      const isRare = RARE_CATS.has(cat.id);
      const label = isRare ? '🎲 30% chance' : `x${maxStock}/cycle`;

      const section = document.createElement('div');
      section.className = 'mb-5';

      const header = document.createElement('h3');
      header.className = 'text-sm font-bold text-slate-300 mb-2';
      header.textContent = `${cat.name} (${label})`;
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'space-y-2';

      for (const crop of catCrops) {
        const stock = gameState.getSeedStock(crop.id);
        const ownedSeeds = gameState.seeds[crop.id] || 0;
        const unavailable = stock <= 0;
        const cantAfford = gameState.player.peso < crop.seedCost;

        const card = document.createElement('div');
        card.className = `flex items-center gap-3 p-3 rounded-xl border transition ${
          unavailable ? 'bg-slate-900/40 border-white/5 opacity-40' : 'bg-slate-800/60 border-white/5 hover:border-white/10'
        }`;

        card.innerHTML = `
          <span class="text-2xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm">${crop.name}</div>
            <div class="text-xs text-slate-400">
              ⏱ ${formatGrowTime(crop.growTime)}
              ${ownedSeeds > 0 ? ` · <span class="text-green-400">🌱${ownedSeeds}</span>` : ''}
            </div>
            <div class="text-xs mt-0.5 ${unavailable ? 'text-slate-600' : 'text-amber-400'}">${unavailable ? (isRare ? '🚫 Not available this cycle' : '⏳ Sold out — restocks soon') : `📦 ${stock} in stock`}</div>
          </div>
          <div class="flex-shrink-0">
            ${!unavailable ? `<button class="buy-seed px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95 ${
              cantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-green-600/80 hover:bg-green-500 text-white'
            }" data-crop="${crop.id}" ${cantAfford ? 'disabled' : ''}>₱${crop.seedCost}</button>` : ''}
            ${unavailable ? `<span class="text-xs text-slate-600">${isRare ? '🎲' : 'Empty'}</span>` : ''}
          </div>
        `;

        const buyBtn = card.querySelector('.buy-seed');
        if (buyBtn && !cantAfford) {
          buyBtn.addEventListener('click', () => buySeeds(crop, 1));
        }

        grid.appendChild(card);
      }

      section.appendChild(grid);
      content.appendChild(section);
    }
  }

  function buySeeds(crop, qty) {
    const result = gameState.buySeed(crop.id, qty);
    if (result && result > 0) {
      playSound('buy');
      showToast(`🌱 Bought ${result} ${crop.name} seed${result > 1 ? 's' : ''}!`, 'success');
    } else {
      playSound('buzzer');
      showToast(t('app.toast.not_enough_peso'), 'error');
    }
  }

  function renderGear() {
    content.innerHTML = '';

    content.appendChild(renderTimerBar());

    // Sprinklers
    const spSection = document.createElement('div');
    spSection.className = 'mb-5';
    spSection.innerHTML = '<h3 class="text-sm font-bold text-slate-300 mb-2">💦 Sprinklers <span class="text-[10px] text-green-400 font-normal">Stackable! Use on growing crops</span></h3>';
    const spGrid = document.createElement('div');
    spGrid.className = 'space-y-2';

    const SP_STOCK = { 1: 3, 2: 2, 3: 1 };

    for (const sp of SPRINKLERS) {
      const stock = gameState.getSprinklerStock(sp.tier);
      const maxStock = SP_STOCK[sp.tier] || 1;
      const invCount = gameState.gear.sprinklerInventory.filter(s => s.tier === sp.tier).length;
      const bonusPct = Math.round(sp.weightBonus * 100);
      const unavailable = stock <= 0;
      const cantAfford = gameState.player.peso < sp.cost;

      const card = document.createElement('div');
      card.className = `flex items-center gap-3 p-3 rounded-xl border ${
        unavailable ? 'bg-slate-900/40 border-white/5 opacity-40' : 'bg-slate-800/60 border-white/10'
      }`;

      card.innerHTML = `
        <span class="text-2xl flex-shrink-0">${sp.emoji}</span>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-white text-sm">${sp.name}</div>
          <div class="text-xs text-slate-400">+${bonusPct}% crop weight · Stackable</div>
          ${invCount > 0 ? `<div class="text-xs text-blue-400 mt-0.5">🎒 ${invCount} owned</div>` : ''}
          <div class="text-xs mt-0.5 ${unavailable ? 'text-slate-600' : 'text-amber-400'}">${unavailable ? '⏳ Sold out — restocks soon' : `📦 ${stock}/${maxStock} in stock`}</div>
        </div>
        <div class="flex-shrink-0">
          ${!unavailable ? `<button class="buy-sp px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
            cantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600/80 hover:bg-blue-500 text-white'
          }" ${cantAfford ? 'disabled' : ''}>₱${sp.cost}</button>` :
            '<span class="text-xs text-slate-600">Empty</span>'
          }
        </div>
      `;

      if (!unavailable && !cantAfford) {
        const spBtn = card.querySelector('.buy-sp');
        if (spBtn) {
          spBtn.addEventListener('click', () => {
            if (gameState.player.peso < sp.cost) {
              playSound('buzzer');
              showToast(t('app.toast.not_enough_peso'), 'error');
              return;
            }
            if (gameState.buySprinkler(sp.tier)) {
              playSound('buy');
              showToast(`💦 ${sp.name} added to inventory!`, 'success');
            }
          });
        }
      }

      spGrid.appendChild(card);
    }

    spSection.appendChild(spGrid);
    content.appendChild(spSection);

    // Fertilizer
    const toolsSection = document.createElement('div');
    const fertStock = gameState.getFertilizerStock();
    const fertMax = 5;
    const fertStockColor = fertStock > 2 ? 'text-green-400' : fertStock > 0 ? 'text-amber-400' : 'text-red-400';

    toolsSection.innerHTML = `<h3 class="text-sm font-bold text-slate-300 mb-2">💩 Fertilizer <span class="text-xs ${fertStockColor} font-normal">(${fertStock}/${fertMax} in stock)</span></h3>`;
    const toolsGrid = document.createElement('div');
    toolsGrid.className = 'space-y-2';

    const fert = GEAR_ITEMS.fertilizer;
    const fertUnavailable = fertStock <= 0;
    const fertCantAfford = gameState.player.peso < fert.cost;

    const fertCard = document.createElement('div');
    fertCard.className = `flex items-center gap-3 p-3 rounded-xl border ${
      fertUnavailable ? 'bg-slate-900/40 border-white/5 opacity-40' : 'bg-slate-800/60 border-white/5'
    }`;
    fertCard.innerHTML = `
      <span class="text-2xl flex-shrink-0">${fert.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-white text-sm">${fert.name}</div>
        <div class="text-xs text-slate-400">${fert.description}</div>
        <div class="text-xs text-amber-400 mt-0.5">Owned: ${gameState.gear.fertilizerCount}</div>
      </div>
      <div class="flex-shrink-0">
        ${!fertUnavailable ? `<button class="buy-fert px-3 py-1.5 rounded-lg text-xs font-bold transition active:scale-95 ${
          fertCantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-amber-600/80 hover:bg-amber-500 text-white'
        }" ${fertCantAfford ? 'disabled' : ''}>₱${fert.cost}</button>` : ''}
        ${fertUnavailable ? '<span class="text-xs text-slate-600 text-center">Empty</span>' : ''}
      </div>
    `;

    const buyFertBtn = fertCard.querySelector('.buy-fert');
    if (buyFertBtn && !fertCantAfford) {
      buyFertBtn.addEventListener('click', () => buyFert(1));
    }

    toolsGrid.appendChild(fertCard);
    toolsSection.appendChild(toolsGrid);
    content.appendChild(toolsSection);
  }

  function buyFert(qty) {
    const result = gameState.buyFertilizer(qty);
    if (result && result > 0) {
      playSound('buy');
      showToast(`💩 Bought ${result} Fertilizer!`, 'success');
    } else {
      playSound('buzzer');
      showToast(t('app.toast.not_enough_peso'), 'error');
    }
  }

  function renderPets() {
    content.innerHTML = '';

    // ── Owned Pets ──
    const ownedByType = {};
    for (const inst of gameState.petInventory) {
      if (!ownedByType[inst.petId]) ownedByType[inst.petId] = [];
      ownedByType[inst.petId].push(inst);
    }

    if (gameState.petInventory.length > 0) {
      const ownedSection = document.createElement('div');
      ownedSection.className = 'mb-5';
      ownedSection.innerHTML = '<h3 class="text-sm font-bold text-slate-300 mb-2">🐾 Your Pets</h3>';
      const ownedGrid = document.createElement('div');
      ownedGrid.className = 'space-y-2';

      for (const [petId, instances] of Object.entries(ownedByType)) {
        const pet = PETS.find(p => p.id === petId);
        if (!pet) continue;
        const equippedCount = instances.filter(i => gameState.equippedPetUIDs.includes(i.uid)).length;

        const card = document.createElement('div');
        card.className = 'flex items-center gap-3 p-3 rounded-xl border bg-slate-800/60 border-white/5';
        card.innerHTML = `
          <span class="text-2xl flex-shrink-0">${pet.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm">${pet.name} <span class="text-slate-400 text-xs">×${instances.length}</span></div>
            <div class="text-xs text-slate-400">${pet.abilityDesc}</div>
            ${equippedCount > 0 ? `<div class="text-[10px] text-green-400 mt-0.5">✦ ${equippedCount} equipped</div>` : ''}
            <div class="mt-1 flex flex-wrap gap-1">
              ${instances.map(inst => {
                const isEquipped = gameState.equippedPetUIDs.includes(inst.uid);
                const isMax = inst.level >= 10;
                const nextXP = isMax ? 0 : getPetLevelXP(inst.level);
                return `<span class="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full ${isEquipped ? 'bg-green-600/30 text-green-300 border border-green-500/30' : 'bg-slate-700/50 text-slate-400'}">Lv.${inst.level}${isMax ? '⭐' : ` ${inst.xp}/${nextXP}XP`}</span>`;
              }).join('')}
            </div>
          </div>
        `;
        ownedGrid.appendChild(card);
      }
      ownedSection.appendChild(ownedGrid);
      content.appendChild(ownedSection);
    }

    // ── Pet Slot Expansion ──
    const expansionCost = gameState.getPetSlotExpansionCost();
    const expSection = document.createElement('div');
    expSection.className = 'mb-5';
    if (expansionCost !== null) {
      const cantAfford = gameState.player.peso < expansionCost;
      expSection.innerHTML = `
        <h3 class="text-sm font-bold text-slate-300 mb-2">🔲 Pet Slots <span class="text-xs text-slate-500 font-normal">(${gameState.petSlots}/5)</span></h3>
        <div class="flex items-center gap-3 p-3 rounded-xl border bg-slate-800/60 border-white/5">
          <span class="text-2xl flex-shrink-0">🔲</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm">Expand Slot</div>
            <div class="text-xs text-slate-400">Equip ${gameState.petSlots} → ${gameState.petSlots + 1} pets at once</div>
          </div>
          <button class="expand-slots px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95 ${cantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-amber-600/80 hover:bg-amber-500 text-white'}" ${cantAfford ? 'disabled' : ''}>₱${expansionCost.toLocaleString()}</button>
        </div>
      `;
      const btn = expSection.querySelector('.expand-slots');
      if (btn && !cantAfford) {
        btn.addEventListener('click', () => {
          const result = gameState.expandPetSlots();
          if (result.success) {
            playSound('buy');
            showToast(`🔲 Pet slot expanded! Now ${result.slots} slots.`, 'success');
            renderSection();
          } else {
            playSound('buzzer');
            showToast(t('app.toast.not_enough_peso'), 'error');
          }
        });
      }
    } else {
      expSection.innerHTML = `
        <h3 class="text-sm font-bold text-slate-300 mb-2">🔲 Pet Slots</h3>
        <div class="flex items-center gap-3 p-3 rounded-xl border bg-slate-800/60 border-amber-500/20">
          <span class="text-2xl flex-shrink-0">⭐</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-amber-400 text-sm">Max Slots Reached</div>
            <div class="text-xs text-slate-400">You have all 5 pet slots unlocked!</div>
          </div>
        </div>
      `;
    }
    content.appendChild(expSection);

    // ── Pet Shop ──
    const shopSection = document.createElement('div');
    shopSection.className = 'mb-5';
    shopSection.innerHTML = '<h3 class="text-sm font-bold text-slate-300 mb-2">🏪 Pet Shop</h3>';
    const shopGrid = document.createElement('div');
    shopGrid.className = 'space-y-2';

    for (const pet of PETS) {
      const ownedCount = (ownedByType[pet.id] || []).length;
      const cantAfford = gameState.player.peso < pet.cost;

      const card = document.createElement('div');
      card.className = `flex items-center gap-3 p-3 rounded-xl border ${cantAfford ? 'bg-slate-900/40 border-white/5 opacity-50' : 'bg-slate-800/60 border-white/5 hover:border-white/10'}`;
      card.innerHTML = `
        <span class="text-2xl flex-shrink-0">${pet.emoji}</span>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-white text-sm">${pet.name} ${ownedCount > 0 ? `<span class="text-xs text-slate-400">×${ownedCount} owned</span>` : ''}</div>
          <div class="text-xs text-slate-400">${pet.desc} — ${pet.abilityDesc}</div>
        </div>
        <button class="buy-pet px-3 py-2 rounded-lg text-xs font-bold transition active:scale-95 ${cantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-purple-600/80 hover:bg-purple-500 text-white'}" data-pet="${pet.id}" ${cantAfford ? 'disabled' : ''}>₱${pet.cost.toLocaleString()}</button>
      `;

      const btn = card.querySelector('.buy-pet');
      if (btn && !cantAfford) {
        btn.addEventListener('click', () => {
          const result = gameState.buyPet(pet.id);
          if (result.success) {
            playSound('buy');
            showToast(`🐾 ${pet.name} joins your farm!`, 'success');
            renderSection();
          } else {
            playSound('buzzer');
            showToast(t('app.toast.not_enough_peso'), 'error');
          }
        });
      }
      shopGrid.appendChild(card);
    }
    shopSection.appendChild(shopGrid);
    content.appendChild(shopSection);
  }

  function renderSection() {
    if (currentSection === 'seeds') renderSeeds();
    else if (currentSection === 'gear') renderGear();
    else if (currentSection === 'pets') renderPets();
  }

  let timerInterval = null;

  function showRestockToast() {
    showBigToast('🔄 Shop Restocked!');
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const timerEl = content.querySelector('.stock-timer');
      if (timerEl) {
        const remaining = gameState.getAvailabilityTimeRemaining();
        timerEl.textContent = formatTime(remaining);
        if (remaining <= 0) {
          renderSection();
          showRestockToast();
        }
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  gameState.on('restock', showRestockToast);
  gameState.subscribe(renderSection);
  renderSection();
  startTimer();

  return { element: container, render: renderSection, activate: startTimer, deactivate: stopTimer };
}
