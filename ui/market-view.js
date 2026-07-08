import { gameState } from '../state.js';
import { showToast } from './toast.js';
import { playSound } from './sounds.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function createMarketView() {
  const container = document.createElement('div');
  container.className = 'p-4 pb-24 max-w-lg mx-auto';

  const title = document.createElement('h2');
  title.className = 'text-xl font-bold text-white mb-4';
  title.textContent = t('app.market.title');
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'space-y-3';
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

    for (const [cropId, items] of entries) {
      const crop = gameState.getCrop(cropId);
      if (!crop) continue;
      const count = items.length;

      let heaviestIdx = 0;
      for (let i = 1; i < items.length; i++) {
        if (items[i].weight > items[heaviestIdx].weight) heaviestIdx = i;
      }
      const heaviest = items[heaviestIdx];
      const bestPrice = gameState.getItemSellPrice(cropId, heaviest);
      const totalValue = items.reduce((sum, item) => sum + gameState.getItemSellPrice(cropId, item), 0);

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
          const newAchs = gameState.checkAchievements();
          for (const ach of newAchs) {
            setTimeout(() => showToast(`🏆 ${ach.name} unlocked!`, 'gold'), 500);
          }
        }
      });

      list.appendChild(card);
    }
  }

  gameState.subscribe(render);
  render();
  return { element: container, render };
}
