/**
 * B2 — Tableau de bord
 * KPI du jour, courbe de CA, top des plats, commandes en cours, alertes.
 * L'interrupteur « accepter les commandes » et le mode rush sont en tête :
 * ce sont les deux gestes qu'un restaurateur fait dix fois par service.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, moneyShort, number, rating } from '../../core/format.js';
import { areaChart, barList } from '../../core/charts.js';
import { KPI, REVENUE_30, TOP_DISHES, ALERTS, ORDERS, ONBOARDING } from '../../data/resto.js';
import { stat, sectionCard, alertRow, orderCard } from '../components.js';

export function view(ctx) {
  const { state } = ctx;
  const live = ORDERS.filter((o) => ['new', 'accepted', 'preparing', 'ready'].includes(o.status));
  const doneChecklist = ONBOARDING.filter((s) => s.done).length;
  const checklistDone = doneChecklist === ONBOARDING.length;

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Bonjour Marie</h1>
          <p class="bo-sub">Service du midi · ${live.length} commande${live.length > 1 ? 's' : ''} en cours</p>
        </div>
        <div class="row" style="gap:var(--sp-2)">
          <a class="btn btn--outline btn--sm" href="#/analytique">${raw(icon('chart', { size: 16 }))} Analytique</a>
          <a class="btn btn--primary btn--sm" href="#/commandes">${raw(icon('kanban', { size: 16 }))} Commandes</a>
        </div>
      </div>

      <div class="accept-toggle ${state.accepting ? '' : 'is-off'} ${state.rush ? 'is-rush' : ''}">
        <div style="flex:1;min-width:0">
          <strong>${state.accepting ? 'Vous acceptez les commandes' : 'Commandes suspendues'}</strong>
          <p class="tiny dim">
            ${state.accepting
              ? state.rush
                ? 'Mode rush actif : les délais annoncés sont allongés de 15 minutes.'
                : `Délai annoncé aux clients : ${state.prepTime} minutes.`
              : 'Votre boutique reste visible, mais aucun nouveau panier ne peut être validé.'}
          </p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked="${state.accepting}" data-act="toggle-accept"
          aria-label="Accepter les commandes">
          <span class="switch__track"></span>
        </button>
      </div>

      ${state.accepting
        ? html`<div class="row-wrap">
            <button type="button" class="chip" data-act="toggle-rush" aria-pressed="${state.rush}">
              ${raw(icon('fire', { size: 15 }))} Mode rush ${state.rush ? '· actif' : ''}
            </button>
            <button type="button" class="chip" data-act="prep-time">
              ${raw(icon('clock', { size: 15 }))} Temps de préparation · ${state.prepTime} min
            </button>
          </div>`
        : ''}

      ${ALERTS.length ? html`<div class="stack-sm">${ALERTS.map((a) => alertRow(a))}</div>` : ''}

      ${!checklistDone
        ? html`
          <a class="card card--pad between" href="#/demarrage" style="text-decoration:none;color:inherit;border-left:3px solid var(--accent)">
            <div style="min-width:0">
              <strong>Terminez votre installation</strong>
              <p class="tiny dim">${doneChecklist} étape${doneChecklist > 1 ? 's' : ''} sur ${ONBOARDING.length} · publiez votre restaurant à 100 %</p>
              <div class="progress progress--accent" style="margin-top:8px;width:min(260px,60vw)">
                <div class="progress__bar" style="width:${(doneChecklist / ONBOARDING.length) * 100}%"></div>
              </div>
            </div>
            ${raw(icon('chevronRight', { size: 20 }))}
          </a>`
        : ''}

      <div class="grid grid--stats">
        ${stat({ label: 'Chiffre d’affaires', value: money(KPI.revenue), current: KPI.revenue, previous: KPI.revenuePrev, spark: REVENUE_30.slice(-14) })}
        ${stat({ label: 'Commandes', value: number(KPI.orders), current: KPI.orders, previous: KPI.ordersPrev })}
        ${stat({ label: 'Panier moyen', value: money(KPI.basket), current: KPI.basket, previous: KPI.basketPrev })}
        ${stat({ label: 'Note moyenne', value: rating(KPI.rating), current: KPI.rating, previous: KPI.ratingPrev })}
      </div>

      <div class="grid grid--sidebar">
        ${sectionCard(
          'Chiffre d’affaires · 30 derniers jours',
          html`
            ${raw(areaChart(REVENUE_30, { label: 'Chiffre d’affaires sur 30 jours', formatter: moneyShort, height: 190 }))}
            <div class="between tiny dim" style="margin-top:var(--sp-2)">
              <span>Il y a 30 jours</span>
              <span>Total ${moneyShort(REVENUE_30.reduce((a, b) => a + b, 0))}</span>
              <span>Aujourd’hui</span>
            </div>`,
          { action: '<a class="btn btn--ghost btn--sm" href="#/analytique">Détail</a>' }
        )}

        ${sectionCard(
          'Top 5 des plats',
          raw(barList(TOP_DISHES.slice(0, 5).map((d) => ({ label: d.name, value: d.revenue })), { formatter: moneyShort })),
          { sub: '30 derniers jours', action: '<a class="btn btn--ghost btn--sm" href="#/carte">Carte</a>' }
        )}
      </div>

      ${sectionCard(
        'Commandes en cours',
        html`<div class="grid grid--cards">${live.slice(0, 4).map((o) => orderCard(o))}</div>`,
        { action: '<a class="btn btn--outline btn--sm" href="#/commandes">Tout voir</a>' }
      )}
    </div>`;
}
