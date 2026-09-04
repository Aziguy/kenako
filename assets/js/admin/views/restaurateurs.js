/**
 * C2 — Gestion des restaurateurs
 * Tableau filtrable et triable, fiche détaillée avec visionneuse de
 * documents, validation / refus motivé, suspension et impersonation.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { number, rating, fold } from '../../core/format.js';
import { RESTAURATEURS } from '../../data/admin.js';
import { panel, badge, sortableHeader, applySort, count } from '../components.js';

const COLUMNS = [
  { key: 'name', label: 'Restaurant' },
  { key: 'owner', label: 'Gérant' },
  { key: 'city', label: 'Ville' },
  { key: 'plan', label: 'Formule' },
  { key: 'status', label: 'Statut' },
  { key: 'payment', label: 'Paiement' },
  { key: 'orders', label: 'Commandes' },
  { key: 'since', label: 'Inscrit' },
  { label: '' },
];

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'en attente', label: 'En attente' },
  { id: 'actif', label: 'Actifs' },
  { id: 'suspendu', label: 'Suspendus' },
  { id: 'impayé', label: 'Impayés' },
];

export function selectRows(state) {
  const q = fold(state.query || '');
  let rows = RESTAURATEURS.filter((r) => {
    if (q && !fold(`${r.name} ${r.owner} ${r.city} ${r.email}`).includes(q)) return false;
    if (state.filter === 'all') return true;
    if (state.filter === 'impayé') return r.payment === 'impayé';
    return r.status === state.filter;
  });
  return applySort(rows, state.sort);
}

export function view(ctx) {
  const { state } = ctx;
  const rows = selectRows(state);
  const selected = state.selected ? RESTAURATEURS.find((r) => r.id === state.selected) : null;

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Restaurateurs</h1>
          <p class="bo-sub">${count(rows.length, 'établissement')} affiché(s) sur ${number(RESTAURATEURS.length)}</p>
        </div>
        <button type="button" class="btn btn--outline btn--sm" data-act="export-restaurateurs">
          ${raw(icon('download', { size: 16 }))} Exporter
        </button>
      </div>

      <div class="filter-bar">
        <label class="input-group" style="flex:1;max-width:320px">
          <span class="sr-only">Rechercher un restaurateur</span>
          <span class="input-group__icon">${raw(icon('search', { size: 16 }))}</span>
          <input class="input" type="search" placeholder="Nom, gérant, ville, e-mail" data-bind="query" value="${state.query || ''}">
        </label>
        ${FILTERS.map(
          (f) => html`<button type="button" class="chip" data-act="filter" data-id="${f.id}"
            aria-pressed="${state.filter === f.id}">${f.label}</button>`
        )}
      </div>

      ${panel(
        'Parc de restaurants',
        rows.length
          ? html`
            <div class="table-wrap">
              <table class="table table--clickable">
                <thead>${sortableHeader(COLUMNS, state.sort)}</thead>
                <tbody>
                  ${rows.map(
                    (r) => html`
                    <tr data-act="open-resto" data-id="${r.id}" class="${state.selected === r.id ? 'is-selected' : ''}">
                      <td><strong>${r.name}</strong><br><span class="tiny dim">${r.cuisine}</span></td>
                      <td>${r.owner}</td>
                      <td>${r.city}</td>
                      <td><span class="badge badge--outline">${r.plan}</span></td>
                      <td>${badge(r.status)}</td>
                      <td>${badge(r.payment)}</td>
                      <td class="num">${number(r.orders)}</td>
                      <td class="dim">${r.since}</td>
                      <td>${raw(icon('chevronRight', { size: 16 }))}</td>
                    </tr>`
                  )}
                </tbody>
              </table>
            </div>`
          : html`<div class="empty"><div class="empty__art">🔍</div>
              <p class="empty__title">Aucun restaurateur</p>
              <p class="empty__text">Aucun établissement ne correspond à cette recherche.</p></div>`
      )}
    </div>

    ${selected ? detail(selected) : ''}`;
}

function detail(r) {
  return html`
    <div class="scrim" data-act="close-detail" style="align-items:stretch;justify-content:flex-end">
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="Fiche ${r.name}">
        <header class="card__head">
          <div style="min-width:0">
            <span class="eyebrow">${r.city} · inscrit en ${r.since}</span>
            <h2 class="card__title truncate">${r.name}</h2>
          </div>
          <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="close-detail" aria-label="Fermer">✕</button>
        </header>

        <div style="overflow-y:auto;padding:var(--sp-5);display:grid;gap:var(--sp-5)">
          <div class="row-wrap">
            ${badge(r.status)}${badge(r.payment)}
            <span class="badge badge--outline">Formule ${r.plan}</span>
            ${r.rating ? html`<span class="badge badge--outline">★ ${rating(r.rating)}</span>` : ''}
          </div>

          <section class="stack-sm">
            <h3 class="eyebrow">Contact</h3>
            <dl class="kv">
              <dt>Gérant</dt><dd>${r.owner}</dd>
              <dt>E-mail</dt><dd><a href="mailto:${r.email}">${r.email}</a></dd>
              <dt>Téléphone</dt><dd>${r.phone}</dd>
              <dt>SIRET</dt><dd class="num">${r.siret}</dd>
              <dt>Commandes</dt><dd class="num">${number(r.orders)}</dd>
            </dl>
          </section>

          <section class="stack-sm">
            <h3 class="eyebrow">Documents déposés</h3>
            ${r.docs.map(
              (d) => html`
              <article class="card card--flat card--pad stack-sm">
                <div class="between">
                  <strong class="tiny">${d.name}</strong>
                  ${badge(d.state)}
                </div>
                <div class="doc-viewer">
                  ${raw(icon('eye', { size: 26 }))}
                  <span class="tiny">Aperçu du document · déposé le ${d.date}</span>
                </div>
                ${d.state !== 'validé'
                  ? html`<div class="row" style="gap:var(--sp-2)">
                      <button type="button" class="btn btn--success btn--sm" style="flex:1" data-act="validate-doc" data-name="${d.name}">
                        ${raw(icon('check', { size: 15 }))} Valider</button>
                      <button type="button" class="btn btn--danger btn--sm" style="flex:1" data-act="reject-doc" data-name="${d.name}">
                        Refuser</button>
                    </div>`
                  : ''}
              </article>`
            )}
          </section>

          <section class="stack-sm">
            <h3 class="eyebrow">Historique d’activité</h3>
            <div class="divider-list">
              ${[
                `Compte créé en ${r.since}`,
                r.status === 'suspendu' ? 'Suspension pour impayé de 34 jours' : 'Dernière connexion aujourd’hui',
                `${number(r.orders)} commandes traitées depuis l’ouverture`,
              ].map((line) => html`<p class="tiny" style="padding:var(--sp-2) 0">${line}</p>`)}
            </div>
          </section>
        </div>

        <footer class="sheet__foot">
          ${r.status === 'en attente'
            ? html`<div class="row" style="gap:var(--sp-2)">
                <button type="button" class="btn btn--danger" style="flex:1" data-act="reject-resto" data-id="${r.id}">Refuser le dossier</button>
                <button type="button" class="btn btn--success" style="flex:2" data-act="approve-resto" data-id="${r.id}">
                  ${raw(icon('check', { size: 17 }))} Valider le compte</button>
              </div>`
            : html`<div class="row-wrap" style="gap:var(--sp-2)">
                <button type="button" class="btn btn--outline btn--sm" data-act="impersonate" data-id="${r.id}">
                  ${raw(icon('eye', { size: 15 }))} Se connecter en tant que</button>
                <button type="button" class="btn btn--outline btn--sm" data-act="message-resto" data-id="${r.id}">
                  ${raw(icon('inbox', { size: 15 }))} Envoyer un message</button>
                ${r.status === 'suspendu'
                  ? html`<button type="button" class="btn btn--success btn--sm" data-act="reactivate" data-id="${r.id}">Réactiver</button>`
                  : html`<button type="button" class="btn btn--danger btn--sm" data-act="suspend" data-id="${r.id}">Suspendre</button>`}
              </div>`}
        </footer>
      </aside>
    </div>`;
}
