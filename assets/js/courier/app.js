/**
 * Kenako — Application livreur (extension)
 * -------------------------------------------------------------------------
 * Pensée pour être utilisée d'une main, casque sur les oreilles : peu
 * d'écrans, de grandes cibles, un seul geste principal par étape.
 * Le livreur appartient au restaurant : la plateforme ne gère pas les courses.
 */

import { html, raw, render, delegate } from '../core/dom.js';
import { createStore } from '../core/store.js';
import { createRouter } from '../core/router.js';
import { initTheme, toggleTheme } from '../core/theme.js';
import { toastOk, toastInfo, toastWarn } from '../core/toast.js';
import { openModal } from '../core/sheet.js';
import { icon } from '../core/icons.js';
import { money, number, duration, clock } from '../core/format.js';
import { bottomNav, brandMark, themeButton, spaceSwitcher, spaceSwitcherSheet } from '../core/shell.js';
import { createMap } from '../core/map.js';
import { RESTO, ORDERS } from '../data/resto.js';

/* ------------------------------------------------------------------ État */

const RUNS = ORDERS.filter((o) => o.mode === 'livraison' && o.lat).map((o, i) => ({
  id: o.id,
  client: o.client,
  address: o.address,
  detail: o.detail,
  phone: o.phone,
  total: o.total,
  payment: o.payment,
  items: o.items.reduce((sum, it) => sum + it.q, 0),
  lat: o.lat,
  lng: o.lng,
  distance: [1.2, 0.8, 1.6, 2.1][i % 4],
  eta: [8, 6, 11, 14][i % 4],
  status: i === 0 ? 'proposed' : i === 1 ? 'accepted' : 'proposed',
}));

const store = createStore(
  {
    online: true,
    runs: RUNS,
    current: null,
    proof: { kind: 'code', code: '', note: '' },
    earnings: { today: 42.5, runs: 6, tips: 7 },
  },
  { persist: 'kenako:courier', persistKeys: ['online'] }
);

const VIEWS = {
  runs: runsView,
  navigation: navigationView,
  proof: proofView,
  earnings: earningsView,
};

const router = createRouter({
  routes: { '/': 'runs', '/course/:id': 'navigation', '/preuve/:id': 'proof', '/gains': 'earnings' },
  fallback: '/',
  onChange: (route) => {
    if (route.params.id) store.set({ current: route.params.id }, { silent: true });
    destroyMap();
    paint();
  },
});

const ctx = { get state() { return store.state; }, store, router };

/* --------------------------------------------------------------- Écrans */

function runsView({ state }) {
  const accepted = state.runs.filter((r) => r.status === 'accepted');
  const proposed = state.runs.filter((r) => r.status === 'proposed');

  return html`
    <div class="wrap wrap--narrow page">
      <div class="accept-toggle ${state.online ? '' : 'is-off'}">
        <div style="flex:1;min-width:0">
          <strong>${state.online ? 'En service' : 'Hors service'}</strong>
          <p class="tiny dim">${state.online ? `Créneau 11h–15h · ${clock()}` : 'Vous ne recevez plus de courses'}</p>
        </div>
        <button type="button" class="switch" role="switch" aria-checked="${state.online}" data-act="toggle-online"
          aria-label="Passer en service">
          <span class="switch__track"></span>
        </button>
      </div>

      ${accepted.length
        ? html`
          <section class="section">
            <h2 class="section__title">Course en cours</h2>
            ${accepted.map((r) => runCard(r, true))}
          </section>`
        : ''}

      <section class="section">
        <div class="section__head">
          <h2 class="section__title">Courses proposées</h2>
          <span class="tiny dim">${number(proposed.length)}</span>
        </div>
        ${state.online
          ? proposed.length
            ? proposed.map((r) => runCard(r, false))
            : html`<div class="empty"><div class="empty__art">🛵</div>
                <p class="empty__title">Aucune course pour l’instant</p>
                <p class="empty__text">Les nouvelles courses de ${RESTO.name} arrivent ici avec un son.</p></div>`
          : html`<div class="empty"><div class="empty__art">😴</div>
              <p class="empty__title">Vous êtes hors service</p>
              <p class="empty__text">Passez en service pour recevoir des courses.</p></div>`}
      </section>
    </div>`;
}

function runCard(run, active) {
  return html`
    <article class="card card--pad stack-sm" style="border-left:3px solid ${active ? 'var(--success)' : 'var(--primary)'}">
      <div class="between">
        <span class="num strong">${run.id}</span>
        <span class="badge ${active ? 'badge--success' : 'badge--primary'}">
          ${active ? '🛵 En cours' : '● Nouvelle'}
        </span>
      </div>
      <div class="row" style="gap:var(--sp-4);flex-wrap:wrap;font-size:var(--fs-sm)">
        <span class="row" style="gap:5px">${raw(icon('pin', { size: 15 }))} ${run.distance} km</span>
        <span class="row" style="gap:5px">${raw(icon('clock', { size: 15 }))} ${duration(run.eta)}</span>
        <span class="row" style="gap:5px">${raw(icon('bag', { size: 15 }))} ${number(run.items)} articles</span>
      </div>
      <div>
        <strong>${run.client}</strong>
        <p class="tiny dim">${run.address}${run.detail ? ` · ${run.detail}` : ''}</p>
      </div>
      <div class="between">
        <span class="badge ${run.payment.includes('Espèces') ? 'badge--warning' : 'badge--outline'}">${run.payment}</span>
        <strong class="num">${money(run.total)}</strong>
      </div>
      ${active
        ? html`<a class="btn btn--primary btn--block" href="#/course/${run.id}">
            ${raw(icon('map', { size: 17 }))} Ouvrir la navigation</a>`
        : html`<div class="row" style="gap:var(--sp-2)">
            <button type="button" class="btn btn--ghost" data-act="decline-run" data-id="${run.id}">Passer</button>
            <button type="button" class="btn btn--accent" style="flex:1" data-act="accept-run" data-id="${run.id}">
              Accepter la course</button>
          </div>`}
    </article>`;
}

function navigationView({ state }) {
  const run = state.runs.find((r) => r.id === state.current);
  if (!run) return html`<div class="wrap page"><p class="lead">Course introuvable.</p><a class="btn btn--primary" href="#/">Retour</a></div>`;

  return html`
    <div style="position:relative">
      <div class="map-canvas map-canvas--full" id="courier-map" role="application" aria-label="Itinéraire de livraison"></div>
      <div class="map-tools map-tools--top">
        <a class="btn btn--sm btn--icon" href="#/" aria-label="Retour">${raw(icon('arrowLeft', { size: 17 }))}</a>
        <span class="badge badge--lg" style="background:var(--surface);box-shadow:var(--shadow-md)">
          ${run.distance} km · ${duration(run.eta)}
        </span>
      </div>
    </div>

    <div class="actionbar">
      <div class="actionbar__inner" style="flex-direction:column;align-items:stretch;gap:var(--sp-3)">
        <div class="between">
          <div style="min-width:0">
            <strong>${run.client}</strong>
            <p class="tiny dim truncate">${run.address}${run.detail ? ` · ${run.detail}` : ''}</p>
          </div>
          <a class="btn btn--outline btn--icon" href="tel:${run.phone.replace(/\s/g, '')}" aria-label="Appeler le client">
            ${raw(icon('phone', { size: 17 }))}
          </a>
        </div>
        <a class="btn btn--accent btn--block" href="#/preuve/${run.id}">
          ${raw(icon('check', { size: 18 }))} Je suis arrivé
        </a>
      </div>
    </div>`;
}

function proofView({ state }) {
  const run = state.runs.find((r) => r.id === state.current);
  if (!run) return html`<div class="wrap page"><p class="lead">Course introuvable.</p><a class="btn btn--primary" href="#/">Retour</a></div>`;

  const kinds = [
    { id: 'code', label: 'Code à 4 chiffres', hint: 'Communiqué au client' },
    { id: 'photo', label: 'Photo du dépôt', hint: 'Livraison sans contact' },
    { id: 'signature', label: 'Signature', hint: 'Sur l’écran du téléphone' },
  ];

  return html`
    <div class="wrap wrap--narrow page" style="padding-bottom:140px">
      <div class="row">
        <a class="btn btn--ghost btn--icon btn--sm" href="#/course/${run.id}" aria-label="Retour">${raw(icon('arrowLeft', { size: 18 }))}</a>
        <h1 class="page__title">Preuve de livraison</h1>
      </div>

      <article class="card card--pad stack-sm">
        <div class="between">
          <span class="num strong">${run.id}</span>
          <span class="badge badge--outline">${run.payment}</span>
        </div>
        <strong>${run.client}</strong>
        <p class="tiny dim">${run.address}${run.detail ? ` · ${run.detail}` : ''}</p>
      </article>

      ${run.payment.includes('Espèces')
        ? html`<div class="banner banner--warning">
            <span class="banner__icon" aria-hidden="true">💶</span>
            <span><strong class="banner__title">Encaissement à faire</strong>
            Récupérez ${money(run.total)} en espèces avant de valider.</span>
          </div>`
        : ''}

      <section class="card card--pad stack">
        <h2 class="card__title">Comment validez-vous ?</h2>
        <div class="stack-sm">
          ${kinds.map(
            (k) => html`
            <button type="button" class="option" role="radio" aria-checked="${state.proof.kind === k.id}"
              data-act="proof-kind" data-id="${k.id}">
              <span class="option__mark">${state.proof.kind === k.id ? raw(icon('check', { size: 12, stroke: 3 })) : ''}</span>
              <span style="display:grid;gap:2px"><span class="strong tiny">${k.label}</span>
              <span class="tiny dim">${k.hint}</span></span>
            </button>`
          )}
        </div>

        ${state.proof.kind === 'code'
          ? html`<label class="field"><span class="field__label">Code communiqué par le client</span>
              <input class="input num" inputmode="numeric" maxlength="4" placeholder="1408" data-bind="proofCode"
                style="font-size:24px;text-align:center;letter-spacing:.4em"></label>`
          : ''}
        ${state.proof.kind === 'photo'
          ? html`<button type="button" class="doc-viewer" data-act="take-photo" style="width:100%;border:0">
              ${raw(icon('eye', { size: 26 }))}<span class="tiny">Prendre une photo du dépôt</span></button>`
          : ''}
        ${state.proof.kind === 'signature'
          ? html`<div class="doc-viewer" style="aspect-ratio:3/1">
              <span class="tiny">Faites signer le client ici</span></div>`
          : ''}
      </section>
    </div>

    <div class="actionbar">
      <div class="actionbar__inner">
        <button type="button" class="btn btn--success btn--block" data-act="complete-run" data-id="${run.id}">
          ${raw(icon('check', { size: 18 }))} Livraison terminée
        </button>
      </div>
    </div>`;
}

function earningsView({ state }) {
  const e = state.earnings;
  return html`
    <div class="wrap wrap--narrow page">
      <h1 class="page__title">Mes gains</h1>
      <div class="grid grid--stats">
        <div class="stat"><span class="stat__label">Aujourd’hui</span><span class="stat__value">${money(e.today)}</span></div>
        <div class="stat"><span class="stat__label">Courses</span><span class="stat__value">${number(e.runs)}</span></div>
        <div class="stat"><span class="stat__label">Pourboires</span><span class="stat__value">${money(e.tips)}</span></div>
      </div>

      <article class="card card--pad stack-sm">
        <h2 class="card__title">Comment ça marche</h2>
        <p class="tiny muted" style="line-height:1.6">
          Vous êtes salarié ou prestataire de ${RESTO.name}. Vos gains sont versés par le restaurant,
          selon les règles convenues avec lui. Kenako ne prélève rien et n’intervient pas dans cette relation.
        </p>
      </article>

      <article class="card card--pad stack-sm">
        <h2 class="card__title">Historique</h2>
        <div class="divider-list">
          ${['K-48215 · 11:12 · 4,50 €', 'K-48208 · 10:44 · 4,50 €', 'K-48201 · 10:12 · 6,00 € (pourboire 1,50 €)'].map(
            (line) => html`<p class="tiny" style="padding:var(--sp-3) 0">${line}</p>`
          )}
        </div>
      </article>
    </div>`;
}

/* --------------------------------------------------------------- Rendu */

let mapHandle = null;
function destroyMap() { mapHandle?.destroy(); mapHandle = null; }

const NAV = [
  { id: 'runs', label: 'Courses', icon: 'truck', href: '#/' },
  { id: 'navigation', label: 'Navigation', icon: 'map', href: '#/' },
  { id: 'earnings', label: 'Gains', icon: 'wallet', href: '#/gains' },
];

function paint() {
  const route = router.current;
  const view = VIEWS[route.name] ?? runsView;
  const accepted = store.state.runs.filter((r) => r.status === 'accepted');

  render('#app', html`
    <header class="topbar">
      <a class="topbar__brand" href="#/">${brandMark('Kenako', 'Livreur · Karim T.')}</a>
      <div class="topbar__actions">
        ${themeButton()}
        ${spaceSwitcher('courier')}
      </div>
    </header>
    <main class="main" id="main">${view(ctx)}</main>
    ${bottomNav(
      NAV.map((n) => (n.id === 'navigation'
        ? { ...n, href: accepted.length ? `#/course/${accepted[0].id}` : '#/', badge: accepted.length || undefined }
        : n)),
      route.name
    )}
  `);

  if (route.name === 'navigation') mountMap();
}

function mountMap() {
  const container = document.getElementById('courier-map');
  if (!container) return;
  const run = store.state.runs.find((r) => r.id === store.state.current);
  if (!run) return;

  destroyMap();
  mapHandle = createMap(container, { center: [run.lat, run.lng], zoom: 15 });
  if (!mapHandle) return;
  mapHandle.setMarkers([
    { id: 'resto', lat: RESTO.lat, lng: RESTO.lng, name: RESTO.name, label: '🍽️' },
    { id: 'client', lat: run.lat, lng: run.lng, name: run.client, label: '📍' },
  ]);
  mapHandle.fit([{ lat: RESTO.lat, lng: RESTO.lng }, { lat: run.lat, lng: run.lng }], 60);
  mapHandle.invalidate();
}

/* ------------------------------------------------------------- Actions */

const ACTIONS = {
  'toggle-theme': () => { toggleTheme(); paint(); },
  'open-spaces': () => openModal({
    title: '<h2 style="font-size:20px">Parcours du prototype</h2>',
    body: spaceSwitcherSheet('courier'),
  }),
  'toggle-online': () => {
    store.set((s) => ({ online: !s.online }));
    toastInfo(store.state.online ? 'Vous êtes en service' : 'Vous êtes hors service');
  },
  'accept-run': ({ id }) => {
    store.set((s) => ({ runs: s.runs.map((r) => (r.id === id ? { ...r, status: 'accepted' } : r)) }));
    toastOk(`Course ${id} acceptée`);
    router.go(`/course/${id}`);
  },
  'decline-run': ({ id }) => {
    store.set((s) => ({ runs: s.runs.filter((r) => r.id !== id) }));
    toastWarn(`Course ${id} passée — elle est proposée à un autre livreur`);
  },
  'proof-kind': ({ id }) => store.set((s) => ({ proof: { ...s.proof, kind: id } })),
  'take-photo': () => toastInfo('Appareil photo — la photo est jointe à la preuve de livraison.'),
  'complete-run': ({ id }) => {
    store.set((s) => ({ runs: s.runs.filter((r) => r.id !== id), earnings: { ...s.earnings, today: s.earnings.today + 4.5, runs: s.earnings.runs + 1 } }));
    toastOk(`Livraison ${id} validée · le client est prévenu`);
    router.go('/');
  },
};

/* --------------------------------------------------------------- Démarrage */

initTheme();
store.subscribe(paint);

const root = document.getElementById('app');
delegate(root, 'click', ACTIONS);
root.addEventListener('input', (event) => {
  const el = event.target.closest('[data-bind="proofCode"]');
  if (!el) return;
  store.set((s) => ({ proof: { ...s.proof, code: el.value } }), { silent: true });
});

router.start();
