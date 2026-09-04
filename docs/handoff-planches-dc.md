# Handoff : Kenako — plateforme SaaS multi-restaurants

## Overview

Kenako est une plateforme multi-vendeurs pour restaurateurs indépendants. Chaque restaurant dispose de sa boutique en ligne (menu, commandes, livraison, fidélité) sous une marque commune ; les clients découvrent les restaurants autour d'eux sur une carte.

**Modèle économique (contrainte structurante) :** la plateforme ne prélève **aucune commission** sur les commandes. Elle facture un **abonnement mensuel** au restaurateur. Chaque commande et chaque paiement va **directement** au restaurateur. Aucun écran ne doit suggérer une commission, un reversement ou une retenue. Le superadmin **ne peut ni modifier ni annuler une commande**.

Trois espaces sont couverts :
- **Bloc A — Espace client** (public, sans compte obligatoire) : `Kenako Client.dc.html`
- **Bloc B — Espace restaurateur** (back-office) : `Kenako Restaurateur.dc.html`
- **Bloc C — Espace superadmin** (pilotage plateforme) : `Kenako Superadmin.dc.html`
- **Planche 00 — Design System** : `Kenako Design System.dc.html`

## About the Design Files

Les fichiers de `design/` sont des **références de design réalisées en HTML** — des prototypes montrant l'apparence et le comportement visés, **pas du code de production à copier tel quel**.

La tâche est de **recréer ces designs dans l'environnement du codebase cible** (React/Next, Vue, React Native, SwiftUI…) en suivant ses conventions, ses composants et ses libs existantes. Si aucun environnement n'existe encore, choisir la stack la plus adaptée au projet (recommandation : Next.js + TypeScript + Tailwind ou CSS Modules côté web, avec une API REST/GraphQL et Stripe Connect côté paiement) puis implémenter les designs dedans.

Détails techniques à connaître :
- Les `.dc.html` sont des composants « Design Component » : un template HTML avec des trous `{{ … }}` et une classe de logique JS (`class Component extends DCLogic`) rendue via React par `support.js`. **`support.js` est un runtime de prototypage : ne pas le porter.** Lisez-le seulement si vous devez comprendre la syntaxe (`<sc-for list>`, `<sc-if value>`, `style-hover=`).
- Tout le style est en **styles inline** dans le template ; les variables CSS (`--primary`, `--ink`…) sont déclarées dans le `<style>` du `<helmet>` de chaque fichier, avec une variante `body[data-theme=dark]`.
- Les jeux de données de démonstration sont dans `kenako-data.js` (client), `kenako-resto-data.js` (restaurateur), `kenako-admin-data.js` (superadmin). Ils décrivent la **forme des modèles de données attendus** : servez-vous en comme base de schéma.
- Les cartes utilisent **Leaflet 1.9.4** + `leaflet.markercluster` (CDN unpkg), fonds de carte CARTO (voyager / dark_all). Reprenez Leaflet ou l'équivalent de votre stack (react-leaflet, MapLibre).
- Les photos sont des **placeholders** (dégradés rayés à 135° dans la couleur du restaurant + libellé monospace « photo »). À remplacer par les vraies images ; conserver les ratios (16/10 cartes restaurant, 1/1 vignettes de plat 104 px, 16/8 événements).
- Aucune API Anthropic n'est utilisée : rien de bloquant pour un export offline.

## Fidelity

**Haute fidélité (hifi).** Couleurs, typographie, espacements, rayons, ombres, états et micro-interactions sont définitifs. L'UI doit être recréée fidèlement, avec les composants et primitives du codebase cible. Les libellés français des écrans sont la copy finale — les reprendre à l'identique.

Ce qui reste explicitement « maquette » (toasts « — maquette » dans le prototype) : éditeurs de formulaire secondaires (éditeur de plat, éditeur d'événement, éditeur de bannière, sélecteur de média, comparateur de formules, éditeur de grille tarifaire). Ces écrans sont à concevoir/implémenter selon les conventions du codebase.

---

## Design Tokens

Déclarés en variables CSS sur `body`, avec surcharge `body[data-theme=dark]`. Les espaces client et restaurateur ont un mode sombre ; la console superadmin utilise une palette légèrement plus froide/dense (voir 2e tableau).

### Couleurs — espace client & restaurateur (`Kenako Client`, `Kenako Restaurateur`)

| Token | Clair | Sombre | Usage |
|---|---|---|---|
| `--bg` | `#F5EFE4` | `#1B1613` | fond de page (crème, jamais blanc pur) |
| `--surface` | `#FDF9F2` | `#251E1A` | cartes, panneaux, barres |
| `--surface2` | `#EFE6D6` | `#2F2622` | fonds secondaires, chips inactives, skeletons |
| `--ink` | `#2B211B` | `#F3EADF` | texte principal |
| `--ink2` | `#6B5B50` | `#BDAA9B` | texte secondaire |
| `--ink3` | `#9C8B7E` | `#8A7A6E` | texte tertiaire, placeholders, désactivé |
| `--line` | `#E4D9C8` | `#3A2F29` | bordures 1 px, séparateurs |
| `--primary` | `#B2452A` | `#D9673F` | terracotta — actions principales, marque |
| `--primary-ink` | `#8E3520` | `#F0B29A` | survol du primaire, texte sur `primary-soft` |
| `--primary-soft` | `#F6E0D6` | `#3D251C` | sélection, fond de badge marque |
| `--accent` | `#E0A030` | `#E8B04A` | safran — CTA de conversion (ajouter au panier, payer) |
| `--accent-ink` | `#3A2606` | `#2A1B04` | texte sur `accent` |
| `--success` | `#2F6B3F` | `#6FB37F` | états de succès, disponible, livraison offerte |
| `--success-soft` | `#DCEBDD` | `#22352A` | fond de badge succès |
| `--warning` | `#B7791F` | `#D9A24A` | en préparation, rush, attention |
| `--warning-soft` | `#F6E9CF` | `#3A2E1A` | fond de badge attention |
| `--danger` | `#A93226` | `#E3705F` | refus, erreur de paiement, suppression |
| `--danger-soft` | `#F5D9D5` | `#3D2320` | fond de badge erreur |
| `--info` | `#3B5B7A` | `#7FA3C4` | information neutre, allergènes, position client |
| `--info-soft` | `#DCE5EE` | `#1F2C38` | fond de badge info |
| `--scrim` | `rgba(43,33,27,.5)` | `rgba(0,0,0,.65)` | voile derrière modales / sheets |

### Couleurs — console superadmin (`Kenako Superadmin`)

Identique en logique, teintes légèrement plus sourdes : `--bg #F3EEE6`, `--surface #FCF9F4`, `--surface2 #EBE4D8`, `--ink #241D19`, `--ink2 #5F5249`, `--ink3 #948577`, `--line #DED4C4`, `--primary-soft #F4DFD5`, `--success-soft #DBEADC`, `--warning-soft #F5E8CE`, `--danger-soft #F4D8D4`, `--info-soft #DBE4ED`, `--scrim rgba(36,29,25,.55)`. Sombre : `--bg #171310`, `--surface #211B17`, `--surface2 #2B231E`, `--ink #F1E8DD`, `--ink2 #B8A697`, `--ink3 #85756A`, `--line #352C26`.

### Ombres

- `--shadow` : `0 1px 2px rgba(80,50,30,.06), 0 8px 24px -12px rgba(80,50,30,.25)` (superadmin : `0 1px 2px rgba(70,45,25,.05), 0 5px 14px -8px rgba(70,45,25,.2)`)
- `--shadow-lg` : `0 2px 4px rgba(80,50,30,.06), 0 24px 48px -16px rgba(80,50,30,.35)`
- Sombre : `0 1px 2px rgba(0,0,0,.3), 0 8px 24px -12px rgba(0,0,0,.6)` / `0 2px 4px rgba(0,0,0,.3), 0 24px 48px -16px rgba(0,0,0,.7)`
- Jamais de bordure dure là où une ombre chaude suffit.

### Typographie

- **Titres, noms de restaurants et de plats** : `Newsreader` (Google Fonts), poids 400/500/600 — utilisée en 500 partout, `letter-spacing: -.01em` à `-.02em` sur les grandes tailles.
- **Interface et données** : `Instrument Sans` (Google Fonts), poids 400/500/600/700.
- **Chiffres, prix, identifiants, horaires** : `ui-monospace, monospace`.
- Import : `https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=Instrument+Sans:wght@400;500;600;700&display=swap`

Échelle (client) : display `clamp(30px,4.5vw,52px)`/1.05 · titre section `clamp(24px,3vw,32px)` · titre de carte 21–22px · nom de plat 19px · corps 17px/1.5 · corps secondaire 15px/1.5 · légende 13px/1.4 · étiquette 12px capitales `letter-spacing:.12em` + `font-weight:600`.

Échelle (back-office / console) : base `14px` (superadmin `13.5px`) · titres de section 18–22px Newsreader · en-têtes de tableau 10.5–11px capitales `letter-spacing:.07em` `font-weight:700` · cellules 12.5–13px · KPI 28–32px Newsreader.

Corps de texte long : `text-wrap: pretty`.

### Espacement

Échelle : **4 / 8 / 12 / 16 / 24 / 32 / 48**. Gouttières de grille 12–20px. Padding de carte 14–20px (client) / 14–18px (back-office). Padding de page `clamp(16px,4vw,32px)` (client) / `clamp(14px,2.5vw,24px)` (back-office).

Layout systématiquement en `display:flex` / `display:grid` + `gap` — jamais d'espacement par marges entre frères.

### Rayons

`8px` chips/petits badges · `12px` boutons, champs, petites cartes · `14–16px` cartes · `20–24px` modales et bottom-sheets · `50%` pastilles et avatars.

### Transitions & animations

- Durées **150–250 ms** (`transition:all .15s` à `.25s`), easing par défaut ou `ease-out`.
- `drawIn` : `opacity 0→1` + `translateY(6–8px)→0`, 200 ms — apparition de blocs.
- `sheetIn` : `translateY(40px)→0` + fade, 280 ms — bottom-sheet, carte flottante.
- `pop` : `scale(.4)→1.12→1`, 250–500 ms `cubic-bezier(.2,.9,.3,1.3)` — modale desktop, coche de succès.
- `toastIn` : `translate(-50%,16–20px)→0` + fade, 250 ms.
- `slideIn` : `translateX(24px)→0` + fade, 250 ms — panneau latéral droit (back-office, console).
- `pulse` : halo `box-shadow 0→12px` transparent, 1,6–2 s en boucle — étape de suivi en cours, attente de validation.
- `shimmer` : `background-position 200%→-200%`, 1,6 s en boucle — skeletons.
- `ring` : rotation ±12°, 1 s en boucle — cloche de nouvelle commande.
- `spin` : 0,8 s linéaire infinie — spinners de chargement.

### Règles transverses

- **Cibles tactiles ≥ 44 px** partout (48–60 px pour les CTA principaux).
- **Accessibilité** : contraste AA minimum ; focus visible (`outline:3px solid var(--accent)`, `outline-offset:2px`) ; **jamais la couleur seule** — chaque statut combine couleur + icône + texte.
- **Mobile d'abord** : toute modale devient bottom-sheet sous 900 px (poignée 40×4px, rayon 24px en haut, action principale en bas atteignable au pouce).
- Breakpoint principal : **900 px** (`matchMedia('(min-width:900px)')` côté client, `(max-width:899px)` côté back-office).

---

## Planche 00 — Design System (`Kenako Design System.dc.html`)

Planche de référence à consulter avant d'implémenter : palette (10 pastilles), échelle typographique, échelle d'espacement + rayons, **boutons dans tous leurs états** (primaire, CTA safran, secondaire, discret/danger, icône, stepper quantité — colonnes défaut / survol / actif / focus / désactivé / chargement), champs de formulaire (défaut, focus, erreur, valide, désactivé, select, radio, checkbox avec supplément, interrupteur), badges de statut (Reçue, Acceptée, En préparation, Prête, En livraison, Livrée, Refusée, Fermé + badges plat), cartes (restaurant, plat, plat en rupture), tableaux, modale / bottom-sheet / 4 toasts, états vides et skeletons.

Prop tweakable : `theme` (`light` | `dark`).

---

## Bloc A — Espace client (`Kenako Client.dc.html`)

**Principe UX directeur :** commander doit prendre **moins de 60 secondes et moins de 5 taps** depuis la fiche restaurant. **Aucune étape n'exige un compte.** Le compte est proposé **après** la commande, comme récompense (« vous auriez gagné 45 points »), jamais comme barrière.

Navigation interne : un state `screen` (`home` | `map` | `restaurant` | `checkout` | `confirm` | `tracking` | `account` | `table`) + pile `history` pour le retour. Un sélecteur d'écrans flottant en bas à droite (« ▤ Écrans ») liste A1→A10 pour la démonstration — **à ne pas porter en production** (prop `showScreenNav`).

### A1 — Accueil / découverte
- **Layout** : colonne `max-width:1200px`, `gap:22px`, padding bas 110px (barre de nav mobile). Header 64px : logotype Newsreader 28px, nav desktop (Découvrir / Carte / Commandes / Compte, boutons 40px rayon 10px), bouton thème 44px rond.
- **Titre** : `clamp(30px,4.5vw,52px)` Newsreader 500, « Qu'est-ce qui vous ferait plaisir ce midi ? », max 640px.
- **Recherche** : champ 52px rayon 14px sur `--surface` + bordure `--line` + `--shadow`, icône `⌕`, input 16px, bouton de géolocalisation intégré (`◎ Rue Keller` / `◎ Paris 11e`) 40px rayon 10px sur `--surface2`. À droite, bascule **Liste ↔ Carte** : conteneur 52px rayon 14px `--surface2`, onglet actif en `--surface` + ombre.
- **Filtres** : rangée scrollable horizontale (`overflow-x:auto`, `scrollbar-width:none`), pastilles 40px rayon 20px ; actif = fond `--ink`, texte `--bg`. 10 filtres : Ouvert maintenant, Livraison, À emporter, Sur place, 4,5 ★ et +, < 30 min, € budget, Promotions, Végétarien, Halal.
- **Sections éditoriales** (carrousels `scroll-snap-type:x mandatory`, cartes `flex:0 0 min(300px,80vw)`) : « Autour de vous » (tri distance), « Nouveaux sur Kenako », « En promotion », « Les mieux notés » (≥ 4,6 ★). Une recherche ou un filtre actif remplace tout par une section « Résultats ».
- **Carte restaurant** : rayon 16px, image `aspect-ratio:16/10` avec dégradé `rgba(0,0,0,0) 45% → rgba(0,0,0,.55)`, badge promo en haut à gauche (`--accent`, 26px, rayon 6px), badge statut en haut à droite (fond blanc 94 %, `● Ouvert` vert / `◌ Fermé` gris), puis nom (Newsreader 21px) + note `4,7 ★ (312)`, cuisine + budget `€€`, ligne `0,4 km · 25–35 min · Livraison offerte` (vert si gratuite). Survol : `translateY(-3px)` + `--shadow-lg`. Restaurant fermé : `filter:grayscale(.9)`.
- **Géolocalisation refusée** : bandeau `--warning-soft` avec pastille `!`, texte « Localisation refusée. On vous montre Paris 11e par défaut… » + bouton OK.

### A2 — Vue carte (Leaflet)
- **Mobile** : carte plein écran sous une barre 64px (retour, recherche, bascule Liste/Carte). **Desktop (≥ 900px)** : split-view — liste 420px scrollable à gauche, carte à droite, **surbrillance croisée** (survol d'une carte → marqueur agrandi `scale(1.12)` et passé en `--ink` ; clic sur un marqueur → carte flottante + `panTo`).
- **Marqueurs personnalisés** (`L.divIcon`) : pastille terracotta `#B2452A` rayon 14px, note à l'intérieur (`4,7 ★`), petit triangle sous la pastille ; gris `#8A7A6E` + « Fermé » si fermé ; `#2B211B` en surbrillance.
- **Clustering** : `leaflet.markercluster`, `maxClusterRadius:60`, pastille ronde 44px terracotta bordée `#FDF9F2` avec le compte.
- **Position utilisateur** : point bleu `--info` 20px, bordure blanche 3px, halo `0 0 0 6px rgba(59,91,122,.25)`.
- **Boutons flottants** : « ↻ Rechercher dans cette zone » centré en haut (40px, fond `--ink`, `z-index:500`) ; « ◎ » recentrer en bas à droite (48px rond, remonte à 150px quand la carte flottante est ouverte).
- **Carte flottante** : en bas, `max-width:520px`, rayon 16px, vignette 96px, nom, cuisine + note, distance/ETA/frais, « Voir le menu → », bouton de fermeture 32px. Animation `sheetIn`.
- Fonds de tuiles : `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` (mode sombre : `dark_all`), attribution « © OpenStreetMap · © CARTO ».

### A3 — Fiche restaurant
- **En-tête immersif** : hauteur `clamp(250px,34vw,380px)`, photo de couverture + double dégradé, boutons ronds 44px translucides (retour, favori `♥/♡`, partager). En bas : logo 72px rayon 16px (initiale Newsreader 30px), nom `clamp(28px,4vw,44px)` avec `text-shadow`, ligne note + nb d'avis + cuisine + horaires du jour.
- **Bandeau fermé** : `--surface2`, pastille `◌`, « Restaurant fermé. Fermé · ouvre demain à 11h30. Vous pouvez consulter le menu… ».
- **Badges** : halal, végétarien, végan, sans gluten, fait maison, livraison offerte dès X € (28px, `--surface` + bordure) + badge fidélité (`--success-soft`, ex. `★ 1 € = 1 pt`, `◉ Carte à tampons`, `↺ 5 % en cagnotte`).
- **Onglets** : Menu · Infos · Avis · Événements (48px, soulignement 2px `--primary`).
- **Menu** : barre de catégories **collante** (`position:sticky;top:0;z-index:20`) en pastilles 36px liées par ancres `#cat-N` (`scroll-margin-top:70px`). Grille de plats `repeat(auto-fill,minmax(min(100%,340px),1fr))`, `gap:14px`. Carte de plat : badges (★ Populaire / ✦ Nouveau / Végétarien / 🌶 Épicé / En rupture), nom Newsreader 19px, description 13px, ligne allergènes 11px `--ink3`, prix monospace 15px, bouton `+` 36px rond `--primary`. Plat en rupture : `opacity:.55`, nom barré, photo `grayscale(1)`, bouton gris `–`, clic → toast d'avertissement (pas d'ajout).
- **Infos** : 4 cartes — Adresse & horaires (semaine détaillée, lien d'appel), Commande (modes activés, minimum, zone, ETA), **Paiement accepté** (uniquement ce que le restaurant a activé + « Le paiement va directement au restaurant »), Fidélité (fond `--primary-soft`, taux + récompense + parrainage).
- **Avis** : bloc note moyenne (Newsreader 56px + 5 étoiles safran + « n avis vérifiés · commandes réelles ») puis cartes d'avis (avatar initiales, date, étoiles, texte 15px/1.55).
- **Événements** : cartes 16/8 avec date en surimpression, titre, description, jauge et bouton « Réserver · 35,00 € ».
- **Barre de panier flottante** : `position:fixed;bottom:16px`, 60px, `max-width:560px`, `--primary`, compteur dans un carré translucide 32px, « Voir le panier », total monospace. Visible dès qu'un article est au panier (écrans A3 et A9).

### A4 — Personnalisation d'un plat
- **Desktop** : modale centrée `min(520px,92vw)`, `max-height:min(720px,90vh)`, rayon 24px, animation `pop`. **Mobile** : bottom-sheet plein largeur, rayon 24px en haut, `max-height:92vh`, animation `sheetIn`, poignée 40×4px.
- **Structure** `grid-template-rows:auto 1fr auto` : en-tête photo 150px avec titre en surimpression + fermeture ; corps scrollable ; pied fixe.
- **Corps** : description + allergènes ; **Taille** (boutons 48px, obligatoire, delta de prix monospace) ; **groupe obligatoire** (ex. Cuisson — radios 48px, libellé d'aide « Obligatoire » qui passe à `✓` vert une fois choisi) ; **Suppléments** (checkboxes 48px avec `+1,50 €` à droite) ; **commentaire libre** (textarea 2 lignes, « Sans oignons, sauce à part… »).
- **Pied** : stepper quantité 52px (`−` / valeur monospace / `+`, borné 1–20) + CTA safran 52px affichant le **prix recalculé en temps réel** (`unitaire × quantité`). Tant que le choix obligatoire manque : CTA désactivé visuellement (`--surface2` / `--ink3`) et libellé « Choisissez la cuisson ».
- À l'ajout : toast `✓ <plat> ajouté au panier` avec action « Voir » → tunnel.

### A5 — Panier & tunnel de commande (3 étapes)
- **Layout** : `max-width:1100px`, deux colonnes `repeat(auto-fit,minmax(min(100%,340px),1fr))` — formulaire à gauche, **récapitulatif sticky** (`position:sticky;top:16px`) à droite. Barre de progression = 3 segments 4px (`--primary` si atteint) + ligne « Étape n sur 3 · <titre> ».
- **Étape 1 · Mode** : boutons 64px (🛵 Livraison / 🛍 À emporter / 🍽 Sur place) — **seuls les modes activés par le restaurant sont affichés**. Créneau : « Au plus vite · 25–35 min » ou « Choisir un horaire » → select (12h30 → 20h00). En livraison : pastilles d'adresses enregistrées (Maison / Bureau), champ adresse, champ complément (étage, code, interphone). **Hors zone** (regex Versailles/78/92/93/94/Boulogne/Neuilly) : bordure `--danger`, encart rouge « Adresse hors zone de livraison (3 km max) » + lien pour basculer en à emporter, bouton Continuer bloqué.
- **Étape 2 · Coordonnées** : prénom, téléphone, email (validation : prénom ≥ 2 car., téléphone ≥ 10 chiffres, email regex). Lien discret « Déjà client ? Se connecter » (lien magique). **Code promo** : `BIENVENUE10` → −10 % ; `MARIE5` → −5 € ; sinon « ✕ Code inconnu ou expiré » (bordure `--danger`). **Pourboire** optionnel : Sans / 1 € / 2 € / 5 €, mention « 100 % reversé ».
- **Étape 3 · Paiement** : la liste dépend **strictement** de `restaurant.payments` — Carte (Stripe), Espèces (« à la livraison » ou « sur place » selon le mode), PayPal, Wero, Virement. Chaque option : 60px, radio 22px, libellé + sous-titre + tag monospace (`STRIPE`, `CASH`…). Formulaire carte (numéro / MM-AA / CVC) si carte. **Échec de paiement** simulé si le numéro finit par `0002` : encart `--danger-soft` « Paiement refusé par votre banque. Aucun montant n'a été débité. » + toast. CTA safran 52px « Payer 43,50 € » avec spinner pendant 1,4 s.
- **Récapitulatif** : lignes avec stepper de quantité inline (36px), sous-total, frais de livraison (`Offerts` en vert si `fee === 0` ou sous-total ≥ 25 €), remise (vert, `−5,00 €`), pourboire, **Total** 18px gras. Avertissement `--warning` si sous-total < minimum du restaurant. Phrase de rappel du mode en bas (12px `--ink3`).
- **Panier vide** : carte centrée, pastille 🧺 64px sur `--primary-soft`, « Votre panier est vide », bouton « Voir le menu ».

### A6 — Suivi de commande (accessible sans compte, par lien)
- Bandeau `--ink` rayon 20px : « Arrivée estimée dans » + **temps restant Newsreader 44px** + bouton « ☏ Appeler le restaurant ».
- **Timeline verticale** : Reçue → Acceptée → En préparation → **En livraison / Prête** → Livrée / Récupérée (le 4e/5e libellé dépend du mode). Pastille 28px : `✓` vert si franchie, `●` terracotta + halo `pulse` si en cours, vide bordée `--line` sinon ; connecteur 2px vert/`--line` ; heure monospace à droite. Progression automatique toutes les **3,5 s** en démo.
- **Mini-carte livraison** (Leaflet, interactions désactivées) : pin restaurant `R` terracotta, pin client `⌂` bleu, tracé pointillé, **pastille livreur 🛵 verte** qui avance à chaque étape. Sous la carte : « Karim · scooter électrique » (après affectation) + adresse.
- **Récapitulatif** figé au moment du paiement (lignes, total, moyen de paiement).
- Mention d'en-tête : « Lien de suivi · sans compte ».

### A7 — Confirmation & incitation au compte
- Coche `✓` 96px sur disque `--success` + halo `0 0 0 12px var(--success-soft)`, animation `pop` 500 ms.
- Titre « Merci Camille, c'est commandé ! », numéro de commande monospace, phrase d'ETA selon le mode. Bouton primaire « Suivre ma commande ».
- **Carte d'incitation** (apparition différée 700 ms) : pastille safran avec le nombre de points, « **Vous auriez gagné 45 points** », programme du restaurant + récompense, phrase de parrainage (gain parrain / gain filleul), champ email pré-rempli + bouton `--ink` « Créer mon compte », lien discret « Plus tard ». Aucune obligation, aucun blocage.

### A8 — Compte client
Onglets : Commandes · Adresses · Favoris · **Fidélité** · Parrainage · Notifications · Paramètres.
- **Commandes** : cartes avec restaurant, badge `✓ Livrée`, contenu résumé, date + id + total, bouton « Recommander » (reconstitue le panier).
- **Adresses** : cartes label / ligne / complément + tuile pointillée « + Ajouter une adresse ».
- **Favoris** : grille de cartes restaurant 16/9.
- **Fidélité** : **une carte par restaurant**, fond dans la teinte du restaurant, texte blanc, rayon 20px, min-height 180px. Points → valeur `145 pts` + barre de progression blanche ; tampons → rangée de pastilles 28px (`✓` remplies) ; cashback → montant + barre. Phrase « Encore X pts avant 10 € offerts ». Rappel : chaque programme est indépendant et reste chez le restaurateur.
- **Parrainage** : code `KENAKO-CAM7` dans un cadre pointillé (monospace 20px) + Copier + « Partager à un ami » (safran) ; liste des gains par restaurant.
- **Notifications** : 4 interrupteurs (push, SMS, email, offres des restaurants).
- **Paramètres** : prénom, téléphone, email, bascule d'apparence, « Supprimer mon compte » en `--danger`.

### A9 — Commande à table par QR code
- Bandeau `--ink` rayon 20px : « Sur place · Le Comptoir de Marie », **« Table 12 » Newsreader 40px** (numéro pré-rempli par le QR), phrase d'accueil, boutons « 🔔 Appeler un serveur » et « Partager l'addition » (safran).
- **Partage d'addition** : panneau dépliant avec 3 options 56px (Parts égales / Par plat / Montant libre) + explication (« chaque convive scanne le QR de la table et règle sa part avec son propre moyen de paiement »).
- **Menu simplifié** : liste dense par catégorie (ligne 56px, nom Newsreader 18px, description, prix monospace, bouton `+` 40px) — pas de grande photo, lecture rapide au téléphone. Même barre de panier flottante.

### A10 — États à couvrir (tous démontrables via la prop `demoState`)
`closed` restaurant fermé · `noDelivery` zone non livrée · `emptyCart` panier vide · `noResults` aucun résultat de recherche · `outOfStock` plat en rupture ajouté au panier (toast d'avertissement, refus d'ajout) · `paymentFail` échec de paiement · `geoDenied` géolocalisation refusée. Chacun est décrit dans l'écran correspondant ci-dessus.

### Navigation mobile (A)
Barre basse fixe 72px sur `--surface`, 4 onglets (Découvrir ⌂ / Carte ◎ / Commandes ☰ / Compte ○), `padding-bottom:env(safe-area-inset-bottom)`, onglet actif en `--primary`.

### Toasts (A)
Position `fixed; bottom:96px; left:50%`. Succès : fond `--ink`, texte `--bg`, pastille verte `✓`, action optionnelle en safran. Avertissement : `--surface` + pastille `--warning`. Erreur : `--surface` + bordure `--danger` + pastille `--danger`. Durée 3,2 s.

---

## Bloc B — Espace restaurateur (`Kenako Restaurateur.dc.html`)

Ton : **sobre et dense**. Base typographique 14px, cartes 12–14px de rayon, tableaux compacts. Restaurant fil rouge : **Le Comptoir de Marie**.

**Shell** : sidebar 248px sticky (logotype, carte établissement + formule, 10 entrées de nav avec badges de compte, bouton « ▣ Mode cuisine (KDS) », liens vers les autres espaces) ; sous 900px la sidebar devient un drawer 268px + voile. **Topbar sticky** : code + titre de page, **interrupteur « J'accepte les commandes »** (vert / rouge avec pastille + halo), **bouton mode rush**, bascule de thème. Contenu `padding:18px clamp(14px,2.5vw,24px) 72px`, `gap:18px`.

### B1 — Inscription et onboarding
- **4 étapes** avec barre de progression : (1) informations de l'établissement (nom, cuisine, adresse, SIRET, téléphone, email, couverts) ; (2) **dépôt de documents** (Kbis, pièce d'identité, RIB — encadrés pointillés qui passent en `--success-soft` avec `✓` après dépôt) ; (3) **choix de formule** (3 cartes, Signature marquée « Recommandé », prix, features, état sélectionné avec bordure `--primary`) puis paiement de l'abonnement ; (4) **écran d'attente de validation** : pastille `◔` 72px `--warning-soft` en `pulse`, « Vérification en cours », abonnement actif, 3 lignes d'état (abonnement payé ✓, documents transmis ✓, vérification en cours ◔ « sous 24 h »).
- **Checklist de mise en route** (écran séparé) : 6 items cochables (logo, première catégorie, 3 plats, horaires, livraison, moyen de paiement) avec hint, barre de progression 10px, pourcentage Newsreader 28px. **Le bouton « Publier mon restaurant » ne s'active qu'à 100 %** (sinon `--surface2`/`--ink3`, `cursor:not-allowed`, note « Le bouton s'active à 100 % — n étape(s) restante(s) »). À 100 % : safran, libellé « 🎉 Publier mon restaurant », publication → toast + redirection tableau de bord.

### B2 — Tableau de bord
- **Bandeaux d'état** : mode rush actif (`--warning-soft`, « les délais annoncés passent de 25–35 à 45–60 min » + Désactiver) ; commandes en pause (`--danger-soft`, « votre fiche affiche ferme temporairement » + Réactiver).
- **4 KPI** (cartes 12px, label capitales 12px, valeur Newsreader 32px, delta coloré « vs hier ») : CA du jour, commandes, panier moyen, note moyenne.
- **Courbe de CA 30 jours** : aire `--primary-soft` + ligne `--primary` 2,5px + point terminal ; axe de dates monospace 11px ; total à droite du titre.
- **Top 5 des plats** : nom + `qté · CA` monospace, barre de part 6px `--primary`.
- **Commandes en cours** : 5 lignes cliquables (badge de statut, id monospace, client + résumé, total) + « Tout voir → ».
- **Alertes** : cartes avec liseré gauche 3px et pastille — impayé d'abonnement (`--danger`), plats en rupture (`--warning`), avis négatif à traiter (`--info`), chacune avec une action qui navigue vers l'écran concerné.
- **Interrupteur « accepter les commandes »** et **mode rush** vivent dans la topbar (visibles depuis tous les écrans).

### B3 — Gestion des commandes
- **Kanban 5 colonnes** (`repeat(auto-fit,minmax(min(100%,260px),1fr))`) : Nouvelles ● / Acceptées ✓ / En préparation ◔ / Prêtes ✓ / En livraison →. Colonnes `--surface2` rayon 14px, en-tête avec icône colorée + compteur, message « Glissez une commande ici » si vide.
- **Cartes de commande** : `draggable`, liseré gauche coloré selon l'urgence (vert < 15 min, `--warning` 15–25, `--danger` > 25), id monospace + minutes écoulées, client, mode + résumé, moyen de paiement + total. Sur les nouvelles : boutons **Accepter** (vert) / **Refuser**. Sur les autres : bouton d'avancement (« Passer en préparation », « Marquer prête », « Confier au livreur » / « Marquer récupérée » selon le mode, « Marquer livrée »).
- **Drag & drop** : `onDragStart` sur la carte, `onDragOver`/`onDrop` sur la colonne → changement de statut + toast.
- **Nouvelle commande** : bandeau `--primary` avec cloche animée `ring`, « n nouvelle(s) commande(s) · son activé » + bouton « Vu ». Bouton de démonstration « + Simuler une commande ».
- **Panneau latéral de détail** (droite 460px sur desktop, bottom-sheet mobile) : badge de statut, id, mode + heure + ancienneté ; **contenu** (quantité en terracotta, nom, options, prix de ligne) et total avec moyen de paiement ; **note du client** sur fond `--warning-soft` ; **coordonnées** (téléphone cliquable, adresse, complément) + **mini-carte Leaflet** si livraison ; **réglage du temps de préparation** (10 / 20 / 30 / 45 min) ; **refus avec motif obligatoire** (Plat indisponible, Trop de commandes, Adresse hors zone, Fermeture imprévue → confirmation, toast « client prévenu, aucun débit ») ; pied avec Accepter · <n> min / avancement + « 🖶 Imprimer le ticket ».
- **Vue KDS plein écran** (`screen: kds`) : fond `#14100E`, texte `#F7F2EA`, en-tête « Cuisine · n tickets actifs · heure » + état rush + « Quitter le mode cuisine ». Tickets `minmax(320px,1fr)` sur `#1F1A16`, bordure haute 6px selon l'urgence, id monospace 20px, **minuteur Newsreader 34px coloré**, lignes d'articles 18px (quantité safran) + options 14px, note sur `#3A2E1A`, bouton d'action 56px (Commencer / Terminé / Remis). Contraste élevé, grosses cibles.

### B4 — Menu & catalogue
- **Colonne catégories** (max 320px) : items 48px `draggable` avec poignée `⠿`, nom + « n plats · tous disponibles / n en rupture », état sélectionné `--primary-soft`. **Réordonnancement par glisser-déposer** (état persistant + toast). Boutons « + Nouvelle catégorie », « ⬆ Importer un menu (CSV) », « ⬇ Exporter ».
- **Liste de plats** : cartes 14px avec vignette 72px, nom Newsreader 18px + prix monospace + tags, description, ligne méta (`⏱ disponibilité horaire`, `⚠ allergènes`, `⚙ n groupes d'options`), puis actions : **bascule rupture en un clic** (vert `✓ Disponible` ↔ rouge `✕ En rupture`, applique `opacity:.6`, nom barré, photo en niveaux de gris), ✎ modifier, ⧉ dupliquer, 🗑 supprimer (38px chacun).
- **Référentiel des 14 allergènes UE** affiché en pastilles : Gluten, Crustacés, Œufs, Poisson, Arachides, Soja, Lait, Fruits à coque, Céleri, Moutarde, Sésame, Sulfites, Lupin, Mollusques. Régimes : végétarien, végan, halal, sans gluten. Variantes et groupes d'options avec règles min/max/obligatoire ; disponibilité horaire (ex. « Midi uniquement ») ; menus/formules composées.

### B5 — Livraison
- **3 tuiles de mode** (Retrait au restaurant / Livraison / Sur place) : bordure 2px `--primary` + fond `--surface` si activé, sinon transparent ; état « ✓ Activé » / « ◌ Désactivé ».
- **Carte Leaflet 380px** avec **zones en polygones** (`L.polygon`, `weight:2`, `fillOpacity:.18` → `.42` au survol, tooltip), pin restaurant `C` `--ink`, **cercle de rayon maximal 4 km** en pointillés. Bouton « ✎ Dessiner une zone » + mention « Rayon maximal 4 km · 3 zones actives ».
- **Cartes de zone** (liseré gauche 4px de la couleur de la zone) : nom, ETA monospace, règle (« Frais fixe 2,00 € · minimum 15 € · franco dès 25 € », « Frais 3,50 € · minimum 20 € », « 1,20 €/km · minimum 25 € · rayon 4 km »), boutons Modifier les règles / Supprimer. Survol croisé carte ↔ liste.
- **Livreurs internes** (badge safran « Formule Signature ») : lignes avatar + nom + créneau + course, badge d'état (Disponible ✓ vert / En course → terracotta / Hors service ◌), bouton « Attribuer la course K-48219 ».

### B6 — Paiements & finances
- **Encart `--info-soft` en tête** : « Kenako ne touche jamais l'argent de vos commandes : chaque paiement client arrive directement sur votre compte. Nous ne facturons que votre abonnement mensuel. » — **à conserver mot pour mot**.
- **Moyens de paiement acceptés** : 5 cartes (Carte via Stripe, Espèces, PayPal, Wero, Virement) avec interrupteur 44×26px, description, état (« Compte connecté » / « Aucune configuration » / « À connecter » / « Désactivé »). Le réglage se reflète immédiatement côté client (A3 Infos et A5 étape 3).
- **Encaissements** : tableau Date / Canal / Cmd / Encaissé (montants monospace) + « ⬇ Export comptable ».
- **Abonnement** : formule en cours + prix, prochain prélèvement, badge `✕ Impayé`, boutons « Régler 79,00 € maintenant » (safran) et « Changer de formule ». **Factures** : liste id monospace / date / montant / badge payé-impayé.

### B7 — Marketing (4 onglets)
- **Codes promo** : tableau Code (monospace) / Avantage / Conditions / Validité / Usage (`84 / 500`) / Statut cliquable (Actif ✓ / Inactif ◌). Types couverts : pourcentage, montant fixe, livraison offerte, premier achat, plafonds, dates, usage limité.
- **Fidélité & parrainage** : choix du **type** (★ Points / ◉ Tampons / ↺ Cashback — tuiles 64px), **taux** et **seuil** en sliders (`accent-color:var(--primary)`) avec valeur monospace, et **aperçu côté client** en direct sur `--primary-soft` (ex. « 1 € dépensé = 1 point. À 100 points, votre client reçoit 10 € offerts chez vous. »). Parrainage : gain parrain / gain filleul + 3 chiffres (parrainages, 1res commandes générées, CA attribué). **Bannière promotionnelle** sur la fiche avec aperçu 88px + Modifier.
- **Campagnes** : 3 cartes de segments (Tous 612 / Inactifs 30 j 148 / Gros paniers 74) + tableau Campagne / Canal (Email, SMS, Push) / Segment / Envoi / Ouvertures / Clics.
- **Réseaux sociaux** : bascule **Post 1:1 ↔ Story 9:16**, sélection du sujet (plat ou promo), **aperçu du visuel généré** (300px carré ou 220px 9/16, dégradé + nom du restaurant en capitales, titre Newsreader 30px, accroche, badge safran), **légende pré-remplie éditable** (textarea 6 lignes avec hashtags), boutons « Partager maintenant » (safran) et « ⬇ Télécharger le visuel », mention des comptes connectés et du format (1080×1080 / 1080×1920).

### B8 — Événements
Cartes 14px : visuel 110px avec date en surimpression + badge Publié/Brouillon, titre Newsreader 19px, mode (Billetterie / Réservation) + prix (« Entrée libre » si 0), **jauge** (`12 / 24` + barre verte), boutons Modifier / Publier-Dépublier. Mention : « Les événements publiés apparaissent dans l'onglet Événements de votre fiche client. »

### B9 — Réservations & tables
- **Liste du jour** : heure monospace, nom, « n couverts · table X · note », badge Confirmée ✓ / En attente ◔. Bouton « + Manuelle ».
- **Plan de salle simplifié** : grille `minmax(74px,1fr)`, tables carrées à `border-radius:50%` (≤ 4 places) ou 12px (6 places), numéro Newsreader 20px, places, état Libre (vert) / Réservée (terracotta + fond `--primary-soft`), compteur « n libres / total ».
- **QR codes par table** : aperçu de QR (grille 7×7 de carrés `--ink`), explication (« le client scanne, la table est pré-remplie, il commande depuis son téléphone »), boutons « 🖶 Imprimer les 8 QR » et « Régénérer » (toast d'avertissement : les anciens sont invalidés).

### B10 — Clients & avis
- **Base clients** : recherche + export ; tableau Client / Commandes / **Valeur cumulée** / **Points** / Dernière / Segment (badge Fidèle, Gros panier, Inactif 30 j).
- **Avis** : cartes avec liseré coloré selon la note (≤ 2 `--danger`, ≥ 4 `--success`), avatar initiales, date, étoiles, texte ; **réponse publique** existante affichée sur `--bg` avec liseré `--primary` et libellé « VOTRE RÉPONSE PUBLIQUE » ; sinon textarea + « Publier la réponse » + « ⚑ Signaler » (validation : réponse vide refusée par toast).

### B11 — Paramètres
- **Fiche établissement** : nom, téléphone, adresse, description publique (textarea) ; **personnalisation de la page** : 4 pastilles de couleur d'accent 34px (bordure `--ink` sur la sélection).
- **Horaires** : 7 lignes jour / créneaux monospace / interrupteur ; « + Fermeture exceptionnelle » → encart `--warning-soft` (« 24 et 25 décembre »). Créneaux multiples par jour.
- **Comptes staff & rôles** : avatar, nom, email, badge de rôle (Gérante, Cuisine, Service, Livreur), dernière activité, « + Inviter ».
- **Notifications** : 4 interrupteurs (nouvelle commande, alerte sonore répétée jusqu'à acceptation, nouveaux avis, rapport hebdomadaire).

---

## Bloc C — Espace superadmin (`Kenako Superadmin.dc.html`)

Interface **plus dense et plus sobre**, orientée données. Base 13.5px. Sidebar 236px sticky : identité « Kenako · CONSOLE PLATEFORME », carte utilisateur (Sonia Berger, Superadmin), 7 entrées de nav avec badges (compte à valider, impayés, tickets ouverts), encart permanent `--info-soft` « **Aucune commission** — Kenako ne perçoit que les abonnements. Les paiements clients vont aux restaurateurs. » Topbar : code + titre, **recherche globale** (restaurant, SIRET, ticket — saisir bascule sur C2), bascule de thème.

### C1 — Tableau de bord plateforme
- **6 KPI** : MRR (18 470 €, +7,1 %), restaurants actifs (214, +17 ce mois), en attente (à valider), suspendus (impayés), conversion des essais (61 %), churn mensuel (2,4 %).
- **Courbe de MRR sur 12 mois** (aire + ligne + point terminal) avec croissance annuelle.
- **Répartition par formule** : 3 barres (Essentiel 96 / Signature 92 / Maison 26) avec MRR par formule, couleurs `--info` / `--primary` / `--accent` ; puis 3 chiffres (conversion, churn, inscrits du mois).
- **Carte de répartition géographique** (Leaflet France, zoom 5.4, `scrollWheelZoom` désactivé) : `circleMarker` terracotta dont le rayon suit `√(nb restaurants)`, tooltip « ville · n restaurants · MRR ».
- **Villes couvertes** : lignes nom + barre de part + nombre + MRR.
- **À traiter maintenant** : 3 raccourcis (comptes à valider, impayés avec montant, avis signalés) qui naviguent vers l'écran et pré-filtrent.
- **Encart de rappel légal** : « 18 420 commandes traitées sur 30 jours — indicateur d'usage de la plateforme uniquement. Kenako n'encaisse aucune de ces commandes et ne peut ni les modifier ni les annuler. »

### C2 — Gestion des restaurateurs
- **Filtres de statut** (Tous / Actifs / En attente / Suspendus) + export CSV.
- **Tableau triable** (clic sur l'en-tête → `▲/▼`) : Restaurant (nom + gérant · cuisine), Ville, Formule, **Statut** (actif ✓ vert / en attente ◔ ambre / suspendu ◌ rouge / refusé ✕), **Paiement** (à jour ✓ / relance 2 ! / impayé ✕), Commandes, Note. Ligne cliquable → fiche. Compteur « n restaurateur(s) affiché(s) sur 10 ».
- **Fiche détaillée** (panneau droit 470px / bottom-sheet mobile) : badges statut + paiement, nom, gérant · cuisine · ville ; 4 tuiles (formule, inscrit depuis, commandes, note) ; contact & légal (email, téléphone, SIRET monospace) ; **documents déposés** — vignette PDF 44×56, nom, date, état (validé ✓ / à vérifier ◔ / illisible ✕ / expiré ✕), bouton **Visionner**, et boutons **Valider / Refuser** par document tant qu'il n'est pas tranché ; **refus de compte avec motif obligatoire** (Documents illisibles, SIRET non vérifiable, Établissement hors zone couverte, Activité non éligible) ; historique d'activité.
- **Actions de pied** : Valider le compte / Refuser (si en attente), Suspendre (si actif), Réactiver (si suspendu), **Se connecter en tant que** (impersonation — toast « action tracée au journal d'audit »), Envoyer un message. Mention : « Toute action est inscrite au journal d'audit. **Aucune action sur les commandes n'est possible.** »

### C3 — Abonnements & facturation
- **Les trois formules** : cartes avec liseré haut coloré, nom, nb d'abonnés, prix mensuel Newsreader 30px + prix annuel, fonctionnalités incluses (✓ verts), **limites** (« 1 établissement · 50 plats », « plats illimités », « 5 établissements »), MRR de la formule. Bouton « Modifier la grille ».
- **Promotions sur l'abonnement** : lignes nom + cible + période, **code monospace encadré**, nb d'utilisations, badge Active/Terminée cliquable. Exemples : `LANCEMENT3M` (3 mois offerts), `SIGNATURE50` (−50 % la 1re année), `CCI-PARIS` (code partenaire), `ETE30` (terminée).
- **Impayés & relances** : total en attente en badge rouge ; par ligne : restaurant, facture monospace, montant, badge d'étape (Relance 1 / Relance 2 / Suspendu), « n j de retard · prochaine action » (relance automatique, suspension, résiliation) + bouton Relancer.
- **Moyens de paiement de l'abonnement uniquement** : 5 interrupteurs (Carte Stripe, Virement/SEPA, PayPal, Wero, Espèces en agence) avec la note explicite « Ces réglages ne concernent que la facturation Kenako. Les moyens de paiement des commandes sont configurés par chaque restaurateur. »

### C4 — CMS du frontend public
- **Hero** : titre, sous-titre (textarea), libellé de CTA, remplacement du visuel (bouton pointillé) + bouton **Publier**.
- **Blocs de mise en avant** : 4 interrupteurs (Zéro commission, Commander en 60 secondes, Fidélité par restaurant, Blog & actualités).
- **Restaurants mis en avant** : 4 pastilles supprimables + « + Ajouter ».
- **Aperçu public en direct** : fausse fenêtre de navigateur (3 pastilles + `kenako.fr`), hero 230px avec dégradé et le texte saisi, CTA safran, puis les blocs actifs en tuiles — l'aperçu se met à jour à la frappe.
- **Pages du site** : nom, chemin monospace, date de mise à jour, badge publiée/brouillon — dont « Devenir partenaire », « Grille tarifaire », mentions légales, CGU/CGV, RGPD, blog/SEO.

### C5 — Mise en avant & acquisition
- **Boosts payants** : tableau Restaurant / Emplacement (tête de recherche, bandeau carte, section « Nouveaux ») / Période / Tarif / Statut (en cours ✓, programmé ◔, terminé ◌), recette du mois dans le sous-titre, bouton « + Nouveau boost ».
- **Catégories de cuisine** : 12 pastilles supprimables + ajout.
- **Villes couvertes** : interrupteurs par ville avec « n restaurants actifs » ou « Ville non ouverte » (toast « ouverte / fermée à la recherche »).

### C6 — Supervision (lecture seule)
- **Bandeau `--warning-soft` bordé `--warning`, pastille 🔒** : « **Vue en lecture seule.** Aucune action n'est possible sur les commandes ni sur les clients : seul le restaurateur peut accepter, modifier ou annuler une commande. Kenako n'intervient jamais dans les transactions. » — **obligatoire, à conserver**.
- Filtres : select restaurant + pastilles de mode (Tous / Livraison / À emporter / Sur place).
- **Tableau de toutes les commandes de la plateforme** : id monospace, restaurant, client, mode, statut (badge), montant, heure. **Aucune colonne d'action, aucun bouton** ; note de pied « consultation uniquement, aucun bouton d'action n'est proposé ».

### C7 — Support & modération (4 onglets)
- **Tickets** : tableau id / sujet / émetteur / priorité (haute rouge, normale neutre, basse bleue) / âge / statut (ouvert ● → en cours ◔ → résolu ✓, cliquer fait avancer).
- **Avis signalés** : cartes liseré `--danger` avec auteur, restaurant, date, étoiles, badge de motif (⚑ Propos haineux, Avis suspect), texte, actions **Supprimer l'avis** / **Conserver** / **Contacter l'auteur**.
- **Journal d'audit** : lignes avatar initiales + action + auteur + horodatage monospace, export CSV. Exemples : validations, suspensions, **impersonation tracée**, relances automatiques, création de promo.
- **Administrateurs** : nom, email, badge de rôle (Superadmin, Support, Facturation, Modération), dernière activité, « + Inviter ». Note de rôles : « Aucun rôle ne permet d'agir sur une commande. »

---

## Interactions & Behavior (transverse)

- **Navigation** : un `screen` par espace + pile d'historique pour le retour ; en production, préférer un routeur (routes suggérées : `/`, `/carte`, `/r/:slug`, `/commander`, `/commande/:id`, `/compte`, `/table/:code` ; `/pro/...` ; `/admin/...`).
- **Survol** : cartes `translateY(-2px→-3px)` + passage en `--shadow-lg` ; boutons primaires `background:var(--primary-ink)` + `translateY(-1px)` ; actif `scale(.98)`.
- **Drag & drop** : commandes entre colonnes du kanban (B3), catégories de menu (B4). HTML5 DnD dans le prototype ; utiliser la lib du codebase (dnd-kit, vuedraggable…) et conserver le retour visuel (poignée `⠿`, `cursor:grab`, toast de confirmation).
- **Chargement** : spinner 16px (bordure 2px, `spin .8s`) dans le bouton ; skeletons `shimmer` pour les listes.
- **Validation de formulaire** : bouton suivant désactivé visuellement + toast explicatif au clic sur une action bloquée (jamais d'échec silencieux). Motifs obligatoires pour tout refus (commande, document, compte).
- **Toasts** : une seule notification à la fois, 3–3,2 s, avec action optionnelle.
- **Responsive** : sous 900px — sidebars en drawers, modales en bottom-sheets, panneaux latéraux en sheets, tableaux `overflow:auto` avec `min-width`, grilles en une colonne, barre de nav basse côté client.
- **Thème sombre** : `document.body.dataset.theme = 'light' | 'dark'` ; les fonds de carte Leaflet changent aussi (`voyager` ↔ `dark_all`). Prévoir la persistance (localStorage) et `prefers-color-scheme` en production.

## State Management

**Client (A)** : `screen`, `history`, `theme`, `isDesktop`, `query`, `filters[]`, `geoDenied`, `address`, `addressDetail`, `restId`, `tab`, `fav{}`, sheet de personnalisation (`sheet`, `sheetSize`, `sheetReq`, `sheetExtras[]`, `sheetQty`, `sheetNote`), `cart[]` (`key`, `dishId`, `name`, `unit`, `qty`, `opts`), `step`, `mode`, `asap`, `slot`, coordonnées (`firstName`, `phone`, `email`), `promo`/`promoApplied`, `tip`, `payment`, `cardNumber`, `payError`, `paying`, `trackStep`, `accTab`, `tableNo`, `split`, `notifs{}`, `toast`, `selected`/`hoverId` (carte).

**Restaurateur (B)** : `screen`, `accepting`, `rush`, `orders[]` (statut mutable), `panelId`, `prep`, `refuseOpen`/`refuseReason`, `signupStep`, `docsUploaded[]`, `plan`, `checklist[]`, `catId`, `catOrderIds[]`, `stock{}`, `mkTab`, `loyaltyType`/`loyaltyRate`/`loyaltyThreshold`, `socialFormat`/`socialSubject`/`socialCaption`, `promoState{}`, `eventState{}`, `replies{}`/`drafts{}`, `hoursOff{}`, `svcModes{}`, `payOn{}`, `notifs{}`, `accent`, `toast`.

**Superadmin (C)** : `screen`, `globalQuery`, `statusFilter`, `sortKey`/`sortDir`, `detailId`, `rejectOpen`/`rejectReason`, `accountState{}` (statut par restaurateur), `docState{}` (état par document), `subPromoState{}`, `payState{}`, `blockState{}`, `cityState{}`, `featuredList[]`, `cuisineList[]`, `hero{}`, `supMode`/`supResto`, `supportTab`, `ticketState{}`, `flaggedState{}`, `toast`.

**Données à charger côté serveur** : restaurants (+ menus, options, horaires, zones, moyens de paiement, programmes de fidélité et de parrainage), commandes (temps réel : websocket ou SSE pour le kanban et le suivi client), clients, avis, réservations, événements, promos, campagnes, abonnements et factures, tickets, journal d'audit. Le suivi de commande et le KDS supposent un flux temps réel ; le prototype simule avec des timers (3,5 s par étape).

## Assets

- **Polices** : Newsreader et Instrument Sans via Google Fonts (à self-hoster en production).
- **Cartes** : Leaflet 1.9.4 + leaflet.markercluster 1.5.3 ; tuiles CARTO (`rastertiles/voyager`, `dark_all`) — vérifier la licence / prévoir un compte MapTiler ou MapLibre en production.
- **Photos** : aucune image réelle. Tous les visuels sont des placeholders générés en CSS (dégradés rayés 135° dans la teinte du restaurant + libellé monospace). À remplacer par les photos fournies par les restaurateurs (upload + recadrage aux ratios indiqués).
- **Icônes** : caractères Unicode dans le prototype (`⌕ ◎ ✓ ✕ ◔ ● → ⠿ ⚑ 🔒 🛵 🛍 🍽 🔔 🖶 ⬆ ⬇`). **À remplacer par un jeu d'icônes vectorielles** (Lucide, Phosphor…) en gardant la même sémantique. Les emojis de mode (🛵🛍🍽) et de statut peuvent devenir des icônes de la lib choisie.
- **QR codes** : maquette CSS (grille 7×7). Générer de vrais QR (par table, URL `kenako.fr/t/<code>`).

## Files

```
design/
  Kenako Design System.dc.html   Planche 00 — tokens, composants, états
  Kenako Client.dc.html          Bloc A — A1 → A10 (10 écrans + états)
  Kenako Restaurateur.dc.html    Bloc B — B1 → B11 + KDS plein écran
  Kenako Superadmin.dc.html      Bloc C — C1 → C7
  kenako-data.js                 Données client (restaurants, menus, options, avis, événements…)
  kenako-resto-data.js           Données back-office (commandes, catalogue, zones, finances, marketing…)
  kenako-admin-data.js           Données plateforme (MRR, restaurateurs, formules, CMS, boosts, support…)
  support.js                     Runtime du prototype — NE PAS PORTER
brief-original.md                Brief fonctionnel d'origine (blocs A/B/C, contraintes)
```

Pour ouvrir les prototypes : servir le dossier `design/` en HTTP (`python3 -m http.server`) et ouvrir chaque `.dc.html` — ils se lient entre eux par liens relatifs. Le sélecteur « ▤ Écrans » (bloc A) et l'entrée « Revoir l'inscription » (bloc B) permettent d'atteindre tous les écrans, y compris les états d'erreur.

## Contraintes à respecter absolument (rappel)

1. La plateforme ne touche jamais l'argent des commandes ; **aucun** écran ne suggère commission ou reversement. Le superadmin ne peut ni modifier ni annuler une commande (C6 en lecture seule, bandeau explicite).
2. Chaque restaurateur configure indépendamment ses moyens de paiement, sa livraison, sa fidélité et son parrainage — **ces réglages se reflètent visiblement côté client** (A3 Infos, A5 étape 1 et 3, A7 points de fidélité, A8 cartes de fidélité).
3. Commander **sans compte** doit être possible de bout en bout, suivi inclus (lien de suivi).
4. Mobile d'abord : cibles ≥ 44px, actions principales atteignables au pouce, modales → bottom-sheets.
5. Accessibilité : contraste AA, focus visible, jamais la couleur seule (couleur + icône + texte).
6. Mode sombre pour l'espace client et l'espace restaurateur.
