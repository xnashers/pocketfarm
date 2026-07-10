// ═══════════════════════════════════════════
// AUTH VIEW — Login / Register Screen
// ═══════════════════════════════════════════

import { login, register, isAuthenticated, getStoredUsername, logout, validateToken } from '../api-client.js';
import { initToast, showToast } from './audio-ui.js';

const t = (key, vals) => window.miniappI18n?.t(key, vals) ?? key;

export function createAuthView(onAuth) {
  let mode = 'login';
  let loading = false;

  const container = document.createElement('div');
  container.className = 'min-h-screen bg-slate-950 flex items-center justify-center p-4';

  // If a stored token exists, validate it before auto-login
  if (isAuthenticated()) {
    const storedUser = getStoredUsername();
    container.innerHTML = `
      <div class="text-center animate-fade-in">
        <div class="text-5xl mb-3">🌱</div>
        <div class="text-white font-bold text-lg mb-1">${storedUser || 'Farmer'}</div>
        <div class="text-slate-400 text-sm flex items-center justify-center gap-2">
          <svg class="animate-spin h-4 w-4 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          ${t('app.auth.connecting')}
        </div>
      </div>`;

    // Validate token asynchronously
    validateToken().then(result => {
      if (result.ok) {
        onAuth(result.username || storedUser);
      } else {
        // Token expired — show login screen with notice
        showToast(t('app.auth.expired_msg'), 'warning');
        render();
      }
    });
  } else {
    render();
  }

  function render() {
    container.innerHTML = `
      <div class="w-full max-w-sm animate-fade-in">
        <div class="text-center mb-8">
          <div class="text-6xl mb-3">🌱</div>
          <h1 class="text-3xl font-bold text-white tracking-tight" style="font-family: 'Bebas Neue', sans-serif;">${t('app.auth.title')}</h1>
          <p class="text-slate-400 text-sm mt-1">${t('app.auth.subtitle')}</p>
        </div>

        <div class="bg-slate-900 rounded-2xl p-6 border border-white/10 shadow-xl">
          <div class="flex bg-slate-800 rounded-xl p-1 mb-5">
            <button type="button" id="tab-login"
              class="flex-1 py-2 rounded-lg text-sm font-bold transition ${mode === 'login' ? 'bg-green-600 text-white shadow' : 'text-slate-400'}">
              ${t('app.auth.login')}
            </button>
            <button type="button" id="tab-register"
              class="flex-1 py-2 rounded-lg text-sm font-bold transition ${mode === 'register' ? 'bg-green-600 text-white shadow' : 'text-slate-400'}">
              ${t('app.auth.register')}
            </button>
          </div>

          <form id="auth-form" autocomplete="on">
            <div class="mb-4">
              <label for="auth-username" class="block text-xs text-slate-400 mb-1.5">${t('app.auth.username')}</label>
              <input id="auth-username" type="text" autocomplete="username" required minlength="3" maxlength="20"
                placeholder="${t('app.auth.username_placeholder')}"
                class="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm" />
            </div>
            <div class="mb-5">
              <label for="auth-password" class="block text-xs text-slate-400 mb-1.5">${t('app.auth.password')}</label>
              <input id="auth-password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" required minlength="4"
                placeholder="${t('app.auth.password_placeholder')}"
                class="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm" />
            </div>

            <div id="auth-error" class="hidden mb-4 p-3 bg-red-900/30 border border-red-700/40 rounded-xl text-red-300 text-xs text-center"></div>

            <button type="submit" id="auth-submit"
              class="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-sm hover:from-green-500 hover:to-emerald-500 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              ${mode === 'login' ? t('app.auth.login_btn') : t('app.auth.register_btn')}
            </button>
          </form>
        </div>

        <p class="text-center text-[11px] text-slate-600 mt-4">${t('app.auth.cloud_note')}</p>
      </div>`;

    // Tab switching
    container.querySelector('#tab-login').addEventListener('click', () => { mode = 'login'; render(); });
    container.querySelector('#tab-register').addEventListener('click', () => { mode = 'register'; render(); });

    // Form submit
    const form = container.querySelector('#auth-form');
    form.addEventListener('submit', handleSubmit);

    // Focus username
    setTimeout(() => container.querySelector('#auth-username')?.focus(), 100);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    const errorEl = container.querySelector('#auth-error');
    const submitBtn = container.querySelector('#auth-submit');
    const username = container.querySelector('#auth-username').value.trim().toLowerCase();
    const password = container.querySelector('#auth-password').value;

    if (username.length < 3 || password.length < 4) {
      errorEl.textContent = t('app.auth.error_length');
      errorEl.classList.remove('hidden');
      return;
    }

    loading = true;
    submitBtn.disabled = true;
    submitBtn.textContent = t('app.auth.connecting');
    errorEl.classList.add('hidden');

    const result = mode === 'login'
      ? await login(username, password)
      : await register(username, password);

    loading = false;
    submitBtn.disabled = false;

    if (result.ok) {
      showToast(t('app.auth.welcome', { username: result.username }), 'success');
      onAuth(result.username);
    } else {
      errorEl.textContent = result.error;
      errorEl.classList.remove('hidden');
      submitBtn.textContent = mode === 'login' ? t('app.auth.login_btn') : t('app.auth.register_btn');
    }
  }

  return { element: container };
}

export function showAuthExpiredPopup(onRelogin) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black/70 backdrop-blur z-50 flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div class="bg-slate-900 rounded-2xl p-6 border border-white/10 max-w-xs w-full text-center animate-fade-in">
      <div class="text-4xl mb-3">🔒</div>
      <h3 class="text-lg font-bold text-white mb-2">${t('app.auth.expired_title')}</h3>
      <p class="text-slate-400 text-sm mb-5">${t('app.auth.expired_msg')}</p>
      <button id="relogin-btn" class="w-full py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm active:scale-95 transition">${t('app.auth.login_btn')}</button>
    </div>`;

  overlay.querySelector('#relogin-btn').addEventListener('click', () => {
    overlay.remove();
    logout();
    onRelogin();
  });

  document.body.appendChild(overlay);
}
