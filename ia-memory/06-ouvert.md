# 06 · Points ouverts

État au 5 septembre 2026.

---

## Questions tranchées

### Q1 — Le slogan doit-il figurer dans toutes les applications ? → **Non**

Décision du propriétaire du dépôt : « pas de slogan sur toutes les pages ».

Le comportement en place est donc confirmé :

- **Vitrine et pied de page** → le slogan « Qu'est-ce qu'on mange… » ;
- **Applications** → le nom de l'espace (« Espace client », « Livreur ·
  Karim T. », « Formule Signature », « Console superadmin »), qui sert à se
  repérer entre les cinq espaces.

Ne pas rouvrir ce point.

### Q2 — Faut-il retirer `archive/design-canvas/` du dépôt ? → **Oui, fait**

Décision du propriétaire, sous condition : supprimer **si** le nouveau
prototype couvre tout ce que contenait l'archive, et davantage.

La condition a été vérifiée par un audit écran par écran, sur la base de
`docs/handoff-planches-dc.md` (28 sections : A1–A10, B1–B11, C1–C7). L'audit a
révélé **dix-neuf écarts réels**, tous comblés avant la suppression — voir
l'entrée du 5 septembre dans `04-journal.md`.

L'archive est supprimée du répertoire de travail. Elle reste récupérable dans
l'historique Git, au commit `16f3bbe` :

```bash
git show 16f3bbe --stat -- archive/design-canvas/
git checkout 16f3bbe -- archive/design-canvas/
```

`docs/handoff-planches-dc.md` est conservé : c'est le seul relevé détaillé de
la spécification d'origine, et il a servi de grille d'audit.

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
| B1 | **Tests automatisés** | Aucun à ce jour. La vérification est manuelle, via le balayage `playwright-cli` décrit dans `AGENTS.md`. Un premier jeu de tests de parcours (commande de bout en bout, refus de commande, validation de dossier) apporterait beaucoup. |
| B2 | **Dessin des zones de livraison** | La carte affiche les polygones existants et le cercle de rayon maximal ; le mode dessin affiche encore un message d'intention. |
| B3 | **Réordonnancement des catégories par glisser-déposer** | Les plats se réordonnent bien par glisser-déposer à l'intérieur d'une catégorie. Les catégories elles-mêmes se déplacent encore par boutons ▲▼. |
| B4 | **Déplacer un plat d'une catégorie à l'autre** | Le glisser-déposer est volontairement limité à l'intérieur d'une même catégorie. |
| B5 | **Éditions de formulaire non persistées** | Les feuilles d'édition (plat, promo, campagne, événement, réservation, membre du staff) affichent un formulaire réaliste et confirment par un toast, sans écrire dans le magasin. Assumé pour un prototype. |
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
- **Parité avec l'archive** — audit des 28 sections mené le 5 septembre, dix-neuf
  écarts comblés, archive supprimée.
