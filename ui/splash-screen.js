export function createSplashScreen(onComplete) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-[60] flex items-center justify-center select-none';
  overlay.style.backgroundColor = '#DC2626';

  const text = document.createElement('h1');
  text.textContent = 'DylVen Corp';
  text.style.fontFamily = "'Bebas Neue', sans-serif";
  text.style.fontSize = 'clamp(2.5rem, 12vw, 5rem)';
  text.style.color = '#000000';
  text.style.letterSpacing = '0.08em';
  text.style.margin = '0';
  text.style.opacity = '0';
  text.style.transform = 'scale(0.9)';
  text.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

  overlay.appendChild(text);
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      text.style.opacity = '1';
      text.style.transform = 'scale(1)';
    });
  });

  setTimeout(() => {
    overlay.style.transition = 'opacity 0.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      onComplete();
    }, 500);
  }, 2500);
}
