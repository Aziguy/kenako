/**
 * Kenako — vitrine publique
 * Page statique enrichie : restaurants mis en avant tirés des mêmes données
 * que l'espace client, bascule de thème, et ombre de barre au défilement.
 */

import { html, render, delegate } from './core/dom.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { rating, number, distance, deliveryFee } from './core/format.js';
import { RESTAURANTS } from './data/restaurants.js';
import { CMS } from './data/admin.js';

initTheme();

/* --------------------------------------------- Restaurants mis en avant */

const featured = CMS.featured
  .map((name) => RESTAURANTS.find((r) => r.name === name))
  .filter(Boolean);

render('#featured-restaurants', html`
  ${featured.map(
    (r) => html`
    <article class="card card--hover">
      <a class="card--link" href="client.html#/r/${r.id}">
        <div class="thumb" style="--tint:${r.tint};aspect-ratio:16/10;border-radius:0">
          ${r.promo ? html`<span class="thumb__slot" style="align-items:flex-start"><span class="badge badge--accent">${r.promo}</span></span>` : ''}
        </div>
        <div class="card__body stack-sm">
          <div class="between" style="align-items:flex-start">
            <h3 style="font-family:var(--font-display);font-size:19px;font-weight:500">${r.name}</h3>
            <span class="row" style="gap:4px;flex-shrink:0">
              <span class="stars" aria-hidden="true">★</span>
              <span class="num strong">${rating(r.rating)}</span>
            </span>
          </div>
          <p class="tiny dim">${r.cuisine} · ${distance(r.distance)} · ${r.eta} min</p>
          <p class="tiny">${deliveryFee(r.fee)} · ${number(r.reviews)} avis</p>
        </div>
      </a>
    </article>`
  )}
`);

/* --------------------------------------------------------- Interactions */

delegate(document.body, 'click', {
  'toggle-theme': () => toggleTheme(),
});

const nav = document.querySelector('.lp-nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* Année courante dans le pied de page. */
const year = document.getElementById('year');
if (year) year.textContent = String(new Date().getFullYear());
