# 01 · Journal des décisions

Chaque entrée dit ce qui a été décidé, pourquoi, et ce qui a été écarté.
Ne pas revenir sur une décision sans avoir lu sa justification.

---

## D1 — Abandonner le design canvas, reconstruire en site statique modulaire

**Date :** 4 sept. 2026 · **Statut :** appliqué

La version initiale du prototype était constituée de quatre planches
`.dc.html` dépendantes d'un runtime propriétaire (`support.js`, 69 ko généré),
avec la totalité de la logique et du style en ligne dans le HTML.

**Décidé :** tout reconstruire en site statique — modules ES natifs, CSS en
fichiers séparés, aucune étape de build.

**Pourquoi :** le livrable doit être ouvrable, hébergeable et repris par une
équipe d'intégration. Une planche de design canvas n'est ni l'un ni l'autre.
La demande explicite était de « bien segmenter les fichiers HTML, JavaScript,
CSS pour faciliter la maintenance et l'évolution ».

**Écarté :** Vite + React (ajoute une étape de build, un `node_modules` et une
compétence requise pour ouvrir le prototype) ; Web Components (surcoût de
cérémonie pour un bénéfice nul à cette échelle).

**Conséquence contraignante :** ne jamais introduire de bundler ni de
`package.json`. Cela casserait à la fois le déploiement Pages et la lisibilité
du handoff.

L'ancienne version a d'abord été conservée dans `archive/design-canvas/`, puis
supprimée le 5 sept. après audit de parité (voir D14). Elle reste récupérable
au commit `16f3bbe`. Sa documentation, `docs/handoff-planches-dc.md`, est
conservée.

---

## D2 — Palette « Paprika & Basilic » en remplacement du terracotta

**Date :** 4 sept. 2026 · **Statut :** appliqué

La palette d'origine était bâtie sur un terracotta brun (`#B2452A`), jugé trop
sourd et pas assez alimentaire.

**Décidé :**

| Rôle | Jeton | Clair | Sombre |
| --- | --- | --- | --- |
| Action principale | `--primary` | `#C9451A` Paprika | `#FF7A45` |
| Survol / texte sur clair | `--primary-strong` | `#A2360F` | `#FFA47D` |
| CTA de conversion | `--accent` | `#F5A524` Safran | `#FFC15E` |
| Donnée, second niveau, succès | `--herb` / `--success` | `#157A5B` Basilic | `#4FBC93` |
| Erreur | `--danger` | `#B3261E` | `#F0776A` |
| Fond de page | `--bg` | `#FBF6EF` Crème | `#16110E` |

**Pourquoi :** l'épice pour l'appétit, l'herbe fraîche pour la confiance
professionnelle. `#C9451A` a été choisi plutôt qu'un orange plus vif parce
qu'il atteint 4,9:1 sur blanc, donc AA pour du texte de bouton.

**Écarté :** un vert basilic en couleur principale — il serait entré en
collision avec la couleur de succès, alors que les deux doivent rester
distinguables dans le back-office.

---

## D3 — Routage par fragment d'URL

**Date :** 4 sept. 2026 · **Statut :** appliqué

`#/panier`, `#/commande/2`, `#/r/comptoir`, `#/restaurateurs`…

**Pourquoi :** GitHub Pages ne permet aucune réécriture serveur. Le fragment
rend chaque écran partageable par son URL sans configuration.

**Conséquence :** `404.html` existe pour les chemins inconnus, mais la
navigation interne ne le déclenche jamais.

---

## D4 — Rendu par gabarits et délégation d'événements

**Date :** 4 sept. 2026 · **Statut :** appliqué

Un littéral de gabarit `html\`` qui échappe par défaut, un `render()` qui
remplace le `innerHTML` d'un conteneur, et une délégation d'événements par
attribut `data-act`.

**Pourquoi :** aucun écouteur à poser ni à nettoyer, gabarits déclaratifs,
comportement regroupé dans une seule table `ACTIONS` par espace. À l'échelle
d'un prototype, le coût d'un `innerHTML` complet est négligeable.

**Limite connue et assumée :** un rendu complet détruit les instances tierces
(Leaflet) et perd le focus des champs. Deux parades sont en place — mémoriser
le champ actif et son curseur avant `render()`, et gérer localement les
interactions de la carte (voir D11).

---

## D5 — Données isolées dans `assets/js/data/`

**Date :** 4 sept. 2026 · **Statut :** appliqué

Aucune vue ne code une donnée en dur. Cinq modules : `restaurants`, `menus`,
`client`, `resto`, `admin`.

**Pourquoi :** remplacer ces modules par des appels réseau doit suffire à
brancher une vraie API. C'est ce qui rend le prototype réutilisable plutôt que
jetable.

---

## D6 — Ajouter une application livreur et une vitrine publique

**Date :** 4 sept. 2026 · **Statut :** appliqué

Le brief prévoyait trois espaces. Deux ont été ajoutés :

- **Vitrine** (`index.html`) — point d'entrée nécessaire pour GitHub Pages, et
  incarnation du CMS que pilote le superadmin.
- **Livreur** (`livreur.html`) — extension explicitement suggérée en fin de
  brief : acceptation de course, navigation, preuve de livraison.

---

## D7 — Fonds de carte OpenStreetMap plutôt que CARTO

**Date :** 4 sept. 2026 · **Statut :** appliqué

Les tuiles `basemaps.cartocdn.com` affichent désormais un filigrane
« API KEY REQUIRED ».

**Décidé :** `tile.openstreetmap.org`, libre et sans clé. Le mode sombre est
obtenu par un filtre CSS sur `.leaflet-tile-pane`
(`invert(1) hue-rotate(180deg)`), ce qui évite un second fournisseur.

---

## D8 — Vignettes générées plutôt que photographies

**Date :** 4 sept. 2026 · **Statut :** appliqué, avec réserve

Le prototype n'embarque aucune photo. Chaque restaurant porte une teinte
(`tint`) et la classe `.thumb` peint une texture déterministe : dégradés
radiaux de lumière et grain léger.

**Pourquoi :** aucune photographie libre de droits cohérente n'était
disponible, et des images génériques auraient affaibli le propos.

**Réserve assumée :** le brief demandait « la nourriture comme héros visuel ».
C'est le seul point où le prototype reste en deçà. Les emplacements et les
ratios sont prêts à recevoir de vraies photos. Voir `06-ouvert.md`.

---

## D9 — Commits en français, sans aucune mention d'IA

**Date :** 4 sept. 2026 · **Statut :** appliqué, **impératif**

Demande explicite du propriétaire du dépôt : « jamais commit avec claude ou
référencer claude dans les messages de commit ». Cette consigne prime sur
toute attribution par défaut de l'outillage.

Format retenu : titre court, puis un corps qui expose le problème et sa cause
avant la solution.

---

## D10 — Slogan sur la vitrine, label fonctionnel dans les applications

**Date :** 4 sept. 2026 · **Statut :** appliqué et **confirmé** le 5 sept.

Sous le monogramme, la vitrine affiche le slogan **« Qu'est-ce qu'on
mange… »** en serif italique semi-gras avec un dégradé paprika → safran
accordé au monogramme. Les applications affichent à la place le nom de
l'espace (« Espace client », « Livreur · Karim T. », « Formule Signature »).

**Pourquoi :** dans un prototype à cinq espaces, cette ligne sert à se
repérer. Le slogan y perdrait cette fonction.

**Tranché le 5 sept. 2026** par le propriétaire du dépôt : « pas de slogan sur
toutes les pages ». Le comportement décrit ci-dessus est définitif.

---

## D11 — La sélection sur la carte ne passe pas par le magasin d'état

**Date :** 5 sept. 2026 · **Statut :** appliqué

Cliquer un marqueur mettait `mapSelected` dans le magasin, ce qui déclenchait
un rendu complet de l'application, donc la destruction et la recréation de
l'instance Leaflet : carte qui clignote, tuiles rechargées, vue recadrée.

**Décidé :** `views/map.js` gère sa sélection lui-même. Il écrit l'état en
mode `silent` (mémorisé pour un futur rendu, sans en déclencher un) et met à
jour à la main les seuls fragments concernés : marqueurs, fiche flottante,
surbrillance de la liste.

**Conséquence :** les actions `peek` et `close-peek` de `client/app.js`
délèguent à `MapView.select()` / `MapView.clearSelection()` au lieu d'écrire
dans le magasin. C'est une exception documentée au modèle D4 ; l'appliquer à
tout composant tiers à état interne.

---

## D12 — Carte des plats en grille de cartes

**Date :** 5 sept. 2026 · **Statut :** appliqué

Les plats s'affichaient en liste à colonne unique étirée sur 1240 px, avec un
grand vide entre le texte et la vignette.

**Décidé :** une grille de cartes — une colonne sur mobile, deux au-delà de
880 px. Vignette à gauche, **nom et prix alignés sur la même ligne** pour que
l'œil balaye une colonne de prix plutôt que de les chercher dans le texte.

---

## D13 — Le monogramme s'étire sur la hauteur du bloc de texte

**Date :** 5 sept. 2026 · **Statut :** appliqué

Le carré faisait 30 px face à un bloc de texte d'environ 34 px : le lockup
paraissait désaligné.

**Décidé :** `align-self: stretch` + `aspect-ratio: 1` sur `.logo-mark` dans
un bloc `.brand`, avec `min-width` et `min-height` de 34 px pour qu'il reste
carré même quand le texte tient sur une seule ligne. Les deux lignes de texte
ont des interlignes fixes.

**Pourquoi cette approche plutôt qu'une taille figée :** le lockup reste
aligné quelle que soit la longueur de la ligne secondaire — slogan de 16 px
sur la vitrine, étiquette de 10 px dans les applications.

---

## D14 — Suppression de l'archive après audit de parité

**Date :** 5 sept. 2026 · **Statut :** appliqué

Le propriétaire a autorisé la suppression de `archive/design-canvas/` **à
condition** que le nouveau prototype couvre tout ce que contenait l'archive.

**Décidé :** vérifier la condition plutôt que la supposer. Audit section par
section des 28 blocs de `docs/handoff-planches-dc.md`. Dix-neuf écarts réels
trouvés et comblés, puis suppression.

**Pourquoi cette rigueur :** une condition posée par le propriétaire n'est pas
une formalité. Supprimer sans vérifier aurait fait perdre des fonctionnalités
sans que personne ne s'en aperçoive avant longtemps.

**Récupération :** `git checkout 16f3bbe -- archive/design-canvas/`.

**Conservé :** `docs/handoff-planches-dc.md`, seul relevé détaillé de la
spécification d'origine et grille de l'audit.
