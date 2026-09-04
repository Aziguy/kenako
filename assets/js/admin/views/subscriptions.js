/**
 * C3 — Abonnements & facturation
 * Formules, promotions sur l'abonnement, suivi des impayés avec relances,
 * et moyens de paiement acceptés **pour l'abonnement uniquement**.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, moneyShort, number } from '../../core/format.js';
import { ADMIN_PLANS, SUB_PROMOS, UNPAID, SUB_PAY_METHODS } from '../../data/admin.js';
import { panel, badge } from '../components.js';

const TABS = [
  { id: 'formules', label: 'Formules' },
  { id: 'promotions', label: 'Promotions' },
  { id: 'impayes', label: 'Impayés' },
  { id: 'moyens', label: 'Moyens de paiement' },
];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.subTab || 'formules';
  const overdue = UNPAID.reduce((sum, u) => sum + u.amount, 0);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Abonnements & facturation</h1>
          <p class="bo-sub">${moneyShort(overdue)} d’impayés sur ${number(UNPAID.length)} comptes</p>
        </div>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="sub-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}${t.id === 'impayes' ? html` <span class="badge badge--danger">${UNPAID.length}</span>` : ''}</button>`
        )}
      </div>

      ${tab === 'formules' ? plans() : ''}
      ${tab === 'promotions' ? promos() : ''}
      ${tab === 'impayes' ? unpaid() : ''}
      ${tab === 'moyens' ? methods(state) : ''}
    </div>`;
}

function plans() {
  return panel(
    'Les trois formules',
    html`
      <div class="grid grid--3">
        ${ADMIN_PLANS.map(
          (p) => html`
          <article class="card card--flat card--pad stack-sm" style="border-top:3px solid ${p.color}">
            <div class="between">
              <strong>${p.name}</strong>
              <span class="badge badge--outline">${number(p.subs)} abonnés</span>
            </div>
            <p><span class="num" style="font-size:26px;font-weight:700">${money(p.monthly)}</span><span class="tiny dim"> / mois</span></p>
            <p class="tiny dim">${money(p.yearly)} par an · ${p.limits}</p>
            <ul class="stack-sm" style="gap:4px">
              ${p.features.map((f) => html`<li class="tiny row" style="gap:6px">${raw(icon('check', { size: 12 }))} ${f}</li>`)}
            </ul>
            <div class="between" style="padding-top:var(--sp-2);border-top:1px solid var(--line)">
              <span class="tiny dim">MRR</span>
              <strong class="num">${moneyShort(p.subs * p.monthly)}</strong>
            </div>
            <button type="button" class="btn btn--outline btn--block btn--sm" data-act="edit-plan" data-name="${p.name}">
              ${raw(icon('edit', { size: 15 }))} Modifier la formule
            </button>
          </article>`
        )}
      </div>`,
    { sub: 'Prix, fonctionnalités incluses et limites', action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-plan">Nouvelle formule</button>' }
  );
}

function promos() {
  return panel(
    'Promotions sur l’abonnement',
    html`
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Promotion</th><th>Cible</th><th>Code</th><th>Période</th><th>Utilisations</th><th>Statut</th><th></th></tr></thead>
          <tbody>
            ${SUB_PROMOS.map(
              (p) => html`
              <tr>
                <td><strong>${p.name}</strong></td>
                <td class="dim">${p.target}</td>
                <td class="num">${p.code}</td>
                <td class="dim">${p.period}</td>
                <td class="num">${number(p.used)}</td>
                <td>${badge(p.status)}</td>
                <td><button type="button" class="btn btn--ghost btn--sm" data-act="edit-sub-promo" data-code="${p.code}">
                  ${raw(icon('edit', { size: 15 }))}</button></td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>
      <p class="tiny dim" style="margin-top:var(--sp-3)">
        Ces promotions portent uniquement sur l’abonnement du restaurateur, jamais sur les commandes des clients.
      </p>`,
    { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-sub-promo">Nouvelle promotion</button>' }
  );
}

function unpaid() {
  return panel(
    'Impayés & relances automatiques',
    html`
      <div class="stack-sm">
        ${UNPAID.map(
          (u) => html`
          <article class="card card--flat card--pad stack-sm" style="border-left:3px solid ${u.days > 30 ? 'var(--danger)' : u.days > 7 ? 'var(--warning)' : 'var(--info)'}">
            <div class="between">
              <div style="min-width:0">
                <strong>${u.resto}</strong>
                <p class="tiny dim"><span class="num">${u.invoice}</span> · ${money(u.amount)} · ${number(u.days)} jours de retard</p>
              </div>
              <span class="badge badge--${u.days > 30 ? 'danger' : 'warning'}">${u.days > 30 ? '✕' : '!'} ${u.stage}</span>
            </div>
            <div class="between">
              <span class="tiny dim">Prochaine action : ${u.next}</span>
              <div class="row" style="gap:var(--sp-2)">
                <button type="button" class="btn btn--outline btn--sm" data-act="send-reminder" data-resto="${u.resto}">Relancer</button>
                <button type="button" class="btn btn--ghost btn--sm" data-act="open-invoice" data-id="${u.invoice}">Voir la facture</button>
              </div>
            </div>
          </article>`
        )}
      </div>`,
    { sub: 'Relance 1 à J+3, relance 2 à J+10, suspension à J+15' }
  );
}

function methods(state) {
  return html`
    ${panel(
      'Moyens de paiement de l’abonnement',
      html`<div class="stack-sm">
        ${SUB_PAY_METHODS.map(
          (m) => html`
          <div class="between" style="padding:var(--sp-3);border:1px solid var(--line);border-radius:var(--r-md)">
            <div style="min-width:0">
              <strong>${m.label}</strong>
              <p class="tiny dim">${m.note}</p>
            </div>
            <button type="button" class="switch" role="switch" aria-checked="${state.subPayments.includes(m.id)}"
              data-act="toggle-sub-payment" data-id="${m.id}" aria-label="${m.label}">
              <span class="switch__track"></span>
            </button>
          </div>`
        )}
      </div>`,
      { sub: 'Ces réglages ne concernent que la facturation de l’abonnement' }
    )}

    <div class="readonly-banner">
      <span aria-hidden="true">🔒</span>
      <span>Les moyens de paiement proposés aux clients finaux sont configurés par chaque restaurateur, indépendamment de cette liste.</span>
    </div>`;
}
