/**
 * A6 — Suivi de commande
 * Accessible sans compte via le lien partagé. La timeline avance toute seule
 * dans le prototype, et la mini-carte suit le livreur en livraison.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, duration } from '../../core/format.js';
import { TRACK_STEPS } from '../../data/client.js';
import { getRestaurant } from '../../data/restaurants.js';
import { createMap, interpolate } from '../../core/map.js';
import { emptyState, subHeader } from '../components.js';

let handle = null;

export function view(ctx) {
  const { state } = ctx;
  const order = state.lastOrder;

  if (!order) {
    return html`
      <div class="wrap wrap--narrow">
        ${subHeader('Suivi de commande', { back: '#/' })}
        ${emptyState({
          art: '📦',
          title: 'Aucune commande en cours',
          text: 'Vos commandes en cours apparaissent ici. Le lien de suivi reste accessible sans compte.',
          action: '<a class="btn btn--primary" href="#/">Commander maintenant</a>',
        })}
      </div>`;
  }

  const r = getRestaurant(order.restId);
  const isDelivery = order.mode === 'livraison';
  const steps = TRACK_STEPS.filter((s) => (isDelivery ? s.id !== 'ready' : s.id !== 'delivering'));
  const current = Math.min(state.trackStep, steps.length - 1);
  const done = current >= steps.length - 1;

  return html`
    <div class="wrap wrap--narrow" style="padding-bottom:var(--sp-12)">
      ${subHeader(`Commande ${order.id}`, {
        back: '#/',
        action: '<button type="button" class="btn btn--ghost btn--sm" data-act="share-order">Partager</button>',
      })}

      <div class="stack" style="gap:var(--sp-5)">
        <article class="card card--pad stack-sm" style="border-top:3px solid ${done ? 'var(--success)' : 'var(--primary)'}">
          <div class="between">
            <span class="badge ${done ? 'badge--success' : 'badge--primary'}">
              ${done ? '✓' : '●'} ${steps[current].label}
            </span>
            <span class="tiny dim">${order.slot}</span>
          </div>
          <h2 style="font-size:26px">${done ? 'Bon appétit !' : `Prête dans ${duration(order.eta - current * 6)}`}</h2>
          <p class="tiny muted">${steps[current].hint} · ${r.name}</p>
        </article>

        ${isDelivery && current >= steps.findIndex((s) => s.id === 'delivering')
          ? html`<div class="map-canvas" id="track-map" style="height:220px" role="img" aria-label="Position du livreur"></div>`
          : ''}

        <article class="card card--pad">
          <div class="timeline">
            ${steps.map(
              (s, i) => html`
              <div class="timeline__item ${i < current ? 'is-done' : ''} ${i === current ? 'is-current' : ''}">
                <div class="timeline__rail">
                  <span class="timeline__dot" aria-hidden="true">${i < current ? '✓' : s.icon}</span>
                  ${i < steps.length - 1 ? html`<span class="timeline__line"></span>` : ''}
                </div>
                <div class="timeline__body">
                  <p class="timeline__label">${s.label}</p>
                  <p class="timeline__hint">${i <= current ? s.hint : 'À venir'}</p>
                </div>
              </div>`
            )}
          </div>
        </article>

        <div class="row" style="gap:var(--sp-2)">
          <a class="btn btn--outline" style="flex:1" href="tel:+33143551208">${raw(icon('phone', { size: 17 }))} Appeler le restaurant</a>
          ${!done ? html`<button type="button" class="btn btn--ghost" data-act="advance-track">Étape suivante</button>` : ''}
        </div>

        <article class="card card--pad stack-sm">
          <h2 class="card__title">Récapitulatif</h2>
          ${order.lines.map(
            (l) => html`<div class="summary__row">
              <span><span class="num dim">${l.qty}×</span> ${l.name}</span>
              <span class="num">${money(l.unit * l.qty)}</span>
            </div>`
          )}
          <div class="summary__row summary__row--total"><span>Total</span><span class="num">${money(order.total)}</span></div>
          <p class="tiny dim">${order.modeLabel} · ${order.address} · ${order.paymentLabel}</p>
        </article>

        ${done
          ? html`<article class="card card--pad stack-sm" style="border-top:3px solid var(--accent)">
              <strong>Comment s’est passée votre commande ?</strong>
              <div class="row" style="gap:var(--sp-2)">
                ${[1, 2, 3, 4, 5].map((n) => html`<button type="button" class="btn btn--outline btn--icon" data-act="rate" data-value="${n}" aria-label="${n} étoile${n > 1 ? 's' : ''}">★</button>`)}
              </div>
            </article>`
          : ''}
      </div>
    </div>`;
}

export function mount(ctx) {
  const container = document.getElementById('track-map');
  handle?.destroy();
  handle = null;
  if (!container) return;

  const order = ctx.state.lastOrder;
  const r = getRestaurant(order.restId);
  const dest = [48.8557, 2.3776];
  const ratio = Math.min(1, Math.max(0.15, (ctx.state.trackStep - 2) / 3));
  const courier = interpolate([r.lat, r.lng], dest, ratio);

  handle = createMap(container, { center: courier, zoom: 14, interactive: false });
  if (!handle) return;
  handle.setMarkers([
    { id: 'resto', lat: r.lat, lng: r.lng, name: r.name, label: '🍽️' },
    { id: 'courier', lat: courier[0], lng: courier[1], name: 'Livreur', label: '🛵' },
    { id: 'dest', lat: dest[0], lng: dest[1], name: 'Vous', label: '📍' },
  ]);
  handle.fit([{ lat: r.lat, lng: r.lng }, { lat: dest[0], lng: dest[1] }], 40);
  handle.invalidate();
}

export function unmount() {
  handle?.destroy();
  handle = null;
}
