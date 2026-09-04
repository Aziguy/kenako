# Prompt pour Claude — Plateforme SaaS multi-restaurants

---

## LE PROMPT

Tu es chargé de concevoir le prototype visuel complet d'une plateforme SaaS multi-vendeurs destinée aux restaurateurs. Je veux un prototype cliquable, entièrement responsive (mobile d'abord, puis tablette et desktop), de qualité production — pas des wireframes gris.

### 1. Le produit en une phrase

Une plateforme où chaque restaurant dispose de sa propre boutique en ligne (menu, commandes, livraison, fidélité) sous une marque commune, et où les clients découvrent les restaurants autour d'eux sur une carte. La plateforme ne prend **aucune commission sur les commandes** : elle facture un abonnement mensuel au restaurateur. Chaque commande et chaque paiement va directement au restaurateur.

### 2. Les trois espaces à concevoir

- **Espace client** (public, sans compte obligatoire)
- **Espace restaurateur** (back-office de gestion de son établissement)
- **Espace superadmin** (pilotage de la plateforme et des abonnements)

### 3. Direction artistique

Crée une identité qui donne faim et qui inspire confiance à un professionnel. Évite absolument le look « template SaaS générique » : pas de dégradé violet-bleu, pas de bento grid par défaut, pas d'illustrations 3D flottantes.

- **Palette :** une teinte chaude et appétissante en couleur principale (terracotta profond, ambre brûlé ou rouge tomate désaturé), un neutre chaud pour les fonds (crème, sable, gris chaud — jamais du blanc pur), un vert forêt pour les états de succès, un accent contrasté pour les CTA. Décline la palette en mode clair et en mode sombre.
- **Typographie :** une paire assumée — une serif à caractère (style éditorial, gastronomique) pour les titres et les noms de plats, une sans-serif très lisible pour l'interface et les données. Hiérarchie franche, grands titres, généreux en interlignage.
- **Photo :** la nourriture est le héros visuel. Grandes images, ratios cohérents, coins arrondis doux, overlays de dégradé pour la lisibilité du texte.
- **Composants :** ombres subtiles et chaudes plutôt que des bordures dures, rayons de 12–16px, micro-interactions au survol et au tap, transitions de 150–250ms.
- **Ton :** chaleureux et direct côté client, sobre et dense en information côté back-office. Ce ne sont pas les mêmes utilisateurs : le back-office doit privilégier la densité et la rapidité, pas la beauté décorative.

Livre une page **Design System** en première planche : palette, typographie, échelle d'espacement, boutons (tous les états), champs de formulaire, badges de statut, cartes, tableaux, modales, toasts, états vides, états de chargement (skeletons).

### 4. Principe UX directeur

Commander doit prendre moins de 60 secondes et moins de 5 taps depuis la fiche restaurant. Aucune étape ne doit exiger la création d'un compte. Le compte se propose **après** la commande, comme une récompense (« vous auriez gagné 45 points »), jamais comme une barrière.

---

## BLOC A — ESPACE CLIENT

Conçois ces écrans, en version mobile ET desktop :

**A1. Accueil / découverte**
Barre de recherche d'adresse avec détection de position, bascule Liste ↔ Carte, filtres horizontaux scrollables (type de cuisine, ouvert maintenant, livraison / à emporter / sur place, note, temps de livraison, budget, promotions). Sections éditoriales : « Autour de vous », « Nouveaux sur la plateforme », « En promotion », « Les mieux notés ». Chaque carte restaurant montre : photo, nom, type de cuisine, note + nombre d'avis, distance, temps estimé, frais de livraison, badge de promo, statut ouvert/fermé.

**A2. Vue carte (Leaflet)**
Carte plein écran avec marqueurs personnalisés (pastille aux couleurs de la marque, prix ou note à l'intérieur), clustering quand on dézoome, carte flottante en bas qui se déplie au tap sur un marqueur, bouton « recentrer sur ma position », bouton « rechercher dans cette zone ». Sur desktop : split-view carte à droite / liste à gauche, avec surbrillance croisée au survol.

**A3. Fiche restaurant**
En-tête immersif (photo de couverture, logo, nom, note, horaires du jour, badges : halal, végétarien, livraison offerte dès X€). Onglets : Menu · Infos · Avis · Événements. Menu avec navigation par catégories collante, cartes de plats (photo, nom, description, prix, badges allergènes/épicé/nouveau/populaire, mention « rupture » grisée). Barre de panier flottante persistante en bas.

**A4. Personnalisation d'un plat**
Modale ou bottom-sheet : choix de taille, options obligatoires (radio) et suppléments (checkbox avec supplément de prix), quantité, commentaire libre, prix recalculé en temps réel, bouton d'ajout au panier.

**A5. Panier & tunnel de commande**
Un tunnel en 3 étapes maximum, avec barre de progression :
1. **Mode** — livraison / à emporter / sur place, avec créneau horaire (« au plus vite » ou choix d'horaire) et adresse.
2. **Coordonnées** — prénom, téléphone, email. Bloc « déjà client ? » discret. Champ code promo. Pourboire optionnel.
3. **Paiement** — les moyens affichés dépendent de ce que le restaurant a activé (espèces à la livraison, carte via Stripe, PayPal, Wero, virement). Récapitulatif détaillé : sous-total, frais de livraison calculés, remise, total.

**A6. Suivi de commande**
Page accessible sans compte via lien. Timeline verticale de statuts (Reçue → Acceptée → En préparation → Prête / En livraison → Livrée), mini-carte avec position du livreur si livraison, temps estimé, bouton d'appel du restaurant, récapitulatif.

**A7. Confirmation & incitation au compte**
Écran de succès avec animation discrète, puis proposition de création de compte mettant en avant les points qu'il aurait gagnés et le programme de parrainage du restaurant.

**A8. Compte client**
Commandes passées avec bouton « recommander », adresses enregistrées, favoris, **carte de fidélité par restaurant** (chaque restaurant a son propre programme : points, tampons ou cashback), code de parrainage à partager, notifications, paramètres.

**A9. Commande à table par QR code**
Écran simplifié : le numéro de table est pré-rempli, menu, panier, bouton « appeler un serveur », option de partage d'addition.

**A10. États à ne pas oublier**
Restaurant fermé, zone non livrée, panier vide, aucun résultat de recherche, plat en rupture ajouté au panier, échec de paiement, géolocalisation refusée.

---

## BLOC B — ESPACE RESTAURATEUR

**B1. Inscription et onboarding**
Formulaire multi-étapes : informations de l'établissement, dépôt de documents (SIRET, pièce d'identité, RIB), choix de formule d'abonnement, paiement de l'abonnement. Puis **écran d'attente de validation** avec statut visible. Puis un onboarding guidé en checklist : ajouter le logo, créer sa première catégorie, ajouter 3 plats, configurer les horaires, configurer la livraison, activer un moyen de paiement — avec une barre de progression et un bouton « publier mon restaurant » qui ne s'active qu'à 100 %.

**B2. Tableau de bord**
KPI du jour (chiffre d'affaires, nombre de commandes, panier moyen, note moyenne), courbe de CA sur 30 jours, top 5 des plats, commandes en cours en accès rapide, alertes (impayé d'abonnement, plats en rupture, avis négatif à traiter). Un **interrupteur « accepter les commandes »** très visible et un **mode rush** qui rallonge automatiquement les délais annoncés.

**B3. Gestion des commandes**
Vue Kanban par statut avec cartes de commande, son + badge sur nouvelle commande, détail en panneau latéral (contenu, options, commentaire client, coordonnées, mode de paiement, adresse + mini-carte), boutons Accepter / Refuser avec motif, réglage du temps de préparation, impression ticket. Prévois aussi une **vue KDS plein écran pour la cuisine** (grosses cartes, minuteurs, contraste élevé).

**B4. Menu & catalogue**
Catégories réordonnables par glisser-déposer, plats avec photo, prix, description, allergènes (les 14 de la réglementation UE), régimes (végétarien, végan, halal, sans gluten), variantes et groupes d'options avec règles (min/max, obligatoire), disponibilité horaire (ex. plat servi seulement le midi), bascule rupture de stock en un clic, menus/formules composées, duplication de plat, import/export.

**B5. Livraison**
Configuration : retrait au restaurant, livraison, sur place. Zones dessinées en polygone sur une carte Leaflet, chacune avec ses propres règles (frais fixe, frais au kilomètre, paliers, minimum de commande, franco de port au-delà d'un montant). Rayon maximal, délais moyens. Gestion des livreurs internes avec attribution des courses (formule Signature).

**B6. Paiements & finances**
Activation des moyens de paiement acceptés avec connexion des comptes (Stripe, PayPal, Wero, virement, espèces). Historique des encaissements, export comptable, page d'abonnement avec formule en cours, factures, changement de formule, moyen de paiement de l'abonnement.

**B7. Marketing**
Codes promo (pourcentage, montant fixe, livraison offerte, premier achat, conditions et plafonds, dates de validité, usage limité). **Configuration du programme de fidélité** : type (points / tampons / cashback), taux de conversion, seuils et récompenses. **Parrainage** : gain pour le parrain et le filleul. Bannières promotionnelles sur sa fiche. Campagnes email/SMS/push avec segments simples (nouveaux clients, inactifs 30 jours, gros paniers). **Partage réseaux sociaux** : génération automatique d'un visuel de plat ou de promo au format post et story, avec légende pré-remplie et bouton de partage.

**B8. Événements**
Création d'événements (soirée dégustation, brunch, concert) avec visuel, date, description, jauge, billetterie ou réservation simple.

**B9. Réservations & tables**
Liste des réservations, création manuelle, plan de salle simplifié, génération et impression des QR codes par table.

**B10. Clients & avis**
Base de clients du restaurant avec historique, valeur cumulée, solde de points. Avis avec possibilité de réponse publique et de signalement.

**B11. Paramètres**
Fiche établissement, horaires par jour avec créneaux multiples, fermetures exceptionnelles, personnalisation de la page (couleur d'accent, bannière), comptes staff et rôles (gérant, cuisine, service, livreur), notifications.

---

## BLOC C — ESPACE SUPERADMIN

Interface plus dense, plus sobre, orientée données. Sidebar de navigation, tableau de bord analytique.

**C1. Tableau de bord plateforme**
MRR, nombre de restaurants actifs / en attente / suspendus, taux de conversion des essais, churn, volume de commandes traité par la plateforme (à titre indicatif uniquement), nouveaux inscrits, carte de répartition géographique des restaurants.

**C2. Gestion des restaurateurs**
Tableau filtrable et triable. Fiche détaillée avec les documents déposés à valider (visionneuse, boutons Valider / Refuser avec motif), formule souscrite, statut de paiement, historique d'activité. Actions : valider, suspendre, réactiver, se connecter en tant que (impersonation), envoyer un message.

**C3. Abonnements & facturation**
Gestion des trois formules (nom, prix mensuel et annuel, fonctionnalités incluses, limites), création de **promotions sur l'abonnement** (ex. 3 mois offerts, -50 % la première année, code partenaire), suivi des impayés avec relances automatiques, factures, configuration des moyens de paiement acceptés **pour l'abonnement uniquement** (PayPal, Wero, virement, espèces, carte).

**C4. CMS du frontend public**
Édition de la page d'accueil publique : hero (titre, sous-titre, visuel, CTA), blocs de mise en avant, restaurants ou catégories mis en avant, bannières promotionnelles, page « Devenir partenaire » avec la grille tarifaire, pages légales, blog/SEO.

**C5. Mise en avant & acquisition**
Gestion des **boosts** : quels restaurants apparaissent en tête de recherche ou de carte, sur quelle période, à quel tarif. Gestion des catégories de cuisine et des villes couvertes.

**C6. Supervision (lecture seule)**
Vue globale des commandes et des clients de tous les restaurants, avec filtres — **en consultation uniquement, sans action possible sur les commandes**. Indique clairement cette limite dans l'interface (bandeau « vue en lecture seule »).

**C7. Support & modération**
Tickets support, modération des avis signalés, journal d'audit des actions administratives, gestion des comptes administrateurs et de leurs rôles.

---

## 5. Données d'exemple

Utilise des données françaises crédibles et cohérentes d'un écran à l'autre. Invente une dizaine de restaurants avec des identités distinctes (bistrot, pizzeria napolitaine, cantine libanaise, sushi, burger artisanal, cuisine ouest-africaine, végétarien, brasserie). Noms de plats réels, prix réalistes (8–28 €), adresses parisiennes plausibles, avis rédigés naturellement. Le restaurant fil rouge du back-office s'appelle **« Le Comptoir de Marie »**, bistrot moderne.

## 6. Contraintes à respecter absolument

- La plateforme ne touche jamais l'argent des commandes. Aucun écran ne doit suggérer une commission ou un reversement. Le superadmin ne peut ni modifier ni annuler une commande.
- Chaque restaurateur configure indépendamment ses moyens de paiement, sa livraison, sa fidélité et son parrainage. Ces réglages doivent se refléter visiblement côté client.
- Commander sans compte doit être possible de bout en bout.
- Mobile d'abord : les cibles tactiles font au moins 44px, les actions principales restent atteignables au pouce, les modales deviennent des bottom-sheets sur mobile.
- Accessibilité : contraste AA minimum, focus visible, jamais la couleur seule pour porter une information (les statuts combinent couleur + icône + texte).
- Prévois le mode sombre pour l'espace client et l'espace restaurateur.

## 7. Livrable attendu

Un prototype cliquable organisé en sections claires (Design System, Client, Restaurateur, Superadmin), avec les parcours principaux navigables : découverte → commande → suivi, inscription restaurateur → validation → première commande reçue, et validation d'un compte côté superadmin. Chaque écran présenté en version mobile et desktop.

---

## Extension possible après le premier jet

Si tu veux pousser le prototype plus loin, demande dans un second temps : application livreur (acceptation de course, navigation, preuve de livraison), tableau de bord analytique avancé pour le restaurateur (heures de pointe, rentabilité par plat, taux de refus), et parcours de renouvellement/résiliation d'abonnement.
