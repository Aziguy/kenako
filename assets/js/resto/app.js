/**
 * Kenako — Espace restaurateur
 * -------------------------------------------------------------------------
 * Coque à colonne latérale sur desktop, barre d'outils + navigation basse
 * sur mobile. L'écran cuisine s'affiche sans coque : c'est un plein écran.
 */

import { html, esc, render, delegate, bindInputs, debounce } from '../core/dom.js';
import { createStore } from '../core/store.js';
import { createRouter } from '../core/router.js';
import { initTheme, toggleTheme } from '../core/theme.js';
import { toastOk, toastWarn, toastInfo } from '../core/toast.js';
import { openModal, closeModal } from '../core/sheet.js';
import { icon } from '../core/icons.js';
import { sidebar, toolbar, bottomNav, themeButton, spaceSwitcher, spaceSwitcherSheet } from '../core/shell.js';

import { RESTO, ORDERS, CATEGORIES, ONBOARDING, ORDER_STATUSES } from '../data/resto.js';

import * as Dashboard from './views/dashboard.js';
import * as Orders from './views/orders.js';
import * as Kds from './views/kds.js';
import * as Menu from './views/menu.js';
import * as Delivery from './views/delivery.js';
import * as Finances from './views/finances.js';
import * as Marketing from './views/marketing.js';
import * as Operations from './views/operations.js';
import * as Customers from './views/customers.js';
import * as Settings from './views/settings.js';
import * as Onboarding from './views/onboarding.js';
import * as Analytics from './views/analytics.js';

/* ------------------------------------------------------------------ État */

const store = createStore(
  {
    accepting: true, rush: false, prepTime: 25, sound: true,
    orders: ORDERS.map((o) => ({ ...o })),
    orderFilter: 'all', selectedOrder: null,
    categories: CATEGORIES.map((c) => ({ ...c, items: c.items.map((i) => ({ ...i })) })),
    menuQuery: '', menuFilter: null,
    modes: ['livraison', 'emporter', 'surplace'],
    payments: ['card', 'cash', 'paypal', 'wero'],
    financeTab: 'encaissements', marketingTab: 'promos', loyaltyType: 'points',
    socialDish: 0, socialFormat: 'post',
    reservationTab: 'liste', customerTab: 'clients', settingsTab: 'etablissement',
    accent: RESTO.tint, period: '30 j',
    notifs: { newOrder: true, review: true, stock: true, billing: true },
    checklist: ONBOARDING.map((s) => ({ ...s })),
    signupStep: 1, signupPlan: 'Signature',
  },
  { persist: 'kenako:resto', persistKeys: ['accepting', 'rush', 'prepTime', 'accent', 'notifs', 'checklist', 'modes', 'payments'] }
);

/* ------------------------------------------------------------- Navigation */

const NAV_GROUPS = [
  {
    label: 'Pilotage',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'gauge', href: '#/' },
      { id: 'analytics', label: 'Analytique', icon: 'chart', href: '#/analytique' },
    ],
  },
  {
    label: 'Service',
    items: [
      { id: 'orders', label: 'Commandes', icon: 'kanban', href: '#/commandes' },
      { id: 'kds', label: 'Écran cuisine', icon: 'chef', href: '#/cuisine' },
      { id: 'reservations', label: 'Réservations', icon: 'calendar', href: '#/reservations' },
    ],
  },
  {
    label: 'Boutique',
    items: [
      { id: 'menu', label: 'Carte', icon: 'book', href: '#/carte' },
      { id: 'delivery', label: 'Livraison', icon: 'truck', href: '#/livraison' },
      { id: 'marketing', label: 'Marketing', icon: 'megaphone', href: '#/marketing' },
      { id: 'events', label: 'Événements', icon: 'ticket', href: '#/evenements' },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { id: 'customers', label: 'Clients & avis', icon: 'users', href: '#/clients' },
      { id: 'finances', label: 'Finances', icon: 'wallet', href: '#/finances' },
      { id: 'settings', label: 'Paramètres', icon: 'settings', href: '#/parametres' },
    ],
  },
  {
    label: 'Parcours d’entrée',
    items: [
      { id: 'signup', label: 'Inscription', icon: 'building', href: '#/inscription' },
      { id: 'pending', label: 'Attente de validation', icon: 'clock', href: '#/validation' },
      { id: 'checklist', label: 'Démarrage guidé', icon: 'check', href: '#/demarrage' },
    ],
  },
];

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Bord', icon: 'gauge', href: '#/' },
  { id: 'orders', label: 'Commandes', icon: 'kanban', href: '#/commandes' },
  { id: 'menu', label: 'Carte', icon: 'book', href: '#/carte' },
  { id: 'customers', label: 'Clients', icon: 'users', href: '#/clients' },
  { id: 'more', label: 'Plus', icon: 'more', act: 'open-nav' },
];

const TITLES = {
  dashboard: 'Tableau de bord', analytics: 'Analytique', orders: 'Commandes', kds: 'Écran cuisine',
  reservations: 'Réservations', menu: 'Carte', delivery: 'Livraison', marketing: 'Marketing',
  events: 'Événements', customers: 'Clients & avis', finances: 'Finances', settings: 'Paramètres',
  signup: 'Inscription', pending: 'Validation', checklist: 'Démarrage',
};

const VIEWS = {
  dashboard: Dashboard,
  analytics: Analytics,
  orders: Orders,
  kds: Kds,
  menu: Menu,
  delivery: Delivery,
  finances: Finances,
  marketing: Marketing,
  customers: Customers,
  settings: Settings,
  events: { view: () => Operations.eventsView() },
  reservations: { view: (c) => Operations.reservationsView(c) },
  signup: { view: (c) => Onboarding.signupView(c) },
  pending: { view: () => Onboarding.pendingView() },
  checklist: { view: (c) => Onboarding.checklistView(c) },
};

const router = createRouter({
  routes: {
    '/': 'dashboard',
    '/analytique': 'analytics',
    '/commandes': 'orders',
    '/cuisine': 'kds',
    '/reservations': 'reservations',
    '/carte': 'menu',
    '/livraison': 'delivery',
    '/marketing': 'marketing',
    '/evenements': 'events',
    '/clients': 'customers',
    '/finances': 'finances',
    '/parametres': 'settings',
    '/inscription': 'signup',
    '/validation': 'pending',
    '/demarrage': 'checklist',
  },
  fallback: '/',
  onChange: (route, previous) => {
    if (previous && VIEWS[previous.name]?.unmount) VIEWS[previous.name].unmount();
    closeModal();
    paint();
  },
});

const ctx = { get state() { return store.state; }, store, router };

/* --------------------------------------------------------------- Rendu */

function paint() {
  const route = router.current;
  const view = VIEWS[route.name] ?? Dashboard;
  const active = document.activeElement?.dataset?.bind || null;
  const caret = active ? document.activeElement.selectionStart : null;

  // L'écran cuisine occupe tout l'écran : ni colonne, ni navigation basse.
  if (route.name === 'kds') {
    render('#app', view.view(ctx));
  } else {
    const newOrders = store.state.orders.filter((o) => o.status === 'new').length;

    render('#app', html`
      <div class="shell">
        ${sidebar({
          title: RESTO.name,
          role: `Formule ${RESTO.plan}`,
          activeId: route.name,
          groups: NAV_GROUPS.map((g) => ({
            ...g,
            items: g.items.map((i) => (i.id === 'orders' && newOrders ? { ...i, badge: newOrders } : i)),
          })),
          foot: `<a class="sidebar__link" href="client.html#/r/comptoir" target="_blank" rel="noopener">
                   ${icon('eye', { size: 18 })}<span>Voir ma page publique</span></a>
                 <a class="sidebar__link" href="index.html">${icon('logout', { size: 18 })}<span>Quitter la démo</span></a>`,
        })}

        <div class="shell__main">
          ${toolbar({
            title: TITLES[route.name] || RESTO.name,
            sub: RESTO.address,
            actions: `${store.state.accepting ? '<span class="badge badge--success"><span class="badge__dot"></span>Commandes ouvertes</span>' : '<span class="badge badge--danger">✕ Commandes fermées</span>'}
              ${themeButton().__html}
              ${spaceSwitcher('resto').__html}`,
          })}
          <main class="main" id="main">${view.view(ctx)}</main>
        </div>
      </div>
      ${bottomNav(
        BOTTOM_NAV.map((n) => (n.id === 'orders' && newOrders ? { ...n, badge: newOrders } : n)),
        route.name
      )}
    `);
  }

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

const ACTIONS = {
  'toggle-theme': () => { toggleTheme(); paint(); },
  'open-spaces': () => openModal({
    title: '<h2 style="font-size:20px">Parcours du prototype</h2>',
    body: spaceSwitcherSheet('resto'),
  }),
  /** Feuille « Plus » : toute la navigation, sur mobile. */
  'open-nav': () => openModal({
    title: '<h2 style="font-size:20px">Navigation</h2>',
    body: NAV_GROUPS.map(
      (g) => `<div class="stack-sm"><p class="eyebrow">${esc(g.label)}</p>
        <div class="navsheet">${g.items
          .map((i) => `<a class="navsheet__item${i.id === router.current.name ? ' is-active' : ''}" href="${i.href}" data-act="sheet-close">
            ${icon(i.icon, { size: 22 })}<span>${esc(i.label)}</span></a>`)
          .join('')}</div></div>`
    ).join(''),
  }),

  /* --- tableau de bord --- */
  'toggle-accept': () => {
    const next = !store.state.accepting;
    store.set({ accepting: next, rush: next ? store.state.rush : false });
    next ? toastOk('Vous acceptez de nouveau les commandes') : toastWarn('Commandes suspendues : aucun nouveau panier ne sera validé');
  },
  'toggle-rush': () => {
    const next = !store.state.rush;
    store.set({ rush: next, prepTime: next ? store.state.prepTime + 15 : Math.max(10, store.state.prepTime - 15) });
    toastInfo(next ? 'Mode rush activé : +15 minutes annoncées aux clients' : 'Mode rush désactivé');
  },
  'prep-time': () => openModal({
    title: '<h2 style="font-size:20px">Temps de préparation annoncé</h2>',
    body: `<div class="stack-sm">
      ${[15, 20, 25, 30, 40, 50].map(
        (m) => `<button type="button" class="option" role="radio" aria-checked="${store.state.prepTime === m}"
          data-act="set-prep" data-value="${m}">
          <span class="option__mark">${store.state.prepTime === m ? icon('check', { size: 12, stroke: 3 }) : ''}</span>
          <span>${m} minutes</span></button>`
      ).join('')}
      <p class="tiny dim">Ce délai s’affiche côté client avant validation du panier.</p>
    </div>`,
    onAction: (data) => {
      if (data.act !== 'set-prep') return;
      store.set({ prepTime: Number(data.value) });
      closeModal();
      toastOk(`Délai annoncé : ${data.value} minutes`);
    },
  }),

  /* --- commandes --- */
  'order-filter': ({ id }) => store.set({ orderFilter: id }),
  'toggle-sound': () => {
    store.set((s) => ({ sound: !s.sound }));
    toastInfo(store.state.sound ? 'Son des nouvelles commandes activé' : 'Son coupé');
  },
  'open-order': ({ id }) => store.set({ selectedOrder: id }),
  // Le voile porte l'action : un clic *dans* le panneau ne doit pas fermer.
  'close-drawer': (data, event, el) => {
    if (el.classList.contains('scrim') && event.target !== el) return;
    store.set({ selectedOrder: null });
  },
  'accept-order': ({ id }) => {
    updateOrder(id, { status: 'accepted' });
    toastOk(`Commande ${id} acceptée · ${store.state.prepTime} min annoncées`);
  },
  'refuse-order': ({ id }) => openModal({
    title: `<h2 style="font-size:20px">Refuser ${esc(id)}</h2>`,
    body: Orders.refusalBody(id),
    onAction: (data) => {
      if (data.act !== 'confirm-refuse') return;
      store.set((s) => ({ orders: s.orders.filter((o) => o.id !== data.id), selectedOrder: null }));
      closeModal();
      toastWarn(`Commande ${data.id} refusée — motif : ${data.reason}. Le client est prévenu et remboursé.`);
    },
  }),
  'advance-order': ({ id }) => {
    const order = store.state.orders.find((o) => o.id === id);
    if (!order) return;
    const flow = order.mode === 'livraison'
      ? ['new', 'accepted', 'preparing', 'delivering', 'done']
      : ['new', 'accepted', 'preparing', 'ready', 'done'];
    const next = flow[Math.min(flow.length - 1, flow.indexOf(order.status) + 1)];
    updateOrder(id, { status: next });
    toastOk(`${id} · ${ORDER_STATUSES.find((s) => s.id === next)?.label ?? next}`);
  },
  'print-order': ({ id }) => { toastInfo(`Ticket ${id} envoyé à l’imprimante`); setTimeout(() => window.print(), 300); },

  /* --- carte --- */
  'menu-filter': ({ id }) => store.set((s) => ({ menuFilter: s.menuFilter === id ? null : id })),
  'toggle-stock': ({ id }) => {
    let name = '';
    let now = false;
    store.set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.map((i) => {
          if (i.id !== id) return i;
          name = i.name;
          now = !i.stock;
          return { ...i, stock: now };
        }),
      })),
    }));
    now ? toastOk(`${name} de nouveau en vente`) : toastWarn(`${name} passé en rupture — masqué côté client`);
  },
  'duplicate-dish': ({ id }) => {
    const source = store.state.categories.flatMap((c) => c.items).find((i) => i.id === id);
    if (!source) return;
    store.set((s) => ({
      categories: s.categories.map((c) => ({
        ...c,
        items: c.items.some((i) => i.id === id)
          ? [...c.items, { ...source, id: `${source.id}-copie-${Date.now() % 1000}`, name: `${source.name} (copie)` }]
          : c.items,
      })),
    }));
    toastOk(`${source.name} dupliqué`);
  },
  'edit-dish': ({ id }) => {
    const item = store.state.categories.flatMap((c) => c.items).find((i) => i.id === id);
    openSheetForm(`Modifier « ${item?.name ?? ''} »`, Menu.dishForm(item), 'Enregistrer le plat');
  },
  'new-dish': () => openSheetForm('Nouveau plat', Menu.dishForm(null), 'Créer le plat'),
  'move-cat': ({ id, dir }) => {
    const delta = Number(dir);
    store.set((s) => {
      const list = [...s.categories];
      const index = list.findIndex((c) => c.id === id);
      const target = index + delta;
      if (target < 0 || target >= list.length) return null;
      [list[index], list[target]] = [list[target], list[index]];
      return { categories: list };
    });
  },
  'edit-cat': ({ id }) => openSheetForm('Modifier la catégorie',
    '<label class="field"><span class="field__label">Nom de la catégorie</span><input class="input" value=""></label>', 'Enregistrer'),
  'export-menu': () => toastOk('Export CSV de la carte généré'),
  'import-menu': () => toastInfo('Import CSV — glissez votre fichier ou téléchargez le modèle.'),

  /* --- livraison --- */
  'toggle-mode': ({ id }) => {
    store.set((s) => ({ modes: s.modes.includes(id) ? s.modes.filter((m) => m !== id) : [...s.modes, id] }));
    toastOk('Modes de service mis à jour — visibles immédiatement côté client');
  },
  'new-zone': () => toastInfo('Dessinez le polygone de la zone directement sur la carte.'),
  'draw-zone': () => toastInfo('Mode dessin activé : cliquez pour poser les sommets de la zone.'),
  'edit-zone': ({ id }) => openSheetForm('Règles de la zone', zoneForm(), 'Enregistrer la zone'),
  'assign-courier': ({ name }) => toastOk(`Course attribuée à ${name}`),
  'new-courier': () => openSheetForm('Ajouter un livreur',
    `<div class="stack">
      <label class="field"><span class="field__label">Nom</span><input class="input"></label>
      <label class="field"><span class="field__label">Téléphone</span><input class="input" type="tel"></label>
      <label class="field"><span class="field__label">Créneau</span><input class="input" placeholder="11h–15h"></label>
    </div>`, 'Inviter'),

  /* --- finances --- */
  'finance-tab': ({ tab }) => store.set({ financeTab: tab }),
  'toggle-payment': ({ id }) => {
    store.set((s) => ({ payments: s.payments.includes(id) ? s.payments.filter((p) => p !== id) : [...s.payments, id] }));
    toastOk('Moyens de paiement mis à jour côté client');
  },
  'connect-payment': ({ id }) => toastInfo(`Redirection vers la connexion ${id} — le compte reste le vôtre.`),
  'export-accounting': () => toastOk('Export comptable (CSV + FEC) généré'),
  'download-invoice': ({ id }) => toastOk(`Facture ${id} téléchargée`),
  'update-card': () => openSheetForm('Mettre à jour le moyen de paiement',
    `<div class="stack">
      <label class="field"><span class="field__label">Numéro de carte</span><input class="input num" placeholder="4242 4242 4242 4242"></label>
      <div class="grid grid--2" style="gap:var(--sp-3)">
        <label class="field"><span class="field__label">Expiration</span><input class="input num" placeholder="09/29"></label>
        <label class="field"><span class="field__label">Cryptogramme</span><input class="input num" placeholder="123"></label>
      </div>
    </div>`, 'Régler 79,00 €'),
  'change-plan': ({ name }) => toastOk(`Demande de passage à la formule ${name} enregistrée`),
  'cancel-plan': () => openModal({
    title: '<h2 style="font-size:20px">Résilier votre abonnement</h2>',
    body: `<p class="muted">Votre boutique restera en ligne jusqu’à la fin de la période payée, puis passera hors ligne.
      Vos données et votre carte sont conservées 12 mois.</p>`,
    foot: `<div class="row" style="gap:var(--sp-2)">
      <button type="button" class="btn btn--ghost" style="flex:1" data-act="sheet-close">Annuler</button>
      <button type="button" class="btn btn--danger" style="flex:1" data-act="confirm-cancel">Confirmer la résiliation</button>
    </div>`,
    onAction: (data) => {
      if (data.act !== 'confirm-cancel') return;
      closeModal();
      toastWarn('Résiliation enregistrée · effective le 30 septembre');
    },
  }),

  /* --- marketing --- */
  'marketing-tab': ({ tab }) => store.set({ marketingTab: tab }),
  'loyalty-type': ({ id }) => { store.set({ loyaltyType: id }); toastOk('Type de programme mis à jour'); },
  'new-promo': () => openSheetForm('Nouveau code promo', promoForm(), 'Créer le code'),
  'edit-promo': ({ code }) => openSheetForm(`Modifier ${code}`, promoForm(code), 'Enregistrer'),
  'new-campaign': ({ segment }) => openSheetForm('Nouvelle campagne', campaignForm(segment), 'Programmer l’envoi'),
  'social-format': ({ id }) => store.set({ socialFormat: id }),
  'copy-caption': ({ text }) => copy(text, 'Légende copiée'),
  'download-visual': () => toastOk('Visuel exporté en PNG (1080 × 1080)'),
  'share-social': () => toastInfo('Partage vers Instagram, Facebook ou WhatsApp.'),

  /* --- événements & réservations --- */
  'new-event': () => openSheetForm('Créer un événement', eventForm(), 'Publier l’événement'),
  'edit-event': ({ title }) => openSheetForm(`Modifier « ${title} »`, eventForm(title), 'Enregistrer'),
  'share-event': ({ title }) => copy(`${location.origin}${location.pathname.replace('restaurateur.html', 'client.html')}#/r/comptoir`, `Lien de « ${title} » copié`),
  'reservation-tab': ({ tab }) => store.set({ reservationTab: tab }),
  'new-reservation': () => openSheetForm('Nouvelle réservation', reservationForm(), 'Enregistrer'),
  'confirm-reservation': ({ name }) => toastOk(`Réservation de ${name} confirmée · SMS envoyé`),
  'edit-reservation': ({ name }) => openSheetForm(`Réservation · ${name}`, reservationForm(), 'Enregistrer'),
  'open-table': ({ no }) => toastInfo(`Table ${no} — QR code et commandes en cours.`),
  'print-qr': () => { toastInfo('Planche de QR codes envoyée à l’imprimante'); setTimeout(() => window.print(), 300); },

  /* --- clients & avis --- */
  'customer-tab': ({ tab }) => store.set({ customerTab: tab }),
  'open-customer': ({ name }) => toastInfo(`Fiche de ${name} — historique, points et adresses.`),
  'reply-review': ({ author }) => openSheetForm(`Répondre à ${author}`,
    `<div class="stack">
      <p class="tiny dim">Votre réponse est publique et apparaît sous l’avis, sur votre page.</p>
      <label class="field"><span class="field__label">Votre réponse</span>
        <textarea class="textarea" rows="4" placeholder="Bonjour, merci de votre retour…"></textarea></label>
    </div>`, 'Publier la réponse'),
  'flag-review': ({ author }) => toastWarn(`Avis de ${author} signalé à la modération Kenako`),
  'export-customers': () => toastOk('Base clients exportée (CSV)'),

  /* --- paramètres --- */
  'settings-tab': ({ tab }) => store.set({ settingsTab: tab }),
  'pick-accent': ({ color }) => { store.set({ accent: color }); toastOk('Couleur d’accent appliquée à votre page'); },
  'resto-notif': ({ id }) => store.set((s) => ({ notifs: { ...s.notifs, [id]: !s.notifs[id] } })),
  'save-settings': () => toastOk('Paramètres enregistrés'),
  'edit-hours': ({ day }) => openSheetForm(`Horaires · ${day}`, hoursForm(), 'Enregistrer'),
  'new-closure': () => openSheetForm('Fermeture exceptionnelle',
    `<div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Du</span><input class="input" type="date"></label>
      <label class="field"><span class="field__label">Au</span><input class="input" type="date"></label>
      <label class="field" style="grid-column:1/-1"><span class="field__label">Motif (visible par vos clients)</span>
        <input class="input" placeholder="Congés annuels"></label>
    </div>`, 'Enregistrer'),
  'delete-closure': () => toastInfo('Fermeture supprimée'),
  'new-staff': () => openSheetForm('Inviter un membre',
    `<div class="stack">
      <label class="field"><span class="field__label">Nom</span><input class="input"></label>
      <label class="field"><span class="field__label">E-mail</span><input class="input" type="email"></label>
      <label class="field"><span class="field__label">Rôle</span>
        <select class="select"><option>Gérant</option><option>Cuisine</option><option>Service</option><option>Livreur</option></select></label>
    </div>`, 'Envoyer l’invitation'),
  'edit-staff': ({ name }) => openSheetForm(`Modifier ${name}`,
    `<label class="field"><span class="field__label">Rôle</span>
      <select class="select"><option>Gérant</option><option>Cuisine</option><option>Service</option><option>Livreur</option></select></label>`, 'Enregistrer'),
  'upload-banner': () => toastInfo('Choisissez une image en 1600 × 700 px minimum.'),
  'upload-logo': () => toastInfo('PNG ou SVG, 512 px minimum.'),

  /* --- parcours d’entrée --- */
  'signup-next': () => {
    const step = store.state.signupStep;
    if (step >= 4) { router.go('/validation'); toastOk('Demande envoyée · réponse sous 48 h ouvrées'); return; }
    store.set({ signupStep: step + 1 });
  },
  'signup-back': () => store.set((s) => ({ signupStep: Math.max(1, s.signupStep - 1) })),
  'pick-plan': ({ name }) => store.set({ signupPlan: name }),
  'upload-doc': ({ id }) => toastOk('Document déposé · en attente de vérification'),
  'toggle-check': ({ id }) => {
    store.set((s) => ({ checklist: s.checklist.map((c) => (c.id === id ? { ...c, done: !c.done } : c)) }));
  },
  'publish-resto': () => {
    toastOk('Votre restaurant est publié ! Il apparaît dès maintenant dans la recherche.');
    router.go('/');
  },

  /* --- analytique --- */
  period: ({ id }) => store.set({ period: id }),
  'export-analytics': () => toastOk('Rapport analytique exporté (PDF)'),
};

function updateOrder(id, patch) {
  store.set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, ...patch } : o)) }));
}

function openSheetForm(title, body, cta) {
  openModal({
    title: `<h2 style="font-size:20px">${esc(title)}</h2>`,
    body,
    foot: `<div class="row" style="gap:var(--sp-2)">
      <button type="button" class="btn btn--ghost" style="flex:1" data-act="sheet-close">Annuler</button>
      <button type="button" class="btn btn--primary" style="flex:1" data-act="form-save">${esc(cta)}</button>
    </div>`,
    onAction: (data) => {
      if (data.act !== 'form-save') return;
      closeModal();
      toastOk('Modifications enregistrées');
    },
  });
}

const zoneForm = () => `
  <div class="stack">
    <label class="field"><span class="field__label">Nom de la zone</span><input class="input" placeholder="Zone 1 · Paris 11e"></label>
    <label class="field"><span class="field__label">Mode de tarification</span>
      <select class="select"><option>Frais fixe</option><option>Frais au kilomètre</option><option>Paliers de distance</option></select></label>
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Frais de livraison</span><input class="input num" value="2,00"></label>
      <label class="field"><span class="field__label">Minimum de commande</span><input class="input num" value="15,00"></label>
      <label class="field"><span class="field__label">Franco de port dès</span><input class="input num" value="25,00"></label>
      <label class="field"><span class="field__label">Délai estimé</span><input class="input" value="25–35 min"></label>
    </div>
  </div>`;

const promoForm = (code = '') => `
  <div class="stack">
    <label class="field"><span class="field__label">Code</span><input class="input" value="${esc(code)}" placeholder="BIENVENUE10" style="text-transform:uppercase"></label>
    <label class="field"><span class="field__label">Type de réduction</span>
      <select class="select"><option>Pourcentage</option><option>Montant fixe</option><option>Livraison offerte</option><option>Premier achat</option></select></label>
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Valeur</span><input class="input num" value="10"></label>
      <label class="field"><span class="field__label">Minimum de commande</span><input class="input num" value="15,00"></label>
      <label class="field"><span class="field__label">Début</span><input class="input" type="date"></label>
      <label class="field"><span class="field__label">Fin</span><input class="input" type="date"></label>
      <label class="field"><span class="field__label">Plafond d’utilisations</span><input class="input num" value="500"></label>
      <label class="field"><span class="field__label">Par client</span><input class="input num" value="1"></label>
    </div>
  </div>`;

const campaignForm = (segment = '') => `
  <div class="stack">
    <label class="field"><span class="field__label">Nom de la campagne</span><input class="input" placeholder="Menu d’automne"></label>
    <div class="field"><span class="field__label">Canal</span>
      <div class="segmented"><button type="button" class="segmented__item" aria-selected="true">E-mail</button>
      <button type="button" class="segmented__item">SMS</button><button type="button" class="segmented__item">Push</button></div></div>
    <label class="field"><span class="field__label">Segment</span>
      <select class="select">
        <option${segment === 'all' ? ' selected' : ''}>Tous les clients (612)</option>
        <option${segment === 'new' ? ' selected' : ''}>Nouveaux 30 j (87)</option>
        <option${segment === 'inactive' ? ' selected' : ''}>Inactifs 30 j (148)</option>
        <option${segment === 'big' ? ' selected' : ''}>Gros paniers (74)</option>
        <option${segment === 'loyal' ? ' selected' : ''}>Programme fidélité (218)</option>
      </select></label>
    <label class="field"><span class="field__label">Message</span>
      <textarea class="textarea" rows="4" placeholder="Notre carte d’automne est arrivée…"></textarea></label>
    <label class="field"><span class="field__label">Envoi</span><input class="input" type="datetime-local"></label>
  </div>`;

const eventForm = (title = '') => `
  <div class="stack">
    <label class="field"><span class="field__label">Titre</span><input class="input" value="${esc(title)}" placeholder="Soirée accords vins & fromages"></label>
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Date & heure</span><input class="input" type="datetime-local"></label>
      <label class="field"><span class="field__label">Jauge</span><input class="input num" value="24"></label>
      <label class="field"><span class="field__label">Prix</span><input class="input num" value="35,00"></label>
      <label class="field"><span class="field__label">Mode</span>
        <select class="select"><option>Billetterie</option><option>Réservation simple</option></select></label>
    </div>
    <label class="field"><span class="field__label">Description</span><textarea class="textarea" rows="3"></textarea></label>
  </div>`;

const reservationForm = () => `
  <div class="stack">
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Nom</span><input class="input"></label>
      <label class="field"><span class="field__label">Téléphone</span><input class="input" type="tel"></label>
      <label class="field"><span class="field__label">Heure</span><input class="input" type="time"></label>
      <label class="field"><span class="field__label">Couverts</span><input class="input num" value="2"></label>
      <label class="field"><span class="field__label">Table</span>
        <select class="select"><option>Automatique</option><option>1</option><option>3</option><option>5</option><option>7</option><option>9</option><option>11</option></select></label>
    </div>
    <label class="field"><span class="field__label">Note</span><input class="input" placeholder="Allergie, anniversaire…"></label>
  </div>`;

const hoursForm = () => `
  <div class="stack">
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Service du midi — de</span><input class="input" type="time" value="12:00"></label>
      <label class="field"><span class="field__label">à</span><input class="input" type="time" value="14:30"></label>
      <label class="field"><span class="field__label">Service du soir — de</span><input class="input" type="time" value="19:00"></label>
      <label class="field"><span class="field__label">à</span><input class="input" type="time" value="22:30"></label>
    </div>
    <button type="button" class="btn btn--outline btn--sm btn--block">Ajouter un créneau</button>
  </div>`;

function copy(text, message) {
  navigator.clipboard?.writeText(text).then(() => toastOk(message), () => toastInfo(text));
}

/* --------------------------------------------------------------- Démarrage */

initTheme();
store.subscribe(paint);

const root = document.getElementById('app');
delegate(root, 'click', ACTIONS);

const repaintField = debounce((field, value) => store.set({ [field]: value }), 280);
bindInputs(root, (field, value) => {
  if (field === 'menuQuery' || field === 'socialDish') repaintField(field, value);
  else store.set({ [field]: value }, { silent: true });
});

router.start();
