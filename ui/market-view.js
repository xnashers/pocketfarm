import { gameState } from '../state.js';
import { showToast, playSound } from './audio-ui.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function createMarketView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const title = document.createElement('h2');
  title.className = 'text-xl font-bold text-white mb-4';
  title.textContent = t('app.market.title');
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'space-y-4';
  container.appendChild(list);

  function render() {
    list.innerHTML = '';
    const entries = Object.entries(gameState.inventory).filter(([, items]) => items && items.length > 0);

    if (entries.length === 0) {
      list.innerHTML = `
        <div class="text-center py-12 text-slate-500">
          <span class="text-4xl block mb-3">🏪</span>
          <p>${t('app.market.empty')}</p>
        </div>
      `;
      return;
    }

    // Separate mutated and normal items
    const normalItems = [];  // { cropId, crop, item, index }
    const mutatedItems = []; // { cropId, crop, item, index }

    for (const [cropId, items] of entries) {
      const crop = gameState.getCrop(cropId);
      if (!crop) continue;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.mutations && item.mutations.length > 0) {
          mutatedItems.push({ cropId, crop, item, index: i });
        } else {
          normalItems.push({ cropId, crop, item, index: i });
        }
      }
    }

    // === MUTATED CROPS SECTION ===
    if (mutatedItems.length > 0) {
      const mutHeader = document.createElement('div');
      mutHeader.className = 'flex items-center gap-2 mb-2';
      mutHeader.innerHTML = `
        <h3 class="text-sm font-bold text-purple-300">🧬 Mutated Crops</h3>
        <span class="text-[10px] text-purple-500 bg-purple-900/30 px-2 py-0.5 rounded-full">Premium</span>
      `;
      list.appendChild(mutHeader);

      // Group by cropId for display
      const byCropId = {};
      for (const entry of mutatedItems) {
        if (!byCropId[entry.cropId]) byCropId[entry.cropId] = [];
        byCropId[entry.cropId].push(entry);
      }

      for (const [cropId, cropItems] of Object.entries(byCropId)) {
        const crop = cropItems[0].crop;

        for (const { item, index } of cropItems) {
          const sellPrice = gameState.getItemSellPrice(cropId, item);
          const mutations = item.mutations || [];

          const card = document.createElement('div');
          card.className = 'rounded-2xl border border-purple-500/30 bg-purple-900/10 overflow-hidden';

          const badges = mutations.map(m =>
            `<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              m.isSecret ? 'bg-purple-600/50 text-purple-200 border border-purple-400/40' : 'bg-amber-600/30 text-amber-200 border border-amber-400/20'
            }">${m.emoji} ${m.name}</span>`
          ).join('');

          card.innerHTML = `
            <div class="px-4 pt-3 pb-2 border-b border-purple-500/20">
              <div class="flex items-center gap-2 mb-1.5 flex-wrap">${badges}</div>
              <div class="flex items-center gap-3">
                <span class="text-3xl">${crop.emoji}</span>
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-purple-200">${crop.name}</div>
                  <div class="text-xs text-purple-400">⚖️ ${item.weight.toFixed(2)} kg</div>
                </div>
              </div>
            </div>
            <div class="p-3">
              <button class="sell-mutated w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition active:scale-95">
                Sell ₱${sellPrice.toLocaleString()}
              </button>
            </div>
          `;

          card.querySelector('.sell-mutated').addEventListener('click', () => {
            const currentItems = gameState.inventory[cropId];
            if (!currentItems) return;
            const idx = currentItems.indexOf(item);
            if (idx === -1) return;
            const result = gameState.sellCrop(cropId, idx);
            if (result) {
              playSound('sell');
              showToast(`${crop.emoji} Mutated crop sold for ₱${result.amount.toLocaleString()}!`, 'gold');
              if (result.catDoubled) {
                setTimeout(() => showToast('🐈 Cat doubled the price!', 'gold'), 400);
              }
              gameState.checkAchievements();
            }
          });

          list.appendChild(card);
        }
      }
    }

    // === NORMAL CROPS SECTION ===
    const normalByCropId = {};
    for (const entry of normalItems) {
      if (!normalByCropId[entry.cropId]) normalByCropId[entry.cropId] = [];
      normalByCropId[entry.cropId].push(entry);
    }

    if (Object.keys(normalByCropId).length > 0) {
      const normalHeader = document.createElement('div');
      normalHeader.className = 'flex items-center gap-2 mb-2 mt-2';
      normalHeader.innerHTML = `
        <h3 class="text-sm font-bold text-slate-300">🌾 Normal Crops</h3>
      `;
      list.appendChild(normalHeader);

      for (const [cropId, cropItems] of Object.entries(normalByCropId)) {
        const crop = cropItems[0].crop;
        const items = cropItems.map(e => e.item);
        const count = items.length;
        const totalValue = items.reduce((sum, item) => sum + gameState.getItemSellPrice(cropId, item), 0);

        let heaviestIdx = 0;
        for (let i = 1; i < items.length; i++) {
          if (items[i].weight > items[heaviestIdx].weight) heaviestIdx = i;
        }
        const bestPrice = gameState.getItemSellPrice(cropId, items[heaviestIdx]);

        const card = document.createElement('div');
        card.className = 'flex items-center gap-3 p-4 rounded-2xl bg-slate-800/60 border border-white/5';
        card.innerHTML = `
          <span class="text-3xl flex-shrink-0">${crop.emoji}</span>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-white">${crop.name} <span class="text-slate-400 text-sm">x${count}</span></div>
            <div class="text-xs text-slate-400 mt-0.5">Best: ₱${bestPrice.toLocaleString()} · Total: ₱${totalValue.toLocaleString()}</div>
          </div>
          <div class="flex flex-col gap-1.5 flex-shrink-0">
            <button class="sell-best px-3 py-1.5 bg-yellow-600/80 hover:bg-yellow-500 active:bg-yellow-400 text-white rounded-xl text-xs font-semibold transition active:scale-95">₱${bestPrice.toLocaleString()}</button>
            <button class="sell-all px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-300 text-slate-900 rounded-xl text-xs font-bold transition active:scale-95">All ₱${totalValue.toLocaleString()}</button>
          </div>
        `;

        card.querySelector('.sell-best').addEventListener('click', () => {
          const result = gameState.sellHeaviest(cropId);
          if (result) {
            playSound('sell');
            showToast(`${crop.emoji} sold for ₱${result.amount.toLocaleString()}!`, 'gold');
            if (result.catDoubled) {
              setTimeout(() => showToast('🐈 Cat doubled the price!', 'gold'), 400);
            }
            const newAchs = gameState.checkAchievements();
            for (const ach of newAchs) {
              setTimeout(() => showToast(`🏆 ${ach.name} unlocked!`, 'gold'), 500);
            }
          }
        });

        card.querySelector('.sell-all').addEventListener('click', () => {
          const result = gameState.sellAll(cropId);
          if (result) {
            playSound('sell');
            showToast(`${result.count} ${crop.emoji} sold for ₱${result.amount.toLocaleString()}!`, 'gold');
            if (result.catDoubled) {
              setTimeout(() => showToast('🐈 Cat doubled the price!', 'gold'), 400);
            }
            gameState.checkAchievements();
          }
        });

        list.appendChild(card);
      }
    }
  }

  gameState.subscribe(render);
  render();
  return { element: container, render };
}
