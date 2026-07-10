import { isAuthenticated, cloudLoad, cloudSave } from './api-client.js';

const STORAGE_KEY = 'pocketfarm_save';

function getStorage() {
  return window.miniappsAI?.storage;
}

export async function loadGame() {
  // If authenticated, try cloud first
  if (isAuthenticated()) {
    const cloudResult = await cloudLoad();
    if (cloudResult.ok && cloudResult.saveData) {
      const json = JSON.stringify(cloudResult.saveData);
      // Save to both stores as backup
      try {
        const storage = getStorage();
        if (storage) await storage.setItem(STORAGE_KEY, json);
      } catch (_) {}
      try { localStorage.setItem(STORAGE_KEY, json); } catch (_) {}
      return cloudResult.saveData;
    }
    if (cloudResult.error === 'auth_expired') {
      window.dispatchEvent(new CustomEvent('pf-auth-expired'));
    }
    // If cloud fails (offline, etc), fall through to local
  }

  // Try platform storage first, then localStorage
  try {
    const storage = getStorage();
    if (storage) {
      const raw = await storage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load from platform storage:', e);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
  }

  return null;
}

export async function saveGame(state) {
  const json = JSON.stringify(state);

  // Write to platform storage (primary)
  try {
    const storage = getStorage();
    if (storage) {
      await storage.setItem(STORAGE_KEY, json);
    }
  } catch (e) {
    console.warn('Failed to save to platform storage:', e);
  }

  // Always write to localStorage as backup
  // (used by getSaveData() for cloud sync, and as fallback when platform storage unavailable)
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Get save data object for cloud sync
// Reads from localStorage since saveGame() always writes there too
export function getSaveData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
