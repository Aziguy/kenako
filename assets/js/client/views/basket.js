/**
 * A5a — Panier
 * Récapitulatif éditable, minimum de commande, franco de port et rappel
 * explicite que le paiement va au restaurant.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { computeTotals } from '../cart.js';
import { emptyState, subHeader } from '../components.js';

export function view(ctx) {
  const { state } = ctx;

  if (!state.cart.length) {
    return html`
      <div class="wrap wrap--narrow">
        ${subHeader('Votre panier', { back: '#/' })}
        ${emptyState({
          art: '🧺',
          title: 'Votre panier est vide',
          text: 'Ajoutez un plat depuis la carte d’un restaurant — commander prend moins d’une minute, sans créer de compte.',
          action: '<a class="btn btn--primary" href="#/">Découvrir les restaurants</a>',
        })}
      </div>`;
  }

  const t = computeTotals({ cart: state.cart, restId: state.restId, mode: state.mode, promoCode: state.promoCode, tip: state.tip });

  return html`
    <div class="wrap wrap--narrow" style="padding-bottom:120px">
      ${subHeader('Votre panier', {
        back: `#/r/${state.restId}`,
        action: '<button type="button" class="btn btn--ghost btn--sm" data-act="clear-cart">Vider</button>',
      })}

      <article class="card card--pad stack">
        <a class="row" href="#/r/${t.restaurant.id}" style="text-decoration:none;color:inherit">
          <span class="thumb" style="--tint:${t.restaurant.tint};width:44px;height:44px;border-radius:var(--r-sm)"></span>
          <span style="display:grid;min-width:0">
            <strong class="truncate">${t.restaurant.name}</strong>
            <span class="tiny dim">${t.restaurant.cuisine} · ${t.restaurant.eta} min</span>
          </span>
          <span class="spacer"></span>
          ${raw(icon('chevronRight', { size: 18 }))}
        </a>

        <div class="divider-list">
          ${state.cart.map(
            (line) => html`
            <div class="cart-line">
              <div class="stack-sm" style="gap:4px;min-width:0">
                <strong style="font-size:var(--fs-md)">${line.name}</strong>
                ${line.opts ? html`<span class="tiny dim">${line.opts}</span>` : ''}
                ${line.note ? html`<span class="tiny" style="color:var(--warning)">Note : ${line.note}</span>` : ''}
                <span class="num tiny dim">${money(line.unit)} l’unité</span>
              </div>
              <div class="stack-sm" style="justify-items:end;gap:var(--sp-2)">
                <span class="num strong">${money(line.unit * line.qty)}</span>
                <div class="qty">
                  <button type="button" class="qty__btn" data-act="line-qty" data-key="${line.key}" data-delta="-1"
                    aria-label="Retirer un ${line.name}">${raw(icon(line.qty === 1 ? 'trash' : 'minus', { size: 15 }))}</button>
                  <span class="qty__value">${line.qty}</span>
                  <button type="button" class="qty__btn" data-act="line-qty" data-key="${line.key}" data-delta="1"
                    aria-label="Ajouter un ${line.name}">${raw(icon('plus', { size: 15 }))}</button>
                </div>
              </div>
            </div>`
          )}
        </div>

        <a class="btn btn--outline btn--block btn--sm" href="#/r/${t.restaurant.id}">
          ${raw(icon('plus', { size: 16 }))} Ajouter un plat
        </a>
      </article>

      ${t.belowMinimum
        ? html`<div class="banner banner--warning" style="margin-top:var(--sp-4)">
            <span class="banner__icon" aria-hidden="true">!</span>
            <span><strong class="banner__title">Minimum de commande non atteint</strong>
            Ajoutez ${money(t.missingForMinimum)} pour livrer, ou passez en retrait sur place.</span>
          </div>`
        : ''}

      ${t.missingForFranco > 0
        ? html`<div class="banner" style="margin-top:var(--sp-4)">
            <span class="banner__icon" aria-hidden="true">🛵</span>
            <span>Plus que <strong>${money(t.missingForFranco)}</strong> pour la livraison offerte.</span>
          </div>`
        : ''}

      <article class="card card--pad stack" style="margin-top:var(--sp-4)">
        <h2 class="card__title">Récapitulatif</h2>
        <div class="summary">
          <div class="summary__row"><span>Sous-total</span><span class="num">${money(t.subtotal)}</span></div>
          <div class="summary__row"><span>Livraison</span><span class="num">${t.shipping ? money(t.shipping) : 'Offerte'}</span></div>
          ${t.discount ? html`<div class="summary__row summary__row--discount"><span>Remise ${t.promo.code}</span><span class="num">− ${money(t.discount)}</span></div>` : ''}
          <div class="summary__row summary__row--total"><span>Total</span><span class="num">${money(t.total)}</span></div>
        </div>
        <p class="tiny dim">${raw(icon('shield', { size: 13 }))} Paiement encaissé directement par ${t.restaurant.name}. Kenako ne prend aucune commission.</p>
      </article>
    </div>

    <div class="actionbar">
      <div class="actionbar__inner">
        <div style="display:grid">
          <span class="tiny dim">Total</span>
          <strong class="num" style="font-size:var(--fs-lg)">${money(t.total)}</strong>
        </div>
        <a class="btn btn--accent" style="flex:1" href="#/commande/1"
          ${t.belowMinimum && state.mode === 'livraison' ? raw('aria-disabled="true" data-act="min-order"') : ''}>
          Commander ${raw(icon('arrowRight', { size: 17 }))}
        </a>
      </div>
    </div>`;
}
