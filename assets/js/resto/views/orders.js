/**
 * B3 — Gestion des commandes
 * Vue Kanban par statut, panneau latéral de détail avec mini-carte,
 * refus motivé, réglage du temps de préparation et impression du ticket.
 * L'écran cuisine (KDS) plein écran vit dans `kds.js`.
 */

import { html, raw, esc } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number } from '../../core/format.js';
import { ORDER_STATUSES, REFUSAL_REASONS, RESTO } from '../../data/resto.js';
import { orderCard } from '../components.js';
import { createMap } from '../../core/map.js';

let miniMap = null;

export function view(ctx) {
  const { state } = ctx;
  const orders = state.orders;
  const filtered = state.orderFilter === 'all' ? orders : orders.filter((o) => o.mode === state.orderFilter);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Commandes</h1>
          <p class="bo-sub">${number(orders.filter((o) => o.status === 'new').length)} nouvelle(s) · ${number(filtered.length)} affichée(s)</p>
        </div>
        <div class="row" style="gap:var(--sp-2)">
          <button type="button" class="btn btn--outline btn--sm" data-act="simulate-order">
            ${raw(icon('plus', { size: 16 }))} Simuler une commande
          </button>
          <button type="button" class="btn btn--outline btn--sm" data-act="toggle-sound" aria-pressed="${state.sound}">
            ${raw(icon('bell', { size: 16 }))} Son ${state.sound ? 'activé' : 'coupé'}
          </button>
          <a class="btn btn--primary btn--sm" href="#/cuisine">${raw(icon('chef', { size: 16 }))} Écran cuisine</a>
        </div>
      </div>

      <div class="filter-bar">
        ${['all', 'livraison', 'emporter', 'surplace'].map(
          (m) => html`<button type="button" class="chip" data-act="order-filter" data-id="${m}"
            aria-pressed="${state.orderFilter === m}">${{ all: 'Tous les modes', livraison: 'Livraison', emporter: 'À emporter', surplace: 'Sur place' }[m]}</button>`
        )}
      </div>

      <div class="kanban">
        ${ORDER_STATUSES.map((col) => {
          const items = filtered.filter((o) => o.status === col.id);
          return html`
            <section class="kanban__col" data-col="${col.id}">
              <header class="kanban__head">
                <span class="badge badge--${col.tone}">${col.label}</span>
                <span class="tiny dim">${items.length}</span>
              </header>
              <div class="kanban__list">
                ${items.length
                  ? items.map((o) => orderCard(o, { selected: state.selectedOrder === o.id }))
                  : html`<p class="tiny dim" style="padding:var(--sp-4);text-align:center;border:1px dashed var(--line);border-radius:var(--r-md)">Glissez une commande ici</p>`}
              </div>
            </section>`;
        })}
      </div>
    </div>

    ${state.selectedOrder ? drawer(ctx, orders.find((o) => o.id === state.selectedOrder)) : ''}`;
}

function drawer(ctx, order) {
  if (!order) return '';
  const status = ORDER_STATUSES.find((s) => s.id === order.status);

  return html`
    <div class="scrim" data-act="close-drawer" style="align-items:stretch;justify-content:flex-end">
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="Commande ${order.id}" data-stop>
        <header class="card__head">
          <div style="min-width:0">
            <span class="eyebrow">${order.time} · ${order.mode}</span>
            <h2 class="card__title num">${order.id}</h2>
          </div>
          <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="close-drawer" aria-label="Fermer">✕</button>
        </header>

        <div style="overflow-y:auto;padding:var(--sp-5);display:grid;gap:var(--sp-5)">
          <div class="between">
            <span class="badge badge--${status.tone}">${status.label}</span>
            <strong class="num" style="font-size:var(--fs-lg)">${money(order.total)}</strong>
          </div>

          <section class="stack-sm">
            <h3 class="eyebrow">Contenu</h3>
            <div class="divider-list">
              ${order.items.map(
                (i) => html`
                <div class="between" style="padding:var(--sp-2) 0;align-items:flex-start">
                  <span style="min-width:0">
                    <strong class="num" style="color:var(--primary-strong)">${i.q}×</strong> ${i.n}
                    ${i.o ? html`<br><span class="tiny dim">${i.o}</span>` : ''}
                  </span>
                  <span class="num">${money(i.p * i.q)}</span>
                </div>`
              )}
            </div>
            ${order.note
              ? html`<p class="banner banner--warning"><span class="banner__icon">✎</span><span>${order.note}</span></p>`
              : ''}
          </section>

          <section class="stack-sm">
            <h3 class="eyebrow">Client</h3>
            <dl class="kv">
              <dt>Nom</dt><dd>${order.client}</dd>
              ${order.phone ? html`<dt>Téléphone</dt><dd><a href="tel:${order.phone.replace(/\s/g, '')}">${order.phone}</a></dd>` : ''}
              <dt>Adresse</dt><dd>${order.address}${order.detail ? html`<br><span class="tiny dim">${order.detail}</span>` : ''}</dd>
              <dt>Paiement</dt><dd>${order.payment}</dd>
              ${order.courier ? html`<dt>Livreur</dt><dd>${order.courier}</dd>` : ''}
            </dl>
          </section>

          ${order.lat ? html`<div class="map-canvas" id="order-map" style="height:170px" aria-label="Adresse de livraison"></div>` : ''}

          <section class="stack-sm">
            <h3 class="eyebrow">Temps de préparation annoncé</h3>
            <div class="row-wrap">
              ${[10, 20, 30, 45].map(
                (m) => html`<button type="button" class="chip" data-act="set-prep" data-value="${m}"
                  aria-pressed="${ctx.state.prepTime === m}">${m} min</button>`
              )}
            </div>
          </section>
        </div>

        <footer class="sheet__foot">
          ${order.status === 'new'
            ? html`
              <div class="row" style="gap:var(--sp-2)">
                <button type="button" class="btn btn--danger" style="flex:1" data-act="refuse-order" data-id="${order.id}">Refuser</button>
                <button type="button" class="btn btn--success" style="flex:2" data-act="accept-order" data-id="${order.id}">
                  ${raw(icon('check', { size: 17 }))} Accepter · ${ctx.state.prepTime} min
                </button>
              </div>`
            : html`
              <div class="row" style="gap:var(--sp-2)">
                <button type="button" class="btn btn--outline" data-act="print-order" data-id="${order.id}">
                  ${raw(icon('print', { size: 16 }))} Ticket
                </button>
                ${order.status !== 'done'
                  ? html`<button type="button" class="btn btn--primary" style="flex:1" data-act="advance-order" data-id="${order.id}">
                      Passer à l’étape suivante</button>`
                  : ''}
              </div>`}
        </footer>
      </aside>
    </div>`;
}

/** Feuille de refus motivé — un refus sans motif ne rend service à personne. */
export function refusalBody(orderId) {
  return `<div class="stack-sm">
    <p class="tiny dim">Le client est prévenu immédiatement et remboursé s’il a déjà payé.</p>
    ${REFUSAL_REASONS.map(
      (r) => `<button type="button" class="option" data-act="confirm-refuse" data-id="${esc(orderId)}" data-reason="${esc(r)}">
        <span class="option__mark">${icon('x', { size: 12 })}</span><span>${esc(r)}</span></button>`
    ).join('')}
  </div>`;
}

/**
 * Glisser-déposer d'une commande d'une colonne à l'autre.
 * Les écouteurs sont posés à chaque rendu : le DOM est reconstruit à neuf,
 * il n'y a donc rien à détacher.
 */
function wireDragAndDrop(ctx) {
  let dragged = null;

  document.querySelectorAll('.kanban .order-card').forEach((card) => {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', (e) => {
      dragged = card.dataset.id;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', dragged);
    });
    card.addEventListener('dragend', () => card.classList.remove('is-dragging'));
  });

  document.querySelectorAll('.kanban__col').forEach((col) => {
    col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('is-over'); });
    col.addEventListener('dragleave', () => col.classList.remove('is-over'));
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('is-over');
      const id = dragged || e.dataTransfer.getData('text/plain');
      if (id) ctx.onDrop?.(id, col.dataset.col);
      dragged = null;
    });
  });
}

export function mount(ctx) {
  wireDragAndDrop(ctx);
  const container = document.getElementById('order-map');
  miniMap?.destroy();
  miniMap = null;
  if (!container) return;

  const order = ctx.state.orders.find((o) => o.id === ctx.state.selectedOrder);
  if (!order?.lat) return;

  miniMap = createMap(container, { center: [order.lat, order.lng], zoom: 15, interactive: false });
  if (!miniMap) return;
  miniMap.setMarkers([
    { id: 'resto', lat: RESTO.lat, lng: RESTO.lng, name: RESTO.name, label: '🍽️' },
    { id: 'client', lat: order.lat, lng: order.lng, name: order.client, label: '📍' },
  ]);
  miniMap.fit([{ lat: RESTO.lat, lng: RESTO.lng }, { lat: order.lat, lng: order.lng }], 32);
  miniMap.invalidate();
}

export function unmount() {
  miniMap?.destroy();
  miniMap = null;
}
