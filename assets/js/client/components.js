/**
 * Kenako — fragments réutilisés par plusieurs écrans clients
 */

import { html, raw } from '../core/dom.js';
import { icon } from '../core/icons.js';
import { money, rating, distance, deliveryFee, number } from '../core/format.js';
import { TAG_LABELS, TAG_TONES } from '../data/menus.js';

/** Étoiles + note + nombre d'avis. */
export function ratingLine(r) {
  return html`
    <span class="row" style="gap:5px">
      <span class="stars" aria-hidden="true">★</span>
      <span class="num strong">${rating(r.rating)}</span>
      <span class="dim tiny">(${number(r.reviews)})</span>
    </span>`;
}

/** Pastille d'état ouvert / fermé — couleur + icône + texte. */
export function openBadge(restaurant) {
  return restaurant.open
    ? html`<span class="badge badge--success"><span class="badge__dot"></span>Ouvert</span>`
    : html`<span class="badge badge--danger">✕ Fermé</span>`;
}

/** Carte restaurant verticale (accueil, favoris). */
export function restoCard(r, { favorite = false, compact = false } = {}) {
  return html`
    <article class="card card--hover resto-card ${r.open ? '' : 'is-closed'}">
      <a class="card--link" href="#/r/${r.id}" aria-label="Voir ${r.name}">
        <div class="thumb resto-card__media" style="--tint:${r.tint}">
          <div class="resto-card__flags">
            ${r.promo ? html`<span class="badge badge--accent">${r.promo}</span>` : ''}
            ${r.isNew ? html`<span class="badge badge--primary">Nouveau</span>` : ''}
            ${r.boosted ? html`<span class="badge badge--outline" style="background:rgba(255,255,255,.86)">${raw(icon('sparkle', { size: 12 }))} Mis en avant</span>` : ''}
          </div>
        </div>
      </a>
      <button type="button" class="resto-card__fav ${favorite ? 'is-on' : ''}"
        data-act="fav" data-id="${r.id}"
        aria-pressed="${favorite}" aria-label="${favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
        ${raw(icon('heart', { size: 18 }))}
      </button>
      <a class="card--link resto-card__body" href="#/r/${r.id}">
        <div class="between" style="align-items:flex-start">
          <h3 class="resto-card__name">${r.name}</h3>
          ${ratingLine(r)}
        </div>
        <p class="resto-card__meta">
          <span>${r.cuisine}</span><span aria-hidden="true">·</span>
          <span>${distance(r.distance)}</span>
          ${compact ? '' : html`<span aria-hidden="true">·</span><span>${r.eta} min</span>`}
        </p>
        <p class="resto-card__meta">
          ${r.open
            ? html`<span class="badge ${r.fee === 0 ? 'badge--success' : ''}">${deliveryFee(r.fee)}</span>`
            : html`<span class="badge badge--danger">✕ ${r.hours}</span>`}
          <span class="dim tiny">Minimum ${money(r.minOrder)}</span>
        </p>
      </a>
    </article>`;
}

/** Rangée horizontale (liste desktop de la vue carte, résultats). */
export function restoRow(r, { hover = false } = {}) {
  return html`
    <a class="resto-row ${hover ? 'is-hover' : ''}" href="#/r/${r.id}" data-act="peek" data-id="${r.id}">
      <span class="thumb resto-row__media" style="--tint:${r.tint}"></span>
      <span style="display:grid;gap:3px;min-width:0">
        <span class="strong truncate">${r.name}</span>
        <span class="tiny dim truncate">${r.cuisine} · ${distance(r.distance)} · ${r.eta} min</span>
        <span class="row" style="gap:6px">
          <span class="stars" aria-hidden="true">★</span>
          <span class="tiny num strong">${rating(r.rating)}</span>
          <span class="tiny dim">${deliveryFee(r.fee)}</span>
        </span>
      </span>
    </a>`;
}

/** Étiquettes de régime / allergène d'un plat. */
export function dishTags(tags = []) {
  return html`${tags.map(
    (t) => html`<span class="badge badge--${TAG_TONES[t] || 'outline'}">${TAG_LABELS[t] || t}</span>`
  )}`;
}

/** Ligne de plat sur la fiche restaurant. */
export function dishRow(dish, restaurant) {
  const soldOut = Boolean(dish.soldOut);
  return html`
    <button type="button" class="dish ${soldOut ? 'is-sold-out' : ''}"
      data-act="${soldOut ? 'sold-out' : 'open-dish'}" data-dish="${dish.id}" data-rest="${restaurant.id}"
      ${soldOut ? raw('aria-disabled="true"') : ''}>
      <span class="dish__body">
        <span class="dish__name">${dish.name}</span>
        <span class="dish__desc clamp-2">${dish.desc}</span>
        <span class="row-wrap" style="gap:6px">
          ${dishTags(dish.tags)}
          ${soldOut ? html`<span class="badge badge--danger">✕ En rupture</span>` : ''}
          ${dish.customizable ? html`<span class="badge badge--outline">Personnalisable</span>` : ''}
        </span>
        <span class="dish__price">${money(dish.price)}</span>
        ${dish.allergens?.length ? html`<span class="tiny dim">Allergènes : ${dish.allergens.join(', ')}</span>` : ''}
      </span>
      <span class="thumb dish__media" style="--tint:${restaurant.tint}">
        ${soldOut ? '' : html`<span class="dish__add">${raw(icon('plus', { size: 18 }))}</span>`}
      </span>
    </button>`;
}

/** Bloc d'avis. */
export function reviewCard(review) {
  return html`
    <article class="card card--pad stack-sm">
      <div class="between">
        <div class="row">
          <span class="avatar">${review.author.slice(0, 1)}</span>
          <span style="display:grid">
            <strong style="font-size:var(--fs-sm)">${review.author}</strong>
            <span class="tiny dim">${review.date}</span>
          </span>
        </div>
        <span class="stars" aria-label="${review.rating} sur 5">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p class="tiny" style="line-height:1.55;color:var(--ink-2)">${review.text}</p>
      ${review.reply
        ? html`<p class="tiny" style="line-height:1.5;background:var(--surface-2);padding:var(--sp-3);border-radius:var(--r-sm)">
            <strong>Réponse du restaurant · </strong>${review.reply}</p>`
        : ''}
    </article>`;
}

/** Squelette de chargement d'une grille de restaurants. */
export function cardSkeletons(count = 6) {
  return html`${Array.from({ length: count }, () => html`
    <div class="card">
      <div class="skeleton skeleton--media" style="border-radius:0"></div>
      <div class="stack-sm" style="padding:var(--sp-4)">
        <div class="skeleton skeleton--title"></div>
        <div class="skeleton skeleton--text" style="width:80%"></div>
        <div class="skeleton skeleton--text" style="width:45%"></div>
      </div>
    </div>`)}`;
}

/** État vide générique. */
export function emptyState({ art = '🍽️', title, text, action = '' }) {
  return html`
    <div class="empty">
      <div class="empty__art" aria-hidden="true">${art}</div>
      <p class="empty__title">${title}</p>
      <p class="empty__text">${text}</p>
      ${raw(action)}
    </div>`;
}

/** En-tête d'écran secondaire avec bouton retour. */
export function subHeader(title, { back = '#/', action = '' } = {}) {
  return html`
    <div class="between" style="padding:var(--sp-4) 0">
      <div class="row" style="min-width:0">
        <a class="btn btn--ghost btn--icon btn--sm" href="${back}" aria-label="Retour">${raw(icon('arrowLeft', { size: 18 }))}</a>
        <h1 class="page__title truncate">${title}</h1>
      </div>
      ${raw(action)}
    </div>`;
}
