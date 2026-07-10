import { gameState } from './state.js';
import { getSaveData } from './storage.js';
import { startAutoSave, stopAutoSave, triggerCloudSave } from './api-client.js';
import { createStatsBar, createTabs } from './ui/layout.js';
import { createFarmView } from './ui/farm-view.js';
import { createShopView } from './ui/shop-view.js';
import { createMarketView } from './ui/market-view.js';
import { createInventoryView } from './ui/inventory-view.js';
import { createResearchView } from './ui/research-view.js';
import { createObjectivesView } from './ui/objectives-view.js';
import { createLeaderboardView } from './ui/leaderboard-view.js';
import { createAuthView, showAuthExpiredPopup } from './ui/auth-view.js';
import { createWelcomeScreen, createSplashScreen, showLoginRewardPopup, createTutorialOverlay, createUpdateNotesOverlay, hasSeenUpdateNotes, markUpdateNotesSeen } from './ui/overlays.js';
import { initToast, showToast, playSound, createMusicButton } from './ui/audio-ui.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

async function init() {
  initToast();

  const app = document.getElementById('app');
  if (!app) return;

  // Auth flow — show login screen first
  let authContainer = null;
  const { element: authEl } = createAuthView(async (username) => {
    // Remove auth screen
    if (authContainer && authContainer.parentNode) authContainer.remove();
    showToast(t('app.auth.welcome', { username }), 'success');
    // Proceed to game
    await startApp();
  });
  authContainer = authEl;
  app.appendChild(authEl);
}

async function startApp() {
  // Show splash FIRST — before any game init
  createSplashScreen(async () => {
    // Initialize game state after splash finishes
    await gameState.init();

    const app = document.getElementById('app');
    if (!app) return;

    // Start auto-save (always authenticated in online-only mode)
    startAutoSave(getSaveData);

    // Listen for auth expiration
    window.addEventListener('pf-auth-expired', () => {
      stopAutoSave();
      showAuthExpiredPopup(() => {
        window.location.reload();
      });
    });

    const seen = await hasSeenUpdateNotes();

    if (!seen) {
      const updateNotes = createUpdateNotesOverlay(async () => {
        await markUpdateNotesSeen();
        proceedAfterSplash(app);
      });
      document.body.appendChild(updateNotes);
    } else {
      proceedAfterSplash(app);
    }
  });
}

function proceedAfterSplash(app) {
  if (gameState.isNewPlayer || !gameState.player.farmName) {
    const welcome = createWelcomeScreen(async (name) => {
      const result = await gameState.setFarmName(name);
      if (!result.success) {
        showToast('Please enter a valid name', 'error');
        return;
      }
      gameState.isNewPlayer = false;
      showToast(t('app.toast.farm_named', { name: gameState.getDisplayName() }), 'success');
      // Cloud save after naming
      await triggerCloudSave(getSaveData);
      // Show tutorial for new players
      const tutorial = createTutorialOverlay(() => {
        startGame(app);
      });
      document.body.appendChild(tutorial);
    });
    app.appendChild(welcome);
  } else {
    startGame(app);
  }
}

function startGame(app) {
  // Show login reward popup if pending
  if (gameState.pendingLoginReward) {
    setTimeout(() => showLoginRewardPopup(), 500);
  }

  // Check achievements on startup
  const startupAchievements = gameState.checkAchievements();
  if (startupAchievements.length > 0) {
    setTimeout(() => {
      for (const ach of startupAchievements) {
        showToast(`🏆 Achievement: ${ach.name}!`, 'gold');
      }
    }, 1500);
  }

  gameState.on('levelup', (level) => {
    playSound('levelup');
    const title = gameState.getLevelTitle();
    showToast(t('app.toast.level_up', { level, title }), 'gold');
    // Check achievements after level up
    const newAchs = gameState.checkAchievements();
    for (const ach of newAchs) {
      setTimeout(() => showToast(`🏆 ${ach.name} unlocked!`, 'gold'), 500);
    }
    // Cloud save on level up
    triggerCloudSave(getSaveData);
  });

  gameState.on('weatherChange', (weather) => {
    playSound('weather');
    showToast(`${weather.emoji} ${weather.name} — ${weather.mutationEmoji} ${weather.mutation} (+₱${weather.priceBonus || 0})`, 'info');
    // Check weather achievements
    const newAchs = gameState.checkAchievements();
    for (const ach of newAchs) {
      setTimeout(() => showToast(`🏆 ${ach.name} unlocked!`, 'gold'), 500);
    }
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
    research: createResearchView(),
    inventory: createInventoryView(),
    objectives: createObjectivesView(),
    leaderboard: createLeaderboardView(),
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

  // Music toggle button
  app.appendChild(createMusicButton());
}

document.addEventListener('DOMContentLoaded', init);
