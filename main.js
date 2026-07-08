import { gameState } from './state.js';
import { createStatsBar } from './ui/stats-bar.js';
import { createTabs } from './ui/tabs.js';
import { createFarmView } from './ui/farm-view.js';
import { createShopView } from './ui/shop-view.js';
import { createMarketView } from './ui/market-view.js';
import { createInventoryView } from './ui/inventory-view.js';
import { createWelcomeScreen } from './ui/welcome-screen.js';
import { createSplashScreen } from './ui/splash-screen.js';
import { initToast, showToast } from './ui/toast.js';
import { playSound } from './ui/sounds.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

async function init() {
  await gameState.init();

  const app = document.getElementById('app');
  if (!app) return;

  initToast();

  createSplashScreen(() => {
    if (gameState.isNewPlayer) {
      const welcome = createWelcomeScreen((name) => {
        gameState.setFarmName(name);
        gameState.isNewPlayer = false;
        showToast(t('app.toast.farm_named', { name: gameState.getDisplayName() }), 'success');
        startGame(app);
      });
      app.appendChild(welcome);
    } else {
      startGame(app);
    }
  });
}

function startGame(app) {
  gameState.on('levelup', (level) => {
    playSound('levelup');
    const title = gameState.getLevelTitle();
    showToast(t('app.toast.level_up', { level, title }), 'gold');
  });

  gameState.on('weatherChange', (weather) => {
    playSound('weather');
    showToast(`${weather.emoji} ${weather.name} — ${weather.mutationEmoji} ${weather.mutation} (x${weather.multiplier})`, 'info');
  });

  const { element: statsBar } = createStatsBar();
  app.appendChild(statsBar);

  const main = document.createElement('main');
  main.className = 'relative';
  app.appendChild(main);

  const views = {
    farm: createFarmView(),
    shop: createShopView(),
    market: createMarketView(),
    inventory: createInventoryView(),
  };

  let currentView = 'farm';

  function showView(id) {
    if (currentView === id) return;
    if (views[currentView].deactivate) views[currentView].deactivate();
    main.innerHTML = '';
    currentView = id;
    main.appendChild(views[id].element);
    if (views[id].activate) views[id].activate();
  }

  main.appendChild(views.farm.element);
  views.farm.activate?.();

  const tabs = createTabs(showView);
  app.appendChild(tabs);
}

document.addEventListener('DOMContentLoaded', init);
