# ia-memory — mémoire du projet Kenako

Ce dossier existe pour qu'une nouvelle session d'assistant, ou un développeur
qui reprend le dépôt, retrouve en quelques minutes le contexte, les décisions
et les pièges déjà payés.

Il ne remplace pas [`AGENTS.md`](../AGENTS.md), qui donne les **règles de
travail**. Ici on trouve le **pourquoi** et l'**historique**.

## Ordre de lecture conseillé

| Fichier | Contenu | Quand le lire |
| --- | --- | --- |
| [`00-contexte.md`](00-contexte.md) | Le produit, le modèle économique, les contraintes imposées | Première session |
| [`01-decisions.md`](01-decisions.md) | Journal des décisions structurantes, avec leurs raisons et alternatives écartées | Avant de remettre en cause un choix |
| [`02-architecture.md`](02-architecture.md) | Structure du code, conventions, cartographie des fichiers | Avant d'écrire du code |
| [`03-design-system.md`](03-design-system.md) | Palette, typographie, règles d'interface | Avant de toucher au style |
| [`04-journal.md`](04-journal.md) | Ce qui a été fait, session par session | Au démarrage de chaque session |
| [`05-pieges.md`](05-pieges.md) | Bugs rencontrés et leur cause racine | **Au démarrage, systématiquement** |
| [`06-ouvert.md`](06-ouvert.md) | Points en suspens, questions posées, backlog | Pour savoir quoi proposer |

## Entretien

Ces fichiers font partie du livrable. Les mettre à jour **avant le dernier
commit d'une session** :

- une entrée datée dans `04-journal.md` ;
- toute décision structurante dans `01-decisions.md` ;
- tout bug non évident dans `05-pieges.md`, avec sa cause racine ;
- l'état des questions ouvertes dans `06-ouvert.md`.

Écrire pour quelqu'un qui n'a aucun souvenir de la session : préférer une
phrase explicite à une note télégraphique.
