/**
 * A2 — Vue carte (Leaflet)
 * Mobile : carte plein écran + fiche dépliable au tap sur un marqueur.
 * Desktop : liste à gauche, carte à droite, surbrillance croisée.
 *
 * La sélection d'un marqueur ne passe volontairement PAS par un rendu complet
 * de l'application : cela détruirait et recréerait l'instance Leaflet à chaque
 * clic (carte qui clignote et se recadre). On met donc à jour, à la main, les
 * seuls fragments concernés — marqueurs, fiche flottante et liste latérale.
 */

import { html, raw, render } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { rating, number, distance, deliveryFee, money } from '../../core/format.js';
import { getRestaurant, MODE_LABELS, MODE_ICONS } from '../../data/restaurants.js';
import { createMap } from '../../core/map.js';
import { ADDRESSES } from '../../data/client.js';
import { restoRow } from '../components.js';
import { selectRestaurants } from './home.js';

let handle = null;

export function view(ctx) {
  const { state } = ctx;
  const list = selectRestaurants(state);

  return html`
    <div class="map-split">
      <aside class="map-split__list desktop-only" aria-label="Restaurants affichés sur la carte">
        <p class="eyebrow" style="padding:var(--sp-2)">${number(list.length)} adresses · ${state.address}</p>
        <div id="map-list">
          ${list.map((r) => restoRow(r, { act: 'peek', active: r.id === state.mapSelected }))}
        </div>
      </aside>

      <div class="map-stage">
        <div class="map-canvas map-canvas--full" id="client-map" role="application" aria-label="Carte des restaurants"></div>

        <div class="map-tools map-tools--top">
          <a class="btn btn--sm" href="#/">${raw(icon('list', { size: 16 }))} Liste</a>
          <button type="button" class="btn btn--sm" data-act="search-here">
            Rechercher <span class="mobile-only">ici</span><span class="desktop-only">dans cette zone</span>
          </button>
          <button type="button" class="btn btn--sm btn--icon" data-act="recenter" aria-label="Recentrer sur ma position">
            ${raw(icon('pin', { size: 16 }))}
          </button>
        </div>

        <div id="map-peek" aria-live="polite"></div>
      </div>
    </div>`;
}

/* ------------------------------------------------------------ Fiche flottante */

function peekCard(r) {
  return html`
    <article class="map-peek">
      <button type="button" class="map-peek__close" data-act="close-peek" aria-label="Fermer la fiche">
        ${raw(icon('x', { size: 16 }))}
      </button>

      <div class="map-peek__head">
        <span class="thumb map-peek__media" style="--tint:${r.tint}"></span>
        <div class="map-peek__id">
          <h2 class="map-peek__name">${r.name}</h2>
          <p class="tiny dim">${r.cuisine}</p>
          <p class="row" style="gap:6px;font-size:var(--fs-sm)">
            <span class="stars" aria-hidden="true">★</span>
            <strong class="num">${rating(r.rating)}</strong>
            <span class="dim">(${number(r.reviews)} avis)</span>
          </p>
        </div>
      </div>

      <dl class="map-peek__facts">
        <div><dt>Distance</dt><dd class="num">${distance(r.distance)}</dd></div>
        <div><dt>Délai</dt><dd class="num">${r.eta} min</dd></div>
        <div><dt>Livraison</dt><dd class="num">${r.fee ? money(r.fee) : 'Offerte'}</dd></div>
        <div><dt>Minimum</dt><dd class="num">${money(r.minOrder)}</dd></div>
      </dl>

      <div class="row-wrap" style="gap:6px">
        ${r.open
          ? html`<span class="badge badge--success"><span class="badge__dot"></span>Ouvert</span>`
          : html`<span class="badge badge--danger">✕ ${r.hours}</span>`}
        ${r.promo ? html`<span class="badge badge--accent">${r.promo}</span>` : ''}
        ${r.modes.map((m) => html`<span class="badge badge--outline">${MODE_ICONS[m]} ${MODE_LABELS[m]}</span>`)}
      </div>

      <a class="btn btn--primary btn--block" href="#/r/${r.id}">
        Voir la carte de ${r.name} ${raw(icon('arrowRight', { size: 16 }))}
      </a>
    </article>`;
}

/* ------------------------------------------------------------- Mise à jour */

function drawMarkers(ctx, list, activeId) {
  handle?.setMarkers(
    list.map((r) => ({
      id: r.id, lat: r.lat, lng: r.lng, name: r.name,
      label: r.open ? rating(r.rating) : '✕',
      closed: !r.open,
    })),
    { activeId, onSelect: (id) => select(ctx, id) }
  );
}

function highlightRow(activeId) {
  document.querySelectorAll('#map-list .resto-row').forEach((row) => {
    row.classList.toggle('is-active', row.dataset.id === activeId);
  });
}

/**
 * Sélectionne un restaurant sans redessiner l'application entière.
 * `fly` n'est vrai que depuis la liste latérale : cliquer un marqueur déjà
 * visible ne doit pas déplacer la carte sous le doigt de l'utilisateur.
 */
export function select(ctx, id, { fly = false } = {}) {
  const list = selectRestaurants(ctx.state);
  const r = getRestaurant(id);

  // `silent` : l'état est mémorisé pour un futur rendu, sans en déclencher un.
  ctx.store.set({ mapSelected: id }, { silent: true });

  drawMarkers(ctx, list, id);
  highlightRow(id);
  render('#map-peek', peekCard(r));
  if (fly) handle?.flyTo(r.lat, r.lng, Math.max(handle.map.getZoom(), 14));
}

export function clearSelection(ctx) {
  ctx.store.set({ mapSelected: null }, { silent: true });
  drawMarkers(ctx, selectRestaurants(ctx.state), null);
  highlightRow(null);
  render('#map-peek', '');
}

export function mount(ctx) {
  const container = document.getElementById('client-map');
  if (!container) return;

  handle?.destroy();
  handle = createMap(container, { center: [48.8639, 2.3652], zoom: 13, cluster: true });
  if (!handle) return;

  const list = selectRestaurants(ctx.state);
  const activeId = ctx.state.mapSelected;

  drawMarkers(ctx, list, activeId);
  const me = ADDRESSES.find((a) => a.line === ctx.state.address) || ADDRESSES[0];
  if (me) handle.setUserPosition(me.lat, me.lng, `Vous : ${me.label}`);
  if (list.length) handle.fit(list);
  handle.invalidate();

  // Une fiche déjà ouverte survit à un rendu complet (bascule de thème…).
  if (activeId) {
    highlightRow(activeId);
    render('#map-peek', peekCard(getRestaurant(activeId)));
  }
}

export function unmount() {
  handle?.destroy();
  handle = null;
}

export function recenter() {
  handle?.flyTo(48.8557, 2.3776, 14);
}
