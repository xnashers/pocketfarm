import { gameState } from '../state.js';
import { CROPS, CROP_CATEGORIES, RESEARCH_LAB, getResearchCost, MUTATION_LAB, getMutationLabCost, WEATHER_CENTER, GENETICS_TIERS, getGeneticsCost, MASTERY_CONFIG, getMasteryCost } from '../data/game-data.js';
import { showToast } from './audio-ui.js';
import { playSound } from './audio-ui.js';

const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

// ═══════════════════════════════════════════
// RESEARCH LAB
// ═══════════════════════════════════════════

export function renderResearchLab(container) {
  container.innerHTML = '';
  const summary = gameState.getResearchBonusesSummary();
  const totalSpent = Object.values(gameState.researchLevels).reduce((sum, lvl) => {
    let cost = 0; for (let i = 1; i <= lvl; i++) cost += getResearchCost(i); return sum + cost;
  }, 0);

  const banner = document.createElement('div');
  banner.className = 'mb-4 p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/20';
  banner.innerHTML = `
    <div class="flex items-center gap-2 mb-2"><span class="text-lg">🔬</span><span class="font-bold text-indigo-300 text-sm">Research Lab</span><span class="text-xs text-slate-500 ml-auto">₱${totalSpent.toLocaleString()} invested</span></div>
    <div class="grid grid-cols-3 gap-2 text-xs">
      <div class="text-center"><span class="text-green-400 font-bold">⚡${summary.speedBonus}%</span><br><span class="text-slate-500">Speed</span></div>
      <div class="text-center"><span class="text-blue-400 font-bold">⚖️${summary.weightBonus}%</span><br><span class="text-slate-500">Weight</span></div>
      <div class="text-center"><span class="text-purple-400 font-bold">✨${summary.xpBonus}%</span><br><span class="text-slate-500">XP</span></div>
      <div class="text-center"><span class="text-pink-400 font-bold">🧪${summary.mutBonus}%</span><br><span class="text-slate-500">Mutation</span></div>
      <div class="text-center"><span class="text-amber-400 font-bold">💩${summary.fertBonus}%</span><br><span class="text-slate-500">Fertilizer</span></div>
    </div>`;
  container.appendChild(banner);

  for (const upgrade of RESEARCH_LAB) {
    const level = gameState.getResearchLevel(upgrade.id);
    const isMax = level >= upgrade.maxLevel;
    const nextCost = isMax ? 0 : getResearchCost(level + 1);
    const effect = gameState.getResearchEffect(upgrade.id);

    const card = document.createElement('div');
    card.className = `flex items-center gap-3 p-3 rounded-xl border transition ${isMax ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/10 hover:border-white/20'}`;
    card.innerHTML = `
      <span class="text-2xl flex-shrink-0">${upgrade.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2"><span class="font-semibold text-white text-sm">${upgrade.name}</span><span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">${level}/${upgrade.maxLevel}</span></div>
        <div class="text-xs text-slate-400 mt-0.5">${upgrade.desc}</div>
        <div class="text-xs text-green-400 mt-0.5">Active: +${effect}%</div>
      </div>
      <div class="flex-shrink-0">${isMax ? '<span class="text-xs text-green-400 font-bold">✅ MAX</span>' : `<button class="research-buy px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${nextCost.toLocaleString()}</button>`}</div>`;

    if (!isMax) {
      card.querySelector('.research-buy').addEventListener('click', () => {
        if (gameState.player.peso < nextCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
        const result = gameState.buyResearch(upgrade.id, upgrade);
        if (result.success) { playSound('buy'); showToast(`🔬 ${upgrade.name} upgraded to Lv${result.level}!`, 'success'); renderResearchLab(container); }
      });
    }
    container.appendChild(card);
  }
}

// ═══════════════════════════════════════════
// MUTATION LAB
// ═══════════════════════════════════════════

export function renderMutationLab(container) {
  container.innerHTML = '';
  const banner = document.createElement('div');
  banner.className = 'mb-4 p-3 rounded-xl bg-purple-900/30 border border-purple-500/20';
  const durBonus = gameState.getMutationLabEffect('mutation_duration');
  const stackBonus = gameState.getMutationLabEffect('stack_limit');
  const secretBonus = gameState.getMutationLabEffect('secret_chance');
  banner.innerHTML = `
    <div class="flex items-center gap-2 mb-2"><span class="text-lg">🧪</span><span class="font-bold text-purple-300 text-sm">Mutation Lab</span></div>
    <div class="grid grid-cols-3 gap-2 text-xs">
      <div class="text-center"><span class="text-blue-400 font-bold">⏳${durBonus}%</span><br><span class="text-slate-500">Duration</span></div>
      <div class="text-center"><span class="text-amber-400 font-bold">📚+${stackBonus}</span><br><span class="text-slate-500">Stack Limit</span></div>
      <div class="text-center"><span class="text-pink-400 font-bold">🔮${secretBonus}%</span><br><span class="text-slate-500">Secret</span></div>
    </div>`;
  container.appendChild(banner);

  for (const upgrade of MUTATION_LAB) {
    const level = gameState.getMutationLabLevel(upgrade.id);
    const isMax = level >= upgrade.maxLevel;
    const nextCost = isMax ? 0 : getMutationLabCost(level + 1);
    const effect = gameState.getMutationLabEffect(upgrade.id);
    let effectText = '';
    if (upgrade.id === 'mutation_duration') effectText = `Active: +${effect}% weather duration`;
    else if (upgrade.id === 'stack_limit') effectText = `Active: ${5 + effect} max mutations`;
    else if (upgrade.id === 'secret_chance') effectText = `Active: +${effect}% secret chance`;

    const card = document.createElement('div');
    card.className = `flex items-center gap-3 p-3 rounded-xl border transition ${isMax ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/10 hover:border-white/20'}`;
    card.innerHTML = `
      <span class="text-2xl flex-shrink-0">${upgrade.emoji}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2"><span class="font-semibold text-white text-sm">${upgrade.name}</span><span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">${level}/${upgrade.maxLevel}</span></div>
        <div class="text-xs text-slate-400 mt-0.5">${upgrade.desc}</div>
        <div class="text-xs text-purple-400 mt-0.5">${effectText}</div>
      </div>
      <div class="flex-shrink-0">${isMax ? '<span class="text-xs text-green-400 font-bold">✅ MAX</span>' : `<button class="lab-buy px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${nextCost.toLocaleString()}</button>`}</div>`;

    if (!isMax) {
      card.querySelector('.lab-buy').addEventListener('click', () => {
        if (gameState.player.peso < nextCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
        const result = gameState.buyMutationLab(upgrade.id, upgrade);
        if (result.success) { playSound('buy'); showToast(`🧪 ${upgrade.name} upgraded to Lv${result.level}!`, 'success'); renderMutationLab(container); }
      });
    }
    container.appendChild(card);
  }
}

// ═══════════════════════════════════════════
// SEED GENETICS
// ═══════════════════════════════════════════

export function renderGenetics(container) {
  container.innerHTML = '';
  const banner = document.createElement('div');
  banner.className = 'mb-4 p-3 rounded-xl bg-amber-900/30 border border-amber-500/20';
  const upgradedCrops = Object.keys(gameState.cropGenetics).filter(k => gameState.cropGenetics[k] > 0).length;
  banner.innerHTML = `
    <div class="flex items-center gap-2 mb-1"><span class="text-lg">🧬</span><span class="font-bold text-amber-300 text-sm">Seed Genetics</span></div>
    <div class="text-xs text-slate-400">Upgrade crop tiers for permanent sell price multipliers. Same crop, better stats!</div>
    <div class="text-xs text-amber-400 mt-1">${upgradedCrops} crops upgraded · Max ×${GENETICS_TIERS[GENETICS_TIERS.length - 1].priceMultiplier.toFixed(1)} sell price</div>`;
  container.appendChild(banner);

  for (const cat of CROP_CATEGORIES) {
    const catCrops = CROPS.filter(c => c.category === cat.id);
    const section = document.createElement('div');
    section.className = 'mb-4';
    const header = document.createElement('h3');
    header.className = 'text-sm font-bold text-slate-300 mb-2';
    header.textContent = cat.name;
    section.appendChild(header);
    const grid = document.createElement('div');
    grid.className = 'space-y-2';

    for (const crop of catCrops) {
      const tier = gameState.getCropGeneticsTier(crop.id);
      const isMax = tier >= GENETICS_TIERS.length;
      const nextCost = isMax ? 0 : getGeneticsCost(crop, tier);
      const tierName = tier > 0 ? GENETICS_TIERS[tier - 1].name : 'Normal';
      const tierEmoji = tier > 0 ? GENETICS_TIERS[tier - 1].emoji : '';
      const priceMult = tier > 0 ? GENETICS_TIERS[tier - 1].priceMultiplier : 1;
      const nextMult = !isMax ? GENETICS_TIERS[tier].priceMultiplier : priceMult;
      const progressBar = Array.from({ length: GENETICS_TIERS.length }, (_, i) => `<div class="flex-1 h-1.5 rounded-full ${i < tier ? 'bg-amber-500' : 'bg-slate-700'}"></div>`).join('');

      const card = document.createElement('div');
      card.className = `flex items-center gap-3 p-3 rounded-xl border transition ${isMax ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/10 hover:border-white/20'}`;
      card.innerHTML = `
        <span class="text-2xl flex-shrink-0">${crop.emoji}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5"><span class="font-semibold text-white text-sm">${crop.name}</span>${tierEmoji ? `<span class="text-xs">${tierEmoji}</span>` : ''}<span class="text-xs text-slate-400">${tierName}</span></div>
          <div class="flex gap-0.5 mt-1">${progressBar}</div>
          <div class="text-xs text-amber-400 mt-1">×${priceMult.toFixed(2)} sell price${!isMax ? ` → ×${nextMult.toFixed(2)}` : ''}</div>
        </div>
        <div class="flex-shrink-0">${isMax ? '<span class="text-xs text-green-400 font-bold">✅ MAX</span>' : `<button class="genetics-buy px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${nextCost.toLocaleString()}</button>`}</div>`;

      if (!isMax) {
        card.querySelector('.genetics-buy').addEventListener('click', () => {
          if (gameState.player.peso < nextCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
          const result = gameState.upgradeCropGenetics(crop.id);
          if (result.success) { playSound('buy'); showToast(`🧬 ${crop.name} → ${GENETICS_TIERS[result.tier - 1].name}! (×${GENETICS_TIERS[result.tier - 1].priceMultiplier.toFixed(2)})`, 'gold'); renderGenetics(container); }
        });
      }
      grid.appendChild(card);
    }
    section.appendChild(grid);
    container.appendChild(section);
  }
}

// ═══════════════════════════════════════════
// CROP MASTERY
// ═══════════════════════════════════════════

export function renderMastery(container) {
  container.innerHTML = '';
  const banner = document.createElement('div');
  banner.className = 'mb-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-500/20';
  const totalMastery = Object.values(gameState.cropMastery).reduce((s, l) => s + l, 0);
  const maxMastery = CROPS.length * MASTERY_CONFIG.maxLevel;
  banner.innerHTML = `
    <div class="flex items-center gap-2 mb-1"><span class="text-lg">🎓</span><span class="font-bold text-emerald-300 text-sm">Crop Mastery</span></div>
    <div class="text-xs text-slate-400">Each mastery level grants: +${MASTERY_CONFIG.weightBonus * 100}% weight</div>
    <div class="text-xs text-emerald-400 mt-1">${totalMastery} / ${maxMastery} total mastery points</div>`;
  container.appendChild(banner);

  for (const cat of CROP_CATEGORIES) {
    const catCrops = CROPS.filter(c => c.category === cat.id);
    const section = document.createElement('div');
    section.className = 'mb-4';
    const header = document.createElement('h3');
    header.className = 'text-sm font-bold text-slate-300 mb-2';
    header.textContent = cat.name;
    section.appendChild(header);
    const grid = document.createElement('div');
    grid.className = 'space-y-2';

    for (const crop of catCrops) {
      const level = gameState.getCropMasteryLevel(crop.id);
      const isMax = level >= MASTERY_CONFIG.maxLevel;
      const nextCost = isMax ? 0 : getMasteryCost(crop, level + 1);
      const bonus = gameState.getCropMasteryBonus(crop.id);
      const pct = Math.round((level / MASTERY_CONFIG.maxLevel) * 100);

      const card = document.createElement('div');
      card.className = `flex items-center gap-3 p-3 rounded-xl border transition ${isMax ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/10 hover:border-white/20'}`;
      card.innerHTML = `
        <span class="text-2xl flex-shrink-0">${crop.emoji}</span>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2"><span class="font-semibold text-white text-sm">${crop.name}</span><span class="text-xs px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Lv${level}</span></div>
          <div class="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mt-1"><div class="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full" style="width: ${pct}%"></div></div>
          <div class="text-xs text-emerald-400 mt-1">⚖️+${bonus.weightBonus.toFixed(1)}% weight</div>
        </div>
        <div class="flex-shrink-0">${isMax ? '<span class="text-xs text-green-400 font-bold">✅ MAX</span>' : `<button class="mastery-buy px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${nextCost.toLocaleString()}</button>`}</div>`;

      if (!isMax) {
        card.querySelector('.mastery-buy').addEventListener('click', () => {
          if (gameState.player.peso < nextCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
          const result = gameState.upgradeCropMastery(crop.id);
          if (result.success) { playSound('buy'); showToast(`🎓 ${crop.name} mastery → Lv${result.level}!`, 'success'); renderMastery(container); }
        });
      }
      grid.appendChild(card);
    }
    section.appendChild(grid);
    container.appendChild(section);
  }
}

// ═══════════════════════════════════════════
// WEATHER CENTER
// ═══════════════════════════════════════════

export function renderWeatherCenter(container) {
  container.innerHTML = '';
  const banner = document.createElement('div');
  banner.className = 'mb-4 p-3 rounded-xl bg-cyan-900/30 border border-cyan-500/20';
  const weather = gameState.currentWeather;
  const weatherStr = weather ? `${weather.emoji} ${weather.name}` : '—';
  const isRareActive = gameState.isRareBoostActive();
  const mutBonus = gameState.getWeatherMutationBonus();
  const forecastLevel = gameState.forecastLevel || 0;
  const forecastList = gameState.getForecastQueue();

  let forecastHTML = '';
  if (forecastLevel > 0 && forecastList.length > 0) {
    const labels = ['Next', 'Then', 'After'];
    forecastHTML = forecastList.map((w, i) => `<div class="text-xs ${i === 0 ? 'text-blue-300 font-semibold' : 'text-slate-400'}">${labels[i] || 'Later'}: ${w.emoji} ${w.name}</div>`).join('');
  } else {
    forecastHTML = '<span class="text-xs text-slate-600">🔒 Buy to unlock</span>';
  }

  banner.innerHTML = `
    <div class="flex items-center gap-2 mb-2"><span class="text-lg">🌤️</span><span class="font-bold text-cyan-300 text-sm">Weather Center</span></div>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-2 rounded-lg bg-slate-800/50"><div class="text-slate-500 mb-1">Current Weather</div><div class="font-semibold text-white">${weatherStr}</div></div>
      <div class="p-2 rounded-lg bg-slate-800/50"><div class="text-slate-500 mb-1">Forecast ${forecastLevel > 0 ? `(Lv.${forecastLevel})` : ''}</div>${forecastHTML}</div>
    </div>
    ${mutBonus > 0 ? `<div class="mt-2 text-xs text-purple-400 font-bold text-center">🧬 +${Math.round(mutBonus * 100)}% mutation chance this weather!</div>` : ''}
    ${isRareActive ? '<div class="mt-2 text-xs text-amber-400 font-bold text-center">🌟 Rare Weather Boost Active!</div>' : ''}`;
  container.appendChild(banner);

  // Forecast upgrade
  const forecastMaxed = forecastLevel >= WEATHER_CENTER.forecast.maxLevel;
  const forecastNextCost = forecastMaxed ? 0 : WEATHER_CENTER.forecast.costs[forecastLevel + 1];
  const forecastCard = document.createElement('div');
  forecastCard.className = `flex items-center gap-3 p-3 rounded-xl border transition mb-2 ${forecastMaxed ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/10 hover:border-white/20'}`;
  forecastCard.innerHTML = `
    <span class="text-2xl flex-shrink-0">📡</span>
    <div class="flex-1 min-w-0"><div class="font-semibold text-white text-sm">${forecastMaxed ? 'Forecast' : forecastLevel > 0 ? 'Upgrade Forecast' : 'Buy Forecast'}</div><div class="text-xs text-slate-400">${forecastMaxed ? 'Max level — seeing all future weather' : forecastLevel > 0 ? `Upgrade to Lv.${forecastLevel + 1} — see ${forecastLevel + 1} weathers ahead` : 'See the next weather event'}</div></div>
    <div class="flex-shrink-0">${forecastMaxed ? '<span class="text-xs text-green-400 font-bold">✅ Max</span>' : `<button class="forecast-action px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${forecastNextCost.toLocaleString()}</button>`}</div>`;

  if (!forecastMaxed) {
    forecastCard.querySelector('.forecast-action').addEventListener('click', () => {
      if (gameState.player.peso < forecastNextCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
      const result = gameState.upgradeForecast();
      if (result.success) { playSound('buy'); showToast(`📡 Forecast ${forecastLevel > 0 ? 'upgraded' : 'purchased'} — Level ${result.level}!`, 'success'); renderWeatherCenter(container); }
    });
  }
  container.appendChild(forecastCard);

  // Skip Weather
  const skipCost = WEATHER_CENTER.skip.cost;
  const skipCard = document.createElement('div');
  skipCard.className = 'flex items-center gap-3 p-3 rounded-xl border transition mb-2 bg-slate-800/60 border-white/10 hover:border-white/20';
  skipCard.innerHTML = `<span class="text-2xl flex-shrink-0">⏭️</span><div class="flex-1 min-w-0"><div class="font-semibold text-white text-sm">${WEATHER_CENTER.skip.name}</div><div class="text-xs text-slate-400">${WEATHER_CENTER.skip.desc}</div></div><div class="flex-shrink-0"><button class="skip-action px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${skipCost.toLocaleString()}</button></div>`;
  skipCard.querySelector('.skip-action').addEventListener('click', () => {
    if (gameState.player.peso < skipCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
    const result = gameState.skipWeather();
    if (result.success) { playSound('buy'); showToast(`⏭️ Weather changed to ${result.weather.emoji} ${result.weather.name}!`, 'success'); renderWeatherCenter(container); }
  });
  container.appendChild(skipCard);

  // Rare Weather Boost
  const rareActive = gameState.isRareBoostActive();
  const rareCost = WEATHER_CENTER.rareBoost.cost;
  const rareCard = document.createElement('div');
  rareCard.className = `flex items-center gap-3 p-3 rounded-xl border transition mb-2 ${rareActive ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-800/60 border-white/10 hover:border-white/20'}`;
  let rareStatus = '';
  if (rareActive) {
    const remaining = gameState.getRareBoostTimeRemaining();
    const mins = Math.floor(remaining / 60000), secs = Math.floor((remaining % 60000) / 1000);
    rareStatus = `<span class="text-xs text-green-400">⏳ ${mins}m ${secs}s remaining</span>`;
  }
  rareCard.innerHTML = `<span class="text-2xl flex-shrink-0">🌟</span><div class="flex-1 min-w-0"><div class="font-semibold text-white text-sm">${WEATHER_CENTER.rareBoost.name}</div><div class="text-xs text-slate-400">${WEATHER_CENTER.rareBoost.desc}</div>${rareStatus}</div><div class="flex-shrink-0">${rareActive ? '<span class="text-xs text-green-400 font-bold">✅ Active</span>' : `<button class="rare-action px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition active:scale-95">₱${rareCost.toLocaleString()}</button>`}</div>`;
  if (!rareActive) {
    rareCard.querySelector('.rare-action').addEventListener('click', () => {
      if (gameState.player.peso < rareCost) { playSound('buzzer'); showToast(t('app.toast.not_enough_peso'), 'error'); return; }
      const result = gameState.activateRareBoost();
      if (result.success) { playSound('buy'); showToast('🌟 Rare Weather Boost activated for 10 minutes!', 'gold'); renderWeatherCenter(container); }
    });
  }
  container.appendChild(rareCard);
}

// ═══════════════════════════════════════════
// WEATHER DISPLAY (farm header widget)
// ═══════════════════════════════════════════

export function createWeatherDisplay() {
  const container = document.createElement('div');
  container.className = 'flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-white/5 mb-3';
  let timerInterval = null;

  function formatCountdown(ms) {
    const secs = Math.ceil(ms / 1000);
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  }

  function update() {
    const weather = gameState.currentWeather;
    if (!weather) { container.innerHTML = '<span class="text-sm text-slate-500">☀️ Checking weather...</span>'; return; }
    const remaining = gameState.getWeatherTimeRemaining();
    let forecastHTML = '';
    if (gameState.forecastResult && gameState.forecastResult.purchased && Date.now() < gameState.forecastResult.expiresAt) {
      forecastHTML = `<span class="text-blue-400 text-[10px]">📡 Next: ${gameState.forecastResult.emoji}</span>`;
    }
    const isRareActive = gameState.isRareBoostActive();
    const mutBonus = gameState.getWeatherMutationBonus();
    const bonusStr = mutBonus > 0 ? `<span class="text-amber-400 text-[10px]">🧬 +${Math.round(mutBonus * 100)}% mutation</span>` : '';
    container.innerHTML = `
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-2xl flex-shrink-0">${weather.emoji}</span>
        <div class="min-w-0"><div class="font-semibold text-white text-sm">${weather.name}</div><div class="text-xs text-purple-400">${weather.mutationEmoji} ${weather.mutation} · x${weather.multiplier} ${forecastHTML} ${bonusStr}</div></div>
      </div>
      <div class="text-right flex-shrink-0"><div class="text-xs text-slate-500 tabular-nums">⏱ ${formatCountdown(remaining)}</div>${isRareActive ? '<div class="text-[10px] text-amber-400">🌟 Rare Boost</div>' : ''}</div>`;
  }

  function startTimer() { if (timerInterval) clearInterval(timerInterval); timerInterval = setInterval(update, 1000); }
  function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }

  gameState.on('weatherChange', update);
  update();
  startTimer();
  return { element: container, update, startTimer, stopTimer };
}
