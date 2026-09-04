/**
 * C4 & C5 — CMS du frontend public, mise en avant et acquisition
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, moneyShort, number } from '../../core/format.js';
import { CMS, BOOSTS, CUISINE_CATS, COVERED_CITIES } from '../../data/admin.js';
import { panel, badge } from '../components.js';

/* --------------------------------------------------------------- C4 CMS */

export function cmsView(ctx) {
  const { state } = ctx;
  const tab = state.cmsTab || 'accueil';

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Site public</h1>
          <p class="bo-sub">Ce que voient les visiteurs avant de commander</p>
        </div>
        <div class="row" style="gap:var(--sp-2)">
          <a class="btn btn--outline btn--sm" href="index.html" target="_blank" rel="noopener">
            ${raw(icon('eye', { size: 16 }))} Prévisualiser
          </a>
          <button type="button" class="btn btn--primary btn--sm" data-act="publish-cms">Publier</button>
        </div>
      </div>

      <div class="tabs" role="tablist">
        ${[
          { id: 'accueil', label: 'Page d’accueil' },
          { id: 'blocs', label: 'Blocs de mise en avant' },
          { id: 'pages', label: 'Pages & blog' },
        ].map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="cms-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      ${tab === 'accueil'
        ? panel(
            'Hero de la page d’accueil',
            html`
              <div class="grid grid--2" style="gap:var(--sp-5);align-items:start">
                <div class="stack">
                  <label class="field"><span class="field__label">Titre</span>
                    <input class="input" value="${CMS.hero.title}"></label>
                  <label class="field"><span class="field__label">Sous-titre</span>
                    <textarea class="textarea" rows="3">${CMS.hero.subtitle}</textarea></label>
                  <label class="field"><span class="field__label">Bouton d’appel à l’action</span>
                    <input class="input" value="${CMS.hero.cta}"></label>
                  <div class="field"><span class="field__label">Visuel</span>
                    <button type="button" class="btn btn--outline btn--sm" data-act="upload-hero">
                      ${raw(icon('edit', { size: 15 }))} ${CMS.hero.visual}</button></div>
                </div>

                <div class="card card--flat" style="overflow:hidden">
                  <div class="thumb" style="--tint:var(--primary);aspect-ratio:16/9;border-radius:0"></div>
                  <div class="card__body stack-sm">
                    <p class="eyebrow">Aperçu</p>
                    <h3 style="font-size:22px">${CMS.hero.title}</h3>
                    <p class="tiny muted">${CMS.hero.subtitle}</p>
                    <span class="btn btn--accent btn--sm" style="justify-self:start">${CMS.hero.cta}</span>
                  </div>
                </div>
              </div>`
          )
        : ''}

      ${tab === 'blocs'
        ? html`
          ${panel(
            'Blocs de la page d’accueil',
            html`<div class="stack-sm">
              ${CMS.blocks.map(
                (b, i) => html`
                <div class="between" style="padding:var(--sp-3);border:1px solid var(--line);border-radius:var(--r-md)">
                  <div style="min-width:0">
                    <strong>${b.title}</strong>
                    <p class="tiny dim">${b.text}</p>
                  </div>
                  <button type="button" class="switch" role="switch" aria-checked="${b.on}"
                    data-act="toggle-block" data-index="${i}" aria-label="${b.title}">
                    <span class="switch__track"></span>
                  </button>
                </div>`
              )}
            </div>`
          )}
          ${panel(
            'Restaurants mis en avant',
            html`
              <div class="row-wrap">
                ${CMS.featured.map(
                  (name) => html`<span class="badge badge--lg badge--primary">${name}
                    <button type="button" style="background:none;border:0;color:inherit;padding:0 0 0 4px"
                      data-act="unfeature" data-name="${name}" aria-label="Retirer ${name}">✕</button></span>`
                )}
                <button type="button" class="chip" data-act="feature-resto">${raw(icon('plus', { size: 15 }))} Ajouter</button>
              </div>`,
            { sub: 'Affichés en tête de la page d’accueil publique' }
          )}`
        : ''}

      ${tab === 'pages'
        ? panel(
            'Pages & articles',
            html`
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Page</th><th>Chemin</th><th>Mise à jour</th><th>Statut</th><th></th></tr></thead>
                  <tbody>
                    ${CMS.pages.map(
                      (p) => html`
                      <tr>
                        <td><strong>${p.name}</strong></td>
                        <td class="num dim">${p.path}</td>
                        <td class="dim">${p.updated}</td>
                        <td>${badge(p.status)}</td>
                        <td><button type="button" class="btn btn--ghost btn--sm" data-act="edit-page" data-name="${p.name}">
                          ${raw(icon('edit', { size: 15 }))}</button></td>
                      </tr>`
                    )}
                  </tbody>
                </table>
              </div>`,
            { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-page">Nouvelle page</button>' }
          )
        : ''}
    </div>`;
}

/* ------------------------------------------------------------ C5 Boosts */

export function boostsView() {
  const revenue = BOOSTS.filter((b) => b.status !== 'terminé').reduce((s, b) => s + b.price, 0);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Mise en avant & acquisition</h1>
          <p class="bo-sub">${moneyShort(revenue)} de boosts en cours ou programmés</p>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-act="new-boost">
          ${raw(icon('plus', { size: 16 }))} Vendre un emplacement
        </button>
      </div>

      ${panel(
        'Emplacements sponsorisés',
        html`
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Restaurant</th><th>Emplacement</th><th>Période</th><th>Tarif</th><th>Statut</th><th></th></tr></thead>
              <tbody>
                ${BOOSTS.map(
                  (b) => html`
                  <tr>
                    <td><strong>${b.resto}</strong></td>
                    <td class="dim">${b.slot}</td>
                    <td class="dim">${b.period}</td>
                    <td class="num">${money(b.price)}</td>
                    <td>${badge(b.status)}</td>
                    <td><button type="button" class="btn btn--ghost btn--sm" data-act="edit-boost" data-resto="${b.resto}">
                      ${raw(icon('edit', { size: 15 }))}</button></td>
                  </tr>`
                )}
              </tbody>
            </table>
          </div>
          <p class="tiny dim" style="margin-top:var(--sp-3)">
            ${raw(icon('shield', { size: 13 }))} Les emplacements sponsorisés portent la mention « Mis en avant » côté client.
          </p>`
      )}

      <div class="grid grid--2">
        ${panel(
          'Catégories de cuisine',
          html`<div class="row-wrap">
            ${CUISINE_CATS.map(
              (c) => html`<span class="badge badge--outline badge--lg">${c}</span>`
            )}
            <button type="button" class="chip" data-act="new-cuisine">${raw(icon('plus', { size: 15 }))} Ajouter</button>
          </div>`,
          { sub: 'Utilisées par les filtres de recherche' }
        )}

        ${panel(
          'Villes couvertes',
          html`<div class="stack-sm">
            ${COVERED_CITIES.map(
              (c) => html`
              <div class="between" style="padding:var(--sp-2) 0">
                <span><strong>${c.name}</strong> <span class="tiny dim">${number(c.restos)} restaurants</span></span>
                <button type="button" class="switch" role="switch" aria-checked="${c.on}"
                  data-act="toggle-city" data-name="${c.name}" aria-label="${c.name}">
                  <span class="switch__track"></span>
                </button>
              </div>`
            )}
          </div>`
        )}
      </div>
    </div>`;
}
