// polyfills.js
window.miniappsAI = window.miniappsAI || {
  storage: {
    async getItem(key) {
      return localStorage.getItem(key);
    },
    async setItem(key, value) {
      localStorage.setItem(key, value);
      return true;
    }
  }
};

window.miniappI18n = {
  t(key, values = {}) {
    const en = {
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
      "app.farm.empty": "Tap to Plant",
      "app.farm.ready": "READY!",
      "app.farm.harvest": "Harvest",
      "app.market.empty": "No crops to sell yet",
      "app.inventory.empty": "Your inventory is empty",
      "app.toast.planted": "Planted {crop}!",
      "app.toast.level_up": "⭐ Level {level} – {title}!",
      "app.toast.farm_named": "Welcome to {name}! 🌱",
      "app.farm.buy_plot": "Buy Plot",
      "app.farm.growing": "Growing",
      "app.toast.harvested": "Harvested!",
      "app.farm.plots": "Plots",
      "app.inventory.title": "Inventory",
      "app.market.title": "Market"
    };
    let str = en[key] || key;
    return str.replace(/\{(\w+)\}/g, (m, k) => values[k] !== undefined ? values[k] : m);
  }
};