# 05 · Pièges rencontrés et causes racines

**À lire au démarrage de chaque session.** Plusieurs de ces bugs sont
contre-intuitifs et ont coûté plusieurs itérations à diagnostiquer.

---

## P1 — Le moteur de gabarit avalait les booléens `true`

**Symptôme :** aucun chip de filtre ne s'allumait, aucun interrupteur ne
paraissait activé, les onglets sélectionnés n'étaient pas soulignés.

**Cause :** `flatten()` dans `core/dom.js` traitait `true` comme une valeur à
ne pas rendre, au même titre que `false`, `null` et `undefined` — une
convention courante pour le rendu conditionnel `${cond && html\`…\`}`. Résultat :
`aria-pressed="${true}"` produisait `aria-pressed=""`, et le sélecteur CSS
`[aria-pressed="true"]` ne matchait jamais.

**Correctif :** `null` et `undefined` disparaissent ; les booléens s'écrivent
tels quels. Le rendu conditionnel se fait donc **avec un ternaire, jamais avec
`&&`**. Vérifié : aucun `&& html\`` dans le code.

**Leçon :** une convention de rendu empruntée à React peut casser
silencieusement les attributs ARIA. Tester un attribut ARIA, pas seulement
l'apparence.

---

## P2 — Les calques Leaflet recouvraient tout ce qui était posé sur la carte

**Symptôme :** la fiche de détail d'un restaurant et les boutons « Liste » /
« Rechercher dans cette zone » n'apparaissaient jamais — alors qu'ils étaient
bien dans le DOM, avec une boîte non nulle.

**Cause :** `.leaflet-pane` porte `z-index: 400`. Le conteneur de la carte
(`position: relative`, `z-index: auto`) ne crée pas de contexte d'empilement :
ses descendants concourent donc directement avec les frères de la carte, dont
les `z-index` de 20 et 25 perdaient systématiquement.

**Correctif :** `.map-canvas` déclare `position: relative; z-index: 0;
isolation: isolate`, ce qui enferme les calques Leaflet dans leur propre
contexte.

**Le piège dans le piège :** `document.elementFromPoint()` renvoyait bien la
fiche, ce qui laissait croire qu'elle était au premier plan. Le test de
présence était donc trompeur — Leaflet pose `pointer-events: none` sur
certaines couches, si bien que le test de survol traverse des éléments
pourtant peints par-dessus.

**Leçon :** pour tout ce qui se superpose, **regarder une capture d'écran**.
Interroger le DOM ne prouve pas qu'un élément est visible.

---

## P3 — Le rendu complet détruisait la carte Leaflet à chaque clic

**Symptôme :** au clic sur un marqueur, la carte clignotait, les tuiles se
rechargeaient et la vue se recadrait ; l'utilisateur voyait « le détail
apparaître puis disparaître ».

**Cause :** la sélection écrivait dans le magasin d'état, ce qui déclenchait
`paint()`, donc le remplacement du `innerHTML` de `#app` — y compris le
conteneur de la carte. `mount()` recréait alors une instance Leaflet et
rappelait `fit()`.

**Correctif :** `views/map.js` gère sa sélection localement, écrit l'état en
mode `silent` et met à jour à la main les seuls fragments concernés. Voir la
décision D11.

**Leçon :** le rendu par `innerHTML` complet est acceptable pour du HTML pur,
jamais pour un composant tiers à état interne.

---

## P4 — La feuille de personnalisation d'un plat s'ouvrait vide

**Symptôme :** en ouvrant un deuxième plat sans fermer le premier, aucun clic
sur les options ne faisait effet et le bouton « Ajouter » ne faisait rien.

**Cause :** `openDishSheet()` affectait le brouillon (`draft`) **avant**
d'appeler `openModal()`, qui commence par fermer la feuille précédente — dont
le `onClose` remet `draft` à `null`. Le nouveau brouillon était donc effacé
juste après avoir été créé.

**Correctif :** `closeModal()` explicite en tête de `openDishSheet()`, avant
l'affectation.

**Leçon :** attention à l'ordre entre l'initialisation d'un état et un appel
qui déclenche le nettoyage de l'état précédent.

---

## P5 — Débordement horizontal de 1 px sur mobile

**Symptôme :** `scrollWidth - clientWidth = 1` sur le back-office à 390 px.

**Cause :** une grille CSS sans `grid-template-columns` explicite crée une
colonne implicite dimensionnée sur le contenu minimal de ses enfants. Un
tableau ou un Kanban élargissait donc la colonne au-delà du conteneur.

**Correctif :** `grid-template-columns: minmax(0, 1fr)` sur `.stack`,
`.stack-sm`, `.stack-lg`, `.page`, `.section` et `.bo-page`.

**Leçon :** contrôler `scrollWidth - clientWidth` sur toutes les pages, à
plusieurs largeurs, avant chaque livraison.

---

## P6 — Le panneau latéral se fermait au moindre clic à l'intérieur

**Symptôme :** dans le back-office, cliquer n'importe où dans le panneau de
détail d'une commande le refermait.

**Cause :** le voile portait `data-act="close-drawer"`. La délégation remonte
depuis la cible jusqu'au premier ancêtre portant `data-act` — donc le voile,
même pour un clic à l'intérieur du panneau.

**Correctif :** le gestionnaire vérifie que l'élément porteur est bien le
voile **et** que la cible du clic est ce voile :
`if (el.classList.contains('scrim') && event.target !== el) return;`

---

## P7 — Une option rendue en lien héritait du style des `<a>`

**Symptôme :** dans le menu mobile de la vitrine, les entrées apparaissaient
soulignées et en couleur d'accent.

**Cause :** `.option` était pensé pour un `<button>`. Utilisé sur un `<a>`, il
héritait de `text-decoration` et de `color` des liens.

**Correctif :** `a.option, a.option:hover { text-decoration: none; color: var(--ink); }`

---

## P8 — Fausse régression après déploiement

**Symptôme :** juste après un déploiement réussi, le menu mobile semblait ne
plus fonctionner sur le site en ligne.

**Cause :** GitHub Pages sert le HTML avec un cache de 10 minutes. Un
rechargement peut ramener l'ancienne page, alors que les fichiers déployés
sont corrects.

**Correctif de vérification :** charger avec un paramètre anti-cache —
`https://aziguy.github.io/kenako/?v=$(date +%s)`.

**Leçon :** ne pas conclure à une régression sur la foi d'un rechargement post-déploiement.

---

## P9 — Le navigateur de test met le CSS en cache

**Symptôme :** un correctif CSS paraissait sans effet ; `getComputedStyle`
renvoyait l'ancienne valeur.

**Cause :** cache navigateur, non contourné par `playwright-cli reload`.

**Correctif :** `playwright-cli close` puis `open`. Une session neuve part
d'un cache vide.

**Leçon :** avant de conclure qu'un correctif CSS ne marche pas, vérifier la
valeur calculée de la propriété modifiée. Si elle n'a pas changé, c'est le
cache.

---

## P10 — Empreinte SRI erronée sur Leaflet

**Symptôme :** `Failed to find a valid digest in the 'integrity' attribute` ;
Leaflet bloqué, aucune carte.

**Cause :** empreinte `integrity` incorrecte dans les balises `<script>`.

**Correctif :** utiliser l'empreinte que le navigateur indique dans le message
d'erreur. Empreinte actuelle du JS Leaflet 1.9.4 :
`sha512-puJW3E/qXDqYp9IfhAI54BJEaWIfloJ7JWs7OeD5i6ruC9JZL1gERT1wjtwXFlh7CjE7ZJ+/vcRZRkIYIb6p4g==`

---

## P11 — Heredoc bash tronqué sur les gros fichiers

**Symptôme :** `unexpected EOF while looking for matching quote` lors de
l'écriture d'une feuille de style volumineuse.

**Correctif :** utiliser l'outil d'écriture de fichier pour tout contenu
important. Un court script Python fonctionne bien pour les retouches ciblées.
Attention alors à l'encodage : lire et écrire explicitement en UTF-8, et ne
pas afficher de caractères accentués sur la sortie standard (la console
Windows est en cp1252 et l'appel échoue).

---

## P12 — Le rendu complet fait perdre le focus des champs

**Symptôme :** taper dans la recherche perdait le curseur au bout de quelques
caractères.

**Cause :** `render()` remplace le `innerHTML`, donc le champ actif.

**Correctif en place :** `paint()` mémorise `document.activeElement.dataset.bind`
et la position du curseur avant le rendu, puis les restaure. Par ailleurs,
seuls les champs qui doivent redessiner la page (recherche) déclenchent un
rendu, en différé ; les autres écrivent dans le magasin en mode `silent`.

---

## P13 — Les calques de regroupement n'acceptent pas les polygones

**Symptôme :** en activant `leaflet.markercluster` sur la carte client, les
zones de livraison du back-office risquaient de disparaître.

**Cause :** `setZones()` ajoutait les polygones au même calque que les
marqueurs. Un `markerClusterGroup` n'accepte que des marqueurs.

**Correctif :** `core/map.js` maintient deux calques distincts — `layers` pour
les marqueurs (regroupés ou non) et `shapes` pour les polygones et le cercle
de rayon.

**Leçon :** avant d'échanger un `layerGroup` contre un groupe spécialisé,
vérifier tout ce qu'on y ajoute ailleurs dans le code.
