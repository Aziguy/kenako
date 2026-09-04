/**
 * A5b — Tunnel de commande en trois étapes
 * 1. Mode & créneau · 2. Coordonnées · 3. Paiement.
 * Aucune étape n'exige la création d'un compte.
 */

import { html, raw, esc } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { MODE_LABELS, MODE_ICONS, PAYMENT_LABELS } from '../../data/restaurants.js';
import { SLOTS, ADDRESSES } from '../../data/client.js';
import { computeTotals } from '../cart.js';
import { emptyState, subHeader } from '../components.js';

const STEP_TITLES = ['Mode & créneau', 'Vos coordonnées', 'Paiement'];
const TIPS = [0, 1, 2, 3];

export function view(ctx) {
  const { state } = ctx;
  const step = Math.min(3, Math.max(1, Number(state.step) || 1));

  if (!state.cart.length) {
    return html`
      <div class="wrap wrap--narrow">
        ${subHeader('Commande', { back: '#/' })}
        ${emptyState({
          art: '🧺',
          title: 'Votre panier est vide',
          text: 'Impossible de finaliser une commande sans article. Choisissez un restaurant pour commencer.',
          action: '<a class="btn btn--primary" href="#/">Voir les restaurants</a>',
        })}
      </div>`;
  }

  const t = computeTotals({ cart: state.cart, restId: state.restId, mode: state.mode, promoCode: state.promoCode, tip: state.tip });

  return html`
    <div class="wrap wrap--narrow" style="padding-bottom:140px">
      ${subHeader(STEP_TITLES[step - 1], { back: step === 1 ? '#/panier' : `#/commande/${step - 1}` })}

      <div class="stack" style="gap:var(--sp-5)">
        <div class="stack-sm">
          <div class="steps" role="progressbar" aria-valuenow="${step}" aria-valuemin="1" aria-valuemax="3" aria-label="Étape ${step} sur 3">
            ${[1, 2, 3].map((n) => html`<span class="steps__item ${n <= step ? 'is-done' : ''}"></span>`)}
          </div>
          <p class="tiny dim">Étape ${step} sur 3 · ${t.restaurant.name}</p>
        </div>

        ${step === 1 ? stepMode(state, t) : ''}
        ${step === 2 ? stepDetails(state, t) : ''}
        ${step === 3 ? stepPayment(state, t) : ''}

        ${summary(t, state)}
      </div>
    </div>

    <div class="actionbar">
      <div class="actionbar__inner">
        <div style="display:grid">
          <span class="tiny dim">Total à payer</span>
          <strong class="num" style="font-size:var(--fs-lg)">${money(t.total)}</strong>
        </div>
        ${step < 3
          ? html`<button type="button" class="btn btn--accent" style="flex:1" data-act="next-step">
              Continuer ${raw(icon('arrowRight', { size: 17 }))}</button>`
          : html`<button type="button" class="btn btn--accent ${state.paying ? 'is-loading' : ''}" style="flex:1" data-act="pay">
              ${state.paying ? 'Paiement en cours…' : `Payer ${money(t.total)}`}</button>`}
      </div>
    </div>`;
}

/* ---------------------------------------------------- Étape 1 : mode */
function stepMode(state, t) {
  const outOfZone = state.mode === 'livraison' && /Versailles|78\d{3}/.test(state.address);

  return html`
    <section class="card card--pad stack">
      <h2 class="card__title">Comment souhaitez-vous être servi ?</h2>
      <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:var(--sp-2)">
        ${t.restaurant.modes.map(
          (m) => html`
          <button type="button" class="option" style="flex-direction:column;justify-content:center;min-height:82px;text-align:center"
            role="radio" aria-checked="${state.mode === m}" data-act="mode" data-id="${m}">
            <span style="font-size:22px" aria-hidden="true">${MODE_ICONS[m]}</span>
            <span class="strong tiny">${MODE_LABELS[m]}</span>
          </button>`
        )}
      </div>

      ${state.mode === 'livraison'
        ? html`
          <div class="field">
            <span class="field__label">Adresse de livraison</span>
            <div class="stack-sm">
              ${ADDRESSES.map(
                (a) => html`
                <button type="button" class="option" role="radio" aria-checked="${state.address === a.line}"
                  data-act="address" data-line="${a.line}">
                  <span class="option__mark">${state.address === a.line ? raw(icon('check', { size: 12, stroke: 3 })) : ''}</span>
                  <span style="display:grid;gap:2px;min-width:0">
                    <span class="strong tiny">${a.label}</span>
                    <span class="tiny dim truncate">${a.line} · ${a.detail}</span>
                  </span>
                </button>`
              )}
              <button type="button" class="option" data-act="new-address">
                <span class="option__mark option__mark--box" style="border-style:dashed">${raw(icon('plus', { size: 12 }))}</span>
                <span class="tiny">Utiliser une autre adresse</span>
              </button>
            </div>
          </div>

          ${outOfZone
            ? html`<div class="banner banner--danger">
                <span class="banner__icon" aria-hidden="true">✕</span>
                <span><strong class="banner__title">Adresse hors zone de livraison</strong>
                ${t.restaurant.name} livre dans un rayon de 3 km. Choisissez le retrait sur place ou une autre adresse.</span>
              </div>`
            : ''}`
        : html`<div class="banner banner--success">
            <span class="banner__icon" aria-hidden="true">✓</span>
            <span>${state.mode === 'emporter' ? 'Retrait au comptoir' : 'Service en salle'} — ${t.restaurant.address}</span>
          </div>`}

      <div class="field">
        <span class="field__label">Quand ?</span>
        <div class="scroll-x">
          ${SLOTS.map(
            (s) => html`<button type="button" class="chip" data-act="slot" data-id="${s}"
              aria-pressed="${state.slot === s}">${s}</button>`
          )}
        </div>
        <span class="field__hint">Délai estimé par le restaurant : ${t.restaurant.eta} min</span>
      </div>
    </section>`;
}

/* --------------------------------------------- Étape 2 : coordonnées */
function stepDetails(state, t) {
  return html`
    <section class="card card--pad stack">
      <h2 class="card__title">Pour vous prévenir</h2>
      <p class="tiny dim">Aucun compte n’est nécessaire. Ces informations servent uniquement à cette commande.</p>

      <div class="grid grid--2" style="gap:var(--sp-3)">
        <label class="field">
          <span class="field__label">Prénom</span>
          <input class="input" data-bind="firstName" value="${state.firstName}" autocomplete="given-name" required>
        </label>
        <label class="field">
          <span class="field__label">Téléphone</span>
          <input class="input" type="tel" data-bind="phone" value="${state.phone}" autocomplete="tel" required>
        </label>
      </div>
      <label class="field">
        <span class="field__label">E-mail <span class="dim">(pour le suivi de commande)</span></span>
        <input class="input" type="email" data-bind="email" value="${state.email}" autocomplete="email">
      </label>

      <details class="card card--flat" style="padding:var(--sp-3)">
        <summary class="strong tiny" style="cursor:pointer">Déjà client de ${esc(t.restaurant.name)} ?</summary>
        <p class="tiny dim" style="margin-top:var(--sp-2)">
          Saisissez le téléphone utilisé lors de votre dernière commande : vos points de fidélité seront rattachés automatiquement.
        </p>
      </details>
    </section>

    <section class="card card--pad stack">
      <h2 class="card__title">Code promo</h2>
      <div class="row" style="gap:var(--sp-2)">
        <input class="input" placeholder="BIENVENUE10" data-bind="promoInput" value="${state.promoInput || ''}"
          aria-invalid="${Boolean(state.promoMessage && !state.promoCode)}" style="text-transform:uppercase">
        <button type="button" class="btn btn--outline" data-act="apply-promo">Appliquer</button>
      </div>
      ${state.promoMessage
        ? state.promoCode
          ? html`<p class="tiny" style="color:var(--success);font-weight:600">${raw(icon('check', { size: 13 }))} ${state.promoMessage}</p>`
          : html`<p class="field__error">${raw(icon('x', { size: 13 }))} ${state.promoMessage}</p>`
        : html`<p class="field__hint">Essayez BIENVENUE10, MARIE5 ou LIVRAISON0.</p>`}
    </section>

    <section class="card card--pad stack">
      <h2 class="card__title">Pourboire pour l’équipe</h2>
      <p class="tiny dim">Intégralement reversé au restaurant, comme le reste de votre commande.</p>
      <div class="row-wrap">
        ${TIPS.map(
          (v) => html`<button type="button" class="chip" data-act="tip" data-value="${v}"
            aria-pressed="${Number(state.tip) === v}">${v === 0 ? 'Pas cette fois' : money(v)}</button>`
        )}
      </div>
    </section>`;
}

/* ------------------------------------------------ Étape 3 : paiement */
function stepPayment(state, t) {
  const methods = t.restaurant.payments;

  return html`
    <section class="card card--pad stack">
      <h2 class="card__title">Moyen de paiement</h2>
      <p class="tiny dim">${t.restaurant.name} a activé ces moyens de paiement. L’encaissement lui revient directement.</p>

      <div class="stack-sm">
        ${methods.map(
          (m) => html`
          <button type="button" class="option" role="radio" aria-checked="${state.payment === m}" data-act="payment" data-id="${m}">
            <span class="option__mark">${state.payment === m ? raw(icon('check', { size: 12, stroke: 3 })) : ''}</span>
            <span>${PAYMENT_LABELS[m]}</span>
            ${m === 'cash' ? html`<span class="badge badge--outline" style="margin-left:auto">À la livraison</span>` : ''}
          </button>`
        )}
      </div>

      ${state.payment === 'card'
        ? html`
          <div class="stack-sm">
            <label class="field">
              <span class="field__label">Numéro de carte</span>
              <input class="input num" inputmode="numeric" placeholder="4242 4242 4242 4242"
                data-bind="cardNumber" value="${state.cardNumber || ''}"
                aria-invalid="${state.payError}">
            </label>
            <div class="grid grid--2" style="gap:var(--sp-3)">
              <label class="field"><span class="field__label">Expiration</span><input class="input num" placeholder="09/29"></label>
              <label class="field"><span class="field__label">Cryptogramme</span><input class="input num" placeholder="123"></label>
            </div>
            ${state.payError
              ? html`<div class="banner banner--danger">
                  <span class="banner__icon" aria-hidden="true">✕</span>
                  <span><strong class="banner__title">Paiement refusé par la banque</strong>
                  Vérifiez le numéro ou choisissez un autre moyen de paiement. Votre panier est conservé.</span>
                </div>`
              : html`<p class="tiny dim">${raw(icon('shield', { size: 13 }))} Paiement sécurisé. Saisissez 4000 0000 0000 0002 pour simuler un refus.</p>`}
          </div>`
        : ''}

      ${state.payment === 'cash'
        ? html`<div class="banner"><span class="banner__icon" aria-hidden="true">💶</span>
            <span>Prévoyez l’appoint : le livreur encaisse ${money(t.total)} à la remise de la commande.</span></div>`
        : ''}
    </section>`;
}

/* ------------------------------------------------------- Récapitulatif */
function summary(t, state) {
  return html`
    <section class="card card--pad stack-sm">
      <div class="between">
        <h2 class="card__title">Votre commande</h2>
        <a class="tiny strong" href="#/panier">Modifier</a>
      </div>
      ${state.cart.map(
        (l) => html`
        <div class="summary__row">
          <span><span class="num dim">${l.qty}×</span> ${l.name}${l.opts ? html`<span class="tiny dim"> · ${l.opts}</span>` : ''}</span>
          <span class="num">${money(l.unit * l.qty)}</span>
        </div>`
      )}
      <div class="summary" style="margin-top:var(--sp-2)">
        <div class="summary__row"><span>Sous-total</span><span class="num">${money(t.subtotal)}</span></div>
        <div class="summary__row"><span>Livraison ${state.mode !== 'livraison' ? '(sans objet)' : ''}</span><span class="num">${t.shipping ? money(t.shipping) : 'Offerte'}</span></div>
        ${t.discount ? html`<div class="summary__row summary__row--discount"><span>Remise ${t.promo.code}</span><span class="num">− ${money(t.discount)}</span></div>` : ''}
        ${t.tip ? html`<div class="summary__row"><span>Pourboire</span><span class="num">${money(t.tip)}</span></div>` : ''}
        <div class="summary__row summary__row--total"><span>Total</span><span class="num">${money(t.total)}</span></div>
      </div>
      ${t.points ? html`<p class="tiny" style="color:var(--success);font-weight:600">Cette commande vous aurait rapporté ${t.points} points de fidélité.</p>` : ''}
    </section>`;
}
