/**
 * B3b — Écran cuisine (KDS)
 * Plein écran, contraste élevé, grosses cartes et minuteurs : lisible à
 * deux mètres, utilisable les mains grasses.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { clock } from '../../core/format.js';

export function view(ctx) {
  const orders = ctx.state.orders.filter((o) => ['accepted', 'preparing', 'ready'].includes(o.status));

  return html`
    <div class="kds">
      <header class="between" style="padding-bottom:var(--sp-4)">
        <div class="row">
          <a class="btn btn--ghost btn--icon" href="#/commandes" aria-label="Quitter l’écran cuisine"
            style="color:#F7EFE5">${raw(icon('arrowLeft', { size: 20 }))}</a>
          <div>
            <strong style="font-size:20px">Écran cuisine</strong>
            <p style="font-size:13px;opacity:.7">${orders.length} commande(s) en production · ${clock()}</p>
          </div>
        </div>
        <span class="badge" style="background:#2A211B;color:#FFC15E">Mode plein écran</span>
      </header>

      ${orders.length
        ? html`
          <div class="kds__grid">
            ${orders.map((o) => {
              const tone = o.minutes > 30 ? 'is-late' : o.minutes > 20 ? 'is-warn' : '';
              return html`
                <article class="kds__card ${tone}">
                  <div class="between">
                    <span class="kds__id">${o.id}</span>
                    <span class="kds__timer">${o.minutes}′</span>
                  </div>
                  <div class="stack-sm">
                    ${o.items.map(
                      (i) => html`<div class="kds__line">
                        <span class="kds__qty">${i.q}×</span>
                        <span>${i.n}${i.o ? html`<br><span class="kds__opt">${i.o}</span>` : ''}</span>
                      </div>`
                    )}
                  </div>
                  ${o.note ? html`<p style="font-size:14px;color:#FFC15E">✎ ${o.note}</p>` : ''}
                  <div class="between" style="font-size:13px;opacity:.7">
                    <span>${o.mode} · ${o.time}</span>
                    <span>${o.client}</span>
                  </div>
                  <button type="button" class="btn btn--success btn--block" data-act="advance-order" data-id="${o.id}">
                    ${raw(icon('check', { size: 18 }))} ${o.status === 'ready' ? 'Remettre au service' : 'Marquer prêt'}
                  </button>
                </article>`;
            })}
          </div>`
        : html`
          <div class="empty" style="color:#C3B1A2">
            <div class="empty__art" style="background:#2A211B">🍳</div>
            <p class="empty__title" style="color:#F7EFE5">Aucune commande en production</p>
            <p class="empty__text" style="color:#C3B1A2">Les commandes acceptées apparaissent ici automatiquement.</p>
          </div>`}
    </div>`;
}
