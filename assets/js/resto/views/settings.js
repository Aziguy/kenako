/**
 * B11 — Paramètres
 * Fiche établissement, horaires par jour, fermetures exceptionnelles,
 * personnalisation de la page publique, comptes staff et notifications.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { RESTO, HOURS, STAFF, ROLE_RIGHTS } from '../../data/resto.js';
import { sectionCard } from '../components.js';

const TABS = [
  { id: 'etablissement', label: 'Établissement' },
  { id: 'horaires', label: 'Horaires' },
  { id: 'page', label: 'Ma page' },
  { id: 'equipe', label: 'Équipe' },
  { id: 'notifications', label: 'Notifications' },
];

const ACCENTS = ['#C9451A', '#F5A524', '#157A5B', '#B02E1F', '#2F5D6B', '#7A4E1F'];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.settingsTab || 'etablissement';

  return html`
    <div class="bo-page">
      <div class="bo-head">
        <div>
          <h1 class="bo-title">Paramètres</h1>
          <p class="bo-sub">${RESTO.name} · SIRET ${RESTO.siret}</p>
        </div>
        <button type="button" class="btn btn--primary btn--sm" data-act="save-settings">Enregistrer</button>
      </div>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="settings-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      ${tab === 'etablissement' ? establishment() : ''}
      ${tab === 'horaires' ? hours() : ''}
      ${tab === 'page' ? publicPage(state) : ''}
      ${tab === 'equipe' ? team() : ''}
      ${tab === 'notifications' ? notifications(state) : ''}
    </div>`;
}

function establishment() {
  return sectionCard(
    'Fiche de l’établissement',
    html`
      <div class="grid grid--2" style="gap:var(--sp-4)">
        <label class="field"><span class="field__label">Nom commercial</span><input class="input" value="${RESTO.name}"></label>
        <label class="field"><span class="field__label">Type de cuisine</span><input class="input" value="${RESTO.cuisine}"></label>
        <label class="field" style="grid-column:1/-1"><span class="field__label">Adresse</span><input class="input" value="${RESTO.address}"></label>
        <label class="field"><span class="field__label">SIRET</span><input class="input num" value="${RESTO.siret}"></label>
        <label class="field"><span class="field__label">Téléphone public</span><input class="input" value="01 43 55 12 08"></label>
        <label class="field" style="grid-column:1/-1"><span class="field__label">Présentation</span>
          <textarea class="textarea" rows="3">Marie a ouvert son bistrot en 2019 après dix ans en cuisine étoilée. Tout est fait maison, la carte change chaque semaine.</textarea></label>
      </div>`
  );
}

function hours() {
  return html`
    ${sectionCard(
      'Horaires d’ouverture',
      html`<div class="divider-list">
        ${HOURS.map(
          (h) => html`
          <div class="between" style="padding:var(--sp-3) 0">
            <strong style="width:110px">${h.day}</strong>
            <span class="tiny ${h.open ? '' : 'dim'}" style="flex:1">${h.slots}</span>
            <div class="row" style="gap:var(--sp-2)">
              <button type="button" class="btn btn--ghost btn--sm" data-act="edit-hours" data-day="${h.day}">
                ${raw(icon('edit', { size: 15 }))}</button>
              <button type="button" class="switch" role="switch" aria-checked="${h.open}" aria-label="${h.day}">
                <span class="switch__track"></span>
              </button>
            </div>
          </div>`
        )}
      </div>`,
      { sub: 'Plusieurs créneaux possibles par jour' }
    )}

    ${sectionCard(
      'Fermetures exceptionnelles',
      html`
        <div class="stack-sm">
          <div class="between" style="padding:var(--sp-3);border:1px solid var(--line);border-radius:var(--r-md)">
            <div><strong>Congés annuels</strong><p class="tiny dim">Du 10 au 24 août 2027</p></div>
            <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="delete-closure" aria-label="Supprimer">
              ${raw(icon('trash', { size: 15 }))}</button>
          </div>
          <button type="button" class="btn btn--outline btn--block btn--sm" data-act="new-closure">
            ${raw(icon('plus', { size: 15 }))} Ajouter une fermeture</button>
        </div>`
    )}`;
}

function publicPage(state) {
  return sectionCard(
    'Personnalisation de votre page',
    html`
      <div class="stack">
        <div class="field">
          <span class="field__label">Couleur d’accent</span>
          <div class="row-wrap">
            ${ACCENTS.map(
              (c) => html`<button type="button" class="btn btn--icon" style="background:${c};border-radius:50%;${state.accent === c ? 'outline:3px solid var(--ink);outline-offset:2px' : ''}"
                data-act="pick-accent" data-color="${c}" aria-label="Couleur ${c}" aria-pressed="${state.accent === c}"></button>`
            )}
          </div>
          <span class="field__hint">Utilisée sur votre bannière et vos boutons côté client.</span>
        </div>

        <div class="field">
          <span class="field__label">Bannière</span>
          <div class="thumb" style="--tint:${state.accent};aspect-ratio:21/9;border-radius:var(--r-md)">
            <span class="thumb__slot" style="align-items:center;justify-content:center">
              <button type="button" class="btn btn--sm" data-act="upload-banner">${raw(icon('edit', { size: 15 }))} Remplacer</button>
            </span>
          </div>
        </div>

        <div class="field">
          <span class="field__label">Logo</span>
          <div class="row">
            <span class="logo-mark logo-mark--lg" style="background:${state.accent}">C</span>
            <button type="button" class="btn btn--outline btn--sm" data-act="upload-logo">Téléverser un logo</button>
          </div>
        </div>

        <a class="btn btn--outline btn--sm" href="client.html#/r/comptoir" target="_blank" rel="noopener">
          ${raw(icon('eye', { size: 15 }))} Voir ma page publique
        </a>
      </div>`
  );
}

function team() {
  return sectionCard(
    'Comptes staff & rôles',
    html`
      <div class="table-wrap">
        <table class="table">
          <thead><tr><th>Membre</th><th>Rôle</th><th>Droits</th><th>Dernière activité</th><th></th></tr></thead>
          <tbody>
            ${STAFF.map(
              (s) => html`
              <tr>
                <td><div class="row"><span class="avatar">${s.name.slice(0, 1)}</span>
                  <div style="display:grid"><strong>${s.name}</strong><span class="tiny dim">${s.email}</span></div></div></td>
                <td><span class="badge badge--outline">${s.role}</span></td>
                <td class="tiny dim">${(ROLE_RIGHTS[s.role] || []).join(' · ')}</td>
                <td class="tiny">${s.last === 'En ligne' ? html`<span class="badge badge--success"><span class="badge__dot"></span>En ligne</span>` : s.last}</td>
                <td><button type="button" class="btn btn--ghost btn--sm" data-act="edit-staff" data-name="${s.name}">
                  ${raw(icon('edit', { size: 15 }))}</button></td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>`,
    { action: '<button type="button" class="btn btn--primary btn--sm" data-act="new-staff">Inviter un membre</button>' }
  );
}

function notifications(state) {
  const items = [
    { id: 'newOrder', label: 'Nouvelle commande', hint: 'Son + badge sur tous les appareils connectés' },
    { id: 'review', label: 'Nouvel avis', hint: 'Alerte immédiate en dessous de 3 étoiles' },
    { id: 'stock', label: 'Rupture de stock', hint: 'Quand un plat passe en rupture' },
    { id: 'billing', label: 'Facturation', hint: 'Prélèvement, échec de paiement, relance' },
  ];

  return sectionCard(
    'Notifications',
    html`<div class="divider-list">
      ${items.map(
        (n) => html`
        <div class="between" style="padding:var(--sp-3) 0">
          <div style="min-width:0"><strong class="tiny">${n.label}</strong><p class="tiny dim">${n.hint}</p></div>
          <button type="button" class="switch" role="switch" aria-checked="${state.notifs[n.id] ?? true}"
            data-act="resto-notif" data-id="${n.id}" aria-label="${n.label}">
            <span class="switch__track"></span>
          </button>
        </div>`
      )}
    </div>`
  );
}
