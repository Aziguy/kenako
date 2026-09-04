/**
 * A7 — Confirmation & incitation au compte
 * Le compte se propose après la commande, comme une récompense — jamais
 * comme une barrière.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { getRestaurant } from '../../data/restaurants.js';

export function view(ctx) {
  const { state } = ctx;
  const order = state.lastOrder;
  if (!order) {
    return html`<div class="wrap wrap--narrow page">
      <p class="lead">Aucune commande récente.</p>
      <a class="btn btn--primary" href="#/">Découvrir les restaurants</a>
    </div>`;
  }
  const r = getRestaurant(order.restId);

  return html`
    <div class="wrap wrap--narrow page" style="justify-items:center;text-align:center">
      <div class="success-art" aria-hidden="true">✓</div>
      <div class="stack-sm" style="justify-items:center">
        <h1 class="display" style="font-size:clamp(30px,7vw,44px)">Merci ${order.firstName} !</h1>
        <p class="lead">${r.name} a bien reçu votre commande <strong class="num">${order.id}</strong>.</p>
      </div>

      <article class="card card--pad stack-sm" style="width:100%;text-align:left">
        <div class="between">
          <span class="tiny dim">Mode</span><strong class="tiny">${order.modeLabel}</strong>
        </div>
        <div class="between">
          <span class="tiny dim">Créneau</span><strong class="tiny">${order.slot}</strong>
        </div>
        <div class="between">
          <span class="tiny dim">Paiement</span><strong class="tiny">${order.paymentLabel}</strong>
        </div>
        <div class="between" style="padding-top:var(--sp-3);border-top:1px solid var(--line)">
          <span class="strong">Total réglé</span><strong class="num" style="font-size:var(--fs-lg)">${money(order.total)}</strong>
        </div>
      </article>

      <div class="row" style="width:100%;gap:var(--sp-2)">
        <a class="btn btn--primary" style="flex:1" href="#/suivi">${raw(icon('clock', { size: 17 }))} Suivre ma commande</a>
        <button type="button" class="btn btn--outline btn--icon" data-act="share-order" aria-label="Partager le lien de suivi">
          ${raw(icon('share', { size: 17 }))}
        </button>
      </div>
      <p class="tiny dim">Le lien de suivi fonctionne sans compte. Nous vous l’avons aussi envoyé par e-mail.</p>

      <article class="card card--pad stack" style="width:100%;text-align:left;border-top:3px solid var(--accent)">
        <div class="row">
          <span class="empty__art" style="width:52px;height:52px;font-size:22px;background:var(--accent-soft)" aria-hidden="true">🎁</span>
          <div style="display:grid">
            <strong>Vous auriez gagné ${order.points || 0} points</strong>
            <span class="tiny dim">${r.loyalty.reward} chez ${r.name}</span>
          </div>
        </div>
        <p class="tiny muted" style="line-height:1.55">
          Créez votre compte Kenako en 20 secondes pour cumuler vos points, retrouver vos commandes
          et parrainer vos proches — ${r.referral.sponsor} pour vous, ${r.referral.friend} pour eux.
        </p>
        <div class="row" style="gap:var(--sp-2)">
          <button type="button" class="btn btn--accent" style="flex:1" data-act="create-account">Créer mon compte</button>
          <a class="btn btn--ghost" href="#/">Plus tard</a>
        </div>
      </article>
    </div>`;
}
