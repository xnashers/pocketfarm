// ═══════════════════════════════════════════
// CROPS
// ═══════════════════════════════════════════

export const CROP_CATEGORIES = [
  { id: 'starter', name: '🌱 Starter Crops', unlockLevel: 1 },
  { id: 'intermediate', name: '🌿 Intermediate Crops', unlockLevel: 8 },
  { id: 'advanced', name: '🌳 Advanced Crops', unlockLevel: 25 },
  { id: 'premium', name: '💎 Premium Crops', unlockLevel: 50 },
];

export const CROPS = [
  // ── 🌱 Starter Crops ──
  { id: 'carrot', name: 'Carrot', emoji: '🥕', category: 'starter', seedCost: 5, growTime: 30, sellPrice: 15, xp: 2, unlockLevel: 1, minWeight: 0.1, maxWeight: 0.4 },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬', category: 'starter', seedCost: 8, growTime: 45, sellPrice: 25, xp: 3, unlockLevel: 1, minWeight: 0.2, maxWeight: 0.6 },
  { id: 'potato', name: 'Potato', emoji: '🥔', category: 'starter', seedCost: 10, growTime: 50, sellPrice: 30, xp: 3, unlockLevel: 2, minWeight: 0.3, maxWeight: 0.8 },
  { id: 'corn', name: 'Corn', emoji: '🌽', category: 'starter', seedCost: 12, growTime: 55, sellPrice: 35, xp: 4, unlockLevel: 3, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'starter', seedCost: 15, growTime: 65, sellPrice: 40, xp: 4, unlockLevel: 4, minWeight: 0.1, maxWeight: 0.4 },
  { id: 'cucumber', name: 'Cucumber', emoji: '🥒', category: 'starter', seedCost: 18, growTime: 75, sellPrice: 50, xp: 5, unlockLevel: 5, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'onion', name: 'Onion', emoji: '🧅', category: 'starter', seedCost: 20, growTime: 80, sellPrice: 55, xp: 5, unlockLevel: 6, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'garlic', name: 'Garlic', emoji: '🧄', category: 'starter', seedCost: 22, growTime: 90, sellPrice: 60, xp: 6, unlockLevel: 7, minWeight: 0.1, maxWeight: 0.2 },
  { id: 'beans', name: 'Beans', emoji: '🫘', category: 'starter', seedCost: 25, growTime: 100, sellPrice: 65, xp: 6, unlockLevel: 8, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'peas', name: 'Peas', emoji: '🫛', category: 'starter', seedCost: 28, growTime: 110, sellPrice: 70, xp: 7, unlockLevel: 9, minWeight: 0.1, maxWeight: 0.2 },
  { id: 'chili', name: 'Chili Pepper', emoji: '🌶️', category: 'starter', seedCost: 35, growTime: 130, sellPrice: 80, xp: 8, unlockLevel: 10, minWeight: 0.05, maxWeight: 0.15 },
  { id: 'bellpepper', name: 'Bell Pepper', emoji: '🫑', category: 'starter', seedCost: 40, growTime: 150, sellPrice: 90, xp: 9, unlockLevel: 12, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'strawberry', name: 'Strawberry', emoji: '🍓', category: 'starter', seedCost: 50, growTime: 180, sellPrice: 100, xp: 10, unlockLevel: 14, minWeight: 0.05, maxWeight: 0.2 },
  // ── 🌿 Intermediate Crops ──
  { id: 'eggplant', name: 'Eggplant', emoji: '🍆', category: 'intermediate', seedCost: 100, growTime: 200, sellPrice: 180, xp: 14, unlockLevel: 18, minWeight: 0.2, maxWeight: 0.6 },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', category: 'intermediate', seedCost: 150, growTime: 240, sellPrice: 250, xp: 16, unlockLevel: 22, minWeight: 0.3, maxWeight: 0.7 },
  { id: 'sweetpotato', name: 'Sweet Potato', emoji: '🍠', category: 'intermediate', seedCost: 200, growTime: 280, sellPrice: 300, xp: 18, unlockLevel: 26, minWeight: 0.3, maxWeight: 1.0 },
  { id: 'watermelon', name: 'Watermelon', emoji: '🍉', category: 'intermediate', seedCost: 300, growTime: 350, sellPrice: 400, xp: 22, unlockLevel: 30, minWeight: 3.0, maxWeight: 8.0 },
  { id: 'melon', name: 'Melon', emoji: '🍈', category: 'intermediate', seedCost: 350, growTime: 380, sellPrice: 450, xp: 24, unlockLevel: 33, minWeight: 1.5, maxWeight: 4.0 },
  { id: 'pineapple', name: 'Pineapple', emoji: '🍍', category: 'intermediate', seedCost: 450, growTime: 420, sellPrice: 500, xp: 26, unlockLevel: 36, minWeight: 1.0, maxWeight: 2.5 },
  { id: 'banana', name: 'Banana', emoji: '🍌', category: 'intermediate', seedCost: 500, growTime: 450, sellPrice: 550, xp: 28, unlockLevel: 38, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'grapes', name: 'Grapes', emoji: '🍇', category: 'intermediate', seedCost: 600, growTime: 480, sellPrice: 600, xp: 30, unlockLevel: 40, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'kiwi', name: 'Kiwi', emoji: '🥝', category: 'intermediate', seedCost: 700, growTime: 500, sellPrice: 650, xp: 32, unlockLevel: 42, minWeight: 0.05, maxWeight: 0.15 },
  { id: 'lemon', name: 'Lemon', emoji: '🍋', category: 'intermediate', seedCost: 800, growTime: 530, sellPrice: 680, xp: 34, unlockLevel: 44, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'lime', name: 'Lime', emoji: '🍋‍🟩', category: 'intermediate', seedCost: 900, growTime: 560, sellPrice: 700, xp: 36, unlockLevel: 46, minWeight: 0.08, maxWeight: 0.2 },
  { id: 'coconut', name: 'Coconut', emoji: '🥥', category: 'intermediate', seedCost: 1500, growTime: 600, sellPrice: 900, xp: 40, unlockLevel: 50, minWeight: 0.5, maxWeight: 1.5 },
  { id: 'avocado', name: 'Avocado', emoji: '🥑', category: 'intermediate', seedCost: 1200, growTime: 550, sellPrice: 750, xp: 38, unlockLevel: 48, minWeight: 0.2, maxWeight: 0.5 },
  // ── 🌳 Advanced Crops ──
  { id: 'apple', name: 'Apple', emoji: '🍎', category: 'advanced', seedCost: 500, growTime: 700, sellPrice: 1000, xp: 50, unlockLevel: 55, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'greenapple', name: 'Green Apple', emoji: '🍏', category: 'advanced', seedCost: 600, growTime: 750, sellPrice: 1200, xp: 55, unlockLevel: 58, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'pear', name: 'Pear', emoji: '🍐', category: 'advanced', seedCost: 700, growTime: 800, sellPrice: 1500, xp: 60, unlockLevel: 62, minWeight: 0.2, maxWeight: 0.4 },
  { id: 'peach', name: 'Peach', emoji: '🍑', category: 'advanced', seedCost: 900, growTime: 900, sellPrice: 2000, xp: 65, unlockLevel: 66, minWeight: 0.15, maxWeight: 0.35 },
  { id: 'cherry', name: 'Cherry', emoji: '🍒', category: 'advanced', seedCost: 1200, growTime: 1000, sellPrice: 2500, xp: 72, unlockLevel: 70, minWeight: 0.05, maxWeight: 0.12 },
  { id: 'mango', name: 'Mango', emoji: '🥭', category: 'advanced', seedCost: 1500, growTime: 1100, sellPrice: 3000, xp: 80, unlockLevel: 75, minWeight: 0.2, maxWeight: 0.6 },
  { id: 'blueberries', name: 'Blueberries', emoji: '🫐', category: 'advanced', seedCost: 800, growTime: 850, sellPrice: 1800, xp: 58, unlockLevel: 60, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'chestnut', name: 'Chestnut', emoji: '🌰', category: 'advanced', seedCost: 1000, growTime: 950, sellPrice: 2200, xp: 68, unlockLevel: 68, minWeight: 0.05, maxWeight: 0.15 },
  { id: 'rice', name: 'Rice', emoji: '🌾', category: 'advanced', seedCost: 1800, growTime: 1200, sellPrice: 3500, xp: 85, unlockLevel: 78, minWeight: 0.3, maxWeight: 0.8 },
  { id: 'mushroom', name: 'Mushroom', emoji: '🍄', category: 'advanced', seedCost: 1600, growTime: 1150, sellPrice: 3200, xp: 82, unlockLevel: 76, minWeight: 0.08, maxWeight: 0.25 },
  // ── 💎 Premium Crops ──
  { id: 'golden_sunflower', name: 'Golden Sunflower', emoji: '🌻', category: 'premium', seedCost: 2500, growTime: 2000, sellPrice: 10000, xp: 100, unlockLevel: 85, minWeight: 0.3, maxWeight: 0.8 },
  { id: 'crystal_rose', name: 'Crystal Rose', emoji: '🌹', category: 'premium', seedCost: 3000, growTime: 2500, sellPrice: 14000, xp: 120, unlockLevel: 90, minWeight: 0.1, maxWeight: 0.3 },
  { id: 'paradise_flower', name: 'Paradise Flower', emoji: '🌺', category: 'premium', seedCost: 3500, growTime: 3000, sellPrice: 18000, xp: 140, unlockLevel: 95, minWeight: 0.15, maxWeight: 0.4 },
  { id: 'rainbow_tulip', name: 'Rainbow Tulip', emoji: '🌷', category: 'premium', seedCost: 3800, growTime: 3500, sellPrice: 20000, xp: 150, unlockLevel: 100, minWeight: 0.1, maxWeight: 0.25 },
  { id: 'divine_blossom', name: 'Divine Blossom', emoji: '🌼', category: 'premium', seedCost: 4000, growTime: 4000, sellPrice: 22000, xp: 160, unlockLevel: 105, minWeight: 0.2, maxWeight: 0.5 },
  { id: 'golden_cactus', name: 'Golden Cactus', emoji: '🌵', category: 'premium', seedCost: 4200, growTime: 4500, sellPrice: 24000, xp: 170, unlockLevel: 110, minWeight: 1.0, maxWeight: 3.0 },
  { id: 'ancient_palm', name: 'Ancient Palm', emoji: '🌴', category: 'premium', seedCost: 4500, growTime: 5000, sellPrice: 26000, xp: 180, unlockLevel: 115, minWeight: 2.0, maxWeight: 5.0 },
  { id: 'bamboo', name: 'Bamboo', emoji: '🎍', category: 'premium', seedCost: 3200, growTime: 2800, sellPrice: 16000, xp: 130, unlockLevel: 92, minWeight: 0.5, maxWeight: 1.5 },
  { id: 'lucky_clover', name: 'Lucky Clover', emoji: '☘️', category: 'premium', seedCost: 2800, growTime: 2200, sellPrice: 12000, xp: 110, unlockLevel: 88, minWeight: 0.02, maxWeight: 0.08 },
  { id: 'four_leaf_clover', name: 'Four-Leaf Clover', emoji: '🍀', category: 'premium', seedCost: 4800, growTime: 5500, sellPrice: 28000, xp: 190, unlockLevel: 120, minWeight: 0.02, maxWeight: 0.06 },
  { id: 'mystic_herb', name: 'Mystic Herb', emoji: '🌿', category: 'premium', seedCost: 5000, growTime: 6000, sellPrice: 30000, xp: 200, unlockLevel: 125, minWeight: 0.05, maxWeight: 0.15 },
  { id: 'enchanted_plant', name: 'Enchanted Plant', emoji: '🪴', category: 'premium', seedCost: 5500, growTime: 7200, sellPrice: 35000, xp: 250, unlockLevel: 130, minWeight: 0.3, maxWeight: 1.0 },
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
  { tier: 1, name: 'Basic Sprinkler', emoji: '💧', cost: 10, weightBonus: 0.15, description: '+15% crop weight — stackable!' },
  { tier: 2, name: 'Advanced Sprinkler', emoji: '💦', cost: 20, weightBonus: 0.30, description: '+30% crop weight — stackable!' },
  { tier: 3, name: 'Golden Sprinkler', emoji: '🌈', cost: 30, weightBonus: 0.50, description: '+50% crop weight — stackable!' },
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
  const starterPool = ['carrot', 'lettuce', 'potato', 'corn', 'tomato', 'cucumber', 'onion', 'garlic', 'beans', 'peas', 'chili', 'bellpepper', 'strawberry'];
  const intermediatePool = ['eggplant', 'broccoli', 'sweetpotato', 'watermelon', 'melon', 'pineapple', 'banana', 'grapes', 'kiwi', 'lemon', 'lime', 'coconut', 'avocado'];
  const advancedPool = ['apple', 'greenapple', 'pear', 'peach', 'cherry', 'mango', 'blueberries', 'chestnut', 'rice', 'mushroom'];
  const premiumPool = ['golden_sunflower', 'crystal_rose', 'paradise_flower', 'rainbow_tulip', 'divine_blossom', 'golden_cactus', 'ancient_palm', 'bamboo', 'lucky_clover', 'four_leaf_clover', 'mystic_herb', 'enchanted_plant'];
  let pool;
  if (level <= 5) pool = starterPool;
  else if (level <= 10) pool = starterPool;
  else if (level <= 15) pool = [...starterPool.slice(0, 8), ...intermediatePool.slice(0, 3)];
  else if (level <= 25) pool = intermediatePool;
  else if (level <= 35) pool = intermediatePool.slice(0, 8);
  else if (level <= 50) pool = intermediatePool;
  else if (level <= 65) pool = [...intermediatePool.slice(0, 5), ...advancedPool.slice(0, 4)];
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
  { id: 'collector', name: 'Collector', emoji: '📚', cat: 'collection', desc: 'Harvest 5 different Starter crops', check: s => ['carrot','lettuce','potato','corn','tomato'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'peso', amount: 1000 }, title: 'crop_specialist' },
  { id: 'expert_farmer', name: 'Expert Farmer', emoji: '🌾', cat: 'collection', desc: 'Harvest 5 different Intermediate crops', check: s => ['eggplant','broccoli','sweetpotato','watermelon','pineapple'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'peso', amount: 5000 }, title: null },
  { id: 'master_farmer', name: 'Master Farmer', emoji: '🌿', cat: 'collection', desc: 'Harvest 5 different Advanced crops', check: s => ['apple','pear','cherry','mango','rice'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'peso', amount: 15000 }, title: null },
  { id: 'legend_farmer', name: 'Legend Farmer', emoji: '💎', cat: 'collection', desc: 'Harvest 5 different Premium crops', check: s => ['golden_sunflower','crystal_rose','paradise_flower','ancient_palm','mystic_herb'].every(id => (s.cropsHarvested || {})[id] > 0), reward: { type: 'tokens', amount: 150 }, title: 'legend_farmer' },
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
  { id: 'sunny', name: 'Sunny', emoji: '☀️', mutation: 'Sun-Kissed', mutationEmoji: '🌟', priceBonus: 8, weight: 25 },
  { id: 'rain', name: 'Rain', emoji: '🌧️', mutation: 'Waterlogged', mutationEmoji: '💧', priceBonus: 15, weight: 20 },
  { id: 'heatwave', name: 'Heatwave', emoji: '🔥', mutation: 'Scorched', mutationEmoji: '🔥', priceBonus: 30, weight: 10 },
  { id: 'windstorm', name: 'Windstorm', emoji: '🌪️', mutation: 'Windblown', mutationEmoji: '💨', priceBonus: 20, weight: 10 },
  { id: 'fog', name: 'Fog', emoji: '🌫️', mutation: 'Misty', mutationEmoji: '👻', priceBonus: 25, weight: 12 },
  { id: 'cherry', name: 'Cherry Blossom', emoji: '🌸', mutation: 'Blooming', mutationEmoji: '🌸', priceBonus: 50, weight: 8 },
  { id: 'thunderstorm', name: 'Thunderstorm', emoji: '⛈️', mutation: 'Shocked', mutationEmoji: '⚡', priceBonus: 35, weight: 8 },
  { id: 'autumn', name: 'Autumn Wind', emoji: '🍂', mutation: 'Autumn', mutationEmoji: '🍁', priceBonus: 40, weight: 5 },
  { id: 'snow', name: 'Snow', emoji: '❄️', mutation: 'Frozen', mutationEmoji: '🧊', priceBonus: 45, weight: 5 },
  { id: 'fullmoon', name: 'Full Moon', emoji: '🌙', mutation: 'Moonlit', mutationEmoji: '🌙', priceBonus: 80, weight: 4 },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', mutation: 'Rainbow', mutationEmoji: '🌈', priceBonus: 65, weight: 3 },
  { id: 'meteor', name: 'Meteor Shower', emoji: '☄️', mutation: 'Cosmic', mutationEmoji: '☄️', priceBonus: 120, weight: 3 },
  { id: 'aurora', name: 'Aurora', emoji: '✨', mutation: 'Aurora', mutationEmoji: '💜', priceBonus: 160, weight: 2 },
  { id: 'eclipse', name: 'Eclipse', emoji: '🌌', mutation: 'Eclipse', mutationEmoji: '🌑', priceBonus: 200, weight: 1 },
  { id: 'divine', name: 'Divine Weather', emoji: '👑', mutation: 'Divine', mutationEmoji: '✨', priceBonus: 400, weight: 0.5 },
];

export const SECRET_MUTATIONS = [
  { id: 'lunar_prism', name: 'Lunar Prism', emoji: '🌌', requires: ['rainbow', 'fullmoon'], priceBonus: 150 },
  { id: 'galactic_storm', name: 'Galactic Storm', emoji: '⚡', requires: ['thunderstorm', 'meteor'], priceBonus: 200 },
  { id: 'crystal', name: 'Crystal', emoji: '💎', requires: ['snow', 'aurora'], priceBonus: 250 },
  { id: 'celestial', name: 'Celestial', emoji: '👑', requires: ['eclipse', 'divine'], priceBonus: 500 },
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

// ═══════════════════════════════════════════
// PETS
// ═══════════════════════════════════════════

export const PETS = [
  {
    id: 'dog', name: 'Dog', emoji: '🐕',
    cost: 20000,
    desc: 'Loyal Companion',
    abilityDesc: 'Digs up bonus Peso every 60s while farming',
    ability: { type: 'passive_peso', base: 5, interval: 60000, maxAccumulation: 500 },
  },
  {
    id: 'cat', name: 'Cat', emoji: '🐈',
    cost: 35000,
    desc: 'Lucky Harvest',
    abilityDesc: 'Chance for harvested crops to sell for double value',
    ability: { type: 'sell_double', baseChance: 0.50, maxChance: 0.75 },
  },
  {
    id: 'fox', name: 'Fox', emoji: '🦊',
    cost: 30000,
    desc: 'Master Forager',
    abilityDesc: 'Occasionally discovers rare or premium seeds while harvesting',
    ability: { type: 'find_seeds', chance: 0.12, premiumChance: 0.04 },
  },
  {
    id: 'mouse', name: 'Mouse', emoji: '🐁',
    cost: 22000,
    desc: 'Seed Saver',
    abilityDesc: 'Chance that planting a crop doesn\'t consume a seed',
    ability: { type: 'seed_save', baseChance: 0.10, maxChance: 0.20 },
  },
  {
    id: 'squirrel', name: 'Squirrel', emoji: '🐿️',
    cost: 25000,
    desc: 'Nut Collector',
    abilityDesc: 'Occasionally stores bonus seeds after harvesting',
    ability: { type: 'bonus_seeds', chance: 0.20, minQty: 1, maxQty: 3 },
  },
];

export function getPetLevelEffectiveness(level) {
  // Lv.1: 100%, Lv.5: +25%, Lv.10: +50%
  return 1 + (level - 1) * (0.5 / 9);
}

export function getPetLevelXP(level) {
  if (level >= 10) return Infinity;
  return Math.floor(20 * level * (1 + level * 0.15));
}

export const PET_SECONDARY_PASSIVE = {
  dog: { id: 'treasure_hunt', desc: 'Occasionally finds a treasure chest', chance: 0.08, reward: 'gift_crate' },
  cat: { id: 'nine_lives', desc: 'Crops never lose value from mutations', passive: true },
  fox: { id: 'keen_nose', desc: 'Always finds at least 1 seed per harvest', passive: true },
  mouse: { id: 'tiny_paws', desc: 'Double seed savings chance on starter crops', passive: true },
  squirrel: { id: 'hoarder', desc: 'Bonus seeds are 50% more likely to be rare', passive: true },
};