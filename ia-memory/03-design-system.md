# 03 · Design system

La planche vivante est `design-system.html`. Ce document en donne les règles et
les intentions ; en cas de doute, la planche fait foi.

## Palette « Paprika & Basilic »

L'épice pour l'appétit, l'herbe fraîche pour la confiance professionnelle.
Tous les jetons sont définis dans `assets/css/tokens.css`.

| Rôle | Jeton | Clair | Sombre |
| --- | --- | --- | --- |
| Action principale | `--primary` | `#C9451A` Paprika | `#FF7A45` |
| Survol, texte sur fond clair | `--primary-strong` | `#A2360F` | `#FFA47D` |
| Fond d'état sélectionné | `--primary-soft` | `#FBE3D7` | `#3E2015` |
| CTA de conversion | `--accent` | `#F5A524` Safran | `#FFC15E` |
| Donnée, second niveau, succès | `--herb` / `--success` | `#157A5B` Basilic | `#4FBC93` |
| Avertissement | `--warning` | `#A96A00` | `#E0A94A` |
| Erreur | `--danger` | `#B3261E` | `#F0776A` |
| Information | `--info` | `#2C5F86` | `#85B3DC` |
| Fond de page | `--bg` | `#FBF6EF` Crème | `#16110E` |
| Surface | `--surface` | `#FFFDFA` | `#201914` |

**Jamais de blanc pur ni de noir pur.** Les neutres sont chauds.

`#C9451A` a été retenu parce qu'il atteint 4,9:1 sur blanc, donc AA pour du
texte de bouton. Un orange plus vif aurait été plus appétissant mais illisible.

**Surface admin :** la console superadmin ajoute `data-surface="admin"` sur
`<html>`, ce qui neutralise les fonds chauds au profit d'un gris plus sobre et
réduit `--fs-md` de 15 à 14 px. Interface plus dense, orientée données.

## Typographie

- **Newsreader** (serif éditoriale) — titres, noms de restaurants et de plats,
  slogan. Graisse 500 pour les titres, 600 pour les noms de marque.
- **Instrument Sans** — interface et données.
- **Chiffres tabulaires en monospace** (`.num`) — prix, montants, KPI,
  identifiants de commande. Ils doivent s'aligner en colonne.

Échelle : display `clamp(38px, 6vw, 64px)`, h1 `clamp(28px, 4.2vw, 40px)`,
h2 `clamp(22px, 3vw, 30px)`, corps 15 px, légende 13 px, étiquette 11 px.

## Formes et mouvement

- Rayons : 6 (chip), 8, 12 (bouton), 16 (carte), 24 (feuille).
- **Ombres chaudes plutôt que bordures dures.** Quatre niveaux, `--shadow-xs`
  à `--shadow-lg`.
- Espacement sur une échelle de 4 : `--sp-1` (4 px) à `--sp-16` (64 px).
- Transitions : 120 ms (fast), 180 ms (base), 260 ms (slow), courbe
  `cubic-bezier(.2, 0, 0, 1)`. `prefers-reduced-motion` neutralise tout.

## Règles d'interface

### Accessibilité

- Contraste AA minimum sur tout texte et toute icône porteuse de sens.
- Focus visible : contour safran de 3 px, décalé de 2 px.
- Cibles tactiles de 44 px minimum (`--tap`).
- **Jamais la couleur seule.** Chaque statut combine couleur, icône et texte :
  `✓ Ouvert`, `✕ Fermé`, `! En rupture`, `⏳ En attente`.
- `prefers-reduced-motion` désactive animations et défilement animé.
- Lien d'évitement vers le contenu principal sur chaque page.

### Responsive

- Mobile d'abord. Navigation basse fixe sur les quatre applications.
- Les modales deviennent des bottom-sheets sous 768 px (`.sheet`).
- Le back-office passe de la colonne latérale (≥ 900 px) à la navigation basse
  avec une feuille « Plus ».
- La vitrine passe de liens horizontaux (≥ 900 px) à un bouton menu.
- Tableaux et Kanban défilent horizontalement dans leur propre conteneur.
- **Aucun défilement horizontal de page**, de 320 à 1920 px. Vérifié à chaque
  livraison.

### Ton

Chaleureux et direct côté client ; sobre et dense en information côté
back-office. Ce ne sont pas les mêmes utilisateurs : le back-office privilégie
la densité et la rapidité, pas la beauté décorative.

## Vignettes de plats et de restaurants

Le prototype n'embarque aucune photo. La classe `.thumb` peint une texture
déterministe à partir de la teinte du restaurant (`--tint`) : dégradés radiaux
de lumière et grain léger en superposition.

Chaque restaurant porte sa teinte dans `data/restaurants.js`. Les emplacements
et les ratios sont prêts à recevoir de vraies photographies.

## Bloc de marque

Monogramme carré + nom + ligne secondaire. Le carré **s'étire sur la hauteur
exacte du bloc de texte** (`align-self: stretch` + `aspect-ratio: 1`,
minimum 34 px), ce qui garde le lockup aligné quelle que soit la ligne
secondaire.

- Vitrine et pied de page : slogan **« Qu'est-ce qu'on mange… »**, serif
  italique 600, dégradé paprika → safran accordé au monogramme.
- Applications : nom de l'espace en capitales espacées (`.brand__sub`).

## Graphiques

Tout est en SVG produit par `core/charts.js`, sans dépendance : courbe d'aire,
micro-courbe, barres horizontales, colonnes, anneau, carte de chaleur. Chaque
graphique porte un `aria-label` qui résume la donnée.
