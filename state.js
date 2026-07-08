import { CROPS } from './data/crops.js';
import { LEVELS } from './data/levels.js';
import { SPRINKLERS } from './data/gear.js';
import { WEATHER_TYPES, SECRET_MUTATIONS, WEATHER_CHANGE_INTERVAL, MUTATION_CHANCE } from './data/weather.js';
import { loadGame, saveGame } from './storage.js';

class GameState {
  constructor() {
    this.player = { peso: 100, xp: 0, level: 1, farmName: '' };
    this.plots = [];
    this.seeds = {};
    this.inventory = {};
    this.gear = { sprinklerLevel: 0, hasShovel: false, fertilizerCount: 0 };
    this.boughtPlots = 0;
    this.isNewPlayer = false;
    this.currentWeather = null;
    this.lastWeatherChange = 0;
    this.cropAvailability = {};
    this.lastAvailabilityRefresh = 0;
    this.sprinklerAvailability = {};
    this.lastSprinklerRefresh = 0;
    this.listeners = [];
    this.events = {};
  }

  async init() {
    const saved = await loadGame();
    if (saved) {
      this.player = { ...this.player, ...saved.player };
      if (this.player.coins !== undefined) {
        this.player.peso = this.player.coins;
        delete this.player.coins;
      }
      this.plots = (saved.plots || []).map(p => ({
        ...p,
        mutations: p.mutations || [],
        fertilized: p.fertilized || false,
        harvestCount: p.harvestCount || 0,
      }));
      for (const plot of this.plots) {
        if (plot.cropId && !this.getCrop(plot.cropId)) {
          plot.status = 'empty';
          plot.cropId = null;
          plot.plantedAt = null;
          plot.harvestAt = null;
          plot.mutations = [];
          plot.fertilized = false;
          plot.harvestCount = 0;
        }
      }
      this.seeds = saved.seeds || {};
      for (const cropId of Object.keys(this.seeds)) {
        if (!this.getCrop(cropId)) delete this.seeds[cropId];
      }
      this.gear = { sprinklerLevel: 0, hasShovel: false, fertilizerCount: 0, ...saved.gear };
      this.boughtPlots = saved.boughtPlots || 0;
      this.currentWeather = saved.currentWeather || null;
      this.lastWeatherChange = saved.lastWeatherChange || 0;
      this.cropAvailability = saved.cropAvailability || {};
      this.lastAvailabilityRefresh = saved.lastAvailabilityRefresh || 0;
      this.sprinklerAvailability = saved.sprinklerAvailability || {};
      this.lastSprinklerRefresh = saved.lastSprinklerRefresh || 0;
      if (saved.inventory) {
        this.inventory = this._migrateInventory(saved.inventory);
      }
    } else {
      this.isNewPlayer = true;
      this._giveStarterSeeds();
    }
    this._initPlots();
    this._processOfflineGrowth();
    this._checkWeather();
    this._refreshCropAvailability();
    this._refreshSprinklerAvailability();
    this.notify();
  }

  _giveStarterSeeds() {
    this.seeds = { kangkong: 5, pechay: 3, mustasa: 2 };
  }

  _migrateInventory(inv) {
    const migrated = {};
    for (const [cropId, value] of Object.entries(inv)) {
      if (!this.getCrop(cropId)) continue;
      if (Array.isArray(value)) {
        const filtered = value.filter(item => {
          if (item && typeof item === 'object' && typeof item.weight === 'number' && item.weight > 0) {
            if (!item.mutations) item.mutations = [];
            return true;
          }
          if (typeof item === 'number' && item > 0) return true;
          return false;
        });
        if (filtered.length > 0) {
          migrated[cropId] = filtered.map(item =>
            typeof item === 'number' ? { weight: item, mutations: [] } : item
          );
        }
      }
    }
    return migrated;
  }

  _initPlots() {
    const count = this.getPlotCount();
    while (this.plots.length < count) {
      this.plots.push({ id: this.plots.length, status: 'empty', cropId: null, plantedAt: null, harvestAt: null, mutations: [], fertilized: false, harvestCount: 0 });
    }
  }

  getPlotCount() {
    return 4 + (this.player.level - 1) * 2 + this.boughtPlots;
  }

  _processOfflineGrowth() {
    const now = Date.now();
    for (const plot of this.plots) {
      if (plot.status === 'growing' && plot.harvestAt && now >= plot.harvestAt) {
        plot.status = 'ready';
      }
    }
  }

  _updatePlotStatuses() {
    const now = Date.now();
    for (const plot of this.plots) {
      if (plot.status === 'growing' && plot.harvestAt && now >= plot.harvestAt) {
        plot.status = 'ready';
      }
    }
  }

  getCrop(cropId) {
    return CROPS.find(c => c.id === cropId);
  }

  isCropUnlocked(cropId) {
    return this.isCropAvailable(cropId);
  }

  isCropAvailable(cropId) {
    const entry = this.cropAvailability[cropId];
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this._refreshCropAvailability();
      return this.cropAvailability[cropId]?.available || false;
    }
    return entry.available;
  }

  _refreshCropAvailability() {
    const AVAILABILITY_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    const expiresAt = now + AVAILABILITY_DURATION;
    const CHANCES = { starter: 0.8, intermediate: 0.8, advanced: 0.3, premium: 0.15 };

    let changed = false;
    for (const crop of CROPS) {
      const existing = this.cropAvailability[crop.id];
      if (existing && now < existing.expiresAt) continue;
      const chance = CHANCES[crop.category] || 0.5;
      this.cropAvailability[crop.id] = { available: Math.random() < chance, expiresAt };
      changed = true;
    }
    if (changed) {
      this.lastAvailabilityRefresh = now;
      this.save();
    }
  }

  getAvailabilityTimeRemaining() {
    const entries = Object.values(this.cropAvailability);
    if (entries.length === 0) return 0;
    const nextExpiry = Math.min(...entries.map(e => e.expiresAt));
    return Math.max(0, nextExpiry - Date.now());
  }

  // === Sprinkler Availability ===
  isSprinklerAvailable(tier) {
    const entry = this.sprinklerAvailability[tier];
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this._refreshSprinklerAvailability();
      return this.sprinklerAvailability[tier]?.available || false;
    }
    return entry.available;
  }

  _refreshSprinklerAvailability() {
    const SPRINKLER_DURATION = 5 * 60 * 1000;
    const now = Date.now();
    const expiresAt = now + SPRINKLER_DURATION;
    const CHANCES = { 1: 0.8, 2: 0.6, 3: 0.4 };

    let changed = false;
    for (const sp of SPRINKLERS) {
      const existing = this.sprinklerAvailability[sp.tier];
      if (existing && now < existing.expiresAt) continue;
      this.sprinklerAvailability[sp.tier] = { available: Math.random() < (CHANCES[sp.tier] || 0.5), expiresAt };
      changed = true;
    }
    if (changed) {
      this.lastSprinklerRefresh = now;
      this.save();
    }
  }

  getSprinklerAvailabilityTimeRemaining() {
    const entries = Object.values(this.sprinklerAvailability);
    if (entries.length === 0) return 0;
    const nextExpiry = Math.min(...entries.map(e => e.expiresAt));
    return Math.max(0, nextExpiry - Date.now());
  }

  getEffectiveGrowTime(cropId) {
    const crop = this.getCrop(cropId);
    if (!crop) return 0;
    const sp = SPRINKLERS.find(s => s.tier === this.gear.sprinklerLevel);
    const bonus = sp ? sp.speedBonus : 0;
    return Math.max(1, Math.floor(crop.growTime * (1 - bonus)));
  }

  // === Seeds ===
  buySeed(cropId, quantity = 1) {
    const crop = this.getCrop(cropId);
    if (!crop || !this.isCropAvailable(cropId)) return false;
    const totalCost = crop.seedCost * quantity;
    if (this.player.peso < totalCost) return false;
    this.player.peso -= totalCost;
    this.seeds[cropId] = (this.seeds[cropId] || 0) + quantity;
    this.save();
    return true;
  }

  // === Planting ===
  plantCrop(plotIndex, cropId) {
    const plot = this.plots[plotIndex];
    if (!plot || plot.status !== 'empty') return false;
    if (!this.seeds[cropId] || this.seeds[cropId] <= 0) return false;
    if (!this.getCrop(cropId)) return false;

    this.seeds[cropId]--;
    if (this.seeds[cropId] <= 0) delete this.seeds[cropId];

    const now = Date.now();
    const growMs = this.getEffectiveGrowTime(cropId) * 1000;
    plot.status = 'growing';
    plot.cropId = cropId;
    plot.plantedAt = now;
    plot.harvestAt = now + growMs;
    plot.mutations = [];
    plot.fertilized = false;
    plot.harvestCount = 0;
    this.save();
    return true;
  }

  // === Harvesting (persistent — crop re-grows after harvest) ===
  harvestCrop(plotIndex) {
    const plot = this.plots[plotIndex];
    if (!plot || !plot.cropId) return null;

    // Auto-update status if time has passed (fixes harvest button bug)
    if (plot.status === 'growing' && plot.harvestAt && Date.now() >= plot.harvestAt) {
      plot.status = 'ready';
    }

    if (plot.status !== 'ready') return null;
    const crop = this.getCrop(plot.cropId);
    if (!crop) return null;

    const sp = SPRINKLERS.find(s => s.tier === this.gear.sprinklerLevel);
    const doubleChance = sp && sp.doubleHarvestBonus ? sp.doubleHarvestBonus * 100 : 0;
    const isDouble = Math.random() * 100 < doubleChance;
    const qty = isDouble ? 2 : 1;

    const items = [];
    for (let i = 0; i < qty; i++) {
      const w = this._generateWeight(crop, plot.fertilized);
      const item = { weight: w, mutations: [...(plot.mutations || [])] };
      items.push(item);
      if (!this.inventory[crop.id]) this.inventory[crop.id] = [];
      this.inventory[crop.id].push(item);
    }

    this.addXP(crop.xp * qty);

    // Persistent crop — re-grow instead of clearing the plot
    const growMs = this.getEffectiveGrowTime(plot.cropId) * 1000;
    plot.harvestCount = (plot.harvestCount || 0) + 1;
    plot.status = 'growing';
    plot.plantedAt = Date.now();
    plot.harvestAt = Date.now() + growMs;
    plot.mutations = [];
    plot.fertilized = false;
    // Keep cropId — the plant stays!

    this.save();
    return { crop, quantity: qty, isDouble, items };
  }

  _generateWeight(crop, fertilized) {
    const range = crop.maxWeight - crop.minWeight;
    const r = (Math.random() + Math.random() + Math.random()) / 3;
    let weight = crop.minWeight + range * r;
    if (fertilized) {
      weight *= 1 + (0.2 + Math.random() * 0.3);
    }
    return Math.round(weight * 100) / 100;
  }

  // === Shovel ===
  shovelCrop(plotIndex) {
    if (!this.gear.hasShovel) return false;
    const plot = this.plots[plotIndex];
    if (!plot || plot.status === 'empty') return false;
    plot.status = 'empty';
    plot.cropId = null;
    plot.plantedAt = null;
    plot.harvestAt = null;
    plot.mutations = [];
    plot.fertilized = false;
    plot.harvestCount = 0;
    this.save();
    return true;
  }

  // === Fertilizer ===
  fertilizeCrop(plotIndex) {
    const plot = this.plots[plotIndex];
    if (!plot || plot.status !== 'growing' || plot.fertilized) return false;
    if (this.gear.fertilizerCount <= 0) return false;
    this.gear.fertilizerCount--;
    plot.fertilized = true;
    this.save();
    return true;
  }

  // === Gear ===
  buyShovel() {
    if (this.gear.hasShovel) return false;
    this.gear.hasShovel = true;
    this.save();
    return true;
  }

  buyFertilizer(quantity = 1) {
    const cost = 5 * quantity;
    if (this.player.peso < cost) return false;
    this.player.peso -= cost;
    this.gear.fertilizerCount += quantity;
    this.save();
    return true;
  }

  buySprinkler(tier) {
    const sp = SPRINKLERS.find(s => s.tier === tier);
    if (!sp) return false;
    if (this.gear.sprinklerLevel >= tier) return false;
    if (this.gear.sprinklerLevel < tier - 1) return false;
    if (!this.isSprinklerAvailable(tier)) return false;
    if (this.player.peso < sp.cost) return false;
    this.player.peso -= sp.cost;
    this.gear.sprinklerLevel = tier;
    this.save();
    return true;
  }

  // === Plots ===
  buyPlot() {
    if (this.player.peso < 20) return false;
    this.player.peso -= 20;
    this.boughtPlots++;
    this.plots.push({ id: this.plots.length, status: 'empty', cropId: null, plantedAt: null, harvestAt: null, mutations: [], fertilized: false, harvestCount: 0 });
    this.save();
    return true;
  }

  // === Mutations ===
  getMutationMultiplier(mutations) {
    if (!mutations || mutations.length === 0) return 1;
    let total = 1;
    for (const m of mutations) {
      total *= m.isSecret ? m.bonusMultiplier : m.multiplier;
    }
    return total;
  }

  getItemSellPrice(cropId, item) {
    const crop = this.getCrop(cropId);
    if (!crop) return 0;
    const basePrice = Math.floor(crop.sellPrice * item.weight * this.getMutationMultiplier(item.mutations));
    const minPrice = crop.seedCost * 5;
    return Math.max(basePrice, minPrice);
  }

  // === Selling ===
  sellCrop(cropId, itemIndex) {
    const items = this.inventory[cropId];
    if (!items || !items[itemIndex]) return null;
    const item = items[itemIndex];
    const price = this.getItemSellPrice(cropId, item);
    items.splice(itemIndex, 1);
    if (items.length === 0) delete this.inventory[cropId];
    this.player.peso += price;
    this.save();
    return { amount: price, item };
  }

  sellHeaviest(cropId) {
    const items = this.inventory[cropId];
    if (!items || items.length === 0) return null;
    let maxIdx = 0;
    for (let i = 1; i < items.length; i++) {
      if (items[i].weight > items[maxIdx].weight) maxIdx = i;
    }
    return this.sellCrop(cropId, maxIdx);
  }

  sellAll(cropId) {
    const items = this.inventory[cropId];
    if (!items || items.length === 0) return null;
    let totalAmount = 0;
    const count = items.length;
    for (const item of items) {
      totalAmount += this.getItemSellPrice(cropId, item);
    }
    delete this.inventory[cropId];
    this.player.peso += totalAmount;
    this.save();
    return { amount: totalAmount, count };
  }

  // === Weather ===
  _checkWeather() {
    this._updatePlotStatuses();
    const now = Date.now();
    if (!this.currentWeather || now - this.lastWeatherChange >= WEATHER_CHANGE_INTERVAL) {
      this._changeWeather();
    }
  }

  _changeWeather() {
    this.currentWeather = this._pickRandomWeather();
    this.lastWeatherChange = Date.now();

    for (const plot of this.plots) {
      if (plot.status === 'ready' && Math.random() < MUTATION_CHANCE) {
        if (!plot.mutations) plot.mutations = [];
        if (!plot.mutations.find(m => m.weatherId === this.currentWeather.id)) {
          plot.mutations.push({
            weatherId: this.currentWeather.id,
            name: this.currentWeather.mutation,
            emoji: this.currentWeather.mutationEmoji,
            multiplier: this.currentWeather.multiplier,
          });
          this._checkSecretMutations(plot);
        }
      }
    }

    this.save();
    this.emit('weatherChange', this.currentWeather);
  }

  _pickRandomWeather() {
    const totalWeight = WEATHER_TYPES.reduce((s, w) => s + w.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const w of WEATHER_TYPES) {
      roll -= w.weight;
      if (roll <= 0) return w;
    }
    return WEATHER_TYPES[0];
  }

  _checkSecretMutations(plot) {
    if (!plot.mutations) return;
    const weatherIds = new Set(plot.mutations.map(m => m.weatherId));
    for (const secret of SECRET_MUTATIONS) {
      if (secret.requires.every(id => weatherIds.has(id))) {
        if (!plot.mutations.find(m => m.weatherId === secret.id)) {
          plot.mutations.push({
            weatherId: secret.id,
            name: secret.name,
            emoji: secret.emoji,
            multiplier: 1,
            isSecret: true,
            bonusMultiplier: secret.bonusMultiplier,
          });
        }
      }
    }
  }

  getWeatherTimeRemaining() {
    if (!this.currentWeather) return 0;
    return Math.max(0, WEATHER_CHANGE_INTERVAL - (Date.now() - this.lastWeatherChange));
  }

  checkAndApplyWeather() {
    this._checkWeather();
  }

  // === Farm Name ===
  setFarmName(name) {
    this.player.farmName = (name || '').slice(0, 10).trim();
    this.save();
  }

  getDisplayName() {
    return this.player.farmName ? `${this.player.farmName} Farm` : 'Pocket Farm';
  }

  // === Level ===
  getLevelTitle() {
    const levelData = LEVELS.find(l => l.level === this.player.level);
    return levelData ? levelData.title : 'Newbie';
  }

  addXP(amount) {
    this.player.xp += amount;
    let leveledUp = false;
    while (true) {
      const next = LEVELS.find(l => l.level === this.player.level + 1);
      if (!next || this.player.xp < next.xpRequired) break;
      this.player.level = next.level;
      leveledUp = true;
      this._initPlots();
    }
    if (leveledUp) this.emit('levelup', this.player.level);
    return leveledUp;
  }

  getNextLevelXP() {
    const next = LEVELS.find(l => l.level === this.player.level + 1);
    return next ? next.xpRequired : null;
  }

  getCurrentLevelXP() {
    const current = LEVELS.find(l => l.level === this.player.level);
    return current ? current.xpRequired : 0;
  }

  // === Progress ===
  getProgress(plot) {
    if (plot.status !== 'growing' || !plot.harvestAt) return 0;
    const now = Date.now();
    if (now >= plot.harvestAt) return 1;
    return Math.min(1, (now - plot.plantedAt) / (plot.harvestAt - plot.plantedAt));
  }

  getRemainingMs(plot) {
    if (plot.status !== 'growing' || !plot.harvestAt) return 0;
    return Math.max(0, plot.harvestAt - Date.now());
  }

  // === Persistence ===
  async save() {
    await saveGame({
      player: this.player,
      plots: this.plots,
      seeds: this.seeds,
      inventory: this.inventory,
      gear: this.gear,
      boughtPlots: this.boughtPlots,
      currentWeather: this.currentWeather,
      lastWeatherChange: this.lastWeatherChange,
      cropAvailability: this.cropAvailability,
      lastAvailabilityRefresh: this.lastAvailabilityRefresh,
      sprinklerAvailability: this.sprinklerAvailability,
      lastSprinklerRefresh: this.lastSprinklerRefresh,
    });
    this.notify();
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => { this.listeners = this.listeners.filter(l => l !== fn); };
  }

  notify() {
    for (const fn of this.listeners) fn();
  }

  on(event, fn) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(fn);
  }

  emit(event, data) {
    if (this.events[event]) {
      for (const fn of this.events[event]) fn(data);
    }
  }
}

export const gameState = new GameState();
