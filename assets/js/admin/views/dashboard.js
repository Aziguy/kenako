/**
 * C1 — Tableau de bord plateforme
 * MRR, parc de restaurants, conversion d'essai, churn et répartition
 * géographique. Le volume de commandes est affiché à titre indicatif :
 * la plateforme ne touche jamais cet argent.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { moneyShort, number, percent } from '../../core/format.js';
import { areaChart, barList, donut } from '../../core/charts.js';
import { ADMIN_KPI, MRR_12, MRR_MONTHS, CITIES, ADMIN_PLANS, RESTAURATEURS, UNPAID, FLAGGED_REVIEWS } from '../../data/admin.js';
import { statTile, panel } from '../components.js';
import { createMap } from '../../core/map.js';

let handle = null;

export function view() {
  const pending = RESTAURATEURS.filter((r) => r.status === 'en attente');
  const totalSubs = ADMIN_PLANS.reduce((s, p) => s + p.subs, 0);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Pilotage de la plateforme</h1>
          <p class="bo-sub">Septembre 2026 · ${number(ADMIN_KPI.active)} restaurants actifs</p>
        </div>
        <div class="row" style="gap:var(--sp-2)">
          <button type="button" class="btn btn--outline btn--sm" data-act="export-report">
            ${raw(icon('download', { size: 16 }))} Rapport mensuel
          </button>
          <a class="btn btn--primary btn--sm" href="#/restaurateurs">
            ${raw(icon('building', { size: 16 }))} ${number(pending.length)} dossiers à valider
          </a>
        </div>
      </div>

      ${pending.length
        ? html`<div class="banner banner--warning">
            <span class="banner__icon" aria-hidden="true">!</span>
            <span><strong class="banner__title">${number(pending.length)} inscriptions en attente de validation</strong>
            ${pending.map((p) => p.name).join(', ')} — délai annoncé : 48 h ouvrées.</span>
            <a class="btn btn--sm btn--outline" href="#/restaurateurs">Traiter</a>
          </div>`
        : ''}

      <div class="grid grid--stats">
        ${statTile({ label: 'MRR', value: moneyShort(ADMIN_KPI.mrr), current: ADMIN_KPI.mrr, previous: ADMIN_KPI.mrrPrev, spark: MRR_12 })}
        ${statTile({ label: 'Restaurants actifs', value: number(ADMIN_KPI.active), current: ADMIN_KPI.active, previous: ADMIN_KPI.active - 8 })}
        ${statTile({ label: 'Conversion d’essai', value: percent(ADMIN_KPI.trialConv / 100), current: ADMIN_KPI.trialConv, previous: ADMIN_KPI.trialConvPrev })}
        ${statTile({ label: 'Churn mensuel', value: percent(ADMIN_KPI.churn / 100), current: ADMIN_KPI.churn, previous: ADMIN_KPI.churnPrev })}
        ${statTile({ label: 'En attente', value: number(ADMIN_KPI.pending) })}
        ${statTile({ label: 'Suspendus', value: number(ADMIN_KPI.suspended) })}
        ${statTile({ label: 'Nouveaux inscrits', value: number(ADMIN_KPI.signups), current: ADMIN_KPI.signups, previous: ADMIN_KPI.signupsPrev })}
      </div>

      ${panel(
        'À traiter maintenant',
        html`<div class="grid grid--3">
          <a class="card card--flat card--pad stack-sm" href="#/restaurateurs" style="text-decoration:none;color:inherit">
            <span class="stat__label">Comptes à valider</span>
            <span class="stat__value">${number(pending.length)}</span>
            <span class="tiny strong" style="color:var(--primary-strong)">Ouvrir la file →</span>
          </a>
          <a class="card card--flat card--pad stack-sm" href="#/abonnements" style="text-decoration:none;color:inherit">
            <span class="stat__label">Impayés</span>
            <span class="stat__value">${moneyShort(UNPAID.reduce((sum, u) => sum + u.amount, 0))}</span>
            <span class="tiny strong" style="color:var(--primary-strong)">${number(UNPAID.length)} comptes · relancer →</span>
          </a>
          <a class="card card--flat card--pad stack-sm" href="#/support" style="text-decoration:none;color:inherit">
            <span class="stat__label">Avis signalés</span>
            <span class="stat__value">${number(FLAGGED_REVIEWS.length)}</span>
            <span class="tiny strong" style="color:var(--primary-strong)">Modérer →</span>
          </a>
        </div>`
      )}

      <div class="grid grid--sidebar">
        ${panel(
          'Revenu récurrent mensuel',
          html`
            ${raw(areaChart(MRR_12, { label: 'MRR sur 12 mois', formatter: moneyShort, height: 200, color: 'var(--herb)', fill: 'color-mix(in srgb, var(--herb) 16%, transparent)' }))}
            <div class="between tiny dim" style="margin-top:var(--sp-2)">
              <span>${MRR_MONTHS[0]}</span><span>${MRR_MONTHS[5]}</span><span>${MRR_MONTHS[11]}</span>
            </div>`,
          { sub: '12 derniers mois · abonnements uniquement' }
        )}

        ${panel(
          'Répartition par formule',
          html`
            <div class="row" style="gap:var(--sp-4);flex-wrap:wrap">
              ${raw(donut(ADMIN_PLANS.map((p) => ({ label: p.name, value: p.subs, color: p.color })), {
                center: `<div><strong class="num" style="font-size:22px">${number(totalSubs)}</strong><br><span class="tiny dim">abonnés</span></div>`,
              }))}
              <ul class="stack-sm" style="flex:1;min-width:140px">
                ${ADMIN_PLANS.map(
                  (p) => html`<li class="between tiny">
                    <span class="row" style="gap:6px"><span class="legend__swatch" style="background:${p.color}"></span>${p.name}</span>
                    <span class="num">${number(p.subs)} · ${moneyShort(p.subs * p.monthly)}</span>
                  </li>`
                )}
              </ul>
            </div>`
        )}
      </div>

      <div class="grid grid--sidebar">
        ${panel(
          'Répartition géographique',
          html`<div class="map-canvas" id="admin-map" style="height:320px" aria-label="Carte des restaurants par ville"></div>`,
          { sub: `${number(CITIES.reduce((s, c) => s + c.restos, 0))} restaurants dans ${number(CITIES.length)} villes` }
        )}

        ${panel(
          'MRR par ville',
          raw(barList(CITIES.map((c) => ({ label: c.name, value: c.mrr })), { formatter: moneyShort, color: 'var(--herb)' }))
        )}
      </div>

      ${panel(
        'Volume de commandes traité',
        html`
          <div class="row" style="gap:var(--sp-5);flex-wrap:wrap;align-items:flex-end">
            <div>
              <span class="num" style="font-size:34px;font-weight:700">${number(ADMIN_KPI.orders30)}</span>
              <p class="tiny dim">commandes sur 30 jours</p>
            </div>
            <div class="readonly-banner" style="flex:1;min-width:260px">
              ${raw(icon('eye', { size: 18 }))}
              <span>${number(ADMIN_KPI.orders30)} commandes traitées sur 30 jours — indicateur d’usage de la
              plateforme uniquement. Kenako n’encaisse aucune de ces commandes et ne peut ni les modifier
              ni les annuler.</span>
            </div>
          </div>`
      )}
    </div>`;
}

export function mount() {
  const container = document.getElementById('admin-map');
  handle?.destroy();
  handle = null;
  if (!container) return;

  handle = createMap(container, { center: [46.7, 2.5], zoom: 5 });
  if (!handle) return;
  handle.setMarkers(CITIES.map((c) => ({ id: c.name, lat: c.lat, lng: c.lng, name: c.name, label: String(c.restos), wide: true })));
  handle.fit(CITIES, 40);
  handle.invalidate();
}

export function unmount() {
  handle?.destroy();
  handle = null;
}
