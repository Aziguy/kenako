/**
 * Kenako — état applicatif
 * -------------------------------------------------------------------------
 * Un magasin minimaliste : un objet d'état, `set()` qui fusionne et notifie,
 * et une persistance optionnelle dans localStorage (panier, favoris, thème).
 * Le rendu est déclenché par les abonnés, jamais par les vues elles-mêmes.
 */

export function createStore(initial, options = {}) {
  const { persist = null, persistKeys = null } = options;
  let state = { ...initial, ...readPersisted(persist, persistKeys) };
  const listeners = new Set();
  let frame = null;

  function notify() {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      listeners.forEach((fn) => fn(state));
    });
  }

  return {
    get state() { return state; },

    /** Fusionne un correctif (ou le résultat d'une fonction) et notifie. */
    set(patch, { silent = false } = {}) {
      const next = typeof patch === 'function' ? patch(state) : patch;
      if (!next) return state;
      state = { ...state, ...next };
      writePersisted(persist, persistKeys, state);
      if (!silent) notify();
      return state;
    },

    /** Force un rendu sans changer l'état (après une action externe). */
    touch() { notify(); },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    /** Vide la persistance — utilisé par « réinitialiser la démo ». */
    reset() {
      if (persist) { try { localStorage.removeItem(persist); } catch { /* stockage indisponible */ } }
      state = { ...initial };
      notify();
    },
  };
}

function readPersisted(key, keys) {
  if (!key) return {};
  try {
    const stored = JSON.parse(localStorage.getItem(key) || '{}');
    if (!keys) return stored;
    return Object.fromEntries(Object.entries(stored).filter(([k]) => keys.includes(k)));
  } catch {
    return {};
  }
}

function writePersisted(key, keys, state) {
  if (!key) return;
  try {
    const payload = keys ? Object.fromEntries(keys.map((k) => [k, state[k]])) : state;
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    /* mode privé ou quota atteint : le prototype fonctionne sans persistance */
  }
}
