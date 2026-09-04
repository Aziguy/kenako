/**
 * A9 — Commande à table par QR code
 * Numéro de table pré-rempli, carte simplifiée, appel serveur et
 * partage d'addition. Aucun compte, aucune adresse à saisir.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { getRestaurant } from '../../data/restaurants.js';
import { MENUS } from '../../data/menus.js';
import { dishRow } from '../components.js';
import { computeTotals } from '../cart.js';

const SPLIT_OPTIONS = [
  { id: 'equal', label: 'Diviser en parts égales', hint: 'Chacun règle le même montant' },
  { id: 'items', label: 'Chacun paie ses plats', hint: 'Sélection article par article' },
  { id: 'single', label: 'Une seule personne règle', hint: 'Addition complète' },
];

export function view(ctx) {
  const { state } = ctx;
  const r = getRestaurant(state.restId);
  const cats = MENUS[r.id] || [];
  const t = computeTotals({ cart: state.cart, restId: r.id, mode: 'surplace' });

  return html`
    <div class="wrap" style="padding-bottom:140px">
      <header class="stack-sm" style="padding:var(--sp-5) 0">
        <div class="between">
          <span class="table-badge">${raw(icon('qr', { size: 16 }))} Table ${state.tableNo}</span>
          <a class="btn btn--ghost btn--sm" href="#/">Quitter</a>
        </div>
        <h1 class="page__title">${r.name}</h1>
        <p class="tiny dim">Commande en salle · service à table · règlement quand vous voulez</p>
      </header>

      <div class="row" style="gap:var(--sp-2);padding-bottom:var(--sp-4)">
        <button type="button" class="btn btn--outline" style="flex:1" data-act="call-waiter">
          ${raw(icon('bell', { size: 17 }))} Appeler un serveur
        </button>
        <button type="button" class="btn btn--outline" style="flex:1" data-act="toggle-split"
          aria-expanded="${Boolean(state.splitOpen)}">
          ${raw(icon('users', { size: 17 }))} Partager l’addition
        </button>
      </div>

      ${state.splitOpen
        ? html`
          <article class="card card--pad stack-sm anim-rise" style="margin-bottom:var(--sp-4)">
            <strong>Comment partager ?</strong>
            <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:var(--sp-2)">
              ${SPLIT_OPTIONS.map(
                (o) => html`
                <button type="button" class="option" style="flex-direction:column;align-items:flex-start;gap:2px"
                  role="radio" aria-checked="${state.split === o.id}" data-act="split" data-id="${o.id}">
                  <span class="strong tiny">${o.label}</span>
                  <span class="tiny dim">${o.hint}</span>
                </button>`
              )}
            </div>
            <p class="tiny dim">Chaque convive scanne le QR de la table et règle sa part avec son propre moyen de paiement.</p>
          </article>`
        : ''}

      ${cats.map(
        (c) => html`
        <section class="section" style="padding-bottom:var(--sp-5)">
          <h2 class="section__title">${c.cat}</h2>
          <div class="divider-list">${c.items.map((d) => dishRow(d, r))}</div>
        </section>`
      )}
    </div>

    ${state.cart.length
      ? html`
        <div class="actionbar">
          <div class="actionbar__inner">
            <div style="display:grid">
              <span class="tiny dim">Table ${state.tableNo} · ${state.cart.length} article${state.cart.length > 1 ? 's' : ''}</span>
              <strong class="num" style="font-size:var(--fs-lg)">${money(t.total)}</strong>
            </div>
            <button type="button" class="btn btn--accent" style="flex:1" data-act="send-to-kitchen">
              Envoyer en cuisine ${raw(icon('arrowRight', { size: 17 }))}
            </button>
          </div>
        </div>`
      : ''}`;
}
