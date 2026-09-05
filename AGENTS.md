# AGENTS.md — guide de travail sur Kenako

Document de référence pour tout agent (Claude Code, Copilot, Cursor…) ou
développeur qui reprend ce dépôt. **À lire avant la première modification.**

La mémoire longue du projet — décisions, journal, pièges rencontrés — vit dans
[`ia-memory/`](ia-memory/README.md). Ce fichier-ci ne donne que les règles de
travail ; `ia-memory/` explique le *pourquoi*.

---

## 1. Ce qu'est le projet

Prototype cliquable d'une plateforme SaaS multi-restaurants. Cinq espaces
(vitrine, client, restaurateur, superadmin, livreur) plus une planche de design
system. Données fictives, aucun back-end.

**Modèle économique, structurant pour l'interface :** la plateforme ne prend
**aucune commission** sur les commandes. Elle facture un abonnement mensuel au
restaurateur. Chaque paiement client va directement à l'établissement.

Démo : <https://aziguy.github.io/kenako/>

---

## 2. Règles non négociables

| # | Règle | Pourquoi |
| --- | --- | --- |
| 1 | **Aucune mention d'IA dans les commits et les PR.** Pas de `Co-Authored-By`, pas de lien de session, pas le mot « Claude ». | Demande explicite du propriétaire du dépôt. |
| 2 | **Pas de bundler, pas de `package.json`, pas de framework.** Modules ES natifs chargés par le navigateur, CSS en fichiers séparés. | Le prototype doit rester ouvrable et hébergeable tel quel. Ajouter Vite ou React casserait le déploiement Pages et la lisibilité du handoff. |
| 3 | **Aucun écran ne suggère une commission** ou un reversement de la plateforme. | Contrainte produit du cahier des charges. |
| 4 | **Le superadmin ne peut ni modifier ni annuler une commande.** L'écran de supervision porte un bandeau de lecture seule. | Idem. |
| 5 | **Commander sans compte reste possible de bout en bout.** Le compte se propose *après* la commande. | Idem. |
| 6 | Interface, commentaires de code et messages de commit **en français**. | Cohérence du livrable. |
| 7 | Un statut combine toujours **couleur + icône + texte**. Jamais la couleur seule. | Accessibilité (AA). |

---

## 3. Lancer et vérifier

Pas d'étape de build. Il faut un serveur statique : les modules ES ne se
chargent pas en `file://`.

```bash
python -m http.server 8899
# http://localhost:8899
```

### Boucle de vérification attendue avant tout commit

Le projet n'a pas de tests automatisés. La vérification se fait au navigateur,
et **deux contrôles sont obligatoires** :

```bash
# 1. Erreurs console + débordement horizontal, sur toutes les pages,
#    en mobile (390) et en desktop (1440).
for w in "390 844" "1440 900"; do
  set -- $w
  npx --no-install playwright-cli resize $1 $2 >/dev/null 2>&1
  for p in index.html client.html restaurateur.html superadmin.html livreur.html design-system.html; do
    npx --no-install playwright-cli goto "http://localhost:8899/$p" >/dev/null 2>&1; sleep 1.1
    ov=$(npx --no-install playwright-cli --raw eval "(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)()" 2>&1 | head -1)
    err=$(npx --no-install playwright-cli --raw console 2>&1 | head -1 | grep -o 'Errors: [0-9]*')
    printf "%-4s %-22s overflow=%-3s %s\n" "$1" "$p" "$ov" "$err"
  done
done
```

Attendu : `overflow=0` et `Errors: 0` partout. Ce balayage prend ~2 minutes ;
le lancer en tâche de fond.

> **Un contrôle du DOM ne suffit pas.** Un élément peut exister, avoir une
> boîte non nulle et répondre à `elementFromPoint` tout en étant recouvert
> (cf. le bug Leaflet, `ia-memory/05-pieges.md`). Pour tout ce qui se
> superpose, **prendre une capture d'écran et la regarder**.

### Pièges de l'outillage

- Le navigateur de test **met le CSS en cache**. Après une modification de
  feuille de style, `playwright-cli close` puis `open` — un simple `reload`
  peut servir l'ancienne version.
- Les gros fichiers passent mal par un heredoc bash (troncature). Utiliser
  l'outil d'écriture de fichier, ou un court script Python.
- Après un déploiement, GitHub Pages sert le HTML avec un cache de 10 minutes.
  Pour vérifier le site en ligne, ajouter un paramètre anti-cache :
  `https://aziguy.github.io/kenako/?v=$(date +%s)`.

---

## 4. Architecture

```
assets/css/     tokens · base · components · layout · client · backoffice · landing
assets/js/core/ dom · store · router · format · theme · toast · sheet · icons · charts · map · shell
assets/js/data/ restaurants · menus · client · resto · admin
assets/js/{client,resto,admin,courier}/  app.js + components.js + views/
```

Détail complet dans [`ia-memory/02-architecture.md`](ia-memory/02-architecture.md).

### Conventions de code

**Une vue = un module** qui exporte `view(ctx)`, et si elle porte une carte
Leaflet, `mount(ctx)` / `unmount()`.

```js
export function view({ state }) {
  return html`<h1 class="page__title">${state.title}</h1>
    <button class="btn btn--primary" data-act="commander">Commander</button>`;
}
```

**Aucun écouteur d'événement dans les gabarits.** Un attribut `data-act`
suffit ; le `app.js` de l'espace associe ce nom à un gestionnaire dans sa
table `ACTIONS`. Les gabarits restent déclaratifs, le comportement reste
regroupé en un seul endroit.

**Le rendu conditionnel se fait avec un ternaire, jamais avec `&&`.**
Le moteur de gabarit écrit les booléens tels quels (`aria-pressed="false"`),
parce que les attributs ARIA en dépendent : `${cond && html\`…\`}` afficherait
« false » à l'écran.

**Toute grille CSS qui peut contenir un enfant large** (tableau, Kanban,
carte) doit déclarer `grid-template-columns: minmax(0, 1fr)`. Sans cela la
colonne implicite s'élargit au contenu et fait déborder la page sur mobile.

**Les données restent dans `assets/js/data/`.** Aucune vue ne code une valeur
en dur : remplacer ces modules par des appels réseau doit suffire à brancher
une vraie API.

---

## 5. Ajouter un écran

1. Créer `assets/js/<espace>/views/mon-ecran.js` exportant `view(ctx)`.
2. L'importer dans le `app.js` de l'espace et l'ajouter à `VIEWS`.
3. Ajouter la route dans `createRouter({ routes })`.
4. Si l'écran doit figurer dans la navigation, l'ajouter à `NAV_GROUPS`
   (colonne latérale) et/ou `BOTTOM_NAV` (mobile).
5. Brancher les interactions via `data-act` + entrées dans `ACTIONS`.

---

## 6. Git et déploiement

```
remote  git@github.com:Aziguy/kenako.git
branche master
```

Chaque poussée sur `master` déclenche `.github/workflows/pages.yml`, qui
publie la racine du dépôt sur GitHub Pages (~20 s). `.nojekyll` empêche Jekyll
d'ignorer les dossiers utiles.

**Format des messages de commit** : titre court en français à l'impératif ou
au nominatif, puis un corps qui explique le problème et la cause avant la
solution. Pas de bloc d'attribution final. Exemple :

```
Carte cliquable, fiche restaurant lisible et bloc de marque aligné

Carte : le clic sur un marqueur n'ouvrait aucun détail. Deux causes.
La fiche portait la classe `mobile-only`, donc invisible au-delà de 768 px, et
la sélection passait par le magasin d'état, ce qui repeignait toute
l'application et détruisait puis recréait l'instance Leaflet à chaque clic.
```

---

## 7. Avant de livrer

- [ ] Balayage responsive et console : `overflow=0`, `Errors: 0` sur 6 pages × 2 largeurs.
- [ ] Captures d'écran regardées pour tout ce qui se superpose (cartes, feuilles, barres flottantes).
- [ ] Mode sombre vérifié sur les écrans touchés.
- [ ] Aucune mention d'IA dans le message de commit.
- [ ] `ia-memory/04-journal.md` mis à jour, et `ia-memory/01-decisions.md` si une décision structurante a été prise.
