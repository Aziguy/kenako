/**
 * Kenako — routeur par fragment d'URL
 * -------------------------------------------------------------------------
 * Le hash permet d'héberger le prototype sur GitHub Pages sans réécriture
 * serveur, et rend chaque écran partageable (« #/r/comptoir », « #/suivi »).
 */

export function createRouter({ routes, fallback = '/', onChange }) {
  const compiled = Object.entries(routes).map(([pattern, name]) => ({
    name,
    pattern,
    segments: pattern.split('/').filter(Boolean),
  }));

  function parse(hash) {
    const clean = (hash || '').replace(/^#/, '') || fallback;
    const [path, queryString] = clean.split('?');
    const segments = path.split('/').filter(Boolean);
    const query = Object.fromEntries(new URLSearchParams(queryString || ''));

    for (const route of compiled) {
      if (route.segments.length !== segments.length) continue;
      const params = {};
      const match = route.segments.every((seg, i) => {
        if (seg.startsWith(':')) { params[seg.slice(1)] = decodeURIComponent(segments[i]); return true; }
        return seg === segments[i];
      });
      if (match) return { name: route.name, path, params, query };
    }
    return { name: routes[fallback] || compiled[0].name, path: fallback, params: {}, query };
  }

  let current = parse(location.hash);
  let previous = null;

  function handle() {
    const next = parse(location.hash);
    if (next.path === current.path && next.name === current.name) {
      // même écran, paramètres de requête différents : on notifie quand même
      if (JSON.stringify(next.query) === JSON.stringify(current.query)) return;
    }
    previous = current;
    current = next;
    onChange(current, previous);
  }

  window.addEventListener('hashchange', handle);

  return {
    get current() { return current; },
    get previous() { return previous; },

    /** Navigue vers un chemin (« /r/comptoir »). */
    go(path, { replace = false, scroll = true } = {}) {
      const target = `#${path.startsWith('/') ? path : `/${path}`}`;
      if (location.hash === target) { onChange(current, previous); return; }
      if (replace) history.replaceState(null, '', target);
      else location.hash = target;
      if (scroll) window.scrollTo({ top: 0, behavior: 'auto' });
    },

    /** Retour arrière, avec repli sur un écran par défaut. */
    back(defaultPath = fallback) {
      if (previous) history.back();
      else this.go(defaultPath);
    },

    /** Démarre le routeur (premier rendu). */
    start() {
      if (!location.hash) history.replaceState(null, '', `#${fallback}`);
      current = parse(location.hash);
      onChange(current, null);
    },
  };
}

/** Construit un href de fragment sûr pour les liens de gabarit. */
export const href = (path) => `#${path.startsWith('/') ? path : `/${path}`}`;
