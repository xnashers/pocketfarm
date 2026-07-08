const STORAGE_KEY = 'pocketfarm_save';

export async function loadGame() {
  try {
    const raw = await window.miniappsAI.storage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load save:', e);
  }
  return null;
}

export async function saveGame(state) {
  try {
    await window.miniappsAI.storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save game:', e);
  }
}
