let container;

function ensureContainer() {
  if (container) return;
  container = document.createElement('div');
  container.className = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
}

export function showToast(message, type = 'default', duration = 4000) {
  ensureContainer();
  const el = document.createElement('div');
  el.className = `toast${type !== 'default' ? ` toast--${type}` : ''}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 300ms ease';
    setTimeout(() => el.remove(), 300);
  }, duration);
}
