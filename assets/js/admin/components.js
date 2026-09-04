/**
 * Kenako — fragments partagés de la console superadmin
 */

import { html, raw } from '../core/dom.js';
import { number, trend, delta } from '../core/format.js';
import { sparkline } from '../core/charts.js';

export function statTile({ label, value, previous, current, spark, unit = '%' }) {
  const t = previous !== undefined ? trend(current ?? 0, previous) : null;
  const arrow = { up: '▲', down: '▼', flat: '—' };

  return html`
    <article class="stat">
      <span class="stat__label">${label}</span>
      <span class="stat__value">${value}</span>
      ${t
        ? html`<span class="stat__delta stat__delta--${t.dir}">
            <span aria-hidden="true">${arrow[t.dir]}</span>${delta(t.value, unit)}
            <span class="dim" style="font-weight:500">vs mois dernier</span>
          </span>`
        : ''}
      ${spark ? raw(sparkline(spark, { color: 'var(--herb)', fill: 'color-mix(in srgb, var(--herb) 14%, transparent)' })) : ''}
    </article>`;
}

export function panel(title, body, { sub = '', action = '' } = {}) {
  return html`
    <section class="card">
      <header class="card__head">
        <div style="min-width:0">
          <h2 class="card__title">${title}</h2>
          ${sub ? html`<p class="tiny dim">${sub}</p>` : ''}
        </div>
        ${raw(action)}
      </header>
      <div class="card__body">${body}</div>
    </section>`;
}

const TONES = {
  actif: 'success', 'à jour': 'success', validé: 'success', publiée: 'success', résolu: 'success', active: 'success',
  'en attente': 'warning', 'relance 2': 'warning', 'à vérifier': 'warning', brouillon: 'outline', 'en cours': 'info',
  programmé: 'info', ouvert: 'primary', basse: 'outline', normale: 'info', haute: 'danger',
  suspendu: 'danger', impayé: 'danger', illisible: 'danger', expiré: 'danger', terminé: 'outline', terminée: 'outline',
};
const GLYPHS = {
  actif: '✓', 'à jour': '✓', validé: '✓', publiée: '✓', résolu: '✓', active: '✓',
  'en attente': '⏳', 'relance 2': '!', 'à vérifier': '?', brouillon: '✎', 'en cours': '●',
  programmé: '⏱', ouvert: '●', haute: '!',
  suspendu: '✕', impayé: '✕', illisible: '✕', expiré: '✕', terminé: '—', terminée: '—',
};

/** Statut = couleur + icône + texte, jamais la couleur seule. */
export function badge(state) {
  const key = String(state).toLowerCase();
  return html`<span class="badge badge--${TONES[key] || 'outline'}">${GLYPHS[key] || ''} ${state}</span>`;
}

/** Bandeau de lecture seule, obligatoire sur les écrans de supervision. */
export function readOnlyBanner(text = 'Vue en lecture seule — aucune action n’est possible sur les commandes depuis cet espace.') {
  return html`
    <div class="readonly-banner">
      <span aria-hidden="true">👁</span>
      <span>${text}</span>
    </div>`;
}

/** Tri de colonne pour les grands tableaux. */
export function sortableHeader(columns, sort) {
  return html`<tr>
    ${columns.map(
      (c) => html`<th ${c.key ? raw(`data-act="sort" data-key="${c.key}" aria-sort="${sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}"`) : ''}>${c.label}</th>`
    )}
  </tr>`;
}

export function applySort(rows, sort) {
  if (!sort.key) return rows;
  return [...rows].sort((a, b) => {
    const va = a[sort.key];
    const vb = b[sort.key];
    if (typeof va === 'number' && typeof vb === 'number') return (va - vb) * sort.dir;
    return String(va).localeCompare(String(vb), 'fr') * sort.dir;
  });
}

export const count = (n, singular, plural) => `${number(n)} ${n > 1 ? plural ?? `${singular}s` : singular}`;
