/**
 * A8 — Compte client
 * Commandes, adresses, favoris, cartes de fidélité (une par restaurant),
 * parrainage, notifications et paramètres.
 */

import { html, raw } from '../../core/dom.js';
import { icon } from '../../core/icons.js';
import { money } from '../../core/format.js';
import { PAST_ORDERS, ADDRESSES, LOYALTY_CARDS } from '../../data/client.js';
import { RESTAURANTS, getRestaurant } from '../../data/restaurants.js';
import { restoCard, emptyState } from '../components.js';

const TABS = [
  { id: 'orders', label: 'Commandes' },
  { id: 'loyalty', label: 'Fidélité' },
  { id: 'favorites', label: 'Favoris' },
  { id: 'addresses', label: 'Adresses' },
  { id: 'settings', label: 'Réglages' },
];

export function view(ctx) {
  const { state } = ctx;
  const tab = state.accountTab || 'orders';

  return html`
    <div class="wrap" style="padding-bottom:var(--sp-12)">
      <header class="between" style="padding:var(--sp-5) 0">
        <div class="row">
          <span class="avatar avatar--lg">${state.firstName.slice(0, 1)}</span>
          <div style="display:grid">
            <h1 class="page__title">${state.firstName}</h1>
            <p class="tiny dim">${state.phone} · ${state.email}</p>
          </div>
        </div>
        <button type="button" class="btn btn--ghost btn--sm desktop-only" data-act="logout">
          ${raw(icon('logout', { size: 16 }))} Se déconnecter
        </button>
      </header>

      <div class="tabs" role="tablist">
        ${TABS.map(
          (t) => html`<button type="button" class="tab" role="tab" data-act="account-tab" data-tab="${t.id}"
            aria-selected="${tab === t.id}">${t.label}</button>`
        )}
      </div>

      <div role="tabpanel" style="padding-top:var(--sp-5)">
        ${tab === 'orders' ? ordersPanel() : ''}
        ${tab === 'loyalty' ? loyaltyPanel(state) : ''}
        ${tab === 'favorites' ? favoritesPanel(state) : ''}
        ${tab === 'addresses' ? addressesPanel() : ''}
        ${tab === 'settings' ? settingsPanel(state) : ''}
      </div>
    </div>`;
}

function ordersPanel() {
  return html`
    <div class="stack">
      ${PAST_ORDERS.map(
        (o) => html`
        <article class="card card--pad stack-sm">
          <div class="between">
            <div class="row" style="min-width:0">
              <span class="thumb" style="--tint:${getRestaurant(o.restId).tint};width:40px;height:40px;border-radius:var(--r-sm)"></span>
              <div style="display:grid;min-width:0">
                <strong class="truncate">${o.restaurant}</strong>
                <span class="tiny dim">${o.date} · <span class="num">${o.id}</span></span>
              </div>
            </div>
            <span class="badge ${o.refunded ? 'badge--danger' : 'badge--success'}">
              ${o.refunded ? '✕' : '✓'} ${o.status}
            </span>
          </div>
          <p class="tiny muted">${o.items}</p>
          <div class="between">
            <span class="num strong">${money(o.total)}</span>
            <div class="row" style="gap:var(--sp-2)">
              ${o.points ? html`<span class="badge badge--accent">+${o.points} pts</span>` : ''}
              ${o.stamps ? html`<span class="badge badge--accent">+${o.stamps} tampons</span>` : ''}
              ${o.cashback ? html`<span class="badge badge--accent">+${money(o.cashback)} cagnotte</span>` : ''}
              <button type="button" class="btn btn--outline btn--sm" data-act="reorder" data-id="${o.restId}">
                ${raw(icon('copy', { size: 15 }))} Recommander
              </button>
            </div>
          </div>
        </article>`
      )}
    </div>`;
}

function loyaltyPanel(state) {
  return html`
    <div class="stack" style="gap:var(--sp-5)">
      <p class="tiny dim">Chaque restaurant définit et finance son propre programme. Kenako n’en impose aucun.</p>

      <div class="grid grid--cards">
        ${LOYALTY_CARDS.map((c) => {
          const r = getRestaurant(c.restId);
          const ratio = Math.min(1, c.value / c.target);
          return html`
            <article class="loyalty-card" style="--tint:${r.tint}">
              <div class="between" style="position:relative;z-index:1">
                <strong style="font-family:var(--font-display);font-size:19px">${r.name}</strong>
                <span class="badge" style="background:rgba(255,255,255,.22);color:#fff">${c.type}</span>
              </div>
              ${c.type === 'tampons'
                ? html`<div class="stamps">
                    ${Array.from({ length: c.target }, (_, i) => html`<span class="stamp ${i < c.value ? 'is-on' : ''}">${i < c.value ? '✓' : ''}</span>`)}
                  </div>`
                : html`
                  <div style="position:relative;z-index:1;display:grid;gap:6px">
                    <span class="num" style="font-size:30px;font-weight:700">${c.label}</span>
                    <div class="progress" style="background:rgba(255,255,255,.25)">
                      <div class="progress__bar" style="width:${ratio * 100}%;background:#fff"></div>
                    </div>
                  </div>`}
              <p class="tiny" style="position:relative;z-index:1;opacity:.92">${c.next}</p>
            </article>`;
        })}
      </div>

      <article class="card card--pad stack-sm">
        <h2 class="card__title">Votre code de parrainage</h2>
        <p class="tiny muted">Partagez-le : la récompense dépend du restaurant qui l’honore.</p>
        <div class="row" style="gap:var(--sp-2)">
          <input class="input num" value="CAMILLE-2026" readonly aria-label="Votre code de parrainage">
          <button type="button" class="btn btn--primary" data-act="copy-referral">${raw(icon('copy', { size: 16 }))} Copier</button>
        </div>
        <dl class="kv">
          <dt>Filleuls</dt><dd>3 personnes ont commandé</dd>
          <dt>Gagné</dt><dd>15 € de réductions cumulées</dd>
        </dl>
      </article>
    </div>`;
}

function favoritesPanel(state) {
  const list = RESTAURANTS.filter((r) => state.favorites.includes(r.id));
  if (!list.length) {
    return emptyState({
      art: '🤍',
      title: 'Aucun favori pour le moment',
      text: 'Touchez le cœur sur une fiche restaurant pour la retrouver ici en un geste.',
      action: '<a class="btn btn--primary" href="#/">Explorer les restaurants</a>',
    });
  }
  return html`<div class="grid grid--cards">${list.map((r) => restoCard(r, { favorite: true }))}</div>`;
}

function addressesPanel() {
  return html`
    <div class="stack">
      ${ADDRESSES.map(
        (a) => html`
        <article class="card card--pad between">
          <div class="row" style="min-width:0">
            <span class="empty__art" style="width:40px;height:40px;font-size:17px" aria-hidden="true">
              ${a.id === 'home' ? '🏠' : '🏢'}
            </span>
            <div style="display:grid;min-width:0">
              <strong>${a.label} ${a.def ? html`<span class="badge badge--success">Par défaut</span>` : ''}</strong>
              <span class="tiny dim truncate">${a.line} · ${a.detail}</span>
            </div>
          </div>
          <button type="button" class="btn btn--ghost btn--icon btn--sm" data-act="edit-address" data-id="${a.id}" aria-label="Modifier ${a.label}">
            ${raw(icon('edit', { size: 16 }))}
          </button>
        </article>`
      )}
      <button type="button" class="btn btn--outline btn--block" data-act="new-address">
        ${raw(icon('plus', { size: 17 }))} Ajouter une adresse
      </button>
    </div>`;
}

function settingsPanel(state) {
  const notifs = [
    { id: 'push', label: 'Notifications push', hint: 'Statut de commande en temps réel' },
    { id: 'sms', label: 'SMS', hint: 'Confirmation et arrivée du livreur' },
    { id: 'email', label: 'E-mail', hint: 'Récapitulatifs et factures' },
    { id: 'promo', label: 'Offres des restaurants suivis', hint: 'Promotions et événements' },
  ];

  return html`
    <div class="stack" style="gap:var(--sp-5)">
      <article class="card card--pad stack">
        <h2 class="card__title">Notifications</h2>
        <div class="divider-list">
          ${notifs.map(
            (n) => html`
            <div class="between" style="padding:var(--sp-3) 0">
              <div style="display:grid;min-width:0">
                <strong class="tiny">${n.label}</strong>
                <span class="tiny dim">${n.hint}</span>
              </div>
              <button type="button" class="switch" role="switch" aria-checked="${state.notifs[n.id]}"
                data-act="notif" data-id="${n.id}" aria-label="${n.label}">
                <span class="switch__track"></span>
              </button>
            </div>`
          )}
        </div>
      </article>

      <article class="card card--pad stack">
        <h2 class="card__title">Apparence</h2>
        <div class="between">
          <div style="display:grid">
            <strong class="tiny">Thème sombre</strong>
            <span class="tiny dim">Suit votre système par défaut</span>
          </div>
          <button type="button" class="btn btn--outline btn--sm" data-act="toggle-theme">Basculer</button>
        </div>
      </article>

      <article class="card card--pad stack-sm">
        <h2 class="card__title">Données & prototype</h2>
        <p class="tiny dim">Le panier, les favoris et le thème sont enregistrés dans ce navigateur uniquement.</p>
        <button type="button" class="btn btn--danger btn--sm" data-act="reset-demo">
          ${raw(icon('trash', { size: 15 }))} Réinitialiser la démonstration
        </button>
      </article>
    </div>`;
}
