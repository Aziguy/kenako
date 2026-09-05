# 00 · Contexte du projet

## Le produit en une phrase

Une plateforme où chaque restaurant dispose de sa propre boutique en ligne
(menu, commandes, livraison, fidélité) sous une marque commune, et où les
clients découvrent les restaurants autour d'eux sur une carte.

## Le modèle économique, qui structure toute l'interface

**La plateforme ne prend aucune commission sur les commandes.** Elle facture un
abonnement mensuel au restaurateur (29 / 79 / 149 €). Chaque commande et chaque
paiement va directement au restaurateur, sur ses propres comptes Stripe,
PayPal ou Wero.

Ce n'est pas un détail de communication : c'est une contrainte de conception.
Aucun écran ne doit laisser entendre un prélèvement, un reversement ou une
séquestration de fonds. Le seul flux financier que la plateforme touche est
l'abonnement, traité dans l'espace superadmin.

## Ce qui existe

Un **prototype cliquable**, sans back-end, avec des données fictives mais
cohérentes d'un écran à l'autre. Ce n'est pas une application en production :
c'est un livrable de conception destiné à être montré, testé et repris par une
équipe de développement.

Six pages, cinq espaces :

| Espace | Fichier | Rôle |
| --- | --- | --- |
| Vitrine | `index.html` | Page marketing publique, point d'entrée, grille tarifaire |
| Client | `client.html` | Découverte, carte, fiche restaurant, panier, commande, suivi, compte, QR de table |
| Restaurateur | `restaurateur.html` | Tableau de bord, Kanban, écran cuisine, carte, livraison, marketing, finances, analytique |
| Superadmin | `superadmin.html` | MRR, validation des dossiers, abonnements, CMS, mise en avant, supervision, modération |
| Livreur | `livreur.html` | Acceptation de course, navigation, preuve de livraison |
| Design system | `design-system.html` | Palette, typographie, composants et tous leurs états |

## Contraintes imposées par le cahier des charges

Le brief d'origine est conservé dans [`../docs/brief-original.md`](../docs/brief-original.md).
Les points à ne jamais perdre de vue :

1. Aucun écran ne suggère une commission ou un reversement de la plateforme.
2. Le superadmin ne peut ni modifier ni annuler une commande. La supervision
   porte un bandeau de lecture seule explicite.
3. Chaque restaurateur configure **indépendamment** ses moyens de paiement, sa
   livraison, sa fidélité et son parrainage. Ces réglages doivent se refléter
   visiblement côté client — ce n'est pas de la décoration, c'est le cœur de la
   promesse produit.
4. Commander sans compte est possible de bout en bout. Le compte se propose
   **après** la commande, comme une récompense (« vous auriez gagné 45 points »),
   jamais comme une barrière.
5. Mobile d'abord : cibles tactiles de 44 px minimum, actions principales
   atteignables au pouce, modales devenant des bottom-sheets sous 768 px.
6. Accessibilité : contraste AA, focus visible, jamais la couleur seule pour
   porter une information (les statuts combinent couleur + icône + texte).
7. Mode sombre sur tous les espaces.
8. Objectif UX directeur : commander doit prendre moins de 60 secondes et moins
   de 5 taps depuis la fiche restaurant.

## Données de démonstration

Dix restaurants parisiens aux identités distinctes (bistrot, pizzeria
napolitaine, cantine libanaise, sushi, burger, ouest-africain, végétarien,
brasserie, vietnamien, mexicain). Prix réalistes de 8 à 28 €, adresses
plausibles, avis rédigés naturellement.

Le restaurant fil rouge du back-office est **Le Comptoir de Marie**, bistrot
moderne du 11ᵉ arrondissement, tenu par Marie Lefèvre.

Tout vit dans `assets/js/data/`. Remplacer ces modules par des appels réseau
suffit à brancher le prototype sur une vraie API.

## Le propriétaire du dépôt

Compte GitHub `Aziguy`. Deux préférences exprimées explicitement :

- **aucune mention d'IA dans les messages de commit** ni dans les PR ;
- livrable en français.
