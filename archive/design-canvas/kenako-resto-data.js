// Données d'exemple Kenako — back-office restaurateur (Le Comptoir de Marie)
window.KENAKO_RESTO = {
  resto: { name: 'Le Comptoir de Marie', cuisine: 'Bistrot moderne', address: '12 rue de Charonne, 75011 Paris', siret: '892 417 336 00021', plan: 'Signature', planPrice: 79, rating: 4.7, reviews: 312, tint: '#8a3b22' },
  kpi: { revenue: 1284.5, revenuePrev: 1102, orders: 47, ordersPrev: 41, basket: 27.3, basketPrev: 26.9, rating: 4.7, ratingPrev: 4.6 },
  revenue30: [820,910,760,1040,1180,1320,980,760,880,1010,1120,1290,1410,1020,840,930,1080,1160,1240,1380,1120,890,960,1050,1190,1270,1390,1180,1020,1284],
  topDishes: [
    { name: 'Bavette d’aloyau, frites maison', qty: 128, revenue: 2432, share: 100 },
    { name: 'Parmentier de canard confit', qty: 96, revenue: 1728, share: 71 },
    { name: 'Tarte tatin, crème crue', qty: 84, revenue: 672, share: 58 },
    { name: 'Risotto aux champignons', qty: 61, revenue: 1037, share: 45 },
    { name: 'Œufs mayo revisités', qty: 54, revenue: 351, share: 38 }
  ],
  alerts: [
    { kind: 'danger', icon: '✕', title: 'Prélèvement d’abonnement refusé', text: 'Facture KEN-2026-0912 de 79,00 € · carte expirée', action: 'Mettre à jour le moyen de paiement', to: 'finances' },
    { kind: 'warning', icon: '!', title: '2 plats en rupture', text: 'Île flottante, Poisson du jour', action: 'Gérer le menu', to: 'menu' },
    { kind: 'info', icon: '★', title: 'Avis 2 ★ sans réponse', text: '« Attente de 50 min un vendredi soir » — Marc D.', action: 'Répondre', to: 'clients' }
  ],
  orders: [
    { id: 'K-48231', status: 'new', mode: 'livraison', time: '12:04', client: 'Camille R.', phone: '06 12 34 56 78', address: '27 rue Keller, 75011 Paris', detail: 'Bât. B · 3e étage · code 1408', payment: 'Carte · payé', total: 43.5, minutes: 2, items: [{ q: 1, n: 'Bavette d’aloyau', o: '300 g · Saignant · Sauce béarnaise', p: 26.5 }, { q: 1, n: 'Risotto aux champignons', o: '', p: 17 }], note: 'Merci de sonner à l’interphone B.' },
    { id: 'K-48230', status: 'new', mode: 'emporter', time: '12:02', client: 'Thomas B.', phone: '06 98 71 22 40', address: 'Retrait au comptoir', detail: '', payment: 'Espèces · à encaisser', total: 25, minutes: 4, items: [{ q: 2, n: 'Parmentier de canard', o: '', p: 18 }], note: '' },
    { id: 'K-48228', status: 'accepted', mode: 'livraison', time: '11:56', client: 'Inès M.', phone: '07 55 21 09 88', address: '4 rue Sedaine, 75011 Paris', detail: 'Interphone 12', payment: 'Carte · payé', total: 61, minutes: 10, items: [{ q: 2, n: 'Bavette d’aloyau', o: '200 g · À point', p: 19 }, { q: 3, n: 'Tarte tatin', o: '', p: 8 }], note: '' },
    { id: 'K-48226', status: 'preparing', mode: 'surplace', time: '11:48', client: 'Table 7', phone: '', address: 'Sur place · table 7', detail: '4 couverts', payment: 'Carte · payé', total: 78.5, minutes: 18, items: [{ q: 2, n: 'Velouté de butternut', o: '', p: 8 }, { q: 2, n: 'Poisson du jour', o: '', p: 22 }, { q: 1, n: 'Bavette d’aloyau', o: '200 g · Bleu', p: 19 }], note: 'Sans gluten pour un convive.' },
    { id: 'K-48224', status: 'preparing', mode: 'livraison', time: '11:44', client: 'Julien P.', phone: '06 44 12 88 03', address: '19 bd Voltaire, 75011 Paris', detail: '', payment: 'PayPal · payé', total: 34, minutes: 22, items: [{ q: 1, n: 'Terrine de campagne', o: '', p: 9 }, { q: 1, n: 'Parmentier de canard', o: '', p: 18 }, { q: 1, n: 'Mousse au chocolat', o: '', p: 7 }], note: '' },
    { id: 'K-48221', status: 'ready', mode: 'emporter', time: '11:36', client: 'Sofia L.', phone: '06 20 55 71 12', address: 'Retrait au comptoir', detail: '', payment: 'Carte · payé', total: 27, minutes: 30, items: [{ q: 1, n: 'Risotto aux champignons', o: '', p: 17 }, { q: 1, n: 'Limonade artisanale', o: '', p: 4 }, { q: 1, n: 'Mousse au chocolat', o: '', p: 7 }], note: '' },
    { id: 'K-48219', status: 'delivering', mode: 'livraison', time: '11:28', client: 'Marc D.', phone: '06 71 04 33 90', address: '8 rue Popincourt, 75011 Paris', detail: '2e gauche', payment: 'Carte · payé', total: 46, minutes: 38, items: [{ q: 2, n: 'Bavette d’aloyau', o: '200 g · Saignant', p: 19 }, { q: 1, n: 'Tarte tatin', o: '', p: 8 }], note: '', courier: 'Karim' },
    { id: 'K-48215', status: 'done', mode: 'livraison', time: '11:12', client: 'Awa K.', phone: '06 33 90 12 45', address: '2 rue Basfroi, 75011 Paris', detail: '', payment: 'Carte · payé', total: 52.5, minutes: 54, items: [{ q: 1, n: 'Poisson du jour', o: '', p: 22 }, { q: 1, n: 'Bavette d’aloyau', o: '300 g · À point', p: 25 }], note: '' }
  ],
  categories: [
    { id: 'c1', name: 'Entrées', count: 3, items: [
      { id: 'oeufs', name: 'Œufs mayo revisités', price: 6.5, desc: 'Œufs de plein air, mayonnaise au raifort, herbes fraîches.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Œufs', 'Moutarde'], schedule: 'Toute la journée' },
      { id: 'velout', name: 'Velouté de butternut', price: 8, desc: 'Butternut rôtie, noisettes torréfiées, huile de sauge.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Fruits à coque', 'Lait'], schedule: 'Toute la journée' },
      { id: 'terrine', name: 'Terrine de campagne', price: 9, desc: 'Porc fermier, pistaches, pickles d’oignon rouge.', avail: true, stock: true, tags: [], allergens: ['Gluten', 'Fruits à coque'], schedule: 'Soir uniquement' }
    ]},
    { id: 'c2', name: 'Plats', count: 4, items: [
      { id: 'bavette', name: 'Bavette d’aloyau, frites maison', price: 19, desc: 'Bœuf Limousine, échalotes confites, frites coupées à la main.', avail: true, stock: true, tags: ['Populaire'], allergens: [], schedule: 'Toute la journée', options: '2 groupes d’options' },
      { id: 'parmentier', name: 'Parmentier de canard confit', price: 18, desc: 'Canard du Sud-Ouest, purée à l’huile de noix.', avail: true, stock: true, tags: [], allergens: ['Lait', 'Fruits à coque'], schedule: 'Toute la journée' },
      { id: 'poisson', name: 'Poisson du jour, beurre blanc', price: 22, desc: 'Selon la pêche du matin, légumes de saison glacés.', avail: true, stock: false, tags: ['Nouveau'], allergens: ['Poisson', 'Lait'], schedule: 'Midi uniquement' },
      { id: 'risotto', name: 'Risotto aux champignons', price: 17, desc: 'Riz carnaroli, pleurotes et shiitakés, parmesan 24 mois.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Lait'], schedule: 'Toute la journée' }
    ]},
    { id: 'c3', name: 'Desserts', count: 3, items: [
      { id: 'tatin', name: 'Tarte tatin, crème crue', price: 8, desc: 'Pommes caramélisées au beurre demi-sel.', avail: true, stock: true, tags: ['Populaire'], allergens: ['Gluten', 'Lait'], schedule: 'Toute la journée' },
      { id: 'mousse', name: 'Mousse au chocolat noir', price: 7, desc: 'Chocolat 70 %, fleur de sel.', avail: true, stock: true, tags: ['Végétarien'], allergens: ['Œufs', 'Lait'], schedule: 'Toute la journée' },
      { id: 'ile', name: 'Île flottante', price: 7.5, desc: 'Crème anglaise vanille Bourbon, pralines roses.', avail: true, stock: false, tags: [], allergens: ['Œufs', 'Lait'], schedule: 'Toute la journée' }
    ]},
    { id: 'c4', name: 'Boissons', count: 2, items: [
      { id: 'limonade', name: 'Limonade artisanale', price: 4, desc: 'Citron de Menton, 33 cl.', avail: true, stock: true, tags: ['Végétarien'], allergens: [], schedule: 'Toute la journée' },
      { id: 'vin', name: 'Verre de rouge — Côtes du Rhône', price: 6, desc: 'Domaine Gramenon, 12 cl.', avail: true, stock: true, tags: [], allergens: ['Sulfites'], schedule: 'Toute la journée' }
    ]}
  ],
  allergens14: ['Gluten','Crustacés','Œufs','Poisson','Arachides','Soja','Lait','Fruits à coque','Céleri','Moutarde','Sésame','Sulfites','Lupin','Mollusques'],
  zones: [
    { id: 'z1', name: 'Zone 1 · Paris 11e', color: '#B2452A', rule: 'Frais fixe 2,00 € · minimum 15 € · franco dès 25 €', eta: '25–35 min', coords: [[48.860,2.368],[48.868,2.379],[48.862,2.392],[48.851,2.389],[48.847,2.374]] },
    { id: 'z2', name: 'Zone 2 · Bastille / Marais', color: '#E0A030', rule: 'Frais 3,50 € · minimum 20 €', eta: '30–45 min', coords: [[48.862,2.352],[48.869,2.360],[48.866,2.372],[48.856,2.366],[48.855,2.354]] },
    { id: 'z3', name: 'Zone 3 · au kilomètre', color: '#2F6B3F', rule: '1,20 €/km · minimum 25 € · rayon 4 km', eta: '35–50 min', coords: [[48.845,2.355],[48.853,2.350],[48.858,2.362],[48.849,2.372],[48.841,2.366]] }
  ],
  couriers: [
    { name: 'Karim T.', status: 'En course', orders: 'K-48219', shift: '11h–15h' },
    { name: 'Léa V.', status: 'Disponible', orders: '—', shift: '11h–15h' },
    { name: 'Yanis B.', status: 'Hors service', orders: '—', shift: '18h–23h' }
  ],
  payouts: [
    { date: '3 sept.', label: 'Encaissements carte (Stripe)', orders: 31, gross: 842.5, net: 842.5 },
    { date: '2 sept.', label: 'Encaissements carte (Stripe)', orders: 28, gross: 761.2, net: 761.2 },
    { date: '2 sept.', label: 'Espèces encaissées en salle', orders: 9, gross: 214, net: 214 },
    { date: '1 sept.', label: 'PayPal', orders: 6, gross: 168.4, net: 168.4 }
  ],
  invoices: [
    { id: 'KEN-2026-0912', date: '1 sept. 2026', amount: 79, status: 'impayé' },
    { id: 'KEN-2026-0811', date: '1 août 2026', amount: 79, status: 'payé' },
    { id: 'KEN-2026-0710', date: '1 juil. 2026', amount: 79, status: 'payé' },
    { id: 'KEN-2026-0609', date: '1 juin 2026', amount: 79, status: 'payé' }
  ],
  plans: [
    { name: 'Essentiel', price: 29, features: ['Boutique en ligne', 'Commandes illimitées', 'Paiement carte + espèces', '1 compte staff'], current: false },
    { name: 'Signature', price: 79, features: ['Tout Essentiel', 'Livreurs internes', 'Fidélité & parrainage', 'Campagnes email/SMS', '10 comptes staff'], current: true },
    { name: 'Maison', price: 149, features: ['Tout Signature', 'Multi-établissements', 'API & caisse', 'Support prioritaire'], current: false }
  ],
  promos: [
    { code: 'BIENVENUE10', type: '−10 %', cond: '1re commande · min 15 €', period: 'Jusqu’au 31 déc.', used: 84, cap: 500, active: true },
    { code: 'MARIE5', type: '−5 €', cond: 'Min 30 € · 1 usage/client', period: '1er–30 sept.', used: 37, cap: 200, active: true },
    { code: 'LIVRAISON0', type: 'Livraison offerte', cond: 'Min 20 €', period: 'Terminé le 31 août', used: 152, cap: 150, active: false }
  ],
  campaigns: [
    { name: 'Menu d’automne', channel: 'Email', segment: 'Tous les clients (612)', sent: '2 sept.', open: '38 %', clicks: '9 %', status: 'Envoyée' },
    { name: 'On vous a manqué ?', channel: 'SMS', segment: 'Inactifs 30 j (148)', sent: 'Programmée 6 sept.', open: '—', clicks: '—', status: 'Programmée' },
    { name: 'Soirée vins & fromages', channel: 'Push', segment: 'Gros paniers (74)', sent: '28 août', open: '52 %', clicks: '21 %', status: 'Envoyée' }
  ],
  events: [
    { title: 'Soirée accords vins & fromages', date: 'Jeu. 18 sept. · 19h30', price: 35, cap: 24, sold: 12, mode: 'Billetterie', status: 'Publié' },
    { title: 'Brunch du dimanche', date: 'Dim. 21 sept. · 11h–14h', price: 28, cap: 40, sold: 31, mode: 'Réservation', status: 'Publié' },
    { title: 'Concert jazz trio', date: 'Ven. 3 oct. · 20h', price: 0, cap: 50, sold: 0, mode: 'Réservation', status: 'Brouillon' }
  ],
  reservations: [
    { time: '12:15', name: 'Famille Duval', covers: 4, table: '7', phone: '06 12 90 44 21', status: 'Confirmée', note: 'Chaise haute' },
    { time: '12:30', name: 'Sofia Lambert', covers: 2, table: '3', phone: '06 20 55 71 12', status: 'Confirmée', note: '' },
    { time: '13:00', name: 'Julien Perret', covers: 6, table: '11', phone: '06 44 12 88 03', status: 'En attente', note: 'Anniversaire' },
    { time: '19:30', name: 'Marc Dubois', covers: 2, table: '5', phone: '06 71 04 33 90', status: 'Confirmée', note: '' },
    { time: '20:00', name: 'Awa Koné', covers: 3, table: '9', phone: '06 33 90 12 45', status: 'Confirmée', note: 'Allergie fruits à coque' }
  ],
  tables: [
    { no: '1', seats: 2, zone: 'Salle' }, { no: '2', seats: 2, zone: 'Salle' }, { no: '3', seats: 2, zone: 'Salle' },
    { no: '5', seats: 4, zone: 'Salle' }, { no: '7', seats: 4, zone: 'Salle' }, { no: '9', seats: 4, zone: 'Terrasse' },
    { no: '11', seats: 6, zone: 'Terrasse' }, { no: '12', seats: 6, zone: 'Terrasse' }
  ],
  customers: [
    { name: 'Camille Renard', orders: 14, spent: 412.5, points: 145, last: '3 sept.', tag: 'Fidèle' },
    { name: 'Marc Dubois', orders: 9, spent: 287, points: 92, last: '31 août', tag: 'Gros panier' },
    { name: 'Inès Moreau', orders: 7, spent: 231.8, points: 74, last: '28 août', tag: 'Fidèle' },
    { name: 'Julien Perret', orders: 4, spent: 118, points: 38, last: '12 août', tag: '' },
    { name: 'Sofia Lambert', orders: 3, spent: 84.5, points: 27, last: '2 août', tag: 'Inactif 30 j' },
    { name: 'Awa Koné', orders: 2, spent: 96, points: 31, last: '11 juil.', tag: 'Inactif 30 j' }
  ],
  reviews: [
    { author: 'Marc D.', date: 'il y a 2 jours', rating: 2, text: 'Attente de 50 min un vendredi soir alors que l’application annonçait 30. La bavette était froide à l’arrivée.', reply: null, flagged: false },
    { author: 'Camille R.', date: 'il y a 3 jours', rating: 5, text: 'La bavette était parfaitement saignante et les frites croustillantes même après 20 minutes de livraison.', reply: 'Merci Camille, à très vite !', flagged: false },
    { author: 'Thomas B.', date: 'il y a 1 semaine', rating: 4, text: 'Très bon parmentier, portion généreuse. Tatin un peu trop sucrée à mon goût.', reply: null, flagged: false }
  ],
  staff: [
    { name: 'Marie Lefèvre', role: 'Gérante', email: 'marie@comptoirdemarie.fr', last: 'En ligne' },
    { name: 'Hugo Marchand', role: 'Cuisine', email: 'hugo@comptoirdemarie.fr', last: 'il y a 12 min' },
    { name: 'Nour Bensalah', role: 'Service', email: 'nour@comptoirdemarie.fr', last: 'il y a 2 h' },
    { name: 'Karim Traoré', role: 'Livreur', email: 'karim@comptoirdemarie.fr', last: 'En course' }
  ],
  hours: [
    { day: 'Lundi', slots: '12:00–14:30 · 19:00–22:30', open: true },
    { day: 'Mardi', slots: '12:00–14:30 · 19:00–22:30', open: true },
    { day: 'Mercredi', slots: '12:00–14:30 · 19:00–22:30', open: true },
    { day: 'Jeudi', slots: '12:00–14:30 · 19:00–22:30', open: true },
    { day: 'Vendredi', slots: '12:00–14:30 · 19:00–23:00', open: true },
    { day: 'Samedi', slots: '12:00–15:00 · 19:00–23:00', open: true },
    { day: 'Dimanche', slots: 'Fermé', open: false }
  ],
  onboarding: [
    { id: 'logo', label: 'Ajouter votre logo', hint: 'PNG ou SVG, 512 px minimum', done: true },
    { id: 'cat', label: 'Créer votre première catégorie', hint: 'Entrées, Plats, Desserts…', done: true },
    { id: 'dishes', label: 'Ajouter 3 plats', hint: '2 sur 3 ajoutés', done: false },
    { id: 'hours', label: 'Configurer vos horaires', hint: 'Par jour, créneaux multiples', done: true },
    { id: 'delivery', label: 'Configurer la livraison', hint: 'Zones, frais, minimum', done: false },
    { id: 'payment', label: 'Activer un moyen de paiement', hint: 'Stripe, espèces, PayPal…', done: false }
  ]
};
