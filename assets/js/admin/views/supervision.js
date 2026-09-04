/**
 * C6 — Supervision (lecture seule)
 * Vue globale des commandes de tous les restaurants. Aucune action n'est
 * possible : le bandeau le dit, et il n'existe aucun bouton d'action.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number, fold } from '../../core/format.js';
import { PLATFORM_ORDERS, RESTAURATEURS } from '../../data/admin.js';
import { panel, readOnlyBanner } from '../components.js';

const STATUS_TONE = {
  'En préparation': 'warning',
  Prête: 'success',
  'En livraison': 'info',
  Livrée: 'outline',
};

export function view(ctx) {
  const { state } = ctx;
  const q = fold(state.superQuery || '');
  const rows = PLATFORM_ORDERS.filter((o) => {
    if (q && !fold(`${o.id} ${o.resto} ${o.client}`).includes(q)) return false;
    if (state.superResto && state.superResto !== 'all' && o.resto !== state.superResto) return false;
    return true;
  });
  const volume = rows.reduce((s, o) => s + o.total, 0);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Supervision</h1>
          <p class="bo-sub">${number(rows.length)} commandes affichées · ${money(volume)} de volume observé</p>
        </div>
      </div>

      ${readOnlyBanner()}

      <div class="filter-bar">
        <label class="input-group" style="flex:1;max-width:300px">
          <span class="sr-only">Rechercher une commande</span>
          <span class="input-group__icon">${raw(icon('search', { size: 16 }))}</span>
          <input class="input" type="search" placeholder="Numéro, restaurant, client" data-bind="superQuery" value="${state.superQuery || ''}">
        </label>
        <label class="sr-only" for="super-resto">Filtrer par restaurant</label>
        <select class="select" id="super-resto" data-bind="superResto">
          <option value="all">Tous les restaurants</option>
          ${RESTAURATEURS.map((r) => html`<option value="${r.name}" ${state.superResto === r.name ? raw('selected') : ''}>${r.name}</option>`)}
        </select>
      </div>

      ${panel(
        'Commandes de la plateforme',
        rows.length
          ? html`
            <div class="table-wrap">
              <table class="table">
                <thead><tr><th>Commande</th><th>Restaurant</th><th>Client</th><th>Mode</th><th>Statut</th><th>Montant</th><th>Heure</th></tr></thead>
                <tbody>
                  ${rows.map(
                    (o) => html`
                    <tr>
                      <td class="num strong">${o.id}</td>
                      <td>${o.resto}</td>
                      <td class="dim">${o.client}</td>
                      <td><span class="badge badge--outline">${o.mode}</span></td>
                      <td><span class="badge badge--${STATUS_TONE[o.status] || 'outline'}">${o.status}</span></td>
                      <td class="num">${money(o.total)}</td>
                      <td class="dim num">${o.time}</td>
                    </tr>`
                  )}
                </tbody>
              </table>
            </div>
            <p class="tiny dim" style="margin-top:var(--sp-3)">
              ${raw(icon('shield', { size: 13 }))} Aucune modification, annulation ou remboursement n’est possible depuis cet écran.
              Ces opérations relèvent exclusivement du restaurateur.
            </p>`
          : html`<div class="empty"><div class="empty__art">🔍</div>
              <p class="empty__title">Aucune commande</p>
              <p class="empty__text">Aucune commande ne correspond à ces filtres.</p></div>`
      )}
    </div>`;
}
