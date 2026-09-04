/**
 * Kenako — vitrine publique
 * Page statique enrichie : restaurants mis en avant tirés des mêmes données
 * que l'espace client, bascule de thème, et ombre de barre au défilement.
 */

import { html, render, delegate } from './core/dom.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { rating, number, distance, deliveryFee } from './core/format.js';
import { openModal } from './core/sheet.js';
import { icon } from './core/icons.js';
import { SPACES } from './core/shell.js';
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

/* ------------------------------------------------- Menu de navigation mobile */

const SECTIONS = [
  { href: '#produit', label: 'Le produit', hint: 'Zéro commission, comment ça marche' },
  { href: '#restaurants', label: 'Restaurants', hint: 'Les adresses mises en avant' },
  { href: '#tarifs', label: 'Tarifs', hint: 'Devenir partenaire' },
  { href: '#prototype', label: 'Le prototype', hint: 'Les cinq espaces à explorer' },
];

function menuBody() {
  const sections = SECTIONS.map(
    (s) => `<a class="option" href="${s.href}" data-act="sheet-close">
      <span style="display:grid;gap:2px;flex:1;min-width:0">
        <span class="strong tiny">${s.label}</span>
        <span class="tiny dim">${s.hint}</span>
      </span>
      <span class="dim" style="display:grid">${icon('chevronRight', { size: 16 })}</span>
    </a>`
  ).join('');

  const spaces = SPACES.filter((s) => s.id !== 'landing')
    .map((s) => `<a class="navsheet__item" href="${s.href}">${icon(s.icon, { size: 22 })}<span>${s.label}</span></a>`)
    .join('');

  return `
    <div class="stack-sm">
      <p class="eyebrow">Le site</p>
      ${sections}
    </div>
    <div class="stack-sm">
      <p class="eyebrow">Les espaces du prototype</p>
      <div class="navsheet">${spaces}</div>
    </div>
    <div class="stack-sm">
      <p class="eyebrow">Apparence</p>
      <button type="button" class="option" data-act="toggle-theme">
        <span class="option__mark" style="border:0;background:transparent;color:var(--ink)">
          <span class="theme-icon-light">${icon('moon', { size: 16 })}</span>
          <span class="theme-icon-dark">${icon('sun', { size: 16 })}</span>
        </span>
        <span class="tiny strong">Basculer le thème clair / sombre</span>
      </button>
    </div>`;
}

/* --------------------------------------------------------- Interactions */

delegate(document.body, 'click', {
  'toggle-theme': () => toggleTheme(),
  'open-menu': () => openModal({
    title: '<h2 style="font-size:20px">Menu</h2>',
    body: menuBody(),
    foot: '<a class="btn btn--accent btn--block" href="client.html">Découvrir les restaurants</a>',
  }),
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
