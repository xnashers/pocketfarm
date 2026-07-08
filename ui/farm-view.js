import { gameState } from '../state.js';
import { SPRINKLERS } from '../data/gear.js';
import { createWeatherDisplay } from './weather-display.js';
import { showToast } from './toast.js';
import { playSound } from './sounds.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

let timerInterval = null;

function formatGrowTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  return `${secs}s`;
}

function createSeedPopup() {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 hidden';
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm seed-backdrop"></div>
    <div class="absolute inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto">
      <div class="bg-slate-800 rounded-3xl border border-white/10 shadow-2xl overflow-hidden seed-content">
        <div class="p-5 border-b border-white/10">
          <h2 class="text-lg font-bold text-white">🌱 Plant Seed</h2>
          <p class="text-sm text-slate-400 mt-1">Choose from your seeds</p>
        </div>
        <div id="seed-list" class="p-4 max-h-[60vh] overflow-y-auto space-y-2"></div>
        <div class="p-4 border-t border-white/10">
          <button class="seed-cancel w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold transition active:scale-98">Cancel</button>
        </div>
      </div>
    </div>
  `;

  let targetPlot = null;

  function open(plotIndex) {
    targetPlot = plotIndex;
    const list = overlay.querySelector('#seed-list');
    list.innerHTML = '';

    const ownedSeeds = Object.entries(gameState.seeds).filter(([, count]) => count > 0);

    if (ownedSeeds.length === 0) {
      list.innerHTML = '<div class="text-center py-8 text-slate-500"><span class="text-3xl block mb-2">🌱</span>No seeds! Visit the Shop</div>';
    } else {
      for (const [cropId, count] of ownedSeeds) {
        const crop = gameState.getCrop(cropId);
        if (!crop) continue;

        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'w-full flex items-center gap-4 p-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 active:bg-slate-600 cursor-pointer transition text-left';
        item.innerHTML = `
          <span class="text-3xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white">${crop.name}</div>
            <div class="text-xs text-slate-400">⏱ ${formatGrowTime(gameState.getEffectiveGrowTime(cropId))} · 💰₱${crop.sellPrice}/kg</div>
          </div>
          <span class="text-sm font-bold text-green-400">x${count}</span>
        `;
        item.addEventListener('click', () => {
          if (gameState.plantCrop(targetPlot, cropId)) {
            playSound('plant');
            showToast(t('app.toast.planted', { crop: crop.emoji }), 'success');
          }
          close();
        });
        list.appendChild(item);
      }
    }

    overlay.classList.remove('hidden');
  }

  function close() {
    targetPlot = null;
    overlay.classList.add('hidden');
  }

  overlay.querySelector('.seed-backdrop').addEventListener('click', close);
  overlay.querySelector('.seed-cancel').addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) close();
  });

  return { element: overlay, open, close };
}

function createSprinklerBar() {
  const bar = document.createElement('div');
  bar.className = 'flex items-center gap-2 px-3 py-2 mb-3 rounded-xl border bg-slate-800/40 border-white/5';

  function render() {
    const level = gameState.gear.sprinklerLevel;
    if (level === 0) {
      bar.innerHTML = `
        <span class="text-base opacity-50">💧</span>
        <span class="text-xs text-slate-500">No sprinkler — buy one in <strong class="text-blue-400">Gear</strong> shop to speed up crops!</span>
      `;
    } else {
      const sp = SPRINKLERS.find(s => s.tier === level);
      if (!sp) return;
      const bonusPct = Math.round(sp.speedBonus * 100);
      const doubleStr = sp.doubleHarvestBonus ? ` · +${Math.round(sp.doubleHarvestBonus * 100)}% double harvest` : '';
      bar.innerHTML = `
        <span class="text-base flex-shrink-0">${sp.emoji}</span>
        <div class="flex-1 min-w-0">
          <span class="text-xs font-semibold text-blue-300">${sp.name}</span>
          <span class="text-xs text-slate-400"> · +${bonusPct}% speed${doubleStr}</span>
        </div>
        <span class="text-xs text-green-400 font-bold">Active</span>
      `;
    }
  }

  gameState.subscribe(render);
  render();
  return { element: bar, render };
}

export function createFarmView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const weatherDisplay = createWeatherDisplay();
  container.appendChild(weatherDisplay.element);

  const sprinklerBar = createSprinklerBar();
  container.appendChild(sprinklerBar.element);

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between mb-3';
  header.innerHTML = `
    <h2 class="text-lg font-bold text-white">${t('app.tabs.farm')}</h2>
    <span id="plot-count" class="text-sm text-slate-400"></span>
  `;
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.id = 'farm-grid';
  grid.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3';
  container.appendChild(grid);

  const seedPopup = createSeedPopup();
  container.appendChild(seedPopup.element);

  function formatTime(ms) {
    const totalSecs = Math.ceil(ms / 1000);
    if (totalSecs <= 0) return '0s';
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    if (mins > 0) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    return `${secs}s`;
  }

  function renderPlot(plot, index) {
    const card = document.createElement('div');
    card.className = 'relative rounded-2xl border-2 transition-all duration-200 overflow-hidden';
    card.dataset.plotIndex = index;

    if (plot.status === 'empty') {
      card.className += ' border-dashed border-slate-600 bg-slate-800/50 hover:border-green-500/50 hover:bg-slate-800 cursor-pointer active:scale-95';
      card.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 px-4 gap-2">
          <span class="text-3xl opacity-40">+</span>
          <span class="text-xs text-slate-500">${t('app.farm.empty')}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        const ownedSeeds = Object.entries(gameState.seeds).filter(([, c]) => c > 0);
        if (ownedSeeds.length === 0) {
          showToast('No seeds! Visit the Shop 🌱', 'info');
          return;
        }
        seedPopup.open(index);
      });
    } else {
      const crop = gameState.getCrop(plot.cropId);
      if (!crop) {
        card.className += ' border-dashed border-slate-600 bg-slate-800/50 cursor-pointer hover:border-green-500/50';
        card.innerHTML = `
          <div class="flex flex-col items-center justify-center py-8 px-4 gap-2">
            <span class="text-3xl opacity-40">+</span>
            <span class="text-xs text-slate-500">${t('app.farm.empty')}</span>
          </div>
        `;
        card.addEventListener('click', () => {
          const ownedSeeds = Object.entries(gameState.seeds).filter(([, c]) => c > 0);
          if (ownedSeeds.length === 0) {
            showToast('No seeds! Visit the Shop 🌱', 'info');
            return;
          }
          seedPopup.open(index);
        });
        return card;
      }
      const progress = gameState.getProgress(plot);
      const remaining = gameState.getRemainingMs(plot);
      const isReady = plot.status === 'ready' || progress >= 1;
      const mutations = plot.mutations || [];
      const mutationMult = gameState.getMutationMultiplier(mutations);
      const harvestCount = plot.harvestCount || 0;

      // Harvest count badge (persistent crops)
      let countBadge = '';
      if (harvestCount > 0) {
        countBadge = `<div class="absolute top-1.5 right-1.5 bg-green-600/90 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg z-10">×${harvestCount}</div>`;
      }

      if (isReady) {
        const glowClass = mutations.length > 0 ? 'mutation-glow' : 'ready-glow';
        let mutationBadges = '';
        if (mutations.length > 0) {
          mutationBadges = `<div class="flex flex-wrap justify-center gap-0.5 mt-1">
            ${mutations.map(m => `<span class="text-xs px-1 py-0.5 rounded bg-purple-900/50 border border-purple-500/30" title="${m.name}">${m.emoji}</span>`).join('')}
          </div>`;
          mutationBadges += `<div class="text-xs text-purple-300 font-bold mt-0.5">x${mutationMult.toFixed(1)}</div>`;
        }

        card.className += ` border-green-400/60 bg-green-900/30 cursor-pointer hover:bg-green-900/50 ${glowClass}`;
        card.innerHTML = `
          ${countBadge}
          <div class="flex flex-col items-center justify-center py-5 px-3 gap-1">
            <span class="text-3xl">${crop.emoji}</span>
            <span class="text-xs font-bold text-green-300 animate-pulse">${t('app.farm.ready')}</span>
            ${mutationBadges}
            <div class="flex gap-1 mt-2">
              <button class="px-3 py-1.5 bg-green-500 hover:bg-green-400 text-slate-900 rounded-xl text-xs font-bold transition harvest-btn active:scale-95">✨ ${t('app.farm.harvest')}</button>
              ${gameState.gear.hasShovel ? '<button class="px-2 py-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-xl text-xs transition shovel-btn active:scale-95" title="Shovel">🔨</button>' : ''}
            </div>
          </div>
        `;
        card.querySelector('.harvest-btn').addEventListener('click', (e) => {
          e.stopPropagation();
          handleHarvest(index);
        });
        card.addEventListener('click', () => handleHarvest(index));
        if (gameState.gear.hasShovel) {
          card.querySelector('.shovel-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (gameState.shovelCrop(index)) {
              playSound('click');
              showToast('🔨 Crop removed!', 'info');
            }
          });
        }
      } else {
        const canFertilize = !plot.fertilized && gameState.gear.fertilizerCount > 0;
        card.className += ' border-amber-500/30 bg-amber-900/10';
        const pct = Math.round(progress * 100);

        let actionBtns = '';
        if (canFertilize) {
          actionBtns += '<button class="mt-1 px-2 py-1.5 bg-amber-600/80 hover:bg-amber-500 text-white rounded-xl text-xs transition fert-btn active:scale-95">💩 Fertilize</button>';
        } else if (plot.fertilized) {
          actionBtns += '<span class="mt-1 text-xs text-amber-400/60">💩 Fertilized</span>';
        }
        if (gameState.gear.hasShovel) {
          actionBtns += '<button class="mt-1 px-2 py-1.5 bg-red-600/80 hover:bg-red-500 text-white rounded-xl text-xs transition shovel-btn active:scale-95">🔨</button>';
        }

        card.innerHTML = `
          ${countBadge}
          <div class="flex flex-col items-center py-4 px-3 gap-1">
            <span class="text-2xl">${crop.emoji}</span>
            <span class="text-xs text-amber-300">${t('app.farm.growing')}</span>
            <div class="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full transition-all progress-bar" style="width: ${pct}%"></div>
            </div>
            <span class="text-xs text-slate-400 time-remaining">${formatTime(remaining)}</span>
            ${plot.fertilized ? '<span class="text-xs text-amber-400">💩 +weight</span>' : ''}
            <div class="flex gap-1">${actionBtns}</div>
          </div>
        `;

        if (canFertilize) {
          card.querySelector('.fert-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (gameState.fertilizeCrop(index)) {
              playSound('click');
              showToast('💩 Fertilized! +20-50% weight', 'success');
            }
          });
        }
        if (gameState.gear.hasShovel) {
          card.querySelector('.shovel-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (gameState.shovelCrop(index)) {
              playSound('click');
              showToast('🔨 Crop removed!', 'info');
            }
          });
        }
      }
    }

    return card;
  }

  function renderBuyPlotTile() {
    const card = document.createElement('div');
    const canAfford = gameState.player.peso >= 20;
    card.className = `relative rounded-2xl border-2 border-dashed overflow-hidden transition-all duration-200 ${
      canAfford ? 'border-amber-500/50 bg-amber-900/20 hover:border-amber-400 hover:bg-amber-900/30 cursor-pointer active:scale-95' : 'border-slate-700 bg-slate-800/30 opacity-50'
    }`;
    card.innerHTML = `
      <div class="flex flex-col items-center justify-center py-8 px-4 gap-1">
        <span class="text-2xl">🔓</span>
        <span class="text-xs font-semibold text-amber-300">${t('app.farm.buy_plot')}</span>
        <span class="text-xs text-yellow-400">₱20</span>
      </div>
    `;
    if (canAfford) {
      card.addEventListener('click', () => {
        if (gameState.buyPlot()) {
          playSound('buy');
          showToast(t('app.toast.plot_bought'), 'success');
        }
      });
    }
    return card;
  }

  function handleHarvest(index) {
    const result = gameState.harvestCrop(index);
    if (result) {
      playSound('harvest');
      const mult = result.items[0].mutations.length > 0 ? gameState.getMutationMultiplier(result.items[0].mutations) : 0;
      const multStr = mult > 0 ? ` (x${mult.toFixed(1)})` : '';
      const msg = result.isDouble
        ? `${t('app.toast.double')} +${result.quantity} ${result.crop.emoji}${multStr}`
        : `${t('app.toast.harvested', { crop: result.crop.emoji, xp: result.crop.xp * result.quantity })}${multStr}`;
      showToast(msg, result.isDouble ? 'gold' : 'success');
    }
  }

  function render() {
    grid.innerHTML = '';
    const countEl = header.querySelector('#plot-count');
    if (countEl) countEl.textContent = `🪴 ${gameState.plots.length} ${t('app.farm.plots')}`;

    gameState.plots.forEach((plot, i) => {
      grid.appendChild(renderPlot(plot, i));
    });
    grid.appendChild(renderBuyPlotTile());
  }

  function updateTimers() {
    let needsFullRender = false;
    gameState.checkAndApplyWeather();

    const cards = grid.querySelectorAll('[data-plot-index]');
    cards.forEach(card => {
      const index = parseInt(card.dataset.plotIndex);
      const plot = gameState.plots[index];
      if (!plot || plot.status !== 'growing') return;
      const remaining = gameState.getRemainingMs(plot);
      if (remaining <= 0) { needsFullRender = true; return; }
      const progress = gameState.getProgress(plot);
      const pct = Math.round(progress * 100);
      const bar = card.querySelector('.progress-bar');
      const timeEl = card.querySelector('.time-remaining');
      if (bar) bar.style.width = `${pct}%`;
      if (timeEl) timeEl.textContent = formatTime(remaining);
    });
    if (needsFullRender) render();
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimers, 1000);
  }

  function stopTimer() {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function activate() { render(); startTimer(); weatherDisplay.startTimer?.(); }
  function deactivate() { stopTimer(); weatherDisplay.stopTimer?.(); }

  gameState.subscribe(render);
  return { element: container, activate, deactivate, render };
}
