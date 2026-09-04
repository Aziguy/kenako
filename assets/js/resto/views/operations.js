/**
 * B8 & B9 — Événements, réservations, plan de salle et QR codes de table
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money, number } from '../../core/format.js';
import { RESTO_EVENTS, RESERVATIONS, TABLES, RESTO } from '../../data/resto.js';
import { sectionCard, stateBadge } from '../components.js';

/* -------------------------------------------------------- B8 Événements */

export function eventsView() {
  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Événements</h1>
          <p class="bo-sub">Soirées, brunchs, concerts — avec billetterie ou simple réservation.</p>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-act="new-event">
          ${raw(icon('plus', { size: 16 }))} Créer un événement
        </button>
      </div>

      <div class="grid grid--cards">
        ${RESTO_EVENTS.map((e) => {
          const ratio = e.cap ? e.sold / e.cap : 0;
          return html`
            <article class="card">
              <div class="thumb" style="--tint:${RESTO.tint};aspect-ratio:16/9;border-radius:0">
                <span class="thumb__slot" style="align-items:flex-start;justify-content:flex-end">
                  ${e.status === 'Publié' ? stateBadge('publié') : stateBadge('brouillon')}
                </span>
                <span class="thumb__label">${e.date}</span>
              </div>
              <div class="card__body stack-sm">
                <h3 class="card__title">${e.title}</h3>
                <div class="row-wrap">
                  <span class="badge badge--outline">${e.mode}</span>
                  <span class="badge badge--accent">${e.price ? money(e.price) : 'Entrée libre'}</span>
                </div>
                <div class="stack-sm" style="gap:5px">
                  <div class="between tiny">
                    <span class="dim">Jauge</span>
                    <span class="num">${number(e.sold)} / ${number(e.cap)}</span>
                  </div>
                  <div class="progress"><div class="progress__bar" style="width:${ratio * 100}%"></div></div>
                </div>
                <div class="row" style="gap:var(--sp-2)">
                  <button type="button" class="btn btn--outline btn--sm" style="flex:1" data-act="edit-event" data-title="${e.title}">Modifier</button>
                  <button type="button" class="btn btn--ghost btn--sm" data-act="share-event" data-title="${e.title}">
                    ${raw(icon('share', { size: 15 }))}</button>
                </div>
              </div>
            </article>`;
        })}
      </div>
    </div>`;
}

/* ------------------------------------------- B9 Réservations & tables */

export function reservationsView(ctx) {
  const { state } = ctx;
  const tab = state.reservationTab || 'liste';
  const covers = RESERVATIONS.reduce((sum, r) => sum + r.covers, 0);

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Réservations</h1>
          <p class="bo-sub">${number(RESERVATIONS.length)} réservations · ${number(covers)} couverts aujourd’hui</p>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-act="new-reservation">
          ${raw(icon('plus', { size: 16 }))} Ajouter
        </button>
      </div>

      <div class="tabs" role="tablist">
        ${[
          { id: 'liste', label: 'Liste' },
          { id: 'salle', label: 'Plan de salle' },
          { id: 'qr', label: 'QR codes de table' },
        ].map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="reservation-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      ${tab === 'liste'
        ? sectionCard(
            'Aujourd’hui',
            html`
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Heure</th><th>Nom</th><th>Couverts</th><th>Table</th><th>Téléphone</th><th>Note</th><th>Statut</th><th></th></tr></thead>
                  <tbody>
                    ${RESERVATIONS.map(
                      (r) => html`
                      <tr>
                        <td class="num strong">${r.time}</td>
                        <td>${r.name}</td>
                        <td class="num">${r.covers}</td>
                        <td class="num">${r.table}</td>
                        <td><a href="tel:${r.phone.replace(/\s/g, '')}">${r.phone}</a></td>
                        <td class="dim">${r.note || '—'}</td>
                        <td>${stateBadge(r.status.toLowerCase())}</td>
                        <td>
                          ${r.status === 'En attente'
                            ? html`<button type="button" class="btn btn--success btn--sm" data-act="confirm-reservation" data-name="${r.name}">Confirmer</button>`
                            : html`<button type="button" class="btn btn--ghost btn--sm" data-act="edit-reservation" data-name="${r.name}">${raw(icon('edit', { size: 15 }))}</button>`}
                        </td>
                      </tr>`
                    )}
                  </tbody>
                </table>
              </div>`
          )
        : ''}

      ${tab === 'salle'
        ? sectionCard(
            'Plan de salle',
            html`
              <div class="floorplan">
                ${TABLES.map((t) => {
                  const booked = RESERVATIONS.find((r) => r.table === t.no);
                  const busy = t.no === '7';
                  return html`
                    <button type="button" class="floor-table ${busy ? 'is-busy' : booked ? 'is-booked' : ''}"
                      data-act="open-table" data-no="${t.no}">
                      <span class="floor-table__no">${t.no}</span>
                      <span class="tiny">${t.seats} couverts</span>
                      <span class="tiny dim">${busy ? 'Occupée' : booked ? booked.time : t.zone}</span>
                    </button>`;
                })}
              </div>
              <div class="legend" style="margin-top:var(--sp-4)">
                <span class="legend__item"><span class="legend__swatch" style="background:var(--primary)"></span>Occupée</span>
                <span class="legend__item"><span class="legend__swatch" style="background:var(--warning)"></span>Réservée</span>
                <span class="legend__item"><span class="legend__swatch" style="background:var(--line-strong)"></span>Libre</span>
              </div>`
          )
        : ''}

      ${tab === 'qr'
        ? sectionCard(
            'QR codes de table',
            html`
              <p class="tiny dim">Chaque QR ouvre la carte avec le numéro de table pré-rempli. Imprimez-les et posez-les sur vos tables.</p>
              <div class="grid grid--tiles" style="margin-top:var(--sp-4)">
                ${TABLES.map(
                  (t) => html`
                  <div class="qr-tile">
                    <div class="qr-art" aria-hidden="true">${raw(icon('qr', { size: 56, stroke: 1.4 }))}</div>
                    <strong>Table ${t.no}</strong>
                    <span class="tiny dim">${t.seats} couverts · ${t.zone}</span>
                    <a class="btn btn--outline btn--sm btn--block" href="client.html#/table/${t.no}">Tester</a>
                  </div>`
                )}
              </div>`,
            { action: '<button type="button" class="btn btn--primary btn--sm no-print" data-act="print-qr">' + icon('print', { size: 15 }) + ' Imprimer la planche</button>' }
          )
        : ''}
    </div>`;
}
