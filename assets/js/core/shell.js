/**
 * Kenako — fragments de coque partagés par les trois espaces
 * Barre haute, navigation basse (mobile), colonne latérale (back-office)
 * et sélecteur d'espace du prototype.
 */

import { html, raw, esc } from './dom.js';
import { icon } from './icons.js';

export const SPACES = [
  { id: 'landing', label: 'Vitrine', href: 'index.html', icon: 'sparkle' },
  { id: 'client', label: 'Client', href: 'client.html', icon: 'compass' },
  { id: 'resto', label: 'Restaurateur', href: 'restaurateur.html', icon: 'chef' },
  { id: 'courier', label: 'Livreur', href: 'livreur.html', icon: 'truck' },
  { id: 'admin', label: 'Superadmin', href: 'superadmin.html', icon: 'shield' },
  { id: 'ds', label: 'Design System', href: 'design-system.html', icon: 'layout' },
];

/**
 * Marque Kenako : monogramme + nom + ligne secondaire.
 * Le carré s'aligne sur la hauteur du texte (voir `.brand` dans layout.css).
 */
export function brandMark(label = 'Kenako', sub = '') {
  return html`
    <span class="logo-mark" aria-hidden="true">K</span>
    <span class="brand__text">
      <span class="brand__name">${label}</span>
      ${sub ? html`<span class="brand__sub">${sub}</span>` : ''}
    </span>`;
}

/** Bouton de bascule clair / sombre. */
export function themeButton() {
  return raw(`<button type="button" class="btn btn--ghost btn--icon btn--sm hint" data-hint="Thème clair / sombre"
      data-act="toggle-theme" aria-label="Basculer le thème clair ou sombre">
      <span class="theme-icon-light">${icon('moon', { size: 18 })}</span>
      <span class="theme-icon-dark">${icon('sun', { size: 18 })}</span>
    </button>`);
}

/**
 * Sélecteur d'espace : présent dans les trois applications pour naviguer
 * entre les parcours du prototype sans repasser par la vitrine.
 */
export function spaceSwitcher(activeId) {
  return raw(`<div class="space-switcher">
    <button type="button" class="btn btn--ghost btn--sm" data-act="open-spaces" aria-haspopup="dialog">
      ${icon('grid', { size: 18 })}<span class="desktop-only">Espaces</span>
    </button>
  </div>`);
}

export function spaceSwitcherSheet(activeId) {
  return `<div class="navsheet">
    ${SPACES.map(
      (s) => `<a class="navsheet__item${s.id === activeId ? ' is-active' : ''}" href="${s.href}">
        ${icon(s.icon, { size: 22 })}<span>${esc(s.label)}</span>
      </a>`
    ).join('')}
  </div>`;
}

/**
 * Navigation basse (mobile).
 * @param {Array<{id,label,icon,href,badge?,badgeTone?}>} items
 */
export function bottomNav(items, activeId) {
  return raw(`<nav class="bottomnav" aria-label="Navigation principale">
    ${items
      .map((item) => {
        const active = item.id === activeId;
        const inner = `${icon(item.icon, { size: 22 })}
          <span>${esc(item.label)}</span>
          ${item.badge ? `<span class="bottomnav__dot${item.badgeTone === 'accent' ? ' bottomnav__dot--accent' : ''}">${esc(item.badge)}</span>` : ''}`;
        // Un onglet peut ouvrir une feuille (« Plus ») au lieu de naviguer.
        return item.act
          ? `<button type="button" class="bottomnav__item" data-act="${esc(item.act)}">${inner}</button>`
          : `<a class="bottomnav__item${active ? ' is-active' : ''}" href="${item.href}"${active ? ' aria-current="page"' : ''}>${inner}</a>`;
      })
      .join('')}
  </nav>`);
}

/**
 * Colonne latérale du back-office.
 * @param {{title, role, groups: Array<{label, items: Array}>, activeId, foot?}} config
 */
export function sidebar({ title, role, groups, activeId, foot = '' }) {
  return raw(`<aside class="sidebar" aria-label="Navigation">
    <a class="sidebar__brand" href="index.html">
      <span class="logo-mark" aria-hidden="true">K</span>
      <span class="brand__text">
        <span class="brand__name" style="font-size:17px">${esc(title)}</span>
        <span class="brand__sub">${esc(role)}</span>
      </span>
    </a>
    ${groups
      .map(
        (group) => `
      ${group.label ? `<div class="sidebar__group">${esc(group.label)}</div>` : ''}
      ${group.items
        .map((item) => {
          const active = item.id === activeId;
          return `<a class="sidebar__link${active ? ' is-active' : ''}" href="${item.href}"${active ? ' aria-current="page"' : ''}>
            ${icon(item.icon, { size: 18 })}<span class="truncate">${esc(item.label)}</span>
            ${item.badge ? `<span class="badge badge--${item.badgeTone || 'primary'} sidebar__badge">${esc(item.badge)}</span>` : ''}
          </a>`;
        })
        .join('')}`
      )
      .join('')}
    <div class="sidebar__foot">${foot}</div>
  </aside>`);
}

/** Barre d'outils dense du back-office (mobile : sert aussi de barre haute). */
export function toolbar({ title, sub = '', actions = '', back = null }) {
  return raw(`<header class="toolbar">
    ${back ? `<a class="btn btn--ghost btn--icon btn--sm" href="${back}" aria-label="Retour">${icon('arrowLeft', { size: 18 })}</a>` : ''}
    <div style="min-width:0">
      <div class="toolbar__title truncate">${esc(title)}</div>
      ${sub ? `<div class="tiny dim truncate">${esc(sub)}</div>` : ''}
    </div>
    <div class="toolbar__actions">${actions}</div>
  </header>`);
}

/** Bandeau « prototype » discret, rappelant la nature de la démonstration. */
export function protoNote(text) {
  return raw(`<p class="proto-note">${icon('sparkle', { size: 14 })}<span>${esc(text)}</span></p>`);
}
