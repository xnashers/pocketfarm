export const GEAR_ITEMS = {
  shovel: {
    id: 'shovel',
    name: 'Shovel',
    emoji: '🔨',
    description: 'Remove unwanted crops from plots',
    cost: 0,
    type: 'one-time',
  },
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
  {
    tier: 1,
    name: 'Basic Sprinkler',
    emoji: '💧',
    cost: 10,
    speedBonus: 0.10,
    description: '+10% crop growth speed',
  },
  {
    tier: 2,
    name: 'Advanced Sprinkler',
    emoji: '💦',
    cost: 20,
    speedBonus: 0.25,
    description: '+25% crop growth speed',
  },
  {
    tier: 3,
    name: 'Golden Sprinkler',
    emoji: '🌈',
    cost: 30,
    speedBonus: 0.50,
    doubleHarvestBonus: 0.10,
    description: '+50% growth speed · +10% double harvest',
  },
];
