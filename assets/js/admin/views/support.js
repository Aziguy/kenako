/**
 * C7 — Support & modération
 * Tickets, avis signalés, journal d'audit et comptes administrateurs.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { number, initials } from '../../core/format.js';
import { TICKETS, FLAGGED_REVIEWS, AUDIT, ADMINS, ADMIN_ROLE_RIGHTS } from '../../data/admin.js';
import { panel, badge } from '../components.js';

const TABS = [
  { id: 'tickets', label: 'Tickets' },
  { id: 'moderation', label: 'Modération' },
  { id: 'audit', label: 'Journal d’audit' },
  { id: 'admins', label: 'Administrateurs' },
];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.supportTab || 'tickets';
  const open = TICKETS.filter((t) => t.status !== 'résolu').length;

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Support & modération</h1>
          <p class="bo-sub">${number(open)} tickets ouverts · ${number(FLAGGED_REVIEWS.length)} avis signalés</p>
        </div>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="support-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      ${tab === 'tickets'
        ? panel(
            'Tickets support',
            html`
              <div class="table-wrap">
                <table class="table table--clickable">
                  <thead><tr><th>Ticket</th><th>Sujet</th><th>Émetteur</th><th>Priorité</th><th>Âge</th><th>Statut</th></tr></thead>
                  <tbody>
                    ${TICKETS.map(
                      (t) => html`
                      <tr data-act="open-ticket" data-id="${t.id}">
                        <td class="num strong">${t.id}</td>
                        <td>${t.subject}</td>
                        <td class="dim">${t.from}</td>
                        <td>${badge(t.prio)}</td>
                        <td class="dim">${t.age}</td>
                        <td>${badge(t.status)}</td>
                      </tr>`
                    )}
                  </tbody>
                </table>
              </div>`,
            { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-ticket">Nouveau ticket</button>' }
          )
        : ''}

      ${tab === 'moderation'
        ? panel(
            'Avis signalés',
            FLAGGED_REVIEWS.length
              ? html`<div class="stack">
                  ${FLAGGED_REVIEWS.map(
                    (r) => html`
                    <article class="card card--flat card--pad stack-sm" style="border-left:3px solid var(--danger)">
                      <div class="between">
                        <div class="row">
                          <span class="avatar">${initials(r.author)}</span>
                          <div style="display:grid">
                            <strong>${r.author}</strong>
                            <span class="tiny dim">sur ${r.resto} · ${r.date}</span>
                          </div>
                        </div>
                        <span class="badge badge--danger">! ${r.reason}</span>
                      </div>
                      <p class="tiny muted" style="line-height:1.55">${r.text}</p>
                      <div class="row" style="gap:var(--sp-2)">
                        <button type="button" class="btn btn--danger btn--sm" data-act="remove-review" data-author="${r.author}">
                          Supprimer l’avis</button>
                        <button type="button" class="btn btn--outline btn--sm" data-act="keep-review" data-author="${r.author}">
                          Conserver</button>
                        <button type="button" class="btn btn--ghost btn--sm" data-act="contact-author" data-author="${r.author}">
                          Contacter l’auteur</button>
                      </div>
                    </article>`
                  )}
                </div>`
              : html`<div class="empty"><div class="empty__art">✓</div>
                  <p class="empty__title">Rien à modérer</p>
                  <p class="empty__text">Aucun avis signalé en attente.</p></div>`
          )
        : ''}

      ${tab === 'audit'
        ? panel(
            'Journal des actions administratives',
            html`<div class="divider-list">
              ${AUDIT.map(
                (a) => html`
                <div class="between" style="padding:var(--sp-3) 0;gap:var(--sp-4)">
                  <div style="min-width:0">
                    <strong class="tiny">${a.what}</strong>
                    <p class="tiny dim">${a.who}</p>
                  </div>
                  <span class="tiny dim" style="white-space:nowrap">${a.when}</span>
                </div>`
              )}
            </div>`,
            { sub: 'Conservé 24 mois · exportable sur demande',
              action: '<button type="button" class="btn btn--outline btn--sm" data-act="export-audit">' + icon('download', { size: 15 }) + ' Exporter</button>' }
          )
        : ''}

      ${tab === 'admins'
        ? panel(
            'Comptes administrateurs',
            html`
              <div class="table-wrap">
                <table class="table">
                  <thead><tr><th>Administrateur</th><th>Rôle</th><th>Droits</th><th>Dernière activité</th><th></th></tr></thead>
                  <tbody>
                    ${ADMINS.map(
                      (a) => html`
                      <tr>
                        <td><div class="row"><span class="avatar">${initials(a.name)}</span>
                          <div style="display:grid"><strong>${a.name}</strong><span class="tiny dim">${a.email}</span></div></div></td>
                        <td><span class="badge badge--outline">${a.role}</span></td>
                        <td class="tiny dim">${(ADMIN_ROLE_RIGHTS[a.role] || []).join(' · ')}</td>
                        <td class="tiny">${a.last === 'En ligne'
                          ? html`<span class="badge badge--success"><span class="badge__dot"></span>En ligne</span>`
                          : a.last}</td>
                        <td><button type="button" class="btn btn--ghost btn--sm" data-act="edit-admin" data-name="${a.name}">
                          ${raw(icon('edit', { size: 15 }))}</button></td>
                      </tr>`
                    )}
                  </tbody>
                </table>
              </div>`,
            { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-admin">Inviter un administrateur</button>' }
          )
        : ''}
    </div>`;
}
