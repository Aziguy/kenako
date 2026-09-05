# 02 · Architecture

Environ 10 400 lignes de JavaScript et de CSS, réparties en 55 modules JS et
7 feuilles de style. Aucune dépendance de build.

## Cartographie

```
.
├── index.html                  Vitrine publique — point d'entrée GitHub Pages
├── client.html                 Espace client
├── restaurateur.html           Back-office restaurateur
├── superadmin.html             Console superadmin
├── livreur.html                Application livreur
├── design-system.html          Planche du design system
├── 404.html
├── manifest.webmanifest        Installable sur mobile
├── .nojekyll                   Empêche Jekyll d'ignorer les dossiers utiles
│
├── assets/css/
│   ├── tokens.css              Couleurs, typo, espacement, ombres, mode sombre, surface admin
│   ├── base.css                Reset, primitives typographiques, utilitaires, animations
│   ├── components.css          Boutons, champs, badges, cartes, tableaux, modales, toasts, vignettes
│   ├── layout.css              Coques : barre haute, bloc de marque, navigation basse, colonne latérale
│   ├── client.css              Espace client + styles Leaflet
│   ├── backoffice.css          Kanban, écran cuisine, plan de salle, zones
│   └── landing.css             Vitrine + slogan
│
├── assets/js/core/             Socle partagé par les cinq applications
│   ├── dom.js                  Gabarits `html`, échappement, `render`, délégation `data-act`, piège à focus
│   ├── store.js                Magasin d'état + persistance localStorage
│   ├── router.js               Routeur à fragment d'URL
│   ├── format.js               Formatage français : €, distances, durées, pluriels, tri sans accents
│   ├── theme.js                Thème clair / sombre
│   ├── toast.js                Notifications éphémères
│   ├── sheet.js                Modales et bottom-sheets
│   ├── icons.js                57 icônes SVG en trait
│   ├── charts.js               Aire, barres, colonnes, anneau, carte de chaleur — SVG pur
│   ├── map.js                  Enveloppe Leaflet : marqueurs de marque, zones, repli hors ligne
│   └── shell.js                Bloc de marque, barre haute, navigation basse, colonne latérale
│
├── assets/js/data/             Données de démonstration, partagées entre espaces
│   ├── restaurants.js          10 établissements, réglages paiement / livraison / fidélité, filtres, tris
│   ├── menus.js                Cartes, groupes d'options, 14 allergènes UE, formules
│   ├── client.js               Avis, événements, historique, adresses, fidélité, codes promo, étapes de suivi
│   ├── resto.js                Back-office du Comptoir de Marie
│   └── admin.js                Parc, abonnements, CMS, boosts, tickets, audit
│
├── assets/js/client/           app.js · cart.js · components.js · views/ (10 écrans)
├── assets/js/resto/            app.js · components.js · views/ (11 modules)
├── assets/js/admin/            app.js · components.js · views/ (6 modules)
├── assets/js/courier/          app.js (4 écrans dans un seul module, l'espace est petit)
├── assets/js/landing.js
├── assets/js/design-system.js
│
└── docs/
    ├── brief-original.md       Cahier des charges de départ
    └── handoff-planches-dc.md  Spécification de la première version (grille d'audit)
```

## Le socle en détail

### `dom.js`

- `html\`` — littéral de gabarit qui **échappe par défaut**. Une interpolation
  provenant d'un autre `html\`` ou de `raw()` est insérée telle quelle.
- `render(cible, contenu)` — remplace le `innerHTML` d'un conteneur.
- `delegate(racine, 'click', ACTIONS)` — un clic sur un élément portant
  `data-act="nom"` appelle `ACTIONS.nom(dataset, event, element)`. Les
  attributs `data-*` de l'élément sont fusionnés et transmis.
- `bindInputs(racine, callback)` — écoute les champs portant `data-bind`.
- `trapFocus`, `debounce`, `cx`, `attrs`, `esc`, `raw`.

**Règle du moteur de gabarit :** `null` et `undefined` disparaissent, mais les
booléens s'écrivent tels quels — `aria-pressed="false"`. C'est indispensable
aux attributs ARIA. Conséquence : le rendu conditionnel se fait avec un
ternaire, **jamais** avec `&&`.

### `store.js`

`createStore(initial, { persist, persistKeys })`. `set(patch)` fusionne et
notifie les abonnés via `requestAnimationFrame` (les mises à jour successives
d'une même frame sont regroupées). `set(patch, { silent: true })` écrit sans
notifier — utilisé quand une vue gère elle-même son rendu.

Persistance par espace : `kenako:client`, `kenako:resto`, `kenako:admin`,
`kenako:courier`, `kenako:theme`. Tout accès est protégé par `try/catch` : le
prototype fonctionne en navigation privée.

### `router.js`

`createRouter({ routes, fallback, onChange })`. Les motifs acceptent des
paramètres : `/r/:id`, `/commande/:step`. `onChange(route, previous)` reçoit
la route précédente, ce qui permet d'appeler `unmount()` sur la vue sortante.

### `map.js`

Enveloppe Leaflet. `createMap()` renvoie une poignée exposant `setMarkers`,
`setZones`, `fit`, `flyTo`, `invalidate`, `destroy`. Si Leaflet n'est pas
chargé, un repli explicite s'affiche au lieu d'un cadre vide.

## Anatomie d'un espace

```
espace/
├── app.js          magasin + routeur + coque + table ACTIONS
├── components.js   fragments réutilisés par plusieurs écrans de l'espace
└── views/*.js      un module par écran : view(ctx) [+ mount / unmount]
```

`ctx` transmis aux vues : `{ state, store, router }` — plus, côté client,
`addToCart`.

Le cycle est toujours le même :

1. une action modifie le magasin ;
2. le magasin notifie ;
3. `paint()` reconstruit la coque et appelle `view.view(ctx)` ;
4. `view.mount?.(ctx)` initialise ce qui a besoin du DOM réel (cartes).

`paint()` mémorise le champ actif et la position du curseur avant le rendu,
puis les restaure : sans cela, taper dans une recherche perdrait le focus.

## Conventions de nommage CSS

Proche de BEM, sans en faire une religion :
`.bloc`, `.bloc__element`, `.bloc--variante`, et des états en `.is-*`
(`.is-active`, `.is-sold-out`, `.is-loading`).

Les utilitaires de `base.css` (`.stack`, `.row`, `.between`, `.tiny`, `.dim`,
`.num`, `.truncate`) couvrent les micro-ajustements ; le style inline reste
réservé aux valeurs calculées, principalement `--tint`.

## Points d'attention structurels

- **Toute grille pouvant contenir un enfant large** doit déclarer
  `grid-template-columns: minmax(0, 1fr)`. Déjà appliqué à `.stack`, `.page`,
  `.section`, `.bo-page`. L'oublier fait déborder la page sur mobile.
- **`.map-canvas` isole son contexte d'empilement** (`z-index: 0` +
  `isolation: isolate`). Sans cela, les calques internes de Leaflet
  (z-index 400) recouvrent tout ce qui est posé par-dessus la carte.
- **Les composants tiers à état interne** (Leaflet) ne doivent pas dépendre
  d'un rendu complet. Voir la décision D11.
