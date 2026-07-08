// Polyfills for browser environment - Pocket Farm
window.miniappI18n = {
  t: (key, values = {}) => {
    const parts = key.split('.');
    let result = window.translations || {};
    for (const part of parts) {
      result = result[part];
      if (!result) break;
    }
    if (typeof result === 'string') {
      return Object.keys(values).reduce((str, k) => {
        return str.replace(new RegExp(`{${k}}`, 'g'), values[k]);
      }, result);
    }
    return key;
  }
};

window.translations = {
  "app": {
    "title": "Pocket Farm",
    "welcome": {
      "title": "Welcome to",
      "subtitle": "Pocket Farm",
      "name_label": "Name your farm",
      "name_placeholder": "My Farm",
      "start": "🌾 Start Farming"
    },
    "tabs": {
      "farm": "Farm",
      "shop": "Shop",
      "market": "Market",
      "inventory": "Inventory"
    },
    "stats": {
      "peso": "Peso",
      "xp": "XP",
      "level": "Level"
    },
    "farm": {
      "empty": "Tap to Plant",
      "growing": "Growing...",
      "ready": "READY!",
      "harvest": "Harvest",
      "buy_plot": "Buy Plot",
      "plots": "plots"
    },
    "shop": {
      "seeds": "Seeds",
      "gear": "Gear"
    },
    "market": {
      "title": "Market",
      "empty": "No crops to sell yet"
    },
    "inventory": {
      "title": "Inventory",
      "empty": "Your inventory is empty"
    },
    "toast": {
      "planted": "Planted {crop}!",
      "harvested": "Harvested {crop}! +{xp} XP",
      "sold": "Sold {quantity} {crop} for ₱{amount}!",
      "level_up": "⭐ Level {level} – {title}!",
      "double": "Double harvest! 🎉",
      "farm_named": "Welcome to {name}! 🌱",
      "plot_bought": "🔓 New plot unlocked!"
    }
  }
};

// Storage polyfill
if (!window.miniappsAI) window.miniappsAI = {};
if (!window.miniappsAI.storage) {
  window.miniappsAI.storage = {
    getItem: async (key) => {
      try { return localStorage.getItem(key); } catch(e) { return null; }
    },
    setItem: async (key, value) => {
      try { localStorage.setItem(key, value); } catch(e) {}
    }
  };
}
