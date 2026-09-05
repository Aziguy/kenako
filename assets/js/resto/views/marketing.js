/**
 * B7 — Marketing
 * Codes promo, programme de fidélité, parrainage, campagnes et génération
 * de visuels pour les réseaux sociaux.
 */

import { html, raw, esc } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number } from '../../core/format.js';
import { PROMOS, LOYALTY_CONFIG, CAMPAIGNS, SEGMENTS, RESTO, TOP_DISHES } from '../../data/resto.js';
import { sectionCard, stateBadge } from '../components.js';

const TABS = [
  { id: 'promos', label: 'Codes promo' },
  { id: 'fidelite', label: 'Fidélité & parrainage' },
  { id: 'campagnes', label: 'Campagnes' },
  { id: 'social', label: 'Réseaux sociaux' },
];

const LOYALTY_TYPES = [
  { id: 'points', label: 'Points', hint: '1 € dépensé = 1 point' },
  { id: 'tampons', label: 'Tampons', hint: '1 commande = 1 tampon' },
  { id: 'cashback', label: 'Cashback', hint: 'Un pourcentage en cagnotte' },
];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.marketingTab || 'promos';

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Marketing</h1>
          <p class="bo-sub">Vos offres, votre fidélité, vos campagnes — configurées par vous seul.</p>
        </div>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="marketing-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      ${tab === 'promos' ? promos() : ''}
      ${tab === 'fidelite' ? loyalty(state) : ''}
      ${tab === 'campagnes' ? campaigns() : ''}
      ${tab === 'social' ? social(state) : ''}
    </div>`;
}

function promos() {
  return sectionCard(
    'Codes promo',
    html`
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Code</th><th>Réduction</th><th>Conditions</th><th>Période</th><th>Utilisations</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            ${PROMOS.map(
              (p) => html`
              <tr>
                <td class="num strong">${p.code}</td>
                <td><span class="badge badge--accent">${p.type}</span></td>
                <td class="dim">${p.cond}</td>
                <td class="dim">${p.period}</td>
                <td>
                  <div class="row" style="gap:var(--sp-2)">
                    <span class="num">${number(p.used)}/${number(p.cap)}</span>
                    <div class="progress" style="width:60px;height:5px">
                      <div class="progress__bar" style="width:${Math.min(100, (p.used / p.cap) * 100)}%"></div>
                    </div>
                  </div>
                </td>
                <td>${p.active ? stateBadge('actif') : stateBadge('brouillon')}</td>
                <td><button type="button" class="btn btn--ghost btn--sm" data-act="edit-promo" data-code="${p.code}">
                  ${raw(icon('edit', { size: 15 }))}</button></td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>`,
    { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-promo">Nouveau code</button>' }
  );
}

function loyalty(state) {
  const cfg = LOYALTY_CONFIG;
  return html`
    ${sectionCard(
      'Programme de fidélité',
      html`
        <div class="stack">
          <div class="grid grid--3">
            ${LOYALTY_TYPES.map(
              (t) => html`
              <button type="button" class="option" style="flex-direction:column;align-items:flex-start;gap:4px;min-height:84px"
                role="radio" aria-checked="${state.loyaltyType === t.id}" data-act="loyalty-type" data-id="${t.id}">
                <strong>${t.label}</strong><span class="tiny dim">${t.hint}</span>
              </button>`
            )}
          </div>

          <div class="grid grid--3" style="gap:var(--sp-3)">
            <label class="field"><span class="field__label">Taux de conversion</span>
              <input class="input num" value="${cfg.rate}"><span class="field__hint">Points par euro dépensé</span></label>
            <label class="field"><span class="field__label">Seuil de récompense</span>
              <input class="input num" value="${cfg.threshold}"><span class="field__hint">Points nécessaires</span></label>
            <label class="field"><span class="field__label">Récompense</span>
              <input class="input num" value="${cfg.reward}"><span class="field__hint">En euros offerts</span></label>
          </div>

          <div class="banner banner--success">
            <span class="banner__icon" aria-hidden="true">✓</span>
            <span>Ce que verront vos clients : <strong>${cfg.rate} € = ${cfg.rate} point · ${cfg.threshold} points = ${money(cfg.reward)} offerts</strong></span>
          </div>

          <div class="grid grid--2">
            <div class="stat"><span class="stat__label">Membres du programme</span><span class="stat__value">${number(cfg.members)}</span></div>
            <div class="stat"><span class="stat__label">Récompenses utilisées</span><span class="stat__value">${number(cfg.redeemed)}</span></div>
          </div>
        </div>`
    )}

    ${sectionCard(
      'Parrainage',
      html`
        <div class="grid grid--2" style="gap:var(--sp-3)">
          <label class="field"><span class="field__label">Gain pour le parrain</span>
            <input class="input num" value="${cfg.referralSponsor}"><span class="field__hint">Crédité après la 1re commande du filleul</span></label>
          <label class="field"><span class="field__label">Gain pour le filleul</span>
            <input class="input num" value="${cfg.referralFriend}"><span class="field__hint">Appliqué sur sa 1re commande</span></label>
        </div>
        <p class="tiny dim" style="margin-top:var(--sp-3)">Coût estimé par filleul acquis : ${money(cfg.referralSponsor + cfg.referralFriend)}.</p>`
    )}

    ${sectionCard(
      'Bannière promotionnelle',
      html`
        <div class="grid grid--2" style="gap:var(--sp-5);align-items:start">
          <div class="stack">
            <label class="field"><span class="field__label">Message</span>
              <input class="input" value="Livraison offerte dès 25 € cette semaine"></label>
            <label class="field"><span class="field__label">Période</span>
              <div class="grid grid--2" style="gap:var(--sp-3)">
                <input class="input" type="date"><input class="input" type="date">
              </div></label>
            <button type="button" class="switch" role="switch" aria-checked="true" data-act="toggle-banner">
              <span class="switch__track"></span><span class="tiny">Afficher sur ma fiche</span>
            </button>
          </div>
          <div class="stack-sm">
            <span class="eyebrow">Aperçu côté client</span>
            <div class="thumb" style="--tint:${RESTO.tint};aspect-ratio:21/9;border-radius:var(--r-md)">
              <span class="thumb__slot" style="align-items:flex-start"><span class="badge badge--accent">Livraison offerte dès 25 €</span></span>
              <span class="thumb__label">${RESTO.name}</span>
            </div>
            <p class="tiny dim">La bannière apparaît en tête de votre fiche, au-dessus de la carte.</p>
          </div>
        </div>`
    )}`;
}

function campaigns() {
  return html`
    ${sectionCard(
      'Segments',
      html`<div class="grid grid--tiles">
        ${SEGMENTS.map(
          (s) => html`
          <button type="button" class="card card--flat card--pad stack-sm" style="text-align:left"
            data-act="new-campaign" data-segment="${s.id}">
            <strong>${s.label}</strong>
            <span class="num" style="font-size:22px;font-weight:700">${number(s.count)}</span>
            <span class="tiny strong" style="color:var(--primary-strong)">Créer une campagne →</span>
          </button>`
        )}
      </div>`
    )}

    ${sectionCard(
      'Campagnes',
      html`
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Campagne</th><th>Canal</th><th>Segment</th><th>Envoi</th><th>Ouvertures</th><th>Clics</th><th>Statut</th></tr></thead>
            <tbody>
              ${CAMPAIGNS.map(
                (c) => html`
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td><span class="badge badge--outline">${c.channel}</span></td>
                  <td class="dim">${c.segment}</td>
                  <td class="dim">${c.sent}</td>
                  <td class="num">${c.open}</td>
                  <td class="num">${c.clicks}</td>
                  <td>${stateBadge(c.status.toLowerCase() === 'envoyée' ? 'publié' : 'programmée')}</td>
                </tr>`
              )}
            </tbody>
          </table>
        </div>`,
      { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-campaign">Nouvelle campagne</button>' }
    )}`;
}

function social(state) {
  const dish = TOP_DISHES[state.socialDish ?? 0];
  const format = state.socialFormat || 'post';
  const caption = `Ce midi au ${RESTO.name} : ${dish.name.toLowerCase()}. Commandez directement, sans commission — le lien est en bio. #Paris11 #FaitMaison #Kenako`;

  return sectionCard(
    'Visuel pour les réseaux sociaux',
    html`
      <div class="grid" style="grid-template-columns:1fr;gap:var(--sp-5)">
        <div class="grid grid--2" style="align-items:start;gap:var(--sp-5)">
          <div class="stack">
            <label class="field">
              <span class="field__label">Sujet du visuel</span>
              <select class="select" data-bind="socialDish">
                ${TOP_DISHES.map((d, i) => html`<option value="${i}" ${i === (state.socialDish ?? 0) ? raw('selected') : ''}>${d.name}</option>`)}
              </select>
            </label>
            <div class="field">
              <span class="field__label">Format</span>
              <div class="segmented">
                <button type="button" class="segmented__item" data-act="social-format" data-id="post" aria-selected="${format === 'post'}">Post 1:1</button>
                <button type="button" class="segmented__item" data-act="social-format" data-id="story" aria-selected="${format === 'story'}">Story 9:16</button>
              </div>
            </div>
            <label class="field">
              <span class="field__label">Légende pré-remplie</span>
              <textarea class="textarea" rows="4">${caption}</textarea>
            </label>
            <div class="row-wrap">
              <button type="button" class="btn btn--primary btn--sm" data-act="copy-caption" data-text="${esc(caption)}">
                ${raw(icon('copy', { size: 15 }))} Copier la légende</button>
              <button type="button" class="btn btn--outline btn--sm" data-act="download-visual">
                ${raw(icon('download', { size: 15 }))} Télécharger le visuel</button>
              <button type="button" class="btn btn--outline btn--sm" data-act="share-social">
                ${raw(icon('share', { size: 15 }))} Partager</button>
            </div>
          </div>

          <div style="max-width:340px;margin-inline:auto;width:100%">
            <div class="social-preview social-preview--${format}">
              <div class="social-preview__bg thumb" style="--tint:${RESTO.tint};border-radius:var(--r-lg)"></div>
              <span class="badge badge--accent" style="justify-self:start">${RESTO.name}</span>
              <strong style="font-family:var(--font-display);font-size:24px;line-height:1.15">${dish.name}</strong>
              <span class="tiny" style="opacity:.9">Commandez sans commission sur Kenako</span>
            </div>
          </div>
        </div>
      </div>`,
    { sub: 'Généré à partir de votre carte et de votre identité visuelle.' }
  );
}
