/**
 * A1 — Accueil / découverte
 * Recherche d'adresse, filtres horizontaux, tri, sections éditoriales.
 */

import { html, raw, esc } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { fold, number } from '../../core/format.js';
import { RESTAURANTS, FILTERS, SORTS, CUISINES } from '../../data/restaurants.js';
import { restoCard, cardSkeletons, emptyState } from '../components.js';

/** Applique recherche, filtres et tri. */
export function selectRestaurants(state) {
  const query = fold(state.query || '');
  let list = RESTAURANTS.filter((r) => {
    if (query && !fold(`${r.name} ${r.cuisine} ${r.badges.join(' ')}`).includes(query)) return false;
    return state.filters.every((id) => FILTERS.find((f) => f.id === id)?.test(r) ?? true);
  });

  const sorters = {
    reco: (a, b) => Number(b.boosted) - Number(a.boosted) || b.rating - a.rating,
    rating: (a, b) => b.rating - a.rating,
    distance: (a, b) => a.distance - b.distance,
    eta: (a, b) => a.etaMin - b.etaMin,
    fee: (a, b) => a.fee - b.fee,
  };
  list = [...list].sort(sorters[state.sort] || sorters.reco);
  return list;
}

function sections(list, state) {
  const around = [...list].sort((a, b) => a.distance - b.distance).slice(0, 6);
  const fresh = list.filter((r) => r.isNew);
  const promos = list.filter((r) => r.promo);
  const best = [...list].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const favorites = list.filter((r) => state.favorites.includes(r.id));

  return [
    favorites.length ? { id: 'fav', title: 'Vos favoris', items: favorites } : null,
    { id: 'around', title: 'Autour de vous', sub: state.address, items: around },
    fresh.length ? { id: 'new', title: 'Nouveaux sur Kenako', items: fresh } : null,
    promos.length ? { id: 'promo', title: 'En promotion', items: promos } : null,
    { id: 'best', title: 'Les mieux notés', items: best },
  ].filter(Boolean);
}

export function view(ctx) {
  const { state } = ctx;
  const list = selectRestaurants(state);

  if (state.loading) {
    return html`<div class="wrap page"><div class="grid grid--cards">${cardSkeletons(6)}</div></div>`;
  }

  return html`
    <div class="wrap">
      <section class="searchbar">
        <h1 class="home-title">Qu'est-ce qui vous ferait plaisir&nbsp;?</h1>
        <div class="searchbar__row">
          <label class="input-group" style="flex:1">
            <span class="sr-only">Rechercher un restaurant ou un plat</span>
            <span class="input-group__icon">${raw(icon('search', { size: 18 }))}</span>
            <input class="input" type="search" placeholder="Un plat, un restaurant, une cuisine…"
              value="${state.query}" data-bind="query" autocomplete="off">
          </label>
          <button type="button" class="btn btn--outline btn--icon desktop-only" data-act="open-sort" aria-label="Trier">
            ${raw(icon('filter', { size: 18 }))}
          </button>
          <a class="btn btn--outline" href="#/carte">${raw(icon('map', { size: 18 }))}<span class="desktop-only">Carte</span></a>
        </div>

        <div class="row" style="gap:var(--sp-2);flex-wrap:wrap">
          <button type="button" class="address-pill" data-act="open-address">
            ${raw(icon('pin', { size: 16 }))}
            <span class="truncate">${state.address}</span>
            ${raw(icon('chevronDown', { size: 14 }))}
          </button>
          <button type="button" class="chip" data-act="open-sort">
            ${raw(icon('filter', { size: 15 }))} ${SORTS.find((s) => s.id === state.sort)?.label}
          </button>
        </div>

        ${state.geoDenied
          ? html`<div class="banner banner--warning">
              <span class="banner__icon" aria-hidden="true">!</span>
              <span><strong class="banner__title">Position non partagée</strong>
              Nous affichons les restaurants autour de l'adresse enregistrée. Vous pouvez la modifier à tout moment.</span>
              <button type="button" class="btn btn--sm btn--ghost" data-act="retry-geo">Réessayer</button>
            </div>`
          : ''}

        <div class="scroll-x" role="group" aria-label="Filtres">
          ${FILTERS.map(
            (f) => html`<button type="button" class="chip" data-act="filter" data-id="${f.id}"
              aria-pressed="${state.filters.includes(f.id)}">${f.label}</button>`
          )}
        </div>

        ${state.filters.length || state.query
          ? html`<p class="tiny dim">${number(list.length)} restaurant${list.length > 1 ? 's' : ''} ·
              <button type="button" class="btn btn--ghost btn--sm" data-act="clear-filters">Tout effacer</button></p>`
          : ''}
      </section>

      ${list.length === 0
        ? emptyState({
            art: '🔍',
            title: 'Aucun restaurant ne correspond',
            text: `Aucune adresse ne correspond à « ${esc(state.query)} » avec ces filtres. Essayez une autre cuisine ou élargissez la recherche.`,
            action: `<div class="row-wrap" style="justify-content:center">
              <button type="button" class="btn btn--primary" data-act="clear-filters">Réinitialiser la recherche</button>
              ${CUISINES.slice(0, 4).map((c) => `<button type="button" class="chip" data-act="suggest" data-q="${esc(c)}">${esc(c)}</button>`).join('')}
            </div>`,
          })
        : html`
          <div class="stack-lg" style="padding-bottom:var(--sp-8)">
            ${sections(list, state).map(
              (sec) => html`
              <section class="section" id="sec-${sec.id}">
                <div class="section__head">
                  <div>
                    <h2 class="section__title">${sec.title}</h2>
                    ${sec.sub ? html`<p class="tiny dim">${sec.sub}</p>` : ''}
                  </div>
                  <span class="tiny dim">${number(sec.items.length)}</span>
                </div>
                <div class="snap-list">
                  ${sec.items.map((r) => restoCard(r, { favorite: state.favorites.includes(r.id) }))}
                </div>
              </section>`
            )}
          </div>`}
    </div>`;
}
