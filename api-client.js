// ═══════════════════════════════════════════
// API Client — Vercel Backend Communication
// ═══════════════════════════════════════════

// ⚠️ CHANGE THIS to YOUR Vercel deployment URL!
// Find it in Vercel Dashboard → your project → Settings → Domains
const API_BASE = 'https://vercel-api-delta-puce.vercel.app';

const TOKEN_KEY = 'pf_cloud_token';
const USER_KEY = 'pf_cloud_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getHeaders(includeAuth = false) {
  const h = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

export function isAuthenticated() {
  return !!getToken();
}

export function getStoredUsername() {
  return localStorage.getItem(USER_KEY) || '';
}

function storeAuth(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Validate the stored token by making a lightweight API call.
 * Returns { ok: true, username } if valid, or { ok: false } if expired/invalid.
 */
export async function validateToken() {
  const token = getToken();
  if (!token) return { ok: false };
  try {
    const res = await fetch(`${API_BASE}/api/game/load`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    if (res.status === 401) {
      clearAuth();
      return { ok: false };
    }
    // Even 500 or 200 with no data — token is accepted by the server
    return { ok: true, username: getStoredUsername() };
  } catch {
    // Network error — token might still be valid, allow offline play
    return { ok: true, username: getStoredUsername() };
  }
}

// ─── Auth ───

export async function register(username, password) {
  try {
    const url = `${API_BASE}/api/auth/register`;
    console.log('[API] POST', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    console.log('[API] Response:', res.status, res.statusText);
    const data = await res.json();
    console.log('[API] Body:', data);
    if (!res.ok) return { ok: false, error: data.error || 'Registration failed' };
    storeAuth(data.token, data.username);
    return { ok: true, username: data.username };
  } catch (e) {
    console.error('[API] Register FAILED:', e.name, e.message);
    if (e instanceof TypeError) {
      console.error('[API] TypeError = likely CORS block or wrong URL');
      console.error('[API] Current API_BASE:', API_BASE);
    }
    return { ok: false, error: `Network error: ${e.message}` };
  }
}

export async function login(username, password) {
  try {
    const url = `${API_BASE}/api/auth/login`;
    console.log('[API] POST', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    console.log('[API] Response:', res.status, res.statusText);
    const data = await res.json();
    console.log('[API] Body:', data);
    if (!res.ok) return { ok: false, error: data.error || 'Login failed' };
    storeAuth(data.token, data.username);
    return { ok: true, username: data.username };
  } catch (e) {
    console.error('[API] Login FAILED:', e.name, e.message);
    if (e instanceof TypeError) {
      console.error('[API] TypeError = likely CORS block or wrong URL');
      console.error('[API] Current API_BASE:', API_BASE);
    }
    return { ok: false, error: `Network error: ${e.message}` };
  }
}

export function logout() {
  clearAuth();
}

// ─── Game Save/Load ───

export async function cloudLoad() {
  try {
    const res = await fetch(`${API_BASE}/api/game/load`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    if (res.status === 401) {
      clearAuth();
      return { ok: false, error: 'auth_expired' };
    }
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Load failed' };
    return { ok: true, saveData: data.saveData, updatedAt: data.updatedAt };
  } catch (e) {
    console.error('[API] cloudLoad FAILED:', e.message);
    return { ok: false, error: 'offline' };
  }
}

export async function cloudSave(saveData) {
  try {
    const res = await fetch(`${API_BASE}/api/game/save`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ saveData }),
    });
    if (res.status === 401) {
      clearAuth();
      return { ok: false, error: 'auth_expired' };
    }
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error || 'Save failed' };
    return { ok: true };
  } catch (e) {
    console.error('[API] cloudSave FAILED:', e.message);
    return { ok: false, error: 'offline' };
  }
}

// ─── Leaderboard ───

export async function fetchLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/api/leaderboard`, {
      method: 'GET',
      headers: getHeaders(isAuthenticated()),
    });
    if (!res.ok) return { ok: false, error: 'Failed to load leaderboard' };
    const data = await res.json();
    return { ok: true, leaderboard: data.leaderboard || [], myRank: data.myRank };
  } catch (e) {
    console.error('[API] fetchLeaderboard FAILED:', e.message);
    return { ok: false, error: 'offline' };
  }
}

// ─── Auto-save System ───

let autoSaveTimer = null;

export function startAutoSave(getSaveDataFn) {
  stopAutoSave();
  autoSaveTimer = setInterval(async () => {
    if (!isAuthenticated()) return;
    const saveData = getSaveDataFn();
    if (saveData) {
      const result = await cloudSave(saveData);
      if (result.error === 'auth_expired') {
        window.dispatchEvent(new CustomEvent('pf-auth-expired'));
      }
    }
  }, 30000); // Every 30 seconds
}

export function stopAutoSave() {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
}

export function triggerCloudSave(getSaveDataFn) {
  if (!isAuthenticated()) return Promise.resolve({ ok: false });
  const saveData = getSaveDataFn();
  return cloudSave(saveData);
}
