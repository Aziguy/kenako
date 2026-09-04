/**
 * Kenako — micro-couche DOM
 * -------------------------------------------------------------------------
 * Pas de framework : un littéral de gabarit qui échappe par défaut, un
 * moteur de rendu qui remplace le contenu d'un conteneur, et une délégation
 * d'événements basée sur `data-act`. Suffisant pour un prototype, et lisible
 * par n'importe quel intégrateur qui reprendra le projet.
 */

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Échappe une valeur destinée à être injectée dans du HTML. */
export function esc(value) {
  if (value === null || value === undefined || value === false) return '';
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Marque une chaîne comme déjà sûre (fragment HTML construit par nos soins). */
export function raw(value) {
  return { __html: value === null || value === undefined ? '' : String(value) };
}

function flatten(value) {
  // `null` / `undefined` disparaissent ; les booléens s'écrivent tels quels,
  // car ils alimentent les attributs ARIA (`aria-pressed="false"`).
  // Le rendu conditionnel se fait donc avec un ternaire, jamais avec `&&`.
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map(flatten).join('');
  if (typeof value === 'object' && '__html' in value) return value.__html;
  return esc(value);
}

/**
 * Littéral de gabarit : `html`<p>${texte}</p>`` .
 * Les interpolations sont échappées, sauf si elles proviennent de `raw()`
 * ou d'un autre appel à `html` (composition de fragments).
 */
export function html(strings, ...values) {
  let out = '';
  strings.forEach((chunk, i) => {
    out += chunk;
    if (i < values.length) out += flatten(values[i]);
  });
  return raw(out);
}

/** Rend un fragment dans un conteneur. Accepte `html`, `raw` ou une chaîne. */
export function render(target, content) {
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  if (!node) return null;
  node.innerHTML = flatten(content);
  return node;
}

/** Construit une liste de classes à partir de conditions. */
export function cx(...parts) {
  return parts
    .flat()
    .filter(Boolean)
    .map((p) => (typeof p === 'object' ? Object.keys(p).filter((k) => p[k]) : p))
    .flat()
    .join(' ');
}

/** Construit une chaîne d'attributs (valeurs échappées, faux = attribut omis). */
export function attrs(map) {
  return raw(
    Object.entries(map)
      .filter(([, v]) => v !== false && v !== null && v !== undefined && v !== '')
      .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
      .join(' ')
  );
}

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Délégation d'événements sur `data-act`.
 * `handlers` associe un nom d'action à `(dataset, event, element) => void`.
 * Les valeurs de `data-*` de l'élément (et de ses parents jusqu'au porteur de
 * l'action) sont fusionnées et transmises au gestionnaire.
 */
export function delegate(root, type, handlers) {
  root.addEventListener(type, (event) => {
    const el = event.target.closest('[data-act]');
    if (!el || !root.contains(el)) return;
    const fn = handlers[el.dataset.act];
    if (!fn) return;
    if (el.tagName === 'A' && !el.getAttribute('href')) event.preventDefault();
    fn({ ...el.dataset }, event, el);
  });
}

/** Écoute les changements de champs porteurs de `data-bind`. */
export function bindInputs(root, onChange, eventName = 'input') {
  root.addEventListener(eventName, (event) => {
    const el = event.target.closest('[data-bind]');
    if (!el) return;
    const value = el.type === 'checkbox' ? el.checked : el.value;
    onChange(el.dataset.bind, value, el);
  });
}

/** Restaure le focus / la position de scroll après un rendu complet. */
export function keepScroll(fn) {
  const y = window.scrollY;
  fn();
  window.scrollTo({ top: y, behavior: 'instant' in window ? 'instant' : 'auto' });
}

/** Piège le focus dans un conteneur (modales, feuilles). */
export function trapFocus(container) {
  const selector = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const onKey = (event) => {
    if (event.key !== 'Tab') return;
    const items = qsa(selector, container).filter((el) => el.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', onKey);
  const target = qsa(selector, container)[0];
  if (target) target.focus({ preventScroll: true });
  return () => container.removeEventListener('keydown', onKey);
}

/** Debounce simple, pour la recherche au clavier. */
export function debounce(fn, ms = 220) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
