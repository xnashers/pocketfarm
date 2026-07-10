// Polyfills for running outside the miniapp platform iframe
// Provides localStorage-based storage and hardcoded i18n translations

window.miniappsAI = window.miniappsAI || {
  storage: {
    async getItem(key) {
      return localStorage.getItem(key);
    },
    async setItem(key, value) {
      localStorage.setItem(key, value);
      return true;
    },
    async removeItem(key) {
      localStorage.removeItem(key);
    }
  },

  // Stub for TTS (not available locally)
  tts: {
    async speak() { console.warn('TTS not available outside platform'); },
    async stop() {},
    async listVoices() {
      return { voices: [], page: 1, itemsPerPage: 50, total: 0, hasMore: false };
    }
  },

  // Stubs for AI/file operations (not available locally)
  async callModel() { throw new Error('AI models not available outside platform'); },
  async callStructured() { throw new Error('AI models not available outside platform'); },
  async uploadFile() { throw new Error('File upload not available outside platform'); },
  async uploadFiles() { throw new Error('File upload not available outside platform'); },
  async promoteFile() { throw new Error('File promotion not available outside platform'); },
  extractText() { return ''; },
  extractMediaAssets() { return []; },
  async listModels() { return []; }
};

// Hardcoded i18n with English translations for local play
window.miniappI18n = window.miniappI18n || {
  t(key, values = {}) {
    const en = {
      "app.title": "Pocket Farm",
      "app.welcome.title": "Welcome to",
      "app.welcome.subtitle": "Pocket Farm",
      "app.welcome.name_label": "Name your farm",
      "app.welcome.name_placeholder": "My Farm",
      "app.welcome.start": "🌾 Start Farming",
      "app.tabs.farm": "Farm",
      "app.tabs.shop": "Shop",
      "app.tabs.market": "Market",
      "app.tabs.research": "Research",
      "app.tabs.inventory": "Inventory",
      "app.tabs.progress": "Progress",
      "app.stats.peso": "Peso",
      "app.stats.xp": "XP",
      "app.stats.level": "Level",
      "app.farm.empty": "Tap to Plant",
      "app.farm.growing": "Growing...",
      "app.farm.ready": "READY!",
      "app.farm.harvest": "Harvest",
      "app.farm.buy_plot": "Buy Plot",
      "app.farm.plots": "plots",
      "app.shop.seeds": "Seeds",
      "app.shop.gear": "Gear",
      "app.market.title": "Market",
      "app.market.empty": "No crops to sell yet",
      "app.research.title": "Research",
      "app.research.lab": "Research Lab",
      "app.research.mutations": "Mutation Lab",
      "app.research.weather": "Weather Center",
      "app.research.genetics": "Seed Genetics",
      "app.research.mastery": "Crop Mastery",
      "app.inventory.title": "Inventory",
      "app.inventory.empty": "Your inventory is empty",
      "app.toast.planted": "Planted {crop}!",
      "app.toast.harvested": "Harvested {crop}! +{xp} XP",
      "app.toast.sold": "Sold {quantity} {crop} for ₱{amount}!",
      "app.toast.level_up": "⭐ Level {level} – {title}!",
      "app.toast.double": "Double harvest! 🎉",
      "app.toast.farm_named": "Welcome to {name}! 🌱",
      "app.toast.plot_bought": "🔓 New plot unlocked!",
      "app.toast.harvested_crop": "Harvested {crop}!",
      "app.toast.weather_blocked": "🚫 Can't plant this crop in current weather!",
      "app.tabs.leaderboard": "Rankings",
      "app.auth.title": "POCKET FARM",
      "app.auth.subtitle": "Cloud Save & Leaderboard",
      "app.auth.login": "Login",
      "app.auth.register": "Register",
      "app.auth.username": "Username",
      "app.auth.username_placeholder": "farmer123",
      "app.auth.password": "Password",
      "app.auth.password_placeholder": "Min 4 characters",
      "app.auth.login_btn": "🌾 Login",
      "app.auth.register_btn": "🌱 Create Account",
      "app.auth.connecting": "Connecting...",
      "app.auth.error_length": "Username min 3 chars, password min 4 chars",
      "app.auth.welcome": "Welcome, {username}! 🌱",
      "app.auth.cloud_note": "Your farm saves automatically online",
      "app.auth.expired_title": "Session Expired",
      "app.auth.expired_msg": "Your session has expired. Please login again to continue.",
      "app.leaderboard.title": "🏆 Leaderboard",
      "app.leaderboard.subtitle": "Top farmers ranked by progress",
      "app.leaderboard.loading": "Loading rankings...",
      "app.leaderboard.error": "Failed to load leaderboard",
      "app.leaderboard.offline": "Leaderboard unavailable",
      "app.leaderboard.empty": "No farmers yet. Be the first!",
      "app.leaderboard.retry": "Try Again",
      "app.leaderboard.your_rank": "Your Rank",
      "app.leaderboard.login_required": "Login to see your rank and compete with other farmers!",
      "app.profile.account": "Account",
      "app.profile.save": "Save",
      "app.profile.cloud_synced": "🟢 Online",
      "app.profile.logout": "Logout",
      "app.profile.close": "Close",
      "app.toast.cloud_saved": "🟢 Saved",
      "app.toast.cloud_error": "Save failed — retrying"
    };
    let str = en[key] || key;
    return str.replace(/\{(\w+)\}/g, (m, k) => values[k] !== undefined ? values[k] : m);
  },
  getContext() {
    return { resolvedLocale: 'en', dir: 'ltr', availableLocales: ['en'], canChangeLocale: false };
  },
  async setLocale() {}
};
