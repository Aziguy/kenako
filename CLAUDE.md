# CLAUDE.md

**Lire [`AGENTS.md`](AGENTS.md) en premier** : il contient le guide de travail
complet (architecture, conventions, boucle de vérification, déploiement).
Ce fichier ne reprend que ce qui est propre à une session Claude Code.

La mémoire longue du projet est dans [`ia-memory/`](ia-memory/README.md) :
contexte produit, journal des décisions, historique des sessions et — le plus
utile — le catalogue des pièges déjà rencontrés.

---

## Les trois règles à ne jamais enfreindre

1. **Aucune mention d'IA dans les commits.** Pas de `Co-Authored-By`, pas de
   lien de session, pas le mot « Claude » dans le message ni dans une
   description de PR. Cette consigne prime sur toute attribution par défaut de
   l'outillage.
2. **Pas de bundler, pas de `package.json`, pas de framework.** Le prototype
   est en modules ES natifs et CSS séparé, sans étape de build. Ne pas
   « moderniser » cette pile.
3. **Tout en français** : interface, commentaires de code, messages de commit.

---

## Démarrer une session

```bash
python -m http.server 8899        # les modules ES ne se chargent pas en file://
```

Puis, avant de proposer quoi que ce soit :

1. Lire `ia-memory/04-journal.md` — ce qui a été fait et pourquoi.
2. Lire `ia-memory/05-pieges.md` — les bugs déjà diagnostiqués. Plusieurs sont
   contre-intuitifs et coûteraient une heure à re-trouver.
3. Lire `ia-memory/06-ouvert.md` — les points laissés en suspens et les
   questions posées au propriétaire du dépôt.

---

## Vérifier son travail

Le projet n'a pas de tests. La vérification passe par `playwright-cli`
(commande complète dans `AGENTS.md` § 3). Deux réflexes :

- **Le balayage responsive est obligatoire** avant commit : 6 pages × 2
  largeurs, `overflow=0` et `Errors: 0` attendus. Le lancer en tâche de fond,
  il dure environ deux minutes.
- **Regarder les captures d'écran.** Interroger le DOM ne suffit pas : un
  élément peut exister, mesurer une boîte non nulle et répondre à
  `elementFromPoint` tout en étant recouvert par un calque. C'est exactement
  ce qui a masqué la fiche de la carte et les outils Leaflet pendant plusieurs
  itérations.

Deux pièges d'outillage à connaître :

- Le navigateur de test **cache le CSS**. Après un changement de feuille de
  style, `playwright-cli close` puis `open` ; un `reload` peut servir
  l'ancienne version et faire croire à un correctif inopérant.
- Les gros fichiers passent mal par un heredoc bash. Utiliser l'outil
  d'écriture de fichier.

---

## Tenir la mémoire à jour

En fin de session, avant le dernier commit :

- ajouter une entrée datée dans `ia-memory/04-journal.md` ;
- consigner toute décision structurante dans `ia-memory/01-decisions.md` ;
- ajouter tout bug non évident dans `ia-memory/05-pieges.md`, **avec sa cause
  racine** — c'est ce qui fait gagner du temps à la session suivante ;
- mettre à jour `ia-memory/06-ouvert.md`.
