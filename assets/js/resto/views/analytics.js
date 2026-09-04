/**
 * Extension — Analytique avancée
 * Heures de pointe, rentabilité par plat, taux de refus et temps de
 * préparation : les chiffres qu'un restaurateur regarde une fois par semaine.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, moneyShort, number, percent, delta, duration } from '../../core/format.js';
import { areaChart, columnChart, heatmap, barList, donut } from '../../core/charts.js';
import { KPI, REVENUE_30, TOP_DISHES, PEAK_HOURS, ORDERS } from '../../data/resto.js';
import { stat, sectionCard } from '../components.js';

export function view(ctx) {
  const byMode = ['livraison', 'emporter', 'surplace'].map((m, i) => ({
    label: { livraison: 'Livraison', emporter: 'À emporter', surplace: 'Sur place' }[m],
    value: ORDERS.filter((o) => o.mode === m).length,
    color: ['var(--primary)', 'var(--accent)', 'var(--herb)'][i],
  }));
  const totalOrders = byMode.reduce((sum, s) => sum + s.value, 0) || 1;

  const hourly = PEAK_HOURS.cols.map((c, i) => ({
    label: c, short: c,
    value: PEAK_HOURS.matrix.reduce((sum, row) => sum + row[i], 0),
  }));

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Analytique</h1>
          <p class="bo-sub">30 derniers jours · Le Comptoir de Marie</p>
        </div>
        <div class="row" style="gap:var(--sp-2)">
          <div class="segmented">
            ${['7 j', '30 j', '90 j'].map(
              (p) => html`<button type="button" class="segmented__item" data-act="period" data-id="${p}"
                aria-selected="${(ctx.state.period || '30 j') === p}">${p}</button>`
            )}
          </div>
          <button type="button" class="btn btn--outline btn--sm" data-act="export-analytics">
            ${raw(icon('download', { size: 16 }))} Exporter
          </button>
        </div>
      </div>

      <div class="grid grid--stats">
        ${stat({ label: 'CA sur la période', value: moneyShort(REVENUE_30.reduce((a, b) => a + b, 0)), current: KPI.revenue, previous: KPI.revenuePrev })}
        ${stat({ label: 'Panier moyen', value: money(KPI.basket), current: KPI.basket, previous: KPI.basketPrev })}
        ${stat({ label: 'Taux de refus', value: percent(KPI.refusalRate / 100), current: KPI.refusalRate, previous: KPI.refusalRatePrev })}
        ${stat({ label: 'Temps de préparation', value: duration(KPI.prepTime), current: KPI.prepTime, previous: KPI.prepTimePrev, unit: ' min' })}
      </div>

      ${sectionCard(
        'Chiffre d’affaires',
        raw(areaChart(REVENUE_30, { label: 'Chiffre d’affaires sur 30 jours', formatter: moneyShort, height: 200 })),
        { sub: 'Jour par jour' }
      )}

      <div class="grid grid--sidebar">
        ${sectionCard(
          'Heures de pointe',
          html`
            ${raw(columnChart(hourly, { label: 'Commandes par créneau horaire', formatter: (v) => `${v} commandes` }))}
            <div style="margin-top:var(--sp-5)">
              ${raw(heatmap(PEAK_HOURS.matrix, { rows: PEAK_HOURS.rows, cols: PEAK_HOURS.cols, formatter: (v) => `${v} commandes` }))}
            </div>
            <p class="tiny dim" style="margin-top:var(--sp-3)">
              Votre pic : samedi 20 h (22 commandes). Prévoyez un renfort en cuisine ou activez le mode rush.
            </p>`,
          { sub: 'Jour × créneau, sur 30 jours' }
        )}

        ${sectionCard(
          'Répartition par mode',
          html`
            <div class="row" style="gap:var(--sp-4);align-items:center;flex-wrap:wrap">
              ${raw(donut(byMode, { center: `<div><strong class="num" style="font-size:22px">${number(totalOrders)}</strong><br><span class="tiny dim">commandes</span></div>` }))}
              <ul class="stack-sm" style="flex:1;min-width:140px">
                ${byMode.map(
                  (s) => html`<li class="between tiny">
                    <span class="row" style="gap:6px"><span class="legend__swatch" style="background:${s.color}"></span>${s.label}</span>
                    <span class="num">${percent(s.value / totalOrders)}</span>
                  </li>`
                )}
              </ul>
            </div>`
        )}
      </div>

      ${sectionCard(
        'Rentabilité par plat',
        html`
          <div class="table-wrap">
            <table class="table">
              <thead><tr><th>Plat</th><th>Vendus</th><th>CA</th><th>Coût matière</th><th>Marge</th><th>Contribution</th></tr></thead>
              <tbody>
                ${[...TOP_DISHES].sort((a, b) => b.margin - a.margin).map(
                  (d) => html`
                  <tr>
                    <td><strong>${d.name}</strong></td>
                    <td class="num">${number(d.qty)}</td>
                    <td class="num">${moneyShort(d.revenue)}</td>
                    <td class="num dim">${moneyShort(d.cost)}</td>
                    <td>
                      <span class="badge badge--${d.margin >= 65 ? 'success' : d.margin >= 50 ? 'warning' : 'danger'}">
                        ${d.margin >= 65 ? '▲' : d.margin >= 50 ? '—' : '▼'} ${d.margin} %
                      </span>
                    </td>
                    <td style="min-width:110px">
                      <div class="progress" style="height:6px">
                        <div class="progress__bar" style="width:${((d.revenue - d.cost) / (TOP_DISHES[0].revenue - TOP_DISHES[0].cost)) * 100}%;background:var(--herb)"></div>
                      </div>
                    </td>
                  </tr>`
                )}
              </tbody>
            </table>
          </div>
          <p class="tiny dim" style="margin-top:var(--sp-3)">
            ${raw(icon('sparkle', { size: 13 }))} Le poisson du jour est votre plat le moins rentable (44 %).
            Une hausse de 1,50 € le ramènerait à la moyenne de la carte.
          </p>`,
        { sub: 'Coût matière saisi dans la fiche de chaque plat' }
      )}

      ${sectionCard(
        'Motifs de refus',
        raw(barList(
          [
            { label: 'Article en rupture de stock', value: 6 },
            { label: 'Cuisine surchargée', value: 4 },
            { label: 'Hors zone de livraison', value: 3 },
            { label: 'Coordonnées incomplètes', value: 1 },
          ],
          { color: 'var(--danger)', formatter: (v) => `${v} commandes` }
        )),
        { sub: `Taux de refus ${percent(KPI.refusalRate / 100)} · ${delta(KPI.refusalRate - KPI.refusalRatePrev, ' pt')} vs mois précédent` }
      )}
    </div>`;
}
