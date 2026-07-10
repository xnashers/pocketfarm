// ═══════════════════════════════════════════
// CROPS
// ═══════════════════════════════════════════

export const CROP_CATEGORIES = [
  { id: 'starter', name: '🌱 Starter Crops', unlockLevel: 1 },
  { id: 'intermediate', name: '🌾 Intermediate Crops', unlockLevel: 8 },
  { id: 'advanced', name: '🌿 Advanced Crops', unlockLevel: 25 },
  { id: 'premium', name: '💎 Premium Crops', unlockLevel: 50 },
];

export const CROPS = [
  { id: 'kangkong', name: 'Kangkong', emoji: '🥬', category: 'starter', seedCost: 2, growTime: 15, sellPrice: 3, xp: 2, unlockLevel: 1, minWeight: 0.2, maxWeight: 0.8 },
  { id: 'pechay', name: 'Pechay', emoji: '🥦', category: 'starter', seedCost: 3, growTime: 20, sellPrice: 4, xp: 2, unlockLevel: 1, minWeight: 0.3, maxWeight: 1.0 },
  { id: 'mustasa', name: 'Mustasa', emoji: '🌿', category: 'starter', seedCost: 3, growTime: 25, sellPrice: 5, xp: 3, unlockLevel: 2, minWeight: 0.2, maxWeight: 0.7 },
  { id: 'sitaw', name: 'Strawberry', emoji: '🍓', category: 'starter', seedCost: 4, growTime: 30, sellPrice: 6, xp: 3, unlockLevel: 3, minWeight: 0.1, maxWeight: 0.5 },
  { id: 'talong', name: 'Talong', emoji: '🍆', category: 'starter', seedCost: 5, growTime: 40, sellPrice: 8, xp: 4, unlockLevel: 5, minWeight: 0.3, maxWeight: 1.2 },
  { id: 'kamatis', name: 'Kamatis', emoji: '🍅', category: 'intermediate', seedCost: 8, growTime: 60, sellPrice: 12, xp: 5, unlockLevel: 8, minWeight: 0.2, maxWeight: 0.8 },
  { id: 'kalabasa', name: 'Kalabasa', emoji: '🎃', category: 'intermediate', seedCost: 12, growTime: 90, sellPrice: 20, xp: 8, unlockLevel: 10, minWeight: 2.0, maxWeight: 8.0 },
  { id: 'mais', name: 'Mais', emoji: '🌽', category: 'intermediate', seedCost: 10, growTime: 75, sellPrice: 15, xp: 6, unlockLevel: 12, minWeight: 0.3, maxWeight: 1.0 },
  { id: 'palay', name: 'Palay', emoji: '🌾', category: 'intermediate', seedCost: 15, growTime: 100, sellPrice: 25, xp: 10, unlockLevel: 15, minWeight: 0.5, maxWeight: 2.0 },
  { id: 'ampalaya', name: 'Ampalaya', emoji: '🥒', category: 'intermediate', seedCost: 12, growTime: 80, sellPrice: 18, xp: 7, unlockLevel: 18, minWeight: 0.3, maxWeight: 1.0 },
  { id: 'sibuyas', name: 'Sibuyas', emoji: '🧅', category: 'advanced', seedCost: 20, growTime: 120, sellPrice: 35, xp: 12, unlockLevel: 25, minWeight: 0.2, maxWeight: 0.6 },
  { id: 'bawang', name: 'Bawang', emoji: '🧄', category: 'advanced', seedCost: 25, growTime: 150, sellPrice: 45, xp: 15, unlockLevel: 30, minWeight: 0.1, maxWeight: 0.4 },
  { id: 'kamote', name: 'Kamote', emoji: '🍠', category: 'advanced', seedCost: 22, growTime: 130, sellPrice: 40, xp: 13, unlockLevel: 35, minWeight: 0.5, maxWeight: 2.5 },
  { id: 'gabi', name: 'Gabi', emoji: '🥔', category: 'advanced', seedCost: 28, growTime: 160, sellPrice: 50, xp: 16, unlockLevel: 40, minWeight: 0.5, maxWeight: 3.0 },
  { id: 'mangga', name: 'Mangga', emoji: '🥭', category: 'premium', seedCost: 40, growTime: 200, sellPrice: 80, xp: 25, unlockLevel: 50, minWeight: 0.3, maxWeight: 1.5 },
  { id: 'calamansi', name: 'Calamansi', emoji: '🍋', category: 'premium', seedCost: 35, growTime: 180, sellPrice: 70, xp: 20, unlockLevel: 55, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'dragonfruit', name: 'Grapes', emoji: '🍇', category: 'premium', seedCost: 60, growTime: 250, sellPrice: 120, xp: 30, unlockLevel: 65, minWeight: 0.3, maxWeight: 1.0 },
  { id: 'durian', name: 'Avocado', emoji: '🥑', category: 'premium', seedCost: 80, growTime: 300, sellPrice: 200, xp: 40, unlockLevel: 80, minWeight: 2.0, maxWeight: 6.0 },
  { id: 'mangosteen', name: 'Pineapple', emoji: '🍍', category: 'premium', seedCost: 100, growTime: 280, sellPrice: 150, xp: 35, unlockLevel: 95, minWeight: 0.2, maxWeight: 0.5 },
];

// ═══════════════════════════════════════════
// GEAR
// ═══════════════════════════════════════════

export const GEAR_ITEMS = {
  fertilizer: {
    id: 'fertilizer',
    name: 'Fertilizer',
    emoji: '💩',
    description: 'Increase crop weight by 20-50%',
    cost: 5,
    type: 'consumable',
  },
};

export const SPRINKLERS = [
  { tier: 1, name: 'Basic Sprinkler', emoji: '💧', cost: 10, speedBonus: 0.10, duration: 300, description: '+10% crop growth speed · 5 min' },
  { tier: 2, name: 'Advanced Sprinkler', emoji: '💦', cost: 20, speedBonus: 0.25, duration: 300, description: '+25% crop growth speed · 5 min' },
  { tier: 3, name: 'Golden Sprinkler', emoji: '🌈', cost: 30, speedBonus: 0.50, doubleHarvestBonus: 0.10, duration: 300, description: '+50% speed · +10% double harvest · 5 min' },
];

// ═══════════════════════════════════════════
// LEVELS
// ═══════════════════════════════════════════

const LEVEL_TITLES = [
  'Newbie', 'Seedling', 'Sprout', 'Soil Digger', 'Tiny Farmer',
  'Garden Helper', 'Rookie Grower', 'Field Worker', 'Green Thumb', 'Crop Planter',
  'Young Harvester', 'Farm Apprentice', 'Barn Keeper', 'Seed Collector', 'Soil Master',
  'Irrigator', 'Orchard Worker', 'Crop Tender', 'Farmhand', 'Harvest Rookie',
  'Village Farmer', 'Garden Expert', 'Field Cultivator', 'Harvest Keeper', 'Crop Specialist',
  'Orchard Caretaker', 'Farm Ranger', 'Harvester', 'Barn Manager', 'Farm Guardian',
  'Expert Grower', 'Crop Overseer', 'Farm Steward', 'Golden Farmer', 'Orchard Master',
  'Land Tiller', 'Harvest Champion', 'Crop Veteran', 'Farm Hero', 'Master Cultivator',
  'Elite Farmer', 'Green Guardian', 'Harvest Captain', 'Farm Pioneer', 'Orchard Lord',
  'Seed Master', 'Harvest Specialist', 'Farm Commander', 'Crop Commander', 'Grand Farmer',
  'Agriculture Expert', 'Golden Harvester', 'Land Guardian', 'Farm Baron', 'Harvest Baron',
  'Crop Baron', 'Orchard Baron', 'Farm Noble', 'Green Baron', 'Harvest Noble',
  'Master Agriculturist', 'Grand Cultivator', 'Farm Tycoon', 'Crop Tycoon', 'Orchard Tycoon',
  'Harvest Tycoon', 'Golden Cultivator', 'Farm Mogul', 'Harvest Mogul', 'Land Mogul',
  'Farm Magnate', 'Agriculture Magnate', 'Harvest Magnate', 'Crop Emperor', 'Orchard Emperor',
  'Farm Emperor', 'Green Emperor', 'Harvest Emperor', 'Land Emperor', 'Supreme Farmer',
  'Eternal Grower', 'Legendary Cultivator', 'Mythic Farmer', 'Celestial Grower', 'Divine Harvester',
  "Nature's Chosen", 'Earth Guardian', 'Forest Protector', 'Harvest Legend', 'Golden Legend',
  'Ancient Farmer', 'Spirit of Nature', 'Master of Seasons', 'Keeper of Harvests', 'Lord of Crops',
  'King of Fields', 'Emperor of Harvest', 'Farming Legend', 'Ultimate Farmer', 'God of Agriculture'
];

export const LEVELS = LEVEL_TITLES.map((title, i) => ({
  level: i + 1,
  xpRequired: i === 0 ? 0 : Math.floor(50 * (i + 1) * i / 2),
  title,
}));

export function getLevelReward(level) {
  if (level <= 0) return null;
  const tier = level <= 10 ? 1 : level <= 25 ? 2 : level <= 50 ? 3 : 4;
  const qty = tier === 1 ? 3 + Math.floor(level / 3) : tier === 2 ? 5 + Math.floor(level / 5) : tier === 3 ? 8 + Math.floor(level / 8) : 10 + Math.floor(level / 10);
  const starterPool = ['kangkong', 'pechay', 'mustasa', 'sitaw', 'talong'];
  const intermediatePool = ['kamatis', 'kalabasa', 'mais', 'palay', 'ampalaya'];
  const advancedPool = ['sibuyas', 'bawang', 'kamote', 'gabi'];
  const premiumPool = ['mangga', 'calamansi', 'dragonfruit', 'durian', 'mangosteen'];
  let pool;
  if (level <= 5) pool = starterPool;
  else if (level <= 10) pool = [...starterPool, ...starterPool.slice(0, 3)];
  else if (level <= 15) pool = [...starterPool, ...intermediatePool.slice(0, 3)];
  else if (level <= 25) pool = intermediatePool;
  else if (level <= 35) pool = [...intermediatePool.slice(0, 3), ...advancedPool.slice(0, 2)];
  else if (level <= 50) pool = [...advancedPool, ...intermediatePool.slice(0, 2)];
  else if (level <= 65) pool = [...advancedPool, ...premiumPool.slice(0, 2)];
  else if (level <= 80) pool = premiumPool;
  else pool = [...premiumPool, ...premiumPool];
  const seed = level * 2654435761;
  const idx = Math.abs(seed) % pool.length;
  const cropId = pool[idx];
  return { cropId, quantity: qty };
}

export const LEVEL_MILESTONES = [
  'Expanded farm territory available',
  'New seeds unlocked in the Shop',
  'Increased crop yield potential',
];

// ═══════════════════════════════════════════
// LOGIN REWARDS
// ═══════════════════════════════════════════

export const LOGIN_CYCLE = [
  { day: 1, reward: { type: 'peso', amount: 500 }, label: '₱500', emoji: '💰' },
  { day: 2, reward: { type: 'fertilizer', amount: 5 }, label: 'Fertilizer ×5', emoji: '💩' },
  { day: 3, reward: { type: 'sprinkler', tier: 1, amount: 3 }, label: 'Basic Sprinkler ×3', emoji: '💧' },
  { day: 4, reward: { type: 'peso', amount: 2000 }, label: '₱2,000', emoji: '💰' },
  { day: 5, reward: { type: 'sprinkler', tier: 2, amount: 2 }, label: 'Advanced Sprinkler ×2', emoji: '💦' },
  { day: 6, reward: { type: 'premium_seed_pack', amount: 1 }, label: 'Premium Seed Pack', emoji: '📦' },
  { day: 7, reward: { type: 'gift_crate', amount: 1 }, label: "Farmer's Gift Crate", emoji: '🎁' },
];

export const MONTHLY_MILESTONES = [
  { days: 7, reward: { type: 'premium_seed_pack', amount: 1 }, label: 'Premium Seed Pack', emoji: '📦' },
  { days: 14, reward: { type: 'sprinkler', tier: 3, amount: 5 }, label: 'Golden Sprinkler ×5', emoji: '🌈' },
  { days: 21, reward: { type: 'weather_ticket', amount: 5 }, label: 'Weather Ticket ×5', emoji: '🎫' },
  { days: 30, reward: { type: 'gift_crate', amount: 3 }, label: 'Monthly Crate ×3', emoji: '🎁' },
];

// ═══════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════

export const ACHIEVEMENTS = [
  { id: 'beginner_farmer', name: 'Beginner Farmer', emoji: '🌱', cat: 'farming', desc: 'Harvest 100 crops', check: s => s.totalHarvests >= 100, reward: { type: 'peso', amount: 500 }, title: null },
  { id: 'green_thumb', name: 'Green Thumb', emoji: '🌿', cat: 'farming', desc: 'Harvest 1,000 crops', check: s => s.totalHarvests >= 1000, reward: { type: 'peso', amount: 5000 }, title: null },
  { id: 'harvest_king', name: 'Harvest King', emoji: '👑', cat: 'farming', desc: 'Harvest 10,000 crops', check: s => s.totalHarvests >= 10000, reward: { type: 'peso', amount: 50000 }, title: null },
  { id: 'pocket_legend', name: 'Pocket Legend', emoji: '🌟', cat: 'farming', desc: 'Harvest 100,000 crops', check: s => s.totalHarvests >= 100000, reward: { type: 'tokens', amount: 200 }, title: 'pocket_legend' },
  { id: 'first_earnings', name: 'First Earnings', emoji: '💵', cat: 'money', desc: 'Earn ₱1,000 total', check: s => s.totalEarned >= 1000, reward: { type: 'fertilizer', amount: 5 }, title: null },
  { id: 'rich_farmer', name: 'Rich Farmer', emoji: '💰', cat: 'money', desc: 'Earn ₱100,000 total', check: s => s.totalEarned >= 100000, reward: { type: 'sprinkler', tier: 2, amount: 5 }, title: null },
  { id: 'millionaire', name: 'Millionaire', emoji: '💎', cat: 'money', desc: 'Earn ₱1,000,000 total', check: s => s.totalEarned >= 1000000, reward: { type: 'sprinkler', tier: 3, amount: 10 }, title: null },
  { id: 'billionaire', name: 'Billionaire', emoji: '🤑', cat: 'money', desc: 'Earn ₱100,000,000 total', check: s => s.totalEarned >= 100000000, reward: { type: 'tokens', amount: 200 }, title: 'millionaire' },
  { id: 'first_mutation', name: 'First Mutation', emoji: '🧬', cat: 'mutations', desc: 'Obtain 1 mutation', check: s => s.totalMutations >= 1, reward: { type: 'peso', amount: 500 }, title: null },
  { id: 'mutation_hunter', name: 'Mutation Hunter', emoji: '🎯', cat: 'mutations', desc: 'Obtain 100 mutations', check: s => s.totalMutations >= 100, reward: { type: 'premium_seed_pack', amount: 1 }, title: null },
  { id: 'mutation_master', name: 'Mutation Master', emoji: '🧪', cat: 'mutations', desc: 'Obtain 500 mutations', check: s => s.totalMutations >= 500, reward: { type: 'weather_ticket', amount: 5 }, title: null },
  { id: 'mutation_god', name: 'Mutation God', emoji: '🌈', cat: 'mutations', desc: 'Obtain 5,000 mutations', check: s => s.totalMutations >= 5000, reward: { type: 'tokens', amount: 200 }, title: 'mutation_master' },
  { id: 'rain_watcher', name: 'Rain Watcher', emoji: '🌧️', cat: 'weather', desc: 'Experience 20 weather changes', check: s => s.weatherChangesExperienced >= 20, reward: { type: 'peso', amount: 1000 }, title: null },
  { id: 'weather_expert', name: 'Weather Expert', emoji: '🌦️', cat: 'weather', desc: 'Experience every weather type', check: s => (s.weatherTypesExperienced || []).length >= 15, reward: { type: 'sprinkler', tier: 3, amount: 5 }, title: 'weather_chaser' },
  { id: 'divine_witness', name: 'Divine Witness', emoji: '👑', cat: 'weather', desc: 'Experience Divine Weather', check: s => (s.weatherTypesExperienced || []).includes('divine'), reward: { type: 'premium_seed_pack', amount: 3 }, title: null },
  { id: 'collector', name: 'Collector', emoji: '📚', cat: 'collection', desc: 'Harvest every Starter crop', check: s => ['kangkong','pechay','mustasa','sitaw','talong'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'peso', amount: 1000 }, title: 'crop_specialist' },
  { id: 'expert_farmer', name: 'Expert Farmer', emoji: '🌾', cat: 'collection', desc: 'Harvest every Intermediate crop', check: s => ['kamatis','kalabasa','mais','palay','ampalaya'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'peso', amount: 5000 }, title: null },
  { id: 'master_farmer', name: 'Master Farmer', emoji: '🌿', cat: 'collection', desc: 'Harvest every Advanced crop', check: s => ['sibuyas','bawang','kamote','gabi'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'peso', amount: 15000 }, title: null },
  { id: 'legend_farmer', name: 'Legend Farmer', emoji: '💎', cat: 'collection', desc: 'Harvest every Premium crop', check: s => ['mangga','calamansi','dragonfruit','durian','mangosteen'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'tokens', amount: 150 }, title: 'legend_farmer' },
  { id: 'level_10', name: 'Level 10', emoji: '⭐', cat: 'level', desc: 'Reach Level 10', check: (s, p) => p.level >= 10, reward: { type: 'peso', amount: 2000 }, title: null },
  { id: 'level_25', name: 'Level 25', emoji: '🌟', cat: 'level', desc: 'Reach Level 25', check: (s, p) => p.level >= 25, reward: { type: 'premium_seed_pack', amount: 1 }, title: null },
  { id: 'level_50', name: 'Level 50', emoji: '💫', cat: 'level', desc: 'Reach Level 50', check: (s, p) => p.level >= 50, reward: { type: 'sprinkler', tier: 3, amount: 5 }, title: null },
  { id: 'level_100', name: 'Level 100', emoji: '🏆', cat: 'level', desc: 'Reach Level 100', check: (s, p) => p.level >= 100, reward: { type: 'tokens', amount: 200 }, title: 'pocket_farm_legend' },
];

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'farming', name: '🌾 Farming' },
  { id: 'money', name: '💰 Money' },
  { id: 'mutations', name: '🧬 Mutations' },
  { id: 'weather', name: '🌦️ Weather' },
  { id: 'collection', name: '📚 Collection' },
  { id: 'level', name: '⭐ Level' },
];

export const TITLE_DISPLAY = {
  pocket_legend: { name: 'Pocket Legend', emoji: '🌟' },
  millionaire: { name: 'Millionaire', emoji: '💰' },
  mutation_master: { name: 'Mutation Master', emoji: '🧪' },
  legend_farmer: { name: 'Legend Farmer', emoji: '💎' },
  pocket_farm_legend: { name: 'Pocket Farm Legend', emoji: '🏆' },
  weather_chaser: { name: 'Weather Chaser', emoji: '🌦️' },
  crop_specialist: { name: 'Crop Specialist', emoji: '🌾' },
};

// ═══════════════════════════════════════════
// RESEARCH
// ═══════════════════════════════════════════

export const RESEARCH_LAB = [
  { id: 'growth_speed', name: 'Growth Speed', emoji: '⚡', desc: '+2% per level', maxLevel: 20 },
  { id: 'weight_research', name: 'Weight Research', emoji: '⚖️', desc: '+1% crop weight', maxLevel: 20 },
  { id: 'harvest_xp', name: 'Harvest XP', emoji: '✨', desc: '+3% XP per harvest', maxLevel: 20 },
  { id: 'mutation_chance', name: 'Mutation Chance', emoji: '🧪', desc: '+0.5% mutation chance', maxLevel: 20 },
  { id: 'fertilizer_boost', name: 'Fertilizer Boost', emoji: '💩', desc: '+2% fertilizer effect', maxLevel: 20 },
];

export function getResearchCost(level) {
  if (level <= 0) return 0;
  return Math.floor(500 * Math.pow(3, level - 1) * (1 + level * 0.15));
}

export const MUTATION_LAB = [
  { id: 'mutation_duration', name: 'Weather Duration', emoji: '⏳', desc: 'Weather lasts 5% longer per level', maxLevel: 20 },
  { id: 'stack_limit', name: 'Mutation Stacking', emoji: '📚', desc: '+1 max mutations per level', maxLevel: 10 },
  { id: 'secret_chance', name: 'Secret Finder', emoji: '🔮', desc: '+2% secret mutation chance', maxLevel: 20 },
];

export function getMutationLabCost(level) {
  if (level <= 0) return 0;
  return Math.floor(2000 * Math.pow(3, level - 1) * (1 + level * 0.2));
}

export const WEATHER_CENTER = {
  forecast: { name: 'Forecast', emoji: '📡', costs: { 1: 5000, 2: 25000, 3: 100000 }, desc: 'See future weather events', maxLevel: 3 },
  skip: { name: 'Skip Weather', emoji: '⏭️', cost: 25000, desc: 'Change weather right now' },
  rareBoost: { name: 'Rare Weather Boost', emoji: '🌟', cost: 100000, desc: '+rare weather chance for 10 min', duration: 600000 },
};

export const GENETICS_TIERS = [
  { tier: 1, name: 'Improved', emoji: '⬆️', priceMultiplier: 1.5 },
  { tier: 2, name: 'Superior', emoji: '🏅', priceMultiplier: 2.25 },
  { tier: 3, name: 'Elite', emoji: '👑', priceMultiplier: 3.375 },
  { tier: 4, name: 'Legendary', emoji: '🌟', priceMultiplier: 5.0625 },
  { tier: 5, name: 'Mythic', emoji: '✨', priceMultiplier: 7.59375 },
];

export function getGeneticsCost(crop, currentTier) {
  return Math.floor(crop.seedCost * 100 * Math.pow(5, currentTier));
}

export const MASTERY_CONFIG = {
  maxLevel: 100,
  weightBonus: 0.005,
};

export function getMasteryCost(crop, level) {
  if (level <= 0) return 0;
  return Math.floor(crop.seedCost * 20 * Math.pow(1.08, level) * (1 + level * 0.05));
}

// ═══════════════════════════════════════════
// TOKEN SHOP
// ═══════════════════════════════════════════

export const TOKEN_SHOP_ITEMS = [
  { id: 'premium_seed_pack', name: 'Premium Seed Pack', emoji: '📦', cost: 50, desc: '3 random premium seeds', reward: { type: 'premium_seed_pack', amount: 1 } },
  { id: 'golden_sprinkler', name: 'Golden Sprinkler', emoji: '🌈', cost: 30, desc: 'One Golden Sprinkler', reward: { type: 'sprinkler', tier: 3, amount: 1 } },
  { id: 'weather_ticket', name: 'Weather Ticket', emoji: '🎫', cost: 20, desc: 'Skip weather for free', reward: { type: 'weather_ticket', amount: 1 } },
  { id: 'fertilizer_pack', name: 'Fertilizer Pack', emoji: '💩', cost: 10, desc: '×10 Fertilizer', reward: { type: 'fertilizer', amount: 10 } },
  { id: 'peso_pack', name: 'Peso Pack', emoji: '💰', cost: 15, desc: '₱5,000', reward: { type: 'peso', amount: 5000 } },
];

// ═══════════════════════════════════════════
// WEATHER
// ═══════════════════════════════════════════

export const WEATHER_TYPES = [
  { id: 'sunny', name: 'Sunny', emoji: '☀️', mutation: 'Sun-Kissed', mutationEmoji: '🌟', multiplier: 1.5, weight: 25 },
  { id: 'rain', name: 'Rain', emoji: '🌧️', mutation: 'Waterlogged', mutationEmoji: '💧', multiplier: 2, weight: 20 },
  { id: 'heatwave', name: 'Heatwave', emoji: '🔥', mutation: 'Scorched', mutationEmoji: '🔥', multiplier: 4, weight: 10 },
  { id: 'windstorm', name: 'Windstorm', emoji: '🌪️', mutation: 'Windblown', mutationEmoji: '💨', multiplier: 2.5, weight: 10 },
  { id: 'fog', name: 'Fog', emoji: '🌫️', mutation: 'Misty', mutationEmoji: '👻', multiplier: 3, weight: 12 },
  { id: 'cherry', name: 'Cherry Blossom', emoji: '🌸', mutation: 'Blooming', mutationEmoji: '🌸', multiplier: 6, weight: 8 },
  { id: 'thunderstorm', name: 'Thunderstorm', emoji: '⛈️', mutation: 'Shocked', mutationEmoji: '⚡', multiplier: 4, weight: 8 },
  { id: 'autumn', name: 'Autumn Wind', emoji: '🍂', mutation: 'Autumn', mutationEmoji: '🍁', multiplier: 3.5, weight: 5 },
  { id: 'snow', name: 'Snow', emoji: '❄️', mutation: 'Frozen', mutationEmoji: '🧊', multiplier: 5, weight: 5 },
  { id: 'fullmoon', name: 'Full Moon', emoji: '🌙', mutation: 'Moonlit', mutationEmoji: '🌙', multiplier: 10, weight: 4 },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', mutation: 'Rainbow', mutationEmoji: '🌈', multiplier: 8, weight: 3 },
  { id: 'meteor', name: 'Meteor Shower', emoji: '☄️', mutation: 'Cosmic', mutationEmoji: '☄️', multiplier: 15, weight: 3 },
  { id: 'aurora', name: 'Aurora', emoji: '✨', mutation: 'Aurora', mutationEmoji: '💜', multiplier: 20, weight: 2 },
  { id: 'eclipse', name: 'Eclipse', emoji: '🌌', mutation: 'Eclipse', mutationEmoji: '🌑', multiplier: 25, weight: 1 },
  { id: 'divine', name: 'Divine Weather', emoji: '👑', mutation: 'Divine', mutationEmoji: '✨', multiplier: 50, weight: 0.5 },
];

export const SECRET_MUTATIONS = [
  { id: 'lunar_prism', name: 'Lunar Prism', emoji: '🌌', requires: ['rainbow', 'fullmoon'], bonusMultiplier: 5 },
  { id: 'galactic_storm', name: 'Galactic Storm', emoji: '⚡', requires: ['thunderstorm', 'meteor'], bonusMultiplier: 5 },
  { id: 'crystal', name: 'Crystal', emoji: '💎', requires: ['snow', 'aurora'], bonusMultiplier: 5 },
  { id: 'celestial', name: 'Celestial', emoji: '👑', requires: ['eclipse', 'divine'], bonusMultiplier: 10 },
];

export const WEATHER_CHANGE_INTERVAL = 120000;
export const MUTATION_CHANCE = 0.7;

// ═══════════════════════════════════════════
// OBJECTIVES
// ═══════════════════════════════════════════

function dateSeed(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pickSeeded(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function pickReward(min, max, rng) {
  return Math.floor(min + rng() * (max - min + 1));
}

const EASY = [
  { type: 'harvest', minT: 8, maxT: 15, minR: 100, maxR: 300, minTk: 5, maxTk: 10, label: 'Harvest {target} crops' },
  { type: 'plant', minT: 8, maxT: 15, minR: 100, maxR: 250, minTk: 5, maxTk: 8, label: 'Plant {target} seeds' },
  { type: 'sell', minT: 8, maxT: 15, minR: 150, maxR: 300, minTk: 5, maxTk: 10, label: 'Sell {target} crops' },
  { type: 'weight', minT: 3, maxT: 8, minR: 100, maxR: 300, minTk: 5, maxTk: 10, label: 'Harvest {target}kg of crops' },
  { type: 'buy_fertilizer', minT: 2, maxT: 5, minR: 100, maxR: 200, minTk: 5, maxTk: 8, label: 'Buy {target} fertilizers' },
  { type: 'buy_sprinkler', minT: 1, maxT: 1, minR: 150, maxR: 300, minTk: 8, maxTk: 12, label: 'Buy {target} sprinkler' },
];

const MEDIUM = [
  { type: 'harvest', minT: 30, maxT: 60, minR: 300, maxR: 800, minTk: 10, maxTk: 25, label: 'Harvest {target} crops' },
  { type: 'sell_amount', minT: 1500, maxT: 3000, minR: 400, maxR: 800, minTk: 15, maxTk: 25, label: 'Sell ₱{target} worth' },
  { type: 'weight', minT: 30, maxT: 60, minR: 300, maxR: 700, minTk: 10, maxTk: 20, label: 'Harvest {target}kg' },
  { type: 'different_crops', minT: 3, maxT: 6, minR: 400, maxR: 800, minTk: 15, maxTk: 25, label: 'Grow {target} different crops' },
  { type: 'mutated_harvests', minT: 2, maxT: 5, minR: 400, maxR: 800, minTk: 15, maxTk: 25, label: 'Harvest {target} mutated crops' },
  { type: 'buy_fertilizer', minT: 5, maxT: 15, minR: 300, maxR: 600, minTk: 10, maxTk: 20, label: 'Use {target} fertilizers' },
];

const HARD = [
  { type: 'harvest', minT: 100, maxT: 250, minR: 800, maxR: 2000, minTk: 25, maxTk: 50, label: 'Harvest {target} crops' },
  { type: 'sell_amount', minT: 5000, maxT: 15000, minR: 1000, maxR: 2000, minTk: 30, maxTk: 50, label: 'Sell ₱{target}' },
  { type: 'premium_mutation', minT: 1, maxT: 1, minR: 1000, maxR: 2000, minTk: 40, maxTk: 60, label: 'Obtain a Premium mutation' },
  { type: 'secret_mutation', minT: 1, maxT: 1, minR: 1000, maxR: 2000, minTk: 40, maxTk: 60, label: 'Trigger a Secret Mutation' },
  { type: 'weight', minT: 200, maxT: 600, minR: 1000, maxR: 2000, minTk: 30, maxTk: 50, label: 'Harvest {target}kg' },
  { type: 'buy_sprinkler', minT: 3, maxT: 6, minR: 800, maxR: 1500, minTk: 25, maxTk: 40, label: 'Buy {target} sprinklers' },
];

export function generateDailyObjectives(dateStr) {
  const seed = dateSeed(dateStr);
  const rng = seededRandom(seed);
  const pick = (pool) => {
    const t = pickSeeded(pool, rng);
    const target = pickReward(t.minT, t.maxT, rng);
    const reward = pickReward(t.minR, t.maxR, rng);
    const tokens = pickReward(t.minTk, t.maxTk, rng);
    return {
      type: t.type, target, reward, tokens,
      label: t.label.replace('{target}', target.toLocaleString()),
      current: 0, completed: false, claimed: false,
    };
  };
  return [pick(EASY), pick(MEDIUM), pick(HARD)];
}

export const CHEST_REWARDS = [
  { type: 'peso', amount: 1000, chance: 35, label: '₱1,000', emoji: '💰' },
  { type: 'fertilizer', amount: 10, chance: 25, label: 'Fertilizer ×10', emoji: '💩' },
  { type: 'sprinkler', tier: 1, amount: 3, chance: 15, label: 'Basic Sprinkler ×3', emoji: '💧' },
  { type: 'sprinkler', tier: 2, amount: 2, chance: 10, label: 'Advanced Sprinkler ×2', emoji: '💦' },
  { type: 'sprinkler', tier: 3, amount: 1, chance: 8, label: 'Golden Sprinkler ×1', emoji: '🌈' },
  { type: 'premium_seed_pack', amount: 1, chance: 5, label: 'Premium Seed Pack', emoji: '📦' },
  { type: 'weather_ticket', amount: 1, chance: 2, label: 'Weather Ticket', emoji: '🎫' },
];

export const CRATE_REWARDS = [
  { type: 'peso', amount: 5000, chance: 30, label: '₱5,000', emoji: '💰' },
  { type: 'fertilizer', amount: 25, chance: 20, label: 'Fertilizer ×25', emoji: '💩' },
  { type: 'sprinkler', tier: 3, amount: 3, chance: 15, label: 'Golden Sprinkler ×3', emoji: '🌈' },
  { type: 'premium_seed_pack', amount: 2, chance: 15, label: 'Premium Seed Pack ×2', emoji: '📦' },
  { type: 'weather_ticket', amount: 2, chance: 10, label: 'Weather Ticket ×2', emoji: '🎫' },
  { type: 'random_premium_seed', amount: 5, chance: 7, label: 'Random Premium Seed ×5', emoji: '🌱' },
  { type: 'divine_seed_pack', amount: 1, chance: 3, label: '🌟 Divine Seed Pack', emoji: '🌟' },
];

export function rollReward(pool) {
  const total = pool.reduce((s, r) => s + r.chance, 0);
  let roll = Math.random() * total;
  for (const r of pool) {
    roll -= r.chance;
    if (roll <= 0) return r;
  }
  return pool[0];
}
