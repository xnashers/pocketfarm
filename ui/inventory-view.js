import { gameState } from '../state.js';

const t = (key) => window.miniappI18n?.t(key) ?? key;

export function createInventoryView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const title = document.createElement('h2');
  title.className = 'text-xl font-bold text-white mb-4';
  title.textContent = t('app.inventory.title');
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'space-y-3';
  container.appendChild(list);

  function render() {
    list.innerHTML = '';

    const seedEntries = Object.entries(gameState.seeds).filter(([, count]) => count > 0);
    const cropEntries = Object.entries(gameState.inventory).filter(([, items]) => items && items.length > 0);

    if (seedEntries.length === 0 && cropEntries.length === 0) {
      list.innerHTML = `
        <div class="text-center py-12 text-slate-500">
          <span class="text-4xl block mb-3">🎒</span>
          <p>${t('app.inventory.empty')}</p>
        </div>
      `;
      return;
    }

    if (seedEntries.length > 0) {
      const seedSection = document.createElement('div');
      const seedHeader = document.createElement('h3');
      seedHeader.className = 'text-sm font-bold text-slate-300 mb-2';
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
        const hasMutations = items.some(i => i.mutations && i.mutations.length > 0);

        let mutationBadges = '';
        if (hasMutations) {
          const allMuts = new Set();
          items.forEach(i => i.mutations?.forEach(m => allMuts.add(m.emoji)));
          mutationBadges = `<div class="text-xs text-purple-400 mt-0.5">${[...allMuts].join(' ')}</div>`;
        }

        const card = document.createElement('div');
        card.className = `flex items-center gap-4 p-4 rounded-2xl bg-slate-800/60 border ${hasMutations ? 'border-purple-500/30' : 'border-white/5'}`;
        card.innerHTML = `
          <span class="text-3xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white">${crop.name} <span class="text-slate-400 text-sm">x${count}</span></div>
            <div class="text-xs text-slate-400 mt-0.5">⚖️ ${lightest.toFixed(2)} – ${heaviest.toFixed(2)} kg</div>
            ${mutationBadges}
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

    const gearSection = document.createElement('div');
    const gearHeader = document.createElement('h3');
    gearHeader.className = 'text-sm font-bold text-slate-300 mb-2 mt-4';
    gearHeader.textContent = '⚙️ Gear';
    gearSection.appendChild(gearHeader);

    const gearGrid = document.createElement('div');
    gearGrid.className = 'space-y-2';

    if (gameState.gear.sprinklerLevel > 0) {
      const names = ['', 'Basic', 'Advanced', 'Golden'];
      const emojis = ['', '💧', '💦', '🌈'];
      const card = document.createElement('div');
      card.className = 'flex items-center gap-3 p-3 rounded-xl bg-blue-900/20 border border-blue-500/20';
      card.innerHTML = `<span class="text-2xl">${emojis[gameState.gear.sprinklerLevel]}</span><span class="text-white text-sm font-semibold">${names[gameState.gear.sprinklerLevel]} Sprinkler</span>`;
      gearGrid.appendChild(card);
    }

    if (gameState.gear.hasShovel) {
      const card = document.createElement('div');
      card.className = 'flex items-center gap-3 p-3 rounded-xl bg-orange-900/20 border border-orange-500/20';
      card.innerHTML = '<span class="text-2xl">🔨</span><span class="text-white text-sm font-semibold">Shovel</span>';
      gearGrid.appendChild(card);
    }

    if (gameState.gear.fertilizerCount > 0) {
      const card = document.createElement('div');
      card.className = 'flex items-center gap-3 p-3 rounded-xl bg-amber-900/20 border border-amber-500/20';
      card.innerHTML = `<span class="text-2xl">💩</span><span class="text-white text-sm font-semibold">Fertilizer</span><span class="text-amber-400 text-sm ml-auto">x${gameState.gear.fertilizerCount}</span>`;
      gearGrid.appendChild(card);
    }

    gearSection.appendChild(gearGrid);
    list.appendChild(gearSection);
  }

  gameState.subscribe(render);
  render();
  return { element: container, render };
}
