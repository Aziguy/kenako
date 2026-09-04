/**
 * Kenako — fragments partagés du back-office restaurateur
 */

import { html, raw } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { money, number, trend, delta } from '../core/format.js';
import { sparkline } from '../core/charts.js';

/** Tuile de KPI : valeur, variation et micro-courbe optionnelle. */
export function stat({ label, value, previous, current, spark, format = number, unit = '%' }) {
  const t = previous !== undefined ? trend(current ?? 0, previous) : null;
  const arrow = { up: '▲', down: '▼', flat: '—' };

  return html`
    <article class="stat">
      <span class="stat__label">${label}</span>
      <span class="stat__value">${value}</span>
      ${t
        ? html`<span class="stat__delta stat__delta--${t.dir}">
            <span aria-hidden="true">${arrow[t.dir]}</span>${delta(t.value, unit)}
            <span class="dim" style="font-weight:500">vs hier</span>
          </span>`
        : ''}
      ${spark ? raw(sparkline(spark, { color: 'var(--herb)', fill: 'color-mix(in srgb, var(--herb) 14%, transparent)' })) : ''}
    </article>`;
}

/** En-tête de section du back-office. */
export function sectionCard(title, body, { action = '', sub = '' } = {}) {
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

/** Alerte du tableau de bord. */
export function alertRow(a) {
  return html`
    <a class="banner banner--${a.tone === 'danger' ? 'danger' : a.tone === 'warning' ? 'warning' : ''}"
       href="#${a.to}" style="text-decoration:none;color:inherit">
      <span class="banner__icon" aria-hidden="true">${a.icon}</span>
      <span style="flex:1;min-width:0">
        <strong class="banner__title">${a.title}</strong>
        <span class="tiny">${a.text}</span>
      </span>
      <span class="tiny strong" style="white-space:nowrap">${a.action} ${raw(icon('chevronRight', { size: 12 }))}</span>
    </a>`;
}

/** Carte de commande du Kanban. */
export function orderCard(order, { selected = false } = {}) {
  const late = order.minutes > 35 && !['done'].includes(order.status);
  return html`
    <button type="button" class="order-card ${order.status === 'new' ? 'is-new' : ''} ${late ? 'is-late' : ''}"
      data-act="open-order" data-id="${order.id}" aria-pressed="${selected}">
      <span class="between">
        <span class="order-card__id">${order.id}</span>
        <span class="badge ${late ? 'badge--danger' : 'badge--outline'}">${late ? '⏱' : ''} ${order.minutes} min</span>
      </span>
      <span class="between">
        <span class="tiny strong truncate">${order.client}</span>
        <span class="badge badge--outline">${order.mode}</span>
      </span>
      <span class="order-card__items">
        ${order.items.map((i) => html`<span>${i.q}× ${i.n}</span><br>`)}
      </span>
      <span class="between">
        <span class="tiny dim">${order.time} · ${order.payment}</span>
        <strong class="num">${money(order.total)}</strong>
      </span>
    </button>`;
}

/** Ligne de tableau générique avec état coloré + icône + texte. */
export function statusBadge(label, tone, glyph = '') {
  return html`<span class="badge badge--${tone}">${glyph} ${label}</span>`;
}

export const TONE_BY_STATE = {
  actif: 'success', 'à jour': 'success', payé: 'success', publié: 'success', confirmée: 'success', validé: 'success',
  'en attente': 'warning', 'relance 2': 'warning', brouillon: 'outline', programmée: 'info', 'à vérifier': 'warning',
  suspendu: 'danger', impayé: 'danger', illisible: 'danger', expiré: 'danger',
};

export const GLYPH_BY_STATE = {
  actif: '✓', 'à jour': '✓', payé: '✓', publié: '✓', confirmée: '✓', validé: '✓',
  'en attente': '⏳', 'relance 2': '!', brouillon: '✎', programmée: '⏱', 'à vérifier': '?',
  suspendu: '✕', impayé: '✕', illisible: '✕', expiré: '✕',
};

export function stateBadge(state) {
  const key = String(state).toLowerCase();
  return statusBadge(state, TONE_BY_STATE[key] || 'outline', GLYPH_BY_STATE[key] || '');
}
