// Données d'exemple Kenako — espace superadmin (pilotage plateforme)
window.KENAKO_ADMIN = {
  kpi: { mrr: 18470, mrrPrev: 17240, active: 214, pending: 9, suspended: 6, trialConv: 61, churn: 2.4, orders30: 18420, signups: 17 },
  mrr12: [9800,10600,11250,12100,12800,13600,14350,15200,15900,16700,17240,18470],
  cities: [
    { name: 'Paris', restos: 118, lat: 48.8566, lng: 2.3522, mrr: 9820 },
    { name: 'Lyon', restos: 34, lat: 45.7640, lng: 4.8357, mrr: 2870 },
    { name: 'Marseille', restos: 21, lat: 43.2965, lng: 5.3698, mrr: 1690 },
    { name: 'Bordeaux', restos: 16, lat: 44.8378, lng: -0.5792, mrr: 1340 },
    { name: 'Lille', restos: 12, lat: 50.6292, lng: 3.0573, mrr: 980 },
    { name: 'Nantes', restos: 9, lat: 47.2184, lng: -1.5536, mrr: 720 },
    { name: 'Toulouse', restos: 4, lat: 43.6047, lng: 1.4442, mrr: 310 }
  ],
  restaurateurs: [
    { id: 'r1', name: 'Le Comptoir de Marie', owner: 'Marie Lefèvre', city: 'Paris 11e', cuisine: 'Bistrot moderne', plan: 'Signature', status: 'actif', payment: 'impayé', since: 'mai 2026', orders: 1284, rating: 4.7, email: 'marie@comptoirdemarie.fr', phone: '01 43 55 12 08', siret: '892 417 336 00021', docs: [{ name: 'Extrait Kbis', date: '3 mai 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '3 mai 2026', state: 'validé' }, { name: 'RIB', date: '3 mai 2026', state: 'validé' }] },
    { id: 'r2', name: 'Napoli Segreta', owner: 'Gennaro Russo', city: 'Paris 10e', cuisine: 'Pizzeria napolitaine', plan: 'Signature', status: 'actif', payment: 'à jour', since: 'févr. 2026', orders: 2410, rating: 4.8, email: 'gennaro@napolisegreta.fr', phone: '01 42 08 77 31', siret: '803 552 118 00014', docs: [{ name: 'Extrait Kbis', date: '12 févr. 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '12 févr. 2026', state: 'validé' }, { name: 'RIB', date: '12 févr. 2026', state: 'validé' }] },
    { id: 'r3', name: 'Sushi Hanabi', owner: 'Kenji Arai', city: 'Paris 2e', cuisine: 'Japonais', plan: 'Essentiel', status: 'en attente', payment: 'à jour', since: '2 sept. 2026', orders: 0, rating: 0, email: 'kenji@sushihanabi.fr', phone: '01 40 26 55 09', siret: '921 744 605 00028', docs: [{ name: 'Extrait Kbis', date: '2 sept. 2026', state: 'à vérifier' }, { name: 'Pièce d’identité', date: '2 sept. 2026', state: 'à vérifier' }, { name: 'RIB', date: '2 sept. 2026', state: 'à vérifier' }] },
    { id: 'r4', name: 'Chez Awa', owner: 'Awa Diallo', city: 'Paris 18e', cuisine: 'Ouest-africain', plan: 'Essentiel', status: 'en attente', payment: 'à jour', since: '3 sept. 2026', orders: 0, rating: 0, email: 'awa@chezawa.fr', phone: '01 42 62 18 44', siret: '944 210 887 00019', docs: [{ name: 'Extrait Kbis', date: '3 sept. 2026', state: 'à vérifier' }, { name: 'Pièce d’identité', date: '3 sept. 2026', state: 'illisible' }, { name: 'RIB', date: '3 sept. 2026', state: 'à vérifier' }] },
    { id: 'r5', name: 'Beyrouth Cantine', owner: 'Rami Haddad', city: 'Paris 9e', cuisine: 'Libanais', plan: 'Signature', status: 'actif', payment: 'à jour', since: 'mars 2026', orders: 1642, rating: 4.6, email: 'rami@beyrouthcantine.fr', phone: '01 47 70 12 66', siret: '811 903 227 00013', docs: [{ name: 'Extrait Kbis', date: '8 mars 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '8 mars 2026', state: 'validé' }, { name: 'RIB', date: '8 mars 2026', state: 'validé' }] },
    { id: 'r6', name: 'Maison Burger', owner: 'Léo Chastain', city: 'Paris 11e', cuisine: 'Burger artisanal', plan: 'Maison', status: 'actif', payment: 'à jour', since: 'janv. 2026', orders: 5218, rating: 4.4, email: 'leo@maisonburger.fr', phone: '01 43 38 90 15', siret: '790 118 442 00037', docs: [{ name: 'Extrait Kbis', date: '9 janv. 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '9 janv. 2026', state: 'validé' }, { name: 'RIB', date: '9 janv. 2026', state: 'validé' }] },
    { id: 'r7', name: 'Racines', owner: 'Claire Bonnet', city: 'Paris 3e', cuisine: 'Végétarien', plan: 'Essentiel', status: 'actif', payment: 'relance 2', since: 'juin 2026', orders: 486, rating: 4.6, email: 'claire@racines-paris.fr', phone: '01 44 61 05 22', siret: '901 336 774 00025', docs: [{ name: 'Extrait Kbis', date: '14 juin 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '14 juin 2026', state: 'validé' }, { name: 'RIB', date: '14 juin 2026', state: 'validé' }] },
    { id: 'r8', name: 'Phở Bắc', owner: 'Linh Tran', city: 'Paris 13e', cuisine: 'Vietnamien', plan: 'Essentiel', status: 'suspendu', payment: 'impayé', since: 'avr. 2026', orders: 912, rating: 4.7, email: 'linh@phobac.fr', phone: '01 45 82 33 71', siret: '854 007 991 00021', docs: [{ name: 'Extrait Kbis', date: '2 avr. 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '2 avr. 2026', state: 'validé' }, { name: 'RIB', date: '2 avr. 2026', state: 'expiré' }] },
    { id: 'r9', name: 'Bonita Taquería', owner: 'Diego Márquez', city: 'Paris 10e', cuisine: 'Mexicain', plan: 'Signature', status: 'actif', payment: 'à jour', since: 'juil. 2026', orders: 704, rating: 4.5, email: 'diego@bonitataqueria.fr', phone: '01 42 41 77 08', siret: '917 552 640 00016', docs: [{ name: 'Extrait Kbis', date: '5 juil. 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '5 juil. 2026', state: 'validé' }, { name: 'RIB', date: '5 juil. 2026', state: 'validé' }] },
    { id: 'r10', name: 'Brasserie Voltaire', owner: 'Hugo Marchand', city: 'Paris 11e', cuisine: 'Brasserie', plan: 'Maison', status: 'actif', payment: 'à jour', since: 'févr. 2026', orders: 3140, rating: 4.3, email: 'hugo@brasserievoltaire.fr', phone: '01 43 55 88 04', siret: '788 224 013 00042', docs: [{ name: 'Extrait Kbis', date: '20 févr. 2026', state: 'validé' }, { name: 'Pièce d’identité', date: '20 févr. 2026', state: 'validé' }, { name: 'RIB', date: '20 févr. 2026', state: 'validé' }] }
  ],
  plans: [
    { name: 'Essentiel', monthly: 29, yearly: 290, subs: 96, features: ['Boutique en ligne', 'Commandes illimitées', 'Carte + espèces', '1 compte staff'], limits: '1 établissement · 50 plats' },
    { name: 'Signature', monthly: 79, yearly: 790, subs: 92, features: ['Tout Essentiel', 'Livreurs internes', 'Fidélité & parrainage', 'Campagnes email/SMS', '10 comptes staff'], limits: '1 établissement · plats illimités' },
    { name: 'Maison', monthly: 149, yearly: 1490, subs: 26, features: ['Tout Signature', 'Multi-établissements', 'API & caisse', 'Support prioritaire'], limits: '5 établissements · illimité' }
  ],
  subPromos: [
    { name: '3 mois offerts', target: 'Nouveaux inscrits', code: 'LANCEMENT3M', period: '1er sept. – 31 oct.', used: 34, status: 'active' },
    { name: '−50 % la 1re année', target: 'Formule Signature', code: 'SIGNATURE50', period: '1er juin – 31 déc.', used: 61, status: 'active' },
    { name: 'Code partenaire CCI Paris', target: 'Adhérents CCI', code: 'CCI-PARIS', period: 'Sans fin', used: 12, status: 'active' },
    { name: 'Été 2026 · −30 %', target: 'Tous', code: 'ETE30', period: '1er juil. – 31 août', used: 88, status: 'terminée' }
  ],
  unpaid: [
    { resto: 'Le Comptoir de Marie', invoice: 'KEN-2026-0912', amount: 79, days: 3, stage: 'Relance 1 envoyée', next: 'Relance 2 le 8 sept.' },
    { resto: 'Racines', invoice: 'KEN-2026-0908', amount: 29, days: 11, stage: 'Relance 2 envoyée', next: 'Suspension le 10 sept.' },
    { resto: 'Phở Bắc', invoice: 'KEN-2026-0805', amount: 29, days: 34, stage: 'Suspendu', next: 'Résiliation le 15 sept.' }
  ],
  subPayMethods: [
    { id: 'card', label: 'Carte bancaire (Stripe)', on: true, note: 'Prélèvement automatique le 1er du mois' },
    { id: 'sepa', label: 'Virement / SEPA', on: true, note: 'Confirmation manuelle sous 48 h' },
    { id: 'paypal', label: 'PayPal', on: true, note: 'Abonnement récurrent' },
    { id: 'wero', label: 'Wero', on: false, note: 'Intégration en test' },
    { id: 'cash', label: 'Espèces (agence)', on: false, note: 'Encaissement en agence uniquement' }
  ],
  cms: {
    hero: { title: 'Les bonnes tables de votre quartier, sans commission', subtitle: 'Commandez directement auprès de restaurants indépendants. Ce que vous payez leur revient.', cta: 'Découvrir les restaurants', visual: 'Photo · table dressée en terrasse' },
    blocks: [
      { title: 'Zéro commission', text: 'Les restaurants gardent 100 % de vos commandes.', on: true },
      { title: 'Commandez en 60 secondes', text: 'Sans compte, sans friction.', on: true },
      { title: 'Fidélité par restaurant', text: 'Chaque adresse récompense ses habitués à sa façon.', on: true },
      { title: 'Blog & actualités', text: 'Portraits de restaurateurs, nouvelles adresses.', on: false }
    ],
    featured: ['Le Comptoir de Marie', 'Napoli Segreta', 'Chez Awa', 'Racines'],
    pages: [
      { name: 'Devenir partenaire', path: '/partenaire', updated: '28 août', status: 'publiée' },
      { name: 'Grille tarifaire', path: '/tarifs', updated: '28 août', status: 'publiée' },
      { name: 'Mentions légales', path: '/mentions-legales', updated: '4 juin', status: 'publiée' },
      { name: 'CGU / CGV', path: '/conditions', updated: '4 juin', status: 'publiée' },
      { name: 'Confidentialité (RGPD)', path: '/confidentialite', updated: '4 juin', status: 'publiée' },
      { name: 'Blog · Portrait de Marie', path: '/blog/portrait-marie', updated: '1er sept.', status: 'brouillon' }
    ]
  },
  boosts: [
    { resto: 'Napoli Segreta', slot: 'Tête de recherche · Paris 10e', period: '1er – 14 sept.', price: 120, status: 'en cours' },
    { resto: 'Maison Burger', slot: 'Bandeau carte · Paris 11e', period: '1er – 30 sept.', price: 180, status: 'en cours' },
    { resto: 'Bonita Taquería', slot: 'Tête de recherche · Paris 10e', period: '15 – 30 sept.', price: 120, status: 'programmé' },
    { resto: 'Racines', slot: 'Section « Nouveaux »', period: '20 – 31 août', price: 80, status: 'terminé' }
  ],
  cuisineCats: ['Bistrot', 'Pizzeria', 'Libanais', 'Japonais', 'Burger', 'Ouest-africain', 'Végétarien', 'Brasserie', 'Vietnamien', 'Mexicain', 'Indien', 'Coréen'],
  coveredCities: [
    { name: 'Paris', restos: 118, on: true }, { name: 'Lyon', restos: 34, on: true }, { name: 'Marseille', restos: 21, on: true },
    { name: 'Bordeaux', restos: 16, on: true }, { name: 'Lille', restos: 12, on: true }, { name: 'Nantes', restos: 9, on: true },
    { name: 'Toulouse', restos: 4, on: true }, { name: 'Strasbourg', restos: 0, on: false }, { name: 'Rennes', restos: 0, on: false }
  ],
  platformOrders: [
    { id: 'K-48231', resto: 'Le Comptoir de Marie', client: 'Camille R.', mode: 'Livraison', status: 'En préparation', total: 43.5, time: '12:04' },
    { id: 'K-48229', resto: 'Napoli Segreta', client: 'Sarah T.', mode: 'À emporter', status: 'Prête', total: 31, time: '12:03' },
    { id: 'K-48226', resto: 'Le Comptoir de Marie', client: 'Table 7', mode: 'Sur place', status: 'En préparation', total: 78.5, time: '11:48' },
    { id: 'K-48222', resto: 'Maison Burger', client: 'Nabil K.', mode: 'Livraison', status: 'En livraison', total: 28.9, time: '11:41' },
    { id: 'K-48218', resto: 'Beyrouth Cantine', client: 'Élise F.', mode: 'Livraison', status: 'Livrée', total: 52.4, time: '11:22' },
    { id: 'K-48214', resto: 'Brasserie Voltaire', client: 'Paul M.', mode: 'Sur place', status: 'Livrée', total: 96, time: '11:05' }
  ],
  tickets: [
    { id: 'T-1042', subject: 'Stripe non connecté après validation', from: 'Sushi Hanabi', prio: 'haute', age: '2 h', status: 'ouvert' },
    { id: 'T-1041', subject: 'Demande de changement de formule', from: 'Racines', prio: 'normale', age: '5 h', status: 'ouvert' },
    { id: 'T-1039', subject: 'QR codes de table illisibles à l’impression', from: 'Brasserie Voltaire', prio: 'normale', age: '1 j', status: 'en cours' },
    { id: 'T-1035', subject: 'Client réclame un remboursement', from: 'Maison Burger', prio: 'haute', age: '2 j', status: 'en cours' },
    { id: 'T-1028', subject: 'Export comptable incomplet', from: 'Napoli Segreta', prio: 'basse', age: '4 j', status: 'résolu' }
  ],
  flaggedReviews: [
    { author: 'Anonyme', resto: 'Maison Burger', rating: 1, text: 'Texte injurieux envers le personnel, signalé par le restaurateur.', reason: 'Propos haineux', date: 'il y a 6 h' },
    { author: 'J. Martin', resto: 'Napoli Segreta', rating: 1, text: 'Avis déposé alors qu’aucune commande n’est rattachée à ce compte.', reason: 'Avis suspect', date: 'il y a 1 j' }
  ],
  audit: [
    { who: 'Sonia (superadmin)', what: 'Validation du compte Beyrouth Cantine', when: 'Aujourd’hui 10:42' },
    { who: 'Sonia (superadmin)', what: 'Suspension de Phở Bắc (impayé 34 j)', when: 'Hier 17:08' },
    { who: 'Thibault (support)', what: 'Connexion en tant que Maison Burger (ticket T-1035)', when: 'Hier 15:21' },
    { who: 'Système', what: 'Relance 2 envoyée à Racines', when: 'Hier 06:00' },
    { who: 'Sonia (superadmin)', what: 'Création de la promo LANCEMENT3M', when: '1er sept. 09:14' }
  ],
  admins: [
    { name: 'Sonia Berger', role: 'Superadmin', email: 'sonia@kenako.fr', last: 'En ligne' },
    { name: 'Thibault Rey', role: 'Support', email: 'thibault@kenako.fr', last: 'il y a 20 min' },
    { name: 'Nadia Cherif', role: 'Facturation', email: 'nadia@kenako.fr', last: 'il y a 3 h' },
    { name: 'Marc Oliveira', role: 'Modération', email: 'marc@kenako.fr', last: 'hier' }
  ]
};
