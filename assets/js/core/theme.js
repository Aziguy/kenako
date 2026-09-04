/**
 * Kenako — thème clair / sombre
 * Le choix explicite de l'utilisateur prime ; sinon on suit le système.
 */

const KEY = 'kenako:theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

export function getTheme() {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch { /* stockage indisponible */ }
  return media.matches ? 'dark' : 'light';
}

export function applyTheme(theme = getTheme()) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#16110E' : '#FBF6EF');
  document.dispatchEvent(new CustomEvent('kenako:theme', { detail: { theme } }));
  return theme;
}

export function setTheme(theme) {
  try { localStorage.setItem(KEY, theme); } catch { /* stockage indisponible */ }
  return applyTheme(theme);
}

export function toggleTheme() {
  return setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
}

/** À appeler au démarrage de chaque espace. */
export function initTheme() {
  applyTheme();
  media.addEventListener('change', () => {
    let explicit = null;
    try { explicit = localStorage.getItem(KEY); } catch { /* ignore */ }
    if (!explicit) applyTheme();
  });
}
