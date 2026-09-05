# 06 · Points ouverts

État au 5 septembre 2026.

---

## Questions posées, sans réponse à ce jour

### Q1 — Le slogan doit-il figurer dans toutes les applications ?

Actuellement, la ligne sous le monogramme affiche :

- **Vitrine et pied de page** → le slogan « Qu'est-ce qu'on mange… » ;
- **Applications** → le nom de l'espace (« Espace client », « Livreur ·
  Karim T. », « Formule Signature », « Console superadmin »).

Le raisonnement retenu : dans un prototype à cinq espaces, cette ligne sert à
se repérer, et le slogan y perdrait cette fonction. La question a été posée
explicitement au propriétaire du dépôt ; il n'a pas tranché.

Si la réponse est « le slogan partout », le changement se fait dans
`core/shell.js` (`brandMark`) et dans les appels des quatre `app.js`.

### Q2 — Faut-il retirer `archive/design-canvas/` du dépôt ?

L'ancien prototype y est conservé, avec sa documentation dans
`docs/handoff-planches-dc.md`. La question a été posée ; sans réponse, le
dossier reste en place. Il représente environ 380 ko.

---

## Limite assumée

### L1 — Aucune photographie

Les vignettes de plats et de restaurants sont des textures générées à partir
de la teinte de chaque établissement. Le brief demandait « la nourriture comme
héros visuel » : c'est le seul point où le prototype reste en deçà, faute
d'images libres de droits cohérentes.

Les emplacements, les ratios et les dégradés de lisibilité sont prêts à
recevoir de vraies photographies. Le changement se ferait dans `.thumb`
(`assets/css/components.css`) et dans les données (`assets/js/data/`) pour
porter les URL.

---

## Backlog technique

Par ordre de valeur décroissante.

| # | Sujet | Note |
| --- | --- | --- |
| B1 | **Glisser-déposer réel des catégories de la carte** | Le balisage est en place (`draggable="true"`, classes `.is-dragging` / `.is-over`), mais le réordonnancement se fait aujourd'hui par des boutons ▲▼. Les gestionnaires `dragstart` / `dragover` / `drop` restent à écrire dans `resto/app.js`. |
| B2 | **Tests automatisés** | Aucun à ce jour. La vérification est manuelle, via le balayage `playwright-cli` décrit dans `AGENTS.md`. Un premier jeu de tests de parcours (commande de bout en bout, refus de commande, validation de dossier) apporterait beaucoup. |
| B3 | **Dessin des zones de livraison** | La carte affiche les polygones existants ; le mode dessin affiche un message d'intention. |
| B4 | **Vrai regroupement de marqueurs au dézoom** | Le brief mentionnait un clustering. Avec dix restaurants, les marqueurs restent lisibles ; à cinquante, il deviendrait nécessaire. |
| B5 | **Éditions de formulaire non persistées** | Les feuilles d'édition (plat, promo, campagne, événement, réservation, membre du staff) affichent un formulaire réaliste et confirment par un toast, sans écrire dans le magasin. Assumé pour un prototype ; à câbler si le prototype doit servir de démonstration interactive plus poussée. |
| B6 | **Impression du ticket et de la planche de QR codes** | Déclenchent `window.print()` avec une feuille `@media print` sommaire. Une mise en page ticket dédiée serait à concevoir. |

---

## Ce qui est explicitement terminé

Pour éviter de rouvrir des sujets clos :

- Segmentation des fichiers HTML / CSS / JS — fait, sans bundler.
- Navigation basse sur mobile — sur les quatre applications, plus un menu en
  feuille sur la vitrine.
- Remplacement de la couleur marron — palette Paprika & Basilic, clair et
  sombre.
- GitHub Pages — actif, déploiement automatique sur poussée vers `master`.
- Absence de débordement horizontal — vérifiée de 320 à 1920 px.
- Mode sombre — sur les cinq espaces.
- Les huit états limites du brief — regroupés sur `client.html#/etats`.
