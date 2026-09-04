/**
 * A3 — Fiche restaurant
 * En-tête immersif, onglets Menu · Infos · Avis · Événements,
 * navigation par catégories collante et barre de panier persistante.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, rating, number, distance, deliveryFee } from '../../core/format.js';
import { getRestaurant, MODE_LABELS, MODE_ICONS, PAYMENT_LABELS } from '../../data/restaurants.js';
import { MENUS, COMBOS } from '../../data/menus.js';
import { REVIEWS, EVENTS } from '../../data/client.js';
import { dishRow, reviewCard, openBadge, emptyState } from '../components.js';

const TABS = [
  { id: 'menu', label: 'Menu' },
  { id: 'infos', label: 'Infos' },
  { id: 'avis', label: 'Avis' },
  { id: 'events', label: 'Événements' },
];

export function view(ctx) {
  const { state } = ctx;
  const r = getRestaurant(state.restId);
  const tab = state.restTab || 'menu';
  const favorite = state.favorites.includes(r.id);

  return html`
    <div class="hero-resto">
      <div class="thumb hero-resto__cover" style="--tint:${r.tint};border-radius:0"></div>
      <a class="hero-resto__back" href="#/" aria-label="Retour à la découverte">${raw(icon('arrowLeft', { size: 18 }))}</a>
      <div class="hero-resto__tools">
        <button type="button" class="hero-resto__back" style="position:static" data-act="share" data-id="${r.id}" aria-label="Partager">
          ${raw(icon('share', { size: 17 }))}
        </button>
        <button type="button" class="hero-resto__back" style="position:static;${favorite ? 'color:var(--primary)' : ''}"
          data-act="fav" data-id="${r.id}" aria-pressed="${favorite}" aria-label="${favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
          ${raw(icon('heart', { size: 17 }))}
        </button>
      </div>

      <div class="hero-resto__card">
        <div class="row-wrap" style="gap:var(--sp-2)">
          ${openBadge(r)}
          <span class="badge badge--outline">${r.hours}</span>
          ${r.promo ? html`<span class="badge badge--accent">${r.promo}</span>` : ''}
        </div>
        <h1 class="hero-resto__title">${r.name}</h1>
        <p class="muted tiny">${r.cuisine} · ${r.address}</p>
        <div class="row-wrap" style="gap:var(--sp-4);font-size:var(--fs-sm)">
          <span class="row" style="gap:5px">
            <span class="stars" aria-hidden="true">★</span>
            <strong class="num">${rating(r.rating)}</strong>
            <span class="dim">(${number(r.reviews)} avis)</span>
          </span>
          <span class="row" style="gap:5px">${raw(icon('pin', { size: 15 }))} ${distance(r.distance)}</span>
          <span class="row" style="gap:5px">${raw(icon('clock', { size: 15 }))} ${r.eta} min</span>
          <span class="row" style="gap:5px">${raw(icon('truck', { size: 15 }))} ${deliveryFee(r.fee)}</span>
        </div>
        <div class="row-wrap" style="gap:6px">
          ${r.badges.map((b) => html`<span class="badge badge--outline badge--lg">${b}</span>`)}
        </div>
        ${!r.open
          ? html`<div class="banner banner--danger">
              <span class="banner__icon" aria-hidden="true">✕</span>
              <span><strong class="banner__title">Ce restaurant est fermé</strong>
              ${r.hours}. Vous pouvez consulter la carte et préparer votre commande pour la réouverture.</span>
            </div>`
          : ''}
      </div>
    </div>

    <div class="wrap" style="padding-top:var(--sp-5)">
      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="rest-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      <div role="tabpanel" style="padding-top:var(--sp-4)">
        ${tab === 'menu' ? menuPanel(r, state) : ''}
        ${tab === 'infos' ? infosPanel(r) : ''}
        ${tab === 'avis' ? reviewsPanel(r) : ''}
        ${tab === 'events' ? eventsPanel(r) : ''}
      </div>
    </div>`;
}

function menuPanel(r, state) {
  const cats = MENUS[r.id] || [];
  const combos = COMBOS[r.id] || [];
  if (!cats.length) {
    return emptyState({ art: '📜', title: 'Carte en cours de publication', text: 'Ce restaurant finalise sa carte. Revenez dans quelques heures.' });
  }

  return html`
    <div class="stack-lg" style="padding-bottom:var(--sp-12)">
      ${combos.length
        ? html`
          <section class="section">
            <h2 class="section__title">Formules</h2>
            <div class="grid grid--cards">
              ${combos.map(
                (c) => html`
                <article class="card card--pad stack-sm" style="border-left:3px solid var(--accent)">
                  <div class="between">
                    <strong>${c.name}</strong>
                    <span class="badge badge--accent">−${money(c.saving)}</span>
                  </div>
                  <p class="tiny muted">${c.desc}</p>
                  <div class="between">
                    <span class="num" style="font-size:var(--fs-lg);font-weight:700">${money(c.price)}</span>
                    <button type="button" class="btn btn--sm btn--primary" data-act="add-combo" data-id="${c.id}" data-rest="${r.id}">Ajouter</button>
                  </div>
                </article>`
              )}
            </div>
          </section>`
        : ''}

      <nav class="cat-nav scroll-x" aria-label="Catégories de la carte">
        ${cats.map((c) => html`<a class="chip" href="#cat-${slug(c.cat)}">${c.cat}</a>`)}
      </nav>

      ${cats.map(
        (c) => html`
        <section class="section" id="cat-${slug(c.cat)}">
          <h2 class="section__title">${c.cat}</h2>
          <div class="divider-list">
            ${c.items.map((d) => dishRow(d, r))}
          </div>
        </section>`
      )}
    </div>`;
}

function infosPanel(r) {
  return html`
    <div class="grid grid--2" style="padding-bottom:var(--sp-8)">
      <article class="card card--pad stack-sm">
        <h3 class="card__title">L'adresse</h3>
        <p class="tiny muted" style="line-height:1.6">${r.story}</p>
        <dl class="kv" style="margin-top:var(--sp-2)">
          <dt>Adresse</dt><dd>${r.address}</dd>
          <dt>Horaires</dt><dd>${r.hours}</dd>
          <dt>Cuisine</dt><dd>${r.cuisine}</dd>
        </dl>
        <a class="btn btn--outline btn--sm" href="#/carte">${raw(icon('map', { size: 16 }))} Voir sur la carte</a>
      </article>

      <article class="card card--pad stack-sm">
        <h3 class="card__title">Commander</h3>
        <div class="row-wrap">
          ${r.modes.map((m) => html`<span class="badge badge--outline badge--lg">${MODE_ICONS[m]} ${MODE_LABELS[m]}</span>`)}
        </div>
        <p class="tiny muted" style="line-height:1.6">
          Minimum de commande ${money(r.minOrder)} · ${deliveryFee(r.fee)}<br>
          Délai estimé ${r.eta} min · zone de livraison 3 km
        </p>
      </article>

      <article class="card card--pad stack-sm">
        <h3 class="card__title">Paiement accepté</h3>
        <div class="row-wrap">
          ${r.payments.map((p) => html`<span class="badge badge--outline badge--lg">${PAYMENT_LABELS[p]}</span>`)}
        </div>
        <p class="tiny dim">Le paiement va directement au restaurant. Kenako ne prend aucune commission sur votre commande.</p>
      </article>

      <article class="card card--pad stack-sm">
        <h3 class="card__title">Fidélité & parrainage</h3>
        <dl class="kv">
          <dt>Programme</dt><dd>${r.loyalty.rate}</dd>
          <dt>Récompense</dt><dd>${r.loyalty.reward}</dd>
          <dt>Parrain</dt><dd>${r.referral.sponsor}</dd>
          <dt>Filleul</dt><dd>${r.referral.friend}</dd>
        </dl>
        <p class="tiny dim">Programme défini et financé par ${r.name}.</p>
      </article>
    </div>`;
}

function reviewsPanel(r) {
  const list = REVIEWS[r.id] || [];
  const buckets = [5, 4, 3, 2, 1].map((n) => ({ n, count: list.filter((x) => x.rating === n).length }));
  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return html`
    <div class="grid grid--sidebar" style="padding-bottom:var(--sp-8);gap:var(--sp-5)">
      <div class="stack">
        ${list.length
          ? list.map((rv) => reviewCard(rv))
          : emptyState({ art: '💬', title: 'Pas encore d’avis', text: 'Soyez le premier à donner votre avis après votre commande.' })}
      </div>
      <aside class="card card--pad stack-sm" style="align-self:start">
        <div class="row" style="gap:var(--sp-3)">
          <span class="num" style="font-size:40px;font-weight:700;line-height:1">${rating(r.rating)}</span>
          <div style="display:grid">
            <span class="stars" aria-hidden="true">★★★★★</span>
            <span class="tiny dim">${number(r.reviews)} avis</span>
          </div>
        </div>
        ${buckets.map(
          (b) => html`
          <div class="row" style="gap:var(--sp-2);font-size:var(--fs-sm)">
            <span class="num dim" style="width:12px">${b.n}</span>
            <div class="progress" style="flex:1;height:6px">
              <div class="progress--accent progress__bar" style="width:${(b.count / maxCount) * 100}%;background:var(--accent)"></div>
            </div>
            <span class="num dim" style="width:18px;text-align:right">${b.count}</span>
          </div>`
        )}
      </aside>
    </div>`;
}

function eventsPanel(r) {
  const list = EVENTS[r.id] || [];
  if (!list.length) {
    return emptyState({ art: '🎉', title: 'Aucun événement prévu', text: 'Ce restaurant n’a rien programmé pour le moment. Ajoutez-le en favori pour être prévenu.' });
  }
  return html`
    <div class="grid grid--cards" style="padding-bottom:var(--sp-8)">
      ${list.map(
        (ev) => html`
        <article class="card card--hover">
          <div class="thumb" style="--tint:${r.tint};aspect-ratio:16/9;border-radius:0">
            <span class="thumb__label">${ev.date}</span>
          </div>
          <div class="card__body stack-sm">
            <h3 class="card__title">${ev.title}</h3>
            <p class="tiny muted">${ev.desc}</p>
            <div class="between">
              <span class="num strong">${ev.price ? money(ev.price) : 'Entrée libre'}</span>
              <span class="badge ${ev.left <= 12 ? 'badge--warning' : 'badge--success'}">${ev.seats}</span>
            </div>
            <button type="button" class="btn btn--primary btn--block" data-act="book-event" data-title="${ev.title}">
              ${ev.price ? 'Réserver ma place' : 'Réserver'}
            </button>
          </div>
        </article>`
      )}
    </div>`;
}

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
