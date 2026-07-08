const t = (key, values) => window.miniappI18n?.t(key, values) ?? key;

export function createWelcomeScreen(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4';

  overlay.innerHTML = `
    <div class="w-full max-w-sm text-center animate-fade-in">
      <div class="text-7xl mb-6">🌱</div>
      <h1 class="text-2xl text-slate-400 mb-1">${t('app.welcome.title')}</h1>
      <h2 class="text-4xl font-bold text-green-400 mb-10">${t('app.welcome.subtitle')}</h2>

      <div class="mb-8">
        <label for="farm-name-input" class="block text-sm text-slate-400 mb-3">${t('app.welcome.name_label')}</label>
        <input
          type="text"
          id="farm-name-input"
          maxlength="10"
          placeholder="${t('app.welcome.name_placeholder')}"
          autocomplete="off"
          class="w-full px-4 py-3.5 bg-slate-800 border border-slate-600 rounded-2xl text-white text-center text-xl font-semibold focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
        >
        <p class="mt-3 text-sm text-slate-500 h-5" id="name-preview"></p>
      </div>

      <button id="start-btn" class="w-full py-4 bg-green-600 hover:bg-green-500 active:bg-green-400 text-white rounded-2xl text-lg font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed" disabled>
        ${t('app.welcome.start')}
      </button>
    </div>
  `;

  const input = overlay.querySelector('#farm-name-input');
  const preview = overlay.querySelector('#name-preview');
  const startBtn = overlay.querySelector('#start-btn');

  function updatePreview() {
    const name = input.value.trim();
    preview.textContent = name.length > 0 ? `"${name} Farm"` : '';
    startBtn.disabled = name.length === 0;
  }

  input.addEventListener('input', updatePreview);

  startBtn.addEventListener('click', () => {
    const name = input.value.trim().slice(0, 10);
    if (name.length > 0) {
      onComplete(name);
      overlay.remove();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !startBtn.disabled) startBtn.click();
  });

  setTimeout(() => input.focus(), 300);

  return overlay;
}
