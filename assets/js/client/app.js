/**
 * Kenako — Espace client
 * -------------------------------------------------------------------------
 * Assemble le magasin d'état, le routeur et les vues. Toute interaction passe
 * par `data-act`, ce qui garde les gabarits déclaratifs et le comportement
 * regroupé en un seul endroit.
 */

import { html, raw, render, delegate, bindInputs, debounce, esc } from '../core/dom.js';
import { createStore } from '../core/store.js';
import { createRouter } from '../core/router.js';
import { initTheme, toggleTheme } from '../core/theme.js';
import { toastOk, toastWarn, toastErr, toastInfo } from '../core/toast.js';
import { openModal, closeModal } from '../core/sheet.js';
import { icon } from '../core/icons.js';
import { money, orderId } from '../core/format.js';
import { bottomNav, spaceSwitcher, spaceSwitcherSheet, brandMark, themeButton } from '../core/shell.js';

import { getRestaurant, MODE_LABELS, PAYMENT_LABELS, SORTS } from '../data/restaurants.js';
import { ADDRESSES } from '../data/client.js';
import { findDish, COMBOS } from '../data/menus.js';

import { addLine, setQty, countItems, computeTotals, checkPromo, lineKey } from './cart.js';
import * as HomeView from './views/home.js';
import * as MapView from './views/map.js';
import * as RestaurantView from './views/restaurant.js';
import * as BasketView from './views/basket.js';
import * as CheckoutView from './views/checkout.js';
import * as TrackingView from './views/tracking.js';
import * as ConfirmView from './views/confirm.js';
import * as AccountView from './views/account.js';
import * as TableView from './views/table.js';
import * as StatesView from './views/states.js';
import { openDishSheet } from './views/dish-sheet.js';

/* ------------------------------------------------------------------ État */

const store = createStore(
  {
    query: '', filters: [], sort: 'reco', loading: false, geoDenied: false,
    address: '27 rue Keller, 75011 Paris',
    favorites: ['napoli', 'awa', 'racines'],
    restId: 'comptoir', restTab: 'menu', mapSelected: null,
    cart: [], mode: 'livraison', slot: 'Au plus vite', step: 1,
    firstName: 'Camille', phone: '06 12 34 56 78', email: 'camille.r@gmail.com',
    promoInput: '', promoCode: null, promoMessage: '',
    tip: 0, payment: 'card', cardNumber: '', payError: false, paying: false,
    lastOrder: null, trackStep: 0,
    accountTab: 'orders', tableNo: 12, splitOpen: false, split: null,
    notifs: { push: true, sms: true, email: false, promo: true },
  },
  { persist: 'kenako:client', persistKeys: ['cart', 'favorites', 'restId', 'address', 'firstName', 'phone', 'email', 'notifs', 'lastOrder'] }
);

const VIEWS = {
  home: HomeView, map: MapView, restaurant: RestaurantView, basket: BasketView,
  checkout: CheckoutView, tracking: TrackingView, confirm: ConfirmView,
  account: AccountView, table: TableView, states: StatesView,
};

const router = createRouter({
  routes: {
    '/': 'home',
    '/carte': 'map',
    '/r/:id': 'restaurant',
    '/panier': 'basket',
    '/commande/:step': 'checkout',
    '/suivi': 'tracking',
    '/merci': 'confirm',
    '/compte': 'account',
    '/table/:no': 'table',
    '/etats': 'states',
  },
  fallback: '/',
  onChange: (route, previous) => {
    if (previous && VIEWS[previous.name]?.unmount) VIEWS[previous.name].unmount();
    const patch = {};
    if (route.name === 'restaurant' && route.params.id) patch.restId = route.params.id;
    if (route.name === 'checkout') patch.step = Number(route.params.step) || 1;
    if (route.name === 'table') patch.tableNo = route.params.no;
    store.set(patch, { silent: true });
    paint();
  },
});

/** Contexte transmis aux vues. */
const ctx = {
  get state() { return store.state; },
  store,
  router,
  addToCart,
};

/* --------------------------------------------------------------- Rendu */

const NAV = [
  { id: 'home', label: 'Découvrir', icon: 'compass', href: '#/' },
  { id: 'map', label: 'Carte', icon: 'map', href: '#/carte' },
  { id: 'basket', label: 'Panier', icon: 'bag', href: '#/panier' },
  { id: 'tracking', label: 'Suivi', icon: 'receipt', href: '#/suivi' },
  { id: 'account', label: 'Compte', icon: 'user', href: '#/compte' },
];

function topbar(routeName) {
  const links = [
    { label: 'Découvrir', href: '#/', id: 'home' },
    { label: 'Carte', href: '#/carte', id: 'map' },
    { label: 'Commande à table', href: '#/table/12', id: 'table' },
    { label: 'États limites', href: '#/etats', id: 'states' },
  ];
  const count = countItems(store.state.cart);

  return html`
    <header class="topbar">
      <a class="topbar__brand" href="#/">${brandMark('Kenako', 'Espace client')}</a>
      <nav class="topbar__nav" aria-label="Sections">
        ${links.map(
          (l) => html`<a class="topbar__link ${routeName === l.id ? 'is-active' : ''}" href="${l.href}">${l.label}</a>`
        )}
      </nav>
      <div class="topbar__actions">
        ${themeButton()}
        ${spaceSwitcher('client')}
        <a class="btn btn--primary btn--sm desktop-only" href="#/panier">
          ${raw(icon('bag', { size: 16 }))} ${count ? count : ''} Panier
        </a>
      </div>
    </header>`;
}

function cartBar(routeName) {
  const { cart, restId, mode, promoCode, tip } = store.state;
  const hideOn = ['basket', 'checkout', 'confirm', 'tracking', 'table'];
  if (!cart.length || hideOn.includes(routeName)) return '';
  const t = computeTotals({ cart, restId, mode, promoCode, tip });

  return html`
    <div class="cartbar">
      <a class="cartbar__inner" href="#/panier">
        <span class="cartbar__count">${countItems(cart)}</span>
        <span style="display:grid;line-height:1.2">
          <strong style="font-size:var(--fs-md)">Voir le panier</strong>
          <span style="font-size:var(--fs-xs);opacity:.85">${t.restaurant.name}</span>
        </span>
        <span class="spacer"></span>
        <strong class="num">${money(t.total)}</strong>
        ${raw(icon('chevronRight', { size: 18 }))}
      </a>
    </div>`;
}

function paint() {
  const route = router.current;
  const view = VIEWS[route.name] ?? HomeView;

  // Mémorise le champ actif : un rendu complet le remplacerait sinon.
  const active = document.activeElement?.dataset?.bind || null;
  const caret = active ? document.activeElement.selectionStart : null;

  render('#app', html`
    ${topbar(route.name)}
    <main class="main" id="main">${view.view(ctx)}</main>
    ${cartBar(route.name)}
    ${bottomNav(
      NAV.map((n) => (n.id === 'basket' && countItems(store.state.cart)
        ? { ...n, badge: countItems(store.state.cart) }
        : n)),
      route.name
    )}
  `);

  if (active) {
    const field = document.querySelector(`[data-bind="${active}"]`);
    if (field) {
      field.focus({ preventScroll: true });
      if (caret !== null && field.setSelectionRange) {
        try { field.setSelectionRange(caret, caret); } catch { /* type non compatible */ }
      }
    }
  }

  view.mount?.(ctx);
}

/* ------------------------------------------------------------- Actions */

function addToCart(line) {
  const { cart, restId } = store.state;
  if (cart.length && restId !== line.restId) {
    openModal({
      title: '<h2 style="font-size:20px">Changer de restaurant ?</h2>',
      body: `<p class="muted">Votre panier contient des plats de <strong>${esc(getRestaurant(restId).name)}</strong>.
        Chaque commande va directement à un seul restaurant : ajouter ce plat videra le panier actuel.</p>`,
      foot: `<div class="row" style="gap:var(--sp-2)">
        <button type="button" class="btn btn--ghost" style="flex:1" data-act="sheet-close">Garder mon panier</button>
        <button type="button" class="btn btn--primary" style="flex:1" data-act="switch-resto">Vider et ajouter</button>
      </div>`,
      onAction: (data) => {
        if (data.act !== 'switch-resto') return;
        store.set({ cart: [line], restId: line.restId, promoCode: null, promoMessage: '' });
        closeModal();
        toastOk(`${line.name} ajouté · nouveau panier`, { action: 'Voir', onAction: () => router.go('/panier') });
      },
    });
    return;
  }

  store.set((s) => ({ cart: addLine(s.cart, line), restId: line.restId }));
  toastOk(`${line.qty}× ${line.name} ajouté`, { action: 'Voir le panier', onAction: () => router.go('/panier') });
}

const ACTIONS = {
  /* --- transverse --- */
  'toggle-theme': () => { toggleTheme(); paint(); },
  'open-spaces': () => openModal({
    title: '<h2 style="font-size:20px">Parcours du prototype</h2>',
    body: spaceSwitcherSheet('client'),
  }),

  /* --- découverte --- */
  filter: ({ id }) => store.set((s) => ({
    filters: s.filters.includes(id) ? s.filters.filter((f) => f !== id) : [...s.filters, id],
  })),
  'clear-filters': () => store.set({ filters: [], query: '' }),
  suggest: ({ q }) => store.set({ query: q, filters: [] }),
  fav: ({ id }) => {
    const on = store.state.favorites.includes(id);
    store.set((s) => ({ favorites: on ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] }));
    toastOk(on ? 'Retiré de vos favoris' : `${getRestaurant(id).name} ajouté à vos favoris`);
  },
  'retry-geo': () => {
    store.set({ geoDenied: false, loading: true });
    setTimeout(() => store.set({ loading: false, address: '27 rue Keller, 75011 Paris' }), 700);
  },
  'open-address': () => openModal({
    title: '<h2 style="font-size:20px">Où livrer ?</h2>',
    body: `<div class="stack-sm">
      ${ADDRESSES.map((a) => `<button type="button" class="option" data-act="pick-address" data-line="${esc(a.line)}">
        <span class="option__mark">${icon('pin', { size: 12 })}</span>
        <span style="display:grid;gap:2px"><span class="strong tiny">${esc(a.label)}</span>
        <span class="tiny dim">${esc(a.line)}</span></span></button>`).join('')}
      <label class="field"><span class="field__label">Autre adresse</span>
        <input class="input" placeholder="12 rue de Charonne, 75011 Paris" data-field="address"></label>
      <button type="button" class="btn btn--outline btn--block" data-act="use-geo">
        ${icon('pin', { size: 16 })} Utiliser ma position</button>
    </div>`,
    onAction: (data) => {
      if (data.act === 'pick-address') { store.set({ address: data.line }); closeModal(); }
      if (data.act === 'use-geo') {
        closeModal();
        store.set({ geoDenied: true });
        toastWarn('Position refusée par le navigateur : nous gardons votre adresse enregistrée.');
      }
    },
  }),
  'open-sort': () => openModal({
    title: '<h2 style="font-size:20px">Trier les restaurants</h2>',
    body: `<div class="stack-sm">${SORTS.map(
      (s) => `<button type="button" class="option" role="radio" aria-checked="${store.state.sort === s.id}"
        data-act="pick-sort" data-id="${s.id}">
        <span class="option__mark">${store.state.sort === s.id ? icon('check', { size: 12, stroke: 3 }) : ''}</span>
        <span>${esc(s.label)}</span></button>`
    ).join('')}</div>`,
    onAction: (data) => {
      if (data.act !== 'pick-sort') return;
      store.set({ sort: data.id });
      closeModal();
    },
  }),

  /* --- carte ---
     La sélection est gérée par la vue elle-même : passer par le magasin
     provoquerait un rendu complet, donc la destruction de la carte Leaflet. */
  peek: ({ id }) => MapView.select(ctx, id, { fly: true }),
  'close-peek': () => MapView.clearSelection(ctx),
  'search-here': () => { store.set({ loading: false }); toastInfo('Recherche relancée sur la zone affichée.'); },
  recenter: () => { MapView.recenter(); toastInfo('Carte recentrée sur votre adresse.'); },

  /* --- fiche restaurant --- */
  'rest-tab': ({ tab }) => store.set({ restTab: tab }),
  share: ({ id }) => {
    const r = getRestaurant(id);
    const url = `${location.origin}${location.pathname}#/r/${id}`;
    if (navigator.share) navigator.share({ title: r.name, url }).catch(() => {});
    else copy(url, `Lien vers ${r.name} copié`);
  },
  'open-dish': ({ dish, rest }) => openDishSheet(ctx, rest, dish),
  'sold-out': ({ dish, rest }) => {
    const d = findDish(rest, dish);
    toastWarn(`${d?.name ?? 'Ce plat'} n’est plus disponible aujourd’hui.`);
  },
  'add-combo': ({ id, rest }) => {
    const combo = (COMBOS[rest] || []).find((c) => c.id === id);
    if (!combo) return;
    addToCart({ key: lineKey(combo.id), restId: rest, dishId: combo.id, name: combo.name, unit: combo.price, qty: 1, opts: 'Formule' });
  },
  'book-event': ({ title }) => toastOk(`Demande envoyée pour « ${title} ». Le restaurant vous confirme sous 24 h.`),

  /* --- panier --- */
  'line-qty': ({ key, delta }) => {
    const line = store.state.cart.find((l) => l.key === key);
    if (!line) return;
    const next = line.qty + Number(delta);
    store.set((s) => ({ cart: setQty(s.cart, key, next) }));
    if (next <= 0) toastInfo(`${line.name} retiré du panier`);
  },
  'clear-cart': () => {
    store.set({ cart: [], promoCode: null, promoMessage: '', promoInput: '' });
    toastInfo('Panier vidé');
  },
  'min-order': () => toastWarn('Minimum de commande non atteint pour la livraison.'),

  /* --- tunnel --- */
  mode: ({ id }) => store.set({ mode: id }),
  address: ({ line }) => store.set({ address: line }),
  'new-address': () => ACTIONS['open-address'](),
  slot: ({ id }) => store.set({ slot: id }),
  tip: ({ value }) => store.set({ tip: Number(value) }),
  payment: ({ id }) => store.set({ payment: id, payError: false }),
  'apply-promo': () => {
    const { promoInput, cart } = store.state;
    const sub = cart.reduce((s, l) => s + l.unit * l.qty, 0);
    const result = checkPromo(promoInput, sub);
    store.set({ promoCode: result.ok ? result.code : null, promoMessage: result.message });
    if (result.ok) toastOk(result.message);
  },
  'next-step': () => {
    const { step, mode, address } = store.state;
    if (step === 1 && mode === 'livraison' && /Versailles|78\d{3}/.test(address)) {
      toastErr('Cette adresse est hors de la zone de livraison du restaurant.');
      return;
    }
    if (step === 2 && (!store.state.firstName.trim() || !store.state.phone.trim())) {
      toastErr('Prénom et téléphone sont nécessaires pour vous prévenir.');
      return;
    }
    router.go(`/commande/${Math.min(3, step + 1)}`);
  },
  pay: () => {
    const s = store.state;
    if (s.payment === 'card' && s.cardNumber.replace(/\s/g, '') === '4000000000000002') {
      store.set({ payError: true });
      toastErr('Paiement refusé par la banque. Votre panier est conservé.');
      return;
    }
    store.set({ paying: true, payError: false });
    setTimeout(() => {
      const t = computeTotals({ cart: s.cart, restId: s.restId, mode: s.mode, promoCode: s.promoCode, tip: s.tip });
      store.set({
        paying: false,
        trackStep: 0,
        lastOrder: {
          id: orderId(Date.now()),
          restId: s.restId,
          firstName: s.firstName,
          mode: s.mode,
          modeLabel: MODE_LABELS[s.mode],
          slot: s.slot,
          address: s.mode === 'livraison' ? s.address : t.restaurant.address,
          paymentLabel: PAYMENT_LABELS[s.payment],
          total: t.total,
          points: t.points,
          eta: t.restaurant.etaMin,
          lines: s.cart,
        },
        cart: [],
        promoCode: null,
        promoInput: '',
        promoMessage: '',
      });
      router.go('/merci');
      startTracking();
    }, 1100);
  },

  /* --- suivi & confirmation --- */
  'advance-track': () => store.set((s) => ({ trackStep: Math.min(5, s.trackStep + 1) })),
  'share-order': () => copy(`${location.origin}${location.pathname}#/suivi`, 'Lien de suivi copié — il fonctionne sans compte.'),
  'create-account': () => {
    toastOk('Compte créé ! Vos points ont été crédités.');
    router.go('/compte');
  },
  rate: ({ value }) => toastOk(`Merci ! Note de ${value}/5 envoyée au restaurant.`),

  /* --- compte --- */
  'account-tab': ({ tab }) => store.set({ accountTab: tab }),
  reorder: ({ id }) => router.go(`/r/${id}`),
  notif: ({ id }) => store.set((s) => ({ notifs: { ...s.notifs, [id]: !s.notifs[id] } })),
  'copy-referral': () => copy('CAMILLE-2026', 'Code de parrainage copié'),
  'edit-address': () => toastInfo('Édition d’adresse — écran à concevoir en phase 2.'),
  logout: () => toastInfo('Déconnexion simulée : le prototype reste utilisable sans compte.'),
  'reset-demo': () => {
    store.reset();
    toastOk('Démonstration réinitialisée');
    router.go('/');
  },

  /* --- commande à table --- */
  'call-waiter': () => toastOk(`Un serveur a été prévenu pour la table ${store.state.tableNo}.`),
  'toggle-split': () => store.set((s) => ({ splitOpen: !s.splitOpen })),
  split: ({ id }) => {
    store.set({ split: id });
    toastOk('Mode de partage enregistré. Chaque convive règle sa part depuis son téléphone.');
  },
  'send-to-kitchen': () => {
    toastOk(`Commande envoyée en cuisine pour la table ${store.state.tableNo}`);
    store.set({ cart: [] });
  },

  /* --- états limites --- */
  'demo-state': ({ id }) => applyDemoState(id),
};

function applyDemoState(id) {
  const seedCart = () => {
    if (store.state.cart.length) return;
    store.set({
      restId: 'comptoir',
      cart: [
        { key: 'bavette|s300|saignant|bearnaise', restId: 'comptoir', dishId: 'bavette', name: 'Bavette d’aloyau, frites maison', unit: 26.5, qty: 1, opts: '300 g · Saignant · Sauce béarnaise' },
        { key: 'risotto|normale', restId: 'comptoir', dishId: 'risotto', name: 'Risotto aux champignons', unit: 17, qty: 1, opts: 'Portion normale' },
      ],
    }, { silent: true });
  };

  const map = {
    closed: () => { store.set({ restId: 'phobac', restTab: 'menu' }, { silent: true }); router.go('/r/phobac'); },
    noDelivery: () => { seedCart(); store.set({ mode: 'livraison', address: '3 avenue de Paris, 78000 Versailles' }, { silent: true }); router.go('/commande/1'); },
    emptyCart: () => { store.set({ cart: [] }, { silent: true }); router.go('/commande/1'); },
    noResults: () => { store.set({ query: 'ramen épicé introuvable', filters: [] }, { silent: true }); router.go('/'); },
    outOfStock: () => {
      store.set({ restId: 'comptoir', restTab: 'menu' }, { silent: true });
      router.go('/r/comptoir');
      setTimeout(() => toastWarn('Île flottante n’est plus disponible aujourd’hui.'), 500);
    },
    paymentFail: () => { seedCart(); store.set({ payment: 'card', cardNumber: '4000 0000 0000 0002', payError: true }, { silent: true }); router.go('/commande/3'); },
    geoDenied: () => { store.set({ geoDenied: true }, { silent: true }); router.go('/'); },
    loading: () => {
      store.set({ loading: true }, { silent: true });
      router.go('/');
      setTimeout(() => store.set({ loading: false }), 1800);
    },
  };
  map[id]?.();
}

/* ------------------------------------------------------------ Utilitaires */

function copy(text, message) {
  navigator.clipboard?.writeText(text).then(
    () => toastOk(message),
    () => toastInfo(text)
  );
}

let trackTimer = null;
function startTracking() {
  clearInterval(trackTimer);
  trackTimer = setInterval(() => {
    const next = store.state.trackStep + 1;
    if (next > 4) { clearInterval(trackTimer); return; }
    store.set({ trackStep: next });
  }, 9000);
}

/* --------------------------------------------------------------- Démarrage */

initTheme();
store.subscribe(paint);

const root = document.getElementById('app');
delegate(root, 'click', ACTIONS);

/*
 * Seule la recherche redessine la page (en différé, pour ne pas perdre le
 * focus à chaque frappe). Les autres champs alimentent l'état en silence :
 * leur valeur est relue au prochain rendu déclenché par une action.
 */
const LIVE_FIELDS = ['query'];
const repaintField = debounce((field, value) => store.set({ [field]: value }), 280);

bindInputs(root, (field, value) => {
  if (LIVE_FIELDS.includes(field)) repaintField(field, value);
  else store.set({ [field]: value }, { silent: true });
});

router.start();
if (store.state.lastOrder && store.state.trackStep < 5) startTracking();
