/**
 * B6 — Paiements & finances
 * Moyens de paiement activés par le restaurant, historique des encaissements,
 * export comptable et abonnement Kenako (le seul flux financier de la plateforme).
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, moneyShort, number } from '../../core/format.js';
import { PAYMENT_METHODS, PAYOUTS, INVOICES, PLANS, RESTO } from '../../data/resto.js';
import { sectionCard, stateBadge } from '../components.js';

const TABS = [
  { id: 'encaissements', label: 'Encaissements' },
  { id: 'moyens', label: 'Moyens de paiement' },
  { id: 'abonnement', label: 'Abonnement' },
];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.financeTab || 'encaissements';
  const total = PAYOUTS.reduce((sum, p) => sum + p.gross, 0);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Finances</h1>
          <p class="bo-sub">${moneyShort(total)} encaissés sur les 4 derniers jours · 100 % pour vous</p>
        </div>
        <button type="button" class="btn btn--outline btn--sm" data-act="export-accounting">
          ${raw(icon('download', { size: 16 }))} Export comptable
        </button>
      </div>

      <div class="banner banner--success">
        <span class="banner__icon" aria-hidden="true">✓</span>
        <span><strong class="banner__title">Zéro commission sur vos commandes</strong>
        Kenako ne touche jamais l’argent de vos commandes : chaque paiement client arrive directement
        sur votre compte. Nous ne facturons que votre abonnement mensuel.</span>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="finance-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      ${tab === 'encaissements' ? payouts() : ''}
      ${tab === 'moyens' ? methods(state) : ''}
      ${tab === 'abonnement' ? subscription() : ''}
    </div>`;
}

function payouts() {
  return sectionCard(
    'Historique des encaissements',
    html`
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Date</th><th>Canal</th><th>Commandes</th><th>Montant</th><th>Destination</th></tr></thead>
          <tbody>
            ${PAYOUTS.map(
              (p) => html`
              <tr>
                <td>${p.date}</td>
                <td>${p.label}</td>
                <td class="num">${number(p.orders)}</td>
                <td class="num strong">${money(p.gross)}</td>
                <td><span class="badge badge--success">✓ Votre compte</span></td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>`,
    { sub: 'Aucun prélèvement de la plateforme n’apparaît ici — il n’y en a pas.' }
  );
}

function methods(state) {
  return html`
    ${sectionCard(
      'Moyens de paiement acceptés',
      html`<div class="stack-sm">
        ${PAYMENT_METHODS.map(
          (m) => html`
          <div class="between" style="padding:var(--sp-3);border:1px solid var(--line);border-radius:var(--r-md)">
            <div style="min-width:0">
              <strong>${m.label}</strong>
              <p class="tiny dim">${m.note}</p>
            </div>
            <div class="row" style="gap:var(--sp-3)">
              ${m.on ? html`<span class="badge badge--success">✓ Actif</span>` : html`<button type="button" class="btn btn--outline btn--sm" data-act="connect-payment" data-id="${m.id}">Connecter</button>`}
              <button type="button" class="switch" role="switch" aria-checked="${state.payments.includes(m.id)}"
                data-act="toggle-payment" data-id="${m.id}" aria-label="${m.label}">
                <span class="switch__track"></span>
              </button>
            </div>
          </div>`
        )}
      </div>`,
      { sub: 'Ce que vous activez ici apparaît immédiatement côté client.' }
    )}

    <p class="tiny dim">${raw(icon('shield', { size: 13 }))} Les comptes Stripe, PayPal et Wero sont les vôtres. Kenako n’y a jamais accès.</p>`;
}

function subscription() {
  const current = PLANS.find((p) => p.current);

  return html`
    <div class="banner banner--danger">
      <span class="banner__icon" aria-hidden="true">✕</span>
      <span><strong class="banner__title">Prélèvement refusé — facture KEN-2026-0912</strong>
      ${money(79)} · carte expirée. Votre boutique reste active jusqu’au 10 septembre.</span>
      <button type="button" class="btn btn--sm btn--danger" data-act="update-card">Mettre à jour</button>
    </div>

    ${sectionCard(
      'Votre formule',
      html`
        <div class="grid grid--3">
          ${PLANS.map(
            (p) => html`
            <article class="card card--flat card--pad stack-sm ${p.current ? '' : ''}"
              style="${p.current ? 'border-color:var(--primary);box-shadow:inset 0 0 0 1px var(--primary)' : ''}">
              <div class="between">
                <strong>${p.name}</strong>
                ${p.current ? html`<span class="badge badge--primary">Formule en cours</span>` : ''}
              </div>
              <p><span class="num" style="font-size:26px;font-weight:700">${money(p.price)}</span><span class="tiny dim"> / mois</span></p>
              <p class="tiny dim">ou ${money(p.yearly)} par an (2 mois offerts)</p>
              <ul class="stack-sm" style="gap:4px">
                ${p.features.map((f) => html`<li class="tiny row" style="gap:6px">${raw(icon('check', { size: 13 }))} ${f}</li>`)}
              </ul>
              ${p.current
                ? html`<button type="button" class="btn btn--outline btn--block btn--sm" data-act="cancel-plan">Résilier</button>`
                : html`<button type="button" class="btn btn--primary btn--block btn--sm" data-act="change-plan" data-name="${p.name}">
                    ${p.price > current.price ? 'Passer à cette formule' : 'Rétrograder'}</button>`}
            </article>`
          )}
        </div>`
    )}

    ${sectionCard(
      'Factures',
      html`
        <div class="table-wrap">
          <table class="table">
            <thead><tr><th>Facture</th><th>Date</th><th>Montant</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              ${INVOICES.map(
                (i) => html`
                <tr>
                  <td class="num">${i.id}</td>
                  <td>${i.date}</td>
                  <td class="num">${money(i.amount)}</td>
                  <td>${stateBadge(i.status)}</td>
                  <td><button type="button" class="btn btn--ghost btn--sm" data-act="download-invoice" data-id="${i.id}">
                    ${raw(icon('download', { size: 15 }))} PDF</button></td>
                </tr>`
              )}
            </tbody>
          </table>
        </div>`,
      { sub: `Abonnement ${RESTO.plan} · prélèvement le 1er du mois` }
    )}`;
}
