/**
 * B10 — Clients & avis
 * Base clients du restaurant (historique, valeur cumulée, solde de points)
 * et avis avec réponse publique ou signalement.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number, initials } from '../../core/format.js';
import { CUSTOMERS, RESTO_REVIEWS } from '../../data/resto.js';
import { sectionCard } from '../components.js';

const TABS = [
  { id: 'clients', label: 'Clients' },
  { id: 'avis', label: 'Avis' },
];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.customerTab || 'clients';
  const unanswered = RESTO_REVIEWS.filter((r) => !r.reply).length;

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Clients & avis</h1>
          <p class="bo-sub">${number(CUSTOMERS.length)} clients réguliers · ${number(unanswered)} avis sans réponse</p>
        </div>
        <button type="button" class="btn btn--outline btn--sm" data-act="export-customers">
          ${raw(icon('download', { size: 16 }))} Exporter
        </button>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="customer-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}${t.id === 'avis' && unanswered ? html` <span class="badge badge--primary">${unanswered}</span>` : ''}</button>`
        )}
      </div>

      ${tab === 'clients'
        ? sectionCard(
            'Base clients',
            html`
              <div class="table-wrap">
                <table class="table table--clickable">
                  <thead><tr><th>Client</th><th>Commandes</th><th>Valeur cumulée</th><th>Points</th><th>Dernière</th><th>Segment</th></tr></thead>
                  <tbody>
                    ${CUSTOMERS.map(
                      (c) => html`
                      <tr data-act="open-customer" data-name="${c.name}">
                        <td><div class="row"><span class="avatar">${initials(c.name)}</span><strong>${c.name}</strong></div></td>
                        <td class="num">${number(c.orders)}</td>
                        <td class="num strong">${money(c.spent)}</td>
                        <td class="num">${number(c.points)}</td>
                        <td class="dim">${c.last}</td>
                        <td>${c.tag ? html`<span class="badge badge--${c.tag.startsWith('Inactif') ? 'warning' : 'success'}">${c.tag}</span>` : html`<span class="dim">—</span>`}</td>
                      </tr>`
                    )}
                  </tbody>
                </table>
              </div>
              <p class="tiny dim" style="margin-top:var(--sp-3)">
                ${raw(icon('shield', { size: 13 }))} Ces données vous appartiennent : elles restent liées à votre établissement.
              </p>`
          )
        : ''}

      ${tab === 'avis'
        ? html`<div class="stack">
            ${RESTO_REVIEWS.map(
              (r) => html`
              <article class="card card--pad stack-sm ${r.rating <= 2 ? '' : ''}"
                style="${r.rating <= 2 ? 'border-left:3px solid var(--danger)' : ''}">
                <div class="between">
                  <div class="row">
                    <span class="avatar">${initials(r.author)}</span>
                    <div style="display:grid">
                      <strong>${r.author}</strong>
                      <span class="tiny dim">${r.date}</span>
                    </div>
                  </div>
                  <span class="stars" aria-label="${r.rating} sur 5">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
                </div>
                <p class="tiny muted" style="line-height:1.55">${r.text}</p>
                ${r.reply
                  ? html`<p class="tiny" style="background:var(--surface-2);padding:var(--sp-3);border-radius:var(--r-sm)">
                      <strong>Votre réponse · </strong>${r.reply}</p>`
                  : html`
                    <div class="row" style="gap:var(--sp-2)">
                      <button type="button" class="btn btn--primary btn--sm" data-act="reply-review" data-author="${r.author}">
                        Répondre publiquement</button>
                      <button type="button" class="btn btn--ghost btn--sm" data-act="flag-review" data-author="${r.author}">
                        ${raw(icon('shield', { size: 15 }))} Signaler</button>
                    </div>`}
              </article>`
            )}
          </div>`
        : ''}
    </div>`;
}
