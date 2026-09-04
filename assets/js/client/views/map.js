/**
 * A2 — Vue carte (Leaflet)
 * Mobile : carte plein écran + fiche dépliable au tap sur un marqueur.
 * Desktop : liste à gauche, carte à droite, surbrillance croisée au survol.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { rating, distance, deliveryFee, money } from '../../core/format.js';
import { getRestaurant } from '../../data/restaurants.js';
import { createMap } from '../../core/map.js';
import { restoRow } from '../components.js';
import { selectRestaurants } from './home.js';

let handle = null;

export function view(ctx) {
  const { state } = ctx;
  const list = selectRestaurants(state);
  const selected = state.mapSelected ? getRestaurant(state.mapSelected) : null;

  return html`
    <div class="map-split">
      <aside class="map-split__list desktop-only" aria-label="Restaurants affichés sur la carte">
        <p class="eyebrow" style="padding:var(--sp-2)">${list.length} adresses · ${state.address}</p>
        ${list.map((r) => restoRow(r, { hover: r.id === state.mapSelected }))}
      </aside>

      <div style="position:relative">
        <div class="map-canvas map-canvas--full" id="client-map" role="application" aria-label="Carte des restaurants"></div>

        <div class="map-tools map-tools--top">
          <a class="btn btn--sm" href="#/">${raw(icon('list', { size: 16 }))} Liste</a>
          <button type="button" class="btn btn--sm" data-act="search-here">Rechercher dans cette zone</button>
          <button type="button" class="btn btn--sm btn--icon" data-act="recenter" aria-label="Recentrer sur ma position">
            ${raw(icon('pin', { size: 16 }))}
          </button>
        </div>

        ${selected
          ? html`
            <article class="map-peek mobile-only">
              <a class="resto-row" href="#/r/${selected.id}">
                <span class="thumb resto-row__media" style="--tint:${selected.tint}"></span>
                <span style="display:grid;gap:3px;min-width:0">
                  <span class="strong truncate">${selected.name}</span>
                  <span class="tiny dim truncate">${selected.cuisine} · ${distance(selected.distance)} · ${selected.eta} min</span>
                  <span class="row" style="gap:6px">
                    <span class="stars" aria-hidden="true">★</span>
                    <span class="tiny num strong">${rating(selected.rating)}</span>
                    <span class="tiny dim">${deliveryFee(selected.fee)} · min. ${money(selected.minOrder)}</span>
                  </span>
                </span>
              </a>
            </article>`
          : ''}
      </div>
    </div>`;
}

export function mount(ctx) {
  const { state, store } = ctx;
  const container = document.getElementById('client-map');
  if (!container) return;

  handle?.destroy();
  handle = createMap(container, { center: [48.8639, 2.3652], zoom: 13 });
  if (!handle) return;

  const list = selectRestaurants(state);
  handle.setMarkers(
    list.map((r) => ({
      id: r.id, lat: r.lat, lng: r.lng, name: r.name,
      label: r.open ? rating(r.rating) : '✕',
      closed: !r.open,
    })),
    {
      activeId: state.mapSelected,
      onSelect: (id) => store.set({ mapSelected: id }),
    }
  );
  if (list.length) handle.fit(list);
  handle.invalidate();
}

export function unmount() {
  handle?.destroy();
  handle = null;
}

export function recenter() {
  handle?.flyTo(48.8557, 2.3776, 14);
}
