/**
 * Kenako — notifications éphémères
 * Un seul conteneur par page, créé à la demande. Chaque toast combine
 * couleur + icône + texte : jamais la couleur seule (accessibilité).
 */

const ICONS = { success: '✓', warning: '!', danger: '✕', info: 'i' };
let host = null;

function ensureHost() {
  if (host && document.body.contains(host)) return host;
  host = document.createElement('div');
  host.className = 'toaster';
  host.setAttribute('role', 'status');
  host.setAttribute('aria-live', 'polite');
  document.body.appendChild(host);
  return host;
}

/**
 * @param {string} message
 * @param {{tone?: 'success'|'warning'|'danger'|'info', action?: string, onAction?: Function, duration?: number}} options
 */
export function toast(message, options = {}) {
  const { tone = 'success', action, onAction, duration = 3600 } = options;
  const root = ensureHost();

  const node = document.createElement('div');
  node.className = `toast toast--${tone}`;
  node.innerHTML = `<span class="toast__icon" aria-hidden="true">${ICONS[tone]}</span><span class="toast__text"></span>`;
  node.querySelector('.toast__text').textContent = message;

  if (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast__action';
    btn.textContent = action;
    btn.addEventListener('click', () => { dismiss(); onAction?.(); });
    node.appendChild(btn);
  }

  root.appendChild(node);
  const timer = setTimeout(dismiss, duration);

  function dismiss() {
    clearTimeout(timer);
    node.style.transition = 'opacity 160ms, transform 160ms';
    node.style.opacity = '0';
    node.style.transform = 'translateY(8px)';
    setTimeout(() => node.remove(), 170);
  }

  return dismiss;
}

export const toastOk = (msg, opts) => toast(msg, { ...opts, tone: 'success' });
export const toastWarn = (msg, opts) => toast(msg, { ...opts, tone: 'warning' });
export const toastErr = (msg, opts) => toast(msg, { ...opts, tone: 'danger' });
export const toastInfo = (msg, opts) => toast(msg, { ...opts, tone: 'info' });
