import { gameState } from '../state.js';
import { SPRINKLERS, PETS, getPetLevelXP, getPetLevelEffectiveness, PET_SECONDARY_PASSIVE } from '../data/game-data.js';
import { showToast, playSound } from './audio-ui.js';

const t = (key) => window.miniappI18n?.t(key) ?? key;

export function createInventoryView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  // Tab toggle
  const toggle = document.createElement('div');
  toggle.className = 'flex gap-2 mb-4';
  toggle.innerHTML = `
    <button class="inv-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 bg-green-600 text-white" data-section="items">🎒 Items</button>
    <button class="inv-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 bg-slate-700 text-slate-300" data-section="pets">🐾 Pets</button>
  `;
  container.appendChild(toggle);

  const content = document.createElement('div');
  container.appendChild(content);

  // Sprinkler use popup
  const sprinklerPopup = createSprinklerUsePopup();
  container.appendChild(sprinklerPopup.element);

  let currentSection = 'items';

  function switchSection(section) {
    currentSection = section;
    toggle.querySelectorAll('.inv-tab').forEach(btn => {
      const active = btn.dataset.section === section;
      btn.className = `inv-tab flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-98 ${
        active ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'
      }`;
    });
    renderSection();
  }

  toggle.querySelectorAll('.inv-tab').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });

  function renderItems() {
    content.innerHTML = '';

    const seedEntries = Object.entries(gameState.seeds).filter(([, count]) => count > 0);
    const cropEntries = Object.entries(gameState.inventory).filter(([, items]) => items && items.length > 0);
    const sprinklerEntries = gameState.gear.sprinklerInventory || [];

    if (seedEntries.length === 0 && cropEntries.length === 0 && sprinklerEntries.length === 0 && gameState.gear.fertilizerCount <= 0) {
      content.innerHTML = `
        <div class="text-center py-12 text-slate-500">
          <span class="text-4xl block mb-3">🎒</span>
          <p>${t('app.inventory.empty')}</p>
        </div>
      `;
      return;
    }

    const list = document.createElement('div');
    list.className = 'space-y-3';

    // === Sprinkler Inventory (stacked by tier) ===
    if (sprinklerEntries.length > 0) {
      const section = document.createElement('div');
      const header = document.createElement('h3');
      header.className = 'text-sm font-bold text-slate-300 mb-2';
      header.innerHTML = '💦 Sprinklers <span class="text-[10px] text-green-400 font-normal">Tap to use on growing crops!</span>';
      section.appendChild(header);

      const grid = document.createElement('div');
      grid.className = 'space-y-2';

      const byTier = {};
      for (const item of sprinklerEntries) {
        if (!byTier[item.tier]) byTier[item.tier] = { tier: item.tier, count: 0 };
        byTier[item.tier].count++;
      }

      for (const [, group] of Object.entries(byTier)) {
        const sp = SPRINKLERS.find(s => s.tier === group.tier);
        if (!sp) continue;
        const bonusPct = Math.round(sp.weightBonus * 100);

        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'w-full flex items-center gap-3 p-3 rounded-xl bg-blue-900/20 border border-blue-500/20 cursor-pointer hover:bg-blue-900/30 hover:border-blue-400/40 transition active:scale-[0.98] text-left';
        card.innerHTML = `
          <span class="text-2xl flex-shrink-0">${sp.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm">${sp.name} <span class="text-blue-400 text-xs">x${group.count}</span></div>
            <div class="text-xs text-slate-400">+${bonusPct}% crop weight · Stackable</div>
          </div>
          <span class="text-xs text-blue-300 font-bold flex-shrink-0">💧 Use</span>
        `;

        card.addEventListener('click', () => {
          const growingPlots = [];
          for (let i = 0; i < gameState.plots.length; i++) {
            if (gameState.plots[i].status === 'growing') growingPlots.push(i);
          }
          if (growingPlots.length === 0) {
            showToast('🌱 No growing crops! Plant a seed first, then sprinkle it.', 'info');
            return;
          }
          sprinklerPopup.open(group.tier, growingPlots);
        });

        grid.appendChild(card);
      }

      section.appendChild(grid);
      list.appendChild(section);
    }

    // === Seeds ===
    if (seedEntries.length > 0) {
      const seedSection = document.createElement('div');
      const seedHeader = document.createElement('h3');
      seedHeader.className = 'text-sm font-bold text-slate-300 mb-2 mt-4';
      seedHeader.textContent = '🌱 Seeds';
      seedSection.appendChild(seedHeader);

      const seedGrid = document.createElement('div');
      seedGrid.className = 'space-y-2';

      for (const [cropId, count] of seedEntries) {
        const crop = gameState.getCrop(cropId);
        if (!crop) continue;
        const card = document.createElement('div');
        card.className = 'flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-white/5';
        card.innerHTML = `
          <span class="text-2xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1">
            <div class="font-semibold text-white text-sm">${crop.name} Seed</div>
          </div>
          <span class="text-sm font-bold text-green-400">x${count}</span>
        `;
        seedGrid.appendChild(card);
      }

      seedSection.appendChild(seedGrid);
      list.appendChild(seedSection);
    }

    // === Harvested Crops ===
    if (cropEntries.length > 0) {
      const cropSection = document.createElement('div');
      const cropHeader = document.createElement('h3');
      cropHeader.className = 'text-sm font-bold text-slate-300 mb-2 mt-4';
      cropHeader.textContent = '🌾 Harvested Crops';
      cropSection.appendChild(cropHeader);

      const cropGrid = document.createElement('div');
      cropGrid.className = 'space-y-2';

      for (const [cropId, items] of cropEntries) {
        const crop = gameState.getCrop(cropId);
        if (!crop) continue;
        const count = items.length;
        const totalValue = items.reduce((sum, item) => sum + gameState.getItemSellPrice(cropId, item), 0);
        const heaviest = Math.max(...items.map(i => i.weight));
        const lightest = Math.min(...items.map(i => i.weight));

        const card = document.createElement('div');
        card.className = 'flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border border-white/5';
        card.innerHTML = `
          <span class="text-3xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white">${crop.name} <span class="text-slate-400 text-sm">x${count}</span></div>
            <div class="text-xs text-slate-400 mt-0.5">⚖️ ${lightest.toFixed(2)} – ${heaviest.toFixed(2)} kg</div>
          </div>
          <div class="text-right flex-shrink-0">
            <div class="text-yellow-400 font-semibold text-sm">₱${totalValue.toLocaleString()}</div>
            <div class="text-[10px] text-slate-500">total value</div>
          </div>
        `;
        cropGrid.appendChild(card);
      }

      cropSection.appendChild(cropGrid);
      list.appendChild(cropSection);
    }

    // === Gear ===
    if (gameState.gear.fertilizerCount > 0) {
      const gearSection = document.createElement('div');
      const gearHeader = document.createElement('h3');
      gearHeader.className = 'text-sm font-bold text-slate-300 mb-2 mt-4';
      gearHeader.textContent = '⚙️ Gear';
      gearSection.appendChild(gearHeader);

      const gearGrid = document.createElement('div');
      gearGrid.className = 'space-y-2';

      const card = document.createElement('div');
      card.className = 'flex items-center gap-3 p-3 rounded-xl bg-amber-900/20 border border-amber-500/20';
      card.innerHTML = `<span class="text-2xl">💩</span><span class="text-white text-sm font-semibold">Fertilizer</span><span class="text-amber-400 text-sm ml-auto">x${gameState.gear.fertilizerCount}</span>`;
      gearGrid.appendChild(card);

      gearSection.appendChild(gearGrid);
      list.appendChild(gearSection);
    }

    content.appendChild(list);
  }

  function renderPets() {
    content.innerHTML = '';

    if (gameState.petInventory.length === 0) {
      content.innerHTML = `
        <div class="text-center py-12 text-slate-500">
          <span class="text-4xl block mb-3">🐾</span>
          <p>No pets yet</p>
          <p class="text-xs mt-1">Visit <strong class="text-purple-400">Shop → Pets</strong> to adopt one!</p>
        </div>
      `;
      return;
    }

    const list = document.createElement('div');
    list.className = 'space-y-3';

    // Slot info header
    const slotInfo = document.createElement('div');
    slotInfo.className = 'flex items-center justify-between px-1 mb-2';
    slotInfo.innerHTML = `
      <span class="text-xs text-slate-400">Pet Slots</span>
      <span class="text-xs font-bold text-green-400">${gameState.equippedPetUIDs.length} / ${gameState.petSlots} equipped</span>
    `;
    list.appendChild(slotInfo);

    for (const inst of gameState.petInventory) {
      const pet = PETS.find(p => p.id === inst.petId);
      if (!pet) continue;
      const isEquipped = gameState.equippedPetUIDs.includes(inst.uid);
      const { level, xp } = inst;
      const nextXP = getPetLevelXP(level);
      const isMax = level >= 10;
      const effectiveness = getPetLevelEffectiveness(level);
      const effPct = Math.round(effectiveness * 100);

      const xpBarHTML = isMax
        ? '<div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden"><div class="h-full bg-amber-400 rounded-full" style="width:100%"></div></div>'
        : `<div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden"><div class="h-full bg-blue-400 rounded-full" style="width:${Math.round(xp/nextXP*100)}%"></div></div>`;

      let passiveInfo = '';
      if (isMax && PET_SECONDARY_PASSIVE[inst.petId]) {
        passiveInfo = `<div class="text-[10px] text-amber-400 mt-1">⭐ Lv.10: ${PET_SECONDARY_PASSIVE[inst.petId].desc}</div>`;
      }

      const equipBtnDisabled = !isEquipped && gameState.equippedPetUIDs.length >= gameState.petSlots;
      const card = document.createElement('div');
      card.className = `rounded-2xl border-2 transition-all overflow-hidden ${
        isEquipped ? 'border-green-500/50 bg-green-900/20' : 'border-white/10 bg-slate-800/60'
      }`;
      card.innerHTML = `
        <div class="p-4">
          <div class="flex items-center gap-3 mb-3">
            <span class="text-3xl">${pet.emoji}</span>
            <div class="flex-1 min-w-0">
              <div class="font-bold text-white">${pet.name} ${isEquipped ? '<span class="text-green-400 text-xs">✦ Equipped</span>' : ''}</div>
              <div class="text-sm text-slate-300">${pet.desc}</div>
            </div>
            <div class="text-right flex-shrink-0">
              <div class="text-amber-400 font-bold text-lg">Lv.${level}</div>
            </div>
          </div>

          <div class="bg-slate-900/40 rounded-xl p-3 mb-3 border border-white/5">
            <div class="text-xs text-slate-400 mb-1">🎯 Ability: ${pet.abilityDesc}</div>
            <div class="text-xs text-green-400">Current: ${effPct}% effectiveness</div>
            ${xpBarHTML}
            ${isMax
              ? '<div class="text-[10px] text-amber-400 mt-1">⭐ MAX LEVEL</div>'
              : `<div class="text-[10px] text-slate-500 mt-1">${xp} / ${nextXP} XP (grows while farming)</div>`
            }
            ${passiveInfo}
          </div>

          <button type="button" class="pet-equip-btn w-full py-2.5 rounded-xl text-sm font-bold transition active:scale-98 ${
            isEquipped
              ? 'bg-slate-600 hover:bg-slate-500 text-slate-300'
              : equipBtnDisabled
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white'
          }" data-uid="${inst.uid}" ${equipBtnDisabled && !isEquipped ? 'disabled' : ''}>
            ${isEquipped ? 'Unequip' : equipBtnDisabled ? 'Slots Full' : '✦ Equip'}
          </button>
        </div>
      `;

      card.querySelector('.pet-equip-btn').addEventListener('click', () => {
        if (isEquipped) {
          gameState.unequipPet(inst.uid);
          showToast(`${pet.emoji} ${pet.name} unequipped`, 'info');
        } else {
          const result = gameState.equipPet(inst.uid);
          if (result.success) {
            playSound('buy');
            showToast(`${pet.emoji} ${pet.name} equipped!`, 'success');
          } else if (result.reason === 'full') {
            showToast('🔲 All pet slots full! Expand slots in the Shop.', 'error');
          }
        }
      });

      list.appendChild(card);
    }

    content.appendChild(list);
  }

  function renderSection() {
    if (currentSection === 'items') renderItems();
    else renderPets();
  }

  function activate() { renderSection(); }
  function deactivate() {}

  gameState.subscribe(renderSection);
  renderSection();
  return { element: container, render: renderSection, activate, deactivate };
}

// ═══════════════════════════════════════════
// SPRINKLER USE POPUP — pick a growing plot
// ═══════════════════════════════════════════

function createSprinklerUsePopup() {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 hidden';
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm sprinkler-backdrop"></div>
    <div class="absolute inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto">
      <div class="bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden sprinkler-content">
        <div class="p-5 border-b border-white/10">
          <h2 class="text-lg font-bold text-white" id="sp-title">💧 Use Sprinkler</h2>
          <p class="text-sm text-slate-400 mt-1">Pick a growing crop to sprinkle</p>
        </div>
        <div id="sp-plot-list" class="p-4 max-h-[50vh] overflow-y-auto space-y-2"></div>
        <div class="p-4 border-t border-white/10">
          <button type="button" class="sp-cancel w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition active:scale-98">Cancel</button>
        </div>
      </div>
    </div>
  `;

  let targetTier = null;

  function open(tier, plotIndices) {
    targetTier = tier;
    const sp = SPRINKLERS.find(s => s.tier === tier);
    const bonusPct = sp ? Math.round(sp.weightBonus * 100) : 0;

    const titleEl = overlay.querySelector('#sp-title');
    if (titleEl) titleEl.textContent = `${sp?.emoji || '💧'} ${sp?.name || 'Sprinkler'} (+${bonusPct}% weight)`;

    const plotList = overlay.querySelector('#sp-plot-list');
    plotList.innerHTML = '';

    if (plotIndices.length === 0) {
      plotList.innerHTML = '<div class="text-center py-6 text-slate-500">No growing crops</div>';
    } else {
      for (const idx of plotIndices) {
        const plot = gameState.plots[idx];
        if (!plot || plot.status !== 'growing') continue;
        const crop = gameState.getCrop(plot.cropId);
        if (!crop) continue;
        const bonus = plot.sprinklerBonus || 0;
        const bonusStr = bonus > 0 ? `<span class="text-blue-400 text-[10px] ml-1">💧+${Math.round(bonus * 100)}%</span>` : '';

        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'w-full flex items-center gap-3 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 active:bg-slate-600 transition cursor-pointer text-left';
        item.innerHTML = `
          <span class="text-2xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white text-sm">${crop.name} ${bonusStr}</div>
            <div class="text-xs text-slate-400">Plot #${idx + 1}</div>
          </div>
          <span class="text-xs text-blue-300 font-bold">💧 Sprinkle</span>
        `;
        item.addEventListener('click', () => {
          if (gameState.applySprinklerToPlot(idx, tier)) {
            playSound('buy');
            const sp2 = SPRINKLERS.find(s => s.tier === tier);
            showToast(`${sp2?.emoji || '💧'} +${Math.round((sp2?.weightBonus || 0) * 100)}% weight on ${crop.emoji}!`, 'success');
            close();
          } else {
            showToast('Could not apply sprinkler', 'error');
          }
        });
        plotList.appendChild(item);
      }
    }

    overlay.classList.remove('hidden');
  }

  function close() {
    targetTier = null;
    overlay.classList.add('hidden');
  }

  overlay.querySelector('.sprinkler-backdrop').addEventListener('click', close);
  overlay.querySelector('.sp-cancel').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) close();
  });

  return { element: overlay, open, close };
}
