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
