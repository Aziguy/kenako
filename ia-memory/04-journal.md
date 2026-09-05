# 04 · Journal des sessions

Le plus récent en haut. Chaque entrée dit ce qui a été demandé, ce qui a été
livré, et ce qui a été vérifié.

---

## 5 sept. 2026 — Documentation et mémoire du projet

**Demandé :** créer `CLAUDE.md`, `AGENTS.md`, et un dossier `ia-memory/`
consignant la mémoire du projet, les décisions et tout ce qui a été fait, de
manière à pouvoir reprendre le travail dans une nouvelle session.

**Livré :**

- `AGENTS.md` — guide de travail : règles non négociables, boucle de
  vérification, architecture, conventions de code, procédure d'ajout d'écran,
  git et déploiement, liste de contrôle avant livraison.
- `CLAUDE.md` — pointeur vers `AGENTS.md` plus les consignes propres à une
  session Claude Code (les trois règles impératives, les réflexes de
  vérification, l'entretien de la mémoire).
- `ia-memory/` — sept documents : contexte, décisions, architecture, design
  system, journal, pièges, points ouverts.

---

## 5 sept. 2026 — Carte cliquable, fiche restaurant, bloc de marque

*Commit `0e95aca`*

**Signalé :** le clic sur un marqueur n'ouvrait aucun détail, ni sur grand
écran ni sur mobile, avec l'impression d'un panneau qui s'affiche et
disparaît aussitôt. La fiche restaurant était mal stylisée. Le monogramme, le
nom et le slogan n'étaient pas alignés.

**Diagnostiqué — trois causes cumulées pour la carte :**

1. La fiche portait la classe `mobile-only` : invisible au-delà de 768 px.
2. La sélection passait par le magasin d'état, ce qui repeignait toute
   l'application et détruisait puis recréait l'instance Leaflet à chaque clic.
3. Les calques internes de Leaflet (z-index 400) recouvraient la fiche **et**
   les outils de carte, qui n'avaient jamais été visibles depuis la création
   du prototype.

Détail complet dans `05-pieges.md`, entrées P2 et P3.

**Livré :**

- `views/map.js` réécrit : sélection gérée localement, fiche enrichie
  (vignette, note, distance, délai, frais, minimum, modes, promotion, bouton
  de fermeture, accès à la carte du restaurant), liste latérale qui
  sélectionne au lieu de naviguer et se surligne en miroir des marqueurs.
  Le recadrage n'a lieu qu'en sélectionnant depuis la liste.
- `.map-canvas` isole son contexte d'empilement.
- Les outils de carte passent en `flex-wrap` et raccourcissent leur libellé
  sur mobile — ils se chevauchaient à 390 px.
- Plats en grille de cartes : une colonne sur mobile, deux au-delà de 880 px,
  vignette à gauche, nom et prix sur la même ligne, allergènes en note.
- Bloc de marque unifié : le carré s'étire sur la hauteur du texte, dans la
  barre haute, la colonne latérale, la vitrine et le pied de page.

**Vérifié :** 6 pages × 2 largeurs, `overflow=0` et `Errors: 0` partout.
Parcours de sélection testé sur le site déployé — `elementFromPoint` renvoie
bien `map-peek`, la fiche est au premier plan.

---

## 4 sept. 2026 — Navigation mobile de la vitrine et slogan

*Commit `ff750e8`*

**Signalé :** aucune navigation sur mobile ; remplacer « Prototype » sous le
logo par le slogan « Qu'est-ce qu'on mange… », bien stylisé.

**Diagnostiqué :** la barre de la vitrine masquait ses liens sous 900 px sans
aucun repli. Sous cette largeur, seul le bouton « Commander » restait. Les
quatre applications avaient bien leur navigation basse : seule la page
d'accueil était concernée.

**Livré :**

- Bouton menu sous 900 px ouvrant une feuille : sections du site avec
  sous-titres, les cinq espaces du prototype, bascule de thème, et un appel à
  l'action en pied de feuille. Les ancres referment la feuille avant de
  défiler.
- La bascule de thème migre dans la feuille sur mobile pour libérer la place.
- Slogan en serif italique semi-gras, dégradé paprika → safran accordé au
  monogramme, tailles progressives 13,5 → 15 → 16 px, repris en 21 px dans le
  pied de page.
- Correction associée : une option rendue en lien n'hérite plus du
  soulignement des `<a>`.

**Vérifié :** 6 pages × 3 largeurs (390 / 768 / 1440), `overflow=0`,
`Errors: 0`. Navigation par ancre testée sur le site déployé.

---

## 4 sept. 2026 — Refonte complète du prototype

*Commit `16f3bbe` — commit initial du dépôt*

**Demandé :** le prototype existant manquait de robustesse ; le compiler en un
seul, avec des fichiers bien segmentés, le rendre pleinement responsive avec
une navigation basse sur mobile, améliorer le design en remplaçant le marron,
publier sur GitHub Pages, pousser sur `git@github.com:Aziguy/kenako.git`.

**État de départ :** quatre planches `.dc.html` dépendantes d'un runtime
propriétaire (`support.js`, 69 ko généré), toute la logique et tout le style en
ligne. Environ 5 400 lignes.

**Livré :** un site statique de 55 modules JS et 7 feuilles de style, environ
10 400 lignes, sans bundler.

- Socle partagé : gabarits, magasin d'état, routeur, formatage français,
  thème, toasts, feuilles, icônes, graphiques SVG, enveloppe Leaflet, coques.
- Données isolées dans cinq modules.
- Cinq espaces : vitrine (nouvelle), client, restaurateur, superadmin,
  livreur (nouveau), plus la planche de design system.
- Palette « Paprika & Basilic » en remplacement du terracotta brun, en clair
  et en sombre.
- Navigation basse fixe sur les quatre applications, feuille « Plus » pour les
  back-offices.
- Fonctionnalités ajoutées : panier, favoris et thème persistés ; recherche,
  filtres combinés et tri ; tri de colonnes côté superadmin ; codes promo
  réellement calculés avec minimum de commande et franco de port ; cartes de
  fidélité par restaurant ; analytique restaurateur (heures de pointe,
  rentabilité par plat, motifs de refus).
- Ancien prototype conservé dans `archive/design-canvas/`, documentation dans
  `docs/`.
- Déploiement GitHub Pages par `.github/workflows/pages.yml`, Pages activé en
  mode « GitHub Actions » via l'API.

**Bugs trouvés et corrigés en cours de route :** P1 (booléens avalés par le
moteur de gabarit), P4 (feuille de plat vide), P5 (débordement de 1 px), P6
(panneau latéral), P10 (empreinte SRI), plus le passage de CARTO à
OpenStreetMap (D7).

**Vérifié :** 37 routes parcourues sur les 4 applications, 0 erreur console ;
parcours de commande complet de la personnalisation au paiement ; refus motivé
côté restaurateur ; validation et refus de dossier côté superadmin.
