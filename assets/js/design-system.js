/**
 * Kenako — planche Design System
 * Rend les inventaires générés (icônes, jetons de couleur) et branche les
 * démonstrations interactives (toasts, feuilles, états de chargement).
 */

import { render, html, raw, delegate } from './core/dom.js';
import { icon, iconNames } from './core/icons.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { toast } from './core/toast.js';
import { openModal } from './core/sheet.js';

initTheme();

/* --------------------------------------------------------------- Palette */

const SWATCHES = [
  { token: '--primary', name: 'Paprika', role: 'Action principale, liens', ink: '#fff' },
  { token: '--primary-strong', name: 'Paprika grillé', role: 'Survol, texte sur fond clair', ink: '#fff' },
  { token: '--primary-soft', name: 'Paprika pâle', role: 'Fond d’état sélectionné', ink: 'var(--ink)' },
  { token: '--accent', name: 'Safran', role: 'CTA de conversion, badges promo', ink: 'var(--accent-ink)' },
  { token: '--herb', name: 'Basilic', role: 'Donnée, second niveau, succès', ink: '#fff' },
  { token: '--danger', name: 'Piment', role: 'Erreur, refus, rupture', ink: '#fff' },
  { token: '--warning', name: 'Miel', role: 'Avertissement, en attente', ink: '#fff' },
  { token: '--info', name: 'Ardoise', role: 'Information neutre', ink: '#fff' },
  { token: '--bg', name: 'Crème', role: 'Fond de page', ink: 'var(--ink)' },
  { token: '--surface', name: 'Surface', role: 'Cartes, panneaux', ink: 'var(--ink)' },
  { token: '--surface-2', name: 'Sable', role: 'Fond secondaire, champs inertes', ink: 'var(--ink)' },
  { token: '--ink', name: 'Encre', role: 'Texte principal', ink: 'var(--bg)' },
];

render('#palette', html`
  ${SWATCHES.map(
    (s) => html`
    <article style="border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow-sm);background:var(--surface)">
      <div style="height:96px;background:var(${s.token});display:flex;align-items:flex-end;padding:var(--sp-3);color:${s.ink}">
        <strong style="font-size:var(--fs-sm)">${s.name}</strong>
      </div>
      <div style="padding:var(--sp-3);display:grid;gap:2px">
        <code class="num tiny">${s.token}</code>
        <span class="tiny dim">${s.role}</span>
      </div>
    </article>`
  )}
`);

/* ---------------------------------------------------------------- Icônes */

render('#icon-grid', html`
  ${iconNames.map(
    (name) => html`
    <div style="display:grid;justify-items:center;gap:6px;padding:var(--sp-3);border:1px solid var(--line);border-radius:var(--r-md)">
      ${raw(icon(name, { size: 22 }))}
      <span class="tiny dim" style="font-size:10px">${name}</span>
    </div>`
  )}
`);

/* ------------------------------------------------------------- Démonstrations */

delegate(document.body, 'click', {
  'toggle-theme': () => toggleTheme(),
  'demo-toast': ({ tone }) => {
    const messages = {
      success: 'Bavette d’aloyau ajoutée au panier',
      warning: 'Île flottante n’est plus disponible aujourd’hui',
      danger: 'Paiement refusé par la banque',
      info: 'Carte recentrée sur votre adresse',
    };
    toast(messages[tone], { tone, action: tone === 'success' ? 'Voir le panier' : undefined });
  },
  'demo-sheet': () => openModal({
    title: '<span class="eyebrow">Plats</span><h2 style="font-size:22px">Bavette d’aloyau</h2>',
    body: `<div class="stack">
      <div class="thumb" style="--tint:var(--primary);aspect-ratio:16/9"></div>
      <p class="muted">Bœuf de race Limousine, échalotes confites, frites coupées à la main.</p>
      <div class="stack-sm">
        <button type="button" class="option" role="radio" aria-checked="true">
          <span class="option__mark">${icon('check', { size: 12, stroke: 3 })}</span><span>200 g</span>
          <span class="option__price">inclus</span></button>
        <button type="button" class="option" role="radio" aria-checked="false">
          <span class="option__mark"></span><span>300 g</span><span class="option__price">+ 6,00 €</span></button>
      </div>
    </div>`,
    foot: `<button type="button" class="btn btn--accent btn--block" data-act="sheet-close">Ajouter · 19,00 €</button>`,
  }),
  'demo-loading': (data, event, el) => {
    el.classList.add('is-loading');
    el.disabled = true;
    setTimeout(() => { el.classList.remove('is-loading'); el.disabled = false; }, 1600);
  },
  'demo-switch': (data, event, el) => {
    const on = el.getAttribute('aria-checked') === 'true';
    el.setAttribute('aria-checked', String(!on));
  },
  'demo-chip': (data, event, el) => {
    const on = el.getAttribute('aria-pressed') === 'true';
    el.setAttribute('aria-pressed', String(!on));
  },
  'demo-tab': (data, event, el) => {
    el.parentElement.querySelectorAll('.tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
    el.setAttribute('aria-selected', 'true');
  },
});
