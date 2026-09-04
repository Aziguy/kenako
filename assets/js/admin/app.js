/**
 * Kenako — Console superadmin
 * -------------------------------------------------------------------------
 * Interface plus dense et plus sobre (`data-surface="admin"`), orientée
 * données. Deux garde-fous structurels : la supervision est en lecture seule
 * et aucun écran ne laisse entendre une commission sur les commandes.
 */

import { html, esc, render, delegate, bindInputs, debounce } from '../core/dom.js';
import { createStore } from '../core/store.js';
import { createRouter } from '../core/router.js';
import { initTheme, toggleTheme } from '../core/theme.js';
import { toastOk, toastWarn, toastInfo } from '../core/toast.js';
import { openModal, closeModal } from '../core/sheet.js';
import { icon } from '../core/icons.js';
import { sidebar, toolbar, bottomNav, themeButton, spaceSwitcher, spaceSwitcherSheet } from '../core/shell.js';

import { RESTAURATEURS } from '../data/admin.js';

import * as Dashboard from './views/dashboard.js';
import * as Restaurateurs from './views/restaurateurs.js';
import * as Subscriptions from './views/subscriptions.js';
import * as Cms from './views/cms.js';
import * as Supervision from './views/supervision.js';
import * as Support from './views/support.js';

/* ------------------------------------------------------------------ État */

const store = createStore(
  {
    query: '', filter: 'all', sort: { key: 'name', dir: 1 }, selected: null,
    subTab: 'formules', cmsTab: 'accueil', supportTab: 'tickets',
    subPayments: ['card', 'sepa', 'paypal'],
    superQuery: '', superResto: 'all',
  },
  { persist: 'kenako:admin', persistKeys: ['subPayments'] }
);

const NAV_GROUPS = [
  {
    label: 'Pilotage',
    items: [
      { id: 'dashboard', label: 'Tableau de bord', icon: 'gauge', href: '#/' },
      { id: 'supervision', label: 'Supervision', icon: 'eye', href: '#/supervision' },
    ],
  },
  {
    label: 'Réseau',
    items: [
      { id: 'restaurateurs', label: 'Restaurateurs', icon: 'building', href: '#/restaurateurs' },
      { id: 'subscriptions', label: 'Abonnements', icon: 'wallet', href: '#/abonnements' },
    ],
  },
  {
    label: 'Acquisition',
    items: [
      { id: 'cms', label: 'Site public', icon: 'layout', href: '#/site' },
      { id: 'boosts', label: 'Mise en avant', icon: 'sparkle', href: '#/mise-en-avant' },
    ],
  },
  {
    label: 'Exploitation',
    items: [{ id: 'support', label: 'Support & modération', icon: 'shield', href: '#/support' }],
  },
];

const BOTTOM_NAV = [
  { id: 'dashboard', label: 'Bord', icon: 'gauge', href: '#/' },
  { id: 'restaurateurs', label: 'Réseau', icon: 'building', href: '#/restaurateurs' },
  { id: 'subscriptions', label: 'Abonnements', icon: 'wallet', href: '#/abonnements' },
  { id: 'supervision', label: 'Supervision', icon: 'eye', href: '#/supervision' },
  { id: 'more', label: 'Plus', icon: 'more', act: 'open-nav' },
];

const TITLES = {
  dashboard: 'Tableau de bord', restaurateurs: 'Restaurateurs', subscriptions: 'Abonnements',
  cms: 'Site public', boosts: 'Mise en avant', supervision: 'Supervision', support: 'Support',
};

const VIEWS = {
  dashboard: Dashboard,
  restaurateurs: Restaurateurs,
  subscriptions: Subscriptions,
  supervision: Supervision,
  support: Support,
  cms: { view: (c) => Cms.cmsView(c) },
  boosts: { view: () => Cms.boostsView() },
};

const router = createRouter({
  routes: {
    '/': 'dashboard',
    '/restaurateurs': 'restaurateurs',
    '/abonnements': 'subscriptions',
    '/site': 'cms',
    '/mise-en-avant': 'boosts',
    '/supervision': 'supervision',
    '/support': 'support',
  },
  fallback: '/',
  onChange: (route, previous) => {
    if (previous && VIEWS[previous.name]?.unmount) VIEWS[previous.name].unmount();
    closeModal();
    store.set({ selected: null }, { silent: true });
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
  const pending = RESTAURATEURS.filter((r) => r.status === 'en attente').length;

  render('#app', html`
    <div class="shell">
      ${sidebar({
        title: 'Kenako',
        role: 'Console superadmin',
        activeId: route.name,
        groups: NAV_GROUPS.map((g) => ({
          ...g,
          items: g.items.map((i) => (i.id === 'restaurateurs' && pending ? { ...i, badge: pending, badgeTone: 'warning' } : i)),
        })),
        foot: `<a class="sidebar__link" href="index.html">${icon('logout', { size: 18 })}<span>Quitter la démo</span></a>`,
      })}

      <div class="shell__main">
        ${toolbar({
          title: TITLES[route.name] || 'Kenako',
          sub: 'Sonia Berger · superadmin',
          actions: `<span class="badge badge--outline">v1.0 · prototype</span>${themeButton().__html}${spaceSwitcher('admin').__html}`,
        })}
        <main class="main" id="main">${view.view(ctx)}</main>
      </div>
    </div>
    ${bottomNav(
      BOTTOM_NAV.map((n) => (n.id === 'restaurateurs' && pending ? { ...n, badge: pending, badgeTone: 'accent' } : n)),
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

const ACTIONS = {
  'toggle-theme': () => { toggleTheme(); paint(); },
  'open-spaces': () => openModal({
    title: '<h2 style="font-size:20px">Parcours du prototype</h2>',
    body: spaceSwitcherSheet('admin'),
  }),
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

  /* --- restaurateurs --- */
  filter: ({ id }) => store.set({ filter: id }),
  sort: ({ key }) => store.set((s) => ({ sort: { key, dir: s.sort.key === key ? -s.sort.dir : 1 } })),
  'open-resto': ({ id }) => store.set({ selected: id }),
  'close-detail': (data, event, el) => {
    if (el.classList.contains('scrim') && event.target !== el) return;
    store.set({ selected: null });
  },
  'approve-resto': ({ id }) => {
    const r = RESTAURATEURS.find((x) => x.id === id);
    store.set({ selected: null });
    toastOk(`${r.name} validé · le restaurateur peut publier sa boutique`);
  },
  'reject-resto': ({ id }) => openModal({
    title: '<h2 style="font-size:20px">Refuser ce dossier</h2>',
    body: `<div class="stack-sm">
      <p class="tiny dim">Le motif est envoyé au restaurateur, qui peut corriger et redéposer son dossier.</p>
      ${['Documents illisibles', 'SIRET introuvable', 'RIB au mauvais nom', 'Activité hors périmètre', 'Suspicion de fraude']
        .map((m) => `<button type="button" class="option" data-act="confirm-reject" data-reason="${esc(m)}">
          <span class="option__mark">${icon('x', { size: 12 })}</span><span>${esc(m)}</span></button>`)
        .join('')}
    </div>`,
    onAction: (data) => {
      if (data.act !== 'confirm-reject') return;
      closeModal();
      store.set({ selected: null });
      toastWarn(`Dossier refusé — motif : ${data.reason}. Le restaurateur est prévenu par e-mail.`);
    },
  }),
  'validate-doc': ({ name }) => toastOk(`${name} validé`),
  'reject-doc': ({ name }) => toastWarn(`${name} refusé — nouvelle pièce demandée au restaurateur`),
  impersonate: ({ id }) => {
    const r = RESTAURATEURS.find((x) => x.id === id);
    toastInfo(`Connexion en tant que ${r.name} — action tracée dans le journal d’audit.`);
    setTimeout(() => { window.location.href = 'restaurateur.html'; }, 900);
  },
  'message-resto': ({ id }) => openModal({
    title: '<h2 style="font-size:20px">Envoyer un message</h2>',
    body: `<div class="stack">
      <label class="field"><span class="field__label">Objet</span><input class="input"></label>
      <label class="field"><span class="field__label">Message</span><textarea class="textarea" rows="5"></textarea></label>
    </div>`,
    foot: `<div class="row" style="gap:var(--sp-2)">
      <button type="button" class="btn btn--ghost" style="flex:1" data-act="sheet-close">Annuler</button>
      <button type="button" class="btn btn--primary" style="flex:1" data-act="send-message">Envoyer</button>
    </div>`,
    onAction: (data) => { if (data.act === 'send-message') { closeModal(); toastOk('Message envoyé'); } },
  }),
  suspend: ({ id }) => {
    const r = RESTAURATEURS.find((x) => x.id === id);
    store.set({ selected: null });
    toastWarn(`${r.name} suspendu · sa boutique n’est plus visible côté client`);
  },
  reactivate: ({ id }) => {
    const r = RESTAURATEURS.find((x) => x.id === id);
    store.set({ selected: null });
    toastOk(`${r.name} réactivé`);
  },
  'export-restaurateurs': () => toastOk('Export CSV du parc généré'),
  'export-report': () => toastOk('Rapport mensuel exporté (PDF)'),

  /* --- abonnements --- */
  'sub-tab': ({ tab }) => store.set({ subTab: tab }),
  'edit-plan': ({ name }) => openForm(`Modifier la formule ${name}`, planForm(), 'Enregistrer'),
  'new-plan': () => openForm('Nouvelle formule', planForm(), 'Créer la formule'),
  'new-sub-promo': () => openForm('Nouvelle promotion d’abonnement', subPromoForm(), 'Créer la promotion'),
  'edit-sub-promo': ({ code }) => openForm(`Modifier ${code}`, subPromoForm(code), 'Enregistrer'),
  'send-reminder': ({ resto }) => toastOk(`Relance envoyée à ${resto}`),
  'open-invoice': ({ id }) => toastInfo(`Facture ${id} ouverte`),
  'toggle-sub-payment': ({ id }) => {
    store.set((s) => ({ subPayments: s.subPayments.includes(id) ? s.subPayments.filter((p) => p !== id) : [...s.subPayments, id] }));
    toastOk('Moyens de paiement de l’abonnement mis à jour');
  },

  /* --- site public & boosts --- */
  'cms-tab': ({ tab }) => store.set({ cmsTab: tab }),
  'publish-cms': () => toastOk('Page d’accueil publiée'),
  'upload-hero': () => toastInfo('Image 2400 × 1200 px recommandée.'),
  'toggle-block': () => toastOk('Bloc mis à jour'),
  unfeature: ({ name }) => toastInfo(`${name} retiré de la mise en avant`),
  'feature-resto': () => toastInfo('Sélectionnez un restaurant à mettre en avant.'),
  'edit-page': ({ name }) => openForm(`Modifier « ${name} »`,
    `<div class="stack">
      <label class="field"><span class="field__label">Titre</span><input class="input" value="${esc(name)}"></label>
      <label class="field"><span class="field__label">Contenu</span><textarea class="textarea" rows="8"></textarea></label>
      <label class="field"><span class="field__label">Description SEO</span><textarea class="textarea" rows="2"></textarea></label>
    </div>`, 'Enregistrer'),
  'new-page': () => openForm('Nouvelle page', '<label class="field"><span class="field__label">Titre</span><input class="input"></label>', 'Créer'),
  'new-boost': () => openForm('Vendre un emplacement',
    `<div class="stack">
      <label class="field"><span class="field__label">Restaurant</span>
        <select class="select">${RESTAURATEURS.map((r) => `<option>${esc(r.name)}</option>`).join('')}</select></label>
      <label class="field"><span class="field__label">Emplacement</span>
        <select class="select"><option>Tête de recherche</option><option>Bandeau carte</option><option>Section « Nouveaux »</option></select></label>
      <div class="grid grid--2" style="gap:var(--sp-3)">
        <label class="field"><span class="field__label">Début</span><input class="input" type="date"></label>
        <label class="field"><span class="field__label">Fin</span><input class="input" type="date"></label>
      </div>
      <label class="field"><span class="field__label">Tarif</span><input class="input num" value="120,00"></label>
    </div>`, 'Programmer le boost'),
  'edit-boost': ({ resto }) => toastInfo(`Emplacement de ${resto} — modification.`),
  'new-cuisine': () => openForm('Nouvelle catégorie de cuisine',
    '<label class="field"><span class="field__label">Nom</span><input class="input" placeholder="Coréen"></label>', 'Ajouter'),
  'toggle-city': ({ name }) => toastOk(`Couverture de ${name} mise à jour`),

  /* --- support --- */
  'support-tab': ({ tab }) => store.set({ supportTab: tab }),
  'open-ticket': ({ id }) => toastInfo(`Ticket ${id} ouvert`),
  'new-ticket': () => openForm('Nouveau ticket',
    `<div class="stack">
      <label class="field"><span class="field__label">Sujet</span><input class="input"></label>
      <label class="field"><span class="field__label">Priorité</span>
        <select class="select"><option>Basse</option><option>Normale</option><option>Haute</option></select></label>
      <label class="field"><span class="field__label">Description</span><textarea class="textarea" rows="4"></textarea></label>
    </div>`, 'Créer le ticket'),
  'remove-review': ({ author }) => toastWarn(`Avis de ${author} supprimé · action tracée`),
  'keep-review': ({ author }) => toastOk(`Avis de ${author} conservé · signalement clos`),
  'contact-author': ({ author }) => toastInfo(`Message envoyé à ${author}`),
  'export-audit': () => toastOk('Journal d’audit exporté'),
  'new-admin': () => openForm('Inviter un administrateur',
    `<div class="stack">
      <label class="field"><span class="field__label">Nom</span><input class="input"></label>
      <label class="field"><span class="field__label">E-mail</span><input class="input" type="email"></label>
      <label class="field"><span class="field__label">Rôle</span>
        <select class="select"><option>Superadmin</option><option>Support</option><option>Facturation</option><option>Modération</option></select></label>
    </div>`, 'Envoyer l’invitation'),
  'edit-admin': ({ name }) => openForm(`Modifier ${name}`,
    `<label class="field"><span class="field__label">Rôle</span>
      <select class="select"><option>Superadmin</option><option>Support</option><option>Facturation</option><option>Modération</option></select></label>`, 'Enregistrer'),
};

function openForm(title, body, cta) {
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

const planForm = () => `
  <div class="stack">
    <label class="field"><span class="field__label">Nom de la formule</span><input class="input" placeholder="Signature"></label>
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Prix mensuel</span><input class="input num" value="79,00"></label>
      <label class="field"><span class="field__label">Prix annuel</span><input class="input num" value="790,00"></label>
    </div>
    <label class="field"><span class="field__label">Fonctionnalités incluses</span>
      <textarea class="textarea" rows="4" placeholder="Une fonctionnalité par ligne"></textarea></label>
    <label class="field"><span class="field__label">Limites</span><input class="input" placeholder="1 établissement · plats illimités"></label>
  </div>`;

const subPromoForm = (code = '') => `
  <div class="stack">
    <label class="field"><span class="field__label">Nom</span><input class="input" placeholder="3 mois offerts"></label>
    <label class="field"><span class="field__label">Code</span><input class="input" value="${esc(code)}" placeholder="LANCEMENT3M" style="text-transform:uppercase"></label>
    <label class="field"><span class="field__label">Type</span>
      <select class="select"><option>Mois offerts</option><option>Pourcentage de remise</option><option>Montant fixe</option><option>Code partenaire</option></select></label>
    <div class="grid grid--2" style="gap:var(--sp-3)">
      <label class="field"><span class="field__label">Valeur</span><input class="input num" value="3"></label>
      <label class="field"><span class="field__label">Cible</span>
        <select class="select"><option>Nouveaux inscrits</option><option>Formule Signature</option><option>Tous</option></select></label>
      <label class="field"><span class="field__label">Début</span><input class="input" type="date"></label>
      <label class="field"><span class="field__label">Fin</span><input class="input" type="date"></label>
    </div>
  </div>`;

/* --------------------------------------------------------------- Démarrage */

initTheme();
document.documentElement.dataset.surface = 'admin';
store.subscribe(paint);

const root = document.getElementById('app');
delegate(root, 'click', ACTIONS);

// Recherches et sélecteurs redessinent le tableau, avec un léger différé.
const repaint = debounce((field, value) => store.set({ [field]: value }), 260);
bindInputs(root, (field, value) => repaint(field, value));

router.start();
