# Kenako — prototype de plateforme SaaS multi-restaurants

Prototype cliquable, entièrement responsive, d'une plateforme où chaque restaurant dispose
de sa propre boutique en ligne sous une marque commune. **La plateforme ne prend aucune
commission sur les commandes** : elle facture un abonnement mensuel au restaurateur, et
chaque paiement va directement à l'établissement.

> 🔗 **Démo en ligne** — https://aziguy.github.io/kenako/

---

## Les cinq espaces

| Espace | Fichier | Contenu |
| --- | --- | --- |
| **Vitrine publique** | `index.html` | Page marketing, grille tarifaire, accès aux espaces |
| **Client** | `client.html` | Découverte, carte, fiche restaurant, panier, commande, suivi, compte, QR de table |
| **Restaurateur** | `restaurateur.html` | Tableau de bord, Kanban, écran cuisine, carte, livraison, marketing, finances, analytique |
| **Superadmin** | `superadmin.html` | MRR, validation des dossiers, abonnements, CMS, mise en avant, supervision, modération |
| **Livreur** | `livreur.html` | Acceptation de course, navigation, preuve de livraison |
| **Design system** | `design-system.html` | Palette, typographie, composants et tous leurs états |

Chaque espace est une application à part entière, avec son propre routeur à fragment
(`#/panier`, `#/commandes`, `#/restaurateurs`…) : tout écran est partageable par son URL.

---

## Lancer le prototype

Aucune étape de compilation : ce sont des modules ES natifs et du CSS.
Il faut simplement un serveur statique (les modules ES ne se chargent pas en `file://`).

```bash
python -m http.server 8000
# puis http://localhost:8000
```

ou, avec Node :

```bash
npx serve .
```

---

## Organisation des fichiers

```
.
├── index.html                  Vitrine publique (point d'entrée GitHub Pages)
├── client.html                 Espace client
├── restaurateur.html           Back-office restaurateur
├── superadmin.html             Console superadmin
├── livreur.html                Application livreur
├── design-system.html          Planche du design system
├── 404.html
├── manifest.webmanifest        Installable sur mobile
│
├── assets/
│   ├── css/
│   │   ├── tokens.css          Jetons : couleurs, typo, espacement, ombres, mode sombre
│   │   ├── base.css            Reset, primitives typographiques, utilitaires
│   │   ├── components.css      Boutons, champs, badges, cartes, tableaux, modales, toasts…
│   │   ├── layout.css          Coques : barre haute, navigation basse, colonne latérale
│   │   ├── client.css          Spécifique à l'espace client
│   │   ├── backoffice.css      Spécifique aux back-offices
│   │   └── landing.css         Spécifique à la vitrine
│   │
│   ├── js/
│   │   ├── core/               Socle partagé par les cinq applications
│   │   │   ├── dom.js          Gabarits `html``, échappement, délégation d'événements
│   │   │   ├── store.js        Magasin d'état réactif + persistance localStorage
│   │   │   ├── router.js       Routeur à fragment d'URL
│   │   │   ├── format.js       Formatage français (€, distances, dates, pluriels)
│   │   │   ├── theme.js        Thème clair / sombre
│   │   │   ├── toast.js        Notifications éphémères
│   │   │   ├── sheet.js        Modales et bottom-sheets
│   │   │   ├── icons.js        Jeu d'icônes SVG
│   │   │   ├── charts.js       Courbes, barres, anneau, carte de chaleur (SVG pur)
│   │   │   ├── map.js          Enveloppe Leaflet (marqueurs, zones, thème)
│   │   │   └── shell.js        Barre haute, navigation basse, colonne latérale
│   │   │
│   │   ├── data/               Données de démonstration, partagées entre espaces
│   │   │   ├── restaurants.js  10 établissements, réglages de paiement / livraison / fidélité
│   │   │   ├── menus.js        Cartes, options, allergènes, formules
│   │   │   ├── client.js       Avis, événements, historique, adresses, fidélité
│   │   │   ├── resto.js        Back-office du Comptoir de Marie
│   │   │   └── admin.js        Parc, abonnements, CMS, tickets, audit
│   │   │
│   │   ├── client/             app.js + cart.js + components.js + views/
│   │   ├── resto/              app.js + components.js + views/
│   │   ├── admin/              app.js + components.js + views/
│   │   ├── courier/            app.js
│   │   ├── landing.js
│   │   └── design-system.js
│   │
│   └── img/favicon.svg
│
├── docs/
│   ├── brief-original.md       Le cahier des charges de départ
│   └── handoff-planches-dc.md  Documentation de la première version (planches de design)
│
└── archive/design-canvas/      Première version du prototype (planches `.dc.html`)
```

### Comment une vue est écrite

Chaque écran est un module qui exporte `view(ctx)` — et, si besoin, `mount(ctx)` /
`unmount()` pour les cartes Leaflet.

```js
export function view({ state }) {
  return html`<h1 class="page__title">${state.title}</h1>
    <button class="btn btn--primary" data-act="commander">Commander</button>`;
}
```

Aucun événement n'est attaché dans les gabarits : un attribut `data-act` suffit, et
l'application associe ce nom à un gestionnaire dans son fichier `app.js`. Les gabarits
restent déclaratifs, le comportement reste regroupé en un seul endroit, et le rendu
complet d'un écran ne coûte qu'un `innerHTML`.

---

## Direction artistique

Palette **Paprika & Basilic** — l'épice pour l'appétit, l'herbe fraîche pour la confiance.
Elle remplace le terracotta brun de la première version : plus vive, plus alimentaire,
et suffisamment contrastée pour tenir en mode sombre.

| Rôle | Jeton | Clair | Sombre |
| --- | --- | --- | --- |
| Action principale | `--primary` | `#C9451A` Paprika | `#FF7A45` |
| Survol / texte | `--primary-strong` | `#A2360F` | `#FFA47D` |
| CTA de conversion | `--accent` | `#F5A524` Safran | `#FFC15E` |
| Donnée, succès | `--herb` / `--success` | `#157A5B` Basilic | `#4FBC93` |
| Erreur | `--danger` | `#B3261E` | `#F0776A` |
| Fond de page | `--bg` | `#FBF6EF` Crème | `#16110E` |

Typographie : **Newsreader** (serif éditoriale) pour les titres et les noms de plats,
**Instrument Sans** pour l'interface et les données, chiffres tabulaires en monospace.
Rayons de 8 à 24 px, ombres chaudes plutôt que bordures dures, transitions de 120 à 260 ms.

La planche complète est dans `design-system.html`.

---

## Ce que le prototype démontre

**Parcours client** — découverte filtrée et triée → carte Leaflet avec marqueurs de marque →
fiche restaurant → personnalisation d'un plat (tailles, choix obligatoire, suppléments plafonnés,
prix recalculé) → panier → tunnel en trois étapes → paiement → suivi qui avance tout seul →
proposition de compte *après* la commande.

**Parcours restaurateur** — inscription en quatre étapes → écran d'attente de validation →
checklist de démarrage dont le bouton « publier » ne s'active qu'à 100 % → tableau de bord avec
interrupteur d'acceptation et mode rush → Kanban et écran cuisine → gestion de la carte, des
zones de livraison, du marketing et des finances → analytique avancée (heures de pointe,
rentabilité par plat, motifs de refus).

**Parcours superadmin** — pilotage du MRR → validation d'un dossier avec ses documents →
abonnements, promotions et relances d'impayés → CMS de la page publique → supervision
**en lecture seule**.

**États limites** — `client.html#/etats` regroupe les huit situations qu'on oublie de dessiner :
restaurant fermé, zone non livrée, panier vide, aucun résultat, plat en rupture, paiement refusé,
géolocalisation refusée, chargement.

### Ce qui a été ajouté par rapport à la première version

- une **vitrine publique** qui sert de point d'entrée et de page d'accueil éditable via le CMS ;
- une **application livreur** complète (course, navigation, preuve de livraison) ;
- une **analytique avancée** pour le restaurateur : heures de pointe, marge par plat, taux de refus ;
- la **persistance** du panier, des favoris et du thème dans le navigateur ;
- la **recherche, le tri et les filtres combinés** côté client, et le tri de colonnes côté superadmin ;
- des **cartes de fidélité par restaurant** (points, tampons, cashback) rendues visuellement ;
- des **codes promo réellement calculés** dans le tunnel, avec minimum de commande et franco de port.

---

## Contraintes respectées

- Aucun écran ne suggère une commission ou un reversement de la plateforme.
- Le superadmin ne peut ni modifier ni annuler une commande — le bandeau de lecture seule le dit.
- Chaque restaurateur configure indépendamment ses paiements, sa livraison, sa fidélité et son
  parrainage ; ces réglages se reflètent directement côté client.
- Commander sans compte est possible de bout en bout.
- Mobile d'abord : cibles tactiles de 44 px, navigation basse fixe, modales devenant des
  bottom-sheets sous 768 px, aucun défilement horizontal de page.
- Accessibilité : contraste AA, focus visible, statuts portés par couleur **et** icône **et** texte,
  respect de `prefers-reduced-motion`, lien d'évitement sur chaque page.
- Mode sombre sur les cinq espaces.

---

## Données

Toutes les données sont fictives mais cohérentes d'un écran à l'autre : dix restaurants
parisiens aux identités distinctes, prix réalistes, avis rédigés naturellement. Le restaurant
fil rouge du back-office est **Le Comptoir de Marie**, bistrot moderne du 11ᵉ.

Elles vivent dans `assets/js/data/` : remplacer ces modules par des appels réseau suffit à
brancher le prototype sur une vraie API.

---

## Dépendances

- **Leaflet 1.9.4** (CDN) pour les cartes — le prototype affiche un repli explicite si la
  librairie n'est pas disponible ;
- **Google Fonts** pour Newsreader et Instrument Sans ;
- fonds de carte **OpenStreetMap**.

Aucune autre dépendance, aucun bundler, aucune étape de build.

---

## Déploiement

Le site est publié automatiquement sur GitHub Pages à chaque poussée sur `master`
(`.github/workflows/pages.yml`). Le fichier `.nojekyll` évite que Jekyll n'ignore
les dossiers utiles.
