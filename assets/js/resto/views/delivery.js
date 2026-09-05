/**
 * B5 — Livraison
 * Modes de service, zones dessinées sur la carte avec leurs propres règles,
 * rayon maximal et gestion des livreurs internes (formule Signature).
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { ZONES, COURIERS, RESTO } from '../../data/resto.js';
import { createMap } from '../../core/map.js';
import { sectionCard } from '../components.js';

let handle = null;

const MODES = [
  { id: 'livraison', label: 'Livraison', hint: 'Par vos livreurs ou par vous-même', icon: 'truck' },
  { id: 'emporter', label: 'À emporter', hint: 'Retrait au comptoir', icon: 'bag' },
  { id: 'surplace', label: 'Sur place', hint: 'Commande à table par QR code', icon: 'table' },
];

export function view(ctx) {
  const { state } = ctx;

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Livraison & retrait</h1>
          <p class="bo-sub">Vos règles, vos zones, vos frais — Kenako ne prélève rien dessus.</p>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-act="new-zone">${raw(icon('plus', { size: 16 }))} Nouvelle zone</button>
      </div>

      ${sectionCard(
        'Modes de service',
        html`<div class="grid grid--3">
          ${MODES.map(
            (m) => html`
            <button type="button" class="option" style="flex-direction:column;align-items:flex-start;gap:6px;min-height:96px"
              role="switch" aria-checked="${state.modes.includes(m.id)}" data-act="toggle-mode" data-id="${m.id}">
              <span class="row" style="gap:var(--sp-2)">
                ${raw(icon(m.icon, { size: 18 }))}<strong>${m.label}</strong>
              </span>
              <span class="tiny dim">${m.hint}</span>
              <span class="badge ${state.modes.includes(m.id) ? 'badge--success' : 'badge--outline'}">
                ${state.modes.includes(m.id) ? '✓ Activé' : '○ Désactivé'}
              </span>
            </button>`
          )}
        </div>`
      )}

      ${state.modes.includes('livraison')
        ? html`
          <div class="grid grid--sidebar">
            ${sectionCard(
              'Zones de livraison',
              html`
                <div class="map-canvas" id="zones-map" style="height:340px" aria-label="Zones de livraison"></div>
                <div class="legend" style="margin-top:var(--sp-3)">
                  ${ZONES.map(
                    (z) => html`<span class="legend__item">
                      <span class="legend__swatch" style="background:${z.color}"></span>${z.name}
                    </span>`
                  )}
                </div>`,
              { sub: 'Rayon maximal 4 km · 3 zones actives', action: '<button type="button" class="btn btn--outline btn--sm" data-act="draw-zone">Dessiner</button>' }
            )}

            <div class="stack">
              ${ZONES.map(
                (z) => html`
                <article class="card card--pad stack-sm">
                  <div class="between">
                    <div class="zone-legend">
                      <span class="zone-swatch" style="background:${z.color}"></span>
                      <strong>${z.name}</strong>
                    </div>
                    <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="edit-zone" data-id="${z.id}"
                      aria-label="Modifier ${z.name}">${raw(icon('edit', { size: 15 }))}</button>
                  </div>
                  <p class="tiny muted">${z.rule}</p>
                  <p class="tiny dim">${raw(icon('clock', { size: 12 }))} Délai estimé ${z.eta}</p>
                </article>`
              )}

              <article class="card card--pad stack-sm">
                <h3 class="card__title">Règles globales</h3>
                <label class="field">
                  <span class="field__label">Rayon maximal</span>
                  <input class="input num" value="4" inputmode="decimal">
                  <span class="field__hint">Kilomètres autour du restaurant</span>
                </label>
                <label class="field">
                  <span class="field__label">Franco de port à partir de</span>
                  <input class="input num" value="25" inputmode="decimal">
                  <span class="field__hint">Livraison offerte au-delà de ${money(25)}</span>
                </label>
              </article>
            </div>
          </div>`
        : ''}

      ${sectionCard(
        'Livreurs internes',
        html`
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Livreur</th><th>Statut</th><th>Course en cours</th><th>Créneau</th><th>Courses du jour</th><th></th></tr></thead>
              <tbody>
                ${COURIERS.map(
                  (c) => html`
                  <tr>
                    <td><div class="row"><span class="avatar">${c.name.slice(0, 1)}</span><strong>${c.name}</strong></div></td>
                    <td><span class="badge badge--${c.status === 'En course' ? 'info' : c.status === 'Disponible' ? 'success' : 'outline'}">
                      ${c.status === 'En course' ? '🛵' : c.status === 'Disponible' ? '✓' : '○'} ${c.status}</span></td>
                    <td class="num">${c.order || '—'}</td>
                    <td>${c.shift}</td>
                    <td class="num">${c.deliveries}</td>
                    <td><button type="button" class="btn btn--ghost btn--sm" data-act="assign-courier" data-name="${c.name}">Attribuer</button></td>
                  </tr>`
                )}
              </tbody>
            </table>
          </div>
          <p class="tiny dim" style="margin-top:var(--sp-3)">
            ${raw(icon('sparkle', { size: 13 }))} Les livreurs internes sont inclus dans la formule Signature.
            Ils disposent de leur propre application : <a href="livreur.html">espace livreur</a>.
          </p>`,
        { action: '<button type="button" class="btn btn--outline btn--sm" data-act="new-courier">Ajouter un livreur</button>' }
      )}
    </div>`;
}

export function mount() {
  const container = document.getElementById('zones-map');
  handle?.destroy();
  handle = null;
  if (!container) return;

  handle = createMap(container, { center: [RESTO.lat, RESTO.lng], zoom: 13 });
  if (!handle) return;
  handle.setZones(ZONES);
  handle.setRadius(RESTO.lat, RESTO.lng, 4000, 'var(--ink-3)');
  handle.setMarkers([{ id: 'resto', lat: RESTO.lat, lng: RESTO.lng, name: RESTO.name, label: '🍽️' }]);
  handle.invalidate();
}

export function unmount() {
  handle?.destroy();
  handle = null;
}
